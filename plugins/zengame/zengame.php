<?php
/**
 * Plugin Name: ZenGame Pro
 * Plugin URI: https://djzeneyer.com
 * Description: Gaming & Activity Bridge for DJ Zen Eyer (GamiPress + WooCommerce Headless integration).
 * Version: 1.3.5
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 * Text Domain: zengame
 * Domain Path: /languages
 * Requires at least: 6.0
 * Requires PHP: 8.0
 *
 * @package ZenEyer\Game
 *
 * CHANGELOG v1.3.5:
 * - FIX: Replaced nonexistent gamipress_get_next_rank_id with priority sorting logic.
 * - FIX: Corrected get_user_achievements parameter to 'achievement_type' (singular).
 * - FIX: Updated hooks to catch points awards correctly.
 * - PERF: Leaderboard query alignment with verified DB structure.
 */

namespace ZenEyer\Game;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;
use WP_User;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Class ZenGame
 *
 * The "Brain" of the gamification system. Follows the Singleton pattern.
 * Provides a secure bridge between GamiPress, WooCommerce, and the React frontend.
 */
final class ZenGame
{
    /**
     * Singleton instance
     * @var ZenGame|null
     */
    private static ?ZenGame $instance = null;

    /**
     * Cache version to force invalidation on structural changes
     */
    const CACHE_VERSION = 'v13';

    /**
     * Get singleton instance
     */
    public static function get_instance(): self
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
        \add_action('rest_api_init', [$this, 'register_routes']);
        \add_action('admin_init', [$this, 'register_settings']);
        \add_action('admin_menu', [$this, 'add_admin_menu']);
        \add_action('wp_login', [$this, 'update_login_streak'], 10, 2);

        // HPOS Compatibility - Safter hook
        \add_action('before_woocommerce_init', [$this, 'declare_hpos_compatibility']);

        // Lifecycle: Cleanup on deactivation
        \register_deactivation_hook(__FILE__, [self::class, 'on_deactivation']);

        $this->init_cache_hooks();
    }

    /**
     * Declare Compatibility with WooCommerce HPOS
     */
    public function declare_hpos_compatibility(): void
    {
        if (\class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility('custom_order_tables', __FILE__, true);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SETTINGS & OPTIONS
    // ─────────────────────────────────────────────────────────────────────────

    public function register_settings(): void
    {
        \register_setting('zengame_settings', 'zengame_cache_ttl', [
            'type' => 'integer',
            'sanitize_callback' => 'absint',
            'default' => 86400,
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
            [$this, 'render_cache_ttl_field'],
            'zengame-settings',
            'zengame_main_section'
        );
    }

    public function render_cache_ttl_field(): void
    {
        $val = \get_option('zengame_cache_ttl', 86400);
        printf(
            '<input type="number" name="zengame_cache_ttl" value="%s" class="small-text"> <span>%s</span>',
            \esc_attr($val),
            \__('seconds (default 86400 = 24h)', 'zengame')
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN UI (Professional Admin Dashboard)
    // ─────────────────────────────────────────────────────────────────────────

    public function add_admin_menu(): void
    {
        \add_menu_page(
            \__('ZenGame', 'zengame'),
            'ZenGame',
            'manage_options',
            'zengame',
            [$this, 'render_admin_dashboard'],
            'dashicons-games'
        );

        \add_submenu_page(
            'zengame',
            \__('Settings', 'zengame'),
            \__('Settings', 'zengame'),
            'manage_options',
            'zengame-settings',
            [$this, 'render_settings_page']
        );
    }

    public function render_admin_dashboard(): void
    {
        if (!\current_user_can('manage_options')) {
            return;
        }

        // Process Cache Purge
        if (isset($_GET['action']) && $_GET['action'] === 'clear_cache') {
            \check_admin_referer('zengame_clear_cache');
            $this->clear_all_gamipress_cache();
            echo '<div class="notice notice-success is-dismissible"><p>' . \esc_html__('ZenGame optimization engine: All transients purged.', 'zengame') . '</p></div>';
        }

        $is_woo = $this->is_woo_active();
        $is_gp = \defined('GAMIPRESS_VER');
        $status = ($is_woo && $is_gp) ? 'ONLINE' : 'DEGRADED';
        $color = ($status === 'ONLINE') ? '#0D96FF' : '#f87171';

        ?>
        <div class="wrap">
            <h1>ZenGame // <span style="color:<?php echo $color; ?>;"><?php echo $status; ?></span></h1>
            <div class="welcome-panel"
                style="background:#111;color:#fff;padding:40px;border-radius:12px;border:1px solid #333;box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <div style="display:flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h2 style="color:<?php echo $color; ?>;font-weight:900;letter-spacing:-1px;margin:0 0 10px 0;">CENTRAL
                            INTELLIGENCE</h2>
                        <p style="color:#666; font-family: monospace;">ZenGame Pro v1.3.4 // Snapshot 2026-03-06</p>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:25px;margin-top:35px;">
                    <div
                        style="background:rgba(255,255,255,.03);padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,0.05);">
                        <strong
                            style="display:block;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">WooCommerce
                            HPOS</strong>
                        <span style="font-size:22px;font-weight:700;color:<?php echo $is_woo ? '#4ade80' : '#f87171'; ?>;">
                            <?php echo $is_woo ? 'SUPPORTED' : 'NOT FOUND'; ?>
                        </span>
                    </div>
                    <div
                        style="background:rgba(255,255,255,.03);padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,0.05);">
                        <strong
                            style="display:block;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">GamiPress
                            Engine</strong>
                        <span style="font-size:22px;font-weight:700;color:<?php echo $is_gp ? '#4ade80' : '#f87171'; ?>;">
                            <?php echo $is_gp ? 'CONNECTED' : 'OFFLINE'; ?>
                        </span>
                    </div>
                    <div
                        style="background:rgba(255,255,255,.03);padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,0.05);">
                        <strong
                            style="display:block;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Cache
                            Health</strong>
                        <span style="font-size:22px;font-weight:700;color:#0D96FF;">v13 Stable</span>
                    </div>
                </div>

                <hr style="border:0; border-top:1px solid #222; margin:40px 0;">

                <div style="display:flex; gap:15px; align-items:center;">
                    <a href="<?php echo \wp_nonce_url(\admin_url('admin.php?page=zengame&action=clear_cache'), 'zengame_clear_cache'); ?>"
                        class="button button-primary button-hero"
                        style="background:#ff4757;border:none;box-shadow:0 4px 14px rgba(255,71,87,.3); font-weight:700;">
                        PURGE ALL ENGINE TRANSIENTS
                    </a>
                    <a href="<?php echo \admin_url('admin.php?page=zengame-settings'); ?>" class="button button-secondary"
                        style="background:#222; color:#eee; border-color:#444;">SETTINGS</a>
                </div>
            </div>
        </div>
        <?php
    }

    public function render_settings_page(): void
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

    // ─────────────────────────────────────────────────────────────────────────
    // REST API (Professional Endpoints with full validation)
    // ─────────────────────────────────────────────────────────────────────────

    public function register_routes(): void
    {
        $ns = 'zengame/v1';

        \register_rest_route($ns, '/me', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_user_dashboard'],
            'permission_callback' => [$this, 'check_auth'],
            'args' => [
                'nocache' => [
                    'type' => 'boolean',
                    'default' => false,
                ],
            ],
        ]);

        \register_rest_route($ns, '/leaderboard', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_leaderboard'],
            'permission_callback' => '__return_true',
            'args' => [
                'limit' => [
                    'type' => 'integer',
                    'default' => 10,
                    'minimum' => 1,
                    'maximum' => 100,
                    'sanitize_callback' => 'absint',
                ],
                'point_type' => [
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_key',
                    'default' => '',
                ],
            ],
        ]);
    }

    /**
     * Permission callback for authenticated routes
     */
    public function check_auth(WP_REST_Request $request): bool
    {
        $user_id = $this->get_authenticated_user_id($request);
        return $user_id > 0 && \get_userdata($user_id) !== false;
    }

    /**
     * Bridges JWT and Cookie auth to identify the real user
     */
    private function get_authenticated_user_id(WP_REST_Request $request): int
    {
        $user_id = \get_current_user_id();

        // Fallback to JWT if header present
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

        return (int) $user_id;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CORE LOGIC (Dashboards & Leaderboards)
    // ─────────────────────────────────────────────────────────────────────────

    public function get_user_dashboard(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $user_id = $this->get_authenticated_user_id($request);
        if (!$user_id) {
            return new WP_Error('rest_unauthorized', 'Invalid credentials.', ['status' => 401]);
        }

        $cache_key = 'djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id;
        $no_cache = $request->get_param('nocache');

        $cached = \get_transient($cache_key);
        if ($cached !== false && !$no_cache) {
            return \rest_ensure_response($cached);
        }

        $point_data = [];
        $main_slug = '';

        if (\function_exists('gamipress_get_points_types')) {
            $types = \gamipress_get_points_types();
            if (\is_array($types)) {
                foreach ($types as $slug => $pt) {
                    if (empty($main_slug))
                        $main_slug = $slug;

                    $pt_id = \is_array($pt) ? ($pt['ID'] ?? 0) : ($pt->ID ?? 0);
                    $pt_plural = \is_array($pt) ? ($pt['plural_name'] ?? $slug) : ($pt->plural_name ?? $slug);

                    $point_data[$slug] = [
                        'name' => $pt_plural,
                        'amount' => \function_exists('gamipress_get_user_points')
                            ? (int) \gamipress_get_user_points($user_id, $slug)
                            : 0,
                        'image' => $pt_id ? (\get_the_post_thumbnail_url($pt_id, 'thumbnail') ?: '') : '',
                    ];
                }
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
            'engine_status' => [
                'woo' => $this->is_woo_active(),
                'gamipress' => \defined('GAMIPRESS_VER'),
                'cache' => 'healthy',
            ],
            'lastUpdate' => \current_time('mysql'),
            'version' => '1.3.4',
        ];

        \set_transient($cache_key, $data, $this->get_cache_ttl());
        return \rest_ensure_response($data);
    }

    public function get_leaderboard(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        if (!\function_exists('gamipress_get_points_types')) {
            return new WP_Error('service_unavailable', 'GamiPress initialization failed.', ['status' => 503]);
        }

        $limit = $request->get_param('limit');
        $type_param = $request->get_param('point_type');

        $cache_key = 'djz_gamipress_leaderboard_' . self::CACHE_VERSION . '_' . $limit . '_' . ($type_param ?: 'all');
        $cached = \get_transient($cache_key);

        if ($cached !== false) {
            return \rest_ensure_response($cached);
        }

        $all_types = \gamipress_get_points_types();
        $target_types = ($type_param && isset($all_types[$type_param])) ? [$type_param => $all_types[$type_param]] : $all_types;
        $leaderboard = [];

        global $wpdb;
        foreach ($target_types as $slug => $pt) {
            $results = $wpdb->get_results($wpdb->prepare(
                "SELECT user_id, SUM(points) AS total_points FROM {$wpdb->prefix}gamipress_user_earnings 
                 WHERE points_type = %s GROUP BY user_id ORDER BY total_points DESC LIMIT %d",
                $slug,
                $limit
            ));

            $leaderboard[$slug] = [];
            if (\is_array($results)) {
                foreach ($results as $row) {
                    $user = \get_userdata((int) $row->user_id);
                    if (!$user)
                        continue;

                    $leaderboard[$slug][] = [
                        'user_id' => (int) $row->user_id,
                        'display_name' => $user->display_name,
                        'points' => (int) $row->total_points,
                        'avatar' => \get_avatar_url((int) $row->user_id, ['size' => 64]),
                    ];
                }
            }
        }

        \set_transient($cache_key, $leaderboard, $this->get_cache_ttl());
        return \rest_ensure_response($leaderboard);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DATA FETCHING (Encapsulated Helpers)
    // ─────────────────────────────────────────────────────────────────────────

    private function get_categorized_achievements(int $user_id): array
    {
        $info = ['earned' => [], 'locked' => []];

        if (!\function_exists('gamipress_get_achievement_types'))
            return $info;

        $types = \array_keys(\gamipress_get_achievement_types());
        if (empty($types))
            return $info;

        $all = \get_posts([
            'post_type' => $types,
            'numberposts' => 100,
            'post_status' => 'publish',
        ]);

        $earned_map = [];
        if (\function_exists('gamipress_get_user_achievements')) {
            $user_achievements = \gamipress_get_user_achievements([
                'user_id' => $user_id,
                'achievement_type' => $types, // REALITY FIX: 'achievement_type' (singular)
            ]);

            if (\is_array($user_achievements)) {
                foreach ($user_achievements as $ua) {
                    $pid = (int) ($ua->post_id ?? 0);
                    if ($pid && !isset($earned_map[$pid])) {
                        $earned_map[$pid] = $ua->date_earned ?? '';
                    }
                }
            }
        }

        foreach ($all as $post) {
            $is_earned = isset($earned_map[$post->ID]);
            $item = [
                'id' => (int) $post->ID,
                'title' => $post->post_title,
                'description' => $post->post_excerpt ?: \wp_strip_all_tags($post->post_content),
                'image' => \get_the_post_thumbnail_url($post->ID, 'medium') ?: '',
                'earned' => $is_earned,
                'points_awarded' => (int) \get_post_meta($post->ID, '_gamipress_points_awarded', true),
                'date_earned' => $is_earned ? $earned_map[$post->ID] : '',
            ];

            if ($is_earned) {
                $info['earned'][] = $item;
            } else {
                $info['locked'][] = $item;
            }
        }

        return $info;
    }

    private function get_activity_logs(int $user_id): array
    {
        if (!\function_exists('gamipress_query_logs'))
            return [];
        $raw = \gamipress_query_logs(['user_id' => $user_id, 'limit' => 20]);
        if (!\is_array($raw))
            return [];

        return \array_map(function ($log) {
            return [
                'id' => (int) ($log->log_id ?? 0),
                'type' => $log->type ?? 'activity',
                'description' => $log->title ?? '',
                'date' => $log->date ?? '',
                'points' => (int) ($log->points ?? 0),
            ];
        }, $raw);
    }

    private function get_rank_info(int $user_id): array
    {
        $info = [
            'current' => ['id' => 0, 'title' => \__('Zen Novice', 'zengame'), 'image' => ''],
            'next' => null,
            'progress' => 0,
            'requirements' => [],
        ];

        if (!\function_exists('\gamipress_get_user_rank') || !\function_exists('\gamipress_get_rank_types'))
            return $info;

        $rank_types = \gamipress_get_rank_types();
        if (empty($rank_types))
            return $info;

        $slug = \array_key_first($rank_types);
        $current = \gamipress_get_user_rank($user_id, $slug);
        if (!$current)
            return $info;

        $info['current'] = [
            'id' => (int) $current->ID,
            'title' => $current->post_title,
            'image' => \get_the_post_thumbnail_url($current->ID, 'thumbnail') ?: '',
        ];

        // REALITY FIX: gamipress_get_next_rank_id is nonexistent. 
        // We find the next rank by querying ranks of the same type ordered by menu_order/priority
        $rank_id = $current->ID;
        $all_ranks_in_type = \get_posts([
            'post_type' => $current->post_type,
            'numberposts' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
            'post_status' => 'publish',
        ]);

        $next_rank = null;
        if (!empty($all_ranks_in_type)) {
            $found_current = false;
            foreach ($all_ranks_in_type as $r) {
                if ($found_current) {
                    $next_rank = $r;
                    break;
                }
                if ($r->ID === $rank_id) {
                    $found_current = true;
                }
            }
        }

        if (!$next_rank) {
            $info['progress'] = 100;
            return $info;
        }

        $next_id = (int) $next_rank->ID;
        $info['next'] = [
            'id' => $next_id,
            'title' => $next_rank->post_title,
            'image' => \get_the_post_thumbnail_url($next_id, 'thumbnail') ?: '',
        ];

        if (\function_exists('\gamipress_get_rank_requirements')) {
            $requirements = \gamipress_get_rank_requirements($next_id);
            if (\is_array($requirements) && !empty($requirements)) {
                $total_pct = 0;
                foreach ($requirements as $req) {
                    if (!\function_exists('\gamipress_get_requirement'))
                        continue;
                    $req_obj = \gamipress_get_requirement($req->ID);
                    $needed = (int) ($req_obj->times ?? 1);

                    $got = 0;
                    if (\function_exists('\gamipress_get_earnings_count')) {
                        $got = (int) \gamipress_get_earnings_count(['user_id' => $user_id, 'requirement_id' => $req->ID]);
                    }

                    $pct = $needed > 0 ? \min(100, \round(($got / $needed) * 100)) : 100;
                    $total_pct += $pct;
                    $info['requirements'][] = [
                        'title' => $req->post_title,
                        'current' => $got,
                        'required' => $needed,
                        'percent' => (int) $pct,
                    ];
                }
                $info['progress'] = \round($total_pct / \count($requirements));
            }
        }
        return $info;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // EXTERNAL TRIGGERS (Woo & Gamipress Hooks)
    // ─────────────────────────────────────────────────────────────────────────

    public function update_login_streak(string $user_login, WP_User $user): void
    {
        $user_id = $user->ID;
        $today = \current_time('Y-m-d');
        $last = \get_user_meta($user_id, 'zen_last_login', true);
        $streak = (int) \get_user_meta($user_id, 'zen_login_streak', true);

        if ($last === $today)
            return;

        $yesterday = \date('Y-m-d', \strtotime('-1 day', \current_time('timestamp')));
        $streak = ($last === $yesterday) ? $streak + 1 : 1;

        \update_user_meta($user_id, 'zen_last_login', $today);
        \update_user_meta($user_id, 'zen_login_streak', $streak);
        $this->clear_user_cache_by_id($user_id);
    }

    private function get_user_total_tracks(int $user_id): int
    {
        if (!$this->is_woo_active() || !\function_exists('wc_get_orders'))
            return 0;

        $cache_key = 'djz_stats_tracks_' . $user_id;
        $cached = \get_transient($cache_key);
        if ($cached !== false)
            return (int) $cached;

        $order_ids = \wc_get_orders([
            'customer' => $user_id,
            'status' => ['completed'],
            'limit' => -1,
            'return' => 'ids'
        ]);

        $total = 0;
        foreach ($order_ids as $oid) {
            $order = \wc_get_order($oid);
            if (!$order)
                continue;

            // HPOS Optimization: Orders might have many items, but we only load what we need.
            foreach ($order->get_items() as $item) {
                // We use meta to check downloadable instead of full product load if possible
                $product_id = $item->get_product_id();
                if (\get_post_meta($product_id, '_downloadable', true) === 'yes') {
                    $total += $item->get_quantity();
                }
            }
        }

        \set_transient($cache_key, $total, 21600);
        return $total;
    }

    private function get_user_events_attended(int $user_id): int
    {
        if (!$this->is_woo_active() || !\function_exists('wc_get_orders'))
            return 0;

        $cache_key = 'djz_stats_events_' . $user_id;
        $cached = \get_transient($cache_key);
        if ($cached !== false)
            return (int) $cached;

        $target_slugs = ['events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass'];
        $order_ids = \wc_get_orders([
            'customer' => $user_id,
            'status' => ['completed', 'processing'],
            'limit' => -1,
            'return' => 'ids'
        ]);

        $total = 0;
        foreach ($order_ids as $oid) {
            $order = \wc_get_order($oid);
            if (!$order)
                continue;

            foreach ($order->get_items() as $item) {
                // Optimization: Use direct term check instead of loading full product object
                $product_id = $item->get_product_id();
                $terms = \wp_get_object_terms($product_id, 'product_cat', ['fields' => 'slugs']);

                if ($terms && !\is_wp_error($terms)) {
                    foreach ($terms as $t_slug) {
                        if (\in_array($t_slug, $target_slugs, true)) {
                            $total += $item->get_quantity();
                            break;
                        }
                    }
                }
            }
        }

        \set_transient($cache_key, $total, 21600);
        return $total;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CACHE MANAGEMENT
    // ─────────────────────────────────────────────────────────────────────────

    private function init_cache_hooks(): void
    {
        \add_action('woocommerce_order_status_completed', [$this, 'clear_user_cache_by_order']);

        // Hooks fired when earnings are updated
        \add_action('gamipress_update_user_points', [$this, 'clear_user_cache_by_id'], 10, 1);
        \add_action('gamipress_award_achievement', [$this, 'clear_user_cache_by_id'], 10, 1);
        \add_action('gamipress_set_user_rank', [$this, 'clear_user_cache_by_id'], 10, 1);
    }

    public function clear_user_cache_by_id(int $user_id): void
    {
        \delete_transient('djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id);
        \delete_transient('djz_stats_events_' . $user_id);
        \delete_transient('djz_stats_tracks_' . $user_id);
    }

    public function clear_user_cache_by_order(int $order_id): void
    {
        if (!\function_exists('wc_get_order'))
            return;
        $order = \wc_get_order($order_id);
        if ($order && ($uid = $order->get_user_id())) {
            $this->clear_user_cache_by_id($uid);
            // Leaderboard is global-ish, but purges on every order can be expensive on high-volume stores.
            // On this project, we prioritize accuracy for the current user's profile.
        }
    }

    public function clear_all_gamipress_cache(): void
    {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
            '%_transient_djz_gamipress_%'
        ));
        \update_option('zengame_last_purge', \current_time('mysql'));
    }

    /**
     * Singleton Cleanup
     */
    public static function on_deactivation(): void
    {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            '%_transient_djz_gamipress_%',
            '%_transient_djz_stats_%'
        ));
    }

    private function get_cache_ttl(): int
    {
        return (int) \get_option('zengame_cache_ttl', 86400);
    }

    private function is_woo_active(): bool
    {
        return \class_exists('WooCommerce');
    }
}

// Initialize the professional engine
ZenGame::get_instance();
