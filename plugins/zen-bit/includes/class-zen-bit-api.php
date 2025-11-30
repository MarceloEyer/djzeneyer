<?php
if (!defined('ABSPATH')) exit;

class Zen_BIT_API {
    
    private static function get_artist_id() {
        return get_option('zen_bit_artist_id', '15619775');
    }
    
    private static function get_api_key() {
        return get_option('zen_bit_api_key', 'f8f1216ea03be95a3ea91c7ebe7117e7');
    }
    
    private static function get_cache_time() {
        return (int) get_option('zen_bit_cache_time', 3600);
    }
    
    public static function get_events($limit = 50) {
        $cache_key = 'zen_bit_events_' . self::get_artist_id();
        $cached = get_transient($cache_key);
        
        if (false !== $cached) {
            // Apply limit to cached data
            return array_slice($cached, 0, $limit);
        }
        
        $artist_id = self::get_artist_id();
        $api_key = self::get_api_key();
        $url = "https://rest.bandsintown.com/artists/id_{$artist_id}/events?app_id={$api_key}";
        
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
        $data = json_decode($body, true);
        
        // Handle error responses from Bandsintown
        if (!is_array($data)) {
            error_log('Zen BIT: Invalid response from Bandsintown API - ' . substr($body, 0, 200));
            return array();
        }
        
        // Check if it's an error response
        if (isset($data['error']) || isset($data['message'])) {
            error_log('Zen BIT: API error - ' . ($data['message'] ?? $data['error']));
            return array();
        }
        
        // Bandsintown sometimes returns single event as object, not array
        if (!isset($data[0]) && isset($data['id'])) {
            error_log('Zen BIT: Converting single event object to array');
            $data = array($data);
        }
        
        // Final validation
        if (!is_array($data) || empty($data)) {
            error_log('Zen BIT: No valid events after processing');
            return array();
        }
        
        // Cache ALL events, apply limit when serving
        error_log('Zen BIT: Caching ' . count($data) . ' events');
        set_transient($cache_key, $data, self::get_cache_time());
        
        // Return limited events
        $events = array_slice($data, 0, $limit);
        error_log('Zen BIT: Returning ' . count($events) . ' events (limit: ' . $limit . ')');
        
        return $events;
    }
    
    public static function get_events_rest($request) {
        $limit = $request->get_param('limit') ?: 50;
        $events = self::get_events($limit);
        
        $response = rest_ensure_response(array(
            'success' => true,
            'count' => count($events),
            'events' => $events
        ));
        
        // Add cache headers for browser caching
        $cache_time = self::get_cache_time();
        $response->header('Cache-Control', 'public, max-age=' . $cache_time);
        $response->header('Expires', gmdate('D, d M Y H:i:s', time() + $cache_time) . ' GMT');
        
        return $response;
    }
    
    public static function clear_cache() {
        $artist_id = self::get_artist_id();
        delete_transient('zen_bit_events_' . $artist_id);
    }
}
