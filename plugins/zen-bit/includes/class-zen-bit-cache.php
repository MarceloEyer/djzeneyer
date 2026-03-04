<?php
/**
 * Zen BIT — Cache Manager
 * Responsabilidade: cache de eventos com SWR (Stale-While-Revalidate),
 * anti-stampede, TTLs por contexto e health/status.
 *
 * TTLs padrão:
 *   Upcoming: zen_bit_ttl_upcoming (padrão 6h)
 *   Detail:   zen_bit_ttl_detail   (padrão 24h)
 *   Past:     zen_bit_ttl_past     (padrão 7d)
 */

if (!defined('ABSPATH'))
    exit;

class Zen_BIT_Cache
{
    // Versão do normalizer — mudar aqui invalida todos os caches de payload
    const NORMALIZER_VERSION = 'v2';
    const LOCK_TTL = 30;  // segundos — anti-stampede

    // =========================================================================
    // TTLs
    // =========================================================================

    public static function ttl_upcoming(): int
    {
        $v = (int) get_option('zen_bit_ttl_upcoming', 21600);
        return max(300, $v); // mínimo 5 minutos
    }

    public static function ttl_detail(): int
    {
        $v = (int) get_option('zen_bit_ttl_detail', 86400);
        return max(300, $v);
    }

    public static function ttl_past(): int
    {
        $v = (int) get_option('zen_bit_ttl_past', 604800);
        return max(3600, $v); // mínimo 1h para past
    }

    // =========================================================================
    // CHAVES DE CACHE
    // =========================================================================

    /**
     * Gera uma chave de transient robusta e versionada.
     *
     * @param array $params Parâmetros relevantes (artist_id, mode, days, date, limit, lang)
     * @return string  Máximo 172 chars (limite WordPress: 172)
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
        return $cache_key . '_fb'; // fallback em wp_options (persistente)
    }

    // =========================================================================
    // SWR — Stale-While-Revalidate
    // =========================================================================

    /**
     * Recupera do cache ou executa $fn() com SWR.
     *
     * Fluxo:
     *  1. Cache HIT  → retorna imediatamente com X-Zen-Cache: hit
     *  2. Cache MISS + lock livre → executa $fn(), salva cache, retorna com X-Zen-Cache: miss
     *  3. Cache MISS + lock ocupado (stampede) → retorna stale do fallback com X-Zen-Cache: stale
     *  4. $fn() falha → retorna stale + registra erro no health
     *
     * @param string   $key     Chave de transient
     * @param callable $fn      Callable que busca e normaliza dados frescos; deve retornar array
     * @param int      $ttl     TTL do cache em segundos
     * @return array ['data' => array, 'cache_status' => 'hit|miss|stale', 'fetch_ms' => int]
     */
    public static function get_with_swr(string $key, callable $fn, int $ttl): array
    {
        $cached = get_transient($key);

        // ---- HIT ----
        if ($cached !== false && is_array($cached)) {
            return [
                'data' => $cached,
                'cache_status' => 'hit',
                'fetch_ms' => 0,
            ];
        }

        // ---- MISS — verificar lock anti-stampede ----
        $lock_key = self::make_lock_key($key);
        $fallback_key = self::make_fallback_key($key);

        if (get_transient($lock_key)) {
            // Outra requisição está atualizando — serve stale
            $stale = get_option($fallback_key, []);
            return [
                'data' => is_array($stale) ? $stale : [],
                'cache_status' => 'stale',
                'fetch_ms' => 0,
            ];
        }

        // Adquire lock
        set_transient($lock_key, true, self::LOCK_TTL);

        // ---- FETCH EXTERNO ----
        $t0 = microtime(true);
        try {
            $fresh = $fn();
        } catch (\Throwable $e) {
            $fresh = null;
            error_log('[Zen BIT Cache] Exception in fetch callback: ' . $e->getMessage());
        }
        $fetch_ms = (int) round((microtime(true) - $t0) * 1000);

        // Libera lock após fetch
        delete_transient($lock_key);

        if (!is_array($fresh) || empty($fresh)) {
            // Fetch falhou — serve stale
            $stale = get_option($fallback_key, []);
            self::health_update(false, $fetch_ms, 'Fetch retornou vazio ou exception', count(is_array($stale) ? $stale : []), 0);
            return [
                'data' => is_array($stale) ? $stale : [],
                'cache_status' => 'stale',
                'fetch_ms' => $fetch_ms,
            ];
        }

        // Sucesso: salva transient + fallback persistente
        set_transient($key, $fresh, $ttl);
        update_option($fallback_key, $fresh, false); // autoload = false

        $bytes = strlen(maybe_serialize($fresh));
        self::health_update(true, $fetch_ms, '', count($fresh), $bytes);

        return [
            'data' => $fresh,
            'cache_status' => 'miss',
            'fetch_ms' => $fetch_ms,
        ];
    }

    // =========================================================================
    // INVALIDAÇÃO
    // =========================================================================

    /**
     * Remove transients de uma chave (não remove o fallback — é proposital).
     */
    public static function clear(string $key): void
    {
        delete_transient($key);
        delete_transient(self::make_lock_key($key));
    }

    /**
     * Remove todos os transients do Zen BIT.
     * Usa wpdb para encontrar por prefixo.
     */
    public static function clear_all(): void
    {
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
                '_transient_zen_bit_%',
                '_transient_timeout_zen_bit_%'
            )
        );
    }

    // =========================================================================
    // HEALTH / STATUS
    // =========================================================================

    private static function health_option(): string
    {
        return 'zen_bit_health';
    }

    /**
     * Atualiza o registro de health após um fetch.
     */
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
    // HELPERS DE RESPONSE HEADERS
    // =========================================================================

    /**
     * Adiciona headers de observabilidade na WP_REST_Response.
     *
     * @param \WP_REST_Response $response
     * @param string $cache_status  'hit' | 'miss' | 'stale'
     * @param int    $fetch_ms      Duração do fetch externo (0 se foi cache hit)
     * @param int    $ttl           TTL configurado para Cache-Control
     */
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
            // stale e miss: max-age curto para o browser/CDN não cachear por muito tempo
            $response->header('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
        }
    }
}
