<?php
/**
 * Listeners
 *
 * @package GamiPress\Everest-Forms\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Form submission listener
 *
 * @since 1.0.0
 *
 * @param array $form_fields
 * @param array $entry
 * @param array $form_data
 * @param int $entry_id
 */
function gamipress_everest_forms_submission_listener( $form_fields, $entry, $form_data, $entry_id ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $form_id = $form_data['id'];

    // Trigger event for submit a new form
    do_action( 'gamipress_everest_forms_new_form_submission', $form_id, $user_id );

    // Trigger event for submit a specific form
    do_action( 'gamipress_everest_forms_specific_new_form_submission', $form_id, $user_id );

}
add_action( 'everest_forms_process_complete', 'gamipress_everest_forms_submission_listener', 10, 4 );

/**
 * Field submission listener
 *
 * @since 1.0.0
 *
 * @param array $form_fields
 * @param array $entry
 * @param array $form_data
 * @param int $entry_id
 */
function gamipress_everest_forms_field_submission_listener( $form_fields, $entry, $form_data, $entry_id ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }
    
    $form_id = $form_data['id'];

    foreach( $form_fields as $field_id => $array_values ) {

        $field_name = $array_values['meta_key'];
        $field_value = $array_values['value'];

        // Used for hook
        $field = array( $field_name => $field_value );
    
        /**
         * Excluded fields event by filter
         *
         * @since 1.0.0
         *
         * @param bool      $exclude        Whatever to exclude or not, by default false
         * @param string    $field_name     Field name
         * @param mixed     $field_value    Field value
         * @param array     $field          Field setup array
         */
        if( apply_filters( 'gamipress_everest_forms_exclude_field', false, $field_name, $field_value, $field ) )
            continue;

        // Trigger event for submit a specific field value
        do_action( 'gamipress_everest_forms_field_value_submission', $form_id, $user_id, $field_name, $field_value );

        // Trigger event for submit a specific field value of a specific form
        do_action( 'gamipress_everest_forms_specific_field_value_submission', $form_id, $user_id, $field_name, $field_value );

    }
}
add_action( 'everest_forms_process_complete', 'gamipress_everest_forms_field_submission_listener', 10, 4 );