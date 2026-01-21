<?php
/**
 * DJ Zen Eyer - Dashboard API Adapter/Facade (Headless WordPress)
 * @version 4.2.0 - Added error handling for all endpoints
 */

if (!defined('ABSPATH')) {
    exit;
}

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

    private function plugin(): ?Zen_RA {
        return class_exists('Zen_RA') ? Zen_RA::get_instance() : null;
    }

    // ✅ FIX: Wrapped em try-catch
    public function activity($request) {
        try {
            $plugin = $this->plugin();
            if (!$plugin || !method_exists($plugin, 'get_activity_feed')) {
                return rest_ensure_response(['success' => false, 'activities' => []]);
            }

            $result = $plugin->get_activity_feed(['id' => (int)$request['id']]);
            
            // Garantir que sempre retorna array de activities
            if (!isset($result['activities']) || !is_array($result['activities'])) {
                $result['activities'] = [];
            }
            
            return rest_ensure_response($result);
            
        } catch (Exception $e) {
            error_log('[DJZ_Dashboard_API] Activity error: ' . $e->getMessage());
            return rest_ensure_response([
                'success' => false, 
                'activities' => [],
                'error' => $e->getMessage()
            ]);
        }
    }

    public function tracks($request) {
        try {
            $plugin = $this->plugin();
            if (!$plugin || !method_exists($plugin, 'get_user_tracks')) {
                return rest_ensure_response(['success' => true, 'tracks' => []]);
            }
            return rest_ensure_response(
                $plugin->get_user_tracks(['id' => (int)$request['id']])
            );
        } catch (Exception $e) {
            error_log('[DJZ_Dashboard_API] Tracks error: ' . $e->getMessage());
            return rest_ensure_response(['success' => true, 'tracks' => []]);
        }
    }

    public function events($request) {
        try {
            $plugin = $this->plugin();
            if (!$plugin || !method_exists($plugin, 'get_user_events')) {
                return rest_ensure_response(['success' => true, 'events' => []]);
            }
            return rest_ensure_response(
                $plugin->get_user_events(['id' => (int)$request['id']])
            );
        } catch (Exception $e) {
            error_log('[DJZ_Dashboard_API] Events error: ' . $e->getMessage());
            return rest_ensure_response(['success' => true, 'events' => []]);
        }
    }

    public function streak($request) {
        try {
            $plugin = $this->plugin();
            if (!$plugin || !method_exists($plugin, 'get_streak_data')) {
                return rest_ensure_response(['success' => true, 'streak' => 0]);
            }
            return rest_ensure_response(
                $plugin->get_streak_data(['id' => (int)$request['id']])
            );
        } catch (Exception $e) {
            error_log('[DJZ_Dashboard_API] Streak error: ' . $e->getMessage());
            return rest_ensure_response(['success' => true, 'streak' => 0]);
        }
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
            $rank_slug = apply_filters('djz_gamipress_rank_slug', !empty($rank_types) ? array_key_first($rank_types) : null, $rank_types);
            if ($rank_slug) {
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