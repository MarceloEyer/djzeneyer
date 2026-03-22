<?php
/**
 * ZenGame REST API Handler
 * Bridging React frontend to the custom ZenGame Engine.
 */
namespace ZenEyer\Game\API;

if (!defined('ABSPATH')) {
    die;
}

class REST_Handler {

    public static function init() {
        \add_action('rest_api_init', [__CLASS__, 'register_routes']);
    }

    public static function register_routes() {
        $namespace = 'zengame/v1';

        // Get User Gamification Data
        \register_rest_route($namespace, '/me', [
            'methods'             => \WP_REST_Server::READABLE,
            'callback'            => [__CLASS__, 'get_user_data'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);

        // Global Leaderboard
        \register_rest_route($namespace, '/leaderboard', [
            'methods'             => \WP_REST_Server::READABLE,
            'callback'            => [__CLASS__, 'get_leaderboard'],
            'permission_callback' => '__return_true', // Public
        ]);

        // Track Custom Interaction (e.g., from Frontend)
        \register_rest_route($namespace, '/track', [
            'methods'             => \WP_REST_Server::CREATABLE,
            'callback'            => [__CLASS__, 'track_interaction'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);
    }

    public static function check_auth(\WP_REST_Request $request) {
        $user_id = self::get_authenticated_user_id($request);
        return $user_id > 0;
    }

    private static function get_authenticated_user_id(\WP_REST_Request $request) {
        // Bearer Token Support for Headless JWT
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

        // Fallback to Cookie Auth
        return \get_current_user_id();
    }

    /**
     * Endpoint: /zengame/v1/me
     * Returns the exact JSON structure expected by src/contexts/GamiPressContext.tsx
     */
    public static function get_user_data(\WP_REST_Request $request) {
        $user_id = self::get_authenticated_user_id($request);
        
        // 1. Get Balance from GamiPress
        $main_slug = \function_exists('djz_get_gamipress_points_type_slug') 
            ? \djz_get_gamipress_points_type_slug() 
            : 'points';
        
        $points_balance = 0;
        if (\function_exists('gamipress_get_user_points')) {
            $points_balance = \gamipress_get_user_points($user_id, $main_slug);
        } else {
            $points_balance = (int) \get_user_meta($user_id, 'zengame_points_balance', true);
        }
        
        // 2. Format Points structure
        $points_data = [
            $main_slug => [
                'name' => 'XP',
                'amount' => $points_balance,
                'image' => ''
            ]
        ];

        // 3. Determine Rank & Progress
        $rank_details = self::get_rank_details($user_id, $points_balance);

        // 4. Get Achievements
        $achievements = self::get_user_achievements($user_id);

        // 5. Build Response payload
        $data = [
            'user_id' => $user_id,
            'points' => $points_data,
            'rank' => $rank_details,
            'stats' => [
                'totalTracks' => (int) \get_user_meta($user_id, 'zengame_total_tracks', true),
                'eventsAttended' => (int) \get_user_meta($user_id, 'zengame_events_attended', true),
                'streak' => (int) \get_user_meta($user_id, 'zengame_login_streak', true),
                'streakFire' => ((int) \get_user_meta($user_id, 'zengame_login_streak', true)) >= 3,
            ],
            'achievements_earned' => $achievements['earned'],
            'achievements_locked' => $achievements['locked'],
            'recent_achievements' => \array_slice($achievements['earned'], 0, 5),
            'logs' => self::get_user_logs($user_id),
            'main_points_slug' => $main_slug,
            'engine_status' => [
                'woo' => \class_exists('WooCommerce'),
                'gamipress' => \function_exists('gamipress_get_points_types'),
                'cache' => 'bypass',
                'ts' => \time()
            ],
            'lastUpdate' => \current_time('mysql'),
            'version' => defined('ZENGAME_VERSION') ? ZENGAME_VERSION : '1.3.9'
        ];

        return \rest_ensure_response($data);
    }

    /**
     * Helper: Fetch and categorize achievements
     */
    private static function get_user_achievements(int $user_id): array {
        $earned = [];
        $locked = [];

        if (\function_exists('gamipress_get_user_earnings')) {
            $earnings = \gamipress_get_user_earnings($user_id, ['post_type' => 'achievement']);
            if ($earnings) {
                foreach ($earnings as $earning) {
                    $earned[] = [
                        'id' => (int) $earning->post_id,
                        'title' => \get_the_title($earning->post_id),
                        'description' => \get_the_excerpt($earning->post_id) ?: '',
                        'image' => \get_the_post_thumbnail_url($earning->post_id, 'thumbnail') ?: '',
                        'earned' => true,
                        'points_awarded' => 0,
                        'date_earned' => $earning->date
                    ];
                }
            }

            // Get locked achievements
            $all_achievements = \get_posts([
                'post_type' => 'achievement',
                'posts_per_page' => 10,
                'post__not_in' => \wp_list_pluck($earned, 'id') ?: [0]
            ]);

            foreach ($all_achievements as $ach) {
                $locked[] = [
                    'id' => (int) $ach->ID,
                    'title' => $ach->post_title,
                    'description' => $ach->post_excerpt ?: '',
                    'image' => \get_the_post_thumbnail_url($ach->ID, 'thumbnail') ?: '',
                    'earned' => false,
                    'points_awarded' => 0,
                    'date_earned' => ''
                ];
            }
        }

        return ['earned' => $earned, 'locked' => $locked];
    }

    /**
     * Helper: Rank Details calculation
     */
    private static function get_rank_details(int $user_id, int $points): array {
        $current_rank_obj = null;
        if (\function_exists('gamipress_get_user_rank')) {
             $rank_types = \function_exists('gamipress_get_rank_types') ? \array_keys(\gamipress_get_rank_types()) : [];
             foreach ($rank_types as $type) {
                 $rank = \gamipress_get_user_rank($user_id, $type);
                 if ($rank) {
                     $current_rank_obj = $rank;
                     break;
                 }
             }
        }

        $next_rank_data = null;
        $progress = 0;
        $requirements = [];

        if (\function_exists('djz_get_gamipress_rank_tiers')) {
            $rank_info = \djz_get_gamipress_rank_tiers();
            $tiers = $rank_info['tiers'];

            foreach ($tiers as $i => $tier) {
                if ($points >= $tier['min'] && $points < ($tier['next'] ?: 9999999)) {
                    if (isset($tiers[$i + 1])) {
                        $next = $tiers[$i + 1];
                        $range = $next['min'] - $tier['min'];
                        $earned_in_range = $points - $tier['min'];
                        $progress = $range > 0 ? \round(($earned_in_range / $range) * 100) : 100;
                        
                        $next_rank_data = [
                            'id' => 0,
                            'title' => $next['name'],
                            'image' => ''
                        ];

                        $requirements[] = [
                            'title' => 'XP para ' . $next['name'],
                            'current' => $points,
                            'required' => $next['min'],
                            'percent' => $progress
                        ];
                    }
                    break;
                }
            }
        }

        return [
            'current' => [
                'id' => $current_rank_obj ? $current_rank_obj->ID : 0,
                'title' => $current_rank_obj ? $current_rank_obj->post_title : 'Iniciante',
                'image' => $current_rank_obj ? (\get_the_post_thumbnail_url($current_rank_obj->ID, 'medium') ?: '') : '',
            ],
            'next' => $next_rank_data,
            'progress' => $progress,
            'requirements' => $requirements
        ];
    }

    /**
     * Helper: Logs fetcher
     */
    private static function get_user_logs(int $user_id): array {
        global $wpdb;
        $table = $wpdb->prefix . 'zengame_logs';
        
        // Safety check for table existence
        $table_exists = $wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table));
        if (!$table_exists) {
            return [];
        }

        $logs_db = $wpdb->get_results($wpdb->prepare(
            "SELECT id, action as type, description, created_at as date, points
             FROM $table
             WHERE user_id = %d
             ORDER BY created_at DESC LIMIT 10",
            $user_id
        ));

        $logs_data = [];
        foreach ($logs_db as $log) {
            $logs_data[] = [
                'id' => (int) $log->id,
                'type' => $log->type,
                'description' => $log->description,
                'date' => $log->date,
                'points' => (int) $log->points,
            ];
        }
        return $logs_data;
    }

    /**
     * Endpoint: /zengame/v1/leaderboard
     */
    public static function get_leaderboard(\WP_REST_Request $request) {
        global $wpdb;

        $main_slug = \function_exists('djz_get_gamipress_points_type_slug') 
            ? \djz_get_gamipress_points_type_slug() 
            : 'points';
            
        $meta_key = \function_exists('gamipress_get_points_types') 
            ? '_gamipress_' . $main_slug . '_points'
            : 'zengame_points_balance';

        $results = $wpdb->get_results($wpdb->prepare("
            SELECT user_id, meta_value as points, u.display_name
            FROM {$wpdb->usermeta} m
            INNER JOIN {$wpdb->users} u ON m.user_id = u.ID
            WHERE meta_key = %s AND CAST(meta_value AS UNSIGNED) > 0
            ORDER BY CAST(meta_value AS UNSIGNED) DESC LIMIT 10
        ", $meta_key));

        $leaderboard = ['points' => []];

        foreach ($results as $row) {
            $leaderboard['points'][] = [
                'user_id' => (int) $row->user_id,
                'display_name' => \esc_html($row->display_name),
                'points' => (int) $row->points,
                'avatar' => \get_avatar_url((int) $row->user_id, ['size' => 64]),
            ];
        }

        return \rest_ensure_response($leaderboard);
    }

    /**
     * Endpoint: /zengame/v1/track
     * Used by React to claim points for actions (like answering a quiz)
     */
    public static function track_interaction(\WP_REST_Request $request) {
        $user_id = self::get_authenticated_user_id($request);
        $params = $request->get_json_params();

        $action = \sanitize_text_field($params['action'] ?? '');
        $object_id = (int) ($params['object_id'] ?? 0);

        if ($action === 'mission_completed' && $object_id > 0) {
            require_once ZENGAME_PATH . 'includes/Core/class-zengame-triggers.php';
            $triggers = new \ZenEyer\Game\Core\Triggers();
            $success = $triggers->mission_completed($user_id, $object_id);

            return \rest_ensure_response([
                'success' => $success,
                'message' => $success ? 'Points awarded!' : 'Already completed or invalid.'
            ]);
        }

        return new \WP_Error('invalid_action', 'Action not recognized', ['status' => 400]);
    }
}
