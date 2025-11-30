<?php
if (!defined('ABSPATH')) exit;

class BIT_Zen_API {
    
    private static function get_artist_id() {
        return get_option('bit_zen_artist_id', '15552355');
    }
    
    private static function get_cache_time() {
        return (int) get_option('bit_zen_cache_time', 3600);
    }
    
    public static function get_events($limit = 50) {
        $cache_key = 'bit_zen_events_' . self::get_artist_id();
        $cached = get_transient($cache_key);
        
        if (false !== $cached) {
            return $cached;
        }
        
        $artist_id = self::get_artist_id();
        $url = "https://rest.bandsintown.com/artists/id_{$artist_id}/events?app_id=djzeneyer";
        
        $response = wp_remote_get($url, array(
            'timeout' => 15,
            'headers' => array(
                'Accept' => 'application/json'
            )
        ));
        
        if (is_wp_error($response)) {
            return array();
        }
        
        $body = wp_remote_retrieve_body($response);
        $events = json_decode($body, true);
        
        if (!is_array($events)) {
            return array();
        }
        
        $events = array_slice($events, 0, $limit);
        
        set_transient($cache_key, $events, self::get_cache_time());
        
        return $events;
    }
    
    public static function get_events_rest($request) {
        $limit = $request->get_param('limit') ?: 50;
        $events = self::get_events($limit);
        
        return rest_ensure_response(array(
            'success' => true,
            'count' => count($events),
            'events' => $events
        ));
    }
    
    public static function clear_cache() {
        $artist_id = self::get_artist_id();
        delete_transient('bit_zen_events_' . $artist_id);
    }
}
