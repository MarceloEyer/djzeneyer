<?php
/**
 * Zen BIT Cache Manager.
 *
 * Owns event cache with stale-while-revalidate, anti-stampede locking,
 * context-specific TTLs, persistent fallback data, and health/status.
 */

namespace ZenBit;

if (!defined('ABSPATH')) {
    exit;
}

class Zen_BIT_Cache
{
    const NORMALIZER_VERSION = 'v2';
    const LOCK_TTL = 30;
    const APCU_PREFIX = 'zen_bit_l1_';

    // =========================================================================
    // TTLs
    // =========================================================================

    public static function ttl_upcoming(): int
    {
        $v = (int) get_option('zen_bit_ttl_upcoming', 21600);
        return max(300, $v);
    }

    public static function ttl_detail(): int
    {
        $v = (int) get_option('zen_bit_ttl_detail', 86400);
        return max(300, $v);
    }

    public static function ttl_past(): int
    {
        $v = (int) get_option('zen_bit_ttl_past', 604800);
        return max(3600, $v);
    }

    // =========================================================================
    // Cache keys
    // =========================================================================

    /**
     * Generate a versioned transient key.
     *
     * @param array $params Relevant parameters: artist_id, mode, days, date, limit, lang.
     * @return string Maximum 172 chars for WordPress transient compatibility.
     */
    public static function make_key(array $params): string
    {
        $artist_id = (string) get_option('zen_bit_artist_id', '15619775');
        ksort($params);
        $hash = substr(sha1($artist_id . '|' . self::NORMALIZER_VERSION . '|' . serialize($params)), 0, 16);
        return 'zen_bit_' . $hash;
    }

    public static function make_lock_key(string $cache_key): string
    {
        return $cache_key . '_lock';
    }

    public static function make_fallback_key(string $cache_key): string
    {
        return $cache_key . '_fb';
    }

    // =========================================================================
    // APCu L1
    // =========================================================================

    public static function apcu_available(): bool
    {
        static $available = null; if ($available === null) $available = \function_exists('apcu_enabled') && \apcu_enabled();
        return $available; /* ⚡ Bolt: Cached function_exists and APCU check to prevent redundant evaluations */
    }

    private static function apcu_key(string $key): string
    {
        return self::APCU_PREFIX . $key;
    }

    private static function apcu_get(string $key)
    {
        if (!self::apcu_available() || !\function_exists('apcu_fetch')) {
            return false;
        }

        $success = false;
        $value = \apcu_fetch(self::apcu_key($key), $success);

        return $success ? $value : false;
    }

    private static function apcu_set(string $key, $value, int $ttl): void
    {
        if (!self::apcu_available() || !\function_exists('apcu_store')) {
            return;
        }

        \apcu_store(self::apcu_key($key), $value, $ttl);
    }

    private static function apcu_delete(string $key): void
    {
        if (!self::apcu_available() || !\function_exists('apcu_delete')) {
            return;
        }

        \apcu_delete(self::apcu_key($key));
    }

    private static function apcu_clear_prefix(): void
    {
        if (!self::apcu_available() || !\class_exists('\APCUIterator') || !\function_exists('apcu_delete')) {
            return;
        }

        \apcu_delete(new \APCUIterator('/^' . \preg_quote(self::APCU_PREFIX, '/') . '/'));
    }

    // =========================================================================
    // SWR - Stale-While-Revalidate
    // =========================================================================

    /**
     * Read cache or execute $fn() with SWR.
     *
     * @param string   $key Transient key.
     * @param callable $fn  Fetch/normalize callback. Must return an array.
     * @param int      $ttl Cache TTL in seconds.
     * @return array{data:array, cache_status:string, fetch_ms:int}
     */
    public static function get_with_swr(string $key, callable $fn, int $ttl): array
    {
        $l1_cached = self::apcu_get($key);

        if ($l1_cached !== false && is_array($l1_cached)) {
            return [
                'data' => $l1_cached,
                'cache_status' => 'hit',
                'fetch_ms' => 0,
            ];
        }

        $cached = get_transient($key);

        if ($cached !== false && is_array($cached)) {
            self::apcu_set($key, $cached, $ttl);

            return [
                'data' => $cached,
                'cache_status' => 'hit',
                'fetch_ms' => 0,
            ];
        }

        $lock_key = self::make_lock_key($key);
        $fallback_key = self::make_fallback_key($key);

        if (get_transient($lock_key)) {
            $stale = get_option($fallback_key, []);
            return [
                'data' => is_array($stale) ? $stale : [],
                'cache_status' => 'stale',
                'fetch_ms' => 0,
            ];
        }

        set_transient($lock_key, true, self::LOCK_TTL);

        $t0 = microtime(true);
        try {
            $fresh = $fn();
        } catch (\Throwable $e) {
            $fresh = null;
            error_log('[Zen BIT Cache] Exception in fetch callback: ' . $e->getMessage());
        }
        $fetch_ms = (int) round((microtime(true) - $t0) * 1000);

        delete_transient($lock_key);

        if (!is_array($fresh) || empty($fresh)) {
            $stale = get_option($fallback_key, []);
            self::health_update(false, $fetch_ms, 'Fetch returned empty data or exception', count(is_array($stale) ? $stale : []), 0);
            return [
                'data' => is_array($stale) ? $stale : [],
                'cache_status' => 'stale',
                'fetch_ms' => $fetch_ms,
            ];
        }

        set_transient($key, $fresh, $ttl);
        self::apcu_set($key, $fresh, $ttl);
        update_option($fallback_key, $fresh, false);

        $bytes = strlen(maybe_serialize($fresh));
        self::health_update(true, $fetch_ms, '', count($fresh), $bytes);

        return [
            'data' => $fresh,
            'cache_status' => 'miss',
            'fetch_ms' => $fetch_ms,
        ];
    }

    // =========================================================================
    // Invalidation
    // =========================================================================

    /**
     * Remove transient and APCu entries for one cache key.
     */
    public static function clear(string $key): void
    {
        delete_transient($key);
        delete_transient(self::make_lock_key($key));
        self::apcu_delete($key);
        self::apcu_delete(self::make_lock_key($key));
    }

    /**
     * Remove all Zen BIT transients and APCu L1 entries.
     *
     * Persistent fallback options are intentionally preserved.
     */
    public static function clear_all(): void
    {
        global $wpdb;

        self::apcu_clear_prefix();

        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
                '_transient_zen_bit_%',
                '_transient_timeout_zen_bit_%'
            )
        );
    }

    // =========================================================================
    // Health / status
    // =========================================================================

    private static function health_option(): string
    {
        return 'zen_bit_health';
    }

    public static function health_update(bool $ok, int $fetch_ms, string $error, int $count, int $bytes): void
    {
        $health = self::health_get();
        if ($ok) {
            $health['last_fetch_ok_at'] = current_time('timestamp');
            $health['last_fetch_ms'] = $fetch_ms;
            $health['last_error'] = '';
            $health['cached_events_count'] = $count;
            $health['cache_size_bytes'] = $bytes;
        } else {
            $health['last_error'] = mb_substr($error, 0, 200);
            $health['last_fetch_ms'] = $fetch_ms;
        }
        update_option(self::health_option(), $health, false);
    }

    /**
     * @return array{last_fetch_ok_at:int, last_fetch_ms:int, last_error:string, cached_events_count:int, cache_size_bytes:int}
     */
    public static function health_get(): array
    {
        $h = get_option(self::health_option(), []);
        return wp_parse_args($h, [
            'last_fetch_ok_at' => 0,
            'last_fetch_ms' => 0,
            'last_error' => '',
            'cached_events_count' => 0,
            'cache_size_bytes' => 0,
        ]);
    }

    // =========================================================================
    // Response headers
    // =========================================================================

    public static function add_headers(\WP_REST_Response $response, string $cache_status, int $fetch_ms, int $ttl): void
    {
        $response->header('X-Zen-Cache', $cache_status);

        if ($fetch_ms > 0) {
            $response->header('X-Zen-Fetch-MS', (string) $fetch_ms);
        }

        if ($cache_status === 'hit') {
            $response->header('Cache-Control', 'public, max-age=' . $ttl);
            $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $ttl) . ' GMT');
        } else {
            $response->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
        }
    }
}
