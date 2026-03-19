<?php
/**
 * Rules Engine
 *
 * @package GamiPress\ShortLinksPro\Rules_Engine
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Checks if an user is allowed to work on a given requirement related to a specific product
 *
 * @since  1.0.0
 *
 * @param bool $return          The default return value
 * @param int $user_id          The given user's ID
 * @param int $requirement_id   The given requirement's post ID
 * @param string $trigger       The trigger triggered
 * @param int $site_id          The site id
 * @param array $args           Arguments of this trigger
 *
 * @return bool True if user has access to the requirement, false otherwise
 */
function gamipress_shortlinkspro_user_has_access_to_achievement( $return = false, $user_id = 0, $requirement_id = 0, $trigger = '', $site_id = 0, $args = array() ) {

    // If we're not working with a requirement, bail here
    if ( ! in_array( get_post_type( $requirement_id ), gamipress_get_requirement_types_slugs() ) )
        return $return;

    // Check if user has access to the achievement ($return will be false if user has exceed the limit or achievement is not published yet)
    if( ! $return )
        return $return;

    // If is specific category trigger
    if( $trigger === 'gamipress_shortlinkspro_click_specific_category' ) {

        $category_id = $args[2];
        $required_category_id = get_post_meta( $requirement_id, '_gamipress_shortlinkspro_category', true );

        // True if there is a specific category, an attached form and both are equal
        $return = (bool) ( $category_id === $required_category_id );
    }

    // If is specific tag trigger
    if( $trigger === 'gamipress_shortlinkspro_click_specific_tag' ) {

        $tag_id = $args[2];
        $required_tag_id = get_post_meta( $requirement_id, '_gamipress_shortlinkspro_tag', true );

        // True if there is a specific tag, an attached form and both are equal
        $return = (bool) ( $tag_id === $required_tag_id );
    }

    // Send back our eligibility
    return $return;
}
add_filter( 'user_has_access_to_achievement', 'gamipress_shortlinkspro_user_has_access_to_achievement', 10, 6 );