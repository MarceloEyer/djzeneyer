<?php
/**
 * Rate Limiter - Prevent brute force attacks
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.0.0
 */

namespace ZenEyer\Auth\Core;

if (!defined('ABSPATH')) {
    exit;
}

class Rate_Limiter {

    const MAX_ATTEMPTS = 5;
    const LOCKOUT_DURATION = 600; // 10 minutes

    /**
     * Check if IP is rate limited
     *
     * @param string $action
     * @return bool|WP_Error
     */
    public static function check($action = 'login')
    {
        $ip = self::get_client_ip();
        $key = self::get_transient_key($ip, $action);

        $attempts = get_transient($key);

        if ($attempts === false) {
            return true; // No attempts yet
        }

        $options = get_option('zeneyer_auth_settings', []);
        $max_attempts = isset($options['rate_limit_attempts']) ? (int) $options['rate_limit_attempts'] : self::MAX_ATTEMPTS;
        $max_attempts = apply_filters('zeneyer_auth_max_attempts', $max_attempts, $action);

        if ($attempts >= $max_attempts) {
            $lockout = isset($options['rate_limit_duration']) ? (int) $options['rate_limit_duration'] : self::LOCKOUT_DURATION;

            return new \WP_Error(
                'rate_limit_exceeded',
                sprintf(
                    __('Too many attempts. Please try again in %d minutes.', 'zeneyer-auth'),
                    ceil($lockout / 60)
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
    public static function increment($action = 'login')
    {
        $ip = self::get_client_ip();
        $key = self::get_transient_key($ip, $action);

        $options = get_option('zeneyer_auth_settings', []);
        $max_attempts = isset($options['rate_limit_attempts']) ? (int) $options['rate_limit_attempts'] : self::MAX_ATTEMPTS;
        $max_attempts = apply_filters('zeneyer_auth_max_attempts', $max_attempts, $action);
        $duration = isset($options['rate_limit_duration']) ? (int) $options['rate_limit_duration'] : self::LOCKOUT_DURATION;
        $duration = apply_filters('zeneyer_auth_lockout_duration', $duration, $action);

        // Sem lock, requisições paralelas do mesmo IP (ex: brute force automatizado)
        // poderiam ler a mesma contagem antiga e a tentativa acabaria não sendo contada
        // para todas. GET_LOCK é atômico no MySQL e não exige Redis.
        global $wpdb;
        $lock_name = 'zeneyer_rl_' . \md5($ip . $action);
        $lock_acquired = (bool) $wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s, 1)', $lock_name));

        if (!$lock_acquired) {
            \wp_cache_delete('_transient_' . $key, 'options');
            \wp_cache_delete('_transient_timeout_' . $key, 'options');
            set_transient($key, $max_attempts, $duration);
            self::log_audit_event('rate_limit_lock_timeout', 0, $ip, ['action' => $action]);
            return;
        }

        try {
            \wp_cache_delete('_transient_' . $key, 'options');
            \wp_cache_delete('_transient_timeout_' . $key, 'options');

            $attempts = (int) get_transient($key);
            $attempts++;

            set_transient($key, $attempts, $duration);
        } finally {
            $wpdb->query($wpdb->prepare('SELECT RELEASE_LOCK(%s)', $lock_name));
        }

        do_action('zeneyer_auth_rate_limit_incremented', $ip, $action, $attempts);

        if ($attempts >= 3) {
            self::log_audit_event('rate_limit_warning', 0, $ip, ['action' => $action, 'attempts' => $attempts]);
        }
    }

    /**
     * Log an audit event for the admin dashboard
     *
     * @param string $event
     * @param int $user_id
     * @param string $ip
     * @param array $details
     */
    public static function log_audit_event($event, $user_id = 0, $ip = '', $details = [])
    {
        $logs = get_option('zeneyer_auth_audit_log', []);
        if (!is_array($logs))
            $logs = [];

        $new_entry = [
            'time' => time(),
            'event' => $event,
            'user_id' => $user_id,
            'ip' => $ip ?: self::get_client_ip(),
            'details' => $details,
        ];

        array_unshift($logs, $new_entry);
        $logs = array_slice($logs, 0, 100); // Keep last 100

        update_option('zeneyer_auth_audit_log', $logs, false);
    }

    /**
     * Reset attempts for IP
     *
     * @param string $action
     */
    public static function reset($action = 'login')
    {
        $ip = self::get_client_ip();
        $key = self::get_transient_key($ip, $action);

        delete_transient($key);
    }

    /**
     * Get client IP address (proxy headers only trusted from known proxies)
     *
     * @return string
     */
    private static function get_client_ip()
    {
        return Client_IP::get();
    }

    /**
     * Get transient key
     *
     * @param string $ip
     * @param string $action
     * @return string
     */
    private static function get_transient_key($ip, $action)
    {
        return 'zeneyer_rate_limit_' . hash('sha256', $ip . $action);
    }

    /**
     * Clean up old transients (cron job)
     */
    public static function cleanup()
    {
        global $wpdb;

        $wpdb->query(
            "DELETE FROM {$wpdb->options} 
            WHERE option_name LIKE '_transient_zeneyer_rate_limit_%' 
            OR option_name LIKE '_transient_timeout_zeneyer_rate_limit_%'"
        );
    }
}
