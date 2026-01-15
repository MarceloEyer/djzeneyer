<?php
/**
 * DJ Zen Eyer - Dashboard API Endpoints (Universal Backend)
 * @version 2.2.0 (Headless REST Auth Fix)
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * --------------------------------------------------
 * HEADLESS REST AUTH FIX
 * Allow public GET requests for dashboard data
 * --------------------------------------------------
 */
add_filter('rest_authentication_errors', function ($result) {

    // Se já existe erro, respeita
    if (!empty($result)) {
        return $result;
    }

    // Libera APENAS GET (leitura)
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

        $ns_theme = 'djzeneyer/v1';
        $ns_zenra = 'zen-ra/v1';

        register_rest_route($ns_theme, '/tracks/(?P<id>\d+)', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_user_tracks'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns_theme, '/streak/(?P<id>\d+)', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_user_streak'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns_theme, '/events/(?P<id>\d+)', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_user_events'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns_zenra, '/activity/(?P<id>\d+)', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_zen_activity'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route($ns_zenra, '/gamipress/(?P<id>\d+)', [
            'methods'  => 'GET',
            'callback' => [$this, 'get_zen_gamipress'],
            'permission_callback' => '__return_true',
        ]);
    }

    // --------------------------------------------------
    // CALLBACKS
    // --------------------------------------------------

    public function get_user_tracks($request) {
        return new WP_REST_Response([
            'total' => 0,
            'tracks' => [],
        ], 200);
    }

    public function get_user_streak($request) {
        $user_id = (int) $request['id'];
        $points  = (int) get_user_meta($user_id, '_gamipress_points', true);

        return new WP_REST_Response([
            'current_streak' => 1,
            'best_streak'    => 1,
            'last_login'     => date('Y-m-d H:i:s'),
            'points'         => $points,
        ], 200);
    }

    public function get_user_events($request) {
        return new WP_REST_Response([
            'upcoming' => [],
            'past'     => [],
        ], 200);
    }

    public function get_zen_activity($request) {
        return new WP_REST_Response([
            'success' => true,
            'activities' => [
                [
                    'id'        => 'welcome-1',
                    'type'      => 'achievement',
                    'title'     => __('Bem-vindo à Tribo!', 'djzeneyer'),
                    'description' => __('Conexão com o servidor estabelecida.', 'djzeneyer'),
                    'xp'        => 100,
                    'date'      => date('Y-m-d'),
                    'timestamp' => time(),
                    'meta'      => [],
                ],
            ],
        ], 200);
    }

    public function get_zen_gamipress($request) {

        $user_id = (int) $request['id'];

        if (!function_exists('gamipress_get_user_points')) {
            return new WP_REST_Response([
                'success' => false,
                'message' => __('GamiPress not active', 'djzeneyer'),
            ], 200);
        }

        $points_type = function_exists('djz_get_gamipress_points_type_slug')
            ? djz_get_gamipress_points_type_slug()
            : '';

        $points = (int) gamipress_get_user_points($user_id, $points_type);

        $tiers_payload = function_exists('djz_get_gamipress_rank_tiers')
            ? djz_get_gamipress_rank_tiers()
            : ['tiers' => [], 'source' => 'fallback'];

        $tiers = $tiers_payload['tiers'];

        if (empty($tiers)) {
            return new WP_REST_Response([
                'success' => false,
                'message' => __('No tiers available', 'djzeneyer'),
            ], 200);
        }

        $level = 1;
        $rank_name = $tiers[0]['name'];
        $next = $tiers[0]['next'];

        foreach ($tiers as $index => $tier) {
            if ($points < $tier['min']) {
                break;
            }
            $level = $index + 1;
            $rank_name = $tier['name'];
            $next = $tier['next'];
        }

        $current_min = $tiers[$level - 1]['min'];
        $progress = ($next > $current_min)
            ? min(100, round((($points - $current_min) / ($next - $current_min)) * 100))
            : 0;

        return new WP_REST_Response([
            'success' => true,
            'stats' => [
                'xp'    => $points,
                'level' => $level,
                'rank'  => [
                    'current' => $rank_name,
                    'icon'    => '',
                    'next_milestone'   => $next,
                    'progress_percent' => $progress,
                ],
            ],
            'points_type' => $points_type,
        ], 200);
    }
}

new DJZ_Dashboard_API();
