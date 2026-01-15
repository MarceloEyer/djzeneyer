<?php
if (!defined('ABSPATH')) exit;

class Zen_BIT_API {

    // Defaults seguros
    private const DEFAULT_ARTIST_ID   = '15619775';
    private const DEFAULT_CACHE_TIME  = 86400; // 24h (transient)
    private const DEFAULT_TIMEOUT     = 15;
    private const MAX_LIMIT           = 100;

    private static function get_artist_id(): string {
        $id = (string) get_option('zen_bit_artist_id', self::DEFAULT_ARTIST_ID);
        $id = preg_replace('/[^0-9]/', '', $id);
        return $id !== '' ? $id : self::DEFAULT_ARTIST_ID;
    }

    private static function get_api_key(): string {
        // NÃO usa key default hardcoded
        $key = (string) get_option('zen_bit_api_key', '');
        return trim($key);
    }

    private static function get_cache_time(): int {
        $ttl = (int) get_option('zen_bit_cache_time', self::DEFAULT_CACHE_TIME);
        // Proteções básicas
        if ($ttl < 60) $ttl = 60;
        if ($ttl > 7 * DAY_IN_SECONDS) $ttl = 7 * DAY_IN_SECONDS;
        return $ttl;
    }

    private static function debug_log(string $msg): void {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[Zen BIT] ' . $msg);
        }
    }

    private static function build_url(string $artist_id, string $api_key): string {
        // Bandsintown aceita app_id como identificador do app
        $base = "https://rest.bandsintown.com/artists/id_{$artist_id}/events";
        return add_query_arg(['app_id' => $api_key], $base);
    }

    /**
     * Normaliza payload para garantir array de eventos.
     */
    private static function normalize_events($data): array {
        // Pode vir como objeto único
        if (is_array($data) && !isset($data[0]) && isset($data['id'])) {
            return [$data];
        }

        if (!is_array($data)) return [];

        // Se for array associativo com erro/message
        if (isset($data['error']) || isset($data['message'])) {
            return [];
        }

        // Se for array de eventos
        if (isset($data[0]) && is_array($data[0])) {
            return $data;
        }

        return [];
    }

    /**
     * Sanitiza campos minimamente (evita dados estranhos quebrando seu frontend).
     * Aqui eu mantenho a estrutura original da API, mas removo alguns riscos óbvios.
     */
    private static function sanitize_event(array $event): array {
        // Remoção de campos absurdos ou objetos inválidos não é necessária,
        // mas garantimos que alguns strings não venham nulos.
        foreach (['url', 'datetime', 'title', 'description'] as $k) {
            if (isset($event[$k]) && !is_string($event[$k])) {
                $event[$k] = '';
            }
        }

        // Venue
        if (isset($event['venue']) && is_array($event['venue'])) {
            foreach (['name','city','region','country'] as $k) {
                if (isset($event['venue'][$k]) && !is_string($event['venue'][$k])) {
                    $event['venue'][$k] = '';
                }
            }
        }

        // Offers
        if (isset($event['offers']) && is_array($event['offers'])) {
            $event['offers'] = array_values(array_filter($event['offers'], function($offer) {
                return is_array($offer) && isset($offer['url']) && is_string($offer['url']);
            }));
        }

        return $event;
    }

    /**
     * Retorna eventos (cacheados via transient).
     */
    public static function get_events($limit = 50): array {
        $limit = (int) $limit;
        if ($limit <= 0) $limit = 50;
        if ($limit > self::MAX_LIMIT) $limit = self::MAX_LIMIT;

        $artist_id = self::get_artist_id();
        $cache_key = 'zen_bit_events_' . $artist_id;

        $cached = get_transient($cache_key);
        if (is_array($cached) && !empty($cached)) {
            self::debug_log("Cache hit: " . count($cached) . " events");
            return array_slice($cached, 0, $limit);
        }

        $api_key = self::get_api_key();
        if ($api_key === '') {
            self::debug_log("Missing API key (zen_bit_api_key). Returning empty.");
            return [];
        }

        $url = self::build_url($artist_id, $api_key);

        $response = wp_remote_get($url, array(
            'timeout' => self::DEFAULT_TIMEOUT,
            'headers' => array(
                'Accept'     => 'application/json',
                'User-Agent' => 'ZenBIT/' . ZEN_BIT_VERSION . ' (' . home_url('/') . ')',
            ),
        ));

        if (is_wp_error($response)) {
            self::debug_log("HTTP error: " . $response->get_error_message());
            return [];
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $body = (string) wp_remote_retrieve_body($response);

        if ($code < 200 || $code >= 300) {
            self::debug_log("Non-2xx status: {$code}. Body head: " . substr($body, 0, 200));
            return [];
        }

        $decoded = json_decode($body, true);
        $events  = self::normalize_events($decoded);

        if (empty($events)) {
            self::debug_log("No valid events after normalize. Body head: " . substr($body, 0, 200));
            return [];
        }

        // Sanitiza cada evento (leve)
        $events = array_map(function($ev) {
            return is_array($ev) ? self::sanitize_event($ev) : [];
        }, $events);

        // Remove vazios
        $events = array_values(array_filter($events, function($ev) {
            return is_array($ev) && !empty($ev);
        }));

        if (empty($events)) {
            self::debug_log("Events empty after sanitize.");
            return [];
        }

        // Cacheia TODOS, aplica limit no retorno
        set_transient($cache_key, $events, self::get_cache_time());
        self::debug_log("Cached " . count($events) . " events for artist {$artist_id}");

        return array_slice($events, 0, $limit);
    }

    /**
     * REST endpoint: GET /wp-json/zen-bit/v1/events?limit=15
     */
    public static function get_events_rest($request) {
        $limit  = $request->get_param('limit');
        $events = self::get_events($limit);

        $response = rest_ensure_response(array(
            'success' => true,
            'count'   => count($events),
            'events'  => $events,
        ));

        // Browser cache curto (você já tem transient longo no servidor)
        // Isso melhora UX sem “congelar” resultados por 24h no cliente.
        $browser_cache = 300; // 5 min
        $response->header('Cache-Control', 'public, max-age=' . $browser_cache);
        $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $browser_cache) . ' GMT');

        return $response;
    }

    public static function clear_cache(): void {
        $artist_id = self::get_artist_id();
        delete_transient('zen_bit_events_' . $artist_id);
        self::debug_log("Cache cleared for artist {$artist_id}");
    }
}
