<?php
/**
 * Triggers
 *
 * @package GamiPress\BookingCalendar\Triggers
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
function gamipress_bookingcalendar_activity_triggers( $triggers ) {

    $triggers[__( 'WP Booking Calendar', 'gamipress' )] = array(
        'gamipress_bookingcalendar_new_booking_scheduled'           => __( 'New booking scheduled', 'gamipress' ),
        'gamipress_bookingcalendar_booking_approved'                => __( 'Booking is set to approved', 'gamipress' ),
        'gamipress_bookingcalendar_specific_booking_approved'       => __( 'Specific booking is set to approved', 'gamipress' ),
        'gamipress_bookingcalendar_booking_pending'                 => __( 'Booking is set to pending', 'gamipress' ),
        'gamipress_bookingcalendar_specific_booking_pending'        => __( 'Specific booking is set to pending', 'gamipress' ),
        'gamipress_bookingcalendar_booking_cancelled'               => __( 'Booking is set to cancelled', 'gamipress' ),
        'gamipress_bookingcalendar_specific_booking_cancelled'      => __( 'Specific booking is set to cancelled', 'gamipress' ),
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_bookingcalendar_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_bookingcalendar_specific_activity_triggers( $specific_activity_triggers ) {

    $specific_activity_triggers['gamipress_bookingcalendar_specific_booking_approved'] = array( 'booking' );
    $specific_activity_triggers['gamipress_bookingcalendar_specific_booking_pending'] = array( 'booking' );
    $specific_activity_triggers['gamipress_bookingcalendar_specific_booking_cancelled'] = array( 'booking' );

    return $specific_activity_triggers;
}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_bookingcalendar_specific_activity_triggers' );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_bookingcalendar_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_bookingcalendar_specific_booking_approved'] = __( '%s set to approved', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_bookingcalendar_specific_booking_pending'] = __( '%s set to pending', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_bookingcalendar_specific_booking_cancelled'] = __( '%s set to cancelled', 'gamipress' );

    return $specific_activity_trigger_labels;
}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_bookingcalendar_specific_activity_trigger_label' );

/**
 * Get plugin specific activity trigger post title
 *
 * @since  1.0.0
 *
 * @param  string   $post_title
 * @param  integer  $specific_id
 * @param  string   $trigger_type
 * @return string
 */
function gamipress_bookingcalendar_specific_activity_trigger_post_title( $post_title, $specific_id, $trigger_type ) {

    global $wpdb;

    switch( $trigger_type ) {
        case 'gamipress_bookingcalendar_specific_booking_approved':
        case 'gamipress_bookingcalendar_specific_booking_pending':
        case 'gamipress_bookingcalendar_specific_booking_cancelled':
            if( absint( $specific_id ) !== 0 ) {
                $site_bookings = $wpdb->get_results( $wpdb->prepare(
                    "SELECT booking_id, sort_date FROM {$wpdb->prefix}booking WHERE  booking_id LIKE $specific_id",
                    "%{$search}%"
                ) );
                
                foreach ( $site_bookings as $booking ) {
                    $post_title = 'Booking ' . $booking->booking_id . ': ' . $booking->sort_date;
                }
            }
            break;
    }

    return $post_title;

}
add_filter( 'gamipress_specific_activity_trigger_post_title', 'gamipress_bookingcalendar_specific_activity_trigger_post_title', 10, 3 );

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
function gamipress_bookingcalendar_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch ($trigger) {
        case 'gamipress_bookingcalendar_new_booking_scheduled':
        case 'gamipress_bookingcalendar_booking_approved':
        case 'gamipress_bookingcalendar_specific_booking_approved':
        case 'gamipress_bookingcalendar_booking_pending':
        case 'gamipress_bookingcalendar_specific_booking_pending':
        case 'gamipress_bookingcalendar_booking_cancelled':
        case 'gamipress_bookingcalendar_specific_booking_cancelled':
            $user_id = $args[1];
            break;
    }

    return $user_id;
}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_bookingcalendar_trigger_get_user_id', 10, 3 );

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
function gamipress_bookingcalendar_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_bookingcalendar_specific_booking_approved':
        case 'gamipress_bookingcalendar_specific_booking_pending':
        case 'gamipress_bookingcalendar_specific_booking_cancelled':
            $specific_id = $args[0];
            break;
    }

    return $specific_id;
}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_bookingcalendar_specific_trigger_get_id', 10, 3 );

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
function gamipress_bookingcalendar_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch( $trigger ) {
        case 'gamipress_bookingcalendar_specific_booking_approved':
        case 'gamipress_bookingcalendar_specific_booking_pending':
        case 'gamipress_bookingcalendar_specific_booking_cancelled':
            // Add the booking ID
            $log_meta['booking_id'] = $args[0];
            break;
    }

    return $log_meta;
}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_bookingcalendar_log_event_trigger_meta_data', 10, 5 );