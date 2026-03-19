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
        
        // 1. Get Balance
        $points_balance = (int) \get_user_meta($user_id, 'zengame_points_balance', true);
        
        // 2. Format Points structure (Frontend expects an object with slugs)
        $points_data = [
            'points' => [ // Default main slug
                'name' => 'Pontos',
                'amount' => $points_balance,
                'image' => ''
            ]
        ];

        // 3. Determine Rank based on balance
        // We query all zengame_ranks ordered by required points ascending
        $ranks = \get_posts([
            'post_type' => 'zengame_rank',
            'posts_per_page' => -1,
            'meta_key' => '_zengame_points_required',
            'orderby' => 'meta_value_num',
            'order' => 'ASC',
        ]);

        $current_rank = null;
        $next_rank = null;
        $progress = 0;

        foreach ($ranks as $i => $rank) {
            $req_points = (int) \get_post_meta($rank->ID, '_zengame_points_required', true);

            if ($points_balance >= $req_points) {
                $current_rank = $rank;
            } else {
                $next_rank = $rank;
                // Calculate progress to next rank
                $prev_req = $current_rank ? (int) \get_post_meta($current_rank->ID, '_zengame_points_required', true) : 0;
                $range = $req_points - $prev_req;
                $earned_in_range = $points_balance - $prev_req;
                $progress = $range > 0 ? \round(($earned_in_range / $range) * 100) : 0;
                break; // Found the next rank
            }
        }

        $rank_data = [
            'current' => [
                'id' => $current_rank ? $current_rank->ID : 0,
                'title' => $current_rank ? $current_rank->post_title : 'Iniciante',
                'image' => $current_rank ? (\get_the_post_thumbnail_url($current_rank->ID, 'medium') ?: '') : '',
            ],
            'next' => $next_rank ? [
                'id' => $next_rank->ID,
                'title' => $next_rank->post_title,
                'image' => \get_the_post_thumbnail_url($next_rank->ID, 'medium') ?: '',
            ] : null,
            'progress' => $progress,
            'requirements' => $next_rank ? [[
                'title' => 'Pontos Totais',
                'current' => $points_balance,
                'required' => (int) \get_post_meta($next_rank->ID, '_zengame_points_required', true),
                'percent' => $progress
            ]] : []
        ];

        // 4. Get Logs (History)
        global $wpdb;
        $table = $wpdb->prefix . 'zengame_logs';
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

        // 5. Build Response payload
        $data = [
            'points' => $points_data,
            'rank' => $rank_data,
            'stats' => [
                'totalTracks' => 0,
                'eventsAttended' => 0,
                'streak' => 0
            ],
            // Empty arrays for now, you can populate Achievements similarly to Ranks later
            'achievements_earned' => [],
            'achievements_locked' => [],
            'recent_achievements' => [],
            'logs' => $logs_data,
            'main_points_slug' => 'points',
            'engine_status' => [
                'woo' => \class_exists('WooCommerce'),
                'gamipress' => false, // We've replaced it
                'cache' => 'bypass',
                'ts' => \time()
            ],
            'lastUpdate' => \current_time('mysql'),
            'version' => \ZENGAME_VERSION
        ];

        return \rest_ensure_response($data);
    }

    /**
     * Endpoint: /zengame/v1/leaderboard
     */
    public static function get_leaderboard(\WP_REST_Request $request) {
        global $wpdb;

        $results = $wpdb->get_results("
            SELECT user_id, meta_value as points, u.display_name
            FROM {$wpdb->usermeta} m
            INNER JOIN {$wpdb->users} u ON m.user_id = u.ID
            WHERE meta_key = 'zengame_points_balance' AND CAST(meta_value AS UNSIGNED) > 0
            ORDER BY CAST(meta_value AS UNSIGNED) DESC LIMIT 10
        ");

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
