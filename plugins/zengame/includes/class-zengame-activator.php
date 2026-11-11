<?php
/**
 * Plugin Activator
 *
 * @package ZenGame
 * @since 1.4.0
 */

namespace ZenEyer\Game;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Activator Class
 * 
 * Runs during plugin activation and deactivation.
 */
class Activator
{
    /**
     * Runs during activation.
     */
    public static function activate()
    {
        // Placeholder for future activation logic (e.g. creating tables if needed)
        \flush_rewrite_rules();
    }

    /**
     * Runs during deactivation.
     * Forcefully wipes engine transients to prevent orphan data.
     */
    public static function deactivate()
    {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s OR option_name LIKE %s",
            '%_transient_djz_gamipress_%', '%_transient_djz_stats_%', '%_transient_timeout_djz_%'
        ));
        \flush_rewrite_rules();
    }
}
