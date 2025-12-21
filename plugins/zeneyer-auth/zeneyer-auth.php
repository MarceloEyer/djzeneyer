<?php
/**
 * Plugin Name:       ZenEyer Auth Pro
 * Plugin URI:        https://djzeneyer.com
 * Description:       Enterprise-grade JWT Authentication for Headless WordPress + React. Secure, fast, and production-ready. Includes Anti-Bot Security Shield.
 * Version:           2.1.3
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
define('ZENEYER_AUTH_VERSION', '2.1.3');
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
        $this->init_security_shield(); // 🛡️ Inicializa a proteção Anti-Bot
        $this->override_security_headers(); // 🚀 Força permissão para Cloudflare/React
    }
    
    /**
     * Load required files
     */
    private function load_dependencies() {
        $this->load_file('includes/Core/class-jwt-manager.php');
        $this->load_file('includes/Core/class-cors-handler.php');
        $this->load_file('includes/Core/class-rate-limiter.php');
        $this->load_file('includes/Auth/class-google-provider.php');
        $this->load_file('includes/Auth/class-password-auth.php');
        $this->load_file('includes/API/class-rest-routes.php');
        
        if (is_admin()) {
            $this->load_file('includes/Admin/class-settings-page.php');
        }
        
        $this->load_file('includes/class-activator.php');
        $this->load_file('includes/class-logger.php');
    }
    
    private function load_file($path) {
        $full_path = ZENEYER_AUTH_PATH . $path;
        if (file_exists($full_path)) {
            require_once $full_path;
        }
    }
    
    private function init_hooks() {
        register_activation_hook(__FILE__, ['ZenEyer\Auth\Activator', 'activate']);
        register_deactivation_hook(__FILE__, ['ZenEyer\Auth\Activator', 'deactivate']);
        add_action('plugins_loaded', [$this, 'init_components']);
        add_action('init', [$this, 'load_textdomain']);
    }

    /**
     * 🚀 OVERRIDE SECURITY HEADERS
     * Remove bloqueios impostos por plugins de pagamento (PagBank) ou Cache.
     * Libera 'unsafe-eval' e Cloudflare.
     */
    private function override_security_headers() {
        add_action('send_headers', function() {
            if (headers_sent()) return;

            // 1. Remove regras restritivas de outros plugins
            header_remove('Content-Security-Policy');
            header_remove('X-Content-Security-Policy');
            header_remove('X-WebKit-CSP');

            // 2. Define a regra permissiva (Padrão Ouro para React + Cloudflare)
            $csp = "default-src 'self' https: data:; " .
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://accounts.google.com https://apis.google.com https://gsi.client-url.com https://www.googletagmanager.com; " .
                   "connect-src 'self' https://djzeneyer.com https://challenges.cloudflare.com https://accounts.google.com https://www.googleapis.com https://cloudflareinsights.com; " .
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; " .
                   "font-src 'self' https://fonts.gstatic.com data:; " .
                   "img-src 'self' https: data: blob:; " .
                   "frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com; " .
                   "object-src 'none'; base-uri 'self';";

            header("Content-Security-Policy: " . $csp);
        }, 9999); // Prioridade 9999 = Roda por último e vence a briga
    }

    private function init_security_shield() {
        add_filter('xmlrpc_enabled', '__return_false');
        
        add_action('login_form_register', function() {
            wp_die('O registro padrão está desativado. Use o site oficial.', 'Acesso Negado', ['response' => 403]);
        });

        add_filter('rest_endpoints', function($endpoints) {
            if ( isset( $endpoints['/wp/v2/users'] ) ) {
                foreach ( $endpoints['/wp/v2/users'] as $key => $route ) {
                    if ( ! isset( $route['methods'] ) ) continue;
                    $should_remove = false;
                    if ( is_string( $route['methods'] ) ) {
                        if ( strpos( $route['methods'], 'POST' ) !== false ) $should_remove = true;
                    } elseif ( is_array( $route['methods'] ) ) {
                        if ( isset( $route['methods']['POST'] ) || in_array( 'POST', $route['methods'] ) ) $should_remove = true;
                    }
                    if ( $should_remove ) unset( $endpoints['/wp/v2/users'][$key] );
                }
            }
            return $endpoints;
        });

        add_action('user_register', function($user_id) {
            if (is_admin() && current_user_can('create_users')) return;
            if (!defined('ZEN_AUTH_VALIDATED')) {
                error_log("🚨 [ZenEyer Security] INTRUSO DETECTADO: Usuário ID $user_id. Removendo...");
                wp_delete_user($user_id);
                wp_die('Registro não autorizado.', 403);
            }
        }, 999);
    }
    
    public function init_components() {
        if (class_exists('ZenEyer\Auth\Core\CORS_Handler')) \ZenEyer\Auth\Core\CORS_Handler::init();
        if (class_exists('ZenEyer\Auth\API\Rest_Routes')) add_action('rest_api_init', ['ZenEyer\Auth\API\Rest_Routes', 'register_routes']);
        if (is_admin() && class_exists('ZenEyer\Auth\Admin\Settings_Page')) {
            $settings = new \ZenEyer\Auth\Admin\Settings_Page();
            $settings->init();
        }
    }
    
    public function load_textdomain() {
        load_plugin_textdomain('zeneyer-auth', false, dirname(ZENEYER_AUTH_BASENAME) . '/languages');
    }
}

ZenEyer_Auth_Pro::get_instance();