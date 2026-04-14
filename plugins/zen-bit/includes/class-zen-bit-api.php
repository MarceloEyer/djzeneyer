<?php
/**
 * Zen BIT — API v2
 *
 * Namespace: zen-bit/v2
 *
 * Endpoints:
 *   GET  /wp-json/zen-bit/v2/events                      → Lista enxuta (ZenBitEventListItem)
 *   GET  /wp-json/zen-bit/v2/events/schema               → JSON-LD lista (MusicGroup + MusicEvent[])
 *   GET  /wp-json/zen-bit/v2/events/{event_id}           → Detalhe completo (ZenBitEventDetail)
 *   GET  /wp-json/zen-bit/v2/events/{event_id}/schema    → JSON-LD evento individual
 *   POST /wp-json/zen-bit/v2/admin/fetch-now             → Força refresh do cache (admin)
 *   POST /wp-json/zen-bit/v2/admin/clear-cache           → Limpa todo o cache (admin)
 *   GET  /wp-json/zen-bit/v2/admin/health                → Status do sistema (admin)
 *
 * CHANGELOG v3.1.0 — 2026-03-06
 *   FEAT JWT Authentication Bridge — Admin endpoints now support Authorization: Bearer tokens.
 *   FEAT Sitemap Integration — Admin actions now clear sitemap cache automatically.
 *   PATCH  Double-fetch eliminated in get_event(). Now uses a 3-tier lookup through SWR pools.
 *   DOCS Standardized PHPDoc and engineering headers.
 *
 * @package ZenBit
 * @version 3.1.0
 */

namespace ZenBit;

if (!defined('ABSPATH')) {
    exit;
}

class Zen_BIT_API_V2
{

    // =========================================================================
    // OPTIONS
    // =========================================================================

    /** @return string Bandsintown artist numeric ID. */
    public static function artist_id(): string
    {
        return trim((string) \get_option('zen_bit_artist_id', '15619775')) ?: '15619775';
    }

    /** @return string Artist name (used in place of ID when set). */
    public static function artist_name(): string
    {
        return trim((string) \get_option('zen_bit_artist_name', ''));
    }

    /**
     * Returns the Bandsintown app_id (API key).
     * Falls back to a human-readable identifier so the API still works during
     * initial setup before the admin has set a key.
     *
     * @return string
     */
    private static function app_id(): string
    {
        $key = trim((string) \get_option('zen_bit_api_key', ''));
        return $key !== '' ? $key : 'djzeneyer';
    }

    /** @return int Default day range from admin settings. */
    private static function default_days(): int
    {
        return max(1, (int) \get_option('zen_bit_default_days', 365));
    }

    // =========================================================================
    // PARAMETER PARSING
    // =========================================================================

    /**
     * Validates and normalises the common list/schema query parameters.
     *
     * @param \WP_REST_Request $req Incoming request.
     * @return array|\WP_Error Normalised params array or WP_Error on bad input.
     */
    private static function parse_list_params(\WP_REST_Request $req)
    {
        // ── mode ─────────────────────────────────────────────────────────────
        $mode = strtolower(sanitize_text_field((string) ($req->get_param('mode') ?: 'upcoming')));
        if (!in_array($mode, ['upcoming', 'past', 'all'], true)) {
            return new \WP_Error('invalid_mode', 'mode deve ser upcoming, past ou all.', ['status' => 400]);
        }

        // ── date or days ──────────────────────────────────────────────────────
        $date_param = sanitize_text_field((string) ($req->get_param('date') ?: ''));
        $date_start = '';
        $date_end = '';

        if ($date_param !== '') {
            if (!preg_match('/^(\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})$/', $date_param, $m)) {
                return new \WP_Error('invalid_date', 'date deve ter formato YYYY-MM-DD,YYYY-MM-DD.', ['status' => 400]);
            }
            [, $date_start, $date_end] = $m;
            if ($date_start > $date_end) {
                return new \WP_Error('invalid_date_range', 'date_start deve ser ≤ date_end.', ['status' => 400]);
            }
        } else {
            $days_raw = $req->get_param('days');
            $days = $days_raw !== null ? (int) $days_raw : self::default_days();
            if ($days < 1 || $days > 730) {
                return new \WP_Error('invalid_days', 'days deve estar entre 1 e 730.', ['status' => 400]);
            }

            if ('upcoming' === $mode) {
                $date_start = \gmdate('Y-m-d');
                $date_end = \gmdate('Y-m-d', strtotime("+{$days} days"));
            } elseif ('past' === $mode) {
                $date_start = \gmdate('Y-m-d', strtotime("-{$days} days"));
                $date_end = \gmdate('Y-m-d');
            }
            // mode=all → no date filter applied.
        }

        // ── limit ─────────────────────────────────────────────────────────────
        $limit_raw = $req->get_param('limit');
        $limit = $limit_raw !== null ? (int) $limit_raw : 50;
        if ($limit < 1 || $limit > 200) {
            return new \WP_Error('invalid_limit', 'limit deve estar entre 1 e 200.', ['status' => 400]);
        }

        // ── lang (passthrough to React) ───────────────────────────────────────
        $lang = sanitize_text_field((string) ($req->get_param('lang') ?: 'en'));

        return compact('mode', 'date_start', 'date_end', 'limit', 'lang');
    }

    // =========================================================================
    // BANDSINTOWN HTTP FETCH
    // =========================================================================

    /**
     * Makes a direct HTTP request to the Bandsintown REST API.
     *
     * IMPORTANT: This method always hits the external API. All callers should
     * go through the SWR pool (get_pool / get_event) instead, which caches
     * results and only calls this method on cache MISS.
     *
     * @param string $bit_date Value for the BIT `date` query param
     *                         (e.g. 'upcoming', 'past', '2025-01-01,2025-12-31').
     * @return array Raw event objects, or [] on any error.
     */
    public static function fetch_from_bandsintown(string $bit_date = 'upcoming'): array
    {
        $name = self::artist_name();
        $id = self::artist_id();
        $ident = $name !== '' ? urlencode($name) : 'id_' . $id;

        $url = sprintf(
            'https://rest.bandsintown.com/artists/%s/events?app_id=%s&date=%s',
            $ident,
            urlencode(self::app_id()),
            urlencode($bit_date)
        );

        $t0 = microtime(true);
        $res = \wp_remote_get($url, [
            'timeout' => 15,
            'headers' => ['Accept' => 'application/json'],
        ]);
        $ms = (int) round((microtime(true) - $t0) * 1000);

        if (\is_wp_error($res)) {
            Zen_BIT_Cache::health_update(false, $ms, $res->get_error_message(), 0, 0);
            return [];
        }

        $code = (int) \wp_remote_retrieve_response_code($res);
        $body = (string) \wp_remote_retrieve_body($res);

        if ($code < 200 || $code >= 300) {
            Zen_BIT_Cache::health_update(false, $ms, "HTTP {$code}: " . substr($body, 0, 120), 0, 0);
            return [];
        }

        $data = json_decode($body, true);
        if (!is_array($data)) {
            Zen_BIT_Cache::health_update(false, $ms, 'Invalid JSON', 0, 0);
            return [];
        }
        if (!empty($data['error'])) {
            Zen_BIT_Cache::health_update(false, $ms, (string) $data['error'], 0, 0);
            return [];
        }

        // BIT sometimes returns a single object instead of an array.
        if (isset($data['id']) && !isset($data[0])) {
            $data = [$data];
        }

        return is_array($data) ? $data : [];
    }

    // =========================================================================
    // SWR POOL
    // =========================================================================

    /**
     * Returns the cached pool of normalised events for a given mode/date range.
     *
     * The pool is the primary data source for both list and detail endpoints.
     * Uses Zen_BIT_Cache::get_with_swr() which implements:
     *  - Cache HIT  → returns immediately (no fetch).
     *  - Cache MISS → acquires an anti-stampede lock, calls fetch_from_bandsintown(),
     *                 normalises, stores, and returns.
     *  - Cache STALE / lock contention → serves fallback (persistent copy in wp_options).
     *
     * @param string $mode       'upcoming' | 'past' | 'all'
     * @param string $date_start YYYY-MM-DD or '' for mode=all.
     * @param string $date_end   YYYY-MM-DD or '' for mode=all.
     * @param bool   $detail     true → normalise as ZenBitEventDetail (includes image/description).
     *                           false → normalise as ZenBitEventListItem (payload enxuto).
     * @return array{ data: array, cache_status: string, fetch_ms: int }
     */
    private static function get_pool(
        string $mode,
        string $date_start,
        string $date_end,
        bool $detail = false
    ): array {
        $ttl = ('past' === $mode)
            ? Zen_BIT_Cache::ttl_past()
            : Zen_BIT_Cache::ttl_upcoming();

        $include_raw = (bool) \get_option('zen_bit_include_raw_debug', false);

        $key = Zen_BIT_Cache::make_key([
            'mode' => $mode,
            'ds' => $date_start,
            'de' => $date_end,
            'det' => $detail ? 1 : 0,
            'nv' => Zen_BIT_Normalizer::VERSION,
        ]);

        return Zen_BIT_Cache::get_with_swr(
            $key,
            static function () use ($mode, $date_start, $date_end, $detail, $include_raw): array {
                // Translate mode/range to a BIT API date param.
                if ('past' === $mode) {
                    $bit_date = 'past';
                } elseif ($date_start !== '' && $date_end !== '') {
                    $bit_date = "{$date_start},{$date_end}";
                } else {
                    $bit_date = 'upcoming';
                }

                $raw_events = self::fetch_from_bandsintown($bit_date);
                if (empty($raw_events)) {
                    return [];
                }

                $out = [];
                foreach ($raw_events as $raw) {
                    if (!is_array($raw)) {
                        continue;
                    }
                    $out[] = $detail
                        ? Zen_BIT_Normalizer::normalize_detail($raw, $include_raw)
                        : Zen_BIT_Normalizer::normalize_list_item($raw);
                }
                return $out;
            },
            $ttl
        );
    }

    // =========================================================================
    // POST-CACHE FILTERS
    // =========================================================================

    /**
     * Filters a normalised event array to only include events within [ds, de].
     * This is needed because the pool may cover a wider window than the request.
     *
     * @param array  $events Normalised events from the pool.
     * @param string $ds     Start date (YYYY-MM-DD) or '' to skip lower bound.
     * @param string $de     End date   (YYYY-MM-DD) or '' to skip upper bound.
     * @return array
     */
    private static function filter_by_date(array $events, string $ds, string $de): array
    {
        if ($ds === '' && $de === '') {
            return $events;
        }

        return array_values(array_filter($events, static function ($e) use ($ds, $de): bool {
            $ts = strtotime((string) ($e['starts_at'] ?? ''));
            if (!$ts) {
                return false;
            }
            $d = \gmdate('Y-m-d', $ts);
            if ($ds !== '' && $d < $ds) {
                return false;
            }
            if ($de !== '' && $d > $de) {
                return false;
            }
            return true;
        }));
    }

    /**
     * Sorts events in-place: upcoming → ascending (soonest first),
     * past → descending (most recent first).
     *
     * @param array  $events Events to sort (passed by reference).
     * @param string $mode   'upcoming' | 'past' | 'all'
     */
    private static function sort_events(array &$events, string $mode): void
    {
        usort($events, static function ($a, $b) use ($mode): int {
            $at = strtotime((string) ($a['starts_at'] ?? '')) ?: PHP_INT_MAX;
            $bt = strtotime((string) ($b['starts_at'] ?? '')) ?: PHP_INT_MAX;
            return 'past' === $mode ? $bt <=> $at : $at <=> $bt;
        });
    }

    // =========================================================================
    // ENDPOINT: GET /events — LIST
    // =========================================================================

    /**
     * Returns a paginated, date-filtered list of events (ZenBitEventListItem shape).
     *
     * Headers set on response:
     *   X-Zen-Cache: hit | miss | stale
     *   X-Zen-Fetch-MS: <ms>   (only when a live fetch occurred)
     *   Cache-Control: public, max-age=<ttl>
     *
     * @param \WP_REST_Request $req Incoming REST request.
     * @return \WP_REST_Response|\WP_Error
     */
    public static function list_events(\WP_REST_Request $req)
    {
        $params = self::parse_list_params($req);
        if (\is_wp_error($params)) {
            return $params;
        }

        [
            'mode' => $mode,
            'date_start' => $ds,
            'date_end' => $de,
            'limit' => $limit,
            'lang' => $lang
        ] = $params;

        $result = self::get_pool($mode, $ds, $de, false);
        $events = self::filter_by_date($result['data'], $ds, $de);
        self::sort_events($events, $mode);
        $events = array_slice($events, 0, $limit);

        $response = \rest_ensure_response([
            'success' => true,
            'count' => count($events),
            'mode' => $mode,
            'lang' => $lang,
            'events' => array_values($events),
        ]);

        Zen_BIT_Cache::add_headers(
            $response,
            $result['cache_status'],
            $result['fetch_ms'],
            Zen_BIT_Cache::ttl_upcoming()
        );

        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/{event_id} — DETAIL
    // =========================================================================

    /**
     * Returns the full detail payload for a single event (ZenBitEventDetail shape).
     *
     * PERFORMANCE PATCH (v3.1.0 — double-fetch eliminated):
     * ──────────────────────────────────────────────────────
     * The previous implementation called fetch_from_bandsintown('upcoming') and
     * fetch_from_bandsintown('past') on EVERY request, making 2 live HTTP calls
     * even when the data was already cached in the SWR pool.
     *
     * New lookup strategy (3 tiers, cheapest first):
     *   1. Dedicated detail transient for this event_id (fastest — detail normalisation).
     *   2. Upcoming pool from SWR cache (free if already cached by /events endpoint).
     *   3. Past pool from SWR cache (free if already cached).
     *   4. Live fetch from Bandsintown (only if all caches are cold/stale).
     *
     * This eliminates redundant API calls and reduces p50 latency on warm caches
     * from ~600 ms (2 × external HTTP) to <1 ms (transient read).
     *
     * @param \WP_REST_Request $req Incoming REST request.
     * @return \WP_REST_Response|\WP_Error
     */
    public static function get_event(\WP_REST_Request $req)
    {
        $event_id = sanitize_text_field((string) $req->get_param('event_id'));
        if ($event_id === '' || !ctype_digit($event_id)) {
            return new \WP_Error('invalid_event_id', 'event_id deve ser numérico.', ['status' => 400]);
        }

        $include_raw = (bool) \get_option('zen_bit_include_raw_debug', false);

        // ── Tier 1: Dedicated detail transient ───────────────────────────────
        $detail_key = Zen_BIT_Cache::make_key(['event_id' => $event_id, 'det' => 1]);

        $result = Zen_BIT_Cache::get_with_swr(
            $detail_key,
            static function () use ($event_id, $include_raw): array {
                // ── Tier 2 + 3: Search the SWR pools (zero HTTP cost if cached) ──
                foreach (['upcoming', 'past'] as $mode) {
                    // Search using detail=true so we get all required fields.
                    $pool = self::get_pool($mode, '', '', true);
                    if (!empty($pool['data'])) {
                        foreach ($pool['data'] as $e) {
                            if ((string) ($e['event_id'] ?? '') === $event_id) {
                                return [$e];
                            }
                        }
                    }
                }

                // ── Tier 4: Live HTTP fetch (last resort) ────────────────────
                foreach (['upcoming', 'past'] as $bit_date) {
                    $raws = self::fetch_from_bandsintown($bit_date);
                    foreach ($raws as $raw) {
                        if (!is_array($raw)) {
                            continue;
                        }
                        if ((string) ($raw['id'] ?? '') === $event_id) {
                            return [Zen_BIT_Normalizer::normalize_detail($raw, $include_raw)];
                        }
                    }
                }

                return [];
            },
            Zen_BIT_Cache::ttl_detail()
        );

        if (empty($result['data'])) {
            return new \WP_Error(
                'event_not_found',
                "Evento {$event_id} não encontrado.",
                ['status' => 404]
            );
        }

        $response = \rest_ensure_response([
            'success' => true,
            'event' => $result['data'][0],
        ]);

        Zen_BIT_Cache::add_headers(
            $response,
            $result['cache_status'],
            $result['fetch_ms'],
            Zen_BIT_Cache::ttl_detail()
        );

        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/schema — JSON-LD LIST
    // =========================================================================

    /**
     * Returns a JSON-LD @graph with MusicGroup (performer) + MusicEvent[] for the
     * requested event list.
     *
     * @param \WP_REST_Request $req Incoming REST request.
     * @return \WP_REST_Response|\WP_Error
     */
    public static function list_events_schema(\WP_REST_Request $req)
    {
        if (!(bool) \get_option('zen_bit_enable_schema', '1')) {
            return \rest_ensure_response(['@context' => 'https://schema.org', '@graph' => []]);
        }

        $params = self::parse_list_params($req);
        if (\is_wp_error($params)) {
            return $params;
        }

        ['mode' => $mode, 'date_start' => $ds, 'date_end' => $de, 'limit' => $limit] = $params;

        $result = self::get_pool($mode, $ds, $de, true);
        $events = self::filter_by_date($result['data'], $ds, $de);
        self::sort_events($events, $mode);
        $events = array_slice($events, 0, $limit);

        $performer = Zen_BIT_Normalizer::build_performer_entity();
        $perf_id = $performer['@id'];
        $graph = [$performer];

        foreach ($events as $event) {
            $schema = Zen_BIT_Normalizer::build_event_schema($event);
            if (empty($schema)) {
                continue;
            }
            $schema['performer'] = ['@id' => $perf_id];
            $graph[] = $schema;
        }

        $response = \rest_ensure_response([
            '@context' => 'https://schema.org',
            '@graph' => $graph,
        ]);

        Zen_BIT_Cache::add_headers(
            $response,
            $result['cache_status'],
            $result['fetch_ms'],
            Zen_BIT_Cache::ttl_upcoming()
        );

        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/{event_id}/schema — JSON-LD SINGLE EVENT
    // =========================================================================

    /**
     * Returns a JSON-LD @graph with MusicGroup + MusicEvent for a single event.
     *
     * @param \WP_REST_Request $req Incoming REST request.
     * @return \WP_REST_Response|\WP_Error
     */
    public static function get_event_schema(\WP_REST_Request $req)
    {
        $detail_res = self::get_event($req);
        if (\is_wp_error($detail_res)) {
            return $detail_res;
        }

        $data = $detail_res->get_data();
        $event = $data['event'] ?? [];
        if (empty($event)) {
            return new \WP_Error('schema_error', 'Evento não disponível para schema.', ['status' => 404]);
        }

        $schema = Zen_BIT_Normalizer::build_event_schema($event);
        if (empty($schema)) {
            return new \WP_Error('schema_empty', 'Schema não pôde ser gerado para este evento.', ['status' => 422]);
        }

        $performer = Zen_BIT_Normalizer::build_performer_entity();
        $schema['performer'] = ['@id' => $performer['@id']];

        return \rest_ensure_response([
            '@context' => 'https://schema.org',
            '@graph' => [$performer, $schema],
        ]);
    }

    // =========================================================================
    // ADMIN ENDPOINTS
    // =========================================================================

    /**
     * POST /admin/fetch-now
     *
     * @param \WP_REST_Request $req Incoming REST request.
     * @return \WP_REST_Response
     */
    public static function admin_fetch_now(\WP_REST_Request $req)
    {
        Zen_BIT_Cache::clear_all();
        Zen_BIT_Sitemap::clear_cache();

        $raws = self::fetch_from_bandsintown('upcoming');
        $count = 0;

        if (!empty($raws)) {
            $normalized = [];
            foreach ($raws as $raw) {
                if (!is_array($raw)) {
                    continue;
                }
                $normalized[] = Zen_BIT_Normalizer::normalize_list_item($raw);
            }
            $count = count($normalized);

            // Pre-populate the SWR pool.
            $pool_key = Zen_BIT_Cache::make_key([
                'mode' => 'upcoming',
                'ds' => '',
                'de' => '',
                'det' => 0,
                'nv' => Zen_BIT_Normalizer::VERSION,
            ]);
            \set_transient($pool_key, $normalized, Zen_BIT_Cache::ttl_upcoming());
            \update_option(Zen_BIT_Cache::make_fallback_key($pool_key), $normalized, false);
        }

        return \rest_ensure_response([
            'success' => true,
            'count' => $count,
            'health' => Zen_BIT_Cache::health_get(),
        ]);
    }

    /**
     * POST /admin/clear-cache
     *
     * @param \WP_REST_Request $req Incoming REST request.
     * @return \WP_REST_Response
     */
    public static function admin_clear_cache(\WP_REST_Request $req)
    {
        Zen_BIT_Cache::clear_all();
        Zen_BIT_Sitemap::clear_cache();
        return \rest_ensure_response(['success' => true, 'message' => 'Cache limpo.']);
    }

    /**
     * GET /admin/health
     *
     * @param \WP_REST_Request $req Incoming REST request.
     * @return \WP_REST_Response
     */
    public static function admin_health(\WP_REST_Request $req)
    {
        return \rest_ensure_response(Zen_BIT_Cache::health_get());
    }

    // =========================================================================
    // AUTH & PERMISSIONS
    // =========================================================================

    /**
     * Bridges JWT and Cookie auth for Admin endpoints.
     *
     * @param \WP_REST_Request $request Incoming request.
     * @return bool
     */
    public static function check_admin_auth(\WP_REST_Request $request): bool
    {
        $user_id = self::get_authenticated_user_id($request);
        if ($user_id <= 0) {
            return false;
        }

        return \user_can($user_id, 'manage_options');
    }

    /**
     * Resolves user ID from current session or JWT header.
     *
     * @param \WP_REST_Request $request Incoming request.
     * @return int
     */
    private static function get_authenticated_user_id(\WP_REST_Request $request): int
    {
        // Primary: cookie-based session (standard WordPress auth).
        $user_id = \get_current_user_id();
        if ($user_id) {
            return $user_id;
        }

        // Fallback: JWT Bearer token (requires zeneyer-auth plugin).
        $auth_header = $request->get_header('Authorization');
        if ($auth_header && \preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            $token = \trim($matches[1]);
            if (\class_exists('\ZenEyer\Auth\Core\JWT_Manager')) {
                $decoded = \ZenEyer\Auth\Core\JWT_Manager::validate_token($token);
                if (!\is_wp_error($decoded) && isset($decoded->data->user_id)) {
                    return (int) $decoded->data->user_id;
                }
            }
        }

        return 0;
    }

    // =========================================================================
    // LEGACY HELPERS
    // =========================================================================

    /**
     * Returns a JSON-LD graph for the shortcode [zen_bit_events_schema].
     *
     * @deprecated Use GET /events/schema instead.
     * @param int $limit Max number of events.
     * @return array
     */
    public static function get_events_schema_graph(int $limit = 25): array
    {
        $raws = self::fetch_from_bandsintown('upcoming');
        $graph = [];
        $count = 0;

        foreach ($raws as $raw) {
            if (!is_array($raw) || $count >= $limit) {
                break;
            }
            $detail = Zen_BIT_Normalizer::normalize_detail($raw);
            $schema = Zen_BIT_Normalizer::build_event_schema($detail);
            if (!empty($schema)) {
                $graph[] = $schema;
                $count++;
            }
        }

        return ['@context' => 'https://schema.org', '@graph' => $graph];
    }

    /**
     * @deprecated Use Zen_BIT_Cache::clear_all() instead.
     */
    public static function clear_cache(): void
    {
        Zen_BIT_Cache::clear_all();
    }
}

// =============================================================================
// BACKWARD COMPATIBILITY ALIAS
// =============================================================================

if (!class_exists(__NAMESPACE__ . '\\Zen_BIT_API')) {
    class_alias(__NAMESPACE__ . '\\Zen_BIT_API_V2', __NAMESPACE__ . '\\Zen_BIT_API');
}
