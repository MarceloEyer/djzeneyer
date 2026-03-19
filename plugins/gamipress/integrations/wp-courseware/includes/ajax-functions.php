<?php
/**
 * Ajax Functions
 *
 * @package GamiPress\WP_Courseware\Ajax_Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_wpcw_ajax_get_posts() {

    global $wpdb;

    $results = array();

    // Pull back the search string
    $search = isset( $_REQUEST['q'] ) ? sanitize_text_field( $_REQUEST['q'] ) : '';
    $search = $wpdb->esc_like( $search );

    if( isset( $_REQUEST['post_type'] ) && in_array( 'wpcw_modules', $_REQUEST['post_type'] ) ) {

        // Get the modules
        $modules = $wpdb->get_results( $wpdb->prepare(
            "SELECT m.module_id, m.module_title
            FROM {$wpdb->prefix}wpcw_modules AS m
            WHERE m.module_title LIKE %s",
            "%%{$search}%%"
        ) );

        foreach ( $modules as $module ) {

            // Results should meet same structure like posts
            $results[] = array(
                'ID' => $module->module_id,
                'post_title' => $module->module_title,
            );

        }

        // Return our results
        wp_send_json_success( $results );
        die;
    }

    

}
add_action( 'wp_ajax_gamipress_get_posts', 'gamipress_wpcw_ajax_get_posts', 5 );

// Get the module title
function gamipress_wpcw_get_module_title( $module_id ) {

    if( absint( $module_id ) === 0 ) return '';

    global $wpdb;

    return $wpdb->get_var( $wpdb->prepare(
        "SELECT m.module_title FROM {$wpdb->prefix}wpcw_modules AS m WHERE m.module_id = %d",
        absint( $module_id )
    ) );

}