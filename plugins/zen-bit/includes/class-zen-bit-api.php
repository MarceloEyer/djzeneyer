<?php
/**
 * Zen BIT — API Layer v2
 *
 * Endpoints:
 *   GET  /wp-json/zen-bit/v1/events                  → Lista enxuta (sem description/image/offers)
 *   GET  /wp-json/zen-bit/v1/events/{id}             → Detalhe completo
 *   GET  /wp-json/zen-bit/v1/events/{id}/schema      → JSON-LD MusicEvent por evento
 *   GET  /wp-json/zen-bit/v1/events-schema           → JSON-LD @graph para lista
 *   POST /wp-json/zen-bit/v1/clear-cache             → Admin: limpa cache
 *   POST /wp-json/zen-bit/v1/fetch-now               → Admin: força refresh
 *
 * Parâmetros suportados em /events e /events-schema:
 *   mode          string  upcoming|past|all  (default: upcoming)
 *   days          int     1–730             (default: zen_bit_default_days | 365)
 *   date          string  YYYY-MM-DD,YYYY-MM-DD  (sobrescreve days)
 *   limit         int     1–200             (default: 50)
 *   lang          string  en|pt             (passthrough)
 *   upcoming_only bool    DEPRECATED → mapeado para mode
 */

if (!defined('ABSPATH'))
    exit;

class Zen_BIT_API
{
    // =========================================================================
    // OPTIONS
    // =========================================================================

    public static function get_artist_id(): string
    {
        return trim((string) get_option('zen_bit_artist_id', '15619775')) ?: '15619775';
    }

    public static function get_artist_name(): string
    {
        return trim((string) get_option('zen_bit_artist_name', ''));
    }

    private static function get_app_id(): string
    {
        $key = trim((string) get_option('zen_bit_api_key', ''));
        return $key !== '' ? $key : 'djzeneyer';
    }

    // =========================================================================
    // PARAM VALIDATION
    // =========================================================================

    /**
     * Valida e normaliza os parâmetros de filtro comuns a /events e /events-schema.
     *
     * @param \WP_REST_Request $request
     * @return array{mode:string, date_start:string, date_end:string, limit:int, lang:string}|\WP_Error
     */
    private static function parse_filter_params(\WP_REST_Request $request)
    {
        // ---- mode ----
        $mode = strtolower(sanitize_text_field((string) ($request->get_param('mode') ?: 'upcoming')));

        // Backward compat: upcoming_only=true → mode=upcoming
        if ($request->get_param('upcoming_only') !== null) {
            $upcoming_only = filter_var($request->get_param('upcoming_only'), FILTER_VALIDATE_BOOLEAN);
            $mode = $upcoming_only ? 'upcoming' : 'all';
        }

        if (!in_array($mode, ['upcoming', 'past', 'all'], true)) {
            return new \WP_Error('invalid_mode', 'Parâmetro mode deve ser upcoming, past ou all.', ['status' => 400]);
        }

        // ---- date range ----
        $date_param = sanitize_text_field((string) ($request->get_param('date') ?: ''));
        $date_start = '';
        $date_end = '';

        if ($date_param !== '') {
            // Formato esperado: YYYY-MM-DD,YYYY-MM-DD
            if (!preg_match('/^(\d{4}-\d{2}-\d{2}),(\d{4}-\d{2}-\d{2})$/', $date_param, $m)) {
                return new \WP_Error('invalid_date', 'Parâmetro date deve ter o formato YYYY-MM-DD,YYYY-MM-DD.', ['status' => 400]);
            }
            $date_start = $m[1];
            $date_end = $m[2];
            if ($date_start > $date_end) {
                return new \WP_Error('invalid_date_range', 'A data inicial deve ser menor ou igual à data final.', ['status' => 400]);
            }
        } else {
            // days → range dinâmico
            $days_param = $request->get_param('days');
            $default_days = (int) get_option('zen_bit_default_days', 365);
            $days = ($days_param !== null) ? (int) $days_param : $default_days;

            if ($days < 1 || $days > 730) {
                return new \WP_Error('invalid_days', 'Parâmetro days deve estar entre 1 e 730.', ['status' => 400]);
            }

            // Para mode=upcoming: hoje → hoje+days
            // Para mode=past:     hoje-days → hoje
            // Para mode=all:      não restringe por range
            if ($mode === 'upcoming') {
                $date_start = gmdate('Y-m-d');
                $date_end = gmdate('Y-m-d', strtotime("+{$days} days"));
            } elseif ($mode === 'past') {
                $date_start = gmdate('Y-m-d', strtotime("-{$days} days"));
                $date_end = gmdate('Y-m-d');
            }
            // mode=all: $date_start e $date_end ficam vazios → sem filtro de data
        }

        // ---- limit ----
        $limit_param = $request->get_param('limit');
        $limit = ($limit_param !== null && (int) $limit_param > 0) ? (int) $limit_param : 50;
        $limit = min($limit, 200);

        // ---- lang ----
        $lang = sanitize_text_field((string) ($request->get_param('lang') ?: 'en'));

        return compact('mode', 'date_start', 'date_end', 'limit', 'lang');
    }

    // =========================================================================
    // FETCH DA API BANDSINTOWN (raw)
    // =========================================================================

    /**
     * Chama a API do Bandsintown e retorna eventos raw.
     * Parâmetro $date: string no formato "YYYY-MM-DD,YYYY-MM-DD" ou vazio.
     */
    private static function fetch_from_bandsintown(string $date = ''): array
    {
        $artist_name = self::get_artist_name();
        $artist_id = self::get_artist_id();
        $app_id = self::get_app_id();

        // Suporta artist_name como alternativa ao artist_id
        if ($artist_name !== '') {
            $identifier = urlencode($artist_name);
        } else {
            $identifier = 'id_' . $artist_id;
        }

        $url = "https://rest.bandsintown.com/artists/{$identifier}/events?app_id={$app_id}";
        if ($date !== '') {
            $url .= '&date=' . urlencode($date);
        }

        $t0 = microtime(true);
        $response = wp_remote_get($url, [
            'timeout' => 15,
            'headers' => ['Accept' => 'application/json'],
        ]);
        $fetch_ms = (int) round((microtime(true) - $t0) * 1000);

        if (is_wp_error($response)) {
            error_log('[Zen BIT] wp_remote_get error: ' . $response->get_error_message());
            Zen_BIT_Cache::health_update(false, $fetch_ms, $response->get_error_message(), 0, 0);
            return [];
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $body = (string) wp_remote_retrieve_body($response);

        if ($code < 200 || $code >= 300) {
            $msg = "HTTP {$code}: " . substr($body, 0, 120);
            error_log('[Zen BIT] Bandsintown error: ' . $msg);
            Zen_BIT_Cache::health_update(false, $fetch_ms, $msg, 0, 0);
            return [];
        }

        $data = json_decode($body, true);

        if (!is_array($data)) {
            $msg = 'Invalid JSON: ' . substr($body, 0, 120);
            error_log('[Zen BIT] ' . $msg);
            Zen_BIT_Cache::health_update(false, $fetch_ms, $msg, 0, 0);
            return [];
        }

        if (isset($data['error']) || isset($data['message'])) {
            $msg = (string) ($data['message'] ?? $data['error']);
            error_log('[Zen BIT] API error: ' . $msg);
            Zen_BIT_Cache::health_update(false, $fetch_ms, $msg, 0, 0);
            return [];
        }

        // Às vezes vem objeto único
        if (!isset($data[0]) && isset($data['id'])) {
            $data = [$data];
        }

        if (!is_array($data))
            return [];

        return $data;
    }

    // =========================================================================
    // POOL DE EVENTOS (COM CACHE SWR)
    // =========================================================================

    /**
     * Retorna pool completo de eventos normalizados **como detalhe** (para detail endpoint)
     * ou **como lista** (para list endpoint).
     *
     * Usa SWR: retorna stale enquanto revalida em background.
     *
     * @param string $mode        upcoming|past|all
     * @param string $date_start  YYYY-MM-DD (ou '' para sem restrição)
     * @param string $date_end    YYYY-MM-DD
     * @param bool   $detail      true = normalize_detail, false = normalize_list_item
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

        $cache_key = Zen_BIT_Cache::make_key([
            'mode' => $mode,
            'date_start' => $date_start,
            'date_end' => $date_end,
            'detail' => $detail ? 1 : 0,
        ]);

        return Zen_BIT_Cache::get_with_swr($cache_key, function () use ($mode, $date_start, $date_end, $detail, $include_raw) {
            // Monta o parâmetro date para a API do Bandsintown
            $date_param = '';
            if ($mode === 'upcoming' && $date_start !== '') {
                $date_param = "upcoming";  // BIT aceita "upcoming" nativo
            } elseif ($mode === 'past') {
                $date_param = "past";
            } elseif ($date_start !== '' && $date_end !== '') {
                $date_param = "{$date_start},{$date_end}";
            }

            $raw_events = self::fetch_from_bandsintown($date_param);
            if (empty($raw_events))
                return [];

            $normalized = [];
            foreach ($raw_events as $raw) {
                if (!is_array($raw))
                    continue;
                $normalized[] = $detail
                    ? Zen_BIT_Normalizer::normalize_detail($raw, $include_raw)
                    : Zen_BIT_Normalizer::normalize_list_item($raw);
            }

            return $normalized;
        }, $ttl);
    }

    // =========================================================================
    // FILTROS NO RESULTADO (aplicados após o cache)
    // =========================================================================

    private static function apply_date_filter(array $events, string $mode, string $date_start, string $date_end): array
    {
        if ($mode === 'all' && $date_start === '') {
            return $events; // sem filtro de data
        }

        return array_values(array_filter($events, function ($e) use ($date_start, $date_end) {
            $ts = strtotime((string) ($e['starts_at'] ?? $e['datetime'] ?? ''));
            if (!$ts)
                return false;
            $event_date = gmdate('Y-m-d', $ts);
            if ($date_start !== '' && $event_date < $date_start)
                return false;
            if ($date_end !== '' && $event_date > $date_end)
                return false;
            return true;
        }));
    }

    private static function sort_chronological(array $events, string $mode): array
    {
        usort($events, function ($a, $b) use ($mode) {
            $a_ts = strtotime((string) ($a['starts_at'] ?? $a['datetime'] ?? '')) ?: PHP_INT_MAX;
            $b_ts = strtotime((string) ($b['starts_at'] ?? $b['datetime'] ?? '')) ?: PHP_INT_MAX;
            return $mode === 'past'
                ? $b_ts <=> $a_ts  // past: mais recente primeiro
                : $a_ts <=> $b_ts; // upcoming: mais próximo primeiro
        });
        return $events;
    }

    // =========================================================================
    // ENDPOINT: GET /events (lista enxuta)
    // =========================================================================

    public static function get_events_rest(\WP_REST_Request $request)
    {
        $params = self::parse_filter_params($request);
        if (is_wp_error($params))
            return $params;

        ['mode' => $mode, 'date_start' => $ds, 'date_end' => $de, 'limit' => $limit, 'lang' => $lang] = $params;

        $result = self::get_pool($mode, $ds, $de, false);
        $events = self::apply_date_filter($result['data'], $mode, $ds, $de);
        $events = self::sort_chronological($events, $mode);
        $events = array_slice($events, 0, $limit);

        $response = rest_ensure_response([
            'success' => true,
            'count' => count($events),
            'mode' => $mode,
            'lang' => $lang,
            'events' => $events,
        ]);

        Zen_BIT_Cache::add_headers($response, $result['cache_status'], $result['fetch_ms'], Zen_BIT_Cache::ttl_upcoming());
        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/{id} (detalhe completo)
    // =========================================================================

    public static function get_single_event_rest(\WP_REST_Request $request)
    {
        $id = sanitize_text_field((string) $request->get_param('id'));
        if ($id === '') {
            return new \WP_Error('missing_id', 'ID do evento é obrigatório.', ['status' => 400]);
        }

        $cache_key = Zen_BIT_Cache::make_key(['id' => $id, 'type' => 'detail']);
        $include_raw = (bool) get_option('zen_bit_include_raw_debug', false);

        $result = Zen_BIT_Cache::get_with_swr($cache_key, function () use ($id, $include_raw) {
            // Busca o pool completo e procura por ID
            $raw_events = self::fetch_from_bandsintown('upcoming');
            if (empty($raw_events)) {
                // Tenta buscar também em past caso o evento já tenha passado
                $raw_events = self::fetch_from_bandsintown('past');
            }

            foreach ((array) $raw_events as $raw) {
                if (!is_array($raw))
                    continue;
                if ((string) ($raw['id'] ?? '') === $id) {
                    return [Zen_BIT_Normalizer::normalize_detail($raw, $include_raw)];
                }
            }
            return [];
        }, Zen_BIT_Cache::ttl_detail());

        if (empty($result['data'])) {
            return new \WP_Error('event_not_found', 'Evento não encontrado.', ['status' => 404]);
        }

        $event = $result['data'][0];
        $response = rest_ensure_response(['success' => true, 'event' => $event]);

        Zen_BIT_Cache::add_headers($response, $result['cache_status'], $result['fetch_ms'], Zen_BIT_Cache::ttl_detail());
        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events/{id}/schema
    // =========================================================================

    public static function get_single_event_schema_rest(\WP_REST_Request $request)
    {
        $id = sanitize_text_field((string) $request->get_param('id'));
        if ($id === '') {
            return new \WP_Error('missing_id', 'ID do evento é obrigatório.', ['status' => 400]);
        }

        // Reutiliza o endpoint de detalhe internamente
        $detail_request = new \WP_REST_Request('GET', "/wp-json/zen-bit/v1/events/{$id}");
        $detail_request->set_param('id', $id);
        $detail_response = self::get_single_event_rest($detail_request);

        if (is_wp_error($detail_response))
            return $detail_response;

        $data = $detail_response->get_data();
        $event = $data['event'] ?? [];

        if (empty($event)) {
            return new \WP_Error('event_not_found', 'Evento não encontrado.', ['status' => 404]);
        }

        $schema = Zen_BIT_Normalizer::build_event_schema($event);
        if (empty($schema)) {
            return new \WP_Error('schema_not_available', 'Não foi possível gerar schema para este evento.', ['status' => 422]);
        }

        $payload = [
            '@context' => 'https://schema.org',
            '@graph' => [$schema],
        ];

        $response = rest_ensure_response($payload);
        $response->header('Cache-Control', 'public, max-age=' . Zen_BIT_Cache::ttl_detail());
        return $response;
    }

    // =========================================================================
    // ENDPOINT: GET /events-schema (lista)
    // =========================================================================

    public static function get_events_schema_rest(\WP_REST_Request $request)
    {
        if ((bool) get_option('zen_bit_enable_schema', true) === false) {
            return rest_ensure_response(['@context' => 'https://schema.org', '@graph' => []]);
        }

        $params = self::parse_filter_params($request);
        if (is_wp_error($params))
            return $params;

        ['mode' => $mode, 'date_start' => $ds, 'date_end' => $de, 'limit' => $limit] = $params;

        $result = self::get_pool($mode, $ds, $de, true); // detail=true para ter image/description
        $events = self::apply_date_filter($result['data'], $mode, $ds, $de);
        $events = self::sort_chronological($events, $mode);
        $events = array_slice($events, 0, $limit);

        // Performer entity (reutilizável no @graph)
        $performer_id = home_url('/') . '#djzeneyer';
        $graph = [
            [
                '@type' => 'MusicGroup',
                '@id' => $performer_id,
                'name' => 'DJ Zen Eyer',
                'genre' => 'Brazilian Zouk',
                'url' => home_url('/'),
                'sameAs' => [
                    'https://www.instagram.com/djzeneyer/',
                    'https://soundcloud.com/djzeneyer',
                    'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
                ],
            ],
        ];

        foreach ($events as $event) {
            $schema = Zen_BIT_Normalizer::build_event_schema($event);
            if (empty($schema))
                continue;
            // Usa @id do performer para ligação semântica
            $schema['performer'] = ['@id' => $performer_id];
            $graph[] = $schema;
        }

        $payload = ['@context' => 'https://schema.org', '@graph' => $graph];

        $response = rest_ensure_response($payload);
        Zen_BIT_Cache::add_headers($response, $result['cache_status'], $result['fetch_ms'], Zen_BIT_Cache::ttl_upcoming());
        return $response;
    }

    // =========================================================================
    // ENDPOINT: POST /fetch-now (admin)
    // =========================================================================

    public static function fetch_now_rest(\WP_REST_Request $request)
    {
        // Limpa todo o cache e força um novo fetch
        Zen_BIT_Cache::clear_all();

        $raw = self::fetch_from_bandsintown('upcoming');
        $count = 0;
        $bytes = 0;

        if (!empty($raw)) {
            $normalized = [];
            foreach ($raw as $r) {
                if (!is_array($r))
                    continue;
                $normalized[] = Zen_BIT_Normalizer::normalize_list_item($r);
            }
            $count = count($normalized);
            $bytes = strlen(maybe_serialize($normalized));
            // Salva no cache principal
            $key = Zen_BIT_Cache::make_key(['mode' => 'upcoming', 'date_start' => '', 'date_end' => '', 'detail' => 0]);
            set_transient($key, $normalized, Zen_BIT_Cache::ttl_upcoming());
            update_option(Zen_BIT_Cache::make_fallback_key($key), $normalized, false);
        }

        return rest_ensure_response([
            'success' => true,
            'count' => $count,
            'health' => Zen_BIT_Cache::health_get(),
        ]);
    }
}
