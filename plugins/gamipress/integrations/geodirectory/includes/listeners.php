<?php
/**
 * Listeners
 *
 * @package GamiPress\Geodirectory\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Place added listener
 *
 * @since 1.0.0
 *
 */
function gamipress_geodirectory_place_added_listener( $gd_post, $data ) {

    $user_id = get_current_user_id();
    $place_id = $gd_post->ID;

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger event for creating a new place
    do_action( 'gamipress_geodirectory_new_place_added', $place_id, $user_id );

}
add_action( 'geodir_post_published', 'gamipress_geodirectory_place_added_listener', 10, 2 );

/**
 * Category added listener
 *
 * @since 1.0.0
 *
 */
function gamipress_geodirectory_category_added_listener( $term_id, $tt_id, $taxonomy ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ($user_id === 0) {
        return;
    }

    // Trigger event for creating a new category
    do_action( 'gamipress_geodirectory_new_category_added', $term_id, $user_id );

}
add_action( 'geodir_term_save_category_fields', 'gamipress_geodirectory_category_added_listener', 10, 3 );

/**
 * Comment posted listener
 *
 * @since 1.0.0
 *
 */
function gamipress_geodirectory_comment_posted_listener( $post_id ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ($user_id === 0) {
        return;
    }

    // Trigger event for posting a new comment
    do_action( 'gamipress_geodirectory_new_comment_posted', $post_id['comment_post_ID'], $user_id );

    // Trigger event for posting a new comment on a specific place
    do_action( 'gamipress_geodirectory_specific_new_comment_posted', $post_id['comment_post_ID'], $user_id );

}
add_action( 'geodir_after_save_comment', 'gamipress_geodirectory_comment_posted_listener', 10, 1 );