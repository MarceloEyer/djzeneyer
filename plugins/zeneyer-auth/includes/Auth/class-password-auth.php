<?php
/**
 * Password Authentication Provider
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.1.0
 */

namespace ZenEyer\Auth\Auth;

use WP_Error;

if (!defined('ABSPATH')) {
    exit;
}

class Password_Auth {
    use Username_Generator;
    
    /**
     * Login with email and password
     *
     * @param string $email
     * @param string $password
     * @return \WP_User|WP_Error
     */
    public static function login($email, $password) {
        $identifier = sanitize_text_field($email);
        $password = trim($password);
        
        if (empty($identifier) || empty($password)) {
            return new WP_Error(
                'missing_credentials',
                __('Username or email and password are required', 'zeneyer-auth'),
                ['status' => 400]
            );
        }

        // 🛡️ Rate Limiting Check
        $rate_limit = \ZenEyer\Auth\Core\Rate_Limiter::check('login');
        if (is_wp_error($rate_limit)) {
            return $rate_limit;
        }
        
        // Find user by email or username. Invited private-music recipients may not have an email yet.
        $user = is_email($identifier)
            ? get_user_by('email', sanitize_email($identifier))
            : get_user_by('login', sanitize_user($identifier, true));
        
        if (!$user) {
            \ZenEyer\Auth\Core\Rate_Limiter::increment('login');
            return new WP_Error(
                'invalid_credentials',
                __('Invalid username/email or password', 'zeneyer-auth'),
                ['status' => 401]
            );
        }
        
        // Verify password
        if (!wp_check_password($password, $user->user_pass, $user->ID)) {
            \ZenEyer\Auth\Core\Rate_Limiter::increment('login');
            \ZenEyer\Auth\Core\Rate_Limiter::log_audit_event('failed_login', $user->ID, '', ['login' => $identifier]);
            
            do_action('zeneyer_auth_failed_login', $user->ID, $identifier);
            
            return new WP_Error(
                'invalid_credentials',
                __('Invalid username/email or password', 'zeneyer-auth'),
                ['status' => 401]
            );
        }

        $authenticated = apply_filters('authenticate', $user, $user->user_login, $password);
        if (is_wp_error($authenticated)) {
            return $authenticated;
        }
        
        // Success: Reset rate limit
        \ZenEyer\Auth\Core\Rate_Limiter::reset('login');
        \ZenEyer\Auth\Core\Rate_Limiter::log_audit_event('successful_login', $user->ID);

        // Trigger standard WP login hook for GamiPress and other plugins
        do_action('wp_login', $user->user_login, $user);

        do_action('zeneyer_auth_successful_login', $user->ID);
        
        return $user;
    }
    
    /**
     * Register new user with Turnstile Security
     *
     * @param string $email
     * @param string $password
     * @param string $name
     * @param string $turnstile_token
     * @return \WP_User|WP_Error
     */
    public static function register($email, $password, $name = '', $turnstile_token = '') {
        $captcha_validated = false;

        // --- 1. SEGURANÇA ANTI-BOT (TURNSTILE) ---
        // Apenas valida em requisições REST (protege contra bots, mas libera admins no painel)
        if ( defined('REST_REQUEST') && REST_REQUEST ) {
            $captcha = self::verify_turnstile($turnstile_token);
            if ( is_wp_error($captcha) ) {
                return $captcha;
            }
            $captcha_validated = true;
        }
        // --- FIM DA SEGURANÇA ---

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
        // Only registrations that passed Turnstile (REST) may cross the Security Shield;
        // the validated window lasts exactly as long as the creation callback.
        $create_user = static function () use ($username, $password, $email) {
            return wp_create_user($username, $password, $email);
        };
        $user_id = $captcha_validated
            ? \ZenEyer\Auth\Core\Security_Shield::with_validated_registration($create_user)
            : $create_user();

        
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
     * Validate a Cloudflare Turnstile token.
     *
     * @param mixed $turnstile_token
     * @return true|WP_Error
     */
    private static function verify_turnstile($turnstile_token) {
        $turnstile_token = is_string($turnstile_token) ? sanitize_text_field($turnstile_token) : '';

        // Chave secreta no wp-config.php
        $secret_key = defined('ZEN_TURNSTILE_SECRET_KEY') ? ZEN_TURNSTILE_SECRET_KEY : '';

        if ( empty($secret_key) ) {
            return new WP_Error('config_error', __('Server security configuration error (missing key).', 'zeneyer-auth'), ['status' => 500]);
        }

        if ( empty($turnstile_token) ) {
            return new WP_Error('missing_captcha', __('Security verification is required.', 'zeneyer-auth'), ['status' => 403]);
        }

        $client_ip = \ZenEyer\Auth\Core\Client_IP::get();
        $client_ip = $client_ip === '0.0.0.0' ? '' : $client_ip;

        $response = wp_remote_post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'body' => [
                'secret'   => $secret_key,
                'response' => $turnstile_token,
                'remoteip' => $client_ip,
            ],
        ]);

        if ( is_wp_error($response) ) {
            return new WP_Error('captcha_error', __('Could not reach the verification server.', 'zeneyer-auth'), ['status' => 500]);
        }

        $result = json_decode(wp_remote_retrieve_body($response));

        if ( ! is_object($result) || empty($result->success) ) {
            return new WP_Error('invalid_captcha', __('Security verification failed. Please try again.', 'zeneyer-auth'), ['status' => 403]);
        }

        return true;
    }

    /**
     * Frontend URL that receives the reset/activation key (same page for every flow).
     *
     * @param \WP_User $user
     * @param string   $key
     * @return string
     */
    public static function build_reset_url($user, $key) {
        $base = apply_filters('zeneyer_auth_reset_url', home_url('/reset-password/'), $user);

        return add_query_arg([
            'action' => 'reset_password',
            'key'    => $key,
            'login'  => rawurlencode($user->user_login),
        ], $base);
    }

    /**
     * Whether registration answers identically for new and existing e-mails.
     * Enable with define('ZENEYER_AUTH_UNIFORM_REGISTRATION', true) or the filter.
     */
    public static function uniform_registration_enabled() {
        $enabled = defined('ZENEYER_AUTH_UNIFORM_REGISTRATION') && ZENEYER_AUTH_UNIFORM_REGISTRATION;

        return (bool) apply_filters('zeneyer_auth_uniform_registration', $enabled);
    }

    /**
     * Registration without account enumeration.
     *
     * Always returns true on valid input: a new e-mail gets an account (random
     * password) plus an activation link, an existing e-mail gets a notice with a
     * reset link. Nobody is logged in; the owner of the mailbox sets the password.
     *
     * @return true|WP_Error
     */
    public static function register_pending($email, $password, $name = '', $turnstile_token = '') {
        if ( defined('REST_REQUEST') && REST_REQUEST ) {
            $captcha = self::verify_turnstile($turnstile_token);
            if ( is_wp_error($captcha) ) {
                return $captcha;
            }
        }

        $email    = sanitize_email($email);
        $password = trim((string) $password);
        $name     = sanitize_text_field($name);

        if ( empty($email) || empty($password) ) {
            return new WP_Error('missing_fields', __('Email and password are required', 'zeneyer-auth'), ['status' => 400]);
        }

        if ( ! is_email($email) ) {
            return new WP_Error('invalid_email', __('Invalid email address', 'zeneyer-auth'), ['status' => 400]);
        }

        if ( ! get_option('users_can_register') ) {
            return new WP_Error('registration_disabled', __('User registration is disabled', 'zeneyer-auth'), ['status' => 403]);
        }

        $strength = self::validate_password_strength($password);
        if ( is_wp_error($strength) ) {
            return $strength;
        }

        $existing = get_user_by('email', $email);

        if ( $existing ) {
            $key = get_password_reset_key($existing);
            if ( ! is_wp_error($key) ) {
                wp_mail(
                    $email,
                    __('Your account already exists', 'zeneyer-auth'),
                    sprintf(
                        __('Someone tried to create an account with this e-mail, but you already have one. If it was you, set a new password here:', 'zeneyer-auth') . "\n\n%s\n\n" .
                        __('If it was not you, ignore this message.', 'zeneyer-auth'),
                        self::build_reset_url($existing, $key)
                    )
                );
            }
            return true;
        }

        $username = self::generate_username($email);
        $create   = static function () use ($username, $email) {
            return wp_create_user($username, wp_generate_password(32, true, true), $email);
        };
        $user_id = \ZenEyer\Auth\Core\Security_Shield::with_validated_registration($create);

        if ( is_wp_error($user_id) ) {
            // Do not reveal why (race with another registration, reserved name, ...).
            return true;
        }

        if ( ! empty($name) ) {
            wp_update_user(['ID' => $user_id, 'display_name' => $name]);
        }

        $user = get_user_by('id', $user_id);
        $key  = $user ? get_password_reset_key($user) : null;

        if ( $user && ! is_wp_error($key) ) {
            wp_mail(
                $email,
                __('Activate your account', 'zeneyer-auth'),
                sprintf(
                    __('Welcome! Open the link below to choose your password and activate your account:', 'zeneyer-auth') . "\n\n%s\n\n" .
                    __('If you did not request this, ignore this message.', 'zeneyer-auth'),
                    self::build_reset_url($user, $key)
                )
            );
        }

        do_action('zeneyer_auth_user_registered', $user_id, $email);

        return true;
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
        $reset_url = self::build_reset_url($user, $key);
        
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

        // 🛡️ Invalidate all existing JWT tokens by updating password change timestamp
        update_user_meta($user->ID, 'last_password_change', time());
        
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
    
}
