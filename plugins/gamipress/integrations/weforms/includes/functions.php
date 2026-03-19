<?php
/**
 * Functions
 *
 * @package GamiPress\WeForms\Functions
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Get form fields values
 *
 * @since 1.0.0
 *
 * @param array $fields
 *
 * @return array
 */
function gamipress_weforms_get_form_field_values( $form, $entry_id ) {

    $form_fields = array();

    $obj_form = new weForms_Form($form);
    $obj_entry = new weForms_Form_Entry($entry_id, $obj_form);
    $name_fields = $obj_entry->get_form( $entry_id )->get_field_values();
    
    // Loop all fields
    foreach ( $name_fields as $field_name => $value ) {
        $field_value = weforms_get_entry_meta( $entry_id, $field_name, true );
        $form_fields[$field_name] = $field_value;
    }

        if( function_exists( 'automatorwp_utilities_pull_array_values' ) ) {
            $form_fields = automatorwp_utilities_pull_array_values( $form_fields );

        }

    return $form_fields;
}