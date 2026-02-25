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
        // null as parent hides it from the sidebar menu but keeps it accessible via URL
        add_submenu_page(
            null, 
            __('ZenGame Diagnosis', 'zengame'),
            __('ZenGame', 'zengame'),
            'manage_options',
            'zengame-settings',
            array($this, 'render_settings_page')
        );
    }

    public function render_settings_page() {
        if (!current_user_can('manage_options')) return;

        // Handle Cache Clearing Action
        if (isset($_GET['action']) && $_GET['action'] === 'clear_cache') {
            check_admin_referer('zengame_clear_cache');
            $this->clear_all_gamipress_cache();
            echo '<div class="notice notice-success is-dismissible"><p>ZenGame Cache cleared successfully!</p></div>';
        }

        $point_types = function_exists('gamipress_get_points_types') ? gamipress_get_points_types() : [];
        $rank_types = function_exists('gamipress_get_rank_types') ? gamipress_get_rank_types() : [];
        ?>
        <div class="wrap zen-diag-wrap">
            <h1 class="wp-heading-inline">ZenGame // System Diagnosis</h1>
            <hr class="wp-header-end">

            <div class="card" style="max-width: 800px; margin-top: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h2 style="border-bottom: 1px solid #edf2f7; padding-bottom: 15px; margin-top: 0;">Operational Status</h2>
                
                <table class="widefat striped" style="border: none;">
                    <tr>
                        <td style="width: 200px;"><strong>API Service</strong></td>
                        <td><span style="color: #10b981; font-weight: bold;">● ONLINE</span> (v1.1.0)</td>
                    </tr>
                    <tr>
                        <td><strong>Endpoint</strong></td>
                        <td><code>/wp-json/djzeneyer/v1/gamipress/user-data</code></td>
                    </tr>
                    <tr>
                        <td><strong>GamiPress Core</strong></td>
                        <td><?php echo defined('GAMIPRESS_VERSION') ? '<span style="color: #10b981;">Active (v' . GAMIPRESS_VERSION . ')</span>' : '<span style="color: #ef4444;">Inactive</span>'; ?></td>
                    </tr>
                </table>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #primary; padding-bottom: 5px;">Active Point Types</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                        <?php foreach ($point_types as $slug => $pt): ?>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
                            <img src="<?php echo get_the_post_thumbnail_url($pt['ID'], 'thumbnail') ?: ''; ?>" style="width: 32px; height: 32px; border-radius: 4px; background: #fff;">
                            <div>
                                <div style="font-weight: 800; font-size: 14px;"><?php echo $pt['plural_name']; ?></div>
                                <code style="font-size: 10px; color: #64748b;"><?php echo $slug; ?></code>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #primary; padding-bottom: 5px;">Rank Hierarchy & Requirements</h3>
                    <p class="description">How ZenGame calculates progress using GamiPress native requirements logic:</p>
                    <div style="background: #1e293b; color: #cbd5e1; padding: 20px; border-radius: 8px; font-family: monospace; font-size: 12px; margin-top: 10px;">
                        <span style="color: #38bdf8;">// Logic Flow:</span><br>
                        1. gamipress_get_user_rank() -> Detect current level<br>
                        2. gamipress_get_next_rank_id() -> Identify target<br>
                        3. gamipress_get_ranks(['post_type' => 'rank-requirement']) -> Fetch official children<br>
                        4. gamipress_get_requirement_object() -> Parse Points or Count triggers<br>
                        5. min(100, (current / required) * 100) -> Percentage per requirement<br>
                        6. round(sum / total) -> Final progress bar value
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #primary; padding-bottom: 5px; color: #6366f1;">Developer Quick Reference</h3>
                    <p class="description">Useful snippets for future custom implementations:</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #6366f1;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 5px;">POINTS</strong>
                            <code style="font-size: 10px; break-all;">gamipress_award_points_to_user($uid, 100, 'points');</code><br>
                            <code style="font-size: 10px; break-all;">gamipress_deduct_points_to_user($uid, 50, 'points');</code>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #ec4899;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 5px;">ACHIEVEMENTS</strong>
                            <code style="font-size: 10px; break-all;">gamipress_award_achievement_to_user($aid, $uid);</code><br>
                            <code style="font-size: 10px; break-all;">gamipress_has_user_earned_achievement($aid, $uid);</code>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                    <h3 style="color: #ef4444;">Maintenance</h3>
                    <p class="description">Forcefully invalidate all GamiPress transients for all users.</p>
                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=zengame-settings&action=clear_cache'), 'zengame_clear_cache'); ?>" 
                       class="button button-secondary" style="border-color: #ef4444; color: #ef4444; border-radius: 6px; padding: 5px 20px;">
                        Clear All ZenGame Cache
                    </a>
                </div>
            </div>

            <p style="margin-top: 20px; color: #64748b;">
                <span class="dashicons dashicons-arrow-left-alt2" style="font-size: 14px; margin-top: 2px;"></span>
                <a href="<?php echo admin_url('admin.php?page=zen-control'); ?>" style="text-decoration: none; color: inherit;">Return to Zen Control</a>
            </p>
        </div>
        <style>
            .zen-diag-wrap { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; }
            .zen-diag-wrap h1 { font-weight: 800; letter-spacing: -0.5px; }
            .zen-diag-wrap .card { padding: 30px; }
        </style>
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
        }

        // --- 2. Rank — FIX: Detect real rank type and requirements ---
        $rank_info = [
            'current' => ['title' => 'Zen Novice', 'id' => 0, 'image' => ''],
            'next' => null,
            'progress' => 0
        ];

        $main_pt_slug = !empty($point_data) ? array_key_first($point_data) : 'points';

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

                            // --- OFFICIAL PROGRESS CALCULATION ---
                            $requirements = function_exists('gamipress_get_ranks') ? gamipress_get_ranks([
                                'post_type' => 'rank-requirement',
                                'children_of' => $next_rank_id,
                                'numberposts' => -1
                            ]) : [];

                            $rank_info['requirements'] = [];

                            if (!empty($requirements)) {
                                $total_req_progress = 0;
                                foreach ($requirements as $req_post) {
                                    if (function_exists('gamipress_get_requirement_object')) {
                                        $req = gamipress_get_requirement_object($req_post->ID);
                                        $req_data = [
                                            'title' => $req_post->post_title,
                                            'current' => 0,
                                            'required' => 0,
                                            'percent' => 0
                                        ];
                                        
                                        // Points requirement
                                        if (!empty($req['points_required']) && $req['points_required'] > 0) {
                                            $u_points = (int)gamipress_get_user_points($user_id, $req['points_type_required'] ?: $main_pt_slug);
                                            $req_data['current'] = $u_points;
                                            $req_data['required'] = (int)$req['points_required'];
                                            $req_data['percent'] = min(100, ($u_points / $req['points_required']) * 100);
                                        } 
                                        // Count requirement (triggers)
                                        else if (!empty($req['count']) && $req['count'] > 0) {
                                            $earned_times = function_exists('gamipress_get_earnings_count') ? gamipress_get_earnings_count([
                                                'user_id' => $user_id,
                                                'post_id' => $req_post->ID
                                            ]) : 0;
                                            $req_data['current'] = $earned_times;
                                            $req_data['required'] = (int)$req['count'];
                                            $req_data['percent'] = min(100, ($earned_times / $req['count']) * 100);
                                        }
                                        
                                        $total_req_progress += $req_data['percent'];
                                        $rank_info['requirements'][] = $req_data;
                                    }
                                }
                                $rank_info['progress'] = round($total_req_progress / count($requirements));
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
            if (function_exists('gamipress_get_user_achievements')) {
                $earnings_list = gamipress_get_user_achievements([
                    'user_id' => $user_id,
                    'achievement_type' => $achievement_post_types,
                    'limit' => -1
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

        $stats = [
            'totalTracks' => $this->get_user_total_tracks($user_id),
            'eventsAttended' => $this->get_user_events_attended($user_id),
            'streak' => $streak,
            'streakFire' => $streak_fire,
        ];

        $data = [
            'points' => $point_data,
            'rank' => $rank_info,
            'achievements' => $achievements,
            'logs' => $logs,
            'stats' => $stats,
            'main_points_slug' => $main_pt_slug,
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
