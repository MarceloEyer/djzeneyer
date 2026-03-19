<?php
/**
 * Listeners
 *
 * @package GamiPress\BookingCalendar\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Booking scheduled listener
 *
 * @since 1.0.0
 *
 * @param int $booking_id
 */
function gamipress_bookingcalendar_booking_scheduled_listener( $booking_id ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger event when a booking was scheduled
    do_action( 'gamipress_bookingcalendar_new_booking_scheduled', $booking_id, $user_id );

}
add_action( 'wpbc_booking_approved', 'gamipress_bookingcalendar_booking_scheduled_listener', 10, 1 );

/**
 * Set booking approved listener
 *
 * @since 1.0.0
 *
 * @param array $params
 * @param array $action_result
 */
function gamipress_bookingcalendar_booking_approved_listener( $params, $action_result ) {
    
    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $booking_id = $params['booking_id'];

    // Trigger event when booking is set to approved
    do_action( 'gamipress_bookingcalendar_booking_approved', $booking_id, $user_id );

    // Trigger event when specific booking is set to approved
    do_action( 'gamipress_bookingcalendar_specific_booking_approved', $booking_id, $user_id );

}
add_action( 'wpbc_set_booking_approved', 'gamipress_bookingcalendar_booking_approved_listener', 10, 2 );

/**
 * Set booking pending listener
 *
 * @since 1.0.0
 *
 * @param array $params
 * @param array $action_result
 */
function gamipress_bookingcalendar_booking_pending_listener( $params, $action_result ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $booking_id = $params['booking_id'];

    // Trigger event when booking is set to pending
    do_action( 'gamipress_bookingcalendar_booking_pending', $booking_id, $user_id );

    // Trigger event when specific booking is set to pending
    do_action( 'gamipress_bookingcalendar_specific_booking_pending', $booking_id, $user_id );

}
add_action( 'wpbc_set_booking_pending', 'gamipress_bookingcalendar_booking_pending_listener', 10, 2 );

/**
 * Set booking cancelled listener
 *
 * @since 1.0.0
 *
 * @param array $params
 * @param array $action_result
 */
function gamipress_bookingcalendar_booking_cancelled_listener( $params, $action_result ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $booking_id = $params['booking_id'];

    // Trigger event when booking is set to cancelled
    do_action( 'gamipress_bookingcalendar_booking_cancelled', $booking_id, $user_id );

    // Trigger event when specific booking is set to cancelled
    do_action( 'gamipress_bookingcalendar_specific_booking_cancelled', $booking_id, $user_id );

}
add_action( 'wpbc_move_booking_to_trash', 'gamipress_bookingcalendar_booking_cancelled_listener', 10, 2 );