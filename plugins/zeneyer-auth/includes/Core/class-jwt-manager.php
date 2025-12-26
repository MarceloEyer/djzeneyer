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

class JWT_Manager {
    
    const ALGORITHM = 'HS256';
    const DEFAULT_EXPIRATION = 7; // days
    
    /**
     * Create JWT token for user
     *
     * @param \WP_User $user
     * @return string|WP_Error
     */
    public static function create_token($user) {
        $secret_key = self::get_secret_key();
        
        if (is_wp_error($secret_key)) {
            return $secret_key;
        }
        
        $issued_at = time();
        $expiration_days = self::get_expiration_days();
        $expiration = $issued_at + (DAY_IN_SECONDS * $expiration_days);
        
        $payload = [
            'iss' => get_bloginfo('url'),
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
    public static function validate_token($token) {
        $secret_key = self::get_secret_key();
        
        if (is_wp_error($secret_key)) {
            return $secret_key;
        }
        
        try {
            $decoded = JWT::decode($token, new Key($secret_key, self::ALGORITHM));
            
            // Verify user still exists
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
     * Create refresh token
     *
     * @param \WP_User $user
     * @return string|WP_Error
     */
    public static function create_refresh_token($user) {
        $token = wp_generate_password(64, false);
        $expiration = time() + (DAY_IN_SECONDS * 30); // 30 days
        
        update_user_meta($user->ID, 'zeneyer_refresh_token', [
            'token' => wp_hash($token),
            'expires' => $expiration,
        ]);
        
        return $token;
    }
    
    /**
     * Validate refresh token
     *
     * @param int $user_id
     * @param string $token
     * @return bool
     */
    public static function validate_refresh_token($user_id, $token) {
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
    
    /**
     * Get secret key with fallback
     *
     * @return string|WP_Error
     */
    private static function get_secret_key() {
        // Priority 1: wp-config.php constant
        if (defined('ZENEYER_JWT_SECRET') && !empty(ZENEYER_JWT_SECRET)) {
            return ZENEYER_JWT_SECRET;
        }
        
        // Priority 2: Database option
        $secret = get_option('zeneyer_auth_jwt_secret');
        
        if (!empty($secret)) {
            return $secret;
        }
        
        // Priority 3: Generate new secret
        $new_secret = wp_generate_password(64, true, true);
        update_option('zeneyer_auth_jwt_secret', $new_secret);
        
        return $new_secret;
    }
    
    /**
     * Get token expiration days
     *
     * @return int
     */
    private static function get_expiration_days() {
        $options = get_option('zeneyer_auth_settings', []);
        $days = isset($options['token_expiration']) ? (int) $options['token_expiration'] : self::DEFAULT_EXPIRATION;
        
        return apply_filters('zeneyer_auth_token_expiration_days', $days);
    }
    
    /**
     * Revoke all tokens for user
     *
     * @param int $user_id
     */
    public static function revoke_user_tokens($user_id) {
        delete_user_meta($user_id, 'zeneyer_refresh_token');
        do_action('zeneyer_auth_tokens_revoked', $user_id);
    }
}
