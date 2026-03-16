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
    }

    public static function check_auth($request): bool
    {
        return (bool) self::get_authenticated_user_id($request);
    }

    /**
     * Unified Dashboard Endpoint
     */
    public static function get_dashboard($request)
    {
        $user_id = self::get_authenticated_user_id($request);
        if (!$user_id) return new WP_Error('unauthorized', 'Invalid token', ['status' => 401]);

        $cache_key = 'djz_gamipress_dashboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION . '_' . $user_id;
        $cached = \get_transient($cache_key);
        if (false !== $cached) return \rest_ensure_response($cached);

        // Build massive response payload
        $data = [
            'stats' => [
                'tracks' => self::$engine->get_user_total_tracks($user_id),
                'events' => self::$engine->get_user_events_attended($user_id),
                'streak' => (int) \get_user_meta($user_id, 'zen_login_streak', true),
            ],
            'points' => self::get_user_points($user_id),
            'ranks' => self::get_user_ranks($user_id),
            'achievements' => self::get_user_achievements($user_id),
            'engine_status' => [
                'woo' => \class_exists('WooCommerce'),
                'gamipress' => \defined('GAMIPRESS_VER'),
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

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS (Extracted from old zengame.php)
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
        return \get_current_user_id();
    }

    private static function get_user_points(int $user_id): array
    {
        if (!\function_exists('gamipress_get_points_types')) return [];
        $types = \gamipress_get_points_types();
        $points = [];
        foreach ($types as $type) {
            $points[] = [
                'type' => $type['slug'],
                'label' => $type['plural_name'],
                'balance' => \gamipress_get_user_points($user_id, $type['slug']),
                'icon' => \get_the_post_thumbnail_url($type['id'], 'thumbnail') ?: ''
            ];
        }
        return $points;
    }

    private static function get_user_ranks(int $user_id): array
    {
        if (!\function_exists('gamipress_get_rank_types')) return [];
        $types = \gamipress_get_rank_types();
        $ranks = [];
        foreach ($types as $type) {
            $current = \gamipress_get_user_rank($user_id, $type['slug']);
            if (!$current) continue;
            
            $ranks[] = [
                'type' => $type['slug'],
                'current' => [
                    'id' => $current->ID,
                    'title' => $current->post_title,
                    'image' => \get_the_post_thumbnail_url($current->ID, 'medium') ?: ''
                ]
            ];
        }
        return $ranks;
    }

    private static function get_user_achievements(int $user_id): array
    {
        if (!\function_exists('gamipress_get_achievement_types')) return [];
        $types = \gamipress_get_achievement_types();
        $list = [];
        foreach ($types as $type) {
            $earned = \gamipress_get_user_achievements(['user_id' => $user_id, 'achievement_type' => $type['slug']]);
            foreach ($earned as $ach) {
                $list[] = [
                    'id' => $ach->ID,
                    'title' => $ach->post_title,
                    'image' => \get_the_post_thumbnail_url($ach->ID, 'thumbnail') ?: '',
                    'earned_at' => \get_post_meta($ach->ID, '_gamipress_earned_at', true) ?: ''
                ];
            }
        }
        return $list;
    }
}
