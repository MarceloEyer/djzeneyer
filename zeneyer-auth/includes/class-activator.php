<?php
namespace ZenEyer\Auth;

class Activator {
    
    public static function activate() {
        self::check_requirements();
        self::generate_secret_key();
        self::set_default_options();
        flush_rewrite_rules();
    }
    
    public static function deactivate() {
        flush_rewrite_rules();
    }
    
    private static function check_requirements() {
        $errors = [];
        
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            $errors[] = 'PHP 7.4 or higher is required. Current version: ' . PHP_VERSION;
        }
        
        if (!extension_loaded('openssl')) {
            $errors[] = 'OpenSSL PHP extension is required';
        }
        
        if (!empty($errors)) {
            wp_die(
                '<h3>ZenEyer Auth Pro - Requirements Not Met</h3><ul><li>' . implode('</li><li>', $errors) . '</li></ul>',
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
        $defaults = [
            'token_expiration' => 7,
            'google_client_id' => '',
        ];
        
        if (!get_option('zeneyer_auth_settings')) {
            add_option('zeneyer_auth_settings', $defaults);
        }
    }
}
