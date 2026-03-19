<?php
/**
 * Functions
 *
 * @package GamiPress\QSM\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Get the quiz post ID
 *
 * @since 1.0.0
 *
 * @param int $quiz_id
 *
 * @return int
 */
function gamipress_qsm_get_quiz_post_id( $quiz_id ) {

    // False if no quiz ID provided
    if( !isset( $quiz_id ) ) {
        return false;
    }

    $post_id = get_posts( array(
        'posts_per_page' => 1,
        'post_type'      => 'qsm_quiz',
        'post_status'    => array( 'publish' ),
        'fields'         => 'ids',
        'meta_query'     => array(
            array(
                'key'     => 'quiz_id',
                'value'   => $quiz_id,
                'compare' => '=',
            ),
        ),
    ) );

    return $post_id;

}