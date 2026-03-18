<?php
/**
 * REST API Handler
 *
 * @package ZenGame
 * @since 1.4.0
 */

namespace ZenEyer\Game\API;

use ZenEyer\Game\Core\Engine;
use WP_REST_Server;
use WP_Error;

if (!defined('ABSPATH')) {
    exit;
}

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
        $earned_achievements = self::get_user_achievements($user_id, 'earned');
        $recent_achievements = self::limit_achievements_by_date($earned_achievements, 3);

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
            'achievements_earned' => $earned_achievements,
            'achievements_locked' => self::get_user_achievements($user_id, 'locked'),
            'recent_achievements' => $recent_achievements,
            'achievement_highlights' => $recent_achievements,
            'logs' => self::get_user_logs($user_id),
            'main_points_slug' => self::get_main_points_slug(),
            'engine_status' => [
                'woo' => \class_exists('WooCommerce'),
                'gamipress' => true,
                'cache' => \get_option('zengame_last_purge') ? 'warm' : 'running',
                'ts' => \time()
            ],
            'lastUpdate' => \current_time('mysql'),
            'version' => '1.4.1'
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

    /**
     * Dynamically determines the primary point type slug.
     * Priority: 'mana' > 'points' > first available GamiPress type.
     */
    private static function get_main_points_slug(): string
    {
        if (!\function_exists('gamipress_get_points_types')) return 'points';

        $types = self::normalize_type_collection(\gamipress_get_points_types());
        if (empty($types)) return 'points';

        $slugs = \array_values(\array_filter(\wp_list_pluck($types, 'slug')));

        if (\in_array('mana', $slugs, true)) return 'mana';
        if (\in_array('points', $slugs, true)) return 'points';

        return $slugs[0] ?? 'points';
    }

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
        if (!\function_exists('gamipress_get_points_types') || !\function_exists('gamipress_get_user_points')) return [];

        $types = self::normalize_type_collection(\gamipress_get_points_types());
        $points = [];
        foreach ($types as $type) {
            $slug = isset($type['slug']) ? (string) $type['slug'] : '';
            if ($slug == '') {
                continue;
            }

            $type_id = isset($type['id']) ? (int) $type['id'] : 0;
            $points[$slug] = [
                'name' => isset($type['plural_name']) ? (string) $type['plural_name'] : (isset($type['name']) ? (string) $type['name'] : \strtoupper($slug)),
                'amount' => (int) \gamipress_get_user_points($user_id, $slug),
                'image' => $type_id > 0 ? (\get_the_post_thumbnail_url($type_id, 'thumbnail') ?: '') : ''
            ];
        }

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

        if (!\function_exists('gamipress_get_rank_types') || !\function_exists('gamipress_get_user_rank')) return $fallback;

        $rank_types = self::normalize_type_collection(\gamipress_get_rank_types());
        if (empty($rank_types)) return $fallback;

        $type = $rank_types[0] ?? null;
        $rank_slug = isset($type['slug']) ? (string) $type['slug'] : '';
        if ($rank_slug == '') return $fallback;

        $current = \gamipress_get_user_rank($user_id, $rank_slug);
        $next = self::get_next_rank_post($current, $rank_slug);

        $requirements = [];
        $progress = 0;

        if ($next && \function_exists('gamipress_get_rank_requirements') && \function_exists('gamipress_get_user_requirement_status')) {
            $reqs = \gamipress_get_rank_requirements($next->ID);
            if (\is_array($reqs) || $reqs instanceof \Traversable) {
                foreach ($reqs as $req) {
                    if (!isset($req->ID)) {
                        continue;
                    }

                    $status = \gamipress_get_user_requirement_status($user_id, $req->ID, $next->ID);
                    $requirements[] = [
                        'title' => isset($req->post_title) ? (string) $req->post_title : '',
                        'current' => isset($status['current']) ? (int) $status['current'] : 0,
                        'required' => isset($status['required']) ? (int) $status['required'] : 0,
                        'percent' => isset($status['percent']) ? (float) $status['percent'] : 0,
                    ];
                }
            }
        }

        if (\function_exists('gamipress_get_user_rank_type_progress_percent')) {
            $progress = (float) \gamipress_get_user_rank_type_progress_percent($user_id, $rank_slug);
        } elseif (!empty($requirements)) {
            $progress = (float) \max(0, \min(100, \array_sum(\array_column($requirements, 'percent')) / \count($requirements)));
        }

        return [
            'current' => [
                'id' => $current && isset($current->ID) ? (int) $current->ID : 0,
                'title' => $current && isset($current->post_title) ? (string) $current->post_title : 'Zen Guest',
                'image' => $current && isset($current->ID) ? (\get_the_post_thumbnail_url($current->ID, 'medium') ?: '') : '',
            ],
            'next' => $next ? [
                'id' => (int) $next->ID,
                'title' => (string) $next->post_title,
                'image' => \get_the_post_thumbnail_url($next->ID, 'medium') ?: '',
            ] : null,
            'progress' => $progress,
            'requirements' => $requirements,
        ];
    }

    private static function get_user_achievements(int $user_id, string $status = 'earned', int $limit = 0): array
    {
        if (!\function_exists('gamipress_get_achievement_types')) return [];

        $ach_types = self::normalize_type_collection(\gamipress_get_achievement_types());
        $all = [];

        foreach ($ach_types as $type) {
            $achievement_type = isset($type['slug']) ? (string) $type['slug'] : '';
            if ($achievement_type == '') {
                continue;
            }

            if ($status === 'earned') {
                if (!\function_exists('gamipress_get_user_achievements')) {
                    continue;
                }

                $items = \gamipress_get_user_achievements(['user_id' => $user_id, 'achievement_type' => $achievement_type]);
            } else {
                if (!\function_exists('gamipress_has_user_earned_achievement')) {
                    continue;
                }

                $items = \get_posts([
                    'post_type' => $achievement_type,
                    'posts_per_page' => -1,
                    'post_status' => 'publish',
                    'fields' => 'ids'
                ]);
                $final_items = [];
                foreach ((array) $items as $item_id) {
                    if (!\gamipress_has_user_earned_achievement((int) $item_id, $user_id)) {
                        $post = \get_post((int) $item_id);
                        if ($post) {
                            $final_items[] = $post;
                        }
                    }
                }
                $items = $final_items;
            }

            foreach ((array) $items as $item) {
                if (!\is_object($item) || !isset($item->ID)) {
                    continue;
                }

                $all[] = [
                    'id' => (int) $item->ID,
                    'title' => isset($item->post_title) ? (string) $item->post_title : '',
                    'description' => !empty($item->post_excerpt) ? (string) $item->post_excerpt : (string) ($item->post_content ?? ''),
                    'image' => \get_the_post_thumbnail_url($item->ID, 'thumbnail') ?: '',
                    'earned' => $status === 'earned',
                    'points_awarded' => (int) \get_post_meta($item->ID, '_gamipress_points_awarded', true),
                    'date_earned' => (string) (\get_post_meta($item->ID, '_gamipress_earned_at', true) ?: ''),
                ];
            }
        }

        if ($limit > 0) {
            return self::limit_achievements_by_date($all, $limit);
        }

        return $all;
    }


    private static function normalize_type_collection($types): array
    {
        if (!\is_array($types)) {
            return [];
        }

        return \array_values(\array_filter($types, static fn($type) => \is_array($type) && !empty($type['slug'])));
    }

    private static function get_next_rank_post($current_rank, string $rank_slug): ?\WP_Post
    {
        if ($rank_slug == '') {
            return null;
        }

        $current_menu_order = ($current_rank && isset($current_rank->menu_order)) ? (int) $current_rank->menu_order : -1;
        $rank_posts = \get_posts([
            'post_type' => $rank_slug,
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => ['menu_order' => 'ASC', 'date' => 'ASC'],
            'order' => 'ASC',
        ]);

        foreach ((array) $rank_posts as $rank_post) {
            if (!($rank_post instanceof \WP_Post)) {
                continue;
            }

            if ((int) $rank_post->menu_order > $current_menu_order) {
                return $rank_post;
            }
        }

        return null;
    }

    private static function limit_achievements_by_date(array $achievements, int $limit): array
    {
        \usort($achievements, static fn(array $a, array $b): int => \strcmp((string) ($b['date_earned'] ?? ''), (string) ($a['date_earned'] ?? '')));
        return \array_slice($achievements, 0, $limit);
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
