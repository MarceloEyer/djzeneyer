<?php
/**
 * CORS Handler for Headless WordPress
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.0.0
 */

namespace ZenEyer\Auth\Core;

class CORS_Handler {
    
    /**
     * Initialize CORS handling
     */
    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'add_cors_headers'], 15);
        
        // Handle OPTIONS preflight
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            self::handle_preflight();
        }
    }
    
    /**
     * Add CORS headers to REST API responses
     */
    public static function add_cors_headers() {
        remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
        
        add_filter('rest_pre_serve_request', function($served) {
            $allowed_origins = self::get_allowed_origins();
            $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
            
            if (self::is_origin_allowed($origin, $allowed_origins)) {
                header("Access-Control-Allow-Origin: {$origin}");
                header('Access-Control-Allow-Credentials: true');
                header('Vary: Origin');
            }
            
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With');
            header('Access-Control-Max-Age: 86400'); // 24 hours
            
            return $served;
        });
    }
    
    /**
     * Handle OPTIONS preflight requests
     */
    private static function handle_preflight() {
        $allowed_origins = self::get_allowed_origins();
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        if (self::is_origin_allowed($origin, $allowed_origins)) {
            header("Access-Control-Allow-Origin: {$origin}");
            header('Access-Control-Allow-Credentials: true');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-Requested-With');
        header('Access-Control-Max-Age: 86400');
        
        status_header(200);
        exit;
    }
    
    /**
     * Get allowed origins
     *
     * @return array
     */
    private static function get_allowed_origins() {
        $default_origins = [
            'http://localhost:5173',  // Vite dev
            'http://localhost:3000',  // React dev
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
            get_site_url(),
            'https://djzeneyer.com',
            'https://www.djzeneyer.com',
        ];
        
        return apply_filters('zeneyer_auth_cors_origins', $default_origins);
    }
    
    /**
     * Check if origin is allowed
     *
     * @param string $origin
     * @param array $allowed_origins
     * @return bool
     */
    private static function is_origin_allowed($origin, $allowed_origins) {
        if (empty($origin)) {
            return false;
        }
        
        // Exact match
        if (in_array($origin, $allowed_origins, true)) {
            return true;
        }
        
        // Extract host from origin for wildcard matching
        $origin_host = parse_url($origin, PHP_URL_HOST);

        if (!$origin_host) {
            return false;
        }

        // Wildcard match (e.g., *.djzeneyer.com)
        foreach ($allowed_origins as $allowed) {
            if (strpos($allowed, '*') !== false) {
                // Extract host from allowed pattern if it's a URL (e.g. https://*.example.com -> *.example.com)
                $allowed_host = parse_url($allowed, PHP_URL_HOST);
                if (!$allowed_host) {
                    $allowed_host = $allowed;
                }

                // Convert wildcard pattern to regex
                // 1. Quote the string to escape all regex special characters
                $pattern = preg_quote($allowed_host, '/');

                // 2. Replace the escaped wildcard (\*) with regex wildcard (.*)
                // This ensures ONLY the original '*' acts as a wildcard, while other chars like '?' or '[]' are treated literally.
                $pattern = str_replace('\*', '.*', $pattern);

                // 3. Anchor the pattern to ensure full host match
                if (preg_match('/^' . $pattern . '$/', $origin_host)) {
                    return true;
                }
            }
        }
        
        return false;
    }
}
