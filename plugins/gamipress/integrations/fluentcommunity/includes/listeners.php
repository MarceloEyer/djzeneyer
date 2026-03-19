<?php
/**
 * Listeners
 *
 * @package GamiPress\FluentCommunity\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Publish post listener
 *
 * @since  1.0.0
 *
 * @param object    $feed 
 */
function gamipress_fluentcommunity_post_added( $feed ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $feed_data = $feed->getOriginal();

    // Trigger publish post any space
    do_action( 'gamipress_fluentcommunity_publish_post', $feed_data['space_id'], $user_id );

    // Trigger publish post specific space
    do_action( 'gamipress_fluentcommunity_specific_publish_post', $feed_data['space_id'], $user_id );

}
add_action( 'fluent_community/feed/created', 'gamipress_fluentcommunity_post_added' );

/**
 * Delete post listener
 *
 * @since  1.0.0
 *
 * @param object    $feed 
 */
function gamipress_fluentcommunity_post_deleted( $feed ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $feed_data = $feed->getOriginal();

    // Trigger delete post any space
    do_action( 'gamipress_fluentcommunity_delete_post', $feed_data['space_id'], $user_id );

    // Trigger delete post specific space
    do_action( 'gamipress_fluentcommunity_specific_delete_post', $feed_data['space_id'], $user_id );

}
add_action( 'fluent_community/feed/before_deleted', 'gamipress_fluentcommunity_post_deleted' );

/**
 * React post listener
 *
 * @since  1.0.0
 *
 * @param object    $reaction 
 * @param object    $feed 
 */
function gamipress_fluentcommunity_post_reaction( $reaction, $feed ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $feed_data = $feed->getOriginal();

    // Trigger react post any space
    do_action( 'gamipress_fluentcommunity_react_post', $feed_data['space_id'], $user_id );

    // Trigger react post specific space
    do_action( 'gamipress_fluentcommunity_specific_react_post', $feed_data['space_id'], $user_id );

}
add_action( 'fluent_community/feed/react_added', 'gamipress_fluentcommunity_post_reaction', 10, 2 );

/**
 * Request join space listener
 *
 * @since  1.0.0
 *
 * @param object    $reaction 
 * @param int       $userId 
 */
function gamipress_fluentcommunity_request_join_space( $space, $userId ) {

    $space_data = $space->getOriginal();

    // Trigger request join any space
    do_action( 'gamipress_fluentcommunity_request_join_space', $space_data['id'], $userId );

    // Trigger request join specific space
    do_action( 'gamipress_fluentcommunity_request_join_specific_space', $space_data['id'], $userId );

}
add_action( 'fluent_community/space/join_requested', 'gamipress_fluentcommunity_request_join_space', 10, 2 );

/**
 * Join space listener
 *
 * @since  1.0.0
 *
 * @param object    $reaction 
 * @param int       $userId 
 * @param string    $by   Self, by_admin, by_automation
 */
function gamipress_fluentcommunity_join_space( $space, $userId, $by ) {

    $space_data = $space->getOriginal();

    // Trigger join any space
    do_action( 'gamipress_fluentcommunity_join_space', $space_data['id'], $userId );

    // Trigger join specific space
    do_action( 'gamipress_fluentcommunity_join_specific_space', $space_data['id'], $userId );

}
add_action( 'fluent_community/space/joined', 'gamipress_fluentcommunity_join_space', 10, 3 );

/**
 * Leave space listener
 *
 * @since  1.0.0
 *
 * @param object    $reaction 
 * @param int       $userId 
 * @param string    $by   Self, by_admin, by_automation
 */
function gamipress_fluentcommunity_leave_space( $space, $userId, $by ) {

    $space_data = $space->getOriginal();

    // Trigger leave any space
    do_action( 'gamipress_fluentcommunity_leave_space', $space_data['id'], $userId );

    // Trigger leave specific space
    do_action( 'gamipress_fluentcommunity_leave_specific_space', $space_data['id'], $userId );

}
add_action( 'fluent_community/space/user_left', 'gamipress_fluentcommunity_leave_space', 10, 3 );

/**
 * Add comment listener
 *
 * @since  1.0.0
 *
 * @param object    $comment    
 * @param object    $feed   
 */
function gamipress_fluentcommunity_add_comment( $comment, $feed ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $feed_data = $feed->getOriginal();

    // Trigger add comment any space
    do_action( 'gamipress_fluentcommunity_add_comment', $feed_data['space_id'], $user_id );

    // Trigger add comment specific space
    do_action( 'gamipress_fluentcommunity_specific_add_comment', $feed_data['space_id'], $user_id );

}
add_action( 'fluent_community/comment_added', 'gamipress_fluentcommunity_add_comment', 10, 2 );

/**
 * Delete comment listener
 *
 * @since  1.0.0
 *
 * @param int       $commentId    
 * @param object    $feed 
 */
function gamipress_fluentcommunity_delete_comment( $commentId, $feed ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $feed_data = $feed->getOriginal();

    // Trigger add comment any space
    do_action( 'gamipress_fluentcommunity_delete_comment', $feed_data['space_id'], $user_id );

    // Trigger add comment specific space
    do_action( 'gamipress_fluentcommunity_specific_delete_comment', $feed_data['space_id'], $user_id );

}
add_action( 'fluent_community/comment_deleted', 'gamipress_fluentcommunity_delete_comment', 10, 2 );

/**
 * Create space listener
 *
 * @since  1.0.0
 *
 * @param object    $space
 * @param object    $data  
 */
function gamipress_fluentcommunity_create_space( $space, $data ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $space_data = $space->getOriginal();

    // Trigger create space
    do_action( 'gamipress_fluentcommunity_create_space', $space_data['id'], $user_id );

}
add_action( 'fluent_community/space/created', 'gamipress_fluentcommunity_create_space', 10, 2 );

/**
 * Delete space listener
 *
 * @since  1.0.0
 *
 * @param object    $space 
 */
function gamipress_fluentcommunity_delete_space( $space ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $space_data = $space->getOriginal();

    // Trigger add comment any space
    do_action( 'gamipress_fluentcommunity_delete_space', $space_data['id'], $user_id );

    // Trigger add comment specific space
    do_action( 'gamipress_fluentcommunity_delete_specific_space', $space_data['id'], $user_id );

}
add_action( 'fluent_community/space/before_delete', 'gamipress_fluentcommunity_delete_space' );

/**
 * Complete course listener
 *
 * @since  1.0.0
 *
 * @param object    $course 
 * @param int       $userId 
 */
function gamipress_fluentcommunity_complete_course( $course, $userId ) {

    $course_data = $course->getOriginal();

    // Trigger complete any course
    do_action( 'gamipress_fluentcommunity_complete_course', $course_data['id'], $userId );

    // Trigger complete specific course
    do_action( 'gamipress_fluentcommunity_complete_specific_course', $course_data['id'], $userId );

}
add_action( 'fluent_community/course/completed', 'gamipress_fluentcommunity_complete_course', 10, 2 );

/**
 * Enroll course listener
 *
 * @since  1.0.0
 *
 * @param object    $course 
 * @param int       $userId 
 */
function gamipress_fluentcommunity_enroll_course( $course, $userId ) {

    $course_data = $course->getOriginal();

    // Trigger enroll any course
    do_action( 'gamipress_fluentcommunity_enroll_course', $course_data['id'], $userId );

    // Trigger enroll specific course
    do_action( 'gamipress_fluentcommunity_enroll_specific_course', $course_data['id'], $userId );

}
add_action( 'fluent_community/course/enrolled', 'gamipress_fluentcommunity_enroll_course', 10, 2 );

/**
 * Unroll course listener
 *
 * @since  1.0.0
 *
 * @param object    $course 
 * @param int       $userId 
 */
function gamipress_fluentcommunity_unroll_course( $course, $userId ) {

    $course_data = $course->getOriginal();

    // Trigger unroll any course
    do_action( 'gamipress_fluentcommunity_unroll_course', $course_data['id'], $userId );

    // Trigger unroll specific course
    do_action( 'gamipress_fluentcommunity_unroll_specific_course', $course_data['id'], $userId );

}
add_action( 'fluent_community/course/student_left', 'gamipress_fluentcommunity_unroll_course', 10, 2 );

/**
 * Create course listener
 *
 * @since  1.0.0
 *
 * @param object    $course
 */
function gamipress_fluentcommunity_create_course( $course ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $course_data = $course->getOriginal();

    // Trigger create course
    do_action( 'gamipress_fluentcommunity_create_course', $course_data['id'], $user_id );

}
add_action( 'fluent_community/course/created', 'gamipress_fluentcommunity_create_course' );

/**
 * Delete course listener
 *
 * @since  1.0.0
 *
 * @param object    $course 
 */
function gamipress_fluentcommunity_delete_course( $course ) {

    $user_id = get_current_user_id();

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    $course_data = $course->getOriginal();

    // Trigger delete any course
    do_action( 'gamipress_fluentcommunity_delete_course', $course_data['id'], $user_id );

    // Trigger delete specific course
    do_action( 'gamipress_fluentcommunity_delete_specific_course', $course_data['id'], $user_id );

}
add_action( 'fluent_community/course/before_delete', 'gamipress_fluentcommunity_delete_course' );

/**
 * Quizzes listener
 *
 * @since  1.0.0
 *
 * @param object    $quizResult
 * @param object    $user
 * @param object    $quiz 
 */
function gamipress_fluentcommunity_quiz_submitted( $quizResult, $user, $quiz ) {

    // Results data
    $quiz_result_data = $quizResult->getOriginal();

    // Quiz data
    $quiz_data = $quiz->getOriginal();

    // Shorthand
    $user_id = absint( $quiz_result_data['user_id'] );
    $quiz_id = absint( $quiz_data['id'] );
    $status = $quiz_result_data['status']; // passed or failed

    // Bail if no user
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger attempt any quiz
    do_action( 'gamipress_fluentcommunity_attempt_quiz', $quiz_id, $user_id );

    // Trigger attempt specific quiz
    do_action( 'gamipress_fluentcommunity_attempt_specific_quiz', $quiz_id, $user_id );

    if ( $status === 'passed' ) {

        // Trigger pass any quiz
        do_action( 'gamipress_fluentcommunity_pass_quiz', $quiz_id, $user_id );

        // Trigger pass specific quiz
        do_action( 'gamipress_fluentcommunity_pass_specific_quiz', $quiz_id, $user_id );

    } else if ( $status === 'failed' ) {

        // Trigger fail any quiz
        do_action( 'gamipress_fluentcommunity_fail_quiz', $quiz_id, $user_id );

        // Trigger fail specific quiz
        do_action( 'gamipress_fluentcommunity_fail_specific_quiz', $quiz_id, $user_id );

    }

}
add_action( 'fluent_community/quiz/submitted', 'gamipress_fluentcommunity_quiz_submitted', 10, 3 );