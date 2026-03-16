<?php
/**
 * REST API Handler
 *
 * @package ZenGame
 * @since 1.4.0
 */

namespace ZenEyer\Game\API;

if (!defined('ABSPATH')) {
    exit;
}

use ZenEyer\Game\Core\Engine;
use WP_REST_Server;
use WP_REST_Response;
use WP_Error;

/**
 * REST_Handler Class
 * 
 * Maps external React requests to the internal Game Engine.
 */
final class REST_Handler
{
    private static Engine $engine;

    public static function init(Engine $engine)
    {
        self::$engine = $engine;
        \add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    public static function register_routes()
    {
        $ns = 'zengame/v1';

        \register_rest_route($ns, '/me', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_dashboard'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);

        \register_rest_route($ns, '/leaderboard', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_leaderboard'],
            'permission_callback' => '__return_true',
        ]);

        \register_rest_route($ns, '/track', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'track_interaction'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);
    }

    public static function check_auth($request): bool
    {
        return (bool) self::get_authenticated_user_id($request);
    }

    /**
     * Unified Dashboard Endpoint
     * Matches ZenGameUserData type in React frontend
     */
    public static function get_dashboard($request)
    {
        $user_id = self::get_authenticated_user_id($request);
        if (!$user_id) return new WP_Error('unauthorized', 'Invalid token', ['status' => 401]);

        $cache_key = 'djz_gamipress_dashboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION . '_' . $user_id;
        $cached = \get_transient($cache_key);
        if (false !== $cached) return \rest_ensure_response($cached);

        if (!\defined('GAMIPRESS_VER')) {
             return new WP_Error('engine_off', 'GamiPress not found', ['status' => 503]);
        }

        // Build response payload matching ZenGameUserData type
        $data = [
            'user_id' => $user_id,
            'stats' => [
                'totalTracks' => self::$engine->get_user_total_tracks($user_id),
                'eventsAttended' => self::$engine->get_user_events_attended($user_id),
                'streak' => (int) \get_user_meta($user_id, 'zen_login_streak', true),
                'streakFire' => ((int) \get_user_meta($user_id, 'zen_login_streak', true)) >= 3,
            ],
            'points' => self::get_user_points($user_id),
            'rank' => self::get_user_rank_data($user_id),
            'achievements_earned' => self::get_user_achievements($user_id, 'earned'),
            'achievements_locked' => self::get_user_achievements($user_id, 'locked'),
            'recent_achievements' => self::get_user_achievements($user_id, 'earned', 3),
            'logs' => self::get_user_logs($user_id),
            'main_points_slug' => 'points', // Default GamiPress slug
            'engine_status' => [
                'woo' => \class_exists('WooCommerce'),
                'gamipress' => true,
                'cache' => \get_option('zengame_last_purge') ? 'warm' : 'running',
                'ts' => \time()
            ],
            'lastUpdate' => \current_time('mysql'),
            'version' => '1.4.0'
        ];

        \set_transient($cache_key, $data, \ZenEyer\Game\ZenGame::DEFAULT_CACHE_TTL);
        return \rest_ensure_response($data);
    }

    /**
     * Global Leaderboard Endpoint
     */
    public static function get_leaderboard($request)
    {
        if (!\defined('GAMIPRESS_VER')) return new WP_Error('engine_off', 'GamiPress not found', ['status' => 503]);

        $cache_key = 'djz_gamipress_leaderboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION;
        $cached = \get_transient($cache_key);
        if (false !== $cached) return \rest_ensure_response($cached);

        global $wpdb;
        $types = \gamipress_get_points_types();
        $leaderboard = [];

        foreach ($types as $type) {
            $slug = $type['slug'];
            $meta_key = "_gamipress_{$slug}_points";

            $results = $wpdb->get_results($wpdb->prepare("
                SELECT user_id, meta_value as points, u.display_name
                FROM {$wpdb->usermeta} m
                INNER JOIN {$wpdb->users} u ON m.user_id = u.ID
                WHERE meta_key = %s AND meta_value > 0
                ORDER BY CAST(meta_value AS UNSIGNED) DESC LIMIT 10
            ", $meta_key));

            if (!$results) continue;

            $leaderboard[$slug] = [];
            foreach ($results as $row) {
                $leaderboard[$slug][] = [
                    'user_id' => (int) $row->user_id,
                    'display_name' => \esc_html($row->display_name),
                    'points' => (int) $row->points,
                    'avatar' => \get_avatar_url((int) $row->user_id, ['size' => 64]),
                ];
            }
        }

    \set_transient($cache_key, $leaderboard, 3600); // 1 hour
    return \rest_ensure_response($leaderboard);
}

/**
 * Interaction Tracker
 */
public static function track_interaction($request)
{
    $user_id = self::get_authenticated_user_id($request);
    $params = $request->get_json_params();

    $action = \sanitize_text_field($params['action'] ?? '');
    $object_id = (int) ($params['object_id'] ?? 0);

    if (empty($action)) {
        return new WP_Error('missing_action', 'Action is required', ['status' => 400]);
    }

    $success = self::$engine->track_interaction($user_id, $action, $object_id);

    return \rest_ensure_response([
        'success' => $success,
        'action' => $action,
        'points_awarded' => ($action === 'download' && $success) ? 5 : 0
    ]);
}

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS (Strict mapping to ZenGameUserData)
    // ─────────────────────────────────────────────────────────────────────────

    private static function get_authenticated_user_id($request)
    {
        $auth_header = $request->get_header('authorization');
        if ($auth_header && \preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            $token = \trim($matches[1]);
            if (\class_exists('\ZenEyer\Auth\Core\JWT_Manager')) {
                $decoded = \ZenEyer\Auth\Core\JWT_Manager::validate_token($token);
                if (!\is_wp_error($decoded) && isset($decoded->data->user_id)) {
                    return (int) $decoded->data->user_id;
                }
            }
        }
        return \get_current_user_id() ?: null;
    }

    private static function get_user_points(int $user_id): array
    {
        if (!\function_exists('gamipress_get_points_types')) return [];
        $types = \gamipress_get_points_types();
        $points = [];
        foreach ($types as $type) {
            $points[$type['slug']] = [
                'name' => $type['plural_name'],
                'amount' => \gamipress_get_user_points($user_id, $type['slug']),
                'image' => \get_the_post_thumbnail_url($type['id'], 'thumbnail') ?: ''
            ];
        }
        
        // Ensure at least the main points slug exists to prevent frontend undefined errors
        if (!isset($points['points'])) {
            $points['points'] = ['name' => 'XP', 'amount' => 0, 'image' => ''];
        }
        
        return $points;
    }

    private static function get_user_rank_data(int $user_id): array
    {
        $fallback = [
            'current' => ['id' => 0, 'title' => 'Zen Guest', 'image' => ''],
            'next' => null,
            'progress' => 0,
            'requirements' => [],
        ];

        if (!\function_exists('gamipress_get_rank_types')) return $fallback;

        $rank_types = \gamipress_get_rank_types();
        if (empty($rank_types)) return $fallback;

        $type = $rank_types[0]; 
        $current = \gamipress_get_user_rank($user_id, $type['slug']);
        $next = \gamipress_get_next_user_rank($user_id, $type['slug']);
        
        $requirements = [];
        $progress = 0;

        if ($next) {
            $reqs = \gamipress_get_rank_requirements($next->ID);
            if ($reqs) {
                foreach ($reqs as $req) {
                    $status = \gamipress_get_user_requirement_status($user_id, $req->ID, $next->ID);
                    $requirements[] = [
                        'title' => $req->post_title,
                        'current' => (int)$status['current'],
                        'required' => (int)$status['required'],
                        'percent' => (float)$status['percent'],
                    ];
                }
            }
            $progress = \gamipress_get_user_rank_type_progress_percent($user_id, $type['slug']);
        }

        return [
            'current' => [
                'id' => $current ? (int)$current->ID : 0,
                'title' => $current ? $current->post_title : 'Zen Guest',
                'image' => $current ? (\get_the_post_thumbnail_url($current->ID, 'medium') ?: '') : '',
            ],
            'next' => $next ? [
                'id' => (int)$next->ID,
                'title' => $next->post_title,
                'image' => \get_the_post_thumbnail_url($next->ID, 'medium') ?: '',
            ] : null,
            'progress' => (float)$progress,
            'requirements' => $requirements,
        ];
    }

    private static function get_user_achievements(int $user_id, string $status = 'earned', int $limit = 0): array
    {
        $ach_types = \gamipress_get_achievement_types();
        $all = [];

        foreach ($ach_types as $type) {
            if ($status === 'earned') {
                $items = \gamipress_get_user_achievements(['user_id' => $user_id, 'achievement_type' => $type['slug']]);
            } else {
                // Simplified: get all in type and filter manually to avoid heavy GamiPress queries
                $items = \get_posts([
                    'post_type' => $type['slug'],
                    'posts_per_page' => -1,
                    'fields' => 'ids'
                ]);
                $final_items = [];
                foreach ($items as $item_id) {
                    if (!\gamipress_has_user_earned_achievement($item_id, $user_id)) {
                        $final_items[] = \get_post($item_id);
                    }
                }
                $items = $final_items;
            }

            foreach ($items as $item) {
                $all[] = [
                    'id' => $item->ID,
                    'title' => $item->post_title,
                    'description' => $item->post_excerpt ?: $item->post_content,
                    'image' => \get_the_post_thumbnail_url($item->ID, 'thumbnail') ?: '',
                    'earned' => $status === 'earned',
                    'points_awarded' => (int)\get_post_meta($item->ID, '_gamipress_points_awarded', true),
                    'date_earned' => \get_post_meta($item->ID, '_gamipress_earned_at', true) ?: '',
                ];
            }
        }

        if ($limit > 0) {
            \usort($all, fn($a, $b) => \strcmp($b['date_earned'], $a['date_earned']));
            return \array_slice($all, 0, $limit);
        }

        return $all;
    }

    private static function get_user_logs(int $user_id, int $limit = 10): array
    {
        if (!\function_exists('gamipress_get_user_logs')) return [];

        $logs = \gamipress_get_user_logs([
            'user_id' => $user_id,
            'posts_per_page' => $limit
        ]);

        $formatted = [];
        foreach ($logs as $log) {
            $formatted[] = [
                'id' => $log->ID,
                'type' => \get_post_meta($log->ID, '_gamipress_log_type', true),
                'description' => $log->post_title,
                'date' => $log->post_date,
                'points' => (int)\get_post_meta($log->ID, '_gamipress_points', true),
            ];
        }
        return $formatted;
    }
}
