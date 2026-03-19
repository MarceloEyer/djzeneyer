<?php
/**
 * 6.9.4 Upgrades
 *
 * @package     GamiPress\Admin\Upgrades\6.9.4
 * @since       6.9.4
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Return 6.9.4 as last required upgrade
 *
 * @return string
 */
function gamipress_694_is_last_required_upgrade() {

    return '6.9.4';

}
add_filter( 'gamipress_get_last_required_upgrade', 'gamipress_694_is_last_required_upgrade', 694 );

/**
 * Process 6.9.4 upgrades
 *
 * @param string $stored_version
 *
 * @return string
 */
function gamipress_694_upgrades( $stored_version ) {

    // Already upgrade
    if ( version_compare( $stored_version, '6.9.4', '>=' ) ) {
        return $stored_version;
    }

    // Prevent run upgrade until database tables are created
    if( ! gamipress_database_table_has_column( GamiPress()->db->logs, 'points_type' ) ) {
        return $stored_version;
    }

    // Check if there is something to migrate
    $upgrade_check = gamipress_upgrade_694_maybe_upgrade();
    
    if( $upgrade_check === 0 ) {

        // There is nothing to update, so upgrade
        $stored_version = '6.9.4';

    } else if( is_gamipress_upgrade_completed( 'update_logs_points_types' ) ) {

        // Migrations are finished, so upgrade
        $stored_version = '6.9.4';

    }

    return $stored_version;

}
add_filter( 'gamipress_process_upgrades', 'gamipress_694_upgrades', 694 );

/**
 * 6.9.4 upgrades notices
 */
function gamipress_694_upgrades_notices() {

    // Bail if GamiPress is active network wide and we are not in main site
    if( gamipress_is_network_wide_active() && ! is_main_site() ) {
        return;
    }

    // Check user permissions
    if ( ! current_user_can( gamipress_get_manager_capability() ) ) {
        return;
    }

    // Already upgraded!
    if( is_gamipress_upgraded_to( '6.9.4' ) ) {
        return;
    }

    $running_upgrade = get_option( 'gamipress_running_upgrade' );

    // Other upgrade already running
    if( $running_upgrade && $running_upgrade !== '6.9.4' ) {
        return;
    }

    if( ! is_gamipress_upgrade_completed( 'update_logs_points_types' ) ) : ?>

        <div id="gamipress-upgrade-notice" class="updated">

            <?php if( $running_upgrade === '6.9.4' ) : ?>

                <p>
                    <?php _e( 'Upgrading GamiPress database...', 'gamipress' ); ?>
                </p>
                <div class="gamipress-upgrade-progress" data-running-upgrade="6.9.4">
                    <div class="gamipress-upgrade-progress-bar" style="width: 0%;"></div>
                </div>

            <?php else : ?>

                <p>
                    <?php _e( 'GamiPress needs to upgrade the database. <strong>Please backup your database before starting this upgrade.</strong> This upgrade routine will be making changes to the database that are not reversible.', 'gamipress' ); ?>
                </p>
                <p>
                    <a href="javascript:void(0);" onClick="jQuery(this).parent().next('p').slideToggle();" class="button"><?php _e( 'Learn more about this upgrade', 'gamipress' ); ?></a>
                    <a href="javascript:void(0);" onClick="gamipress_start_upgrade('6.9.4')" class="button button-primary"><?php _e( 'Start the upgrade', 'gamipress' ); ?></a>
                </p>
                <p style="display: none;">
                    <?php _e( '<strong>About this upgrade:</strong><br />This is a <strong><em>mandatory</em></strong> update that will update the GamiPress logs adding some extra information on them to improve database queries.', 'gamipress' ); ?>
                    <br>
                    <?php _e( 'Depending on the number of logs found, this process could take a while, but there is <strong><em>no danger</em></strong> about lose any data because this process will only <strong><em>append</em></strong> information to old entries, so is <strong><em>100% safe to upgrade</em></strong>.', 'gamipress' ); ?>
                </p>

            <?php endif; ?>

        </div>

        <?php
    endif;

}
add_action( 'admin_notices', 'gamipress_694_upgrades_notices' );

/**
 * Return the number of entries to upgrade
 *
 * @return int
 */
function gamipress_694_upgrade_size() {

    global $wpdb;

    $upgrade_size = 0;

    // Retrieve the count of post upgrade
    if( ! is_gamipress_upgrade_completed( 'update_logs_points_types' )
        && gamipress_database_table_exists( GamiPress()->db->logs )
        && gamipress_database_table_has_column( GamiPress()->db->logs, 'points_type' ) ) {

        $upgrade_size = absint( $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) " . gamipress_upgrade_694_query()
        ) ) );

    }

    return $upgrade_size;

}

/**
 * Ajax function to meet the upgrade size
 */
function gamipress_ajax_694_upgrade_info() {
    // Security check, forces to die if not security passed
    check_ajax_referer( 'gamipress_admin', 'nonce' );

    // Already upgraded
    if ( is_gamipress_upgraded_to( '6.9.4' ) ) {
        wp_send_json_success( array( 'upgraded' => true ) );
    }

    $upgrade_size = gamipress_694_upgrade_size();

    wp_send_json_success( array( 'total' => $upgrade_size ) );

}
add_action( 'wp_ajax_gamipress_694_upgrade_info', 'gamipress_ajax_694_upgrade_info' );

/**
 * Ajax process of 6.9.4 upgrades
 */
function gamipress_ajax_process_694_upgrade() {
    // Security check, forces to die if not security passed
    check_ajax_referer( 'gamipress_admin', 'nonce' );

    global $wpdb;

    // Already upgraded
    if ( is_gamipress_upgraded_to( '6.9.4' ) ) {
        wp_send_json_success( array( 'upgraded' => true ) );
    }

    ignore_user_abort( true );
    set_time_limit( 0 );

    // Add option to meet that upgrade process has been started
    update_option( 'gamipress_running_upgrade', '6.9.4' );

    // --------------------------------------------------------
    // Update user earnings parent_post_type meta
    // --------------------------------------------------------
    // We need to update user earnings "parent_post_type" meta to be able to filter correctly requirements by its parent type in user earnings block

    if( ! is_gamipress_upgrade_completed( 'update_logs_points_types' ) ) {

        // Setup vars
        $logs           = GamiPress()->db->logs;
        $logs_meta      = GamiPress()->db->logs_meta;
        $current        = isset( $_REQUEST['current'] ) ? absint( $_REQUEST['current'] ) : 0;
        $limit          = 50;

        if( $current === 0 ) {
            // Update the type column to varchar for performance
            $wpdb->query("ALTER TABLE `{$logs}` MODIFY COLUMN `type` VARCHAR(50) CHARACTER SET {$wpdb->charset} COLLATE {$wpdb->collate} NOT NULL;");
        }

        // Retrieve all requirements without parent (ordered by post_id for performance)
        $results = $wpdb->get_results( $wpdb->prepare( "SELECT l.log_id " . gamipress_upgrade_694_query() . " LIMIT {$limit}" ) );

        foreach( $results as $log ) {

            $points = absint( gamipress_get_log_meta( $log->log_id, '_gamipress_points', true ) );
            $points_type = gamipress_get_log_meta( $log->log_id, '_gamipress_points_type', true );

            // Update the log points and points type
            $wpdb->query("UPDATE `{$logs}` SET `points`={$points},`points_type`='{$points_type}' WHERE `log_id`={$log->log_id}");

            $current++;
        }

        $count = absint( $wpdb->get_var( $wpdb->prepare(
            "SELECT COUNT(*) " . gamipress_upgrade_694_query()
        ) ) );

        if( $count === 0 ) {
            gamipress_set_upgrade_complete( 'update_logs_points_types' );
        }

    }

    // Successfully upgraded
    if( is_gamipress_upgrade_completed( 'update_logs_points_types' ) ) {

        // Remove option to meet that upgrade process has been finished
        delete_option( 'gamipress_running_upgrade' );

        // Updated stored version
        update_option( 'gamipress_version', '6.9.4' );

        wp_send_json_success( array( 'upgraded' => true ) );

    }

    wp_send_json_success( array( 'current' => $current ) );

}
add_action( 'wp_ajax_gamipress_process_694_upgrade', 'gamipress_ajax_process_694_upgrade' );

function gamipress_ajax_stop_process_694_upgrade() {
    // Security check, forces to die if not security passed
    check_ajax_referer( 'gamipress_admin', 'nonce' );

    $running_upgrade = get_option( 'gamipress_running_upgrade' );

    // Check if is out upgrade
    if( $running_upgrade === '6.9.4' )
        delete_option( 'gamipress_running_upgrade' );

    wp_send_json_success();

}
add_action( 'wp_ajax_gamipress_stop_process_694_upgrade', 'gamipress_ajax_stop_process_694_upgrade' );

/**
 * Check if it is necessary upgrade
 *
 * @return int
 */
function gamipress_upgrade_694_maybe_upgrade() {

    global $wpdb;

    $upgrade_check = 0;

    // Retrieve the count of post upgrade
    if( ! is_gamipress_upgrade_completed( 'update_logs_points_types' )
        && gamipress_database_table_exists( GamiPress()->db->logs )
        && gamipress_database_table_has_column( GamiPress()->db->logs, 'points_type' )) {

        $upgrade_check = absint( $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) " . gamipress_upgrade_694_query() . " LIMIT 1" ) ) );

    }

    return $upgrade_check;

}

/**
 * Gets the common query for this upgrade
 *
 * @return string
 */
function gamipress_upgrade_694_query() {

    // Setup vars
    $logs      = GamiPress()->db->logs;
    $logs_meta = GamiPress()->db->logs_meta;

    return "FROM {$logs} AS l 
            LEFT JOIN {$logs_meta} lm ON ( lm.log_id = l.log_id AND lm.meta_key = '_gamipress_points_type'  ) 
            WHERE l.points_type = '' 
            AND lm.meta_value != ''";

}