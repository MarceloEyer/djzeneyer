<?php
/**
 * Triggers
 *
 * @package GamiPress\QSM\Triggers
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register plugin specific triggers
 *
 * @since 1.0.0
 *
 * @param array $triggers
 * @return mixed
 */
function gamipress_qsm_activity_triggers( $triggers ) {

    $triggers[__( 'Quiz Master Survey', 'gamipress' )] = array(

        // Quizzes
        'gamipress_qsm_new_quiz_submission'                 => __( 'Submit a quiz', 'gamipress' ),
        'gamipress_qsm_specific_new_quiz_submission'        => __( 'Submit a specific quiz', 'gamipress' ),

        // Minimum points
        'gamipress_qsm_complete_quiz_points'                 => __( 'Complete a quiz with a minimum amount of points', 'gamipress' ),
        'gamipress_qsm_complete_specific_quiz_points'        => __( 'Complete a specific quiz with a minimum amount of points', 'gamipress' ),

        // Maximum points
        'gamipress_qsm_complete_quiz_max_points'             => __( 'Complete a quiz with a maximum amount of points', 'gamipress' ),
        'gamipress_qsm_complete_specific_quiz_max_points'    => __( 'Complete a specific quiz with a maximum amount of points', 'gamipress' ),

        // Between pointss
        'gamipress_qsm_complete_quiz_between_points'         => __( 'Complete a quiz on a range of points', 'gamipress' ),
        'gamipress_qsm_complete_specifc_quiz_between_points' => __( 'Complete a specific quiz on a range of points', 'gamipress' ),

    );
    
    return $triggers;
}
add_filter( 'gamipress_activity_triggers', 'gamipress_qsm_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_qsm_specific_activity_triggers( $specific_activity_triggers ) {

    // Quizzes
    $specific_activity_triggers['gamipress_qsm_specific_new_quiz_submission'] = array( 'qsm_quiz' );

    // Minimum points
    $specific_activity_triggers['gamipress_qsm_complete_specific_quiz_points'] = array( 'qsm_quiz' );

    // Maximum points
    $specific_activity_triggers['gamipress_qsm_complete_specific_quiz_max_points'] = array( 'qsm_quiz' );

    // Between points
    $specific_activity_triggers['gamipress_qsm_complete_specifc_quiz_between_points'] = array( 'qsm_quiz' );

    return $specific_activity_triggers;
}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_qsm_specific_activity_triggers' );

/**
 * Build custom activity trigger label
 *
 * @param string    $title
 * @param integer   $requirement_id
 * @param array     $requirement
 *
 * @return string
 */
function gamipress_qsm_activity_trigger_label( $title, $requirement_id, $requirement ) {

    $points = ( isset( $requirement['qsm_points'] ) ) ? absint( $requirement['qsm_points'] ) : 0;
    $min_points = ( isset( $requirement['qsm_min_points'] ) ) ? absint( $requirement['qsm_min_points'] ) : 0;
    $max_points = ( isset( $requirement['qsm_max_points'] ) ) ? absint( $requirement['qsm_max_points'] ) : 0;

    switch( $requirement['trigger_type'] ) {

        // Minimum points events
        case 'gamipress_qsm_complete_quiz_points':
            return sprintf( __( 'Completed a quiz with a points of %d or higher', 'gamipress'), $points );
            break;
        case 'gamipress_qsm_complete_specific_quiz_points':
            $achievement_post_id = absint( $requirement['achievement_post'] );
            return sprintf( __( 'Completed the quiz %s with a points of %d or higher', 'gamipress' ), get_the_title( $achievement_post_id ), $points );
            break;

        // Maximum points events
        case 'gamipress_qsm_complete_quiz_max_points':
            return sprintf( __( 'Completed a quiz with a maximum points of %d or higher', 'gamipress' ), $points );
            break;
        case 'gamipress_qsm_complete_specific_quiz_max_points':
            $achievement_post_id = absint( $requirement['achievement_post'] );
            return sprintf( __( 'Completed a quiz %s with a maximum points of %d', 'gamipress' ), get_the_title( $achievement_post_id ), $points );
            break;

        // Between points events
        case 'gamipress_qsm_complete_quiz_between_points':
            return sprintf( __( 'Completed a quiz with a points between %d and %d', 'gamipress' ), $min_points, $max_points );
            break;
        case 'gamipress_qsm_complete_specifc_quiz_between_points':
            $achievement_post_id = absint( $requirement['achievement_post'] );
            return sprintf( __( 'Complete the quiz %s with a points between %d and %d', 'gamipress' ), get_the_title( $achievement_post_id ), $min_points, $max_points );
            break;
    }

    return $title;

}
add_filter( 'gamipress_activity_trigger_label', 'gamipress_qsm_activity_trigger_label', 10, 3 );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_qsm_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    // Quizzes
    $specific_activity_trigger_labels['gamipress_qsm_specific_new_quiz_submission'] = __( 'Submit %s', 'gamipress' );

    return $specific_activity_trigger_labels;
}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_qsm_specific_activity_trigger_label' );

/**
 * Get user for a given trigger action.
 *
 * @since  1.0.0
 *
 * @param  integer $user_id user ID to override.
 * @param  string  $trigger Trigger name.
 * @param  array   $args    Passed trigger args.
 * @return integer          User ID.
 */
function gamipress_qsm_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch ( $trigger ) {
        case 'gamipress_qsm_new_quiz_submission':
        case 'gamipress_qsm_specific_new_quiz_submission':
        case 'gamipress_qsm_complete_quiz_points':
        case 'gamipress_qsm_complete_specific_quiz_points':
        case 'gamipress_qsm_complete_quiz_max_points':
        case 'gamipress_qsm_complete_specific_quiz_max_points':
        case 'gamipress_qsm_complete_quiz_between_points':
        case 'gamipress_qsm_complete_specifc_quiz_between_points':
            $user_id = $args[1];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_qsm_trigger_get_user_id', 10, 3 );

/**
 * Get the id for a given specific trigger action.
 *
 * @since  1.0.0
 *
 * @param  integer  $specific_id Specific ID.
 * @param  string  $trigger Trigger name.
 * @param  array   $args    Passed trigger args.
 *
 * @return integer          Specific ID.
 */
function gamipress_qsm_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_qsm_specific_new_quiz_submission':
        case 'gamipress_qsm_complete_specific_quiz_points':
        case 'gamipress_qsm_complete_specific_quiz_max_points':
        case 'gamipress_qsm_complete_specifc_quiz_between_points':
            $specific_id = $args[0];
            break;
    }

    return $specific_id;
}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_qsm_specific_trigger_get_id', 10, 3 );

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
function gamipress_qsm_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch( $trigger ) {
        case 'gamipress_qsm_new_quiz_submission':
        case 'gamipress_qsm_specific_new_quiz_submission':
        case 'gamipress_qsm_complete_quiz_points':
        case 'gamipress_qsm_complete_specific_quiz_points':
        case 'gamipress_qsm_complete_quiz_max_points':
        case 'gamipress_qsm_complete_specific_quiz_max_points':
        case 'gamipress_qsm_complete_quiz_between_points':
        case 'gamipress_qsm_complete_quiz_between_points':
            
            // Add the quiz ID
            $log_meta['quiz_id'] = $args[0];
            $log_meta['points'] = $args[2];
            break;
        
    }

    return $log_meta;

}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_qsm_log_event_trigger_meta_data', 10, 5 );

/**
 * Extra data fields
 *
 * @since 1.0.0
 *
 * @param array     $fields
 * @param int       $log_id
 * @param string    $type
 *
 * @return array
 */
function gamipress_qsm_log_extra_data_fields( $fields, $log_id, $type ) {

    $prefix = '_gamipress_';

    $log = ct_get_object( $log_id );
    $trigger = $log->trigger_type;

    if( $type !== 'event_trigger' ) {
        return $fields;
    }

    switch( $trigger ) {
        case 'gamipress_qsm_new_quiz_submission':
        case 'gamipress_qsm_specific_new_quiz_submission':
        case 'gamipress_qsm_complete_quiz_points':
        case 'gamipress_qsm_complete_specific_quiz_points':
        case 'gamipress_qsm_complete_quiz_max_points':
        case 'gamipress_qsm_complete_specific_quiz_max_points':
        case 'gamipress_qsm_complete_quiz_between_points':
        case 'gamipress_qsm_complete_quiz_between_points':
            $fields[] = array(
                'name' 	            => __( 'Total points', 'gamipress' ),
                'desc' 	            => __( 'Total points the user got on complete this quiz.', 'gamipress' ),
                'id'   	            => $prefix . 'points',
                'type' 	            => 'text',
            );
            break;
    }

    return $fields;

}
add_filter( 'gamipress_log_extra_data_fields', 'gamipress_qsm_log_extra_data_fields', 10, 3 );

/**
 * Override the meta data to filter the logs count
 *
 * @since   1.0.0
 *
 * @param  array    $log_meta       The meta data to filter the logs count
 * @param  int      $user_id        The given user's ID
 * @param  string   $trigger        The given trigger we're checking
 * @param  int      $since 	        The since timestamp where retrieve the logs
 * @param  int      $site_id        The desired Site ID to check
 * @param  array    $args           The triggered args or requirement object
 *
 * @return array                    The meta data to filter the logs count
 */
function gamipress_qsm_get_user_trigger_count_log_meta( $log_meta, $user_id, $trigger, $since, $site_id, $args ) {

    switch( $trigger ) {
        case 'gamipress_qsm_complete_quiz_points':
        case 'gamipress_qsm_complete_specific_quiz_points':

            $points = 0;

            if( isset( $args[2] ) ) {
                // Add the points
                $points = $args[2];
            }

            // $args could be a requirement object
            if( isset( $args['qsm_points'] ) ) {
                // Add the points
                $points = $args['qsm_points'];
            }

            $log_meta['points'] = array(
                'key' => 'points',
                'value' => (int) $points,
                'compare' => '>=',
                'type' => 'integer',
            );
            break;
        case 'gamipress_qsm_complete_quiz_max_points':
        case 'gamipress_qsm_complete_specific_quiz_max_points':
            
            $points = 0;

            if( isset( $args[2] ) ) {
                // Add the points
                $points = $args[2];
            }

            // $args could be a requirement object
            if( isset( $args['qsm_points'] ) ) {
                // Add the points
                $points = $args['qsm_points'];
            }

            $log_meta['points'] = array(
                'key' => 'points',
                'value' => (int) $points,
                'compare' => '<=',
                'type' => 'integer',
            );
            break;
        case 'gamipress_qsm_complete_quiz_between_points':
        case 'gamipress_qsm_complete_quiz_between_points':

            if( isset( $args[2] ) ) {
                // Add the points
                $points = $args[2];

                $log_meta['points'] = array(
                    'key' => 'points',
                    'value' => $points,
                    'compare' => '>=',
                    'type' => 'integer',
                );

            }

            // $args could be a requirement object
            if( isset( $args['qsm_min_points'] ) ) {
                // Add the points
                $min_points = $args['qsm_min_points'];

                $log_meta['points'] = array(
                    'key' => 'points',
                    'value' => $min_points,
                    'compare' => '>=',
                    'type' => 'integer',
                );

            }

            // $args could be a requirement object
            if( isset( $args['qsm_max_points'] ) ) {
                // Add the points
                $max_points = $args['qsm_max_points'];

                $log_meta['points'] = array(
                    'key' => 'points',
                    'value' => $max_points,
                    'compare' => '<=',
                    'type' => 'integer',
                );
                
            }
            break;
    }

    return $log_meta;

}
add_filter( 'gamipress_get_user_trigger_count_log_meta', 'gamipress_qsm_get_user_trigger_count_log_meta', 10, 6 );