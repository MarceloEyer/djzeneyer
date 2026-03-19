<?php
/**
 * Listeners
 *
 * @package GamiPress\ShortLinksPro\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Click listener
 *
 * @since 1.0.0
 *
 * @param stdClass  $link           Link object
 * @param string    $parameters     The query parameters
 * @param string    $url            URL to redirect
 */
function gamipress_shortlinkspro_click_listener( $link, $parameters, $url ) {
    
    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger event for clicking a link
    do_action( 'gamipress_shortlinkspro_click', $link->id, $user_id );

    // Trigger event for clicking a specific link
    do_action( 'gamipress_shortlinkspro_specific_click', $link->id, $user_id );

    // Get categories related to link
    ct_setup_table( 'shortlinkspro_link_categories_relationships' );
    $categories = ct_get_object_terms( $link->id );
    ct_reset_setup_table();

    if ( ! empty ( $categories ) ) {

        foreach ( $categories as $category ){
            // Trigger event for clicking a link with category
            do_action( 'gamipress_shortlinkspro_click_specific_category', $link->id, $user_id, $category->id );
        }
        
    }

    // Get tags related to link
    ct_setup_table( 'shortlinkspro_link_tags_relationships' );
    $tags = ct_get_object_terms( $link->id );
    ct_reset_setup_table();

    if ( ! empty ( $tags ) ) {

        foreach ( $tags as $tag ){
            // Trigger event for clicking a link with tag
            do_action( 'gamipress_shortlinkspro_click_specific_tag', $link->id, $user_id, $tag->id );
        }
        
    }
}
add_action( 'shortlinkspro_before_redirect', 'gamipress_shortlinkspro_click_listener', 10, 3 );