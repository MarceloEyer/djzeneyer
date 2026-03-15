<?php
namespace ZenEyer\Auth;
/**
 * Plugin Name:       ZenEyer Auth Pro
 * Plugin URI:        https://djzeneyer.com
 * Description:       Enterprise-grade JWT Authentication for Headless WordPress + React. Secure, fast, and production-ready. Includes Anti-Bot Security Shield.
 * Version:           2.3.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
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
define('ZENEYER_AUTH_VERSION', '2.3.0'); // JWT now works with native WP endpoints
define('ZENEYER_AUTH_PATH', \plugin_dir_path(__FILE__));
define('ZENEYER_AUTH_URL', \plugin_dir_url(__FILE__));
define('ZENEYER_AUTH_BASENAME', \plugin_basename(__FILE__));

// Load Composer dependencies (Firebase JWT)
if (file_exists(ZENEYER_AUTH_PATH . 'vendor/autoload.php')) {
    require_once ZENEYER_AUTH_PATH . 'vendor/autoload.php';
}

/**
 * Main plugin class - Singleton pattern
 */
final class ZenEyer_Auth_Pro
{

    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->load_dependencies();
        $this->init_hooks();
        $this->init_security_shield(); // 🛡️ Inicializa a proteção Anti-Bot
        $this->override_security_headers(); // 🚀 (Agora Silenciado)
    }

    /**
     * Load required files
     */
    private function load_dependencies()
    {
        $this->load_file('includes/Core/class-jwt-manager.php');
        $this->load_file('includes/Core/class-cors-handler.php');
        $this->load_file('includes/Core/class-rate-limiter.php');
        $this->load_file('includes/Core/class-wp-auth-integration.php');
        $this->load_file('includes/Auth/Trait-Username-Generator.php');
        $this->load_file('includes/Auth/class-google-provider.php');
        $this->load_file('includes/Auth/class-password-auth.php');
        $this->load_file('includes/API/class-rest-routes.php');

        if (is_admin()) {
            $this->load_file('includes/Admin/class-settings-page.php');
        }

        $this->load_file('includes/class-activator.php');
        $this->load_file('includes/class-logger.php');
    }

    private function load_file($path)
    {
        // 🛡️ LFI Protection: Ensure path is valid and stays within plugin dir
        $full_path = realpath(ZENEYER_AUTH_PATH . $path);
        $plugin_root = realpath(ZENEYER_AUTH_PATH);

        if ($full_path && str_starts_with($full_path, $plugin_root)) {
            require_once $full_path;
        }
    }

    private function init_hooks()
    {
        register_activation_hook(__FILE__, ['ZenEyer\Auth\Activator', 'activate']);
        register_deactivation_hook(__FILE__, ['ZenEyer\Auth\Activator', 'deactivate']);
        
        // 🛠️ Standard priorities
        add_action('plugins_loaded', [$this, 'init_components'], 10);
        add_action('init', [$this, 'load_textdomain'], 10);
    }

    /**
     * 🚀 OVERRIDE SECURITY HEADERS
     * 🚨 SILENCIADO: O controle de segurança agora é feito exclusivamente pelo .htaccess v11.1
     */
    private function override_security_headers()
    {
        return;
    }

    private function init_security_shield()
    {
        // 1. Desativa XML-RPC
        add_filter('xmlrpc_enabled', '__return_false');

        // 2. Mata registro padrão (404 para evitar enumeração de usuários)
        add_action('login_form_register', function () {
            $message = 'O registro padrão está desativado. Use o site oficial.';
            
            if (defined('REST_REQUEST') && REST_REQUEST) {
                wp_send_json_error(['message' => $message], 404);
            }
            
            // Simula um 404 para ser menos óbvio
            global $wp_query;
            $wp_query->set_404();
            status_header(404);
            nocache_headers();
            wp_die($message, 'Não Encontrado', ['response' => 404]);
        });

        // 3. Remove rotas nativas de usuários com segurança aumentada (Proteção Global)
        add_filter('rest_endpoints', function ($endpoints) {
            foreach ($endpoints as $route => $handlers) {
                // Bloqueia qualquer POST em rotas de usuários core
                if (str_starts_with($route, '/wp/v2/users')) {
                    foreach ($handlers as $key => $handler) {
                        $methods = $handler['methods'] ?? '';
                        
                        $is_post = false;
                        if (is_string($methods) && str_contains($methods, 'POST')) {
                            $is_post = true;
                        } elseif (is_array($methods)) {
                            $is_post = in_array('POST', $methods) || isset($methods['POST']);
                        }

                        if ($is_post) {
                            unset($endpoints[$route][$key]);
                        }
                    }
                }
            }
            return $endpoints;
        });

        // 4. A Guilhotina (Proteção de última instância)
        add_action('user_register', function ($user_id) {
            if (is_admin() && current_user_can('create_users')) {
                return;
            }

            // Exceção WooCommerce legitimada
            if (class_exists('WooCommerce')) {
                $user = get_userdata($user_id);
                if ($user && in_array('customer', (array) $user->roles)) {
                    return;
                }
            }

            // Se não passou pela nossa validação customizada, deleta imediatamente
            if (!defined('ZEN_AUTH_VALIDATED') || !ZEN_AUTH_VALIDATED) {
                error_log("🚨 [ZenEyer Security] INTRUSO DETECTADO: Tentativa de registro externa no ID $user_id. Bloqueando...");
                
                // Força deleção sem passar por hooks de outros plugins
                wp_delete_user($user_id);

                $message = 'Ação não autorizada.';
                if (defined('REST_REQUEST') && REST_REQUEST) {
                    wp_send_json_error(['message' => $message], 403);
                }
                wp_die($message, 403);
            }
        }, 999);
    }

    public function init_components()
    {
        if (class_exists('ZenEyer\Auth\Core\CORS_Handler'))
            \ZenEyer\Auth\Core\CORS_Handler::init();
        if (class_exists('ZenEyer\Auth\Core\WP_Auth_Integration'))
            \ZenEyer\Auth\Core\WP_Auth_Integration::init();
        if (class_exists('ZenEyer\Auth\API\Rest_Routes'))
            add_action('rest_api_init', ['ZenEyer\Auth\API\Rest_Routes', 'register_routes']);
        if (is_admin() && class_exists('ZenEyer\Auth\Admin\Settings_Page')) {
            $settings = new \ZenEyer\Auth\Admin\Settings_Page();
            $settings->init();
        }
    }

    public function load_textdomain()
    {
        load_plugin_textdomain('zeneyer-auth', false, dirname(ZENEYER_AUTH_BASENAME) . '/languages');
    }
}

ZenEyer_Auth_Pro::get_instance();