<?php
/**
 * Main Controller Class for ZenGame Pro
 *
 * @package ZenGamePro
 * @since 1.4.0
 */

namespace ZenEyer\GamePro;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * ZenGamePro Class
 * 
 * Orchestrates the standalone game engine, REST API, and Administrative interface.
 */
final class ZenGamePro
{
    /** @var string Global constant for cache versions */
    public const CACHE_VERSION = 'v14-pro';
    
    /** @var int Default Cache TTL (24 Hours) */
    public const DEFAULT_CACHE_TTL = 86400;

    /** @var ZenGamePro|null */
    private static $instance = null;

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
     * Loads required files (Standalone Version).
     */
    private function load_dependencies()
    {
        require_once ZENGAMEPRO_PATH . 'includes/Core/class-zengame-engine.php';
        require_once ZENGAMEPRO_PATH . 'includes/API/class-rest-handler.php';
        require_once ZENGAMEPRO_PATH . 'includes/class-zengame-activator-pro.php';
        require_once ZENGAMEPRO_PATH . 'includes/Core/class-zengame-triggers.php';

        if (\is_admin()) {
            require_once ZENGAMEPRO_PATH . 'includes/class-zengame-admin-pro.php';
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
        // 1. Initialize the Game Engine (Standalone)
        $engine = new \ZenEyer\GamePro\Core\Engine();

        // 2. Initialize the REST API (Standalone)
        \ZenEyer\GamePro\API\REST_Handler::init();

        // 3. Initialize Admin UI (only in dashboard)
        if (\is_admin()) {
            new \ZenEyer\GamePro\Admin();
        }

        // 4. Initialize Triggers (Standalone)
        new \ZenEyer\GamePro\Core\Triggers();
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
    public function clear_all_cache(): void
    {
        // In Pro version, we use the specific Engine cache clearer
        \ZenEyer\GamePro\Core\Engine::clear_user_cache(\get_current_user_id());
    }
}
