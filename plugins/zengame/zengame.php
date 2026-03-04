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

if (!defined('ABSPATH'))
    exit;

class ZenGame
{
    private static $instance = null;
    const CACHE_VERSION = 'v8';

    private function get_cache_ttl()
    {
        return (int) get_option('zengame_cache_ttl', 86400);
    }

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        add_action('rest_api_init', array($this, 'register_routes'));
        $this->init_cache_hooks();
        add_action('admin_menu', array($this, 'add_settings_page'));

        // SEO: Allow search engines to crawl API endpoints
        add_filter('wp_robots', array($this, 'allow_api_indexing'));
    }

    /**
     * Register REST API routes
     */
    public function register_routes()
    {
        $ns = 'zengame/v1';

        // Aggregated User Dashboard (Private - Needs JWT)
        register_rest_route($ns, '/me', [
            'methods' => 'GET',
            'callback' => array($this, 'get_user_dashboard'),
            'permission_callback' => array($this, 'check_auth'),
        ]);

        // Public leaderboard endpoint
        register_rest_route($ns, '/leaderboard', [
            'methods' => 'GET',
            'callback' => array($this, 'get_leaderboard'),
            'permission_callback' => '__return_true',
            'args' => [
                'limit' => [
                    'type' => 'integer',
                    'default' => 50,
                    'sanitize_callback' => 'absint'
                ],
                'period' => [
                    'type' => 'string',
                    'default' => 'all',
                    'enum' => ['all', '30d', '7d']
                ]
            ]
        ]);

        // Legacy BC (Optional - User might decide to remove soon)
        // For now, let's stick to the new one as per the plan.
    }

    /**
     * Check authentication for private endpoints
     */
    public function check_auth($request)
    {
        $user_id = $this->get_authenticated_user_id($request);
        return $user_id > 0;
    }

    /**
     * Helper to get user ID from JWT or Nonce
     */
    private function get_authenticated_user_id($request)
    {
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

        return $user_id;
    }

    /**
     * Allow search engines to index API data (helps with discoverability)
     */
    public function allow_api_indexing($robots)
    {
        // Allow GET endpoints to be crawled
        $robots['googlebot'] = 'index, follow';
        return $robots;
    }

    /**
     * Public leaderboard with filtering support
     */
    public function get_leaderboard($request)
    {
        $limit = absint($request->get_param('limit')) ?: 50;
        $period = $request->get_param('period') ?: 'all';

        $cache_key = 'djz_gamipress_' . self::CACHE_VERSION . '_leaderboard_' . $limit . '_' . $period;

        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return rest_ensure_response($cached);
        }

        $leaderboard = [];

        if (function_exists('gamipress_get_points_types')) {
            $point_types = gamipress_get_points_types();

            foreach ($point_types as $slug => $pt) {
                global $wpdb;

                $query = "SELECT user_id, points FROM {$wpdb->prefix}gamipress_user_points WHERE points_type = %s";

                // Period filtering logic
                if ($period !== 'all') {
                    $days = ($period === '30d') ? 30 : 7;
                    // Note: Real GamiPress table uses 'points_type' or 'point_type' depending on version. 
                    // Usually it is 'points_type' in the custom table.
                    $query = "SELECT log.user_id, SUM(log.points) as points 
                             FROM {$wpdb->prefix}gamipress_logs as log
                             WHERE log.type = %s AND log.date >= DATE_SUB(NOW(), INTERVAL %d DAY)
                             GROUP BY log.user_id";

                    $results = $wpdb->get_results($wpdb->prepare($query, $slug, $days));
                } else {
                    $query .= " ORDER BY points DESC LIMIT %d";
                    $results = $wpdb->get_results($wpdb->prepare($query, $slug, $limit));
                }

                // Sort and limit results if from logs
                if ($period !== 'all') {
                    usort($results, function ($a, $b) {
                        return $b->points - $a->points;
                    });
                    $results = array_slice($results, 0, $limit);
                }

                $leaderboard[$slug] = [];
                foreach ($results as $row) {
                    $user = get_user_by('id', $row->user_id);
                    if ($user) {
                        $leaderboard[$slug][] = [
                            'user_id' => $row->user_id,
                            'name' => $user->display_name,
                            'points' => (int) $row->points,
                            'avatar' => get_avatar_url($row->user_id, ['size' => 64])
                        ];
                    }
                }
            }
        }

        set_transient($cache_key, $leaderboard, $this->get_cache_ttl());
        return rest_ensure_response($leaderboard);
    }

    public function add_settings_page()
    {
        add_submenu_page(
            null,
            __('ZenGame Diagnosis', 'zengame'),
            __('ZenGame', 'zengame'),
            'manage_options',
            'zengame-settings',
            array($this, 'render_settings_page')
        );
    }

    public function render_settings_page()
    {
        if (!current_user_can('manage_options'))
            return;

        // Handle Cache Clearing Action
        if (isset($_GET['action']) && $_GET['action'] === 'clear_cache') {
            check_admin_referer('zengame_clear_cache');
            if (current_user_can('manage_options')) {
                $this->clear_all_gamipress_cache();
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('ZenGame Cache cleared successfully!', 'zengame') . '</p></div>';
            }
        }

        // Handle Settings Save
        if (isset($_POST['zengame_save_settings'])) {
            check_admin_referer('zengame_settings_save');
            if (isset($_POST['cache_ttl'])) {
                update_option('zengame_cache_ttl', absint($_POST['cache_ttl']));
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Settings saved!', 'zengame') . '</p></div>';
            }
        }

        $ttl = $this->get_cache_ttl();

        $point_types = function_exists('gamipress_get_points_types') ? gamipress_get_points_types() : [];
        $rank_types = function_exists('gamipress_get_rank_types') ? gamipress_get_rank_types() : [];
        $gamipress_active = defined('GAMIPRESS_VER');
        ?>
        <div class="wrap zen-diag-wrap">
            <h1 class="wp-heading-inline">ZenGame // System Diagnosis</h1>
            <hr class="wp-header-end">

            <div class="card"
                style="max-width: 800px; margin-top: 20px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <h2 style="border-bottom: 1px solid #edf2f7; padding-bottom: 15px; margin-top: 0;">Operational Status</h2>

                <table class="widefat striped" style="border: none;">
                    <tr>
                        <td style="width: 200px;"><strong>API Service</strong></td>
                        <td><span style="color: #10b981; font-weight: bold;">● ONLINE</span> (v1.2.0)</td>
                    </tr>
                    <tr>
                        <td><strong>Endpoints</strong></td>
                        <td>
                            <code>/wp-json/zengame/v1/me</code> (Consolidated)<br>
                            <code style="margin-top: 5px; display: block;">/wp-json/zengame/v1/leaderboard</code>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>GamiPress Core</strong></td>
                        <td>
                            <?php echo $gamipress_active ? '<span style="color: #10b981;">✓ Active (v' . GAMIPRESS_VER . ')</span>' : '<span style="color: #ef4444;">✗ Inactive</span>'; ?>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Cache Strategy</strong></td>
                        <td><code><?php echo self::CACHE_VERSION; ?></code> • TTL: <?php echo round($ttl / 3600, 1); ?>h</td>
                    </tr>
                </table>

                <div style="margin-top: 30px; padding: 20px; background: #f1f5f9; border-radius: 8px;">
                    <h3 style="margin-top: 0;">Settings</h3>
                    <form method="post" action="">
                        <?php wp_nonce_field('zengame_settings_save'); ?>
                        <table class="form-table">
                            <tr>
                                <th scope="row"><label for="cache_ttl">Cache TTL (seconds)</label></th>
                                <td>
                                    <input name="cache_ttl" type="number" id="cache_ttl" value="<?php echo esc_attr($ttl); ?>"
                                        class="regular-text">
                                    <p class="description">Default: 86400 (24 hours). Lower values increase DB load but refresh
                                        data faster.</p>
                                </td>
                            </tr>
                        </table>
                        <p class="submit">
                            <input type="submit" name="zengame_save_settings" id="submit" class="button button-primary"
                                value="Save Settings">
                        </p>
                    </form>
                </div>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #6366f1; padding-bottom: 5px;">Active Point Types</h3>
                    <div
                        style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 15px;">
                        <?php foreach ($point_types as $slug => $pt):
                            $thumb_url = get_the_post_thumbnail_url($pt['ID'], 'thumbnail');
                            ?>
                            <div
                                style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
                                <?php if ($thumb_url): ?>
                                    <img src="<?php echo esc_attr($thumb_url); ?>" alt="<?php echo esc_attr($pt['plural_name']); ?>"
                                        style="width: 32px; height: 32px; border-radius: 4px; background: #fff; object-fit: cover;">
                                <?php else: ?>
                                    <div
                                        style="width: 32px; height: 32px; border-radius: 4px; background: #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b;">
                                        <span class="dashicons dashicons-money-alt" style="font-size: 18px;"></span>
                                    </div>
                                <?php endif; ?>
                                <div>
                                    <div style="font-weight: 800; font-size: 14px;">
                                        <?php echo esc_html($pt['plural_name']); ?>
                                    </div>
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
                    <div
                        style="background: #1e293b; color: #cbd5e1; padding: 20px; border-radius: 8px; font-family: 'Monaco', 'Courier New', monospace; font-size: 12px; margin-top: 10px; line-height: 1.6;">
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
                            <code
                                style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_get_user_points($uid, 'slug')</code>
                            <code
                                style="font-size: 10px; display: block; word-break: break-all;">gamipress_award_points_to_user($uid, 100, 'slug')</code>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #ec4899;">
                            <strong
                                style="font-size: 11px; color: #475569; display: block; margin-bottom: 8px;">ACHIEVEMENTS</strong>
                            <code
                                style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_get_user_achievements($args)</code>
                            <code
                                style="font-size: 10px; display: block; word-break: break-all;">gamipress_get_earnings_count($args)</code>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 8px;">RANKS</strong>
                            <code
                                style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_get_user_rank($uid, 'type')</code>
                            <code
                                style="font-size: 10px; display: block; word-break: break-all;">gamipress_get_next_rank_id($rank_id)</code>
                        </div>
                        <div style="background: #f1f5f9; padding: 12px; border-radius: 6px; border-left: 4px solid #10b981;">
                            <strong style="font-size: 11px; color: #475569; display: block; margin-bottom: 8px;">LOGS</strong>
                            <code
                                style="font-size: 10px; display: block; margin-bottom: 4px; word-break: break-all;">gamipress_query_logs($args)</code>
                            <code style="font-size: 10px; display: block; word-break: break-all;">limit, order_by, order</code>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #edf2f7;">
                    <h3 style="color: #ef4444;">⚙️ Maintenance</h3>
                    <p class="description">Clear all cached user data and refresh from GamiPress core:</p>
                    <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=zengame-settings&action=clear_cache'), 'zengame_clear_cache'); ?>"
                        class="button button-secondary"
                        style="border-color: #ef4444; color: #ef4444; border-radius: 6px; padding: 8px 20px; font-weight: 600;">
                        🔄 Clear All ZenGame Cache
                    </a>
                </div>
            </div>

            <p style="margin-top: 20px; color: #64748b; font-size: 13px;">
                <span class="dashicons dashicons-info" style="font-size: 14px; margin-right: 5px;"></span>
                Version 1.1.0 • Built for Zen Eyer • <a href="<?php echo admin_url('admin.php?page=zen-control'); ?>"
                    style="color: #6366f1; text-decoration: none;">← Back to Zen Control</a>
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
     * Main endpoint: Integrated User Dashboard
     */
    public function get_user_dashboard($request)
    {
        $user_id = $this->get_authenticated_user_id($request);

        if (!$user_id) {
            return new WP_Error('no_user', 'User not authenticated', ['status' => 401]);
        }

        // Transient cache per user
        $cache_key = 'djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id;
        $cached = get_transient($cache_key);
        if ($cached !== false && !isset($_GET['nocache'])) {
            return rest_ensure_response($cached);
        }

        // --- 1. POINTS ---
        $point_data = [];
        $main_points_slug = 'points'; // Default
        if (function_exists('gamipress_get_points_types')) {
            $point_types = gamipress_get_points_types();
            foreach ($point_types as $slug => $pt) {
                if (empty($main_points_slug))
                    $main_points_slug = $slug;
                $point_data[$slug] = [
                    'name' => $pt['plural_name'],
                    'amount' => (int) gamipress_get_user_points($user_id, $slug),
                    'image' => get_the_post_thumbnail_url($pt['ID'], 'thumbnail') ?: ''
                ];
            }
        }

        // --- 2. RANK PROGRESS ---
        $rank_info = $this->get_detailed_rank_info($user_id);

        // --- 3. ACHIEVEMENTS ---
        $achievements = $this->get_user_achievements_categorized($user_id);

        // --- 4. LOGS ---
        $logs = [];
        if (function_exists('gamipress_query_logs')) {
            $raw_logs = gamipress_query_logs([
                'user_id' => $user_id,
                'limit' => 15,
                'order_by' => 'date',
                'order' => 'DESC'
            ]);

            foreach ($raw_logs as $log) {
                $logs[] = [
                    'id' => (int) $log->log_id,
                    'type' => $log->type,
                    'description' => $log->title,
                    'date' => $log->date,
                    'points' => (int) ($log->points ?? 0)
                ];
            }
        }

        // --- 5. DATA AGGREGATION (Fixed Undefined Variable) ---
        $data = [
            'user_id' => $user_id,
            'points' => $point_data,
            'main_points_slug' => $main_points_slug,
            'rank' => $rank_info,
            'achievements_earned' => $achievements['earned'],
            'achievements_locked' => $achievements['locked'],
            'recent_achievements' => array_slice($achievements['earned'], 0, 5),
            'logs' => $logs,
            'stats' => [
                'totalTracks' => $this->is_woo_active() ? $this->get_user_total_tracks($user_id) : 0,
                'eventsAttended' => $this->is_woo_active() ? $this->get_user_events_attended($user_id) : 0,
                'streak' => 0,
                'streakFire' => false
            ],
            'lastUpdate' => current_time('mysql'),
            'version' => '1.2.0'
        ];

        set_transient($cache_key, $data, $this->get_cache_ttl());
        return rest_ensure_response($data);
    }

    private function is_woo_active()
    {
        return class_exists('WooCommerce');
    }

    /**
     * Detailed Rank Info with Progress
     */
    private function get_detailed_rank_info($user_id)
    {
        $info = [
            'current' => null,
            'next' => null,
            'progress' => 0,
            'requirements' => []
        ];

        if (!function_exists('gamipress_get_user_rank'))
            return $info;

        $rank_types = gamipress_get_rank_types();
        if (empty($rank_types))
            return $info;

        $slug = array_key_first($rank_types);
        $current = gamipress_get_user_rank($user_id, $slug);

        if ($current) {
            $info['current'] = [
                'id' => $current->ID,
                'title' => $current->post_title,
                'image' => get_the_post_thumbnail_url($current->ID, 'thumbnail') ?: ''
            ];

            $next_id = gamipress_get_next_rank_id($current->ID);
            if ($next_id) {
                $next = get_post($next_id);
                $info['next'] = [
                    'id' => (int) $next_id,
                    'title' => $next->post_title,
                    'image' => get_the_post_thumbnail_url($next_id, 'thumbnail') ?: ''
                ];

                // Calculate progress based on requirements
                $requirements = gamipress_get_rank_requirements($next_id);
                if ($requirements) {
                    $total_percent = 0;
                    foreach ($requirements as $req) {
                        // Extract requirement details
                        $req_obj = gamipress_get_requirement($req->ID);
                        $required = (int) ($req_obj->times ?? 1);
                        $current_val = (int) gamipress_get_earnings_count([
                            'user_id' => $user_id,
                            'post_id' => $req_obj->post_id,
                            'requirement_id' => $req->ID
                        ]);

                        $percent = $required > 0 ? min(100, round(($current_val / $required) * 100)) : 100;
                        $total_percent += $percent;

                        $info['requirements'][] = [
                            'title' => $req->post_title,
                            'current' => $current_val,
                            'required' => $required,
                            'percent' => $percent
                        ];
                    }
                    $info['progress'] = round($total_percent / count($requirements));
                }
            } else {
                // Max rank reached
                $info['progress'] = 100;
            }
        }

        return $info;
    }

    /**
     * Achievements grouped by status
     */
    private function get_user_achievements_categorized($user_id)
    {
        $earned = [];
        $locked = [];

        $types = array_keys(gamipress_get_achievement_types());
        $all = get_posts(['post_type' => $types, 'numberposts' => -1, 'post_status' => 'publish']);

        $user_earned_ids = wp_list_pluck(gamipress_get_user_achievements(['user_id' => $user_id, 'achievement_type' => $types]), 'post_id');

        foreach ($all as $post) {
            $is_earned = in_array($post->ID, $user_earned_ids);
            $item = [
                'id' => (int) $post->ID,
                'title' => $post->post_title,
                'description' => $post->post_excerpt ?: $post->post_content,
                'image' => get_the_post_thumbnail_url($post->ID, 'medium') ?: '',
                'earned' => $is_earned,
                'date_earned' => $is_earned ? gamipress_get_user_achievement_date_earned($user_id, $post->ID) : '',
                'points_awarded' => 0 // Future logic if needed
            ];

            if ($is_earned)
                $earned[] = $item;
            else
                $locked[] = $item;
        }

        return ['earned' => $earned, 'locked' => array_slice($locked, 0, 10)];
    }

    /**
     * Get total downloadable products (music/tracks)
     */
    private function get_user_total_tracks($user_id)
    {
        if (!function_exists('wc_get_customer_available_downloads')) {
            return 0;
        }
        $downloads = wc_get_customer_available_downloads($user_id);
        return count($downloads);
    }

    /**
     * Count attended events based on WooCommerce order categories
     */
    private function get_user_events_attended($user_id)
    {
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
    private function init_cache_hooks()
    {
        // WooCommerce events
        add_action('woocommerce_order_status_completed', array($this, 'clear_user_gamipress_cache'));

        // GamiPress real-time invalidation
        add_action('gamipress_award_points_to_user', function ($user_id) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
        });

        add_action('gamipress_award_achievement', function ($user_id) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
        });

        add_action('gamipress_set_user_rank', function ($user_id) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
        });

        // Global invalidation on content change
        add_action('save_post_achievement', array($this, 'clear_all_gamipress_cache'));
        add_action('save_post_rank', array($this, 'clear_all_gamipress_cache'));
    }

    /**
     * Clear cache for specific user after order completion
     */
    public function clear_user_gamipress_cache($order_id)
    {
        $order = wc_get_order($order_id);
        if ($order && ($user_id = $order->get_user_id())) {
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_' . $user_id);
            delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_leaderboard_10');
        }
    }

    /**
     * Clear all ZenGame cache (called from admin panel)
     */
    public function clear_all_gamipress_cache()
    {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM $wpdb->options WHERE option_name LIKE %s",
            '%_transient_djz_gamipress_%'
        ));
    }
}

// Initialize singleton
ZenGame::get_instance();
