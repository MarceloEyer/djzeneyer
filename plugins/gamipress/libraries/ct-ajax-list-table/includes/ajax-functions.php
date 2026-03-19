<?php
/**
 * Ajax Functions
 *
 * @author GamiPress <contact@gamipress.com>, Ruben Garcia <rubengcdev@gamil.com>
 *
 * @since 1.0.0
 */
// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

function ct_ajax_list_table_handle_request() {

    global $ct_table, $ct_query, $ct_list_table, $ct_ajax_list_items_per_page;

    // Security check, forces to die if not security passed
    check_ajax_referer( 'ct_ajax_list_table', 'nonce' );

    if( ! isset( $_GET['object'] ) ) {
        wp_send_json_error();
    }

    $ct_table = ct_setup_table( sanitize_text_field( $_GET['object'] ) );

    if( ! is_object( $ct_table ) ) {
        wp_send_json_error();
    }

    // Setup this constant to allow from CT_List_Table meet that this render comes from this plugin
    @define( 'IS_CT_AJAX_LIST_TABLE', true );

    if( is_array( $_GET['query_args'] ) ) {
        $query_args = map_deep( $_GET['query_args'], 'sanitize_text_field' );
    } else {
        $query_args = json_decode( wp_unslash( $_GET['query_args'] ), true );
        // Sanitize
        $query_args = map_deep( $query_args, 'sanitize_text_field' );
    }

    if( isset( $_GET['paged'] ) ) {
        $query_args['paged'] = absint( $_GET['paged'] );
    }
    
    $query_args = wp_parse_args( $query_args, array(
        'paged' => 1,
        'items_per_page' => 20,
    ) );

    if( isset( $query_args['paged'] ) ) {
        $query_args['paged'] = absint( $query_args['paged'] );
    }

    $ct_ajax_list_items_per_page = $query_args['items_per_page'];
    add_filter( 'edit_' . $ct_table->name . '_per_page', 'ct_ajax_list_override_items_per_page' );

    // Set up vars
    $ct_query = new CT_Query( $query_args );
    $ct_list_table = new CT_List_Table();

    $ct_list_table->prepare_items();

    ob_start();
    $ct_list_table->display();
    $output = ob_get_clean();

    wp_send_json_success( $output );

}
add_action( 'wp_ajax_ct_ajax_list_table_request', 'ct_ajax_list_table_handle_request' );