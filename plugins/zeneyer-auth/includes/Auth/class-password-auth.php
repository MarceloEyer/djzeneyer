<?php
/**
 * Password Authentication Provider
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.0.0
 */

namespace ZenEyer\Auth\Auth;

use WP_Error;

class Password_Auth {
    
    /**
     * Login with email and password
     *
     * @param string $email
     * @param string $password
     * @return \WP_User|WP_Error
     */
    public static function login($email, $password) {
        $email = sanitize_email($email);
        $password = trim($password);
        
        if (empty($email) || empty($password)) {
            return new WP_Error(
                'missing_credentials',
                __('Email and password are required', 'zeneyer-auth'),
                ['status' => 400]
            );
        }
        
        // Find user by email
        $user = get_user_by('email', $email);
        
        if (!$user) {
            return new WP_Error(
                'invalid_credentials',
                __('Invalid email or password', 'zeneyer-auth'),
                ['status' => 401]
            );
        }
        
        // Verify password
        if (!wp_check_password($password, $user->user_pass, $user->ID)) {
            do_action('zeneyer_auth_failed_login', $user->ID, $email);
            
            return new WP_Error(
                'invalid_credentials',
                __('Invalid email or password', 'zeneyer-auth'),
                ['status' => 401]
            );
        }
        
        do_action('zeneyer_auth_successful_login', $user->ID);
        
        return $user;
    }
    
    /**
     * Register new user
     *
     * @param string $email
     * @param string $password
     * @param string $name
     * @return \WP_User|WP_Error
     */
    public static function register($email, $password, $name = '') {
        $email = sanitize_email($email);
        $password = trim($password);
        $name = sanitize_text_field($name);
        
        // Validate inputs
        if (empty($email) || empty($password)) {
            return new WP_Error(
                'missing_fields',
                __('Email and password are required', 'zeneyer-auth'),
                ['status' => 400]
            );
        }
        
        if (!is_email($email)) {
            return new WP_Error(
                'invalid_email',
                __('Invalid email address', 'zeneyer-auth'),
                ['status' => 400]
            );
        }
        
        // Check if registration is allowed
        if (!get_option('users_can_register')) {
            return new WP_Error(
                'registration_disabled',
                __('User registration is disabled', 'zeneyer-auth'),
                ['status' => 403]
            );
        }
        
        // Check if email already exists
        if (email_exists($email)) {
            return new WP_Error(
                'email_exists',
                __('This email is already registered', 'zeneyer-auth'),
                ['status' => 409]
            );
        }
        
        // Validate password strength
        $password_check = self::validate_password_strength($password);
        if (is_wp_error($password_check)) {
            return $password_check;
        }
        
        // Generate username
        $username = self::generate_username($email);
        
        // Create user
        $user_id = wp_create_user($username, $password, $email);
        
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        
        // Update display name
        if (!empty($name)) {
            wp_update_user([
                'ID' => $user_id,
                'display_name' => $name,
            ]);
        }
        
        do_action('zeneyer_auth_user_registered', $user_id, $email);
        
        return get_user_by('id', $user_id);
    }
    
    /**
     * Request password reset
     *
     * @param string $email
     * @return bool|WP_Error
     */
    public static function request_password_reset($email) {
        $email = sanitize_email($email);
        
        if (empty($email) || !is_email($email)) {
            return new WP_Error(
                'invalid_email',
                __('Invalid email address', 'zeneyer-auth'),
                ['status' => 400]
            );
        }
        
        $user = get_user_by('email', $email);
        
        if (!$user) {
            // Return success even if user doesn't exist (security)
            return true;
        }
        
        // Generate reset key
        $key = get_password_reset_key($user);
        
        if (is_wp_error($key)) {
            return $key;
        }
        
        // Send email
        $reset_url = add_query_arg([
            'action' => 'reset_password',
            'key' => $key,
            'login' => rawurlencode($user->user_login),
        ], wp_login_url());
        
        $message = sprintf(
            __('Someone requested a password reset for your account. If this was you, click the link below:', 'zeneyer-auth') . "\n\n%s\n\n" .
            __('If you did not request this, please ignore this email.', 'zeneyer-auth'),
            $reset_url
        );
        
        $sent = wp_mail(
            $email,
            __('Password Reset Request', 'zeneyer-auth'),
            $message
        );
        
        if (!$sent) {
            return new WP_Error(
                'email_failed',
                __('Failed to send reset email', 'zeneyer-auth'),
                ['status' => 500]
            );
        }
        
        do_action('zeneyer_auth_password_reset_requested', $user->ID);
        
        return true;
    }
    
    /**
     * Reset password with key
     *
     * @param string $key
     * @param string $login
     * @param string $new_password
     * @return bool|WP_Error
     */
    public static function reset_password($key, $login, $new_password) {
        $user = check_password_reset_key($key, $login);
        
        if (is_wp_error($user)) {
            return new WP_Error(
                'invalid_reset_key',
                __('Invalid or expired reset key', 'zeneyer-auth'),
                ['status' => 400]
            );
        }
        
        // Validate new password
        $password_check = self::validate_password_strength($new_password);
        if (is_wp_error($password_check)) {
            return $password_check;
        }
        
        // Reset password
        reset_password($user, $new_password);
        
        do_action('zeneyer_auth_password_reset', $user->ID);
        
        return true;
    }
    
    /**
     * Validate password strength with complexity requirements
     *
     * @param string $password
     * @return bool|WP_Error
     */
    private static function validate_password_strength($password) {
        $min_length = apply_filters('zeneyer_auth_min_password_length', 8);

        // Length check
        if (strlen($password) < $min_length) {
            return new WP_Error(
                'weak_password',
                sprintf(
                    __('Password must be at least %d characters long', 'zeneyer-auth'),
                    $min_length
                ),
                ['status' => 400]
            );
        }

        // Complexity requirements (can be disabled via filter)
        $require_complexity = apply_filters('zeneyer_auth_require_password_complexity', true);

        if ($require_complexity) {
            $has_lowercase = preg_match('/[a-z]/', $password);
            $has_uppercase = preg_match('/[A-Z]/', $password);
            $has_number = preg_match('/[0-9]/', $password);
            $has_special = preg_match('/[^a-zA-Z0-9]/', $password);

            $complexity_count = $has_lowercase + $has_uppercase + $has_number + $has_special;

            // Require at least 3 out of 4 complexity types
            if ($complexity_count < 3) {
                return new WP_Error(
                    'weak_password',
                    __('Password must contain at least 3 of the following: lowercase letters, uppercase letters, numbers, special characters', 'zeneyer-auth'),
                    ['status' => 400]
                );
            }
        }

        return true;
    }
    
    /**
     * Generate unique username from email
     *
     * @param string $email
     * @return string
     */
    private static function generate_username($email) {
        $username = sanitize_user(substr($email, 0, strpos($email, '@')));
        
        $original = $username;
        $counter = 1;
        
        while (username_exists($username)) {
            $username = $original . $counter;
            $counter++;
        }
        
        return $username;
    }
}
