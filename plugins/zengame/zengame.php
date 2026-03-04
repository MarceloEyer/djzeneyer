<?php
/**
 * Plugin Name: ZenGame
 * Description: Gaming & Activity Bridge for DJ Zen Eyer. Centralizes GamiPress logic for Headless API + SEO optimization.
 * Version: 1.1.0
 * Author: DJ Zen Eyer
 * License: GPL v2 or later
 * Text Domain: zengame
 * Domain Path: /languages
 * Requires PHP: 7.4
 * Requires Plugins: gamipress
 */

if (!defined('ABSPATH')) exit;

class ZenGame {
    private static $instance = null;
    const CACHE_VERSION = 'v7';
    const CACHE_TTL = 86400; // 24 hours

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
        
        // SEO: Allow search engines to crawl API endpoints
        add_filter('wp_robots', array($this, 'allow_api_indexing'));
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        $ns = 'djzeneyer/v1';
        
        // User Gamification Data
        register_rest_route($ns, '/gamipress/user-data', [
            'methods' => 'GET',
            'callback' => array($this, 'get_gamipress_user_data'),
            'permission_callback' => '__return_true',
            'args' => [
                'user_id' => [
                    'type' => 'integer',
                    'description' => 'User ID (optional, uses current user if not provided)',
                    'required' => false,
                ],
                'limit_logs' => [
                    'type' => 'integer',
                    'description' => 'Limit number of logs returned (default 5)',
                    'required' => false,
                    'default' => 5
                ]
            ]
        ]);

        // Public leaderboard endpoint (for SEO visibility)
        register_rest_route($ns, '/gamipress/leaderboard', [
            'methods' => 'GET',
            'callback' => array($this, 'get_leaderboard'),
            'permission_callback' => '__return_true',
            'args' => [
                'limit' => [
                    'type' => 'integer',
                    'default' => 10,
                    'required' => false,
                ]
            ]
        ]);
    }

    /**
     * Allow search engines to index API data (helps with discoverability)
     */
    public function allow_api_indexing($robots) {
        // Allow GET endpoints to be crawled
        $robots['googlebot'] = 'index, follow';
        return $robots;
    }

    /**
     * Public leaderboard (great for SEO and user engagement)
     */
    public function get_leaderboard($request) {
        $limit = absint($request->get_param('limit')) ?: 10;
        $cache_key = 'djz_gamipress_' . self::CACHE_VERSION . '_leaderboard_' . $limit;
        
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return rest_ensure_response($cached);
        }

        $leaderboard = [];
        
        if (function_exists('gamipress_get_points_types')) {
            $point_types = gamipress_get_points_types();
            
            foreach ($point_types as $slug => $pt) {
                // Get top users by points
                global $wpdb;
                $results = $wpdb->get_results($wpdb->prepare(
                    "SELECT user_id, points FROM {$wpdb->prefix}gamipress_user_points 
                     WHERE points_type = %s 
                     ORDER BY points DESC 
                     LIMIT %d",
                    $slug,
                    $limit
                ));

                $leaderboard[$slug] = [];
                foreach ($results as $row) {
                    $user = get_user_by('id', $row->user_id);
                    if ($user) {
                        $leaderboard[$slug][] = [
                            'user_id' => $row->user_id,
                            'display_name' => $user->display_name,
                            'points' => (int)$row->points,
                            'avatar' => get_avatar_url($row->user_id, ['size' => 96])
                        ];
                    }
                }
            }
        }

        set_transient($cache_key, $leaderboard, self::CACHE_TTL);
        return rest_ensure_response($leaderboard);
    }

    public function add_settings_page() {
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
        $gamipress_active = defined('GAMIPRESS_VER');
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
                        <td><strong>Endpoints</strong></td>
                        <td>
                            <code>/wp-json/djzeneyer/v1/gamipress/user-data</code><br>
                            <code style="margin-top: 5px; display: block;">/wp-json/djzeneyer/v1/gamipress/leaderboard</code>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>GamiPress Core</strong></td>
                        <td><?php echo $gamipress_active ? '<span style="color: #10b981;">✓ Active (v' . GAMIPRESS_VER . ')</span>' : '<span style="color: #ef4444;">✗ Inactive</span>'; ?></td>
                    </tr>
                    <tr>
                        <td><strong>Cache Strategy</strong></td>
                        <td><code><?php echo self::CACHE_VERSION; ?></code> • TTL: 24h</td>
                    </tr>
                </table>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #6366f1; padding-bottom: 5px;">Active Point Types</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                        <?php foreach ($point_types as $slug => $pt): 
                            $thumb_url = get_the_post_thumbnail_url($pt['ID'], 'thumbnail');
                        ?>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
                            <?php if ($thumb_url): ?>
                                <img src="<?php echo esc_attr($thumb_url); ?>" alt="<?php echo esc_attr($pt['plural_name']); ?>" style="width: 32px; height: 32px; border-radius: 4px; background: #fff; object-fit: cover;">
                            <?php else: ?>
                                <div style="width: 32px; height: 32px; border-radius: 4px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b;">
                                    <span class="dashicons dashicons-money-alt" style="font-size: 18px;"></span>
                                </div>
                            <?php endif; ?>
                            <div>
                                <div style="font-weight: 800; font-size: 14px;"><?php echo esc_html($pt['plural_name']); ?></div>
                                <code style="font-size: 10px; color: #64748b;"><?php echo esc_html($slug); ?></code>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php if (empty($point_types)): ?>
                    <p style="color: #ef4444; font-size: 13px; margin-top: 10px;">⚠️ No point types configured</p>
                    <?php endif; ?>
                </div>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #6366f1; padding-bottom: 5px;">Rank Hierarchy & Requirements</h3>
                    <p class="description">How ZenGame calculates progress using GamiPress native requirements:</p>
                    <div style="background: #1e293b; color: #cbd5e1; padding: 20px; border-radius: 8px; font-family: 'Monaco', 'Courier New', monospace; font-size: 12px; margin-top: 10px; line-height: 1.6;">
                        <span style="color: #38bdf8;">// Logic Flow:</span><br>
                        <span style="color: #94a3b8;">1. gamipress_get_user_rank()</span> → Detect current level<br>
                        <span style="color: #94a3b8;">2. gamipress_get_next_rank_id()</span> → Identify target<br>
                        <span style="color: #94a3b8;">3. gamipress_get_ranks()</span> → Fetch rank requirements<br>
                        <span style="color: #94a3b8;">4. gamipress_get_requirement_object()</span> → Parse requirements<br>
                        <span style="color: #94a3b8;">5. gamipress_get_earnings_count()</span> → Count achievements<br>
                        <span style="color: #94a3b8;">6. min(100, (current / required) × 100)</span> → Calc %<br>
                        <span style="color: #94a3b8;">7. round(sum / total)</span> → Final progress
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #6366f1; padding-bottom: 5px; color: #6366f1;">Function Reference</h3>
                    <p class="description">Core GamiPress functions used:</p>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #6366f1;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 8px;">POINTS</strong>
                            <code style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_get_user_points($uid, 'slug')</code>
                            <code style="font-size: 10px; display: block; word-break: break-all;">gamipress_award_points_to_user($uid, 100, 'slug')</code>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #ec4899;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 8px;">ACHIEVEMENTS</strong>
                            <code style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_get_user_achievements($args)</code>
                            <code style="font-size: 10px; display: block; word-break: break-all;">gamipress_get_earnings_count($args)</code>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 8px;">RANKS</strong>
                            <code style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_get_user_rank($uid, 'type')</code>
                            <code style="font-size: 10px; display: block; word-break: break-all;">gamipress_get_next_rank_id($rank_id)</code>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 8px;">LOGS</strong>
                            <code style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_query_logs($args)</code>
                            <code style="font-size: 10px; display: block; word-break: break-all;">limit, order_by, order</code>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                    <h3 style="color: #ef4444;">⚙️ Maintenance</h3>
                    <p class="description">Clear all cached user data and refresh from GamiPress core:</p>
                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=zengame-settings&action=clear_cache'), 'zengame_clear_cache'); ?>" 
                       class="button button-secondary" style="border-color: #ef4444; color: #ef4444; border-radius: 6px; padding: 8px 20px; font-weight: 600;">
                        🔄 Clear All ZenGame Cache
                    </a>
                </div>
            </div>

            <p style="margin-top: 20px; color: #64748b; font-size: 13px;">
                <span class="dashicons dashicons-info" style="font-size: 14px; margin-right: 5px;"></span>
                Version 1.1.0 • Built for Zen Eyer • <a href="<?php echo admin_url('admin.php?page=zen-control'); ?>" style="color: #6366f1; text-decoration: none;">← Back to Zen Control</a>
            </p>
        </div>
        <style>
            .zen-diag-wrap { 
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif; 
                color: #1e293b;
            }
            .zen-diag-wrap h1 { 
                font-weight: 800; 
                letter-spacing: -0.5px;
                color: #1e293b;
            }
            .zen-diag-wrap h2,
            .zen-diag-wrap h3 {
                color: #1e293b;
            }
            .zen-diag-wrap code {
                background: #f1f5f9;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
            }
            .zen-diag-wrap .card { 
                padding: 30px;
                background: #fff;
            }
        </style>
        <?php
    }

    /**
     * Main endpoint: GamiPress User Data (Aggregated + Cached)
     * 
     * Returns:
     * - Points balance across all types
     * - Current and next rank with progress
     * - Earned achievements
     * - Recent activity logs
     * - User stats (tracks, events attended)
     */
    public function get_gamipress_user_data($request) {
        $user_id = get_current_user_id();

        // JWT Bearer token fallback
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

        // Optional user_id parameter (for admins viewing other users)
        $param_user_id = $request->get_param('user_id');
        if ($param_user_id && current_user_can('manage_options')) {
            $user_id = (int) $param_user_id;
        }

        if (!$user_id) {
            return new WP_Error('no_user', 'User not authenticated', ['status' => 401]);
        }

        // Transient cache per user
        $cache_key = 'djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id;
        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return rest_ensure_response($cached);
        }

        // --- 1. POINTS ---
        $point_data = [];
        if (function_exists('gamipress_get_points_types')) {
            $point_types = gamipress_get_points_types();
            foreach ($point_types as $slug => $pt) {
                $amount = function_exists('gamipress_get_user_points') 
                    ? (int)gamipress_get_user_points($user_id, $slug)
                    : 0;
                    
                $point_data[$slug] = [
                    'name' => $pt['plural_name'],
                    'amount' => $amount,
                    'image' => get_the_post_thumbnail_url($pt['ID'], 'thumbnail') ?: ''
                ];
            }
        }

        // --- 2. RANK WITH REQUIREMENTS ---
        $rank_info = [
            'current' => ['title' => 'Beginner', 'id' => 0, 'image' => ''],
            'next' => null,
            'progress' => 0,
            'requirements' => []
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

                    // Get next rank
                    if (function_exists('gamipress_get_next_rank_id')) {
                        $next_rank_id = gamipress_get_next_rank_id($current_rank->ID);
                        if ($next_rank_id) {
                            $next_rank = get_post($next_rank_id);
                            if ($next_rank) {
                                $rank_info['next'] = [
                                    'id' => $next_rank->ID,
                                    'title' => $next_rank->post_title,
                                    'image' => get_the_post_thumbnail_url($next_rank->ID, 'thumbnail') ?: ''
                                ];

                                // Calculate progress based on simplified 1000pt rule
                                // rule: 1000 pts per rank, max at 4000
                                $u_points = function_exists('gamipress_get_user_points')
                                    ? (int)gamipress_get_user_points($user_id, $main_pt_slug)
                                    : 0;

                                // Progress within current rank (0-1000)
                                $progress_relative = $u_points % 1000;
                                $rank_info['progress'] = min(100, round(($progress_relative / 1000) * 100));

                                // Add a Virtual Requirement for UI consistency
                                $rank_info['requirements'][] = [
                                    'title' => 'Zen Points',
                                    'current' => $u_points,
                                    'required' => 4000,
                                    'percent' => min(100, round(($u_points / 4000) * 100))
                                ];
                            }
                        }
                    }
                }
            }
        }

        // --- 3. ACHIEVEMENTS ---
        $achievements = [];
        $earned_achievements = [];
        $locked_achievements = [];
        $achievement_types = function_exists('gamipress_get_achievement_types') 
            ? gamipress_get_achievement_types() 
            : [];
        $achievement_post_types = !empty($achievement_types) 
            ? array_keys($achievement_types) 
            : ['badge'];

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
                if ($earnings_list) {
                    foreach ($earnings_list as $earned_obj) {
                        $user_earnings[$earned_obj->post_id] = $earned_obj;
                    }
                }
            }

            foreach ($all_achievements as $post) {
                $earned = isset($user_earnings[$post->ID]);
                $points_awarded = (int)get_post_meta($post->ID, '_gamipress_points_awarded', true);
                
                $achievement_data = [
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'description' => $post->post_excerpt ?: strip_tags(wp_trim_words($post->post_content, 20)),
                    'image' => get_the_post_thumbnail_url($post->ID, 'medium') ?: '',
                    'earned' => $earned,
                    'points_awarded' => $points_awarded,
                    'date_earned' => $earned ? $user_earnings[$post->ID]->date : '',
                ];

                $achievements[] = $achievement_data;
                if ($earned) {
                    $earned_achievements[] = $achievement_data;
                } else {
                    $locked_achievements[] = $achievement_data;
                }
            }
        }

        // --- 4. ACTIVITY LOGS ---
        $logs = [];
        if (function_exists('gamipress_query_logs')) {
            $raw_logs = gamipress_query_logs([
                'user_id' => $user_id,
                'limit' => (int) ($request->get_param('limit_logs') ?: 20),
                'order_by' => 'date',
                'order' => 'DESC'
            ]);
            
            if ($raw_logs) {
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
        }

        // --- 5. USER STATS ---
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
            'user_id' => $user_id,
            'points' => $point_data,
            'rank' => $rank_info,
            'achievements' => $achievements,
            'earned_achievements' => $earned_achievements,
            'locked_achievements' => $locked_achievements,
            'earned_achievements_count' => count($earned_achievements),
            'locked_achievements_count' => count($locked_achievements),
            'logs' => $logs,
            'stats' => $stats,
            'main_points_slug' => $main_pt_slug,
            'lastUpdate' => current_time('mysql'),
            'version' => '1.1.0'
        ];

        set_transient($cache_key, $data, self::CACHE_TTL);
        return rest_ensure_response($data);
    }

    /**
     * Get total downloadable products (music/tracks)
     */
    private function get_user_total_tracks($user_id) {
        if (!function_exists('wc_get_customer_available_downloads')) {
            return 0;
        }
        $downloads = wc_get_customer_available_downloads($user_id);
        return count($downloads);
    }

    /**
     * Count attended events based on WooCommerce order categories
     */
    private function get_user_events_attended($user_id) {
        if (!function_exists('wc_get_orders')) {
            return 0;
        }
        
        $orders = wc_get_orders([
            'customer_id' => $user_id,
            'status' => ['completed', 'processing']
        ]);
        
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

    /**
     * Initialize cache invalidation hooks
     */
    private function init_cache_hooks() {
        // WooCommerce events
        add_action('woocommerce_order_status_completed', array($this, 'clear_user_gamipress_cache'));
        
        // GamiPress real-time invalidation
        add_action('gamipress_award_points_to_user', function($user_id) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
        });
        
        add_action('gamipress_award_achievement', function($user_id) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
        });
        
        add_action('gamipress_set_user_rank', function($user_id) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
        });

        // Global invalidation on content change
        add_action('save_post_achievement', array($this, 'clear_all_gamipress_cache'));
        add_action('save_post_rank', array($this, 'clear_all_gamipress_cache'));
    }

    /**
     * Clear cache for specific user after order completion
     */
    public function clear_user_gamipress_cache($order_id) {
        $order = wc_get_order($order_id);
        if ($order && ($user_id = $order->get_user_id())) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_leaderboard_10');
        }
    }

    /**
     * Clear all ZenGame cache (called from admin panel)
     */
    public function clear_all_gamipress_cache() {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM $wpdb->options WHERE option_name LIKE %s",
            '%_transient_djz_gamipress_%'
        ));
    }
}

// Initialize singleton
ZenGame::get_instance();
