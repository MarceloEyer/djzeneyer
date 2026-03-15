<?php
/**
 * Username Generator Trait
 *
 * @package ZenEyer_Auth_Pro
 * @since 2.1.1
 */

namespace ZenEyer\Auth\Auth;

trait Username_Generator {

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
            "SELECT user_login FROM {$wpdb->users} WHERE LOWER(user_login) LIKE %s",
            $wpdb->esc_like(strtolower($username)) . '%'
        );

        $taken_usernames = $wpdb->get_col($query);

        $max_suffix = 0;

        foreach ($taken_usernames as $taken) {
            // Note: We don't need to check stripos($taken, $username) because the SQL query
            // already filters for usernames starting with our base string.

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
