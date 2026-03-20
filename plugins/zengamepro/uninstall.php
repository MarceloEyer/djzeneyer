<?php
/**
 * ZenGame Pro Uninstall
 * Wipes custom tables and options on plugin deletion.
 */

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

global $wpdb;

// 1. Delete Custom Tables
$table_name = $wpdb->prefix . 'zengame_logs';
$wpdb->query("DROP TABLE IF EXISTS $table_name");

// 2. Delete Plugin Options
\delete_option('zengamepro_db_version');
\delete_option('zengamepro_last_purge');

// 3. Delete Transients
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '%_transient_djz_pro_%'");
$wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '%_transient_timeout_djz_pro_%'");

// 4. (Optional) Cleanup User Meta - Decided to keep user points unless requested otherwise
// \delete_metadata('user', 0, 'zengame_points_balance', '', true);
