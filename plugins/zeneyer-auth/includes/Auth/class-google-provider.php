<?php
/**
 * Google OAuth Provider
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.0.0
 */

namespace ZenEyer\Auth\Auth;

use WP_Error;

class Google_Provider {
    
    /**
     * Login with Google ID token
     *
     * @param string $id_token
     * @return \WP_User|WP_Error
     */
    public static function login_with_token($id_token) {
        $options = get_option('zeneyer_auth_settings', []);
        $client_id = isset($options['google_client_id']) ? trim($options['google_client_id']) : '';
        
        if (empty($client_id)) {
            return new WP_Error(
                'google_config_error',
                __('Google Client ID not configured', 'zeneyer-auth'),
                ['status' => 500]
            );
        }
        
        // Validate token with Google
        $user_data = self::validate_google_token($id_token, $client_id);
        
        if (is_wp_error($user_data)) {
            return $user_data;
        }
        
        // Find or create user
        $user = self::find_or_create_user($user_data);
        
        if (is_wp_error($user)) {
            return $user;
        }
        
        // Update Google ID
        update_user_meta($user->ID, 'zeneyer_google_id', $user_data['sub']);
        
        do_action('zeneyer_auth_google_login', $user->ID, $user_data);
        
        return $user;
    }
    
    /**
     * Validate Google ID token
     *
     * @param string $id_token
     * @param string $client_id
     * @return array|WP_Error
     */
    private static function validate_google_token($id_token, $client_id) {
        $response = wp_remote_get(
            'https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($id_token),
            [
                'timeout' => 10,
                'sslverify' => true,
            ]
        );
        
        if (is_wp_error($response)) {
            return new WP_Error(
                'google_connection_error',
                __('Failed to connect to Google', 'zeneyer-auth'),
                ['status' => 502]
            );
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($body['error']) || empty($body['email'])) {
            return new WP_Error(
                'google_invalid_token',
                __('Invalid or expired Google token', 'zeneyer-auth'),
                ['status' => 401]
            );
        }
        
        // Verify token belongs to our app
        if ($body['aud'] !== $client_id) {
            return new WP_Error(
                'google_client_mismatch',
                __('Token does not belong to this application', 'zeneyer-auth'),
                ['status' => 403]
            );
        }
        
        // Verify email is verified (Google returns boolean true or string 'true')
        $email_verified = $body['email_verified'] ?? false;
        if (!$email_verified || ($email_verified !== true && $email_verified !== 'true')) {
            return new WP_Error(
                'google_email_not_verified',
                __('Google email not verified', 'zeneyer-auth'),
                ['status' => 403]
            );
        }
        
        return $body;
    }
    
    /**
     * Find or create WordPress user
     *
     * @param array $google_data
     * @return \WP_User|WP_Error
     */
    private static function find_or_create_user($google_data) {
        $email = sanitize_email($google_data['email']);
        
        // Try to find existing user
        $user = get_user_by('email', $email);
        
        if ($user) {
            return $user;
        }
        
        // Check if registration is allowed
        if (!get_option('users_can_register')) {
            return new WP_Error(
                'registration_disabled',
                __('User registration is disabled', 'zeneyer-auth'),
                ['status' => 403]
            );
        }
        
        // Create new user
        $username = self::generate_username($email);
        $password = wp_generate_password(20, true, true);
        
        $user_id = wp_create_user($username, $password, $email);
        
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        
        // Update user profile
        wp_update_user([
            'ID' => $user_id,
            'display_name' => isset($google_data['name']) ? sanitize_text_field($google_data['name']) : $username,
            'first_name' => isset($google_data['given_name']) ? sanitize_text_field($google_data['given_name']) : '',
            'last_name' => isset($google_data['family_name']) ? sanitize_text_field($google_data['family_name']) : '',
        ]);
        
        // Store Google profile picture
        if (!empty($google_data['picture'])) {
            update_user_meta($user_id, 'zeneyer_google_avatar', esc_url($google_data['picture']));
        }
        
        do_action('zeneyer_auth_user_created_via_google', $user_id, $google_data);
        
        return get_user_by('id', $user_id);
    }
    
    /**
     * Generate unique username from email
     *
     * @param string $email
     * @return string
     */
    private static function generate_username($email) {
        global $wpdb;

        $username = sanitize_user(substr($email, 0, strpos($email, '@')));
        
        // Ensure uniqueness
        if (!username_exists($username)) {
            return $username;
        }

        // Optimization: Fetch all colliding usernames in one query instead of looping
        // This prevents N+1 queries when many users share the same base name
        $query = $wpdb->prepare(
            "SELECT user_login FROM {$wpdb->users} WHERE user_login LIKE %s",
            $wpdb->esc_like($username) . '%'
        );
        
        $taken_usernames = $wpdb->get_col($query);

        if (empty($taken_usernames)) {
            // Fallback (should normally be caught by username_exists check)
            return $username;
        }

        $max_suffix = 0;

        foreach ($taken_usernames as $taken) {
            // Check if it follows the pattern "username" + "number"
            // We only care if it starts with our base username (case-insensitive)
            if (stripos($taken, $username) !== 0) {
                continue;
            }

            $suffix = substr($taken, strlen($username));

            // If it's the base username itself
            if (empty($suffix)) {
                continue;
            }

            // If the suffix is numeric, track the max
            if (ctype_digit($suffix)) {
                $suffix_int = (int) $suffix;
                if ($suffix_int > $max_suffix) {
                    $max_suffix = $suffix_int;
                }
            }
        }
        
        return $username . ($max_suffix + 1);
    }
}
