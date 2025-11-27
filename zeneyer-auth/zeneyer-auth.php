<?php
/**
 * Plugin Name:       ZenEyer Auth Pro
 * Plugin URI:        https://djzeneyer.com
 * Description:       Enterprise-grade JWT Authentication for Headless WordPress + React. Secure, fast, and production-ready.
 * Version:           2.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            DJ Zen Eyer
 * Author URI:        https://djzeneyer.com
 * License:           GPL v2 or later
 * Text Domain:       zeneyer-auth
 * Domain Path:       /languages
 *
 * @package           ZenEyer_Auth_Pro
 */

if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('ZENEYER_AUTH_VERSION', '2.0.0');
define('ZENEYER_AUTH_PATH', plugin_dir_path(__FILE__));
define('ZENEYER_AUTH_URL', plugin_dir_url(__FILE__));
define('ZENEYER_AUTH_BASENAME', plugin_basename(__FILE__));

// Load Composer dependencies (Firebase JWT)
if (file_exists(ZENEYER_AUTH_PATH . 'vendor/autoload.php')) {
    require_once ZENEYER_AUTH_PATH . 'vendor/autoload.php';
}

/**
 * Main plugin class - Singleton pattern
 */
final class ZenEyer_Auth_Pro {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    /**
     * Load required files
     */
    private function load_dependencies() {
        // Core
        $this->load_file('includes/Core/class-jwt-manager.php');
        $this->load_file('includes/Core/class-cors-handler.php');
        $this->load_file('includes/Core/class-rate-limiter.php');
        
        // Auth providers
        $this->load_file('includes/Auth/class-google-provider.php');
        $this->load_file('includes/Auth/class-password-auth.php');
        
        // API
        $this->load_file('includes/API/class-rest-routes.php');
        
        // Admin
        if (is_admin()) {
            $this->load_file('includes/Admin/class-settings-page.php');
        }
        
        // Utilities
        $this->load_file('includes/class-activator.php');
        $this->load_file('includes/class-logger.php');
    }
    
    /**
     * Load file with error handling
     */
    private function load_file($path) {
        $full_path = ZENEYER_AUTH_PATH . $path;
        
        if (file_exists($full_path)) {
            require_once $full_path;
        } else {
            error_log('[ZenEyer Auth] Missing file: ' . $path);
        }
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Activation/Deactivation
        register_activation_hook(__FILE__, ['ZenEyer\Auth\Activator', 'activate']);
        register_deactivation_hook(__FILE__, ['ZenEyer\Auth\Activator', 'deactivate']);
        
        // Initialize components
        add_action('plugins_loaded', [$this, 'init_components']);
        
        // Load text domain
        add_action('init', [$this, 'load_textdomain']);
    }
    
    /**
     * Initialize plugin components
     */
    public function init_components() {
        // CORS Handler
        if (class_exists('ZenEyer\Auth\Core\CORS_Handler')) {
            \ZenEyer\Auth\Core\CORS_Handler::init();
        }
        
        // REST API Routes
        if (class_exists('ZenEyer\Auth\API\Rest_Routes')) {
            add_action('rest_api_init', ['ZenEyer\Auth\API\Rest_Routes', 'register_routes']);
        }
        
        // Admin Settings
        if (is_admin() && class_exists('ZenEyer\Auth\Admin\Settings_Page')) {
            $settings = new \ZenEyer\Auth\Admin\Settings_Page();
            $settings->init();
        }
    }
    
    /**
     * Load plugin text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'zeneyer-auth',
            false,
            dirname(ZENEYER_AUTH_BASENAME) . '/languages'
        );
    }
}

// Initialize plugin
ZenEyer_Auth_Pro::get_instance();
