<?php
/**
 * Triggers
 *
 * @package GamiPress\FluentBooking\Triggers
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register plugin activity triggers
 *
 * @param array $triggers
 * @return mixed
 */
function gamipress_fluentbooking_activity_triggers( $triggers ) {

    // FluentBooking
    $triggers[__( 'FluentBooking', 'gamipress' )] = array(
        // One-to-one meetings
        // Schedule
        'gamipress_fluentbooking_schedule_single_meeting'            => __( 'Schedule a one-to-one meeting', 'gamipress' ),
        'gamipress_fluentbooking_schedule_specific_single_meeting'    => __( 'Schedule a specific one-to-one meeting', 'gamipress' ),
        'gamipress_fluentbooking_schedule_host_single_meeting'    => __( 'Schedule one-to-one meeting with specific host', 'gamipress' ),
        // Cancel
        'gamipress_fluentbooking_cancel_single_meeting'          => __( 'Cancel a one-to-one meeting', 'gamipress' ),
        'gamipress_fluentbooking_cancel_specific_single_meeting'  => __( 'Cancel a specific one-to-one meeting', 'gamipress' ),
        'gamipress_fluentbooking_cancel_host_single_meeting'    => __( 'Cancel one-to-one meeting with specific host', 'gamipress' ),

        // Team meetings
        // Schedule
        'gamipress_fluentbooking_schedule_team_meeting'            => __( 'Schedule a team meeting', 'gamipress' ),
        'gamipress_fluentbooking_schedule_specific_team_meeting'    => __( 'Schedule a specific team meeting', 'gamipress' ),
        'gamipress_fluentbooking_schedule_host_team_meeting'    => __( 'Schedule team meeting with specific host', 'gamipress' ),
        // Cancel
        'gamipress_fluentbooking_cancel_team_meeting'          => __( 'Cancel a team meeting', 'gamipress' ),
        'gamipress_fluentbooking_cancel_specific_team_meeting'  => __( 'Cancel a specific team meeting', 'gamipress' ),
        'gamipress_fluentbooking_cancel_host_team_meeting'    => __( 'Cancel team meeting with specific host', 'gamipress' ),
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_fluentbooking_activity_triggers' );

/**
 * Register specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_fluentbooking_specific_activity_triggers( $specific_activity_triggers ) {
    
    // Meetings
    $specific_activity_triggers['gamipress_fluentbooking_schedule_specific_single_meeting'] = array( 'single_meeting' );
    $specific_activity_triggers['gamipress_fluentbooking_cancel_specific_single_meeting'] = array( 'single_meeting' );
    $specific_activity_triggers['gamipress_fluentbooking_schedule_specific_team_meeting'] = array( 'team_meeting' );
    $specific_activity_triggers['gamipress_fluentbooking_cancel_specific_team_meeting'] = array( 'team_meeting' );
    // Hosts
    $specific_activity_triggers['gamipress_fluentbooking_schedule_host_single_meeting'] = array( 'hosts' );
    $specific_activity_triggers['gamipress_fluentbooking_cancel_host_single_meeting'] = array( 'hosts' );
    $specific_activity_triggers['gamipress_fluentbooking_schedule_host_team_meeting'] = array( 'hosts' );
    $specific_activity_triggers['gamipress_fluentbooking_cancel_host_team_meeting'] = array( 'hosts' );
    
    return $specific_activity_triggers;
}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_fluentbooking_specific_activity_triggers' );

/**
 * Register specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_fluentbooking_specific_activity_trigger_label( $specific_activity_trigger_labels ) {
  
    // Meetings
    $specific_activity_trigger_labels['gamipress_fluentbooking_schedule_specific_single_meeting'] = __( 'Schedule for one-to-one %s meeting', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentbooking_cancel_specific_single_meeting'] = __( 'Cancel for one-to-one %s meeting', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentbooking_schedule_specific_team_meeting'] = __( 'Schedule for team %s meeting', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentbooking_cancel_specific_team_meeting'] = __( 'Cancel for team %s meeting', 'gamipress' );
    // Hosts
    $specific_activity_trigger_labels['gamipress_fluentbooking_schedule_host_single_meeting'] = __( 'Schedule for one-to-one meeting with %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentbooking_cancel_host_single_meeting'] = __( 'Cancel for one-to-one meeting with %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentbooking_schedule_host_team_meeting'] = __( 'Schedule for team meeting with %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_fluentbooking_cancel_host_team_meeting'] = __( 'Cancel for team meeting with %s', 'gamipress' );
    
    return $specific_activity_trigger_labels;
}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_fluentbooking_specific_activity_trigger_label' );

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
function gamipress_fluentbooking_specific_activity_trigger_post_title( $post_title, $specific_id, $trigger_type ) {

    switch( $trigger_type ) {
        // One-to-one meetings
        case 'gamipress_fluentbooking_schedule_specific_single_meeting':
        case 'gamipress_fluentbooking_cancel_specific_single_meeting':
        // Team meetings
        case 'gamipress_fluentbooking_schedule_specific_team_meeting':
        case 'gamipress_fluentbooking_cancel_specific_team_meeting':
            if( absint( $specific_id ) !== 0 ) {
                // Get the meeting title
                $meeting_title = gamipress_fluentbooking_get_meeting_title( $specific_id );

                $post_title = $meeting_title;
            }
            break;
        // Hosts
        case 'gamipress_fluentbooking_schedule_host_single_meeting':
        case 'gamipress_fluentbooking_cancel_host_single_meeting':
        case 'gamipress_fluentbooking_schedule_host_team_meeting':
        case 'gamipress_fluentbooking_cancel_host_team_meeting':
            if( absint( $specific_id ) !== 0 ) {
            // Get the host title
            $host_title = gamipress_fluentbooking_get_host_title( $specific_id );
    
            $post_title = $host_title;
        }
        break;
    }

    return $post_title;

}
add_filter( 'gamipress_specific_activity_trigger_post_title', 'gamipress_fluentbooking_specific_activity_trigger_post_title', 10, 3 );

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
function gamipress_fluentbooking_specific_activity_trigger_permalink( $permalink, $specific_id, $trigger_type, $site_id ) {

    switch( $trigger_type ) {
        // One-to-one meetings
        case 'gamipress_fluentbooking_schedule_specific_single_meeting':
        case 'gamipress_fluentbooking_cancel_specific_single_meeting':
        // Team meetings
        case 'gamipress_fluentbooking_schedule_specific_team_meeting':
        case 'gamipress_fluentbooking_cancel_specific_team_meeting':
        // Hosts
        case 'gamipress_fluentbooking_schedule_host_single_meeting':
        case 'gamipress_fluentbooking_cancel_host_single_meeting':
        case 'gamipress_fluentbooking_schedule_host_team_meeting':
        case 'gamipress_fluentbooking_cancel_host_team_meeting':
            $permalink = '';
            break;
    }

    return $permalink;

}
add_filter( 'gamipress_specific_activity_trigger_permalink', 'gamipress_fluentbooking_specific_activity_trigger_permalink', 10, 4 );

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
function gamipress_fluentbooking_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch ( $trigger ) {
        // Meetings
        case 'gamipress_fluentbooking_schedule_single_meeting':
        case 'gamipress_fluentbooking_schedule_specific_single_meeting':
        case 'gamipress_fluentbooking_cancel_single_meeting':
        case 'gamipress_fluentbooking_cancel_specific_single_meeting':        
        case 'gamipress_fluentbooking_schedule_team_meeting':
        case 'gamipress_fluentbooking_schedule_specific_team_meeting':        
        case 'gamipress_fluentbooking_cancel_team_meeting':
        case 'gamipress_fluentbooking_cancel_specific_team_meeting':
        // Hosts
        case 'gamipress_fluentbooking_schedule_host_single_meeting':
        case 'gamipress_fluentbooking_cancel_host_single_meeting':
        case 'gamipress_fluentbooking_schedule_host_team_meeting':
        case 'gamipress_fluentbooking_cancel_host_team_meeting':
            $user_id = $args[1];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_fluentbooking_trigger_get_user_id', 10, 3 );

/**
 * Get the id for a given specific trigger action.
 *
 * @since  1.0.0
 *
 * @param  integer $specific_id Specific ID to override.
 * @param  string  $trigger     Trigger name.
 * @param  array   $args        Passed trigger args.
 *
 * @return integer              Specific ID.
 */
function gamipress_fluentbooking_specific_trigger_get_id( $specific_id, $trigger, $args ) {

    switch ( $trigger ) {
        // Meetings
        case 'gamipress_fluentbooking_schedule_specific_single_meeting':
        case 'gamipress_fluentbooking_cancel_specific_single_meeting':
        case 'gamipress_fluentbooking_schedule_specific_team_meeting':
        case 'gamipress_fluentbooking_cancel_specific_team_meeting':
            $specific_id = $args[0];
            break;
        // Hosts
        case 'gamipress_fluentbooking_schedule_host_single_meeting':
        case 'gamipress_fluentbooking_cancel_host_single_meeting':
        case 'gamipress_fluentbooking_schedule_host_team_meeting':
        case 'gamipress_fluentbooking_cancel_host_team_meeting':
            $specific_id = $args[3];
            break;
    }

    return $specific_id;

}

add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_fluentbooking_specific_trigger_get_id', 10, 3 );

/**
 * Extended meta data for event trigger logging
 *
 * @since 1.0.2
 *
 * @param array 	$log_meta
 * @param integer 	$user_id
 * @param string 	$trigger
 * @param integer 	$site_id
 * @param array 	$args
 *
 * @return array
 */
function gamipress_fluentbooking_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch ( $trigger ) {

        // Meetings
        case 'gamipress_fluentbooking_schedule_single_meeting':
        case 'gamipress_fluentbooking_schedule_specific_single_meeting':
        case 'gamipress_fluentbooking_cancel_single_meeting':
        case 'gamipress_fluentbooking_cancel_specific_single_meeting':
        case 'gamipress_fluentbooking_schedule_team_meeting':
        case 'gamipress_fluentbooking_schedule_specific_team_meeting':
        case 'gamipress_fluentbooking_cancel_team_meeting':
        case 'gamipress_fluentbooking_cancel_specific_team_meeting':
            // Add the event and booking IDs
            $log_meta['event_id'] = $args[0];
            $log_meta['booking_id'] = $args[2];
            break;

        // Hosts
        case 'gamipress_fluentbooking_schedule_host_single_meeting':
        case 'gamipress_fluentbooking_cancel_host_single_meeting':
        case 'gamipress_fluentbooking_schedule_host_team_meeting':
        case 'gamipress_fluentbooking_cancel_host_team_meeting':
            // Add the event and booking IDs
            $log_meta['event_id'] = $args[0];
            $log_meta['booking_id'] = $args[2];
            $log_meta['host_id'] = $args[3];
            break;
    }

    return $log_meta;
}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_fluentbooking_log_event_trigger_meta_data', 10, 5 );