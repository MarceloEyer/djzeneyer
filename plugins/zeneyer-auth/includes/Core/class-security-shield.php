<?php
/**
 * Security Shield Component
 *
 * Implements anti-bot protections, hardening, and native endpoint security.
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.3.0
 */

namespace ZenEyer\Auth\Core;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Security_Shield Class
 *
 * This class handles all "Anti-Bot" and security hardening logic previously
 * located in the main plugin file.
 */
final class Security_Shield
{
    /**
     * Initialize security protections
     */
    public static function init()
    {
        // 1. Disable XML-RPC - Vulnerable to brute force and DDoS
        \add_filter('xmlrpc_enabled', '__return_false');

        // 2. Disable default registration (Mata registro padrão)
        \add_action('login_form_register', [__CLASS__, 'disable_default_registration']);

        // 3. Secure native REST user endpoints
        \add_filter('rest_endpoints', [__CLASS__, 'secure_rest_user_endpoints']);

        // 4. The "Guillotine": Final protection for unauthorized user creation
        \add_action('user_register', [__CLASS__, 'guillotine_protection'], 999);
    }

    /**
     * Disables the standard WP registration form by returning 404
     */
    public static function disable_default_registration()
    {
        $message = \__('Default registration is disabled. Please use the official site registration.', 'zeneyer-auth');

        if (\defined('REST_REQUEST') && REST_REQUEST) {
            \wp_send_json_error(['message' => $message], 404);
        }

        // Simulate a 404 to be less obvious to attackers
        global $wp_query;
        if (isset($wp_query)) {
            $wp_query->set_404();
        }
        
        \status_header(404);
        \nocache_headers();
        \wp_die(\esc_html($message), \__('Not Found', 'zeneyer-auth'), ['response' => 404]);
    }

    /**
     * Removes POST handlers from native user endpoints to prevent abuse
     */
    public static function secure_rest_user_endpoints($endpoints)
    {
        foreach ($endpoints as $route => $handlers) {
            // Block POST/CREATE on user routes (/wp/v2/users)
            if (\str_starts_with($route, '/wp/v2/users')) {
                foreach ($handlers as $key => $handler) {
                    $methods = $handler['methods'] ?? '';

                    $is_post = false;
                    if (\is_string($methods) && \str_contains($methods, 'POST')) {
                        $is_post = true;
                    } elseif (\is_array($methods)) {
                        $is_post = \in_array('POST', $methods) || isset($methods['POST']);
                    }

                    if ($is_post) {
                        unset($endpoints[$route][$key]);
                    }
                }
            }
        }
        return $endpoints;
    }

    /**
     * Ensures only authorized paths can create users
     */
    public static function guillotine_protection($user_id)
    {
        // Allow admin creation
        if (\is_admin() && \current_user_can('create_users')) {
            return;
        }

        // Allow WooCommerce legitimate customers
        if (\class_exists('WooCommerce')) {
            $user = \get_userdata($user_id);
            if ($user && \in_array('customer', (array) $user->roles)) {
                return;
            }
        }

        // If not validated by Zen Auth custom logic, delete immediately
        if (!\defined('ZEN_AUTH_VALIDATED') || !ZEN_AUTH_VALIDATED) {
            \error_log("🚨 [ZenEyer Security] INTRUDER DETECTED: Unauthorized registration attempt on ID $user_id. Blocking...");

            // Delete user without triggering common hooks to be faster
            \wp_delete_user($user_id);

            $message = \__('Unauthorized action.', 'zeneyer-auth');
            if (\defined('REST_REQUEST') && REST_REQUEST) {
                \wp_send_json_error(['message' => $message], 403);
            }
            \wp_die(\esc_html($message), '', ['response' => 403]);
        }
    }
}
