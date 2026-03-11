<?php
/**
 * Plugin Name:  ZenGame Pro
 * Plugin URI:   https://djzeneyer.com
 * Description:  Gaming & Activity Bridge for DJ Zen Eyer — SSOT for GamiPress + WooCommerce
 *               headless gamification. Provides REST endpoints consumed by the React frontend.
 * Version:      1.3.9
 * Author:       DJ Zen Eyer
 * Author URI:   https://djzeneyer.com
 * Text Domain:  zengame
 * Domain Path:  /languages
 * Requires at least: 6.0
 * Requires PHP:      8.1
 *
 * @package ZenEyer\Game
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARCHITECTURE — "Brain Principle"
 * ═══════════════════════════════════════════════════════════════════════════════
 * This plugin is the SINGLE SOURCE OF TRUTH for all gamification data.
 * The React frontend (DashboardPage.tsx) is a pure consumer: it NEVER calculates
 * progress, filters achievements, or derives rank. Everything is computed here.
 *
 * Design decisions:
 *  - Singleton prevents double-registration of REST routes and hooks.
 *  - All GamiPress calls are guarded by function_exists() — GamiPress may be
 *    temporarily deactivated during maintenance without causing fatal errors.
 *  - Cache keys embed CACHE_VERSION; bumping it invalidates ALL stale data
 *    without a manual DB query.
 *  - Leaderboard reads from wp_usermeta, NOT from gamipress_user_earnings.
 *    The usermeta key `_gamipress_{slug}_points` is GamiPress's authoritative
 *    balance store. The earnings table holds transactions (awards + deducts)
 *    and would produce wrong totals if summed directly.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHANGELOG
 * ═══════════════════════════════════════════════════════════════════════════════
 * v1.3.9  2026-03-06
 *   FIX   Adds compatibility hooks for points/rank cache invalidation.
 *   FIX   Reads both authorization header casings for JWT auth.
 *   FIX   Enforces runtime clamp for leaderboard limit (1..100).
 *
 * v1.3.8  2026-03-06
 *   FEAT  Adds achievement_highlights (up to 6 cards) in /zengame/v1/me to keep highlight selection in the backend (Brain Principle).
 *
 * v1.3.7  2026-03-06
 *   FIX   gamipress_award_points_to_user hook uses a closure wrapper to safely
 *         consume only $user_id (arg #1 of the 3-arg function signature), making
 *         the callback robust against future argument-list changes.
 *   FIX   on_deactivation() now also purges djz_stats_* and their timeout rows —
 *         previously those orphan rows were left in wp_options after deactivation.
 *   FIX   clear_all_gamipress_cache() now purges stats transients too, for
 *         consistency with on_deactivation().
 *   ADMIN Version string in dashboard synced to 1.3.7.
 *   CODE  Added floor (60 s) to get_cache_ttl(); guards against accidental 0-TTL.
 *   DOCS  Full PHPDoc annotations throughout; every non-trivial design decision
 *         is documented inline.
 *
 * v1.3.6  2026-03-06
 *   FIX   Leaderboard queries wp_usermeta directly (accurate live balances).
 *   FIX   get_user_total_tracks() uses $product->is_downloadable() (WooCommerce
 *         public API, HPOS-safe) instead of reading _downloadable post meta.
 *   FIX   register_deactivation_hook() moved to file-scope so __FILE__ resolves
 *         correctly regardless of include path.
 *   FIX   declare_hpos_compatibility() avoids a top-level `use` import for
 *         FeaturesUtil — resolves FQCN at runtime to prevent fatal when WooCommerce
 *         is inactive during PHP parse time.
 *
 * v1.3.5  (prior)
 *   FIX   gamipress_get_next_rank_id() (non-existent) replaced with get_posts()
 *         ordered by menu_order.
 *   FIX   achievement_type key corrected to singular (GamiPress API reality).
 *   FIX   gamipress_get_earnings_count wrapped in function_exists guard.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

namespace ZenEyer\Game;

use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_Error;
use WP_User;

// Hard exit if accessed outside WordPress.
if (!defined('ABSPATH')) {
    exit;
}

// =============================================================================
// MAIN CLASS
// =============================================================================

/**
 * ZenGame — Singleton controller for all gamification logic.
 *
 * Instantiated once via ZenGame::get_instance(). All WordPress hooks are
 * registered inside the constructor to keep boot order deterministic.
 */
final class ZenGame
{

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTANTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Bump this string whenever the shape of cached data changes.
     * All stale transients from previous versions are silently ignored
     * (get_transient returns false for keys that contain old versions in their
     * name, since we embed the version in every cache key).
     *
     * @var string
     */
    const CACHE_VERSION = 'v13';

    /**
     * Default TTL for dashboard and leaderboard transients: 24 hours.
     * Overridable via Settings → ZenGame → Cache TTL.
     *
     * @var int
     */
    const DEFAULT_CACHE_TTL = 86400;

    /**
     * TTL for per-user WooCommerce stat caches (tracks, events): 6 hours.
     * Shorter than the dashboard TTL because stat changes are more frequent.
     *
     * @var int
     */
    const STATS_CACHE_TTL = 21600;

    // ─────────────────────────────────────────────────────────────────────────
    // SINGLETON
    // ─────────────────────────────────────────────────────────────────────────

    /** @var ZenGame|null */
    private static ?ZenGame $instance = null;

    /**
     * Returns the single instance, creating it on first call.
     *
     * @return ZenGame
     */
    public static function get_instance(): self
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Private constructor — use get_instance().
     * All hooks are registered here so their registration order is auditable
     * in one place.
     */
    private function __construct()
    {
        // Core REST API routes.
        \add_action('rest_api_init', [$this, 'register_routes']);

        // Admin settings page and dashboard.
        \add_action('admin_init', [$this, 'register_settings']);
        \add_action('admin_menu', [$this, 'add_admin_menu']);

        // WooCommerce HPOS compatibility.
        // NOTE: Must fire on 'before_woocommerce_init'.
        // NOTE: FeaturesUtil FQCN is resolved at runtime (not with a top-level
        //       `use` statement) to avoid a PHP fatal when WooCommerce is inactive.
        \add_action('before_woocommerce_init', [$this, 'declare_hpos_compatibility']);

        // Login streak tracker.
        \add_action('wp_login', [$this, 'update_login_streak'], 10, 2);

        // Cache invalidation hooks.
        $this->init_cache_hooks();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WOOCOMMERCE COMPATIBILITY
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Declares High Performance Order Storage (HPOS) compatibility.
     *
     * Resolved at runtime to prevent a PHP fatal error when WooCommerce is
     * inactive — at parse time, a top-level `use` import would cause a fatal if
     * the class file doesn't exist.
     */
    public function declare_hpos_compatibility(): void
    {
        if (\class_exists('\Automattic\WooCommerce\Utilities\FeaturesUtil')) {
            \Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
                'custom_order_tables',
                __FILE__,
                true
            );
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SETTINGS & ADMIN UI
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Registers the `zengame_cache_ttl` option via the WordPress Settings API.
     * Sanitised as a positive integer; default is DEFAULT_CACHE_TTL (86400 s).
     */
    public function register_settings(): void
    {
        \register_setting('zengame_settings', 'zengame_cache_ttl', [
            'type' => 'integer',
            'sanitize_callback' => 'absint',
            'default' => self::DEFAULT_CACHE_TTL,
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

    /** Renders the cache TTL number input in the settings page. */
    public function render_cache_ttl_field(): void
    {
        $val = (int) \get_option('zengame_cache_ttl', self::DEFAULT_CACHE_TTL);
        printf(
            '<input type="number" name="zengame_cache_ttl" value="%s" class="small-text" min="60"> <span>%s</span>',
            \esc_attr((string) $val),
            \esc_html__('seconds (default 86400 = 24 h)', 'zengame')
        );
    }

    /** Registers the top-level admin menu and the settings sub-page. */
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

    /**
     * Renders the ZenGame Central Intelligence admin dashboard.
     * Handles the `?action=clear_cache` GET action (nonce-protected).
     */
    public function render_admin_dashboard(): void
    {
        if (!\current_user_can('manage_options')) {
            return;
        }

        // Handle cache purge.
        if (isset($_GET['action']) && 'clear_cache' === $_GET['action']) {
            \check_admin_referer('zengame_clear_cache');
            $this->clear_all_gamipress_cache();
            echo '<div class="notice notice-success is-dismissible"><p>'
                . \esc_html__('ZenGame: all engine transients purged.', 'zengame')
                . '</p></div>';
        }

        $is_woo = $this->is_woo_active();
        $is_gp = \defined('GAMIPRESS_VER');
        $status = ($is_woo && $is_gp) ? 'ONLINE' : 'DEGRADED';
        $color = ('ONLINE' === $status) ? '#0D96FF' : '#f87171';

        ?>
        <div class="wrap">
            <h1>ZenGame // <span style="color:<?php echo $color; ?>;">
                    <?php echo $status; ?>
                </span></h1>
            <div class="welcome-panel"
                style="background:#111;color:#fff;padding:40px;border-radius:12px;border:1px solid #333;box-shadow:0 10px 30px rgba(0,0,0,.5);">

                <h2 style="color:<?php echo $color; ?>;font-weight:900;letter-spacing:-1px;margin:0 0 10px 0;">
                    CENTRAL INTELLIGENCE
                </h2>
                <p style="color:#666;font-family:monospace;">ZenGame Pro v1.3.9 // Snapshot 2026-03-06</p>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:25px;margin-top:35px;">
                    <?php
                    $cards = [
                        ['WooCommerce HPOS', $is_woo ? 'SUPPORTED' : 'NOT FOUND', $is_woo],
                        ['GamiPress Engine', $is_gp ? 'CONNECTED' : 'OFFLINE', $is_gp],
                        ['Cache Health', 'v13 Stable', true],
                    ];
                    foreach ($cards as [$label, $value, $ok]):
                        $c = $ok ? '#4ade80' : '#f87171';
                        ?>
                        <div
                            style="background:rgba(255,255,255,.03);padding:24px;border-radius:12px;border:1px solid rgba(255,255,255,.05);">
                            <strong
                                style="display:block;font-size:11px;color:#444;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
                                <?php echo \esc_html($label); ?>
                            </strong>
                            <span style="font-size:22px;font-weight:700;color:<?php echo $c; ?>;">
                                <?php echo \esc_html($value); ?>
                            </span>
                        </div>
                    <?php endforeach; ?>
                </div>

                <hr style="border:0;border-top:1px solid #222;margin:40px 0;">

                <div style="display:flex;gap:15px;align-items:center;">
                    <a href="<?php echo \wp_nonce_url(\admin_url('admin.php?page=zengame&action=clear_cache'), 'zengame_clear_cache'); ?>"
                        class="button button-primary button-hero"
                        style="background:#ff4757;border:none;box-shadow:0 4px 14px rgba(255,71,87,.3);font-weight:700;">
                        PURGE ALL ENGINE TRANSIENTS
                    </a>
                    <a href="<?php echo \esc_url(\admin_url('admin.php?page=zengame-settings')); ?>"
                        class="button button-secondary" style="background:#222;color:#eee;border-color:#444;">
                        SETTINGS
                    </a>
                </div>
            </div>
        </div>
        <?php
    }

    /** Renders the settings sub-page form. */
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
    // REST API
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Registers all REST routes under the `zengame/v1` namespace.
     *
     * Endpoints:
     *   GET /wp-json/zengame/v1/me          → Authenticated user dashboard
     *   GET /wp-json/zengame/v1/leaderboard → Public leaderboard (all point types)
     */
    public function register_routes(): void
    {
        $ns = 'zengame/v1';

        \register_rest_route($ns, '/me', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [$this, 'get_user_dashboard'],
            'permission_callback' => [$this, 'check_auth'],
            'args' => [
                'nocache' => [
                    'description' => 'Set to true to bypass the transient and force a fresh DB read.',
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
                    'description' => 'Max number of users per points type (1–100).',
                    'type' => 'integer',
                    'default' => 10,
                    'minimum' => 1,
                    'maximum' => 100,
                    'sanitize_callback' => 'absint',
                ],
                'point_type' => [
                    'description' => 'GamiPress points type slug. Omit to return all types.',
                    'type' => 'string',
                    'sanitize_callback' => 'sanitize_key',
                    'default' => '',
                ],
            ],
        ]);
    }

    /**
     * Permission callback: accepts both WordPress cookie sessions and JWT Bearer tokens.
     * Also validates that the resolved user still exists in the database.
     *
     * @param WP_REST_Request $request Incoming REST request.
     * @return bool
     */
    public function check_auth(WP_REST_Request $request): bool
    {
        $user_id = $this->get_authenticated_user_id($request);
        return $user_id > 0 && false !== \get_userdata($user_id);
    }

    /**
     * Resolves the authenticated user ID from cookie session or Bearer JWT.
     *
     * Priority order:
     *  1. WordPress standard cookie auth (get_current_user_id).
     *  2. Authorization: Bearer <token> via ZenEyer\Auth\Core\JWT_Manager.
     *
     * @param WP_REST_Request $request Incoming REST request.
     * @return int User ID, or 0 if unauthenticated.
     */
    private function get_authenticated_user_id(WP_REST_Request $request): int
    {
        // Primary: cookie-based session (standard WordPress auth).
        $user_id = \get_current_user_id();
        if ($user_id) {
            return $user_id;
        }

        // Fallback: JWT Bearer token (requires zeneyer-auth plugin).
        $auth_header = $request->get_header('authorization');
        if (!$auth_header) {
            $auth_header = $request->get_header('Authorization');
        }
        if ($auth_header && \preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            $token = \trim($matches[1]);
            if (\class_exists('\ZenEyer\Auth\Core\JWT_Manager')) {
                $decoded = \ZenEyer\Auth\Core\JWT_Manager::validate_token($token);
                if (!\is_wp_error($decoded) && isset($decoded->data->user_id)) {
                    return (int) $decoded->data->user_id;
                }
            }
        }

        return 0;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ENDPOINT: GET /me — USER DASHBOARD
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns the full gamification profile for the authenticated user.
     *
     * Response shape (JSON):
     * {
     *   user_id            : int,
     *   points             : { [slug]: { name, amount, image } },
     *   main_points_slug   : string,
     *   rank               : { current, next, progress, requirements[] },
     *   achievements_earned: [],
     *   achievements_locked: [],
     *   recent_achievements: [],    // first 5 earned
     *   achievement_highlights: [], // first 6 cards for dashboard spotlight
     *   logs               : [],
     *   stats              : { totalTracks, eventsAttended, streak, streakFire },
     *   engine_status      : { woo, gamipress, cache },
     *   lastUpdate         : string,
     *   version            : string
     * }
     *
     * @param WP_REST_Request $request Incoming REST request.
     * @return WP_REST_Response|WP_Error
     */
    public function get_user_dashboard(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        $user_id = $this->get_authenticated_user_id($request);
        if (!$user_id) {
            return new WP_Error('rest_unauthorized', 'Invalid credentials.', ['status' => 401]);
        }

        $cache_key = 'djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id;
        $no_cache = (bool) $request->get_param('nocache');

        // Serve from transient unless the caller explicitly bypasses it.
        $cached = \get_transient($cache_key);
        if (false !== $cached && !$no_cache) {
            return \rest_ensure_response($cached);
        }

        // ── Points ─────────────────────────────────────────────────────────
        // gamipress_get_user_points() reads from wp_usermeta — always accurate.
        $point_data = [];
        $main_slug = '';

        if (\function_exists('gamipress_get_points_types')) {
            $types = \gamipress_get_points_types();
            if (\is_array($types)) {
                foreach ($types as $slug => $pt) {
                    if (empty($main_slug)) {
                        $main_slug = $slug;
                    }
                    // GamiPress may return the type as array or object depending on version.
                    $pt_id = \is_array($pt) ? ($pt['ID'] ?? 0) : ($pt->ID ?? 0);
                    $pt_plural = \is_array($pt) ? ($pt['plural_name'] ?? $slug) : ($pt->plural_name ?? $slug);

                    $point_data[$slug] = [
                        'name' => $pt_plural,
                        'amount' => \function_exists('gamipress_get_user_points')
                            ? (int) \gamipress_get_user_points($user_id, $slug)
                            : 0,
                        'image' => $pt_id
                            ? (\get_the_post_thumbnail_url($pt_id, 'thumbnail') ?: '')
                            : '',
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
            'achievement_highlights' => \array_slice(\array_merge($achievements['earned'], $achievements['locked']), 0, 6),
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
            'version' => '1.3.9',
        ];

        \set_transient($cache_key, $data, $this->get_cache_ttl());
        return \rest_ensure_response($data);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ENDPOINT: GET /leaderboard
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns the public leaderboard grouped by GamiPress points type.
     *
     * WHY wp_usermeta, not gamipress_user_earnings?
     * ────────────────────────────────────────────
     * GamiPress stores the LIVE balance in wp_usermeta under the key:
     *   `_gamipress_{slug}_points`
     *
     * The `gamipress_user_earnings` table stores individual transaction rows
     * (both awards and deductions). Summing that table would:
     *   a) Ignore manual balance adjustments made via the admin UI.
     *   b) Require handling positive/negative signs per transaction type.
     *
     * Querying usermeta is both simpler and authoritative.
     *
     * @param WP_REST_Request $request Incoming REST request.
     * @return WP_REST_Response|WP_Error
     */
    public function get_leaderboard(WP_REST_Request $request): WP_REST_Response|WP_Error
    {
        if (!\function_exists('gamipress_get_points_types')) {
            return new WP_Error('service_unavailable', 'GamiPress not available.', ['status' => 503]);
        }

        $limit = (int) $request->get_param('limit');
        $limit = max(1, min(100, $limit > 0 ? $limit : 10));
        $type_param = (string) $request->get_param('point_type');

        $cache_key = 'djz_gamipress_leaderboard_' . self::CACHE_VERSION . '_' . $limit . '_' . ($type_param ?: 'all');
        $cached = \get_transient($cache_key);
        if (false !== $cached) {
            return \rest_ensure_response($cached);
        }

        $all_types = \gamipress_get_points_types();
        $target_types = ($type_param && isset($all_types[$type_param]))
            ? [$type_param => $all_types[$type_param]]
            : $all_types;

        $leaderboard = [];
        global $wpdb;

        foreach ($target_types as $slug => $pt) {
            // GamiPress authoritative balance key (confirmed by GamiPress source).
            $meta_key = "_gamipress_{$slug}_points";

            /*
             * Single JOIN query:
             *  - Retrieves display_name alongside points in one roundtrip.
             *  - CAST AS SIGNED handles string-stored integers correctly.
             *  - Filters out users with 0 or negative balance (never interacted).
             */
            $results = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT   u.ID            AS user_id,
                              u.display_name,
                              CAST( m.meta_value AS SIGNED ) AS points
                     FROM     {$wpdb->users}    u
                     JOIN     {$wpdb->usermeta} m ON u.ID = m.user_id
                     WHERE    m.meta_key = %s
                       AND    CAST( m.meta_value AS SIGNED ) > 0
                     ORDER BY points DESC
                     LIMIT    %d",
                    $meta_key,
                    $limit
                )
            );

            $leaderboard[$slug] = [];
            if (\is_array($results)) {
                foreach ($results as $row) {
                    $leaderboard[$slug][] = [
                        'user_id' => (int) $row->user_id,
                        'display_name' => $row->display_name,
                        'points' => (int) $row->points,
                        'avatar' => \get_avatar_url((int) $row->user_id, ['size' => 64]),
                    ];
                }
            }
        }

        \set_transient($cache_key, $leaderboard, $this->get_cache_ttl());
        return \rest_ensure_response($leaderboard);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS — GAMIPRESS DATA
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Fetches all achievements and categorises them into earned/locked buckets.
     *
     * Key: uses `achievement_type` (singular) — the correct argument key accepted
     * by gamipress_get_user_achievements(). This was verified against GamiPress
     * includes/achievement-functions.php. Do NOT confuse with the [gamipress_earnings]
     * SHORTCODE attribute `achievement_types` (plural), which is never passed here.
     *
     * @param int $user_id WordPress user ID.
     * @return array{ earned: list<array>, locked: list<array> }
     */
    private function get_categorized_achievements(int $user_id): array
    {
        $info = ['earned' => [], 'locked' => []];

        if (!\function_exists('gamipress_get_achievement_types')) {
            return $info;
        }

        $types = \array_keys(\gamipress_get_achievement_types());
        if (empty($types)) {
            return $info;
        }

        // Fetch all published achievements across all registered types.
        $all = \get_posts([
            'post_type' => $types,
            'numberposts' => 100,
            'post_status' => 'publish',
            // Skip SQL_CALC_FOUND_ROWS — we don't need pagination metadata.
            'no_found_rows' => true,
            'update_post_meta_cache' => true,
            'update_post_term_cache' => true,
        ]);

        // Build an ID → date_earned map from the user's earned achievements.
        $earned_map = [];
        if (\function_exists('gamipress_get_user_achievements')) {
            $user_achievements = \gamipress_get_user_achievements([
                'user_id' => $user_id,
                'achievement_type' => $types, // singular key, confirmed by GamiPress source.
            ]);

            if (\is_array($user_achievements)) {
                foreach ($user_achievements as $ua) {
                    $pid = (int) ($ua->post_id ?? 0);
                    // Keep only the first occurrence per achievement (earliest earn date).
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

            $info[$is_earned ? 'earned' : 'locked'][] = $item;
        }

        return $info;
    }

    /**
     * Returns the 20 most recent GamiPress log entries for the user.
     *
     * @param int $user_id WordPress user ID.
     * @return list<array>
     */
    private function get_activity_logs(int $user_id): array
    {
        if (!\function_exists('gamipress_query_logs')) {
            return [];
        }

        $raw = \gamipress_query_logs(['user_id' => $user_id, 'limit' => 20]);
        if (!\is_array($raw)) {
            return [];
        }

        return \array_map(static function ($log) {
            return [
                'id' => (int) ($log->log_id ?? 0),
                'type' => $log->type ?? 'activity',
                'description' => $log->title ?? '',
                'date' => $log->date ?? '',
                'points' => (int) ($log->points ?? 0),
            ];
        }, $raw);
    }

    /**
     * Calculates the user's current rank, next rank, and progress percentage.
     *
     * WHY we don't use gamipress_get_next_rank_id():
     * ───────────────────────────────────────────────
     * This function does NOT exist in GamiPress core (verified). Instead we
     * query all ranks of the same post_type ordered by `menu_order ASC`
     * (which is GamiPress's internal ordering mechanism) and return the rank
     * immediately following the user's current rank.
     *
     * @param int $user_id WordPress user ID.
     * @return array{ current: array, next: array|null, progress: int, requirements: list<array> }
     */
    private function get_rank_info(int $user_id): array
    {
        $info = [
            'current' => ['id' => 0, 'title' => \__('Zen Novice', 'zengame'), 'image' => ''],
            'next' => null,
            'progress' => 0,
            'requirements' => [],
        ];

        if (
            !\function_exists('gamipress_get_user_rank') ||
            !\function_exists('gamipress_get_rank_types')
        ) {
            return $info;
        }

        $rank_types = \gamipress_get_rank_types();
        if (empty($rank_types)) {
            return $info;
        }

        // Use the first registered rank type (single-type is the standard setup).
        $slug = \array_key_first($rank_types);
        $current = \gamipress_get_user_rank($user_id, $slug);
        if (!$current) {
            return $info;
        }

        $info['current'] = [
            'id' => (int) $current->ID,
            'title' => $current->post_title,
            'image' => \get_the_post_thumbnail_url($current->ID, 'thumbnail') ?: '',
        ];

        // ── Find next rank via menu_order ───────────────────────────────────
        $all_ranks = \get_posts([
            'post_type' => $current->post_type,
            'numberposts' => -1,
            'orderby' => 'menu_order',
            'order' => 'ASC',
            'post_status' => 'publish',
            'no_found_rows' => true,
            'update_post_meta_cache' => true,
            'update_post_term_cache' => true,
        ]);

        $next_rank = null;
        $found_current = false;

        foreach ($all_ranks as $r) {
            if ($found_current) {
                $next_rank = $r;
                break;
            }
            if ($r->ID === $current->ID) {
                $found_current = true;
            }
        }

        // User is at the maximum rank.
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

        // ── Progress towards next rank ──────────────────────────────────────
        if (\function_exists('gamipress_get_rank_requirements')) {
            $requirements = \gamipress_get_rank_requirements($next_id);

            if (\is_array($requirements) && !empty($requirements)) {
                $total_pct = 0;

                foreach ($requirements as $req) {
                    if (!\function_exists('gamipress_get_requirement')) {
                        continue;
                    }
                    $req_obj = \gamipress_get_requirement($req->ID);
                    $needed = (int) ($req_obj->times ?? 1);

                    $got = 0;
                    if (\function_exists('gamipress_get_earnings_count')) {
                        $got = (int) \gamipress_get_earnings_count([
                            'user_id' => $user_id,
                            'requirement_id' => $req->ID,
                        ]);
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

                $info['progress'] = (int) \round($total_pct / \count($requirements));
            }
        }

        return $info;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PRIVATE HELPERS — WOOCOMMERCE STATS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Counts downloadable items purchased by the user across all completed orders.
     *
     * Uses $product->is_downloadable() (WooCommerce public API) rather than
     * reading the `_downloadable` post meta directly. This is:
     *  - HPOS-safe: does not bypass the order abstraction layer.
     *  - Future-proof: won't break if WooCommerce changes its internal meta keys.
     *
     * Result is cached for STATS_CACHE_TTL (6 h) and invalidated on new
     * completed orders via clear_user_cache_by_order().
     *
     * @param int $user_id WordPress user ID.
     * @return int Total downloadable item quantity.
     */
    private function get_user_total_tracks(int $user_id): int
    {
        if (!$this->is_woo_active() || !\function_exists('wc_get_orders')) {
            return 0;
        }

        $cache_key = 'djz_stats_tracks_' . $user_id;
        $cached = \get_transient($cache_key);
        if (false !== $cached) {
            return (int) $cached;
        }

        // Fetch full order objects directly to avoid N+1 wc_get_order queries in the loop.
        $orders = \wc_get_orders([
            'customer' => $user_id,
            'status' => ['completed'],
            'limit' => -1,
        ]);

        $total = 0;
        foreach ($orders as $order) {
            if (!$order) {
                continue;
            }
            foreach ($order->get_items() as $item) {
                $product = $item->get_product();
                if ($product && $product->is_downloadable()) {
                    $total += $item->get_quantity();
                }
            }
        }

        \set_transient($cache_key, $total, self::STATS_CACHE_TTL);
        return $total;
    }

    /**
     * Counts event tickets purchased by the user, identified by product category slugs.
     *
     * Uses wp_get_object_terms() with fields='slugs' — fetches only slug strings
     * instead of full WP_Term objects, reducing memory on large order histories.
     *
     * Breaks the inner category loop on first match to prevent double-counting
     * products that belong to multiple matching categories.
     *
     * @param int $user_id WordPress user ID.
     * @return int Total event ticket quantity.
     */
    private function get_user_events_attended(int $user_id): int
    {
        if (!$this->is_woo_active() || !\function_exists('wc_get_orders')) {
            return 0;
        }

        $cache_key = 'djz_stats_events_' . $user_id;
        $cached = \get_transient($cache_key);
        if (false !== $cached) {
            return (int) $cached;
        }

        // Product category slugs that classify a product as an event ticket.
        $target_slugs = [
            'events',
            'tickets',
            'congressos',
            'workshops',
            'social',
            'festivais',
            'pass',
        ];

        $orders = \wc_get_orders([
            'customer' => $user_id,
            'status' => ['completed', 'processing'],
            'limit' => -1,
        ]);

        $total = 0;
        $term_cache = []; // Cache terms per product ID to avoid N+1 queries.
        foreach ($orders as $order) {
            if (!$order) {
                continue;
            }
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();

                if (!isset($term_cache[$product_id])) {
                    $term_cache[$product_id] = \wp_get_object_terms(
                        $product_id,
                        'product_cat',
                        ['fields' => 'slugs']
                    );
                }
                $term_slugs = $term_cache[$product_id];

                if ($term_slugs && !\is_wp_error($term_slugs)) {
                    foreach ($term_slugs as $t_slug) {
                        if (\in_array($t_slug, $target_slugs, true)) {
                            $total += $item->get_quantity();
                            break; // Only count once even if product has multiple matching categories.
                        }
                    }
                }
            }
        }

        \set_transient($cache_key, $total, self::STATS_CACHE_TTL);
        return $total;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LOGIN STREAK
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Maintains a daily login streak counter persisted in user meta.
     *
     * Hooked to 'wp_login'. Idempotent: no-ops if the user already logged
     * in today, preventing double increments on session refresh.
     *
     * @param string  $user_login Username (required by hook signature; unused).
     * @param WP_User $user       Authenticated user object.
     */
    public function update_login_streak(string $user_login, WP_User $user): void
    {
        $user_id = $user->ID;
        $today = \current_time('Y-m-d');
        $last = (string) \get_user_meta($user_id, 'zen_last_login', true);
        $streak = (int) \get_user_meta($user_id, 'zen_login_streak', true);

        if ($last === $today) {
            return; // Already counted today.
        }

        $yesterday = \date('Y-m-d', \strtotime('-1 day', \current_time('timestamp')));
        $streak = ($last === $yesterday) ? $streak + 1 : 1;

        \update_user_meta($user_id, 'zen_last_login', $today);
        \update_user_meta($user_id, 'zen_login_streak', $streak);

        // Invalidate dashboard cache so new streak value is visible immediately.
        $this->clear_user_cache_by_id($user_id);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CACHE MANAGEMENT
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Registers WordPress action hooks that trigger cache invalidation.
     *
     * gamipress_award_points_to_user — public function signature:
     *   gamipress_award_points_to_user( int $user_id, int $amount, string $points_type )
     *
     * We hook it with accepted_args=3 so WordPress passes all three arguments
     * to the closure. The closure then extracts only $user_id (arg #1) and
     * calls the typed method. This pattern:
     *  a) Correctly matches the function's 3-arg signature.
     *  b) Isolates the callback from future argument changes.
     *  c) Ensures $user_id is always cast to int before use.
     */
    private function init_cache_hooks(): void
    {
        // WooCommerce: invalidate on order completion.
        \add_action('woocommerce_order_status_completed', [$this, 'clear_user_cache_by_order']);

        // GamiPress: invalidate when points are awarded.
        // Closure absorbs all 3 args; only user_id (arg #1) is used.
        \add_action('gamipress_award_points_to_user', function ($user_id) {
            $this->clear_user_cache_by_id((int) $user_id);
        }, 10, 3);
        \add_action('gamipress_update_user_points', function ($user_id) {
            $this->clear_user_cache_by_id((int) $user_id);
        }, 10, 4);

        // GamiPress: invalidate when an achievement is awarded.
        \add_action('gamipress_award_achievement', [$this, 'clear_user_cache_by_id'], 10, 1);

        // GamiPress: invalidate when a rank is set.
        \add_action('gamipress_set_user_rank', [$this, 'clear_user_cache_by_id'], 10, 1);
        \add_action('gamipress_update_user_rank', [$this, 'clear_user_cache_by_id'], 10, 1);
    }

    /**
     * Deletes all transients belonging to a specific user (dashboard + stats).
     *
     * @param int $user_id WordPress user ID.
     */
    public function clear_user_cache_by_id(int $user_id): void
    {
        \delete_transient('djz_gamipress_dashboard_' . self::CACHE_VERSION . '_' . $user_id);
        \delete_transient('djz_stats_events_' . $user_id);
        \delete_transient('djz_stats_tracks_' . $user_id);
    }

    /**
     * Clears the cache for the customer associated with a completed order.
     *
     * The leaderboard is intentionally NOT purged here — on a busy store,
     * purging a global cache on every order completion would be expensive.
     * The leaderboard refreshes naturally on its own TTL cycle.
     *
     * @param int $order_id WooCommerce order ID.
     */
    public function clear_user_cache_by_order(int $order_id): void
    {
        if (!\function_exists('wc_get_order')) {
            return;
        }
        $order = \wc_get_order($order_id);
        if ($order && ($uid = $order->get_user_id())) {
            $this->clear_user_cache_by_id((int) $uid);
        }
    }

    /**
     * Purges ALL ZenGame transients (dashboard + leaderboard + stats).
     *
     * Used by the admin "PURGE" button and on_deactivation().
     *
     * Three LIKE patterns cover:
     *  _transient_djz_gamipress_*          → dashboard & leaderboard data
     *  _transient_djz_stats_*              → per-user WooCommerce stat caches
     *  _transient_timeout_djz_*            → the corresponding TTL shadow rows
     *
     * NOTE: WordPress stores each transient in TWO rows:
     *  `_transient_{key}`          → the value
     *  `_transient_timeout_{key}`  → the expiry timestamp
     * Both must be removed to avoid orphan timeout rows.
     */
    public function clear_all_gamipress_cache(): void
    {
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options}
                 WHERE option_name LIKE %s
                    OR option_name LIKE %s
                    OR option_name LIKE %s",
                '%_transient_djz_gamipress_%',
                '%_transient_djz_stats_%',
                '%_transient_timeout_djz_%'
            )
        );
        \update_option('zengame_last_purge', \current_time('mysql'));
    }

    /**
     * Deactivation handler — removes all ZenGame transients from the database.
     *
     * Public static so it can be passed as a callback to register_deactivation_hook().
     * Must be static because the singleton instance may not exist at deactivation time.
     *
     * Purges the same three LIKE patterns as clear_all_gamipress_cache() to
     * ensure the database is clean after deactivation. Previously (v1.3.6) this
     * method missed djz_stats_* and their timeout rows.
     */
    public static function on_deactivation(): void
    {
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options}
                 WHERE option_name LIKE %s
                    OR option_name LIKE %s
                    OR option_name LIKE %s",
                '%_transient_djz_gamipress_%',
                '%_transient_djz_stats_%',
                '%_transient_timeout_djz_%'
            )
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // MISC HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Returns the configured cache TTL in seconds.
     * Enforces a minimum of 60 s to prevent accidental zero-TTL settings from
     * hammering GamiPress on every request.
     *
     * @return int
     */
    private function get_cache_ttl(): int
    {
        return max(60, (int) \get_option('zengame_cache_ttl', self::DEFAULT_CACHE_TTL));
    }

    /**
     * Returns true if WooCommerce is active and the WooCommerce class is loaded.
     *
     * @return bool
     */
    private function is_woo_active(): bool
    {
        return \class_exists('WooCommerce');
    }
}

// =============================================================================
// BOOTSTRAP
// =============================================================================

// Boot the singleton. All hooks are registered inside the constructor.
ZenGame::get_instance();

/*
 * Register the deactivation hook at file-scope (not inside a class method) so
 * that __FILE__ resolves to the plugin's main file. WordPress requires this for
 * register_deactivation_hook() to work correctly.
 *
 * Using the static method on_deactivation() avoids relying on the singleton
 * instance being available at deactivation time.
 */
\register_deactivation_hook(__FILE__, [ZenGame::class, 'on_deactivation']);

