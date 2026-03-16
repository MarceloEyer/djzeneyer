<?php
namespace ZenEyer\Game;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * ZenGame_Admin — Handles all admin-specific logic for ZenGame.
 * 
 * Separated from the main ZenGame class to prevent admin-heavy logic 
 * from loading on the frontend of the site.
 */
final class ZenGame_Admin
{
    /** @var ZenGame_Admin|null */
    private static ?ZenGame_Admin $instance = null;

    /** @var ZenGame Main plugin instance reference. */
    private ZenGame $plugin;

    /**
     * Returns the single instance.
     */
    public static function get_instance(ZenGame $plugin): self
    {
        if (null === self::$instance) {
            self::$instance = new self($plugin);
        }
        return self::$instance;
    }

    /**
     * Private constructor.
     */
    private function __construct(ZenGame $plugin)
    {
        $this->plugin = $plugin;
        $this->init_hooks();
    }

    /**
     * Initialize admin hooks.
     */
    private function init_hooks(): void
    {
        \add_action('admin_init', [$this, 'register_settings']);
        \add_action('admin_menu', [$this, 'add_admin_menu']);
    }

    /**
     * Registers settings via the WordPress Settings API.
     */
    public function register_settings(): void
    {
        \register_setting('zengame_settings', 'zengame_cache_ttl', [
            'type' => 'integer',
            'sanitize_callback' => 'absint',
            'default' => ZenGame::DEFAULT_CACHE_TTL,
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

    /** Renders the cache TTL number input. */
    public function render_cache_ttl_field(): void
    {
        $val = (int) \get_option('zengame_cache_ttl', ZenGame::DEFAULT_CACHE_TTL);
        printf(
            '<input type="number" name="zengame_cache_ttl" value="%s" class="small-text" min="60"> <span>%s</span>',
            \esc_attr((string) $val),
            \esc_html__('seconds (default 86400 = 24 h)', 'zengame')
        );
    }

    /** Registers the top-level admin menu and settings sub-page. */
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

    /** Renders the admin dashboard. */
    public function render_admin_dashboard(): void
    {
        if (!\current_user_can('manage_options')) {
            return;
        }

        // Handle cache purge.
        if (isset($_GET['action']) && 'clear_cache' === $_GET['action']) {
            \check_admin_referer('zengame_clear_cache');
            $this->plugin->clear_all_gamipress_cache();
            echo '<div class="notice notice-success is-dismissible"><p>'
                . \esc_html__('ZenGame: all engine transients purged.', 'zengame')
                . '</p></div>';
        }

        $is_woo = $this->plugin->is_woo_active();
        $is_gp = \defined('GAMIPRESS_VER');
        $status = ($is_woo && $is_gp) ? 'ONLINE' : 'DEGRADED';
        $color = ('ONLINE' === $status) ? '#0D96FF' : '#f87171';

        ?>
        <div class="wrap">
            <h1>ZenGame // <span style="color:<?php echo \esc_attr($color); ?>;">
                    <?php echo \esc_html($status); ?>
                </span></h1>
            <div class="welcome-panel"
                style="background:#111;color:#fff;padding:40px;border-radius:12px;border:1px solid #333;box-shadow:0 10px 30px rgba(0,0,0,.5);">

                <h2 style="color:<?php echo $color; ?>;font-weight:900;letter-spacing:-1px;margin:0 0 10px 0;">
                    CENTRAL INTELLIGENCE
                </h2>
                <p style="color:#666;font-family:monospace;">ZenGame Pro v1.4.0 // Snapshot 2026-03-16</p>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:25px;margin-top:35px;">
                    <?php
                    $cards = [
                        ['WooCommerce HPOS', $is_woo ? 'SUPPORTED' : 'NOT FOUND', $is_woo],
                        ['GamiPress Engine', $is_gp ? 'CONNECTED' : 'OFFLINE', $is_gp],
                        ['Cache Health', ZenGame::CACHE_VERSION . ' Stable', true],
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

    /** Renders the settings form. */
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
}
