<?php
/**
 * Requirements
 *
 * @package GamiPress\BBForms\Requirements
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Add the form field to the requirement object
 *
 * @param $requirement
 * @param $requirement_id
 *
 * @return array
 */
function gamipress_bbforms_requirement_object( $requirement, $requirement_id ) {

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_bbforms_form_specific_category_submission') ) {
        // Field form
        $requirement['bbforms_category'] = get_post_meta( $requirement_id, '_gamipress_bbforms_category', true );
    }

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_bbforms_form_specific_tag_submission') ) {
        // Field form
        $requirement['bbforms_tag'] = get_post_meta( $requirement_id, '_gamipress_bbforms_tag', true );
    }

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_bbforms_field_value_submission'
            || $requirement['trigger_type'] === 'gamipress_bbforms_specific_field_value_submission' ) ) {

        // Field name and value
        $requirement['bbforms_field_name'] = get_post_meta( $requirement_id, '_gamipress_bbforms_field_name', true );
        $requirement['bbforms_field_value'] = get_post_meta( $requirement_id, '_gamipress_bbforms_field_value', true );
    }

    return $requirement;
}
add_filter( 'gamipress_requirement_object', 'gamipress_bbforms_requirement_object', 10, 2 );

/**
 * Form field on requirements UI
 *
 * @param $requirement_id
 * @param $post_id
 */
function gamipress_bbforms_requirement_ui_fields( $requirement_id, $post_id ) {

    // Get the categories
    $categories = gamipress_bbforms_get_form_categories();
    $selected_category = get_post_meta( $requirement_id, '_gamipress_bbforms_category', true );

    // Get the tags
    $tags = gamipress_bbforms_get_form_tags();
    $selected_tag = get_post_meta( $requirement_id, '_gamipress_bbforms_tag', true );
    
    // Fields
    $field_name = get_post_meta( $requirement_id, '_gamipress_bbforms_field_name', true );
    $field_value = get_post_meta( $requirement_id, '_gamipress_bbforms_field_value', true );
    ?>

    <span class="bbforms-category">
        <select>
            <?php foreach( $categories as $category ) : ?>
                <option value="<?php echo $category->id; ?>" <?php selected( $selected_category, $category->id ); ?>><?php echo $category->name; ?></option>
            <?php endforeach; ?>
        </select>
    </span>

    <span class="bbforms-tag">
        <select>
            <?php foreach( $tags as $tag ) : ?>
                <option value="<?php echo $tag->id; ?>" <?php selected( $selected_tag, $tag->id ); ?>><?php echo $tag->name; ?></option>
            <?php endforeach; ?>
        </select>
    </span>

    <span class="bbforms-field-name"><input type="text" value="<?php echo $field_name; ?>" placeholder="<?php echo __( 'Field name', 'gamipress' ); ?>" /></span>
    <span class="bbforms-field-value"><input type="text" value="<?php echo $field_value; ?>" placeholder="<?php echo __( 'Field value', 'gamipress' ); ?>" /></span>

    <?php
}
add_action( 'gamipress_requirement_ui_html_after_achievement_post', 'gamipress_bbforms_requirement_ui_fields', 10, 2 );

/**
 * Custom handler to save the form on requirements UI
 *
 * @param $requirement_id
 * @param $requirement
 */
function gamipress_bbforms_ajax_update_requirement( $requirement_id, $requirement ) {

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_bbforms_form_specific_category_submission' ) ) {

        // Category
        update_post_meta( $requirement_id, '_gamipress_bbforms_category', $requirement['bbforms_category'] );
    }

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_bbforms_form_specific_tag_submission' ) ) {

        // Tag
        update_post_meta( $requirement_id, '_gamipress_bbforms_tag', $requirement['bbforms_tag'] );
    }

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_bbforms_field_value_submission'
            || $requirement['trigger_type'] === 'gamipress_bbforms_specific_field_value_submission' ) ) {

        // Field name and value
        update_post_meta( $requirement_id, '_gamipress_bbforms_field_name', $requirement['bbforms_field_name'] );
        update_post_meta( $requirement_id, '_gamipress_bbforms_field_value', $requirement['bbforms_field_value'] );
    }
    
}
add_action( 'gamipress_ajax_update_requirement', 'gamipress_bbforms_ajax_update_requirement', 10, 2 );