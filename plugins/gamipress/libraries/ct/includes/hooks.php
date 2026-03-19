<?php
/**
 * CT Hooks
 *
 * @since 1.0.0
 */
// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

/**
 * Registers CT REST API routes.
 *
 * @since 1.0.0
 */
function ct_rest_api_init() {

    global $ct_registered_tables;

    foreach( $ct_registered_tables as $ct_table ) {

        // Skip tables that are not setup to being shown in rest
        if( ! $ct_table->show_in_rest ) {
            continue;
        }

        $class = ! empty( $ct_table->rest_controller_class ) ? $ct_table->rest_controller_class : 'CT_REST_Controller';

        // Skip if rest controller class doesn't exists
        if ( ! class_exists( $class ) ) {
            continue;
        }

        $controller = new $class( $ct_table->name );

        // Check if controller is subclass of WP_REST_Controller to check if should call to the register_routes() function
        if ( ! is_subclass_of( $controller, 'WP_REST_Controller' ) ) {
            continue;
        }

        $controller->register_routes();

    }

    // Trigger CT rest API init hook
    do_action( 'ct_rest_api_init' );
}
add_action( 'rest_api_init', 'ct_rest_api_init', 9 );

function ct_load_table_labels() {

    global $ct_registered_tables;

    foreach( $ct_registered_tables as $ct_table ) {

        $args = array(
            'singular' => ( property_exists( $ct_table, 'singular' ) ? $ct_table->singular : '' ),
            'plural' => ( property_exists( $ct_table, 'plural' ) ? $ct_table->plural : '' ),
            'labels' => ( property_exists( $ct_table, 'labels' ) ? (array) $ct_table->labels : '' ),
        );

        $args = apply_filters( "ct_{$ct_table->name}_labels", $args, $ct_table );

        $ct_table->singular  = $args['singular'];
        $ct_table->plural  = $args['plural'];

        $labels = (array) ct_get_table_labels( $ct_table );

        // Custom defined labels overrides default
        if( isset( $args['labels'] ) && is_array( $args['labels'] ) ) {
            $labels = wp_parse_args( $args['labels'], $labels );
        }

        $ct_table->labels = (object) $labels;

        $ct_table->label  = $ct_table->labels->name;

    }

}
add_action( 'init', 'ct_load_table_labels', 10 );