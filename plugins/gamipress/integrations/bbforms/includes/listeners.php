<?php
/**
 * Listeners
 *
 * @package GamiPress\BBForms\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Submit listener
 *
 * @since 1.0.0
 *
 * @param array $bbforms_form
 * @param array $bbforms_request
 * @param array $bbforms_response
 */
function gamipress_bbforms_submit_listener( $bbforms_form, $bbforms_request, $bbforms_response ) {
    
    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $form_id = $bbforms_response['form_id'];

    // Trigger event for submiting a form
    do_action( 'gamipress_bbforms_form_submission', $form_id, $user_id );

    // Trigger event for submiting a specific form
    do_action( 'gamipress_bbforms_specific_form_submission', $form_id, $user_id );

    // Get categories related to form
    ct_setup_table( 'bbforms_categories_relationships' );
    $categories = ct_get_object_terms( $form_id );
    ct_reset_setup_table();

    if ( ! empty ( $categories ) ) {

        foreach ( $categories as $category ){
            // Trigger event for submiting a form with category
            do_action( 'gamipress_bbforms_form_specific_category_submission', $form_id, $user_id, $category->id );
        }
        
    }

    // Get tags related to form
    ct_setup_table( 'bbforms_tags_relationships' );
    $tags = ct_get_object_terms( $form_id );
    ct_reset_setup_table();

    if ( ! empty ( $tags ) ) {

        foreach ( $tags as $tag ){
            // Trigger event for submiting a form with tag
            do_action( 'gamipress_bbforms_form_specific_tag_submission', $form_id, $user_id, $tag->id );
        }
        
    }
}
add_action( 'bbforms_form_submit_success', 'gamipress_bbforms_submit_listener', 10, 3 );

/**
 * Field submission listener
 *
 * @since 1.0.0
 *
 * @param array $bbforms_form
 * @param array $bbforms_request
 * @param array $bbforms_response
 */
function gamipress_bbforms_field_submission_listener( $bbforms_form, $bbforms_request, $bbforms_response ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $form_id = $bbforms_response['form_id'];

    $fields = $bbforms_request;

    // Loop all fields to trigger events per field value
    foreach ( $fields as $field_name => $field_value ) {

        // Used for hook
        $field = array( $field_name => $field_value );

        /**
         * Excluded fields event by filter
         *
         * @since 1.1.0
         *
         * @param bool      $exclude        Whatever to exclude or not, by default false
         * @param string    $field_name     Field name
         * @param mixed     $field_value    Field value
         * @param array     $field          Field setup array
         */
        if( apply_filters( 'gamipress_bbforms_exclude_field', false, $field_name, $field_value, $field ) )
            continue;

        // Trigger event for submit a specific field value
        do_action( 'gamipress_bbforms_field_value_submission', $form_id, $user_id, $field_name, $field_value );

        // Trigger event for submit a specific field value of a specific form
        do_action( 'gamipress_bbforms_specific_field_value_submission', $form_id, $user_id, $field_name, $field_value );
    }

}
add_action( 'bbforms_form_submit_success', 'gamipress_bbforms_field_submission_listener', 10, 3 );