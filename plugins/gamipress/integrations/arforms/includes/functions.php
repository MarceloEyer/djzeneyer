<?php
/**
 * Functions
 *
 * @package GamiPress\ARForms\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_arforms_ajax_get_posts() {

    global $wpdb;

    if( isset( $_REQUEST['post_type'] ) && in_array( 'arforms_form', $_REQUEST['post_type'] ) ) {

        // Pull back the search string
        $search = isset( $_REQUEST['q'] ) ? $wpdb->esc_like( $_REQUEST['q'] ) : '';
        $results = array();

        if( gamipress_is_network_wide_active() ) {

            // Look for results on all sites on a multisite install

            foreach( gamipress_get_network_site_ids() as $site_id ) {

                // Switch to site
                switch_to_blog( $site_id );

                // Get the current site name to append it to results
                $site_name = get_bloginfo( 'name' );

                // Check if plugin is active on this site
                if( class_exists('arfliteformcontroller') || class_exists('arformcontroller')) {

                    // Get the forms
                    $sql_query = gamipress_arforms_get_query_forms();
                    $site_forms = $wpdb->get_results( $sql_query );

                    foreach ( $site_forms as $form ) {

                        // Results should meet same structure like posts
                        $results[] = array(
                            'ID' => $form->id,
                            'post_title' => $form->name,
                            'site_id' => $site_id,
                            'site_name' => $site_name,
                        );

                    }

                }

                // Restore current site
                restore_current_blog();

            }
        } else {

            // Get the forms
            $sql_query = gamipress_arforms_get_query_forms();
            $forms = $wpdb->get_results( $sql_query );

            foreach( $forms as $form ) {
                $results[] = array(
                    'id' => $form->id,
                    'text' => $form->name,
                );
            }

        }

        // Return our results
        wp_send_json_success( $results );
        die;
    }

}
add_action( 'wp_ajax_gamipress_get_posts', 'gamipress_arforms_ajax_get_posts', 5 );

/**
 * Get plugin version
 *
 * @since 1.0.0
 *
 * @return string
 */
function gamipress_arforms_get_plugin_version() {

    global $wpdb;

    // Check installed versions
    if( is_plugin_active( 'arforms-form-builder/arforms-form-builder.php' ) && is_plugin_active( 'arforms/arforms.php' ) ) {
        $version = "pro";
    } elseif( !is_plugin_active( 'arforms-form-builder/arforms-form-builder.php' ) && is_plugin_active( 'arforms/arforms.php' ) ) {
		$version = "only_pro";
	}
	else {
        $version = "lite";
    }

    return $version;

}

/**
 * Get query for forms
 *
 * @since 1.0.0
 *
 * @return string
 */
function gamipress_arforms_get_query_forms() {

    global $wpdb;

    $version = gamipress_arforms_get_plugin_version();

    // Check installed versions to get table
    if( $version === "pro" ) {
        $table_name = "{$wpdb->prefix}arf_forms";
		$sql_query = $wpdb->prepare( "SELECT id, name FROM {$table_name} WHERE is_template = 0" );
    } elseif ( $version === "only_pro" ) {
		$table_name = "{$wpdb->prefix}arf_forms";
		$sql_query = $wpdb->prepare( "SELECT id, name FROM {$table_name} WHERE is_template = 0 AND arf_is_lite_form = 0" );
	} 
	else {
        $table_name = "{$wpdb->prefix}arflite_forms";
		$sql_query = "SELECT id, name FROM " . $table_name;
    }

    return $sql_query;

}

/**
 * Get form name
 *
 * @since 1.0.0
 *
 * @return array
 */
function gamipress_arforms_get_form_name( $form_id ) {

    global $wpdb;

    $version = gamipress_arforms_get_plugin_version();

    // Check installed versions to get table
    if( $version === "pro" || $version === "only_pro" ) {
        $table_name = "{$wpdb->prefix}arf_forms";
    } else {
        $table_name = "{$wpdb->prefix}arflite_forms";
    }
    
    $sql_query = $wpdb->prepare( "SELECT name FROM $table_name WHERE id = %d", $form_id );
    $form_name = $wpdb->get_var( $sql_query );
    
    return $form_name;

}

/**
 * Get form fields values
 *
 * @since 1.0.0
 *
 * @param array $field_data
 * @param string $field_name
 * @param string $field_value
 *
 * @return array
 */
function gamipress_arforms_get_form_fields_values( $form_id, $item_meta_values ) {
    
    global $wpdb;
    
    $form_fields = array();

    $version = gamipress_arforms_get_plugin_version();
    
    // Check installed versions to get table
    if( $version === "pro" || $version === "only_pro" ) {
        $table_name = "{$wpdb->prefix}arf_fields";
    } else {
        $table_name = "{$wpdb->prefix}arflite_fields";
    }

    $sql_query = $wpdb->prepare( "SELECT id, name FROM $table_name WHERE form_id = %d", $form_id );
    $field_data = $wpdb->get_results( $sql_query );

    foreach( $field_data as $field ) {

        $name = $field->name;
        $value = $item_meta_values[$field->id];

        $form_fields[$name] = $value;
    }

    return $form_fields;

}