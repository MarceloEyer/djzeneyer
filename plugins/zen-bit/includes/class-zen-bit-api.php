<?php
/**
 * Zen BIT - API Layer
 * File: wp-content/plugins/zen-bit/includes/class-zen-bit-api.php
 *
 * Responsabilidades:
 * - Buscar e cachear eventos do Bandsintown
 * - Normalizar os dados para consumo no site e em bots
 * - Entregar REST:
 *   GET /wp-json/zen-bit/v1/events
 *   GET /wp-json/zen-bit/v1/events-schema
 *
 * Observações:
 * - NÃO define zen_bit_init() nem hooks do plugin (evita redeclare)
 * - NÃO carrega textdomain (evita rodar cedo)
 */

if (!defined('ABSPATH')) exit;

class Zen_BIT_API {

    // =========================
    // OPTIONS
    // =========================

    private static function get_artist_id(): string {
        $id = (string) get_option('zen_bit_artist_id', '15619775');
        return trim($id) !== '' ? trim($id) : '15619775';
    }

    private static function get_api_key(): string {
        // Ideal: setar via admin e não hardcode.
        $key = (string) get_option('zen_bit_api_key', '');
        return trim($key);
    }

    private static function get_cache_time(): int {
        // padrão: 24h
        $ttl = (int) get_option('zen_bit_cache_time', 86400);
        if ($ttl < 60) $ttl = 60;
        return $ttl;
    }

    private static function cache_key(): string {
        return 'zen_bit_events_' . self::get_artist_id();
    }

    // =========================
    // SANITIZATION / NORMALIZATION
    // =========================

    private static function sanitize_url($url): string {
        if (empty($url) || !is_string($url)) return '';
        $url = trim($url);

        // relative path ok
        if (strpos($url, '/') === 0) return $url;

        $parsed = wp_parse_url($url);
        if (!$parsed || empty($parsed['scheme'])) return '';

        $scheme = strtolower((string)$parsed['scheme']);
        if (!in_array($scheme, array('http', 'https'), true)) return '';

        return esc_url_raw($url);
    }

    private static function sanitize_text($text, int $max = 300): string {
        if (!is_string($text)) return '';
        $text = wp_strip_all_tags($text);
        $text = trim(preg_replace('/\s+/', ' ', $text));
        if ($max > 0 && strlen($text) > $max) {
            $text = mb_substr($text, 0, $max) . '…';
        }
        return $text;
    }

    private static function parse_datetime_iso($datetime): string {
        if (empty($datetime) || !is_string($datetime)) return '';
        $ts = strtotime($datetime);
        if (!$ts) return '';
        return wp_date('c', $ts);
    }

    private static function build_title(array $event): string {
        if (!empty($event['title']) && is_string($event['title'])) {
            return self::sanitize_text($event['title'], 180);
        }
        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();
        $venue_name = !empty($venue['name']) ? self::sanitize_text((string)$venue['name'], 120) : 'Event';
        return self::sanitize_text(sprintf('DJ Zen Eyer at %s', $venue_name), 180);
    }

    private static function build_description(array $event): string {
        if (!empty($event['description']) && is_string($event['description'])) {
            return self::sanitize_text($event['description'], 280);
        }
        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();
        $vname = !empty($venue['name']) ? self::sanitize_text((string)$venue['name'], 120) : 'venue';
        $city = !empty($venue['city']) ? self::sanitize_text((string)$venue['city'], 80) : '';
        $country = !empty($venue['country']) ? self::sanitize_text((string)$venue['country'], 80) : '';
        $place = trim($city . (empty($country) ? '' : ', ' . $country));
        return self::sanitize_text(
            sprintf('DJ Zen Eyer performing live at %s%s.', $vname, $place ? (' in ' . $place) : ''),
            280
        );
    }

    private static function build_image(array $event): string {
        if (!empty($event['image']) && is_string($event['image'])) {
            $img = self::sanitize_url($event['image']);
            if ($img) return $img;
        }
        return 'https://djzeneyer.com/images/event-default.jpg';
    }

    private static function build_external_url(array $event): string {
        if (!empty($event['url']) && is_string($event['url'])) {
            return self::sanitize_url($event['url']);
        }
        return '';
    }

    private static function build_ticket_url(array $event): string {
        // Bandsintown costuma ter offers[0].url (às vezes)
        if (!empty($event['offers']) && is_array($event['offers'])) {
            $first = $event['offers'][0] ?? null;
            if (is_array($first) && !empty($first['url']) && is_string($first['url'])) {
                $u = self::sanitize_url($first['url']);
                if ($u) return $u;
            }
        }
        $external = self::build_external_url($event);
        return $external ?: '';
    }

    private static function normalize_venue(array $event): array {
        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();

        return array(
            'name'    => !empty($venue['name']) ? self::sanitize_text((string)$venue['name'], 140) : '',
            'city'    => !empty($venue['city']) ? self::sanitize_text((string)$venue['city'], 80) : '',
            'region'  => !empty($venue['region']) ? self::sanitize_text((string)$venue['region'], 80) : '',
            'country' => !empty($venue['country']) ? self::sanitize_text((string)$venue['country'], 80) : '',
            'latitude'  => isset($venue['latitude']) ? (string)$venue['latitude'] : '',
            'longitude' => isset($venue['longitude']) ? (string)$venue['longitude'] : '',
        );
    }

    private static function normalize_event(array $raw): array {
        $datetime_raw = (!empty($raw['datetime']) && is_string($raw['datetime'])) ? $raw['datetime'] : '';
        $datetime_iso = self::parse_datetime_iso($datetime_raw);

        $title = self::build_title($raw);
        $desc  = self::build_description($raw);
        $img   = self::build_image($raw);

        $venue = self::normalize_venue($raw);

        $external = self::build_external_url($raw);
        $tickets  = self::build_ticket_url($raw);

        // Mantém id original se existir
        $id = '';
        if (!empty($raw['id'])) $id = (string)$raw['id'];

        // Offers normalizado (só o que importa)
        $offers = array();
        if (!empty($tickets)) {
            $offers[] = array('url' => $tickets);
        }

        return array(
            'id' => $id,
            'title' => $title,
            'description' => $desc,
            'image' => $img,
            'datetime' => $datetime_iso ?: $datetime_raw, // mantém raw se não parseou
            'datetime_iso' => $datetime_iso,
            'venue' => $venue,
            'url' => $external,
            'offers' => $offers,
        );
    }

    private static function filter_upcoming_events(array $events): array {
        $now = current_time('timestamp');
        $today = strtotime('today', $now);

        $filtered = array_filter($events, function ($event) use ($today) {
            if (!is_array($event)) return false;
            $date_str = '';
            if (!empty($event['datetime_iso']) && is_string($event['datetime_iso'])) {
                $date_str = $event['datetime_iso'];
            } elseif (!empty($event['datetime']) && is_string($event['datetime'])) {
                $date_str = $event['datetime'];
            }

            if ($date_str === '') return false;

            $event_ts = strtotime($date_str);
            if (!$event_ts) return false;

            return $event_ts >= $today;
        });

        return array_values($filtered);
    }

    // =========================
    // FETCH + CACHE
    // =========================

    private static function fetch_from_bandsintown(): array {
        $artist_id = self::get_artist_id();
        $api_key = self::get_api_key();

        // Bandsintown exige app_id. Se estiver vazio, ainda pode funcionar em alguns casos,
        // mas o correto é configurar.
        $app_id = $api_key !== '' ? $api_key : 'djzeneyer';

        $url = "https://rest.bandsintown.com/artists/id_{$artist_id}/events?app_id={$app_id}";

        $response = wp_remote_get($url, array(
            'timeout' => 15,
            'headers' => array('Accept' => 'application/json'),
        ));

        if (is_wp_error($response)) {
            error_log('Zen BIT: wp_remote_get error - ' . $response->get_error_message());
            return array();
        }

        $code = (int) wp_remote_retrieve_response_code($response);
        $body = (string) wp_remote_retrieve_body($response);

        if ($code < 200 || $code >= 300) {
            error_log('Zen BIT: Bandsintown HTTP ' . $code . ' - ' . substr($body, 0, 200));
            return array();
        }

        $data = json_decode($body, true);

        if (!is_array($data)) {
            error_log('Zen BIT: Invalid JSON from Bandsintown - ' . substr($body, 0, 200));
            return array();
        }

        // erro padrão do Bandsintown
        if (isset($data['error']) || isset($data['message'])) {
            error_log('Zen BIT: API error - ' . (string)($data['message'] ?? $data['error']));
            return array();
        }

        // às vezes vem um objeto único
        if (!isset($data[0]) && isset($data['id'])) {
            $data = array($data);
        }

        if (!is_array($data)) return array();

        return $data;
    }

    public static function get_events(int $limit = 50): array {
        if ($limit <= 0) $limit = 50;
        if ($limit > 100) $limit = 100;

        $cache_key = self::cache_key();
        $cached = get_transient($cache_key);

        if (is_array($cached) && !empty($cached)) {
            return array_slice($cached, 0, $limit);
        }

        $raw_events = self::fetch_from_bandsintown();
        if (empty($raw_events)) {
            // cache “negativo” curto pra evitar martelar API
            set_transient($cache_key, array(), 5 * 60);
            return array();
        }

        $normalized = array();
        foreach ($raw_events as $raw) {
            if (!is_array($raw)) continue;
            $normalized[] = self::normalize_event($raw);
        }

        $normalized = self::filter_upcoming_events($normalized);

        // Cacheia tudo normalizado
        set_transient($cache_key, $normalized, self::get_cache_time());

        return array_slice($normalized, 0, $limit);
    }

    public static function clear_cache(): void {
        delete_transient(self::cache_key());
    }

    // =========================
    // JSON-LD GRAPH
    // =========================

    public static function get_events_schema_graph(int $limit = 25): array {
        if ($limit <= 0) $limit = 25;
        if ($limit > 100) $limit = 100;

        $events = self::get_events($limit);

        $graph = array();

        // Performer entity (reutilizável)
        $performer_id = home_url('/') . '#djzeneyer';
        $graph[] = array(
            '@type' => 'MusicGroup',
            '@id' => $performer_id,
            'name' => 'DJ Zen Eyer',
            'genre' => 'Brazilian Zouk',
            'url' => home_url('/'),
            'sameAs' => array(
                'https://www.instagram.com/djzeneyer/',
                'https://soundcloud.com/djzeneyer',
                'https://www.bandsintown.com/a/15552355'
            )
        );

        foreach ((array)$events as $event) {
            if (!is_array($event)) continue;

            $start = !empty($event['datetime_iso']) ? (string)$event['datetime_iso'] : '';
            if ($start === '') {
                // SEM startDate real, não entra no schema (evita lixo pro Google)
                continue;
            }

            $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();

            $url = !empty($event['url']) ? (string)$event['url'] : '';
            $img = !empty($event['image']) ? (string)$event['image'] : 'https://djzeneyer.com/images/event-default.jpg';

            $tickets = '';
            if (!empty($event['offers'][0]['url'])) $tickets = (string)$event['offers'][0]['url'];

            $schema = array(
                '@type' => 'MusicEvent',
                'name' => self::sanitize_text((string)($event['title'] ?? ''), 180),
                'description' => self::sanitize_text((string)($event['description'] ?? ''), 280),
                'startDate' => $start,
                'eventStatus' => 'https://schema.org/EventScheduled',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'image' => $img,
                'location' => array(
                    '@type' => 'Place',
                    'name' => self::sanitize_text((string)($venue['name'] ?? ''), 140),
                    'address' => array(
                        '@type' => 'PostalAddress',
                        'addressLocality' => self::sanitize_text((string)($venue['city'] ?? ''), 80),
                        'addressRegion' => self::sanitize_text((string)($venue['region'] ?? ''), 80),
                        'addressCountry' => self::sanitize_text((string)($venue['country'] ?? ''), 80),
                    )
                ),
                'performer' => array('@id' => $performer_id),
            );

            if (!empty($url)) {
                $schema['sameAs'] = $url;
            }

            if (!empty($tickets)) {
                $schema['offers'] = array(
                    '@type' => 'Offer',
                    'url' => $tickets,
                    'availability' => 'https://schema.org/InStock',
                );
            }

            // limpa campos vazios superficialmente
            $schema = array_filter($schema, function($v) {
                return !($v === '' || $v === null || $v === array());
            });

            $graph[] = $schema;
        }

        if (count($graph) <= 1) {
            // só performer => não vale a pena soltar schema
            return array();
        }

        return array(
            '@context' => 'https://schema.org',
            '@graph' => $graph
        );
    }

    // =========================
    // REST ENDPOINTS
    // =========================

    public static function get_events_rest(\WP_REST_Request $request) {
        $limit = (int) ($request->get_param('limit') ?: 50);
        $events = self::get_events($limit);

        $response = rest_ensure_response(array(
            'success' => true,
            'count' => count($events),
            'events' => $events
        ));

        // Cache headers para browser/CDN (opcional)
        $cache_time = self::get_cache_time();
        $response->header('Cache-Control', 'public, max-age=' . $cache_time);
        $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $cache_time) . ' GMT');

        return $response;
    }

    public static function get_events_schema_rest(\WP_REST_Request $request) {
        $limit = (int) ($request->get_param('limit') ?: 25);
        $graph = self::get_events_schema_graph($limit);

        $response = rest_ensure_response($graph ? $graph : array(
            '@context' => 'https://schema.org',
            '@graph' => array()
        ));

        // Cache headers
        $cache_time = self::get_cache_time();
        $response->header('Cache-Control', 'public, max-age=' . $cache_time);
        $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $cache_time) . ' GMT');

        return $response;
    }
}
