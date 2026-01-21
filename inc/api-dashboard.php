<?php
/**
 * DJ Zen Eyer - Dashboard API Adapter/Facade (Headless WordPress) * Provides activity, tracks, events, and streak endpoints using Zen_RA plugin
  * 
 * Este arquivo atua como ADAPTER/FACADE entre o frontend React e o plugin Zen_RA.
 * 
 * ARQUITETURA:
 * Frontend React -> /wp-json/djzeneyer/v1/* -> api-dashboard.php -> Zen_RA Plugin -> WooCommerce/GamiPress
 * 
 * Endpoints expostos:
 * - GET /djzeneyer/v1/activity/{id} - Feed de atividades (pedidos + conquistas)
 * - GET /djzeneyer/v1/tracks/{id} - Produtos de música comprados
 * - GET /djzeneyer/v1/events/{id} - Ingressos de eventos comprados  
 * - GET /djzeneyer/v1/streak/{id} - Contador de login consecutivo
 * 
 * Nota: O plugin Zen_RA NÃO expõe REST API própria - este arquivo é responsável por isso.
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

    public function get_zen_gamipress($request) {
        $user_id = (int) $request['id'];

        $default_response = [
            'success' => false,
            'stats' => [
                'xp' => 0,
                'level' => 1,
                'rank' => [
                    'current' => 'Zen Novice',
                    'icon' => '',
                    'next_milestone' => 100,
                    'progress_percent' => 0,
                ],
            ],
            'message' => 'GamiPress not active',
        ];

        if (!function_exists('gamipress_get_user_points')) {
            return new WP_REST_Response($default_response, 200);
        }

        $points_type = djz_get_gamipress_points_type_slug();
        $points = (int) gamipress_get_user_points($user_id, $points_type);

        $tiers_payload = djz_get_gamipress_rank_tiers();
        $tiers = $tiers_payload['tiers'];
        $tiers_source = $tiers_payload['source'];
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

        $rank_icon = '';
        if ($tiers_source === 'gamipress' && function_exists('gamipress_get_rank_types') && function_exists('gamipress_get_user_rank')) {
            $rank_types = gamipress_get_rank_types();
            		// NOTA: array_key_first pode retornar ordem não previsível. Use o filtro 'djz_gamipress_rank_slug' para especificar.
		$rank_slug = apply_filters('djz_gamipress_rank_slug', !empty($rank_types) ? array_key_first($rank_types) : null, $rank_types);            if ($rank_slug) {
                $rank_post = gamipress_get_user_rank($user_id, $rank_slug);
                if ($rank_post) {
                    $rank_name = $rank_post->post_title;
                    $rank_icon = get_the_post_thumbnail_url($rank_post->ID, 'thumbnail') ?: '';
                }
            }
        }

        $current_min = $tiers[$level - 1]['min'];
        $progress = ($next > $current_min)
            ? min(100, round((($points - $current_min) / ($next - $current_min)) * 100))
            : 0;

        return new WP_REST_Response([
            'success' => true,
            'stats' => [
                'xp' => $points,
                'level' => $level,
                'rank' => [
                    'current' => $rank_name,
                    'icon' => $rank_icon,
                    'next_milestone' => $next,
                    'progress_percent' => $progress,
                ],
            ],
            'points_type' => $points_type,
        ], 200);
    }

}

new DJZ_Dashboard_API();
