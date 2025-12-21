<?php
/**
 * Plugin Name:       ZenEyer Auth Pro
 * Plugin URI:        https://djzeneyer.com
 * Description:       Enterprise-grade JWT Authentication for Headless WordPress + React. Secure, fast, and production-ready. Includes Anti-Bot Security Shield.
 * Version:           2.1.1
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
define('ZENEYER_AUTH_VERSION', '2.1.1');
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
     * 🛡️ SECURITY SHIELD: BLINDAGEM ANTI-BOT
     * Bloqueia rotas nativas e força validação do Turnstile
     */
    private function init_security_shield() {
        // 1. Desativa XML-RPC (Porta de ataque força bruta)
        add_filter('xmlrpc_enabled', '__return_false');

        // 2. Bloqueia tentativas de registro pelo wp-login.php padrão
        add_action('login_form_register', function() {
            wp_die('O registro padrão está desativado por segurança. Use o site oficial.', 'Acesso Negado', ['response' => 403]);
        });

        // 3. Remove rota nativa de criação de usuários da REST API (wp/v2/users)
        // CORREÇÃO DO BUG: Verifica tipos antes de dar unset para evitar erro de string offset
        add_filter('rest_endpoints', function($endpoints) {
            if (isset($endpoints['/wp/v2/users'])) {
                foreach ($endpoints['/wp/v2/users'] as $index => $endpoint) {
                    if (isset($endpoint['methods'])) {
                        $methods = $endpoint['methods'];
                        
                        // Normaliza para array se for string (ex: 'GET, POST')
                        if (is_string($methods)) {
                            $methods = array_map('trim', explode(',', $methods));
                        }
                        
                        // Garante que é array
                        $methods = (array) $methods;

                        // Se POST (criação) estiver permitido, removemos o endpoint inteiro por segurança
                        if (in_array('POST', $methods) || array_key_exists('POST', $methods)) {
                            unset($endpoints['/wp/v2/users'][$index]);
                        }
                    }
                }
            }
            return $endpoints;
        });

        // 4. A GUILHOTINA: Mata usuários criados sem validação
        add_action('user_register', function($user_id) {
            // Se for admin criando usuário pelo painel, permite.
            if (is_admin() && current_user_can('create_users')) {
                return;
            }

            // Verifica se o cadastro passou pela nossa validação Turnstile
            // A constante ZEN_AUTH_VALIDATED é definida no class-password-auth.php após sucesso do Cloudflare
            if (!defined('ZEN_AUTH_VALIDATED')) {
                
                // Loga a tentativa de intrusão
                error_log("🚨 [ZenEyer Security] INTRUSO DETECTADO: Usuário ID $user_id tentou cadastro sem passar pelo Turnstile. Removendo...");
                
                // Deleta o usuário intruso imediatamente
                wp_delete_user($user_id);
                
                // Mata a requisição com erro
                wp_die('Registro não autorizado: Falha na verificação de segurança.', 403);
            }
        }, 999); // Prioridade alta para rodar por último e garantir o bloqueio
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