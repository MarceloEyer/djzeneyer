<?php
/**
 * Triggers
 *
 * @package GamiPress\FluentCommunity\Triggers
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register plugin specific triggers
 *
 * @since  1.0.0
 *
 * @param array $triggers
 * @return mixed
 */
function gamipress_fluentcommunity_activity_triggers( $triggers ) {

    // Spaces
    $triggers[__( 'FluentCommunity Spaces', 'gamipress' )] = array(
        // Publish post
        'gamipress_fluentcommunity_publish_post'                => __( 'Publish a post in any space', 'gamipress' ),
        'gamipress_fluentcommunity_specific_publish_post'       => __( 'Publish a post in a specific space', 'gamipress' ),
        // Delete post
        'gamipress_fluentcommunity_delete_post'                 => __( 'Remove a post from any space', 'gamipress' ),
        'gamipress_fluentcommunity_specific_delete_post'        => __( 'Remove a post from a specific space', 'gamipress' ),
        // React post
        'gamipress_fluentcommunity_react_post'                  => __( 'React a post of any space', 'gamipress' ),
        'gamipress_fluentcommunity_specific_react_post'         => __( 'React a post of specific space', 'gamipress' ),
        // Request join space
        'gamipress_fluentcommunity_request_join_space'          => __( 'Request to join any space', 'gamipress' ),
        'gamipress_fluentcommunity_request_join_specific_space' => __( 'Request to join specific space', 'gamipress' ),
        // Join space
        'gamipress_fluentcommunity_join_space'                  => __( 'Join any space', 'gamipress' ),
        'gamipress_fluentcommunity_join_specific_space'         => __( 'Join a specific space', 'gamipress' ),
        // Leave space
        'gamipress_fluentcommunity_leave_space'                 => __( 'Leave any space', 'gamipress' ),
        'gamipress_fluentcommunity_leave_specific_space'        => __( 'Leave a specific space', 'gamipress' ),
        // Add comment
        'gamipress_fluentcommunity_add_comment'                 => __( 'Add a comment in any space', 'gamipress' ),
        'gamipress_fluentcommunity_specific_add_comment'        => __( 'Add a comment in a specific space', 'gamipress' ),
        // Delete comment
        'gamipress_fluentcommunity_delete_comment'              => __( 'Delete a comment in any space', 'gamipress' ),
        'gamipress_fluentcommunity_specific_delete_comment'     => __( 'Delete a comment in a specific space', 'gamipress' ),
        // Create space
        'gamipress_fluentcommunity_create_space'                => __( 'Create a space', 'gamipress' ),
        // Delete space
        'gamipress_fluentcommunity_delete_space'                => __( 'Delete any space', 'gamipress' ),
        'gamipress_fluentcommunity_delete_specific_space'       => __( 'Delete a specific space', 'gamipress' ),
    );

    // Courses
    $triggers[__( 'FluentCommunity Courses', 'gamipress' )] = array(
        // Complete course
        'gamipress_fluentcommunity_complete_course'             => __( 'Complete any course', 'gamipress' ),
        'gamipress_fluentcommunity_complete_specific_course'    => __( 'Complete a specific course', 'gamipress' ),
        // Enroll course
        'gamipress_fluentcommunity_enroll_course'               => __( 'Enroll in any course', 'gamipress' ),
        'gamipress_fluentcommunity_enroll_specific_course'      => __( 'Enroll in a specific course', 'gamipress' ),
        // Unroll course
        'gamipress_fluentcommunity_unroll_course'               => __( 'Unroll from any course', 'gamipress' ),
        'gamipress_fluentcommunity_unroll_specific_course'      => __( 'Unroll from a specific course', 'gamipress' ),
        // Create course
        'gamipress_fluentcommunity_create_course'               => __( 'Create a course', 'gamipress' ),
        // Delete course
        'gamipress_fluentcommunity_delete_course'               => __( 'Delete any course', 'gamipress' ),
        'gamipress_fluentcommunity_delete_specific_course'      => __( 'Delete a specific course', 'gamipress' ),
        
    );

    // Quizzes
    $triggers[__( 'FluentCommunity Quizzes', 'gamipress' )] = array(
        // Attempt quiz
        'gamipress_fluentcommunity_attempt_quiz'            => __( 'Attempt any quiz', 'gamipress' ),
        'gamipress_fluentcommunity_attempt_specific_quiz'   => __( 'Attempt a specific quiz', 'gamipress' ),
        // Pass quiz
        'gamipress_fluentcommunity_pass_quiz'               => __( 'Pass any quiz', 'gamipress' ),
        'gamipress_fluentcommunity_pass_specific_quiz'      => __( 'Pass a specific quiz', 'gamipress' ),
        // Fail quiz
        'gamipress_fluentcommunity_fail_quiz'               => __( 'Fail any quiz', 'gamipress' ),
        'gamipress_fluentcommunity_fail_specific_quiz'      => __( 'Fail a specific quiz', 'gamipress' ),
        
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_fluentcommunity_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_fluentcommunity_specific_activity_triggers( $specific_activity_triggers ) {

    // Spaces
    $specific_activity_triggers['gamipress_fluentcommunity_specific_publish_post'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_specific_delete_post'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_specific_react_post'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_request_join_specific_space'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_join_specific_space'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_leave_specific_space'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_specific_add_comment'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_specific_delete_comment'] = array( 'fluentcommunity_spaces' );
    $specific_activity_triggers['gamipress_fluentcommunity_delete_specific_space'] = array( 'fluentcommunity_spaces' );

    // Courses
    $specific_activity_triggers['gamipress_fluentcommunity_complete_specific_course'] = array( 'fluentcommunity_courses' );
    $specific_activity_triggers['gamipress_fluentcommunity_enroll_specific_course'] = array( 'fluentcommunity_courses' );
    $specific_activity_triggers['gamipress_fluentcommunity_unroll_specific_course'] = array( 'fluentcommunity_courses' );
    $specific_activity_triggers['gamipress_fluentcommunity_delete_specific_course'] = array( 'fluentcommunity_courses' );

    // Quizzes
    $specific_activity_triggers['gamipress_fluentcommunity_attempt_specific_quiz'] = array( 'fluentcommunity_quizzes' );
    $specific_activity_triggers['gamipress_fluentcommunity_pass_specific_quiz'] = array( 'fluentcommunity_quizzes' );
    $specific_activity_triggers['gamipress_fluentcommunity_fail_specific_quiz'] = array( 'fluentcommunity_quizzes' );

    return $specific_activity_triggers;

}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_fluentcommunity_specific_activity_triggers' );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_fluentcommunity_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    // Spaces
    $specific_activity_trigger_labels['gamipress_fluentcommunity_specific_publish_post'] = __( 'Publish a post in %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_specific_delete_post'] = __( 'Remove a post from %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_specific_react_post'] = __( 'React a post of %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_request_join_specific_space'] = __( 'Request to join %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_join_specific_space'] = __( 'Join %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_leave_specific_space'] = __( 'Leave %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_specific_add_comment'] = __( 'Add a comment in %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_specific_delete_comment'] = __( 'Delete a comment in %s space', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_delete_specific_space'] = __( 'Delete %s space', 'gamipress' );

    // Courses
    $specific_activity_trigger_labels['gamipress_fluentcommunity_complete_specific_course'] = __( 'Complete %s course', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_enroll_specific_course'] = __( 'Enroll in %s course', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_unroll_specific_course'] = __( 'Unroll from %s course', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_delete_specific_course'] = __( 'Delete %s course', 'gamipress' );

    // Quizzes
    $specific_activity_trigger_labels['gamipress_fluentcommunity_attempt_specific_quiz'] = __( 'Attempt %s quiz', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_pass_specific_quiz'] = __( 'Pass %s quiz', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentcommunity_fail_specific_quiz'] = __( 'Fail %s quiz', 'gamipress' );

    return $specific_activity_trigger_labels;
}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_fluentcommunity_specific_activity_trigger_label' );

/**
 * Get plugin specific activity trigger post title
 *
 * @since  1.0.0
 *
 * @param  string   $post_title
 * @param  integer  $specific_id
 * @param  string   $trigger_type
 *
 * @return string
 */
function gamipress_fluentcommunity_specific_activity_trigger_post_title( $post_title, $specific_id, $trigger_type ) {

    switch( $trigger_type ) {
        case 'gamipress_fluentcommunity_specific_publish_post':
        case 'gamipress_fluentcommunity_specific_delete_post':
        case 'gamipress_fluentcommunity_specific_react_post':
        case 'gamipress_fluentcommunity_request_join_specific_space':
        case 'gamipress_fluentcommunity_join_specific_space':
        case 'gamipress_fluentcommunity_leave_specific_space':
        case 'gamipress_fluentcommunity_specific_add_comment':
        case 'gamipress_fluentcommunity_specific_delete_comment':
        case 'gamipress_fluentcommunity_delete_specific_space':
            if( absint( $specific_id ) !== 0 ) {

                // Get the space title
                $space_title = gamipress_fluentcommunity_get_space_title( $specific_id );

                $post_title = $space_title;
            }
            break;
        // Courses
        case 'gamipress_fluentcommunity_complete_specific_course':
        case 'gamipress_fluentcommunity_enroll_specific_course':
        case 'gamipress_fluentcommunity_unroll_specific_course':
        case 'gamipress_fluentcommunity_delete_specific_course':
            if( absint( $specific_id ) !== 0 ) {

                // Get the course title
                $course_title = gamipress_fluentcommunity_get_course_title( $specific_id );

                $post_title = $course_title;
            }
            break;
        // Quizzes
        case 'gamipress_fluentcommunity_attempt_specific_quiz':
        case 'gamipress_fluentcommunity_pass_specific_quiz':
        case 'gamipress_fluentcommunity_fail_specific_quiz':
            if( absint( $specific_id ) !== 0 ) {

                // Get the quiz title
                $quiz_title = gamipress_fluentcommunity_get_quiz_title( $specific_id );

                $post_title = $quiz_title;
            }
            break;
    }

    return $post_title;

}
add_filter( 'gamipress_specific_activity_trigger_post_title', 'gamipress_fluentcommunity_specific_activity_trigger_post_title', 10, 3 );

/**
 * Get plugin specific activity trigger permalink
 *
 * @since  1.0.0
 *
 * @param  string   $permalink
 * @param  integer  $specific_id
 * @param  string   $trigger_type
 * @param  integer  $site_id
 *
 * @return string
 */
function gamipress_fluentcommunity_specific_activity_trigger_permalink( $permalink, $specific_id, $trigger_type, $site_id ) {

    switch( $trigger_type ) {
        case 'gamipress_fluentcommunity_specific_publish_post':
        case 'gamipress_fluentcommunity_specific_delete_post':
        case 'gamipress_fluentcommunity_specific_react_post':
        case 'gamipress_fluentcommunity_request_join_specific_space':
        case 'gamipress_fluentcommunity_join_specific_space':
        case 'gamipress_fluentcommunity_leave_specific_space':
        case 'gamipress_fluentcommunity_specific_add_comment':
        case 'gamipress_fluentcommunity_specific_delete_comment':
        case 'gamipress_fluentcommunity_delete_specific_space':
        // Courses
        case 'gamipress_fluentcommunity_complete_specific_course':
        case 'gamipress_fluentcommunity_enroll_specific_course':
        case 'gamipress_fluentcommunity_unroll_specific_course':
        case 'gamipress_fluentcommunity_delete_specific_course':
        // Quizzes
        case 'gamipress_fluentcommunity_attempt_specific_quiz':
        case 'gamipress_fluentcommunity_pass_specific_quiz':
        case 'gamipress_fluentcommunity_fail_specific_quiz':
            $permalink = '';
            break;
    }

    return $permalink;

}
add_filter( 'gamipress_specific_activity_trigger_permalink', 'gamipress_fluentcommunity_specific_activity_trigger_permalink', 10, 4 );

/**
 * Get user for a fluentcommunityn trigger action.
 *
 * @since  1.0.0
 *
 * @param  integer $user_id user ID to override.
 * @param  string  $trigger Trigger name.
 * @param  array   $args    Passed trigger args.
 * @return integer          User ID.
 */
function gamipress_fluentcommunity_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch ( $trigger ) {
        // Spaces
        // Publish post
        case 'gamipress_fluentcommunity_publish_post':
        case 'gamipress_fluentcommunity_specific_publish_post':
        // Delete post
        case 'gamipress_fluentcommunity_delete_post':
        case 'gamipress_fluentcommunity_specific_delete_post':
        // React post
        case 'gamipress_fluentcommunity_react_post':
        case 'gamipress_fluentcommunity_specific_react_post':
        // Request join space
        case 'gamipress_fluentcommunity_request_join_space':
        case 'gamipress_fluentcommunity_request_join_specific_space':
        // Join space
        case 'gamipress_fluentcommunity_join_space':
        case 'gamipress_fluentcommunity_join_specific_space':
        // Leave space
        case 'gamipress_fluentcommunity_leave_space':
        case 'gamipress_fluentcommunity_leave_specific_space':
        // Add comment
        case 'gamipress_fluentcommunity_add_comment':
        case 'gamipress_fluentcommunity_specific_add_comment':
        // Delete comment
        case 'gamipress_fluentcommunity_delete_comment':
        case 'gamipress_fluentcommunity_specific_delete_comment':
        // Create space
        case 'gamipress_fluentcommunity_create_space':
        // Delete space
        case 'gamipress_fluentcommunity_delete_space':
        case 'gamipress_fluentcommunity_delete_specific_space':
    
        // Courses
        // Complete course
        case 'gamipress_fluentcommunity_complete_course':
        case 'gamipress_fluentcommunity_complete_specific_course':
        // Enroll course
        case 'gamipress_fluentcommunity_enroll_course':
        case 'gamipress_fluentcommunity_enroll_specific_course':
        // Unroll course
        case 'gamipress_fluentcommunity_unroll_course':
        case 'gamipress_fluentcommunity_unroll_specific_course':
        // Create course
        case 'gamipress_fluentcommunity_create_course':
        // Delete course
        case 'gamipress_fluentcommunity_delete_course':
        case 'gamipress_fluentcommunity_delete_specific_course':

        // Quizzes
        // Attempt quiz
        case 'gamipress_fluentcommunity_attempt_quiz':
        case 'gamipress_fluentcommunity_attempt_specific_quiz':
        // Pass quiz
        case 'gamipress_fluentcommunity_pass_quiz':
        case 'gamipress_fluentcommunity_pass_specific_quiz':
        // Fail quiz
        case 'gamipress_fluentcommunity_fail_quiz':
        case 'gamipress_fluentcommunity_fail_specific_quiz':            
            $user_id = $args[1];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_fluentcommunity_trigger_get_user_id', 10, 3 );

/**
 * Get the id for a fluentcommunityn specific trigger action.
 *
 * @since  1.0.0
 *
 * @param  integer  $specific_id Specific ID.
 * @param  string  $trigger Trigger name.
 * @param  array   $args    Passed trigger args.
 *
 * @return integer          Specific ID.
 */
function gamipress_fluentcommunity_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch ( $trigger ) {
        // Spaces
        case 'gamipress_fluentcommunity_specific_publish_post':
        case 'gamipress_fluentcommunity_specific_delete_post':
        case 'gamipress_fluentcommunity_specific_react_post':
        case 'gamipress_fluentcommunity_request_join_specific_space':
        case 'gamipress_fluentcommunity_join_specific_space':
        case 'gamipress_fluentcommunity_leave_specific_space':
        case 'gamipress_fluentcommunity_specific_add_comment':
        case 'gamipress_fluentcommunity_specific_delete_comment':
        case 'gamipress_fluentcommunity_delete_specific_space':
        
        // Courses
        case 'gamipress_fluentcommunity_complete_specific_course':
        case 'gamipress_fluentcommunity_enroll_specific_course':
        case 'gamipress_fluentcommunity_unroll_specific_course':
        case 'gamipress_fluentcommunity_delete_specific_course':

        // Quizzes
        case 'gamipress_fluentcommunity_attempt_specific_quiz':
        case 'gamipress_fluentcommunity_pass_specific_quiz':
        case 'gamipress_fluentcommunity_fail_specific_quiz':
            $specific_id = $args[0];
            break;
    }

    return $specific_id;
}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_fluentcommunity_specific_trigger_get_id', 10, 3 );

/**
 * Extended meta data for event trigger logging
 *
 * @since 1.0.0
 *
 * @param array 	$log_meta
 * @param integer 	$user_id
 * @param string 	$trigger
 * @param integer 	$site_id
 * @param array 	$args
 *
 * @return array
 */
function gamipress_fluentcommunity_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch ( $trigger ) {
        // Spaces
        // Publish post
        case 'gamipress_fluentcommunity_publish_post':
        case 'gamipress_fluentcommunity_specific_publish_post':
        // Delete post
        case 'gamipress_fluentcommunity_delete_post':
        case 'gamipress_fluentcommunity_specific_delete_post':
        // React post
        case 'gamipress_fluentcommunity_react_post':
        case 'gamipress_fluentcommunity_specific_react_post':
        // Request join space
        case 'gamipress_fluentcommunity_request_join_space':
        case 'gamipress_fluentcommunity_request_join_specific_space':
        // Join space
        case 'gamipress_fluentcommunity_join_space':
        case 'gamipress_fluentcommunity_join_specific_space':
        // Leave space
        case 'gamipress_fluentcommunity_leave_space':
        case 'gamipress_fluentcommunity_leave_specific_space':
        // Add comment
        case 'gamipress_fluentcommunity_add_comment':
        case 'gamipress_fluentcommunity_specific_add_comment':
        // Delete comment
        case 'gamipress_fluentcommunity_delete_comment':
        case 'gamipress_fluentcommunity_specific_delete_comment':
        // Create space
        case 'gamipress_fluentcommunity_create_space':
        // Delete space
        case 'gamipress_fluentcommunity_delete_space':
        case 'gamipress_fluentcommunity_delete_specific_space':
            // Add the space ID
            $log_meta['space_id'] = $args[0];
            break;
        
        // Courses
        // Complete course
        case 'gamipress_fluentcommunity_complete_course':
        case 'gamipress_fluentcommunity_complete_specific_course':
        // Enroll course
        case 'gamipress_fluentcommunity_enroll_course':
        case 'gamipress_fluentcommunity_enroll_specific_course':
        // Unroll course
        case 'gamipress_fluentcommunity_unroll_course':
        case 'gamipress_fluentcommunity_unroll_specific_course':
        // Create course
        case 'gamipress_fluentcommunity_create_course':
        // Delete course
        case 'gamipress_fluentcommunity_delete_course':
        case 'gamipress_fluentcommunity_delete_specific_course': 
            // Add the course ID
            $log_meta['course_id'] = $args[0];
            break;

        // Quizzes
        // Attempt quiz
        case 'gamipress_fluentcommunity_attempt_quiz':
        case 'gamipress_fluentcommunity_attempt_specific_quiz':
        // Pass quiz
        case 'gamipress_fluentcommunity_pass_quiz':
        case 'gamipress_fluentcommunity_pass_specific_quiz':
        // Fail quiz
        case 'gamipress_fluentcommunity_fail_quiz':
        case 'gamipress_fluentcommunity_fail_specific_quiz':            
            $log_meta['quiz_id'] = $args[0];
            break;
    }

    return $log_meta;
}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_fluentcommunity_log_event_trigger_meta_data', 10, 5 );