<?php
/**
 * Rate Limiter - Prevent brute force attacks
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.0.0
 */

namespace ZenEyer\Auth\Core;

class Rate_Limiter {
    
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 600; // 10 minutes
    
    /**
     * Check if IP is rate limited
     *
     * @param string $action
     * @return bool|WP_Error
     */
    public static function check($action = 'login') {
        $ip = self::get_client_ip();
        $key = self::get_transient_key($ip, $action);
        
        $attempts = get_transient($key);
        
        if ($attempts === false) {
            return true; // No attempts yet
        }
        
        $max_attempts = apply_filters('zeneyer_auth_max_attempts', self::MAX_ATTEMPTS, $action);
        
        if ($attempts >= $max_attempts) {
            return new \WP_Error(
                'rate_limit_exceeded',
                sprintf(
                    __('Too many attempts. Please try again in %d minutes.', 'zeneyer-auth'),
                    ceil(self::LOCKOUT_DURATION / 60)
                ),
                ['status' => 429]
            );
        }
        
        return true;
    }
    
    /**
     * Increment attempt counter
     *
     * @param string $action
     */
    public static function increment($action = 'login') {
        $ip = self::get_client_ip();
        $key = self::get_transient_key($ip, $action);
        
        $attempts = (int) get_transient($key);
        $attempts++;
        
        $duration = apply_filters('zeneyer_auth_lockout_duration', self::LOCKOUT_DURATION, $action);
        
        set_transient($key, $attempts, $duration);
        
        do_action('zeneyer_auth_rate_limit_incremented', $ip, $action, $attempts);
    }
    
    /**
     * Reset attempts for IP
     *
     * @param string $action
     */
    public static function reset($action = 'login') {
        $ip = self::get_client_ip();
        $key = self::get_transient_key($ip, $action);
        
        delete_transient($key);
    }
    
    /**
     * Get client IP address with proxy validation
     *
     * @return string
     */
    private static function get_client_ip() {
        // Define trusted proxy IPs (Cloudflare, local development)
        $trusted_proxies = apply_filters('zeneyer_auth_trusted_proxies', [
            '127.0.0.1',
            '::1',
        ]);

        // First check direct connection
        $remote_addr = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

        // Only trust proxy headers if request comes from trusted proxy
        $is_trusted_proxy = in_array($remote_addr, $trusted_proxies, true);

        if ($is_trusted_proxy) {
            $ip_keys = [
                'HTTP_CF_CONNECTING_IP', // Cloudflare
                'HTTP_X_FORWARDED_FOR',
                'HTTP_X_REAL_IP',
            ];

            foreach ($ip_keys as $key) {
                if (isset($_SERVER[$key]) && !empty($_SERVER[$key])) {
                    $ip = sanitize_text_field($_SERVER[$key]);

                    // Handle multiple IPs (proxy chain) - take first IP only
                    if (strpos($ip, ',') !== false) {
                        $ips = explode(',', $ip);
                        $ip = trim($ips[0]);
                    }

                    // Validate IP format and block private ranges if not localhost
                    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                        return $ip;
                    }
                }
            }
        }

        // Fallback to direct connection IP
        if (filter_var($remote_addr, FILTER_VALIDATE_IP)) {
            return $remote_addr;
        }

        return '0.0.0.0';
    }
    
    /**
     * Get transient key
     *
     * @param string $ip
     * @param string $action
     * @return string
     */
    private static function get_transient_key($ip, $action) {
        return 'zeneyer_rate_limit_' . md5($ip . $action);
    }
    
    /**
     * Clean up old transients (cron job)
     */
    public static function cleanup() {
        global $wpdb;
        
        $wpdb->query(
            "DELETE FROM {$wpdb->options} 
            WHERE option_name LIKE '_transient_zeneyer_rate_limit_%' 
            OR option_name LIKE '_transient_timeout_zeneyer_rate_limit_%'"
        );
    }
}
