<?php
/**
 * Plugin Name: ZenGame
 * Description: Gaming & Activity Bridge for DJ Zen Eyer. Centralizes GamiPress logic for Headless API.
 * Version: 1.0.0
 * Author: DJ Zen Eyer
 */

if (!defined('ABSPATH')) exit;

class ZenGame {
    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
        $this->init_cache_hooks();
        add_action('admin_menu', array($this, 'add_settings_page'));
    }

    public function register_routes() {
        $ns = 'djzeneyer/v1';
        register_rest_route($ns, '/gamipress/user-data', [
            'methods' => 'GET',
            'callback' => array($this, 'get_gamipress_user_data'),
            'permission_callback' => '__return_true',
        ]);
    }

    public function add_settings_page() {
        add_submenu_page(
            'zen-control',
            __('ZenGame Settings', 'zengame'),
            __('ZenGame', 'zengame'),
            'manage_options',
            'zengame-settings',
            array($this, 'render_settings_page')
        );
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>ZenGame // System Status</h1>
            <p>Gaming & Activity Bridge is active. Handling REST API requests for GamiPress data.</p>
        </div>
        <?php
    }

    /**
     * GamiPress User Data (Aggregated + Cached)
     */
    public function get_gamipress_user_data($request) {
        $user_id = get_current_user_id();

        if (!$user_id) {
            $auth_header = $request->get_header('Authorization');
            if ($auth_header && preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                $token = trim($matches[1]);
                if (class_exists('\ZenEyer\Auth\Core\JWT_Manager')) {
                    $decoded = \ZenEyer\Auth\Core\JWT_Manager::validate_token($token);
                    if (!is_wp_error($decoded) && isset($decoded->data->user_id)) {
                        $user_id = (int) $decoded->data->user_id;
                    }
                }
            }
        }

        if (!$user_id) return new WP_Error('no_user', 'User not authenticated', ['status' => 401]);

        // Transient cache per user (v4 for forced invalidation)
        $cache_key = 'djz_gamipress_v4_' . $user_id;
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return rest_ensure_response($cached);
        }

        // --- 1. Point types ---
        $point_data = [];
        if (function_exists('gamipress_get_points_types')) {
            $point_types = gamipress_get_points_types();
            foreach ($point_types as $slug => $pt) {
                $point_data[$slug] = [
                    'name' => $pt['plural_name'],
                    'amount' => (int)gamipress_get_user_points($user_id, $slug),
                    'image' => get_the_post_thumbnail_url($pt['ID'], 'thumbnail') ?: ''
                ];
            }
            // Ensure a 'points' key exists for the frontend helper even if slug is different
            if (!isset($point_data['points']) && !empty($point_data)) {
                $first_pt = reset($point_data);
                $point_data['points'] = $first_pt;
            }
        }

        // --- 2. Rank — FIX: Detect real rank type ---
        $rank_info = [
            'current' => ['title' => 'Zen Novice', 'id' => 0, 'image' => ''],
            'next' => null,
            'progress' => 0
        ];

        if (function_exists('gamipress_get_user_rank') && function_exists('gamipress_get_rank_types')) {
            $rank_types = gamipress_get_rank_types();
            if (!empty($rank_types)) {
                $rank_type_slug = array_key_first($rank_types);
                $current_rank = gamipress_get_user_rank($user_id, $rank_type_slug);
                if ($current_rank) {
                    $rank_info['current'] = [
                        'id' => $current_rank->ID,
                        'title' => $current_rank->post_title,
                        'image' => get_the_post_thumbnail_url($current_rank->ID, 'thumbnail') ?: ''
                    ];

                    if (function_exists('gamipress_get_next_rank_id')) {
                        $next_rank_id = gamipress_get_next_rank_id($current_rank->ID);
                        if ($next_rank_id) {
                            $next_rank = get_post($next_rank_id);
                            $rank_info['next'] = [
                                'id' => $next_rank->ID,
                                'title' => $next_rank->post_title,
                                'image' => get_the_post_thumbnail_url($next_rank->ID, 'thumbnail') ?: ''
                            ];

                            // Progress calculation based on XP
                            $main_pt_slug = array_key_first($point_data) ?: 'points';
                            $user_points = $point_data[$main_pt_slug]['amount'] ?? 0;
                            $curr_req = (int)get_post_meta($current_rank->ID, '_gamipress_points', true);
                            $next_req = (int)get_post_meta($next_rank_id, '_gamipress_points', true);

                            if ($next_req > $curr_req) {
                                $progress = (($user_points - $curr_req) / ($next_req - $curr_req)) * 100;
                                $rank_info['progress'] = max(0, min(100, round($progress)));
                            }
                        }
                    }
                }
            }
        }

        // --- 3. Achievements — FIX: Use real post types ---
        $achievements = [];
        $achievement_types = function_exists('gamipress_get_achievement_types') ? gamipress_get_achievement_types() : [];
        $achievement_post_types = !empty($achievement_types) ? array_keys($achievement_types) : ['badge'];

        $all_achievements = get_posts([
            'post_type' => $achievement_post_types,
            'numberposts' => -1,
            'post_status' => 'publish',
            'no_found_rows' => true
        ]);

        if (!empty($all_achievements)) {
            $user_earnings = [];
            if (function_exists('gamipress_get_user_earnings')) {
                $earnings_list = gamipress_get_user_earnings([
                    'user_id' => $user_id,
                    'post_type' => implode(',', $achievement_post_types),
                    'number' => -1 // FIX: 'number' not 'limit'
                ]);
                foreach ($earnings_list as $earned_obj) {
                    $user_earnings[$earned_obj->post_id] = $earned_obj;
                }
            }

            foreach ($all_achievements as $post) {
                $earned = isset($user_earnings[$post->ID]);
                $points_awarded = (int)get_post_meta($post->ID, '_gamipress_points_awarded', true);
                
                $achievements[] = [
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'description' => $post->post_excerpt ?: strip_tags(wp_trim_words($post->post_content, 20)),
                    'image' => get_the_post_thumbnail_url($post->ID, 'medium') ?: '',
                    'earned' => $earned,
                    'points_awarded' => $points_awarded,
                    'date_earned' => $earned ? $user_earnings[$post->ID]->date : '',
                ];
            }
        }

        // --- 4. Logs — FIX: 'number' parameter ---
        $logs = [];
        if (function_exists('gamipress_get_logs')) {
            $raw_logs = gamipress_get_logs([
                'user_id' => $user_id,
                'number' => 10, // FIX: 'number' not 'limit'
                'orderby' => 'date',
                'order' => 'DESC'
            ]);
            foreach ($raw_logs as $log) {
                $logs[] = [
                    'id' => $log->log_id,
                    'type' => $log->type,
                    'description' => $log->title,
                    'date' => $log->date,
                    'points' => (int)($log->points ?? 0)
                ];
            }
        }

        $streak = (int)get_user_meta($user_id, 'zen_login_streak', true);
        $last_login = get_user_meta($user_id, 'zen_last_login', true);
        $streak_fire = false;
        if ($last_login) {
            $diff_days = (strtotime('today') - strtotime(date('Y-m-d', strtotime($last_login)))) / 86400;
            $streak_fire = $diff_days <= 1;
        }

        $data = [
            'points' => $point_data,
            'rank' => $rank_info,
            'achievements' => $achievements,
            'logs' => $logs,
            'stats' => [
                'totalTracks' => $this->get_user_total_tracks($user_id),
                'eventsAttended' => $this->get_user_events_attended($user_id),
                'streak' => $streak,
                'streakFire' => $streak_fire,
            ],
            'lastUpdate' => current_time('mysql')
        ];

        set_transient($cache_key, $data, 86400); // 24h
        return rest_ensure_response($data);
    }

    private function get_user_total_tracks($user_id) {
        if (!function_exists('wc_get_customer_available_downloads')) return 0;
        $downloads = wc_get_customer_available_downloads($user_id);
        return count($downloads);
    }

    private function get_user_events_attended($user_id) {
        if (!function_exists('wc_get_orders')) return 0;
        $orders = wc_get_orders(['customer_id' => $user_id, 'status' => ['completed', 'processing']]);
        $count = 0;
        $target_slugs = ['events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass'];
        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();
                if ($product_id) {
                    $terms = get_the_terms($product_id, 'product_cat');
                    if ($terms && !is_wp_error($terms)) {
                        foreach ($terms as $term) {
                            if (in_array($term->slug, $target_slugs)) {
                                $count += $item->get_quantity();
                                break 2;
                            }
                        }
                    }
                }
            }
        }
        return $count;
    }

    private function init_cache_hooks() {
        // WooCommerce
        add_action('woocommerce_order_status_completed', array($this, 'clear_user_gamipress_cache'));
        
        // GamiPress Hooks for real-time invalidation
        add_action('gamipress_award_points_to_user', function($user_id) {
            delete_transient('djz_gamipress_v4_' . $user_id);
        });
        add_action('gamipress_award_achievement', function($user_id) {
            delete_transient('djz_gamipress_v4_' . $user_id);
        });
        add_action('gamipress_set_user_rank', function($user_id) {
            delete_transient('djz_gamipress_v4_' . $user_id);
        });

        // Global invalidation on content change
        add_action('save_post_achievement', array($this, 'clear_all_gamipress_cache'));
    }

    public function clear_user_gamipress_cache($order_id) {
        $order = wc_get_order($order_id);
        if ($order && ($user_id = $order->get_user_id())) {
            delete_transient('djz_gamipress_v4_' . $user_id);
        }
    }

    public function clear_all_gamipress_cache() {
        global $wpdb;
        $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_gamipress_%'");
    }
}

ZenGame::get_instance();
