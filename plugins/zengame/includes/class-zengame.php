<?php
/**
 * Main Controller Class
 *
 * @package ZenGame
 * @since 1.4.0
 */

namespace ZenEyer\Game;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * ZenGame Class
 * 
 * Orchestrates the game engine, REST API, and Administrative interface.
 */
final class ZenGame
{
    /** @var string Global constant for cache versions */
    public const CACHE_VERSION = 'v16';

    /** @var int Default Cache TTL (24 Hours) */
    public const DEFAULT_CACHE_TTL = 86400;

    /** @var int Leaderboard Cache TTL (1 Hour — refreshed on every point award) */
    public const LEADERBOARD_CACHE_TTL = 3600;

    /** @var ZenGame|null */
    private static $instance = null;

    /** @var string[] */
    private array $boot_errors = [];

    /**
     * Singleton instance provider.
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Private constructor for singleton.
     */
    private function __construct()
    {
        $this->load_dependencies();
        $this->init_hooks();
    }

    /**
     * Loads required files.
     */
    private function load_dependencies()
    {
        $required_files = [
            ZENGAME_PATH . 'includes/Core/class-zengame-engine.php',
            ZENGAME_PATH . 'includes/API/class-rest-handler.php',
            ZENGAME_PATH . 'includes/class-zengame-activator.php',
        ];

        foreach ($required_files as $file) {
            if (!\file_exists($file)) {
                $this->record_boot_error('Missing required file: ' . $file);
                continue;
            }

            require_once $file;
        }

        if (\is_admin()) {
            $admin_file = ZENGAME_PATH . 'includes/class-zengame-admin.php';
            if (\file_exists($admin_file)) {
                require_once $admin_file;
            } else {
                $this->record_boot_error('Missing admin file: ' . $admin_file);
            }
        }
    }

    /**
     * Registers general hooks.
     */
    private function init_hooks()
    {
        \add_action('plugins_loaded', [$this, 'init_components'], 20);
    }

    /**
     * Bootstraps the plugin components.
     */
    public function init_components()
    {
        if (!empty($this->boot_errors)) {
            return;
        }

        if (!\class_exists('\\ZenEyer\\Game\\Core\\Engine')) {
            $this->record_boot_error('Core engine class was not loaded.');
            return;
        }

        // 1. Initialize the Game Engine (Caching, Stats, SQL)
        $engine = \ZenEyer\Game\Core\Engine::get_instance();
        $engine->init();

        // 2. Initialize the REST API
        if (\class_exists('\\ZenEyer\\Game\\API\\REST_Handler')) {
            \ZenEyer\Game\API\REST_Handler::init($engine);
        } else {
            $this->record_boot_error('REST handler class was not loaded.');
        }

        // 3. Initialize Admin UI (only in dashboard)
        if (\is_admin() && \class_exists('\\ZenEyer\\Game\\ZenGame_Admin')) {
            \ZenEyer\Game\ZenGame_Admin::get_instance($this);
        }
    }

    private function record_boot_error(string $message): void
    {
        $this->boot_errors[] = $message;
        \error_log('[ZenGame] ' . $message);
    }

    /**
     * Utility: Checks if WooCommerce is active.
     */
    public function is_woo_active(): bool
    {
        return \class_exists('WooCommerce');
    }

    /**
     * Utility: Proxy to clear engine cache.
     */
    public function clear_all_gamipress_cache(): void
    {
        \ZenEyer\Game\Core\Engine::get_instance()->clear_all_cache();
    }
}
