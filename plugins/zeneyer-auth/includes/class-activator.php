<?php
/**
 * Fired during plugin activation
 *
 * @package ZenEyer_Auth_Pro
 */

namespace ZenEyer\Auth;

if (!defined('ABSPATH')) {
    exit;
}

class Activator {
    
    public static function activate() {
        // 1. Verifica se o ambiente está seguro antes de ativar
        self::check_requirements();
        
        // 2. Gera segredos JWT se necessário
        self::generate_secret_key();
        
        // 3. Define opções padrão
        self::set_default_options();
        
        // 4. Limpa regras de URL para garantir que a API funcione
        flush_rewrite_rules();
    }
    
    public static function deactivate() {
        flush_rewrite_rules();
    }
    
    private static function check_requirements() {
        $errors = [];
        
        // Checagem de PHP
        if (version_compare(PHP_VERSION, '8.5', '<')) {
            $errors[] = 'PHP 8.5 or higher is required. Current version: ' . PHP_VERSION;
        }
        
        // Checagem de OpenSSL (Vital para segurança)
        if (!extension_loaded('openssl')) {
            $errors[] = 'OpenSSL PHP extension is required for secure authentication.';
        }
        
        // --- TRAVA DE SEGURANÇA (NOVO) ---
        // Verifica se as chaves do Cloudflare estão no wp-config.php
        // Isso impede que o plugin rode sem a proteção anti-bot configurada.
        if ( ! defined('ZEN_TURNSTILE_SITE_KEY') || ! defined('ZEN_TURNSTILE_SECRET_KEY') ) {
            $errors[] = '<b>ERRO CRÍTICO DE SEGURANÇA:</b> As chaves do Cloudflare Turnstile não foram encontradas no <code>wp-config.php</code>.<br><br>' .
                        'Adicione as seguintes linhas no seu arquivo <code>wp-config.php</code> antes de ativar:<br>' .
                        '<code>define( "ZEN_TURNSTILE_SITE_KEY", "sua-site-key-aqui" );</code><br>' .
                        '<code>define( "ZEN_TURNSTILE_SECRET_KEY", "sua-secret-key-aqui" );</code>';
        }
        
        if (!empty($errors)) {
            wp_die(
                '<div class="error"><p><strong>❌ ZenEyer Auth Pro - Falha na Ativação</strong></p><ul><li>' . implode('</li><li style="margin-top:10px;">', $errors) . '</li></ul></div>',
                'Plugin Activation Error',
                ['back_link' => true]
            );
        }
    }
    
    private static function generate_secret_key() {
        if (defined('ZENEYER_JWT_SECRET')) {
            return;
        }
        
        $secret = get_option('zeneyer_auth_jwt_secret');
        
        if (!$secret) {
            $secret = wp_generate_password(64, true, true);
            add_option('zeneyer_auth_jwt_secret', $secret, '', 'yes');
        }
    }
    
    private static function set_default_options() {
        // Defensive: load Core\JWT_Manager explicitly rather than assuming
        // ZenEyer_Auth_Pro's constructor already ran in this request. The
        // require is idempotent (require_once), so this is safe even if the
        // class is already loaded.
        if (!class_exists('\\ZenEyer\\Auth\\Core\\JWT_Manager') && defined('ZENEYER_AUTH_PATH')) {
            require_once ZENEYER_AUTH_PATH . 'includes/Core/class-jwt-manager.php';
        }

        $default_expiration = class_exists('\\ZenEyer\\Auth\\Core\\JWT_Manager')
            ? \ZenEyer\Auth\Core\JWT_Manager::DEFAULT_EXPIRATION
            : 60; // Matches JWT_Manager::DEFAULT_EXPIRATION if the class truly can't load.

        $defaults = [
            // Minutes — see Admin\Settings_Page::sanitize_token_expiration()
            // and Core\JWT_Manager::get_expiration_minutes() for the single
            // definition of this unit, its default, and its valid range.
            'token_expiration' => $default_expiration,
            'google_client_id' => '',
        ];

        if (!get_option('zeneyer_auth_settings')) {
            add_option('zeneyer_auth_settings', $defaults);
        }
    }
}
