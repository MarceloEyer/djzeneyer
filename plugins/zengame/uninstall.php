<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package ZenGame
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

// 1. Delete Settings
delete_option('zengame_cache_ttl');
delete_option('zengame_last_purge');

// 2. Clean Sweep of Transients
global $wpdb;
$wpdb->query($wpdb->prepare(
    "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s OR option_name LIKE %s",
    '%_transient_djz_gamipress_%', '%_transient_djz_stats_%', '%_transient_timeout_djz_%'
));
