<?php
namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Cache
{
    const SITEMAP_DURATION = 7 * DAY_IN_SECONDS;
    const SCHEMA_DURATION = 3 * DAY_IN_SECONDS;
    const META_DURATION = 24 * HOUR_IN_SECONDS;
    const APCU_PREFIX = 'zen_seo_l1_';

    /**
     * Get cached data from APCu L1 first, then WordPress transients.
     *
     * @param string $key
     * @return mixed|false
     */
    public static function get($key)
    {
        $cache_key = self::get_cache_key($key);
        $l1_cached = self::apcu_get($cache_key);

        if ($l1_cached !== false) {
            return $l1_cached;
        }

        $cached = \get_transient($cache_key);

        if ($cached !== false) {
            self::apcu_set($cache_key, $cached, self::META_DURATION);
        }

        return $cached;
    }

    /**
     * Set cached data in APCu L1 and WordPress transients.
     *
     * @param string $key
     * @param mixed $data
     * @param int|null $expiration
     * @return bool
     */
    public static function set($key, $data, $expiration = null)
    {
        if ($expiration === null) {
            $expiration = self::META_DURATION;
        }

        $cache_key = self::get_cache_key($key);
        self::apcu_set($cache_key, $data, (int) $expiration);

        return \set_transient($cache_key, $data, $expiration);
    }

    /**
     * Delete cached data from APCu L1 and WordPress transients.
     *
     * @param string $key
     * @return bool
     */
    public static function delete($key)
    {
        $cache_key = self::get_cache_key($key);
        self::apcu_delete($cache_key);

        return \delete_transient($cache_key);
    }

    /**
     * Clear all plugin caches.
     *
     * @return int Number of transient rows cleared.
     */
    public static function clear_all()
    {
        global $wpdb;

        self::apcu_clear_prefix();

        $count = $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options}
                WHERE option_name LIKE %s
                OR option_name LIKE %s",
                '_transient_zen_seo_%',
                '_transient_timeout_zen_seo_%'
            )
        );

        Zen_SEO_Helpers::log('Cleared all caches', ['count' => $count]);

        return $count;
    }

    /**
     * Clear sitemap cache.
     *
     * @return void
     */
    public static function clear_sitemap()
    {
        self::delete('sitemap');
        Zen_SEO_Helpers::log('Cleared sitemap cache');
    }

    /**
     * Clear schema cache for a post.
     *
     * @param int $post_id
     * @return void
     */
    public static function clear_schema($post_id)
    {
        self::delete('schema_' . $post_id);
        Zen_SEO_Helpers::log('Cleared schema cache', ['post_id' => $post_id]);
    }

    /**
     * Clear meta cache for a post.
     *
     * @param int $post_id
     * @return void
     */
    public static function clear_meta($post_id)
    {
        self::delete('meta_' . $post_id);
        Zen_SEO_Helpers::log('Cleared meta cache', ['post_id' => $post_id]);
    }

    /**
     * Get full cache key with prefix.
     *
     * @param string $key
     * @return string
     */
    private static function get_cache_key($key)
    {
        return 'zen_seo_' . $key;
    }

    public static function apcu_available(): bool
    {
        return \function_exists('apcu_enabled') && \apcu_enabled();
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

    /**
     * Get cache statistics.
     *
     * @return array
     */
    public static function get_stats()
    {
        global $wpdb;

        $total = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->options}
                WHERE option_name LIKE %s",
                '_transient_zen_seo_%'
            )
        );

        $size = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT SUM(LENGTH(option_value)) FROM {$wpdb->options}
                WHERE option_name LIKE %s",
                '_transient_zen_seo_%'
            )
        );

        return [
            'total_items' => (int) $total,
            'total_size' => (int) $size,
            'size_formatted' => \size_format($size),
            'apcu_available' => self::apcu_available(),
        ];
    }
}
