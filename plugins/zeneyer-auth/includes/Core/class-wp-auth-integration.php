<?php
/**
 * WordPress Authentication Integration
 *
 * Integrates JWT authentication with WordPress core authentication system
 * Allows JWT-authenticated users to access native WordPress REST API endpoints
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.2.0
 */

namespace ZenEyer\Auth\Core;

use ZenEyer\Auth\Core\JWT_Manager;

if (!defined('ABSPATH')) {
    exit;
}

class WP_Auth_Integration
{

    /**
     * Initialize integration hooks
     */
    public static function init()
    {
        // Register JWT authentication for ALL WordPress REST API endpoints
        add_filter('determine_current_user', [__CLASS__, 'determine_current_user_via_jwt'], 20);

        // Allow JWT auth for specific endpoints that require authentication
        add_filter('rest_authentication_errors', [__CLASS__, 'handle_rest_auth_errors'], 10);

        // 🛡️ Skip nonce check if JWT is valid (Prevents 403 on stale/missing cookie nonces)
        add_filter('rest_nonce_check', [__CLASS__, 'skip_nonce_check_for_jwt'], 10);
    }

    /**
     * Determine current user via JWT token
     *
     * This hook is called by WordPress to determine who is the current user
     * We intercept it to check if there's a valid JWT token in the Authorization header
     *
     * @param int|false $user_id Current user ID or false
     * @return int|false User ID if JWT is valid, original value otherwise
     */
    public static function determine_current_user_via_jwt($user_id)
    {
        // If already authenticated via other means, don't override
        if ($user_id) {
            return $user_id;
        }

        // Only apply to REST API requests
        if (!defined('REST_REQUEST') || !REST_REQUEST) {
            return $user_id;
        }

        // 🛡️ Security: Limit JWT scope to specific namespaces to prevent core escalation
        $allowed_namespaces = apply_filters('zeneyer_auth_jwt_allowed_namespaces', [
            'zeneyer-auth/v1',
            'wc/v3',       // WooCommerce Headless
            'mailpoet/v1', // MailPoet Headless
        ]);

        $current_route = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
        $is_allowed = false;

        foreach ($allowed_namespaces as $ns) {
            if (strpos($current_route, '/wp-json/' . $ns) !== false) {
                $is_allowed = true;
                break;
            }
        }

        if (!$is_allowed) {
            return $user_id;
        }

        // Extract token from Authorization header
        $token = self::get_token_from_request();

        if (!$token) {
            return $user_id;
        }

        // Validate JWT token
        $decoded = JWT_Manager::validate_token($token);

        if (is_wp_error($decoded)) {
            return $user_id;
        }

        // Token is valid, get user ID from payload
        if (isset($decoded->data->user_id)) {
            $authenticated_user_id = (int) $decoded->data->user_id;

            // Verify user exists
            $user = get_userdata($authenticated_user_id);

            if ($user) {
                // Set current user globally
                wp_set_current_user($authenticated_user_id);

                return $authenticated_user_id;
            }
        }

        return $user_id;
    }

    /**
     * Handle REST API authentication errors
     *
     * This prevents WordPress from returning 401 errors for endpoints
     * that are accessed with valid JWT tokens
     *
     * @param WP_Error|null|bool $errors Authentication errors
     * @return WP_Error|null|bool
     */
    public static function handle_rest_auth_errors($errors)
    {
        // If no errors, continue
        if (!is_wp_error($errors)) {
            return $errors;
        }

        // Check if we have a valid JWT token
        $token = self::get_token_from_request();

        if (!$token) {
            return $errors;
        }

        $decoded = JWT_Manager::validate_token($token);

        // If token is valid, clear authentication errors
        if (!is_wp_error($decoded) && isset($decoded->data->user_id)) {
            return true;
        }

        // If a token was provided but failed validation, return the specific error
        if (is_wp_error($decoded)) {
            return $decoded;
        }

        return $errors;
    }

    /**
     * Skip REST nonce check for JWT requests
     *
     * WordPress requires a nonce for cookie-authenticated REST requests.
     * Since we use JWT (stateless), we bypass this check if a valid token is present.
     *
     * @param bool|WP_Error $result
     * @return bool|WP_Error
     */
    public static function skip_nonce_check_for_jwt($result)
    {
        if ($result === true) {
            return $result;
        }

        $token = self::get_token_from_request();
        if (!$token) {
            return $result;
        }

        $decoded = JWT_Manager::validate_token($token);
        if (!is_wp_error($decoded) && isset($decoded->data->user_id)) {
            return true;
        }

        return $result;
    }

    /**
     * Extract JWT token from request headers
     *
     * @return string|null Token or null if not found
     */
    private static function get_token_from_request()
    {
        // Try Authorization header first (preferred)
        $auth_header = isset($_SERVER['HTTP_AUTHORIZATION'])
            ? $_SERVER['HTTP_AUTHORIZATION']
            : (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])
                ? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
                : null);

        if (!$auth_header) {
            // Fallback to Apache's Authorization header
            if (function_exists('apache_request_headers')) {
                $headers = apache_request_headers();
                if (isset($headers['Authorization'])) {
                    $auth_header = $headers['Authorization'];
                }
            }
        }

        if (!$auth_header) {
            return null;
        }

        // Extract Bearer token
        if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }
}
