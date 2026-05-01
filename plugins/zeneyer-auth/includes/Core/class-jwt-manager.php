<?php
/**
 * JWT Manager - Secure token generation and validation
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.0.0
 */

namespace ZenEyer\Auth\Core;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use WP_Error;

if (!defined('ABSPATH')) {
    exit;
}

class JWT_Manager
{

    const ALGORITHM = 'HS256';
    const DEFAULT_EXPIRATION = 60; // 60 minutes (1 hour) for access tokens

    /**
     * Create JWT token for user
     *
     * @param \WP_User $user
     * @return string|WP_Error
     */
    public static function create_token($user)
    {
        $secret_key = self::get_secret_key();

        if (is_wp_error($secret_key)) {
            return $secret_key;
        }

        $issued_at = time();
        $expiration_minutes = self::get_expiration_minutes();
        $expiration = $issued_at + (60 * $expiration_minutes);

        $payload = [
            'iss' => (string) get_bloginfo('url'),
            'iat' => $issued_at,
            'nbf' => $issued_at,
            'exp' => $expiration,
            'data' => [
                'user_id' => $user->ID,
                'email' => $user->user_email,
                'display_name' => $user->display_name,
                'roles' => $user->roles,
            ],
        ];

        $payload = apply_filters('zeneyer_auth_jwt_payload', $payload, $user);

        try {
            $token = JWT::encode($payload, $secret_key, self::ALGORITHM);

            // Log token creation
            do_action('zeneyer_auth_token_created', $user->ID, $expiration);

            return $token;
        } catch (\Exception $e) {
            return new WP_Error(
                'jwt_generation_error',
                __('Failed to generate token', 'zeneyer-auth'),
                ['status' => 500, 'error' => $e->getMessage()]
            );
        }
    }

    /**
     * Validate JWT token
     *
     * @param string $token
     * @return object|WP_Error
     */
    public static function validate_token($token)
    {
        $secret_key = self::get_secret_key();

        if (is_wp_error($secret_key)) {
            return $secret_key;
        }

        try {
            // Add leeway to account for clock skew
            JWT::$leeway = 60;

            $decoded = JWT::decode($token, new Key($secret_key, self::ALGORITHM));

            // 1. Verify Issuer (iss)
            $expected_iss = (string) get_bloginfo('url');
            if (!isset($decoded->iss) || $decoded->iss !== $expected_iss) {
                return new WP_Error(
                    'jwt_invalid_issuer',
                    __('Invalid token issuer', 'zeneyer-auth'),
                    ['status' => 401]
                );
            }

            // 2. Verify Client/Audience (aud) - Optional but recommended if we start using it
            // For now, we only check if it exists if we set it in create_token

            // 3. Verify user still exists
            if (!isset($decoded->data->user_id)) {
                return new WP_Error(
                    'jwt_invalid_payload',
                    __('Invalid token payload', 'zeneyer-auth'),
                    ['status' => 401]
                );
            }

            $user = get_userdata($decoded->data->user_id);

            if (!$user) {
                return new WP_Error(
                    'jwt_user_not_found',
                    __('User no longer exists', 'zeneyer-auth'),
                    ['status' => 401]
                );
            }

            // 4. Token Revocation Check (Check if password was changed after token issued)
            $last_password_change = get_user_meta($user->ID, 'last_password_change', true);
            if ($last_password_change && $decoded->iat < $last_password_change) {
                return new WP_Error(
                    'jwt_revoked',
                    __('Token has been revoked due to password change', 'zeneyer-auth'),
                    ['status' => 401]
                );
            }

            // Log successful validation
            do_action('zeneyer_auth_token_validated', $user->ID);

            return $decoded;

        } catch (\Firebase\JWT\ExpiredException $e) {
            return new WP_Error(
                'jwt_expired',
                __('Token has expired. Please login again.', 'zeneyer-auth'),
                ['status' => 401]
            );
        } catch (\Firebase\JWT\SignatureInvalidException $e) {
            return new WP_Error(
                'jwt_invalid_signature',
                __('Invalid token signature', 'zeneyer-auth'),
                ['status' => 401]
            );
        } catch (\Exception $e) {
            return new WP_Error(
                'jwt_invalid_token',
                __('Invalid or malformed token', 'zeneyer-auth'),
                ['status' => 401, 'error' => $e->getMessage()]
            );
        }
    }

    /**
     * Create refresh token and store in multi-session array
     *
     * @param \WP_User $user
     * @return string|WP_Error
     */
    public static function create_refresh_token($user)
    {
        $token = wp_generate_password(64, false);
        $expiration = time() + (DAY_IN_SECONDS * 30); // 30 days

        $sessions = get_user_meta($user->ID, 'zeneyer_sessions', true);
        if (!is_array($sessions)) {
            $sessions = [];
        }

        // Limit active sessions (Pareto: 10 sessions)
        if (count($sessions) >= 10) {
            array_shift($sessions); // Remove oldest
        }

        $token_hash = wp_hash($token);
        $sessions[] = [
            'token_hash' => $token_hash,
            'expires' => $expiration,
            'created_at' => time(),
            'last_used_at' => time(),
            'ip' => self::get_client_ip(),
            'user_agent' => isset($_SERVER['HTTP_USER_AGENT']) ? sanitize_text_field($_SERVER['HTTP_USER_AGENT']) : 'Unknown',
        ];

        update_user_meta($user->ID, 'zeneyer_sessions', $sessions);

        // Backward compatibility (remove soon)
        update_user_meta($user->ID, 'zeneyer_refresh_token', [
            'token' => $token_hash,
            'expires' => $expiration,
        ]);

        return $token;
    }

    /**
     * Validate refresh token against multi-session array
     *
     * @param int $user_id
     * @param string $token
     * @return bool
     */
    public static function validate_refresh_token($user_id, $token)
    {
        $sessions = get_user_meta($user_id, 'zeneyer_sessions', true);

        if (!is_array($sessions)) {
            // Fallback for old tokens
            $stored = get_user_meta($user_id, 'zeneyer_refresh_token', true);
            if (!$stored || !isset($stored['token'], $stored['expires'])) {
                return false;
            }
            if ($stored['expires'] < time()) {
                delete_user_meta($user_id, 'zeneyer_refresh_token');
                return false;
            }
            return wp_hash($token) === $stored['token'];
        }

        $token_hash = wp_hash($token);
        $found = false;
        $updated_sessions = [];

        foreach ($sessions as $session) {
            // Clean up expired sessions while iterating
            if ($session['expires'] < time()) {
                continue;
            }

            if ($session['token_hash'] === $token_hash) {
                $session['last_used_at'] = time();
                $session['ip'] = self::get_client_ip();
                $found = true;
            }
            $updated_sessions[] = $session;
        }

        update_user_meta($user_id, 'zeneyer_sessions', $updated_sessions);
        return $found;
    }

    /**
     * Revoke specifically one refresh token
     */
    public static function revoke_refresh_token($user_id, $token)
    {
        $sessions = get_user_meta($user_id, 'zeneyer_sessions', true);
        if (!is_array($sessions))
            return;

        $token_hash = wp_hash($token);
        $updated_sessions = array_filter($sessions, function ($s) use ($token_hash) {
            return $s['token_hash'] !== $token_hash;
        });

        update_user_meta($user_id, 'zeneyer_sessions', array_values($updated_sessions));
    }

    /**
     * Get client IP (Helper for session tracking)
     */
    private static function get_client_ip()
    {
        if (!empty($_SERVER['HTTP_CF_CONNECTING_IP']))
            return $_SERVER['HTTP_CF_CONNECTING_IP'];
        if (!empty($_SERVER['HTTP_X_REAL_IP']))
            return $_SERVER['HTTP_X_REAL_IP'];
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    /**
     * Get secret key with fallback
     *
     * @return string|WP_Error
     */
    private static function get_secret_key()
    {
        // Priority 1: canonical wp-config.php constant
        if (defined('ZENEYER_JWT_SECRET') && !empty(ZENEYER_JWT_SECRET)) {
            return ZENEYER_JWT_SECRET;
        }

        // Priority 2: legacy compatibility aliases
        if (defined('JWT_AUTH_SECRET_KEY') && !empty(JWT_AUTH_SECRET_KEY)) {
            return JWT_AUTH_SECRET_KEY;
        }

        if (defined('SIMPLE_JWT_PRIVATE_KEY') && !empty(SIMPLE_JWT_PRIVATE_KEY)) {
            return SIMPLE_JWT_PRIVATE_KEY;
        }

        // Priority 3: Database option
        $secret = get_option('zeneyer_auth_jwt_secret');

        if (!empty($secret)) {
            return $secret;
        }

        // Priority 4: Generate new secret
        $new_secret = wp_generate_password(64, true, true);
        update_option('zeneyer_auth_jwt_secret', $new_secret);

        return $new_secret;
    }

    /**
     * Get token expiration days
     *
     * @return int
     */
    private static function get_expiration_minutes()
    {
        $options = get_option('zeneyer_auth_settings', []);
        $minutes = isset($options['token_expiration']) ? (int) $options['token_expiration'] : self::DEFAULT_EXPIRATION;

        return apply_filters('zeneyer_auth_token_expiration_minutes', $minutes);
    }

    /**
     * Revoke all tokens for user
     *
     * @param int $user_id
     */
    public static function revoke_user_tokens($user_id)
    {
        delete_user_meta($user_id, 'zeneyer_sessions');
        delete_user_meta($user_id, 'zeneyer_refresh_token');
        do_action('zeneyer_auth_tokens_revoked', $user_id);
    }

    /**
     * Revoke ALL refresh tokens for ALL users in the system
     * 
     * @return int Number of users affected (rows deleted from meta table)
     */
    public static function revoke_all_system_sessions()
    {
        global $wpdb;

        $count = $wpdb->query($wpdb->prepare(
            "DELETE FROM $wpdb->usermeta WHERE meta_key IN (%s, %s)",
            'zeneyer_sessions',
            'zeneyer_refresh_token'
        ));

        if (false === $count) {
            return false;
        }

        return (int) $count;
    }
}
