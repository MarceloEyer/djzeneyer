<?php
/**
 * Plugin Activator for ZenGame Pro
 *
 * @package ZenGamePro
 * @since 1.4.0
 */

namespace ZenEyer\GamePro;

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
        // Require Schema
        require_once ZENGAMEPRO_PATH . 'includes/Core/class-zengame-schema.php';
        Core\Schema::create_tables();

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
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
            '%_transient_djz_zengame_%', '%_transient_timeout_djz_zengame_%'
        ));
        \flush_rewrite_rules();
    }
}
