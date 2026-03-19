<?php
/**
 * Listeners
 *
 * @package GamiPress\QSM\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Form submission listener
 *
 * @since 1.0.0
 *
 * @param $results_array
 * @param $results_id
 * @param $qmn_quiz_options
 * @param $qmn_array_for_variables
 */
function gamipress_qsm_submission_listener( $results_array, $results_id, $qmn_quiz_options, $qmn_array_for_variables ) {

    $user_id = get_current_user_id();
    $quiz_id = $qmn_array_for_variables['quiz_id'];
    $points = $qmn_array_for_variables['total_points'];

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Bail if not all details provided
    if ( empty( $quiz_id ) ) {
        return;
    }

    // Get quiz post ID
    $post_id = gamipress_qsm_get_quiz_post_id( $quiz_id );

    // Trigger event for submit a new quiz
    do_action( 'gamipress_qsm_new_quiz_submission', $post_id[0], $user_id, $points );

    // Trigger event for submit a specific quiz
    do_action( 'gamipress_qsm_specific_new_quiz_submission', absint($post_id[0]), $user_id, $points );

    // Minimum points
    do_action( 'gamipress_qsm_complete_quiz_points', $post_id[0], $user_id, $points );
    do_action( 'gamipress_qsm_complete_specific_quiz_points', $post_id[0], $user_id, $points );

    // Maximum points
    do_action( 'gamipress_qsm_complete_quiz_max_points', $post_id[0], $user_id, $points );
    do_action( 'gamipress_qsm_complete_specific_quiz_max_points', $post_id[0], $user_id, $points );

    // Between pointss
    do_action( 'gamipress_qsm_complete_quiz_between_points', $post_id[0], $user_id, $points );
    do_action( 'gamipress_qsm_complete_specifc_quiz_between_points', $post_id[0], $user_id, $points );

}
add_action( 'qsm_quiz_submitted', 'gamipress_qsm_submission_listener', 10, 4 );