<?php
/**
 * DJ Zen Eyer - Dashboard API (Headless Facade)
 * Provides activity, tracks, events, and streak endpoints using Zen_RA plugin
 * @version 4.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * --------------------------------------------------
 * HEADLESS REST AUTH FIX
 * Allow public GET requests (read-only)
 * --------------------------------------------------
 */
add_filter('rest_authentication_errors', function ($result) {
    if (!empty($result)) return $result;

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
        return null;
    }

    return $result;
});

class DJZ_Dashboard_API {

    public function __construct() {
        add_action('rest_api_init', [$this, 'register_routes']);
    }

    public function register_routes() {

        $ns = 'djzeneyer/v1';

        // Note: /gamipress endpoint is registered in inc/api.php
        // These endpoints use Zen_RA plugin for activity tracking

        register_rest_route($ns, '/activity/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'activity'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns, '/tracks/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'tracks'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns, '/events/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'events'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns, '/streak/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'streak'],
            'permission_callback' => '__return_true',
        ]);
    }

    // --------------------------------------------------
    // ADAPTER METHODS (PLUGIN → REACT)
    // --------------------------------------------------

    private function plugin(): ?Zen_RA {
        return class_exists('Zen_RA') ? Zen_RA::get_instance() : null;
    }

    public function activity($request) {
        $plugin = $this->plugin();
        if (!$plugin || !method_exists($plugin, 'get_activity_feed')) {
            return rest_ensure_response(['success' => false, 'activities' => []]);
        }

        return rest_ensure_response(
            $plugin->get_activity_feed(['id' => (int)$request['id']])
        );
    }

    public function tracks($request) {
        $plugin = $this->plugin();
        if (!$plugin || !method_exists($plugin, 'get_user_tracks')) {
            return rest_ensure_response(['success' => true, 'tracks' => []]);
        }

        return rest_ensure_response(
            $plugin->get_user_tracks(['id' => (int)$request['id']])
        );
    }

    public function events($request) {
        $plugin = $this->plugin();
        if (!$plugin || !method_exists($plugin, 'get_user_events')) {
            return rest_ensure_response(['success' => true, 'events' => []]);
        }

        return rest_ensure_response(
            $plugin->get_user_events(['id' => (int)$request['id']])
        );
    }

    public function streak($request) {
        $plugin = $this->plugin();
        if (!$plugin || !method_exists($plugin, 'get_streak_data')) {
            return rest_ensure_response(['success' => true, 'streak' => 0]);
        }

        return rest_ensure_response(
            $plugin->get_streak_data(['id' => (int)$request['id']])
        );
    }
}

new DJZ_Dashboard_API();
