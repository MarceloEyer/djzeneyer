<?php
/**
 * Main Plugin Class
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.3.0
 */

namespace ZenEyer\Auth;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * ZenEyer_Auth_Pro Class
 *
 * The central controller for the ZenEyer Auth Pro plugin.
 * Orchestrates component loading and initialization.
 */
final class ZenEyer_Auth_Pro
{
    /** @var ZenEyer_Auth_Pro|null */
    private static $instance = null;

    /**
     * Returns the singleton instance.
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Private constructor to enforce Singleton pattern.
     */
    private function __construct()
    {
        $this->define_constants();
        $this->load_dependencies();
        $this->init_hooks();
        $this->init_components();
    }

    /**
     * Defines plugin constants for internal use.
     */
    private function define_constants()
    {
        if (!defined('ZENEYER_AUTH_VERSION')) {
            define('ZENEYER_AUTH_VERSION', '2.4.0');
        }
    }

    /**
     * Loads required dependencies.
     */
    private function load_dependencies()
    {
        // Internal Components
        require_once ZENEYER_AUTH_PATH . 'includes/Core/class-jwt-manager.php';
        require_once ZENEYER_AUTH_PATH . 'includes/Core/class-cors-handler.php';
        require_once ZENEYER_AUTH_PATH . 'includes/Core/class-rate-limiter.php';
        require_once ZENEYER_AUTH_PATH . 'includes/Core/class-wp-auth-integration.php';
        require_once ZENEYER_AUTH_PATH . 'includes/Core/class-security-shield.php';
        
        require_once ZENEYER_AUTH_PATH . 'includes/Auth/Trait-Username-Generator.php';
        require_once ZENEYER_AUTH_PATH . 'includes/Auth/class-google-provider.php';
        require_once ZENEYER_AUTH_PATH . 'includes/Auth/class-password-auth.php';
        require_once ZENEYER_AUTH_PATH . 'includes/API/class-rest-routes.php';

        // Load Admin components only when needed
        if (is_admin()) {
            require_once ZENEYER_AUTH_PATH . 'includes/Admin/class-settings-page.php';
        }

        require_once ZENEYER_AUTH_PATH . 'includes/class-activator.php';
        require_once ZENEYER_AUTH_PATH . 'includes/class-logger.php';
    }

    /**
     * Initializes core WordPress hooks.
     */
    private function init_hooks()
    {
        \add_action('plugins_loaded', [$this, 'load_textdomain'], 10);
    }

    /**
     * Bootstraps all core components.
     */
    private function init_components()
    {
        // 1. Security First
        \ZenEyer\Auth\Core\Security_Shield::init();

        // 2. Headless Logistics
        if (\class_exists('\ZenEyer\Auth\Core\CORS_Handler')) {
            \ZenEyer\Auth\Core\CORS_Handler::init();
        }
        
        if (\class_exists('\ZenEyer\Auth\Core\WP_Auth_Integration')) {
            \ZenEyer\Auth\Core\WP_Auth_Integration::init();
        }

        // 3. API Routes
        if (\class_exists('\ZenEyer\Auth\API\Rest_Routes')) {
            \add_action('rest_api_init', ['\ZenEyer\Auth\API\Rest_Routes', 'register_routes']);
        }

        // 4. Admin Settings (Only if in admin area)
        if (\is_admin() && \class_exists('\ZenEyer\Auth\Admin\Settings_Page')) {
            $settings = new \ZenEyer\Auth\Admin\Settings_Page();
            $settings->init();
        }
    }

    /**
     * Loads the plugin textdomain for translations.
     */
    public function load_textdomain()
    {
        \load_plugin_textdomain(
            'zeneyer-auth',
            false,
            \dirname(\plugin_basename(ZENEYER_AUTH_PATH . 'zeneyer-auth.php')) . '/languages'
        );
    }
}
