<?php
/**
 * Functions
 *
 * @package GamiPress\ShortLinksPro\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_shortlinkspro_ajax_get_posts() {

    global $wpdb;

    if( isset( $_REQUEST['post_type'] ) && in_array( 'slp_links', $_REQUEST['post_type'] ) ) {

        $results = array();

        // Pull back the search string
        $search = isset( $_REQUEST['q'] ) ? $wpdb->esc_like( $_REQUEST['q'] ) : '';

        // Setup table
        $ct_table = ct_setup_table( 'shortlinkspro_links' );

        // Get the links
        $links = $wpdb->get_results( $wpdb->prepare(
            "SELECT s.id, s.title
            FROM {$ct_table->db->table_name} AS s
            WHERE s.title LIKE %s",
            "%%{$search}%%"
        ) );

        ct_reset_setup_table();

        foreach ( $links as $link ) {

            // Results should meet same structure like posts
            $results[] = array(
                'ID' => $link->id,
                'post_title' => ! empty( $link->title ) ? $link->title : '(no title)',
            );

        }

        // Return our results
        wp_send_json_success( $results );
        die;

    }

}
add_action( 'wp_ajax_gamipress_get_posts', 'gamipress_shortlinkspro_ajax_get_posts', 5 );

/**
 * Get link categories
 *
 * @since 1.0.0
 *
 * @return array
 */
function gamipress_shortlinkspro_get_link_categories( ) {

    global $wpdb;

    // Setup table
    $ct_table = ct_setup_table( 'shortlinkspro_link_categories' );

    // Query search
    $categories = $wpdb->get_results(
        "SELECT c.id, c.name
        FROM {$ct_table->db->table_name} AS c"
     );

    ct_reset_setup_table();

    return $categories;

}

/**
 * Get link tags
 *
 * @since 1.0.0
 *
 * @return array
 */
function gamipress_shortlinkspro_get_link_tags( ) {

    global $wpdb;

    // Setup table
    $ct_table = ct_setup_table( 'shortlinkspro_link_tags' );

    // Query search
    $tags = $wpdb->get_results(
        "SELECT t.id, t.name
        FROM {$ct_table->db->table_name} AS t"
     );

    ct_reset_setup_table();

    return $tags;

}