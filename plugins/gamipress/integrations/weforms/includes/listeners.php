<?php
/**
 * Listeners
 *
 * @package GamiPress\WeForms\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Form submission listener
 *
 * @since 1.0.0
 *
 * @param int $entry_id
 * @param int $form_id
 * @param int $page_id
 * @param array $form_settings
 */
function gamipress_weforms_submission_listener( $entry_id, $form_id, $page_id, $form_settings ) {

    //$form_id = $form->id;
    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger event for submit a new form
    do_action( 'gamipress_weforms_new_form_submission', $form_id, $user_id );

    // Trigger event for submit a specific form
    do_action( 'gamipress_weforms_specific_new_form_submission', $form_id, $user_id );

}
add_action( 'weforms_entry_submission', 'gamipress_weforms_submission_listener', 10, 4 );

/**
 * Field submission listener
 *
 * @since 1.0.0
 *
 * @param int $entry_id
 * @param int $form_id
 * @param int $page_id
 * @param array $form_settings
 */
function gamipress_weforms_field_submission_listener( $entry_id, $form_id, $page_id, $form_settings ) {
    
    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $form = get_post( $form_id );

    $form_fields = gamipress_weforms_get_form_field_values( $form, $entry_id );

    foreach ($form_fields as $field_name => $field_value) {
        
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
        if( apply_filters( 'gamipress_weforms_exclude_field', false, $field_name, $field_value, $field ) )
            continue;

        // Trigger event for submit a specific field value
        do_action( 'gamipress_weforms_field_value_submission', $form_id, $user_id, $field_name, $field_value );

        // Trigger event for submit a specific field value of a specific form
        do_action( 'gamipress_weforms_specific_field_value_submission', $form_id, $user_id, $field_name, $field_value );
    }

    
}
add_action( 'weforms_entry_submission', 'gamipress_weforms_field_submission_listener', 10, 4 );