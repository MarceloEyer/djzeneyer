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
        try {
            $user_id = self::get_authenticated_user_id($request);
            if (!$user_id) {
                return new WP_Error('unauthorized', 'Invalid token', ['status' => 401]);
            }

            $cache_key = 'djz_gamipress_dashboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION . '_' . $user_id;
            $bypass_cache = (bool) $request->get_param('nocache');
            if (!$bypass_cache) {
                $cached = \get_transient($cache_key);
                if (false !== $cached) {
                    return \rest_ensure_response($cached);
                }
            }

            if (!\defined('GAMIPRESS_VER')) {
                return new WP_Error('engine_off', 'GamiPress not found', ['status' => 503]);
            }

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
                'main_points_slug' => self::get_main_points_slug(),
                'engine_status' => [
                    'woo' => \class_exists('WooCommerce'),
                    'gamipress' => \defined('GAMIPRESS_VER') ? \GAMIPRESS_VER : false,
                    'cache' => \get_option('zengame_last_purge') ? 'warm' : 'running',
                    'ts' => \time(),
                ],
                'lastUpdate' => \current_time('mysql'),
                'version' => '1.4.1',
            ];

            \set_transient($cache_key, $data, \ZenEyer\Game\ZenGame::DEFAULT_CACHE_TTL);

            return \rest_ensure_response($data);
        } catch (\Throwable $e) {
            $msg = 'ZenGame Engine Crash: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine() . "\n" . $e->getTraceAsString();
            \error_log($msg);
            @\file_put_contents(ABSPATH . 'zengame_crash.log', $msg);
            $error_data = ['status' => 500];
            if (\defined('WP_DEBUG') && \WP_DEBUG) {
                $error_data['trace'] = $e->getTraceAsString();
                $error_data['file'] = $e->getFile();
                $error_data['line'] = $e->getLine();
            }

            return new WP_Error('engine_crash', 'ZenGame Engine Crash: ' . $e->getMessage(), $error_data);
        }
    }

    /**
     * Global Leaderboard Endpoint
     */
    public static function get_leaderboard($request)
    {
        if (!\defined('GAMIPRESS_VER')) {
            return new WP_Error('engine_off', 'GamiPress not found', ['status' => 503]);
        }

        $cache_key = 'djz_gamipress_leaderboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION;
        $cached = \get_transient($cache_key);
        if (false !== $cached) {
            return \rest_ensure_response($cached);
        }

        global $wpdb;
        $types = \function_exists('gamipress_get_points_types') ? \gamipress_get_points_types() : [];
        $limit = \max(1, \min(50, (int) ($request->get_param('limit') ?: 10)));
        $leaderboard = [];

        foreach ($types as $type) {
            $slug = (string) ($type['slug'] ?? '');
            if ($slug === '') {
                continue;
            }

            $meta_key = "_gamipress_{$slug}_points";

            $results = $wpdb->get_results($wpdb->prepare(
                "
                SELECT user_id, meta_value as points, u.display_name
                FROM {$wpdb->usermeta} m
                INNER JOIN {$wpdb->users} u ON m.user_id = u.ID
                WHERE meta_key = %s AND meta_value > 0
                ORDER BY CAST(meta_value AS UNSIGNED) DESC LIMIT %d
                ",
                $meta_key,
                $limit
            ));

            if (!$results) {
                continue;
            }

            // Prime WP object cache for all users in one query — prevents N+1 on get_avatar_url
            $user_ids = \array_map(fn($r) => (int) $r->user_id, $results);
            \cache_users($user_ids);

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

        \set_transient($cache_key, $leaderboard, \ZenEyer\Game\ZenGame::DEFAULT_CACHE_TTL);

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
            'points_awarded' => ($action === 'download' && $success) ? 5 : 0,
        ]);
    }

    private static function get_main_points_slug(): string
    {
        if (!\function_exists('gamipress_get_points_types')) {
            return 'points';
        }

        $types = \gamipress_get_points_types();
        if (empty($types)) {
            return 'points';
        }

        $slugs = \array_values(\array_filter(\wp_list_pluck($types, 'slug')));
        if (empty($slugs)) {
            return 'points';
        }

        if (\in_array('points', $slugs, true)) {
            return 'points';
        }

        if (\in_array('mana', $slugs, true)) {
            return 'mana';
        }

        $slug = (string) \apply_filters('zengame_main_points_slug', $slugs[0], $slugs);
        return $slug;
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

    private static function get_user_points(int $user_id): array
    {
        if (!\function_exists('gamipress_get_points_types')) {
            return [
                'points' => ['name' => 'XP', 'amount' => 0, 'image' => ''],
            ];
        }

        $types = \gamipress_get_points_types();
        $points = [];

        foreach ($types as $type) {
            $slug = (string) ($type['slug'] ?? '');
            if ($slug === '') {
                continue;
            }

            $points[$slug] = [
                'name' => (string) ($type['plural_name'] ?? $type['name'] ?? \strtoupper($slug)),
                'amount' => (int) \gamipress_get_user_points($user_id, $slug),
                'image' => !empty($type['id']) ? (\get_the_post_thumbnail_url((int) $type['id'], 'thumbnail') ?: '') : '',
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

        if (!\function_exists('gamipress_get_rank_types') || !\function_exists('gamipress_get_user_rank')) {
            return $fallback;
        }

        $rank_types = \gamipress_get_rank_types();
        if (empty($rank_types) || !isset($rank_types[0]['slug'])) {
            return $fallback;
        }

        $type = $rank_types[0];
        $rank_slug = (string) $type['slug'];
        $current = \gamipress_get_user_rank($user_id, $rank_slug);
        $next = self::get_next_rank_post($rank_slug, $current);

        $requirements = [];
        $progress = 0.0;

        if ($next) {
            if (\function_exists('gamipress_get_rank_requirements') && \function_exists('gamipress_get_user_requirement_status')) {
                $reqs = \gamipress_get_rank_requirements($next->ID);
                if (\is_array($reqs) || $reqs instanceof \Traversable) {
                    foreach ($reqs as $req) {
                        if (!\is_object($req) || !isset($req->ID)) {
                            continue;
                        }

                        $status = \gamipress_get_user_requirement_status($user_id, $req->ID, $next->ID);
                        $requirements[] = [
                            'title' => (string) ($req->post_title ?? ''),
                            'current' => (int) ($status['current'] ?? 0),
                            'required' => (int) ($status['required'] ?? 0),
                            'percent' => (float) ($status['percent'] ?? 0),
                        ];
                    }
                }
            }

            if (\function_exists('gamipress_get_user_rank_type_progress_percent')) {
                $progress = (float) \gamipress_get_user_rank_type_progress_percent($user_id, $rank_slug);
            }
        }

        return [
            'current' => [
                'id'         => $current ? (int) $current->ID : 0,
                'menu_order' => $current ? (int) $current->menu_order : 0,
                'title'      => $current ? (string) $current->post_title : 'Zen Guest',
                'image'      => $current ? (\get_the_post_thumbnail_url($current->ID, 'medium') ?: '') : '',
            ],
            'next' => $next ? [
                'id'         => (int) $next->ID,
                'menu_order' => (int) $next->menu_order,
                'title'      => (string) $next->post_title,
                'image'      => \get_the_post_thumbnail_url($next->ID, 'medium') ?: '',
            ] : null,
            'progress' => $progress,
            'requirements' => $requirements,
        ];
    }

    private static function get_next_rank_post(string $rank_slug, $current): ?\WP_Post
    {
        if ($rank_slug === '') {
            return null;
        }

        $ranks = \get_posts([
            'post_type' => $rank_slug,
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => [
                'menu_order' => 'ASC',
                'date' => 'ASC',
            ],
        ]);

        if (empty($ranks)) {
            return null;
        }

        if (!$current || !isset($current->ID)) {
            return $ranks[0] instanceof \WP_Post ? $ranks[0] : null;
        }

        $current_found = false;
        foreach ($ranks as $rank) {
            if (!$rank instanceof \WP_Post) {
                continue;
            }

            if ($current_found) {
                return $rank;
            }

            if ((int) $rank->ID === (int) $current->ID) {
                $current_found = true;
            }
        }

        return null;
    }

    private static function get_user_achievements(int $user_id, string $status = 'earned', int $limit = 0): array
    {
        if (!\function_exists('gamipress_get_achievement_types')) {
            return [];
        }

        $ach_types = \gamipress_get_achievement_types();
        $all = [];

        foreach ($ach_types as $type) {
            $type_slug = (string) ($type['slug'] ?? '');
            if ($type_slug === '') {
                continue;
            }

            if ($status === 'earned' && \function_exists('gamipress_get_user_achievements')) {
                $items = \gamipress_get_user_achievements([
                    'user_id' => $user_id,
                    'achievement_type' => $type_slug,
                ]);
            } else {
                // Collect earned IDs to exclude, then fetch locked in a single query
                $earned_ids = [];
                if (\function_exists('gamipress_get_user_achievements')) {
                    $earned_objects = \gamipress_get_user_achievements([
                        'user_id' => $user_id,
                        'achievement_type' => $type_slug,
                    ]);
                    foreach ($earned_objects as $earned) {
                        if (isset($earned->ID)) $earned_ids[] = (int) $earned->ID;
                    }
                }

                $query_args = [
                    'post_type' => $type_slug,
                    'post_status' => 'publish',
                    'posts_per_page' => -1,
                    'orderby' => 'menu_order',
                    'order' => 'ASC',
                ];
                if (!empty($earned_ids)) {
                    $query_args['post__not_in'] = $earned_ids;
                }
                $items = \get_posts($query_args);
            }

            if (!\is_array($items) && !($items instanceof \Traversable)) {
                continue;
            }

            foreach ($items as $item) {
                $post = self::normalize_post_object($item);
                if (!$post) {
                    continue;
                }

                $all[] = [
                    'id' => (int) $post->ID,
                    'title' => (string) $post->post_title,
                    'description' => (string) ($post->post_excerpt ?: $post->post_content ?: ''),
                    'image' => \get_the_post_thumbnail_url($post->ID, 'thumbnail') ?: '',
                    'earned' => $status === 'earned',
                    'points_awarded' => (int) \get_post_meta($post->ID, '_gamipress_points_awarded', true),
                    'date_earned' => (string) (\get_post_meta($post->ID, '_gamipress_earned_at', true) ?: ''),
                ];
            }
        }

        if ($limit > 0) {
            \usort($all, static fn(array $a, array $b): int => \strcmp($b['date_earned'], $a['date_earned']));
            return \array_slice($all, 0, $limit);
        }

        return $all;
    }

    private static function normalize_post_object($item): ?\WP_Post
    {
        if ($item instanceof \WP_Post) {
            return $item;
        }

        if (\is_numeric($item)) {
            $post = \get_post((int) $item);
            return $post instanceof \WP_Post ? $post : null;
        }

        if (\is_object($item) && isset($item->ID)) {
            $post = \get_post((int) $item->ID);
            return $post instanceof \WP_Post ? $post : null;
        }

        return null;
    }

    private static function get_user_logs(int $user_id, int $limit = 10): array
    {
        if (!\function_exists('gamipress_get_user_logs')) {
            return [];
        }

        $logs = \gamipress_get_user_logs([
            'user_id' => $user_id,
            'posts_per_page' => $limit,
        ]);

        if (!\is_array($logs) && !($logs instanceof \Traversable)) {
            return [];
        }

        $formatted = [];
        foreach ($logs as $log) {
            $post = self::normalize_post_object($log);
            if (!$post) {
                continue;
            }

            $formatted[] = [
                'id' => (int) $post->ID,
                'type' => (string) \get_post_meta($post->ID, '_gamipress_log_type', true),
                'description' => (string) $post->post_title,
                'date' => (string) $post->post_date,
                'points' => (int) \get_post_meta($post->ID, '_gamipress_points', true),
            ];
        }

        return $formatted;
    }
}
