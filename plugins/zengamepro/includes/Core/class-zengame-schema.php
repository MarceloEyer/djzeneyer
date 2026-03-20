<?php
/**
 * ZenGame Schema Engine
 * Creates custom tables for the point economy.
 */
namespace ZenEyer\GamePro\Core;

if (!defined('ABSPATH')) {
    die;
}

class Schema {

    /**
     * Create the custom logs table
     */
    public static function create_tables() {
        global $wpdb;

        $table_name = $wpdb->prefix . 'zengame_logs';
        $charset_collate = $wpdb->get_charset_collate();

        // This schema is inspired by GamiPress but hyper-optimized
        // It acts as an immutable ledger for the point economy.
        $sql = "CREATE TABLE $table_name (
            id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
            user_id bigint(20) unsigned NOT NULL,
            action varchar(50) NOT NULL,
            points int(11) NOT NULL,
            reference_id bigint(20) unsigned DEFAULT 0,
            reference_type varchar(50) DEFAULT '',
            description text DEFAULT '',
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY user_id (user_id),
            KEY action (action)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        \dbDelta($sql);

        // Save database version for future migrations
        \update_option('zengamepro_db_version', ZENGAMEPRO_VERSION);
    }
}
