<?php
/**
 * Plugin Name: ZenGame
 * Description: Gaming & Activity Bridge for DJ Zen Eyer. Centralizes GamiPress logic for Headless API + SEO optimization.
 * Version: 1.1.1
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
    const CACHE_VERSION = 'v9';

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
        $robots['googlebot'] = 'index, follow';
        return $robots;
    }

    /**
     * Public leaderboard with filtering support
     */
    public function get_leaderboard($request)
    {
        if (!function_exists('gamipress_get_points_types')) {
            return new WP_Error('gamipress_missing', 'GamiPress not found', ['status' => 503]);
        }

        $limit = absint($request->get_param('limit')) ?: 50;
        $period = $request->get_param('period') ?: 'all';

        $cache_key = 'djz_gamipress_' . self::CACHE_VERSION . '_leaderboard_' . $limit . '_' . $period;

        $cached = get_transient($cache_key);
        if ($cached !== false) {
            return rest_ensure_response($cached);
        }

        $leaderboard = [];
        $point_types = gamipress_get_points_types();

        foreach ($point_types as $slug => $pt) {
            global $wpdb;

            $query = "SELECT user_id, points FROM {$wpdb->prefix}gamipress_user_points WHERE points_type = %s";

            if ($period !== 'all') {
                $days = ($period === '30d') ? 30 : 7;
                $query = "SELECT log.user_id, SUM(log.points) as points 
                             FROM {$wpdb->prefix}gamipress_logs as log
                             WHERE log.type = %s AND log.date >= DATE_SUB(NOW(), INTERVAL %d DAY)
                             GROUP BY log.user_id";

                $results = $wpdb->get_results($wpdb->prepare($query, $slug, $days));
            } else {
                $query .= " ORDER BY points DESC LIMIT %d";
                $results = $wpdb->get_results($wpdb->prepare($query, $slug, $limit));
            }

            if ($period !== 'all' && !empty($results)) {
                usort($results, function ($a, $b) {
                    return $b->points - $a->points;
                });
                $results = array_slice($results, 0, $limit);
            }

            $leaderboard[$slug] = [];
            if (!empty($results)) {
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

        if (isset($_GET['action']) && $_GET['action'] === 'clear_cache') {
            check_admin_referer('zengame_clear_cache');
            $this->clear_all_gamipress_cache();
            echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('ZenGame Cache cleared successfully!', 'zengame') . '</p></div>';
        }

        if (isset($_POST['zengame_save_settings'])) {
            check_admin_referer('zengame_settings_save');
            if (isset($_POST['cache_ttl'])) {
                update_option('zengame_cache_ttl', absint($_POST['cache_ttl']));
                echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__('Settings saved!', 'zengame') . '</p></div>';
            }
        }

        $ttl = $this->get_cache_ttl();
        $point_types = function_exists('gamipress_get_points_types') ? gamipress_get_points_types() : [];
        $gamipress_active = defined('GAMIPRESS_VER');
        ?>
                <div class="wrap zen-diag-wrap">
                    <h1>ZenGame // System Diagnosis</h1>
                    <div class="card">
                        <h2>Operational Status</h2>
                        <table class="widefat striped">
                            <tr>
                                <td><strong>API Service</strong></td>
                                <td>ONLINE (v1.2.1)</td>
                            </tr>
                            <tr>
                                <td><strong>GamiPress Core</strong></td>
                                <td><?php echo $gamipress_active ? 'Active' : 'Inactive'; ?></td>
                            </tr>
                        </table>
                    </div>
                    <div style="margin-top: 20px;">
                        <a href="<?php echo wp_nonce_url(admin_url('admin.php?page=zengame-settings&action=clear_cache'), 'zengame_clear_cache'); ?>" class="button">Clear Cache</a>
                    </div>
                </div>
                <?php
    }

    public function get_user_dashboard($request)
    {
        $user_id = $this->get_authenticated_user_id($request);

        if (!$user_id) {
            return new WP_Error('no_user', 'User not authenticated', ['status' => 401]);
        }

        $cache_key = 'djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id;
        $cached = get_transient($cache_key);
        if ($cached !== false && !isset($_GET['nocache'])) {
            return rest_ensure_response($cached);
        }

        $point_data = [];
        $main_points_slug = '';
        if (function_exists('gamipress_get_points_types')) {
            $point_types = gamipress_get_points_types();
            foreach ($point_types as $slug => $pt) {
                if (empty($main_points_slug))
                    $main_points_slug = $slug;

                if (function_exists('gamipress_get_user_points')) {
                    $point_data[$slug] = [
                        'name' => $pt['plural_name'],
                        'amount' => (int) gamipress_get_user_points($user_id, $slug),
                        'image' => get_the_post_thumbnail_url($pt['ID'], 'thumbnail') ?: ''
                    ];
                }
            }
        }
        if (empty($main_points_slug))
            $main_points_slug = 'points';

        $rank_info = $this->get_detailed_rank_info($user_id);
        $achievements = $this->get_user_achievements_categorized($user_id);

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
                    'id' => (int) ($log->log_id ?? 0),
                    'type' => $log->type ?? '',
                    'description' => $log->title ?? '',
                    'date' => $log->date ?? '',
                    'points' => (int) ($log->points ?? 0)
                ];
            }
        }

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
            ],
            'lastUpdate' => current_time('mysql'),
            'version' => '1.2.1'
        ];

        set_transient($cache_key, $data, $this->get_cache_ttl());
        return rest_ensure_response($data);
    }

    private function is_woo_active()
    {
        return class_exists('WooCommerce');
    }

    private function get_detailed_rank_info($user_id)
    {
        $info = ['current' => null, 'next' => null, 'progress' => 0, 'requirements' => []];
        if (!function_exists('gamipress_get_user_rank'))
            return $info;

        $rank_types = function_exists('gamipress_get_rank_types') ? gamipress_get_rank_types() : [];
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

            if (function_exists('gamipress_get_next_rank_id')) {
                $next_id = gamipress_get_next_rank_id($current->ID);
                if ($next_id) {
                    $next = get_post($next_id);
                    $info['next'] = [
                        'id' => (int) $next_id,
                        'title' => $next->post_title ?? '',
                        'image' => get_the_post_thumbnail_url($next_id, 'thumbnail') ?: ''
                    ];

                    if (function_exists('gamipress_get_rank_requirements')) {
                        $requirements = gamipress_get_rank_requirements($next_id);
                        if (!empty($requirements)) {
                            $total_percent = 0;
                            foreach ($requirements as $req) {
                                if (!function_exists('gamipress_get_requirement'))
                                    continue;
                                $req_obj = gamipress_get_requirement($req->ID);
                                $required = (int) ($req_obj->times ?? 1);
                                $current_val = 0;
                                if (function_exists('gamipress_get_earnings_count')) {
                                    $current_val = (int) gamipress_get_earnings_count([
                                        'user_id' => $user_id,
                                        'post_id' => $req_obj->post_id ?? 0,
                                        'requirement_id' => $req->ID
                                    ]);
                                }
                                $percent = $required > 0 ? min(100, round(($current_val / $required) * 100)) : 100;
                                $total_percent += $percent;
                                $info['requirements'][] = ['title' => $req->post_title, 'current' => $current_val, 'required' => $required, 'percent' => $percent];
                            }
                            $info['progress'] = round($total_percent / count($requirements));
                        }
                    }
                } else {
                    $info['progress'] = 100;
                }
            }
        }
        return $info;
    }

    private function get_user_achievements_categorized($user_id)
    {
        if (!function_exists('gamipress_get_achievement_types') || !function_exists('gamipress_get_user_achievements')) {
            return ['earned' => [], 'locked' => []];
        }

        $achievement_types = gamipress_get_achievement_types();
        if (empty($achievement_types))
            return ['earned' => [], 'locked' => []];

        $types = array_keys($achievement_types);
        $all = get_posts(['post_type' => $types, 'numberposts' => -1, 'post_status' => 'publish']);
        $user_earned_ids = wp_list_pluck(gamipress_get_user_achievements(['user_id' => $user_id, 'achievement_type' => $types]), 'post_id');

        $earned = [];
        $locked = [];
        foreach ($all as $post) {
            $is_earned = in_array($post->ID, $user_earned_ids);
            $item = [
                'id' => (int) $post->ID,
                'title' => $post->post_title,
                'description' => $post->post_excerpt ?: $post->post_content,
                'image' => get_the_post_thumbnail_url($post->ID, 'medium') ?: '',
                'earned' => $is_earned,
                'date_earned' => $is_earned ? (function_exists('gamipress_get_user_achievement_date_earned') ? gamipress_get_user_achievement_date_earned($user_id, $post->ID) : '') : '',
            ];
            if ($is_earned)
                $earned[] = $item;
            else
                $locked[] = $item;
        }
        return ['earned' => $earned, 'locked' => array_slice($locked, 0, 10)];
    }

    private function get_user_total_tracks($user_id)
    {
        if (!function_exists('wc_get_customer_available_downloads'))
            return 0;
        return count(wc_get_customer_available_downloads($user_id));
    }

    private function get_user_events_attended($user_id)
    {
        if (!function_exists('wc_get_orders'))
            return 0;
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

    private function init_cache_hooks()
    {
        add_action('woocommerce_order_status_completed', array($this, 'clear_user_gamipress_cache'));
        add_action('gamipress_award_points_to_user', array($this, 'clear_user_cache_on_gamipress'));
        add_action('gamipress_award_achievement', array($this, 'clear_user_cache_on_gamipress'));
        add_action('gamipress_set_user_rank', array($this, 'clear_user_cache_on_gamipress'));
    }

    public function clear_user_cache_on_gamipress($user_id)
    {
        delete_transient('djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id);
    }

    public function clear_user_gamipress_cache($order_id)
    {
        if (function_exists('wc_get_order')) {
            $order = wc_get_order($order_id);
            if ($order && ($user_id = $order->get_user_id())) {
                $this->clear_user_cache_on_gamipress($user_id);
                delete_transient('djz_gamipress_' . self::CACHE_VERSION . '_leaderboard_10');
            }
        }
    }

    public function clear_all_gamipress_cache()
    {
        global $wpdb;
        $wpdb->query($wpdb->prepare("DELETE FROM $wpdb->options WHERE option_name LIKE %s", '%_transient_djz_gamipress_%'));
    }
}

ZenGame::get_instance();
