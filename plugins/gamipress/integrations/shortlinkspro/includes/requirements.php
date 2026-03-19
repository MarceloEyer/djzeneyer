<?php
/**
 * Requirements
 *
 * @package GamiPress\ShortLinksPro\Requirements
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
function gamipress_shortlinkspro_requirement_object( $requirement, $requirement_id ) {

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_shortlinkspro_click_specific_category') ) {
        // Field form
        $requirement['shortlinkspro_category'] = get_post_meta( $requirement_id, '_gamipress_shortlinkspro_category', true );
    }

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_shortlinkspro_click_specific_tag') ) {
        // Field form
        $requirement['shortlinkspro_tag'] = get_post_meta( $requirement_id, '_gamipress_shortlinkspro_tag', true );
    }

    return $requirement;
}
add_filter( 'gamipress_requirement_object', 'gamipress_shortlinkspro_requirement_object', 10, 2 );

/**
 * Form field on requirements UI
 *
 * @param $requirement_id
 * @param $post_id
 */
function gamipress_shortlinkspro_requirement_ui_fields( $requirement_id, $post_id ) {

    // Get the categories
    $categories = gamipress_shortlinkspro_get_link_categories();
    $selected_category = get_post_meta( $requirement_id, '_gamipress_shortlinkspro_category', true );

    // Get the tags
    $tags = gamipress_shortlinkspro_get_link_tags();
    $selected_tag = get_post_meta( $requirement_id, '_gamipress_shortlinkspro_tag', true ); ?>

    <span class="shortlinkspro-category">
        <select>
            <?php foreach( $categories as $category ) : ?>
                <option value="<?php echo $category->id; ?>" <?php selected( $selected_category, $category->id ); ?>><?php echo $category->name; ?></option>
            <?php endforeach; ?>
        </select>
    </span>

    <span class="shortlinkspro-tag">
        <select>
            <?php foreach( $tags as $tag ) : ?>
                <option value="<?php echo $tag->id; ?>" <?php selected( $selected_tag, $tag->id ); ?>><?php echo $tag->name; ?></option>
            <?php endforeach; ?>
        </select>
    </span>

    <?php
}
add_action( 'gamipress_requirement_ui_html_after_achievement_post', 'gamipress_shortlinkspro_requirement_ui_fields', 10, 2 );

/**
 * Custom handler to save the form on requirements UI
 *
 * @param $requirement_id
 * @param $requirement
 */
function gamipress_shortlinkspro_ajax_update_requirement( $requirement_id, $requirement ) {

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_shortlinkspro_click_specific_category' ) ) {

        // Category
        update_post_meta( $requirement_id, '_gamipress_shortlinkspro_category', $requirement['shortlinkspro_category'] );
    }

    if( isset( $requirement['trigger_type'] )
        && ( $requirement['trigger_type'] === 'gamipress_shortlinkspro_click_specific_tag' ) ) {

        // Tag
        update_post_meta( $requirement_id, '_gamipress_shortlinkspro_tag', $requirement['shortlinkspro_tag'] );
    }

}
add_action( 'gamipress_ajax_update_requirement', 'gamipress_shortlinkspro_ajax_update_requirement', 10, 2 );