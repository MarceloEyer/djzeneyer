<?php
/**
 * Plugin Name: ZenGame Pro
 * Plugin URI: https://djzeneyer.com
 * Description: Gaming & Activity Bridge for DJ Zen Eyer (GamiPress + WooCommerce Headless integration).
 * Version: 1.2.5
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 * Text Domain: zengame
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 *
 * @package ZenEyer\Game
 */

namespace ZenEyer\Game;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class ZenGame
 *
 * The "Brain" of the gamification system. Aggregates GamiPress data,
 * handles WooCommerce activity tracking, and exposes secure REST endpoints.
 */
final class ZenGame
{
    /**
     * Singleton instance
     * @var ZenGame|null
     */
    private static $instance = null;

    /**
     * Cache version to force invalidation on structural changes
     */
    const CACHE_VERSION = 'v8';

    /**
     * Get singleton instance
     * @return ZenGame
     */
    public static function get_instance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor: Register hooks and routes
     */
    private function __construct()
    {
        // Core initialization
        \add_action('rest_api_init', array($this, 'register_routes'));
        \add_action('admin_init', array($this, 'register_settings'));
        \add_action('admin_menu', array($this, 'add_admin_menu'));

        // Activity tracking hooks
        \add_action('wp_login', array($this, 'update_login_streak'), 10, 2);

        // Cache management
        $this->init_cache_hooks();

        // SEO/Robots
        \add_filter('wp_robots', array($this, 'allow_api_indexing'));
    }

    /**
     * Register Plugin Settings via Settings API
     */
    public function register_settings()
    {
        \register_setting('zengame_settings', 'zengame_cache_ttl', [
            'type' => 'integer',
            'sanitize_callback' => 'absint',
            'default' => 86400, // 24h
        ]);

        \add_settings_section(
            'zengame_main_section',
            \__('System Configuration', 'zengame'),
            null,
            'zengame-settings'
        );

        \add_settings_field(
            'cache_ttl',
            \__('Cache TTL (seconds)', 'zengame'),
            array($this, 'render_cache_ttl_field'),
            'zengame-settings',
            'zengame_main_section'
        );
    }

    /**
     * Update login streak when user logs in
     * 
     * @param string $user_login
     * @param \WP_User $user
     */
    public function update_login_streak($user_login, $user)
    {
        $user_id = $user->ID;
        $today = \current_time('Y-m-d');
        $last_login = \get_user_meta($user_id, 'zen_last_login', true);
        $streak = (int) \get_user_meta($user_id, 'zen_login_streak', true);

        if ($last_login === $today) {
            return;
        }

        $yesterday = \date('Y-m-d', \strtotime('-1 day', \current_time('timestamp')));

        if ($last_login === $yesterday) {
            $streak++;
        } else {
            $streak = 1; // Reset or start new
        }

        \update_user_meta($user_id, 'zen_last_login', $today);
        \update_user_meta($user_id, 'zen_login_streak', $streak);

        // Proactive cache invalidation
        $this->clear_user_cache_on_gamipress($user_id);
    }

    /**
     * Register REST API routes
     * 
     * Endpoints:
     * - GET /zengame/v1/me: Returns aggregated dashboard data (Points, Ranks, Achievements, Logs, Stats)
     * - GET /zengame/v1/leaderboard: Returns public leaderboard for specific point types
     */
    public function register_routes()
    {
        $ns = 'zengame/v1';

        // Private Dashboard
        \register_rest_route($ns, '/me', [
            'methods' => 'GET',
            'callback' => array($this, 'get_user_dashboard'),
            'permission_callback' => array($this, 'check_auth'),
        ]);

        // Public Leaderboard
        \register_rest_route($ns, '/leaderboard', [
            'methods' => 'GET',
            'callback' => array($this, 'get_leaderboard'),
            'permission_callback' => '__return_true',
            'args' => [
                'limit' => [
                    'type' => 'integer',
                    'default' => 10,
                    'sanitize_callback' => '\absint'
                ],
                'point_type' => [
                    'type' => 'string',
                    'sanitize_callback' => '\sanitize_key'
                ]
            ]
        ]);
    }

    /**
     * Authorization checkpoint
     */
    public function check_auth($request)
    {
        return $this->get_authenticated_user_id($request) > 0;
    }

    /**
     * Extract user ID from JWT or active PHP session
     */
    private function get_authenticated_user_id($request)
    {
        $user_id = \get_current_user_id();

        if (!$user_id) {
            $auth_header = $request->get_header('Authorization');
            if ($auth_header && \preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
                $token = \trim($matches[1]);
                if (\class_exists('\ZenEyer\Auth\Core\JWT_Manager')) {
                    $decoded = \ZenEyer\Auth\Core\JWT_Manager::validate_token($token);
                    if (!\is_wp_error($decoded) && isset($decoded->data->user_id)) {
                        $user_id = (int) $decoded->data->user_id;
                    }
                }
            }
        }

        return $user_id;
    }

    /**
     * Admin Menu registration
     */
    public function add_admin_menu()
    {
        \add_menu_page(
            \__('ZenGame', 'zengame'),
            \__('ZenGame', 'zengame'),
            'manage_options',
            'zengame',
            array($this, 'render_admin_dashboard'),
            'dashicons-games'
        );

        \add_submenu_page(
            'zengame',
            \__('Settings', 'zengame'),
            \__('Settings', 'zengame'),
            'manage_options',
            'zengame-settings',
            array($this, 'render_settings_page')
        );
    }

    /**
     * Render the Admin Dashboard (Diagnosis)
     */
    public function render_admin_dashboard()
    {
        if (!\current_user_can('manage_options'))
            return;

        // Handle Quick Actions
        if (isset($_GET['action']) && $_GET['action'] === 'clear_cache') {
            \check_admin_referer('zengame_clear_cache');
            $this->clear_all_gamipress_cache();
            echo '<div class="notice notice-success"><p>' . \esc_html__('All ZenGame caches purged.', 'zengame') . '</p></div>';
        }

        $woo_active = $this->is_woo_active();
        $gp_active = \defined('GAMIPRESS_VER');

        ?>
        <div class="wrap">
            <h1>ZenGame // Dashboard</h1>
            <div class="welcome-panel"
                style="background: #111; color: #fff; padding: 40px; border-radius: 12px; border: 1px solid #333;">
                <div class="welcome-panel-content">
                    <h2 style="color: #0D96FF; font-family: 'Inter', sans-serif; font-weight: 900; letter-spacing: -1px;">SYSTEM
                        STATUS: ONLINE</h2>
                    <p class="about-description" style="color: #aaa;">Plugin Version 1.2.5 // Headless Bridge for DJ Zen Eyer
                    </p>

                    <div
                        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px;">
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
                            <strong
                                style="display: block; font-size: 10px; color: #555; text-transform: uppercase;">WooCommerce</strong>
                            <span
                                style="font-size: 18px; color: <?php echo $woo_active ? '#4ade80' : '#f87171'; ?>;"><?php echo $woo_active ? 'ACTIVE' : 'INACTIVE'; ?></span>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
                            <strong
                                style="display: block; font-size: 10px; color: #555; text-transform: uppercase;">GamiPress</strong>
                            <span
                                style="font-size: 18px; color: <?php echo $gp_active ? '#4ade80' : '#f87171'; ?>;"><?php echo $gp_active ? 'ACTIVE' : 'INACTIVE'; ?></span>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
                            <strong style="display: block; font-size: 10px; color: #555; text-transform: uppercase;">Cache
                                Version</strong>
                            <span style="font-size: 18px; color: #0D96FF;"><?php echo self::CACHE_VERSION; ?></span>
                        </div>
                    </div>

                    <div style="margin-top: 40px;">
                        <a href="<?php echo \wp_nonce_url(\admin_url('admin.php?page=zengame&action=clear_cache'), 'zengame_clear_cache'); ?>"
                            class="button button-primary button-hero"
                            style="background: #ff4757; border: none; box-shadow: 0 4px 14px rgba(255,71,87,0.4);">
                            PURGE ALL TRANSIENTS
                        </a>
                    </div>
                </div>
            </div>

            <div class="card" style="margin-top: 20px;">
                <h3>Active REST Endpoints</h3>
                <code>GET /wp-json/zengame/v1/me</code> (Authenticated)<br>
                <code>GET /wp-json/zengame/v1/leaderboard</code> (Public)
            </div>
        </div>
        <?php
    }

    /**
     * Render Settings Page
     */
    public function render_settings_page()
    {
        ?>
        <div class="wrap">
            <h1>ZenGame // Settings</h1>
            <form action="options.php" method="post">
                <?php
                \settings_fields('zengame_settings');
                \do_settings_sections('zengame-settings');
                \submit_button();
                ?>
            </form>
        </div>
        <?php
    }

    public function render_cache_ttl_field()
    {
        $val = \get_option('zengame_cache_ttl', 86400);
        echo '<input type="number" name="zengame_cache_ttl" value="' . \esc_attr($val) . '" class="small-text"> <span>seconds (default 86400 = 24h)</span>';
    }

    /**
     * Aggregated User Data for Dashboard
     */
    public function get_user_dashboard($request)
    {
        $user_id = $this->get_authenticated_user_id($request);
        if (!$user_id)
            return new \WP_Error('no_user', 'Unauthorized', ['status' => 401]);

        $cache_key = 'djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id;
        $cached = \get_transient($cache_key);
        if ($cached !== false && !isset($_GET['nocache'])) {
            return \rest_ensure_response($cached);
        }

        $point_data = [];
        $main_slug = '';
        if (\function_exists('gamipress_get_points_types')) {
            $types = \gamipress_get_points_types();
            foreach ($types as $slug => $pt) {
                if (empty($main_slug))
                    $main_slug = $slug;
                $point_data[$slug] = [
                    'name' => $pt['plural_name'],
                    'amount' => (int) \gamipress_get_user_points($user_id, $slug),
                    'image' => \get_the_post_thumbnail_url($pt['ID'], 'thumbnail') ?: ''
                ];
            }
        }

        $achievements = $this->get_categorized_achievements($user_id);
        $streak = (int) \get_user_meta($user_id, 'zen_login_streak', true);

        $data = [
            'user_id' => $user_id,
            'points' => $point_data,
            'main_points_slug' => $main_slug ?: 'points',
            'rank' => $this->get_rank_info($user_id),
            'achievements_earned' => $achievements['earned'],
            'achievements_locked' => $achievements['locked'],
            'recent_achievements' => \array_slice($achievements['earned'], 0, 5),
            'logs' => $this->get_activity_logs($user_id),
            'stats' => [
                'totalTracks' => $this->get_user_total_tracks($user_id),
                'eventsAttended' => $this->get_user_events_attended($user_id),
                'streak' => $streak,
                'streakFire' => $streak > 1,
            ],
            'lastUpdate' => \current_time('mysql'),
            'version' => '1.2.5'
        ];

        \set_transient($cache_key, $data, $this->get_cache_ttl());
        return \rest_ensure_response($data);
    }

    /**
     * Categorize Achievements (Earned vs Locked)
     */
    private function get_categorized_achievements($user_id)
    {
        if (!\function_exists('gamipress_get_achievement_types'))
            return ['earned' => [], 'locked' => []];

        $types = \array_keys(\gamipress_get_achievement_types());
        $all = \get_posts(['post_type' => $types, 'numberposts' => 100, 'post_status' => 'publish']);
        $earned_ids = \wp_list_pluck(\gamipress_get_user_achievements(['user_id' => $user_id, 'achievement_type' => $types]), 'post_id');

        $earned = [];
        $locked = [];
        foreach ($all as $post) {
            $is_earned = \in_array($post->ID, $earned_ids);
            $item = [
                'id' => (int) $post->ID,
                'title' => $post->post_title,
                'description' => $post->post_excerpt ?: $post->post_content,
                'image' => \get_the_post_thumbnail_url($post->ID, 'medium') ?: '',
                'earned' => $is_earned,
                'points_awarded' => (int) \get_post_meta($post->ID, '_gamipress_points_awarded', true),
                'date_earned' => $is_earned ? \gamipress_get_user_achievement_date_earned($user_id, $post->ID) : '',
            ];
            if ($is_earned)
                $earned[] = $item;
            else
                $locked[] = $item;
        }
        return ['earned' => $earned, 'locked' => $locked];
    }

    /**
     * Get user activity logs
     */
    private function get_activity_logs($user_id)
    {
        if (!\function_exists('gamipress_query_logs'))
            return [];
        $raw = \gamipress_query_logs(['user_id' => $user_id, 'limit' => 20]);
        $logs = [];
        foreach ($raw as $log) {
            $logs[] = [
                'id' => (int) $log->log_id,
                'type' => $log->type,
                'description' => $log->title,
                'date' => $log->date,
                'points' => (int) $log->points
            ];
        }
        return $logs;
    }

    /**
     * Get Rank Progression
     */
    private function get_rank_info($user_id)
    {
        $info = [
            'current' => ['id' => 0, 'title' => \__('Zen Novice', 'zengame'), 'image' => ''],
            'next' => null,
            'progress' => 0,
            'requirements' => []
        ];

        if (!\function_exists('gamipress_get_user_rank'))
            return $info;

        $rank_types = \gamipress_get_rank_types();
        if (empty($rank_types))
            return $info;

        $slug = \array_key_first($rank_types);
        $current = \gamipress_get_user_rank($user_id, $slug);

        if ($current) {
            $info['current'] = [
                'id' => (int) $current->ID,
                'title' => $current->post_title,
                'image' => \get_the_post_thumbnail_url($current->ID, 'thumbnail') ?: ''
            ];

            $next_id = \gamipress_get_next_rank_id($current->ID);
            if ($next_id) {
                $next = \get_post($next_id);
                $info['next'] = [
                    'id' => (int) $next_id,
                    'title' => $next->post_title ?? '',
                    'image' => \get_the_post_thumbnail_url($next_id, 'thumbnail') ?: ''
                ];

                // Calculate progress based on requirements
                $requirements = \gamipress_get_rank_requirements($next_id);
                if (!empty($requirements)) {
                    $total_pct = 0;
                    foreach ($requirements as $req) {
                        $req_obj = \gamipress_get_requirement($req->ID);
                        $needed = (int) ($req_obj->times ?? 1);
                        $got = (int) \gamipress_get_earnings_count(['user_id' => $user_id, 'requirement_id' => $req->ID]);
                        $pct = $needed > 0 ? \min(100, \round(($got / $needed) * 100)) : 100;
                        $total_pct += $pct;
                        $info['requirements'][] = ['title' => $req->post_title, 'current' => $got, 'required' => $needed, 'percent' => $pct];
                    }
                    $info['progress'] = \round($total_pct / \count($requirements));
                }
            } else {
                $info['progress'] = 100; // Max Rank
            }
        }
        return $info;
    }

    /**
     * Leaderboard endpoint logic
     */
    public function get_leaderboard($request)
    {
        if (!\function_exists('gamipress_get_points_types'))
            return new \WP_Error('gamipress_missing', 'Service unavailable', ['status' => 503]);

        $limit = \max(1, \min(50, (int) $request->get_param('limit')));
        $type = $request->get_param('point_type');

        $cache_key = 'djz_gamipress_leaderboard_' . self::CACHE_VERSION . '_' . $limit . '_' . $type;
        $cached = \get_transient($cache_key);
        if ($cached !== false)
            return \rest_ensure_response($cached);

        $types = $type ? [$type => []] : \gamipress_get_points_types();
        global $wpdb;
        $leaderboard = [];

        foreach ($types as $slug => $pt) {
            $query = "SELECT p.user_id, p.points, u.display_name 
                      FROM {$wpdb->prefix}gamipress_user_points p
                      JOIN {$wpdb->users} u ON p.user_id = u.ID
                      WHERE p.points_type = %s 
                      ORDER BY p.points DESC LIMIT %d";
            $results = $wpdb->get_results($wpdb->prepare($query, $slug, $limit));

            $leaderboard[$slug] = [];
            foreach ($results as $row) {
                $leaderboard[$slug][] = [
                    'user_id' => (int) $row->user_id,
                    'display_name' => $row->display_name,
                    'points' => (int) $row->points,
                    'avatar' => \get_avatar_url($row->user_id, ['size' => 64])
                ];
            }
        }

        \set_transient($cache_key, $leaderboard, $this->get_cache_ttl());
        return \rest_ensure_response($leaderboard);
    }

    /**
     * Track count via WooCommerce downloads
     */
    private function get_user_total_tracks($user_id)
    {
        if (!\function_exists('wc_get_customer_available_downloads'))
            return 0;
        return \count(\wc_get_customer_available_downloads($user_id));
    }

    /**
     * Events attended via HPOS-safe query
     */
    private function get_user_events_attended($user_id)
    {
        if (!$this->is_woo_active())
            return 0;

        $target_slugs = ['events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass'];
        $order_ids = \wc_get_orders([
            'customer' => $user_id,
            'status' => ['completed', 'processing'],
            'limit' => -1,
            'return' => 'ids',
        ]);

        $total_qty = 0;
        foreach ($order_ids as $order_id) {
            $order = \wc_get_order($order_id);
            if (!$order)
                continue;
            foreach ($order->get_items() as $item) {
                $terms = \get_the_terms($item->get_product_id(), 'product_cat');
                if ($terms && !\is_wp_error($terms)) {
                    foreach ($terms as $term) {
                        if (\in_array($term->slug, $target_slugs)) {
                            $total_qty += $item->get_quantity();
                            break;
                        }
                    }
                }
            }
        }
        return $total_qty;
    }

    private function get_cache_ttl()
    {
        return \get_option('zengame_cache_ttl', 86400);
    }
    private function is_woo_active()
    {
        return \class_exists('WooCommerce');
    }

    private function init_cache_hooks()
    {
        \add_action('woocommerce_order_status_completed', array($this, 'clear_user_gamipress_cache'));
        \add_action('gamipress_award_points_to_user', array($this, 'clear_user_cache_on_gamipress'));
        \add_action('gamipress_award_achievement', array($this, 'clear_user_cache_on_gamipress'));
        \add_action('gamipress_set_user_rank', array($this, 'clear_user_cache_on_gamipress'));
    }

    public function clear_user_cache_on_gamipress($user_id)
    {
        \delete_transient('djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id);
    }
    public function clear_user_gamipress_cache($order_id)
    {
        $order = \wc_get_order($order_id);
        if ($order && ($user_id = $order->get_user_id()))
            $this->clear_user_cache_on_gamipress($user_id);
    }

    public function clear_all_gamipress_cache()
    {
        global $wpdb;
        $wpdb->query($wpdb->prepare("DELETE FROM $wpdb->options WHERE option_name LIKE %s", '%_transient_djz_gamipress_%'));
    }

    public function allow_api_indexing($robots)
    {
        $robots['googlebot'] = 'index, follow';
        return $robots;
    }
}

// Bootstrap
ZenGame::get_instance();
