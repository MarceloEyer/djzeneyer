<?php
/**
 * Functions
 *
 * @package GamiPress\BBForms\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_bbforms_ajax_get_posts() {

    global $wpdb;

    if( isset( $_REQUEST['post_type'] ) && in_array( 'bbforms', $_REQUEST['post_type'] ) ) {

        $results = array();

        // Pull back the search string
        $search = isset( $_REQUEST['q'] ) ? $wpdb->esc_like( $_REQUEST['q'] ) : '';

        // Setup table
        $ct_table = ct_setup_table( 'bbforms_forms' );

        // Get the forms
        $forms = $wpdb->get_results( $wpdb->prepare(
            "SELECT s.id, s.title
            FROM {$ct_table->db->table_name} AS s
            WHERE s.title LIKE %s",
            "%%{$search}%%"
        ) );

        ct_reset_setup_table();

        foreach ( $forms as $form ) {

            // Results should meet same structure like posts
            $results[] = array(
                'ID' => $form->id,
                'post_title' => ! empty( $form->title ) ? $form->title : '(no title)',
            );

        }

        // Return our results
        wp_send_json_success( $results );
        die;

    }

}
add_action( 'wp_ajax_gamipress_get_posts', 'gamipress_bbforms_ajax_get_posts', 5 );

/**
 * Get form categories
 *
 * @since 1.0.0
 *
 * @return array
 */
function gamipress_bbforms_get_form_categories( ) {

    global $wpdb;

    // Setup table
    $ct_table = ct_setup_table( 'bbforms_categories' );

    // Query search
    $categories = $wpdb->get_results(
        "SELECT c.id, c.name
        FROM {$ct_table->db->table_name} AS c"
     );

    ct_reset_setup_table();

    return $categories;

}

/**
 * Get form tags
 *
 * @since 1.0.0
 *
 * @return array
 */
function gamipress_bbforms_get_form_tags( ) {

    global $wpdb;

    // Setup table
    $ct_table = ct_setup_table( 'bbforms_tags' );

    // Query search
    $tags = $wpdb->get_results(
        "SELECT t.id, t.name
        FROM {$ct_table->db->table_name} AS t"
     );

    ct_reset_setup_table();

    return $tags;

}

/**
 * Get the category title
 *
 * @since 1.0.0
 *
 * @param int $category_id
 *
 * @return string|null
 */
function gamipress_bbforms_get_category_title( $category_id ) {

    // Empty title if no ID provided
    if( absint( $category_id ) === 0 ) {
        return '';
    }

    return bbforms_get_category_name( $category_id );

}

/**
 * Get the tag title
 *
 * @since 1.0.0
 *
 * @param int $tag_id
 *
 * @return string|null
 */
function gamipress_bbforms_get_tag_title( $tag_id ) {

    // Empty title if no ID provided
    if( absint( $tag_id ) === 0 ) {
        return '';
    }

    return bbforms_get_tag_name( $tag_id );

}