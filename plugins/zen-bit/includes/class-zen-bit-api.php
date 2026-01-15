<?php
if (!defined('ABSPATH')) exit;

class Zen_BIT_API {

    // =========================
    // Options
    // =========================

    private static function get_artist_id() {
        $id = get_option('zen_bit_artist_id', '15619775');
        return is_string($id) ? trim($id) : (string)$id;
    }

    private static function get_api_key() {
        $key = get_option('zen_bit_api_key', '');
        return is_string($key) ? trim($key) : '';
    }

    private static function get_cache_time() {
        $t = (int) get_option('zen_bit_cache_time', 86400); // 24h default
        if ($t < 60) $t = 60;
        if ($t > 7 * 86400) $t = 7 * 86400; // max 7d
        return $t;
    }

    private static function get_cache_key() {
        return 'zen_bit_events_' . self::get_artist_id();
    }

    // =========================
    // Sanitizers / Builders
    // =========================

    private static function sanitize_text($value, $max = 300) {
        if (!is_string($value)) return '';
        $value = wp_strip_all_tags($value);
        $value = trim($value);
        if ($max > 0 && strlen($value) > $max) {
            $value = mb_substr($value, 0, $max);
        }
        return $value;
    }

    private static function sanitize_url($url) {
        if (empty($url) || !is_string($url)) return '';
        $url = trim($url);

        // allow relative
        if (strpos($url, '/') === 0) return $url;

        $parsed = wp_parse_url($url);
        if (!$parsed || empty($parsed['scheme'])) return '';

        $scheme = strtolower($parsed['scheme']);
        if (!in_array($scheme, array('http', 'https'), true)) return '';

        return esc_url_raw($url);
    }

    private static function to_iso8601($datetime) {
        if (empty($datetime) || !is_string($datetime)) return '';
        $ts = strtotime($datetime);
        if (!$ts) return '';
        return wp_date('c', $ts);
    }

    private static function safe_event_image($event) {
        if (!empty($event['image']) && is_string($event['image'])) {
            $img = self::sanitize_url($event['image']);
            if ($img) return $img;
        }
        return home_url('/images/event-default.jpg');
    }

    private static function safe_event_title($event) {
        $venue = (isset($event['venue']) && is_array($event['venue'])) ? $event['venue'] : array();
        if (!empty($event['title']) && is_string($event['title'])) {
            return self::sanitize_text($event['title'], 180);
        }
        $venue_name = !empty($venue['name']) ? self::sanitize_text((string)$venue['name'], 120) : 'Event';
        return self::sanitize_text(sprintf('DJ Zen Eyer at %s', $venue_name), 180);
    }

    private static function safe_event_description($event) {
        $venue = (isset($event['venue']) && is_array($event['venue'])) ? $event['venue'] : array();

        if (!empty($event['description']) && is_string($event['description'])) {
            return self::sanitize_text($event['description'], 300);
        }

        $venue_name = !empty($venue['name']) ? self::sanitize_text((string)$venue['name'], 120) : 'venue';
        $city = !empty($venue['city']) ? self::sanitize_text((string)$venue['city'], 80) : '';
        $country = !empty($venue['country']) ? self::sanitize_text((string)$venue['country'], 80) : '';
        $place = trim($city . (empty($country) ? '' : ', ' . $country));

        $suffix = $place ? (' in ' . $place) : '';
        return self::sanitize_text(sprintf('Official event: DJ Zen Eyer performing live at %s%s.', $venue_name, $suffix), 300);
    }

    private static function safe_ticket_url($event) {
        if (!empty($event['offers'][0]['url']) && is_string($event['offers'][0]['url'])) {
            $u = self::sanitize_url($event['offers'][0]['url']);
            if ($u) return $u;
        }
        if (!empty($event['url']) && is_string($event['url'])) {
            $u = self::sanitize_url($event['url']);
            if ($u) return $u;
        }
        return '';
    }

    // =========================
    // Fetch + Cache
    // =========================

    public static function get_events($limit = 50) {
        $limit = (int) $limit;
        if ($limit <= 0) $limit = 50;
        if ($limit > 100) $limit = 100;

        $cache_key = self::get_cache_key();
        $cached = get_transient($cache_key);

        if (false !== $cached && is_array($cached)) {
            return array_slice($cached, 0, $limit);
        }

        $artist_id = self::get_artist_id();
        $api_key = self::get_api_key();

        if (empty($artist_id) || empty($api_key)) {
            error_log('Zen BIT: Missing artist_id or api_key.');
            return array();
        }

        $url = "https://rest.bandsintown.com/artists/id_{$artist_id}/events?app_id={$api_key}";

        $response = wp_remote_get($url, array(
            'timeout' => 15,
            'headers' => array('Accept' => 'application/json')
        ));

        if (is_wp_error($response)) {
            error_log('Zen BIT: wp_remote_get error - ' . $response->get_error_message());
            return array();
        }

        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        if (!is_array($data)) {
            error_log('Zen BIT: Invalid JSON from Bandsintown - ' . substr((string)$body, 0, 200));
            return array();
        }

        // error responses
        if (isset($data['error']) || isset($data['message'])) {
            error_log('Zen BIT: API error - ' . (string)($data['message'] ?? $data['error']));
            return array();
        }

        // sometimes single object
        if (!isset($data[0]) && isset($data['id'])) {
            $data = array($data);
        }

        if (empty($data) || !is_array($data)) {
            return array();
        }

        // Cache ALL events
        set_transient($cache_key, $data, self::get_cache_time());

        return array_slice($data, 0, $limit);
    }

    public static function clear_cache() {
        delete_transient(self::get_cache_key());
    }

    // =========================
    // REST: /events (raw)
    // =========================

    public static function get_events_rest($request) {
        $limit = $request->get_param('limit');
        $limit = $limit !== null ? (int)$limit : 50;

        $events = self::get_events($limit);

        $response = rest_ensure_response(array(
            'success' => true,
            'count' => count($events),
            'events' => $events
        ));

        $cache_time = self::get_cache_time();
        $response->header('Cache-Control', 'public, max-age=' . $cache_time);
        $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $cache_time) . ' GMT');

        return $response;
    }

    // =========================
    // REST: /events-schema (premium JSON-LD)
    // =========================

    public static function get_events_schema_rest($request) {
        $limit = $request->get_param('limit');
        $limit = $limit !== null ? (int)$limit : 50;

        $graph = self::get_events_schema_graph($limit);

        $response = rest_ensure_response($graph);

        $cache_time = self::get_cache_time();
        $response->header('Cache-Control', 'public, max-age=' . $cache_time);
        $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $cache_time) . ' GMT');

        return $response;
    }

    // =========================
    // Premium SEO Graph builder
    // =========================

    public static function get_events_schema_graph($limit = 25) {
        $limit = (int)$limit;
        if ($limit <= 0) $limit = 25;
        if ($limit > 100) $limit = 100;

        $events = self::get_events($limit);

        $site = home_url('/');
        $events_page = home_url('/events/');
        $logo = $site . 'images/zen-eyer-profile.jpg';
        $og = $site . 'images/events-og.jpg';

        $graph = array();

        // WebSite
        $graph[] = array(
            '@type' => 'WebSite',
            '@id' => $site . '#website',
            'url' => $site,
            'name' => 'DJ Zen Eyer',
            'inLanguage' => 'en'
        );

        // Performer entity
        $graph[] = array(
            '@type' => 'MusicGroup',
            '@id' => $site . '#djzeneyer',
            'name' => 'DJ Zen Eyer',
            'genre' => 'Brazilian Zouk',
            'url' => $site,
            'image' => $logo,
            'sameAs' => array(
                'https://www.instagram.com/djzeneyer/',
                'https://soundcloud.com/djzeneyer',
                'https://www.bandsintown.com/a/15552355'
            )
        );

        // CollectionPage for events
        $graph[] = array(
            '@type' => 'CollectionPage',
            '@id' => $events_page . '#webpage',
            'url' => $events_page,
            'name' => 'World Tour & Events | DJ Zen Eyer',
            'description' => 'Official events and performances by DJ Zen Eyer (Brazilian Zouk DJ).',
            'isPartOf' => array('@id' => $site . '#website'),
            'primaryImageOfPage' => array(
                '@type' => 'ImageObject',
                'url' => $og
            )
        );

        // Each event => MusicEvent
        foreach ($events as $event) {
            if (!is_array($event)) continue;

            $venue = (isset($event['venue']) && is_array($event['venue'])) ? $event['venue'] : array();

            $start = self::to_iso8601($event['datetime'] ?? '');
            if (empty($start)) {
                // se não tiver data válida, não cria schema (evita lixo)
                continue;
            }

            $title = self::safe_event_title($event);
            $desc  = self::safe_event_description($event);
            $img   = self::safe_event_image($event);
            $tickets = self::safe_ticket_url($event);

            $city = !empty($venue['city']) ? self::sanitize_text((string)$venue['city'], 80) : '';
            $region = !empty($venue['region']) ? self::sanitize_text((string)$venue['region'], 80) : '';
            $country = !empty($venue['country']) ? self::sanitize_text((string)$venue['country'], 80) : '';
            $venue_name = !empty($venue['name']) ? self::sanitize_text((string)$venue['name'], 120) : 'Venue';

            // canonical “estável” para event (usa Bandsintown url se existir; senão, ancora em /events/)
            $event_url = '';
            if (!empty($event['url']) && is_string($event['url'])) {
                $event_url = self::sanitize_url($event['url']);
            }
            if (empty($event_url)) {
                $event_url = $events_page . '#event-' . md5($title . '|' . $start);
            }

            $event_schema = array(
                '@type' => 'MusicEvent',
                '@id' => $event_url . '#event',
                'name' => $title,
                'description' => $desc,
                'startDate' => $start,
                'eventStatus' => 'https://schema.org/EventScheduled',
                'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
                'url' => $event_url,
                'image' => $img,
                'location' => array(
                    '@type' => 'Place',
                    'name' => $venue_name,
                    'address' => array(
                        '@type' => 'PostalAddress',
                        'addressLocality' => $city,
                        'addressRegion' => $region,
                        'addressCountry' => $country
                    )
                ),
                'performer' => array(
                    '@id' => $site . '#djzeneyer'
                )
            );

            if (!empty($tickets)) {
                $event_schema['offers'] = array(
                    '@type' => 'Offer',
                    'url' => $tickets,
                    'availability' => 'https://schema.org/InStock'
                );
            }

            $graph[] = $event_schema;
        }

        return array(
            '@context' => 'https://schema.org',
            '@graph' => $graph
        );
    }
}
