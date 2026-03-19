<?php
/**
 * Listeners
 *
 * @package GamiPress\ARForms\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Form submission listener
 *
 * @since 1.0.0
 *
 * @param array     $params 
 * @param int       $form_id    
 * @param int       $form   
 * @param array     $item_meta_values
 */
function gamipress_arforms_submission_listener( $params, $errors, $form, $item_meta_values ) {

    $form_id = $form->id;
    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger event for submit a new form
    do_action( 'gamipress_arforms_new_form_submission', $form_id, $user_id );

    // Trigger event for submit a specific form
    do_action( 'gamipress_arforms_specific_new_form_submission', $form_id, $user_id );

}
add_action( 'arfliteentryexecute', 'gamipress_arforms_submission_listener', 10, 4 );
add_action( 'arfentryexecute', 'gamipress_arforms_submission_listener', 10, 4 );

/**
 * Field submission listener
 *
 * @since 1.0.0
 *
 * @param array     $params 
 * @param int       $form_id    
 * @param int       $form   
 * @param array     $item_meta_values
 */
function gamipress_arforms_field_submission_listener( $params, $errors, $form, $item_meta_values ) {

    $form_id = $form->id;
    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $fields = gamipress_arforms_get_form_fields_values( $form_id, $item_meta_values );

    // Loop all fields to trigger events per field value
    foreach ( $fields as $field_name => $field_value ) {

        // Trigger event for submit a specific field value
        do_action( 'gamipress_arforms_field_value_submission', $form_id, $user_id, $field_name, $field_value );

        // Trigger event for submit a specific field value of a specific form
        do_action( 'gamipress_arforms_specific_field_value_submission', $form_id, $user_id, $field_name, $field_value );
    }

}
add_action( 'arfliteentryexecute', 'gamipress_arforms_field_submission_listener', 10, 4 );
add_action( 'arfentryexecute', 'gamipress_arforms_field_submission_listener', 10, 4 );
