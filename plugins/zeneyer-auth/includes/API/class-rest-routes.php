<?php
/**
 * REST API Routes
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.0.0
 */

namespace ZenEyer\Auth\API;

use ZenEyer\Auth\Core\JWT_Manager;
use ZenEyer\Auth\Core\Rate_Limiter;
use ZenEyer\Auth\Auth\Google_Provider;
use ZenEyer\Auth\Auth\Password_Auth;
use WP_REST_Request;
use WP_REST_Server;
use WP_Error;

if (!defined('ABSPATH')) {
    exit;
}

class Rest_Routes
{

    const NAMESPACE = 'zeneyer-auth/v1';

    public static function register_routes()
    {
        // --- v1 Compatibility & Aliases ---
        $aliases = [
            '/login' => 'login',
            '/register' => 'register',
            '/google' => 'google_login',
            '/refresh' => 'refresh',
            '/logout' => 'logout',
            '/session' => 'session',
        ];

        foreach ($aliases as $route => $callback) {
            register_rest_route(self::NAMESPACE , $route, [
                'methods' => ($callback === 'session' ? WP_REST_Server::READABLE : WP_REST_Server::CREATABLE),
                'callback' => [__CLASS__, $callback],
                'permission_callback' => '__return_true',
            ]);
        }

        // 1. Login (Legacy path kept)
        register_rest_route(self::NAMESPACE , '/auth/login', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'login'],
            'permission_callback' => '__return_true',
        ]);

        // ... (rest of the routes are similar, keeping them for compat but adding the new /session)
        register_rest_route(self::NAMESPACE , '/auth/session', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'session'],
            'permission_callback' => '__return_true',
        ]);

        // ... rest of register_routes (keeping original numbers for reference)
        // 2. Register
        register_rest_route(self::NAMESPACE , '/auth/register', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'register'],
            'permission_callback' => '__return_true',
        ]);

        // 3. Google Login
        register_rest_route(self::NAMESPACE , '/auth/google', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'google_login'],
            'permission_callback' => '__return_true',
        ]);

        // 4. Validate Token
        register_rest_route(self::NAMESPACE , '/auth/validate', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'validate'],
            'permission_callback' => '__return_true',
        ]);

        // 5. Refresh Token
        register_rest_route(self::NAMESPACE , '/auth/refresh', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'refresh'],
            'permission_callback' => '__return_true',
        ]);

        // 6. Get Current User
        register_rest_route(self::NAMESPACE , '/auth/me', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_current_user'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);

        // 7. Logout
        register_rest_route(self::NAMESPACE , '/auth/logout', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'logout'],
            'permission_callback' => '__return_true', // Logout should always be accessible even with expired main token
        ]);

        // 8. Settings
        register_rest_route(self::NAMESPACE , '/settings', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_settings'],
            'permission_callback' => '__return_true',
        ]);

        // 9. Profile
        register_rest_route(self::NAMESPACE , '/profile', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_profile'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);

        register_rest_route(self::NAMESPACE , '/profile', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'update_profile'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);

        // 10. Newsletter
        register_rest_route(self::NAMESPACE , '/newsletter', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_newsletter_status'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);

        register_rest_route(self::NAMESPACE , '/newsletter', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'toggle_newsletter'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);

        // 11. My Orders (WooCommerce, authenticated)
        register_rest_route(self::NAMESPACE , '/orders', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_orders'],
            'permission_callback' => [__CLASS__, 'check_auth'],
            'args' => [
                'limit' => [
                    'type' => 'integer',
                    'default' => 5,
                    'sanitize_callback' => 'absint',
                ],
            ],
        ]);

        // 12. Password Reset
        register_rest_route(self::NAMESPACE , '/auth/password/reset', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'request_reset'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route(self::NAMESPACE , '/auth/password/set', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'set_password'],
            'permission_callback' => '__return_true',
        ]);
    }

    /**
     * Session Check Endpoint
     * GET /session
     */
    public static function session($request)
    {
        $token = self::get_token_from_request($request);

        if (!$token) {
            return rest_ensure_response([
                'authenticated' => false,
                'user' => null,
                'roles' => [],
            ]);
        }

        $decoded = JWT_Manager::validate_token($token);

        if (is_wp_error($decoded)) {
            return rest_ensure_response([
                'authenticated' => false,
                'user' => null,
                'message' => $decoded->get_error_message(),
                'code' => $decoded->get_error_code(),
            ]);
        }

        $user = get_userdata($decoded->data->user_id);

        return rest_ensure_response([
            'authenticated' => true,
            'user' => self::format_user($user),
            'roles' => $user->roles,
            'exp' => $decoded->exp,
        ]);
    }

    // Login endpoint
    public static function login($request)
    {
        $rate_check = Rate_Limiter::check('login');
        if (is_wp_error($rate_check)) {
            return $rate_check;
        }

        $email = $request->get_param('email');
        $password = $request->get_param('password');

        $user = Password_Auth::login($email, $password);

        if (is_wp_error($user)) {
            Rate_Limiter::increment('login');
            Rate_Limiter::log_audit_event('login_failed', 0, '', ['email' => $email, 'error' => $user->get_error_message()]);
            return $user;
        }

        Rate_Limiter::reset('login');

        $token = JWT_Manager::create_token($user);
        $refresh_token = JWT_Manager::create_refresh_token($user);

        Rate_Limiter::log_audit_event('login_success', $user->ID);

        return rest_ensure_response([
            'success' => true,
            'data' => [
                'token' => $token,
                'refresh_token' => $refresh_token,
                'user' => self::format_user($user),
            ],
        ]);
    }

    // Register endpoint
    public static function register($request)
    {
        $rate_check = Rate_Limiter::check('register');
        if (is_wp_error($rate_check)) {
            return $rate_check;
        }

        $email = $request->get_param('email');
        $password = $request->get_param('password');
        $name = $request->get_param('name');

        $user = Password_Auth::register($email, $password, $name);

        if (is_wp_error($user)) {
            Rate_Limiter::increment('register');
            return $user;
        }

        $token = JWT_Manager::create_token($user);
        $refresh_token = JWT_Manager::create_refresh_token($user);

        return rest_ensure_response([
            'success' => true,
            'data' => [
                'token' => $token,
                'refresh_token' => $refresh_token,
                'user' => self::format_user($user),
            ],
        ]);
    }

    // Google login endpoint
    public static function google_login($request)
    {
        $rate_check = Rate_Limiter::check('google_login');
        if (is_wp_error($rate_check)) {
            return $rate_check;
        }

        $id_token = $request->get_param('id_token');

        if (empty($id_token)) {
            return new WP_Error('missing_token', 'ID token is required', ['status' => 400]);
        }

        $user = Google_Provider::login_with_token($id_token);

        if (is_wp_error($user)) {
            Rate_Limiter::increment('google_login');
            return $user;
        }

        $token = JWT_Manager::create_token($user);
        $refresh_token = JWT_Manager::create_refresh_token($user);

        return rest_ensure_response([
            'success' => true,
            'data' => [
                'token' => $token,
                'refresh_token' => $refresh_token,
                'user' => self::format_user($user),
            ],
        ]);
    }

    // Validate token endpoint
    public static function validate($request)
    {
        $token = self::get_token_from_request($request);

        if (!$token) {
            return new WP_Error('no_token', 'No token provided', ['status' => 401]);
        }

        $decoded = JWT_Manager::validate_token($token);

        if (is_wp_error($decoded)) {
            return $decoded;
        }

        $user = get_userdata($decoded->data->user_id);

        return rest_ensure_response([
            'success' => true,
            'data' => [
                'valid' => true,
                'user' => self::format_user($user),
            ],
        ]);
    }

    // Refresh token endpoint
    public static function refresh($request)
    {
        $refresh_token = $request->get_param('refresh_token');
        $user_id = $request->get_param('user_id');

        if (empty($refresh_token) || empty($user_id)) {
            return new WP_Error('missing_params', 'Refresh token and user ID required', ['status' => 400]);
        }

        if (!JWT_Manager::validate_refresh_token($user_id, $refresh_token)) {
            return new WP_Error('invalid_refresh_token', 'Invalid refresh token', ['status' => 401]);
        }

        $user = get_userdata($user_id);

        if (!$user) {
            return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
        }

        $token = JWT_Manager::create_token($user);

        return rest_ensure_response([
            'success' => true,
            'data' => [
                'token' => $token,
            ],
        ]);
    }

    // Get current user endpoint
    public static function get_current_user($request)
    {
        $user_id = self::get_user_id_from_token($request);

        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        $user = get_userdata($user_id);

        return rest_ensure_response([
            'success' => true,
            'data' => self::format_user($user),
        ]);
    }

    // Logout endpoint
    public static function logout($request)
    {
        $user_id = self::get_user_id_from_token($request);
        $refresh_token = $request->get_param('refresh_token');

        if ($user_id) {
            if ($refresh_token) {
                JWT_Manager::revoke_refresh_token($user_id, $refresh_token);
                Rate_Limiter::log_audit_event('logout_single', $user_id, '', ['method' => 'refresh_token']);
            } else {
                JWT_Manager::revoke_user_tokens($user_id);
                Rate_Limiter::log_audit_event('logout_all', $user_id, '', ['method' => 'force_all']);
            }
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    // Password reset request
    public static function request_reset($request)
    {
        $email = $request->get_param('email');

        $result = Password_Auth::request_password_reset($email);

        if (is_wp_error($result)) {
            return $result;
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'If the email exists, a reset link has been sent',
        ]);
    }

    // Set new password
    public static function set_password($request)
    {
        $key = $request->get_param('key');
        $login = $request->get_param('login');
        $password = $request->get_param('password');

        $result = Password_Auth::reset_password($key, $login, $password);

        if (is_wp_error($result)) {
            return $result;
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'Password reset successfully',
        ]);
    }

    // Get public settings
    public static function get_settings()
    {
        $options = get_option('zeneyer_auth_settings', []);

        return rest_ensure_response([
            'success' => true,
            'data' => [
                'google_client_id' => isset($options['google_client_id']) ? $options['google_client_id'] : '',
                'registration_enabled' => get_option('users_can_register'),
                'site_name' => get_bloginfo('name'),
            ],
        ]);
    }

    // Check authentication
    public static function check_auth($request)
    {
        $user_id = self::get_user_id_from_token($request);
        return !empty($user_id);
    }

    // Get token from request
    private static function get_token_from_request($request)
    {
        $auth_header = $request->get_header('authorization');

        if (empty($auth_header)) {
            return null;
        }

        if (preg_match('/Bearer\s+(.*)$/i', $auth_header, $matches)) {
            return $matches[1];
        }

        return null;
    }

    // Get user ID from token
    private static function get_user_id_from_token($request)
    {
        $token = self::get_token_from_request($request);

        if (!$token) {
            return null;
        }

        $decoded = JWT_Manager::validate_token($token);

        if (is_wp_error($decoded)) {
            return null;
        }

        return isset($decoded->data->user_id) ? $decoded->data->user_id : null;
    }

    // Format user data
    private static function format_user($user)
    {
        return [
            'id' => $user->ID,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'roles' => $user->roles,
        ];
    }

    /**
     * Update user profile
     * Saves: real_name, preferred_name, facebook_url, instagram_url, dance_role, gender
     */
    public static function update_profile($request)
    {
        $user_id = self::get_user_id_from_token($request);

        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        // Sanitize and save each field
        $fields = [
            'zen_real_name' => sanitize_text_field($request->get_param('real_name')),
            'zen_preferred_name' => sanitize_text_field($request->get_param('preferred_name')),
            'zen_facebook_url' => esc_url_raw($request->get_param('facebook_url')),
            'zen_instagram_url' => esc_url_raw($request->get_param('instagram_url')),
            'zen_dance_role' => self::sanitize_dance_role($request->get_param('dance_role')),
            'zen_gender' => self::sanitize_gender($request->get_param('gender')),
        ];

        foreach ($fields as $meta_key => $value) {
            if ($value !== null && $value !== '') {
                update_user_meta($user_id, $meta_key, $value);
            } elseif ($value === '') {
                delete_user_meta($user_id, $meta_key);
            }
        }

        // Update display_name if preferred_name is set
        if (!empty($fields['zen_preferred_name'])) {
            wp_update_user([
                'ID' => $user_id,
                'display_name' => $fields['zen_preferred_name'],
            ]);
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => self::get_profile_data($user_id),
        ]);
    }

    /**
     * Get user profile data
     */
    public static function get_profile($request)
    {
        $user_id = self::get_user_id_from_token($request);

        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        return rest_ensure_response([
            'success' => true,
            'data' => self::get_profile_data($user_id),
        ]);
    }

    /**
     * Get profile data for a user
     */
    /**
     * Get current user WooCommerce orders (headless-safe BFF endpoint).
     */
    public static function get_orders($request)
    {
        $user_id = self::get_user_id_from_token($request);

        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        if (!function_exists('wc_get_orders')) {
            return rest_ensure_response([
                'success' => true,
                'data' => [],
            ]);
        }

        $limit = max(1, min(20, (int) $request->get_param('limit')));

        $orders = wc_get_orders([
            'customer_id' => $user_id,
            'limit' => $limit,
            'orderby' => 'date',
            'order' => 'DESC',
            'return' => 'objects',
        ]);

        $payload = [];
        foreach ($orders as $order) {
            $line_items = [];
            foreach ($order->get_items() as $item) {
                $line_items[] = [
                    'name' => (string) $item->get_name(),
                    'quantity' => (int) $item->get_quantity(),
                    'total' => (string) $item->get_total(),
                ];
            }

            $date = $order->get_date_created();
            $payload[] = [
                'id' => (int) $order->get_id(),
                'status' => (string) $order->get_status(),
                'date_created' => $date ? $date->date('c') : '',
                'total' => (string) $order->get_total(),
                'line_items' => $line_items,
            ];
        }

        return rest_ensure_response([
            'success' => true,
            'data' => $payload,
        ]);
    }
    private static function get_profile_data($user_id)
    {
        $user = get_userdata($user_id);

        return [
            'id' => $user_id,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'real_name' => get_user_meta($user_id, 'zen_real_name', true),
            'preferred_name' => get_user_meta($user_id, 'zen_preferred_name', true),
            'facebook_url' => get_user_meta($user_id, 'zen_facebook_url', true),
            'instagram_url' => get_user_meta($user_id, 'zen_instagram_url', true),
            'dance_role' => get_user_meta($user_id, 'zen_dance_role', true) ?: [],
            'gender' => get_user_meta($user_id, 'zen_gender', true),
        ];
    }

    /**
     * Sanitize dance role (array of 'leader' and/or 'follower')
     */
    private static function sanitize_dance_role($roles)
    {
        if (!is_array($roles)) {
            return [];
        }

        $allowed = ['leader', 'follower'];
        return array_values(array_intersect($roles, $allowed));
    }

    /**
     * Sanitize gender field
     */
    private static function sanitize_gender($gender)
    {
        $allowed = ['male', 'female', 'non-binary', ''];
        return in_array($gender, $allowed) ? $gender : '';
    }

    /**
     * Toggle newsletter subscription (MailPoet integration)
     */
    public static function toggle_newsletter($request)
    {
        $user_id = self::get_user_id_from_token($request);

        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        $enabled = (bool) $request->get_param('enabled');
        $user = get_userdata($user_id);

        if (!$user) {
            return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
        }

        // Check if MailPoet is active
        if (!class_exists('\MailPoet\API\API')) {
            // Fallback: save preference in user meta
            update_user_meta($user_id, 'zen_newsletter_subscribed', $enabled ? '1' : '0');

            return rest_ensure_response([
                'success' => true,
                'message' => $enabled ? 'Newsletter preference saved' : 'Newsletter preference removed',
                'subscribed' => $enabled,
                'method' => 'user_meta'
            ]);
        }

        try {
            $mailpoet_api = \MailPoet\API\API::MP('v1');

            // Get or create subscriber
            $subscriber = null;
            try {
                $subscriber = $mailpoet_api->getSubscriber($user->user_email);
            } catch (\Exception $e) {
                // Subscriber doesn't exist, will create if enabling
            }

            // Find "Zen Tribe Newsletter" list
            $lists = $mailpoet_api->getLists();
            $zen_list_id = null;

            foreach ($lists as $list) {
                if (stripos($list['name'], 'Zen Tribe') !== false) {
                    $zen_list_id = $list['id'];
                    break;
                }
            }

            if (!$zen_list_id) {
                // Fallback to user meta if list not found
                update_user_meta($user_id, 'zen_newsletter_subscribed', $enabled ? '1' : '0');

                return rest_ensure_response([
                    'success' => true,
                    'message' => 'Newsletter list not found, preference saved locally',
                    'subscribed' => $enabled,
                    'method' => 'user_meta'
                ]);
            }

            if ($enabled) {
                if (!$subscriber) {
                    // Create new subscriber and add to list
                    $subscriber = $mailpoet_api->addSubscriber([
                        'email' => $user->user_email,
                        'first_name' => $user->first_name ?: $user->display_name,
                        'last_name' => $user->last_name ?: '',
                    ], [$zen_list_id]);
                } else {
                    // Add existing subscriber to list
                    $mailpoet_api->subscribeToList($subscriber['id'], $zen_list_id);
                }
                $message = 'Successfully subscribed to newsletter';
            } else {
                if ($subscriber) {
                    // Remove from list
                    $mailpoet_api->unsubscribeFromList($subscriber['id'], $zen_list_id);
                }
                $message = 'Successfully unsubscribed from newsletter';
            }

            // Also save in user meta for quick access
            update_user_meta($user_id, 'zen_newsletter_subscribed', $enabled ? '1' : '0');

            return rest_ensure_response([
                'success' => true,
                'message' => $message,
                'subscribed' => $enabled,
                'method' => 'mailpoet'
            ]);

        } catch (\Exception $e) {
            // Log error and fallback to user meta
            error_log('[ZenEyer Auth] MailPoet error: ' . $e->getMessage());

            update_user_meta($user_id, 'zen_newsletter_subscribed', $enabled ? '1' : '0');

            return rest_ensure_response([
                'success' => true,
                'message' => 'Newsletter preference saved (MailPoet unavailable)',
                'subscribed' => $enabled,
                'method' => 'user_meta'
            ]);
        }
    }

    /**
     * Get newsletter subscription status
     */
    public static function get_newsletter_status($request)
    {
        $user_id = self::get_user_id_from_token($request);

        if (!$user_id) {
            return new WP_Error('unauthorized', 'Unauthorized', ['status' => 401]);
        }

        $user = get_userdata($user_id);

        if (!$user) {
            return new WP_Error('user_not_found', 'User not found', ['status' => 404]);
        }

        // Quick check from user meta first
        $meta_subscribed = get_user_meta($user_id, 'zen_newsletter_subscribed', true);

        // If MailPoet not available, use meta
        if (!class_exists('\MailPoet\API\API')) {
            return rest_ensure_response([
                'success' => true,
                'subscribed' => $meta_subscribed === '1',
                'method' => 'user_meta'
            ]);
        }

        try {
            $mailpoet_api = \MailPoet\API\API::MP('v1');

            $subscriber = null;
            try {
                $subscriber = $mailpoet_api->getSubscriber($user->user_email);
            } catch (\Exception $e) {
                return rest_ensure_response([
                    'success' => true,
                    'subscribed' => false,
                    'method' => 'mailpoet'
                ]);
            }

            if (!$subscriber) {
                return rest_ensure_response([
                    'success' => true,
                    'subscribed' => false,
                    'method' => 'mailpoet'
                ]);
            }

            // Find Zen Tribe list
            $lists = $mailpoet_api->getLists();
            $zen_list_id = null;

            foreach ($lists as $list) {
                if (stripos($list['name'], 'Zen Tribe') !== false) {
                    $zen_list_id = $list['id'];
                    break;
                }
            }

            if (!$zen_list_id) {
                return rest_ensure_response([
                    'success' => true,
                    'subscribed' => $meta_subscribed === '1',
                    'method' => 'user_meta'
                ]);
            }

            // Check if subscribed to the list
            $subscriptions = $subscriber['subscriptions'] ?? [];
            $is_subscribed = false;

            foreach ($subscriptions as $sub) {
                if (
                    isset($sub['segment_id']) && $sub['segment_id'] == $zen_list_id &&
                    isset($sub['status']) && $sub['status'] === 'subscribed'
                ) {
                    $is_subscribed = true;
                    break;
                }
            }

            // Sync meta with MailPoet status
            update_user_meta($user_id, 'zen_newsletter_subscribed', $is_subscribed ? '1' : '0');

            return rest_ensure_response([
                'success' => true,
                'subscribed' => $is_subscribed,
                'method' => 'mailpoet'
            ]);

        } catch (\Exception $e) {
            error_log('[ZenEyer Auth] MailPoet status check error: ' . $e->getMessage());

            return rest_ensure_response([
                'success' => true,
                'subscribed' => $meta_subscribed === '1',
                'method' => 'user_meta'
            ]);
        }
    }
}

