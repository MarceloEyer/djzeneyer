<?php
/**
 * Zen BIT — API v2
 * Namespace: zen-bit/v2
 *
 * Endpoints:
 *   GET  /wp-json/zen-bit/v2/events                   → Lista enxuta
 *   GET  /wp-json/zen-bit/v2/events/schema            → JSON-LD lista
 *   GET  /wp-json/zen-bit/v2/events/{event_id}        → Detalhe completo
 *   GET  /wp-json/zen-bit/v2/events/{event_id}/schema → JSON-LD por evento
 *   POST /wp-json/zen-bit/v2/admin/clear-cache        → Limpa cache (admin)
 *   POST /wp-json/zen-bit/v2/admin/fetch-now          → Força refresh (admin)
 *   GET  /wp-json/zen-bit/v2/admin/health             → Health status (admin)
 */

if (!defined('ABSPATH'))
    exit;

class Zen_BIT_API_V2
{
    // =========================================================================
    // OPTIONS
    // =========================================================================

    public static function artist_id(): string
    {
        return trim((string) get_option('zen_bit_artist_id', '15619775')) ?: '15619775';
    }

    public static function artist_name(): string
    {
        return trim((string) get_option('zen_bit_artist_name', ''));
    }

    private static function app_id(): string
    {
        $key = trim((string) get_option('zen_bit_api_key', ''));
        return $key !== '' ? $key : 'djzeneyer';
    }

    private static function default_days(): int
    {
        return max(1, (int) get_option('zen_bit_default_days', 365));
    }

    // =========================================================================
    // PARÂMETROS COMUNS
    // =========================================================================

    /**
     * Valida e normaliza parâmetros do request.
     * @return array|\WP_Error
     */
    private static function parse_list_params(\WP_REST_Request $req)
    {
        // mode
        $mode = strtolower(sanitize_text_field((string) ($req->get_param('mode') ?: 'upcoming')));
        if (!in_array($mode, ['upcoming', 'past', 'all'], true)) {
            return new \WP_Error('invalid_mode', 'mode deve ser upcoming, past ou all.', ['status' => 400]);
        }

        // date ou days
        $date_param = sanitize_text_field((string) ($req->get_param('date') ?: ''));
        $date_start = '';
        $date_end = '';

        if ($date_param !== '') {
            if (!preg_match('/^(\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})$/', $date_param, $m)) {
                return new \WP_Error('invalid_date', 'date deve ter formato YYYY-MM-DD,YYYY-MM-DD.', ['status' => 400]);
            }
            $date_start = $m[1];
            $date_end = $m[2];

            if ($date_start > $date_end) {
                return new \WP_Error('invalid_date_range', 'date_start deve ser ≤ date_end.', ['status' => 400]);
            }
        } else {
            $days_raw = $req->get_param('days');
            $days = $days_raw !== null ? (int) $days_raw : self::default_days();

            if ($days < 1 || $days > 730) {
                return new \WP_Error('invalid_days', 'days deve estar entre 1 e 730.', ['status' => 400]);
            }

            if ($mode === 'upcoming') {
                $date_start = gmdate('Y-m-d');
                $date_end = gmdate('Y-m-d', strtotime("+{$days} days"));
            } elseif ($mode === 'past') {
                $date_start = gmdate('Y-m-d', strtotime("-{$days} days"));
                $date_end = gmdate('Y-m-d');
            }
            // mode=all → sem filtro de data
        }

        // limit
        $limit_raw = $req->get_param('limit');
        $limit = $limit_raw !== null ? (int) $limit_raw : 50;
        if ($limit < 1 || $limit > 200) {
            return new \WP_Error('invalid_limit', 'limit deve estar entre 1 e 200.', ['status' => 400]);
        }

        // lang (passthrough)
        $lang = sanitize_text_field((string) ($req->get_param('lang') ?: 'en'));

        return compact('mode', 'date_start', 'date_end', 'limit', 'lang');
    }

    // =========================================================================
    // FETCH BANDSINTOWN
    // =========================================================================

    /**
     * Chama a API do Bandsintown. Retorna array de eventos raw ou [].
     * @param string $bit_date Valor para o param "date" da BIT API
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
        $res = wp_remote_get($url, ['timeout' => 15, 'headers' => ['Accept' => 'application/json']]);
        $ms = (int) round((microtime(true) - $t0) * 1000);

        if (is_wp_error($res)) {
            Zen_BIT_Cache::health_update(false, $ms, $res->get_error_message(), 0, 0);
            return [];
        }

        $code = (int) wp_remote_retrieve_response_code($res);
        $body = (string) wp_remote_retrieve_body($res);

        if ($code < 200 || $code >= 300) {
            $msg = "HTTP {$code}: " . substr($body, 0, 120);
            Zen_BIT_Cache::health_update(false, $ms, $msg, 0, 0);
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
        // Objeto único → array
        if (isset($data['id']) && !isset($data[0]))
            $data = [$data];

        return is_array($data) ? $data : [];
    }

    // =========================================================================
    // POOL COM SWR
    // =========================================================================

    /**
     * Pool de eventos normalizado com cache SWR.
     *
     * @param bool $detail  true = normalize_detail (detalhe), false = normalize_list_item
     * @return array{data:array, cache_status:string, fetch_ms:int}
     */
    private static function get_pool(
        string $mode,
        string $date_start,
        string $date_end,
        bool $detail = false
    ): array {
        $ttl = match ($mode) {
            'past' => Zen_BIT_Cache::ttl_past(),
            default => Zen_BIT_Cache::ttl_upcoming(),
        };

        $include_raw = (bool) get_option('zen_bit_include_raw_debug', false);

        $key = Zen_BIT_Cache::make_key([
            'mode' => $mode,
            'ds' => $date_start,
            'de' => $date_end,
            'det' => $detail ? 1 : 0,
            'nv' => Zen_BIT_Normalizer::VERSION,
        ]);

        return Zen_BIT_Cache::get_with_swr($key, function () use ($mode, $date_start, $date_end, $detail, $include_raw) {
            // Traduz mode/range para param do BIT
            if ($mode === 'past') {
                $bit_date = 'past';
            } elseif ($date_start !== '' && $date_end !== '') {
                $bit_date = "{$date_start},{$date_end}";
            } else {
                $bit_date = 'upcoming';
            }

            $raw_events = self::fetch_from_bandsintown($bit_date);
            if (empty($raw_events))
                return [];

            $out = [];
            foreach ($raw_events as $raw) {
                if (!is_array($raw))
                    continue;
                $out[] = $detail
                    ? Zen_BIT_Normalizer::normalize_detail($raw, $include_raw)
                    : Zen_BIT_Normalizer::normalize_list_item($raw);
            }
            return $out;
        }, $ttl);
    }

    // =========================================================================
    // FILTROS PÓS-CACHE
    // =========================================================================

    private static function filter_by_date(array $events, string $ds, string $de): array
    {
        if ($ds === '' && $de === '')
            return $events;
        return array_values(array_filter($events, function ($e) use ($ds, $de) {
            $ts = strtotime((string) ($e['starts_at'] ?? ''));
            if (!$ts)
                return false;
            $d = gmdate('Y-m-d', $ts);
            if ($ds !== '' && $d < $ds)
                return false;
            if ($de !== '' && $d > $de)
                return false;
            return true;
        }));
    }

    private static function sort_events(array &$events, string $mode): void
    {
        usort($events, function ($a, $b) use ($mode) {
            $at = strtotime((string) ($a['starts_at'] ?? '')) ?: PHP_INT_MAX;
            $bt = strtotime((string) ($b['starts_at'] ?? '')) ?: PHP_INT_MAX;
            return $mode === 'past' ? $bt <=> $at : $at <=> $bt;
        });
    }

    // =========================================================================
    // ENDPOINT: GET /events (LISTA)
    // =========================================================================

    public static function list_events(\WP_REST_Request $req)
    {
        $params = self::parse_list_params($req);
        if (is_wp_error($params))
            return $params;

        ['mode' => $mode, 'date_start' => $ds, 'date_end' => $de, 'limit' => $limit, 'lang' => $lang] = $params;

        $result = self::get_pool($mode, $ds, $de, false);
        $events = self::filter_by_date($result['data'], $ds, $de);
        self::sort_events($events, $mode);
        $events = array_slice($events, 0, $limit);

        $response = rest_ensure_response([
            'success' => true,
            'count' => count($events),
            'mode' => $mode,
            'events' => array_values($events),
        ]);

        Zen_BIT_Cache::add_headers($response, $result['cache_status'], $result['fetch_ms'], Zen_BIT_Cache::ttl_upcoming());
        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/{event_id} (DETALHE)
    // =========================================================================

    public static function get_event(\WP_REST_Request $req)
    {
        $event_id = sanitize_text_field((string) $req->get_param('event_id'));
        if ($event_id === '' || !ctype_digit($event_id)) {
            return new \WP_Error('invalid_event_id', 'event_id deve ser numérico.', ['status' => 400]);
        }

        $include_raw = (bool) get_option('zen_bit_include_raw_debug', false);
        $key = Zen_BIT_Cache::make_key(['event_id' => $event_id, 'det' => 1]);

        $result = Zen_BIT_Cache::get_with_swr($key, function () use ($event_id, $include_raw) {
            // Tenta upcoming primeiro, depois past
            foreach (['upcoming', 'past'] as $bit_date) {
                $raws = self::fetch_from_bandsintown($bit_date);
                foreach ($raws as $raw) {
                    if (!is_array($raw))
                        continue;
                    if ((string) ($raw['id'] ?? '') === $event_id) {
                        return [Zen_BIT_Normalizer::normalize_detail($raw, $include_raw)];
                    }
                }
            }
            return [];
        }, Zen_BIT_Cache::ttl_detail());

        if (empty($result['data'])) {
            return new \WP_Error('event_not_found', "Evento {$event_id} não encontrado.", ['status' => 404]);
        }

        $response = rest_ensure_response(['success' => true, 'event' => $result['data'][0]]);
        Zen_BIT_Cache::add_headers($response, $result['cache_status'], $result['fetch_ms'], Zen_BIT_Cache::ttl_detail());
        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/schema (LISTA JSON-LD)
    // =========================================================================

    public static function list_events_schema(\WP_REST_Request $req)
    {
        if (!(bool) get_option('zen_bit_enable_schema', '1')) {
            return rest_ensure_response(['@context' => 'https://schema.org', '@graph' => []]);
        }

        $params = self::parse_list_params($req);
        if (is_wp_error($params))
            return $params;

        ['mode' => $mode, 'date_start' => $ds, 'date_end' => $de, 'limit' => $limit] = $params;

        $result = self::get_pool($mode, $ds, $de, true); // detail=true para image/description
        $events = self::filter_by_date($result['data'], $ds, $de);
        self::sort_events($events, $mode);
        $events = array_slice($events, 0, $limit);

        $performer = Zen_BIT_Normalizer::build_performer_entity();
        $perf_id = $performer['@id'];
        $graph = [$performer];

        foreach ($events as $event) {
            $schema = Zen_BIT_Normalizer::build_event_schema($event);
            if (empty($schema))
                continue;
            $schema['performer'] = ['@id' => $perf_id];
            $graph[] = $schema;
        }

        $response = rest_ensure_response(['@context' => 'https://schema.org', '@graph' => $graph]);
        Zen_BIT_Cache::add_headers($response, $result['cache_status'], $result['fetch_ms'], Zen_BIT_Cache::ttl_upcoming());
        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/{event_id}/schema
    // =========================================================================

    public static function get_event_schema(\WP_REST_Request $req)
    {
        // Reutiliza get_event internamente
        $detail_res = self::get_event($req);
        if (is_wp_error($detail_res))
            return $detail_res;

        $data = $detail_res->get_data();
        $event = $data['event'] ?? [];
        if (empty($event)) {
            return new \WP_Error('schema_error', 'Evento não disponível para schema.', ['status' => 404]);
        }

        $schema = Zen_BIT_Normalizer::build_event_schema($event);
        if (empty($schema)) {
            return new \WP_Error('schema_empty', 'Schema não pôde ser gerado para este evento.', ['status' => 422]);
        }

        $schema['performer'] = ['@id' => home_url('/') . '#djzeneyer'];

        return rest_ensure_response([
            '@context' => 'https://schema.org',
            '@graph' => [Zen_BIT_Normalizer::build_performer_entity(), $schema],
        ]);
    }

    // =========================================================================
    // ENDPOINT: POST /admin/fetch-now
    // =========================================================================

    public static function admin_fetch_now(\WP_REST_Request $req)
    {
        Zen_BIT_Cache::clear_all();
        $raws = self::fetch_from_bandsintown('upcoming');
        $count = 0;

        if (!empty($raws)) {
            $normalized = [];
            foreach ($raws as $raw) {
                if (!is_array($raw))
                    continue;
                $normalized[] = Zen_BIT_Normalizer::normalize_list_item($raw);
            }
            $count = count($normalized);
            $key = Zen_BIT_Cache::make_key(['mode' => 'upcoming', 'ds' => '', 'de' => '', 'det' => 0, 'nv' => Zen_BIT_Normalizer::VERSION]);
            set_transient($key, $normalized, Zen_BIT_Cache::ttl_upcoming());
            update_option(Zen_BIT_Cache::make_fallback_key($key), $normalized, false);
        }

        return rest_ensure_response([
            'success' => true,
            'count' => $count,
            'health' => Zen_BIT_Cache::health_get(),
        ]);
    }

    // =========================================================================
    // ENDPOINT: POST /admin/clear-cache
    // =========================================================================

    public static function admin_clear_cache(\WP_REST_Request $req)
    {
        Zen_BIT_Cache::clear_all();
        return rest_ensure_response(['success' => true, 'message' => 'Cache limpo.']);
    }

    // =========================================================================
    // ENDPOINT: GET /admin/health
    // =========================================================================

    public static function admin_health(\WP_REST_Request $req)
    {
        return rest_ensure_response(Zen_BIT_Cache::health_get());
    }

    // =========================================================================
    // Legado (usado pelo shortcode em zen-bit.php)
    // =========================================================================

    public static function get_events_schema_graph(int $limit = 25): array
    {
        $raws = self::fetch_from_bandsintown('upcoming');
        $graph = [];
        $count = 0;
        foreach ($raws as $raw) {
            if (!is_array($raw) || $count >= $limit)
                break;
            $detail = Zen_BIT_Normalizer::normalize_detail($raw);
            $schema = Zen_BIT_Normalizer::build_event_schema($detail);
            if (!empty($schema)) {
                $graph[] = $schema;
                $count++;
            }
        }
        return ['@context' => 'https://schema.org', '@graph' => $graph];
    }

    /** @deprecated v1 compat */
    public static function clear_cache(): void
    {
        Zen_BIT_Cache::clear_all();
    }
}
