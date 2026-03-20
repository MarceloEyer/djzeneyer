<?php
/**
 * REST API Handler for ZenGame Pro
 *
 * @package ZenGamePro
 * @since 1.4.0
 */

namespace ZenEyer\GamePro\API;

use ZenEyer\GamePro\Core\Engine;
use WP_REST_Server;
use WP_Error;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * REST_Handler Class
 *
 * Maps external React requests to the ZenGame Pro Engine.
 */
final class REST_Handler
{
    public static function init()
    {
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
        try {
            $user_id = self::get_authenticated_user_id($request);
            if (!$user_id) {
                return new WP_Error('unauthorized', 'Invalid token', ['status' => 401]);
            }

            $cache_key = 'djz_zengame_dashboard_' . \ZenEyer\GamePro\ZenGamePro::CACHE_VERSION . '_' . $user_id;
            $bypass_cache = (bool) $request->get_param('nocache');
            if (!$bypass_cache) {
                $cached = \get_transient($cache_key);
                if (false !== $cached) {
                    return \rest_ensure_response($cached);
                }
            }

            $rank_data = Engine::get_user_rank($user_id);
            $points_balance = Engine::get_user_balance($user_id);

            $data = [
                'user_id' => $user_id,
                'stats' => [
                    'totalTracks' => (int) \get_user_meta($user_id, 'zengame_total_tracks', true),
                    'eventsAttended' => (int) \get_user_meta($user_id, 'zengame_events_attended', true),
                    'streak' => (int) \get_user_meta($user_id, '_zengame_login_streak', true),
                    'streakFire' => ((int) \get_user_meta($user_id, '_zengame_login_streak', true)) >= 3,
                ],
                'points' => [
                    'points' => [
                        'name' => 'XP',
                        'amount' => $points_balance,
                        'image' => ''
                    ]
                ],
                'rank' => [
                    'current' => [
                        'id' => $rank_data['id'] ?? 0,
                        'title' => $rank_data['title'],
                        'image' => $rank_data['icon']
                    ],
                    'next' => null, // TODO: Implement next rank logic
                    'progress' => 0,
                    'requirements' => []
                ],
                'achievements_earned' => [], 
                'achievements_locked' => [],
                'recent_achievements' => [],
                'logs' => self::get_user_logs($user_id),
                'main_points_slug' => 'points',
                'engine_status' => [
                    'woo' => \class_exists('WooCommerce'),
                    'standalone' => true,
                    'cache' => 'warm',
                    'ts' => \time(),
                ],
                'lastUpdate' => \current_time('mysql'),
                'version' => ZENGAMEPRO_VERSION,
            ];

            \set_transient($cache_key, $data, \ZenEyer\GamePro\ZenGamePro::DEFAULT_CACHE_TTL);

            return \rest_ensure_response($data);
        } catch (\Throwable $e) {
            \error_log('ZenGamePro API Error: ' . $e->getMessage());
            return new WP_Error('engine_error', 'ZenGamePro API Error', ['status' => 500]);
        }
    }

    /**
     * Global Leaderboard Endpoint
     */
    public static function get_leaderboard($request)
    {
        $cache_key = 'djz_zengame_leaderboard_' . \ZenEyer\GamePro\ZenGamePro::CACHE_VERSION;
        $cached = \get_transient($cache_key);
        if (false !== $cached) {
            return \rest_ensure_response($cached);
        }

        global $wpdb;
        $results = $wpdb->get_results(
            $wpdb->prepare(
                "
                SELECT user_id, meta_value as points, u.display_name
                FROM {$wpdb->usermeta} m
                INNER JOIN {$wpdb->users} u ON m.user_id = u.ID
                WHERE meta_key = %s AND meta_value > 0
                ORDER BY CAST(meta_value AS UNSIGNED) DESC LIMIT %d
                ",
                'zengame_points_balance',
                10
            )
        );

        $leaderboard = ['points' => []];
        foreach ($results as $row) {
            $leaderboard['points'][] = [
                'user_id' => (int) $row->user_id,
                'display_name' => $row->display_name,
                'points' => (int) $row->points,
                'avatar' => \get_avatar_url((int) $row->user_id, ['size' => 64]),
            ];
        }

        \set_transient($cache_key, $leaderboard, \ZenEyer\GamePro\ZenGamePro::DEFAULT_CACHE_TTL);

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
        $object_id = (is_scalar($params['object_id'] ?? null)) ? (int) $params['object_id'] : 0;

        if (empty($action)) {
            return new WP_Error('missing_action', 'Action is required', ['status' => 400]);
        }

        // For now, we just log the interaction and maybe award some base points
        Engine::award_points($user_id, 2, 'interaction_' . $action, $object_id, 'action', 'Interação registrada via API.');

        return \rest_ensure_response([
            'success' => true,
            'action' => $action,
            'points_awarded' => 2,
        ]);
    }

    private static function get_authenticated_user_id($request)
    {
        $auth_header = $request->get_header('authorization');
        if ($auth_header && \preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            $token = \trim($matches[1]);
            if (\class_exists('\\ZenEyer\\Auth\\Core\\JWT_Manager')) {
                $decoded = \ZenEyer\Auth\Core\JWT_Manager::validate_token($token);
                if (!\is_wp_error($decoded) && isset($decoded->data->user_id)) {
                    return (int) $decoded->data->user_id;
                }
            }
        }

        return \get_current_user_id() ?: null;
    }

    private static function get_user_logs(int $user_id, int $limit = 10): array
    {
        global $wpdb;
        $table = $wpdb->prefix . 'zengame_logs';
        
        $logs = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table WHERE user_id = %d ORDER BY created_at DESC LIMIT %d",
            $user_id,
            $limit
        ));

        if (!$logs) return [];

        $formatted = [];
        foreach ($logs as $log) {
            $formatted[] = [
                'id' => (int) $log->id,
                'type' => $log->action,
                'description' => $log->description ?: $log->action,
                'date' => $log->created_at,
                'points' => (int) $log->points,
            ];
        }

        return $formatted;
    }
}
