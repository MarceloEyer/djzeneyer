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
    public const CACHE_VERSION = 'v14';
    
    /** @var int Default Cache TTL (24 Hours) */
    public const DEFAULT_CACHE_TTL = 86400;

    /** @var ZenGame|null */
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
     * Loads required files.
     */
    private function load_dependencies()
    {
        require_once ZENGAME_PATH . 'includes/Core/class-zengame-engine.php';
        require_once ZENGAME_PATH . 'includes/API/class-rest-handler.php';
        require_once ZENGAME_PATH . 'includes/class-zengame-activator.php';

        if (\is_admin()) {
            require_once ZENGAME_PATH . 'includes/class-zengame-admin.php';
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
        // 1. Initialize the Game Engine (Caching, Stats, SQL)
        $engine = \ZenEyer\Game\Core\Engine::get_instance();
        $engine->init();

        // 2. Initialize the REST API
        \ZenEyer\Game\API\REST_Handler::init($engine);

        // 3. Initialize Admin UI (only in dashboard)
        if (\is_admin()) {
            \ZenEyer\Game\ZenGame_Admin::get_instance($this);
        }
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
