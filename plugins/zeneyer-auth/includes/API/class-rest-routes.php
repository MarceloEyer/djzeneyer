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

class Rest_Routes {
    
    const NAMESPACE = 'zeneyer-auth/v1';
    
    public static function register_routes() {
        // 1. Login
        register_rest_route(self::NAMESPACE, '/auth/login', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'login'],
            'permission_callback' => '__return_true',
        ]);
        
        // 2. Register
        register_rest_route(self::NAMESPACE, '/auth/register', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'register'],
            'permission_callback' => '__return_true',
        ]);
        
        // 3. Google Login
        register_rest_route(self::NAMESPACE, '/auth/google', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'google_login'],
            'permission_callback' => '__return_true',
        ]);
        
        // 4. Validate Token
        register_rest_route(self::NAMESPACE, '/auth/validate', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'validate'],
            'permission_callback' => '__return_true',
        ]);
        
        // 5. Refresh Token
        register_rest_route(self::NAMESPACE, '/auth/refresh', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'refresh'],
            'permission_callback' => '__return_true',
        ]);
        
        // 6. Get Current User
        register_rest_route(self::NAMESPACE, '/auth/me', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_current_user'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);
        
        // 7. Logout
        register_rest_route(self::NAMESPACE, '/auth/logout', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'logout'],
            'permission_callback' => [__CLASS__, 'check_auth'],
        ]);
        
        // 8. Password Reset Request
        register_rest_route(self::NAMESPACE, '/auth/password/reset', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'request_reset'],
            'permission_callback' => '__return_true',
        ]);
        
        // 9. Password Reset Set
        register_rest_route(self::NAMESPACE, '/auth/password/set', [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => [__CLASS__, 'set_password'],
            'permission_callback' => '__return_true',
        ]);
        
        // 10. Public Settings
        register_rest_route(self::NAMESPACE, '/settings', [
            'methods' => WP_REST_Server::READABLE,
            'callback' => [__CLASS__, 'get_settings'],
            'permission_callback' => '__return_true',
        ]);
    }
    
    // Login endpoint
    public static function login($request) {
        $rate_check = Rate_Limiter::check('login');
        if (is_wp_error($rate_check)) {
            return $rate_check;
        }
        
        $email = $request->get_param('email');
        $password = $request->get_param('password');
        
        $user = Password_Auth::login($email, $password);
        
        if (is_wp_error($user)) {
            Rate_Limiter::increment('login');
            return $user;
        }
        
        Rate_Limiter::reset('login');
        
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
    
    // Register endpoint
    public static function register($request) {
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
    public static function google_login($request) {
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
    public static function validate($request) {
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
    public static function refresh($request) {
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
    public static function get_current_user($request) {
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
    public static function logout($request) {
        $user_id = self::get_user_id_from_token($request);
        
        if ($user_id) {
            JWT_Manager::revoke_user_tokens($user_id);
        }
        
        return rest_ensure_response([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
    
    // Password reset request
    public static function request_reset($request) {
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
    public static function set_password($request) {
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
    public static function get_settings() {
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
    public static function check_auth($request) {
        $user_id = self::get_user_id_from_token($request);
        return !empty($user_id);
    }
    
    // Get token from request
    private static function get_token_from_request($request) {
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
    private static function get_user_id_from_token($request) {
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
    private static function format_user($user) {
        return [
            'id' => $user->ID,
            'email' => $user->user_email,
            'display_name' => $user->display_name,
            'roles' => $user->roles,
        ];
    }
}
