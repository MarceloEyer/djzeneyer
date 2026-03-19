<?php
/**
 * Listeners
 *
 * @package GamiPress\AmeliaBooking\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Book appointment listener
 *
 * @since 1.0.0
 *
 * @param array $args   Appointment data
 */
function gamipress_ameliabooking_book_appointment( $args ) {

    $user_id = get_current_user_id();

    // Bail if the booking is not for an appointment
    if ( $args['type'] !== 'appointment'){
        return;
    }

    $appointment_id = absint( $args['appointment']['id'] );
    $service_id = absint( $args['appointment']['serviceId'] );

    // Book any service
    do_action( 'gamipress_ameliabooking_user_books_appointment', $appointment_id, $user_id, $service_id );

    // Book specific service
    do_action( 'gamipress_ameliabooking_user_books_appointment_service', $appointment_id, $user_id, $service_id );

}
add_action( 'AmeliaBookingAddedBeforeNotify', 'gamipress_ameliabooking_book_appointment' );

/**
 * Book event listener
 *
 * @since 1.0.0
 *
 * @param array $args   Event data
 */
function gamipress_ameliabooking_book_event( $args ) {

    $user_id = get_current_user_id();

    // Bail if the booking is not for an appointment
    if ( $args['type'] !== 'event'){
        return;
    }

    $event_id = absint( $args['event']['id'] );

    // Book any service
    do_action( 'gamipress_ameliabooking_user_books_event', $event_id, $user_id );

    // Book specific service
    do_action( 'gamipress_ameliabooking_user_books_specific_event', $event_id, $user_id );

}
add_action( 'AmeliaBookingAddedBeforeNotify', 'gamipress_ameliabooking_book_event' );

/**
 * Cancel appointment listener
 *
 * @since 1.0.0
 *
 * @param array $bookingData   Appointment data
 */
function gamipress_ameliabooking_cancel_appointment( $bookingData ) {

    $user_id = get_current_user_id();

    // Bail if the booking is not for an appointment
    if ( !isset ( $bookingData['appointment'] ) ){
        return;
    }

    $appointment_id = absint( $bookingData['appointment']['id'] );
    $service_id = absint( $bookingData['appointment']['serviceId'] );

    // Cancel any service
    do_action( 'gamipress_ameliabooking_user_cancels_appointment', $appointment_id, $user_id, $service_id );

    // Cancel specific service
    do_action( 'gamipress_ameliabooking_user_cancels_appointment_service', $appointment_id, $user_id, $service_id );

}
add_action( 'amelia_after_booking_canceled', 'gamipress_ameliabooking_cancel_appointment' );

/**
 * Cancel event listener
 *
 * @since 1.0.0
 *
 * @param array $bookingData   Event data
 */
function gamipress_ameliabooking_cancel_event( $bookingData ) {

    $user_id = get_current_user_id();

    // Bail if the booking is not for an event
    if ( !isset ( $bookingData['event'] ) ){
        return;
    }

    $event_id = absint( $bookingData['event']['id'] );

    // Book any service
    do_action( 'gamipress_ameliabooking_user_cancels_event', $event_id, $user_id );

    // Book specific service
    do_action( 'gamipress_ameliabooking_user_cancels_specific_event', $event_id, $user_id );

}
add_action( 'amelia_after_booking_canceled', 'gamipress_ameliabooking_cancel_event' );
