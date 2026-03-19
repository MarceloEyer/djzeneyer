<?php
/**
 * Listeners
 *
 * @package GamiPress\FluentBooking\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Schedule meeting listener
 *
 * @since 1.0.0
 *
 * @param FluentBooking\App\Models\Booking $booking
 * @param FluentBooking\App\Models\CalendarSlot $calendarSlot
 * @param array $bookingData
 */
function gamipress_fluentbooking_schedule_meeting( $booking, $calendarSlot, $bookingData ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $event_type = $booking->getAttribute( 'event_type' );
    $booking_id = $booking->getAttribute( 'id' );
    $event_id = $booking->getAttribute( 'event_id' );
    $host_id = $booking->getAttribute( 'host_user_id' );
    
    // One-to-one meetings
    if ( $event_type !== 'collective' && $event_type !== 'round_robin' ){
        
        // Schedule any one-to-one meeting
        do_action( 'gamipress_fluentbooking_schedule_single_meeting', $event_id, $user_id, $booking_id );

        // Schedule specific one-to-one meeting
        do_action( 'gamipress_fluentbooking_schedule_specific_single_meeting', $event_id, $user_id, $booking_id );

        // Schedule specific host in one-to-one meeting
        do_action( 'gamipress_fluentbooking_schedule_host_single_meeting', $event_id, $user_id, $booking_id, $host_id );

    }

    // Team meetings
    if ( $event_type !== 'single' && $event_type !== 'group' ){
        
        // Schedule any team meeting
        do_action( 'gamipress_fluentbooking_schedule_team_meeting', $event_id, $user_id, $booking_id );

        // Schedule specific team meeting
        do_action( 'gamipress_fluentbooking_schedule_specific_team_meeting', $event_id, $user_id, $booking_id );

        // Schedule specific host in team meeting
        do_action( 'gamipress_fluentbooking_schedule_host_team_meeting', $event_id, $user_id, $booking_id, $host_id );

    } 

}
add_action( 'fluent_booking/after_booking_scheduled', 'gamipress_fluentbooking_schedule_meeting', 10, 3 );

/**
 * Cancel meeting listener
 *
 * @since 1.0.0
 *
 * @param FluentBooking\App\Models\Booking $booking
 * @param array $calendarEvent
 */
function gamipress_fluentbooking_cancel_meeting( $booking, $calendarEvent ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $event_type = $booking->getAttribute( 'event_type' );
    $booking_id = $booking->getAttribute( 'id' );
    $event_id = $booking->getAttribute( 'event_id' );
    $host_id = $booking->getAttribute( 'host_user_id' );
    
    // One-to-one meetings
    if ( $event_type !== 'collective' && $event_type !== 'round_robin' ){
        
        // Cancel any one-to-one meeting
        do_action( 'gamipress_fluentbooking_cancel_single_meeting', $event_id, $user_id, $booking_id );

        // Cancel specific one-to-one meeting
        do_action( 'gamipress_fluentbooking_cancel_specific_single_meeting', $event_id, $user_id, $booking_id );

        // Cancel specific host in one-to-one meeting
        do_action( 'gamipress_fluentbooking_cancel_host_single_meeting', $event_id, $user_id, $booking_id, $host_id );

    }

    // Team meetings
    if ( $event_type !== 'single' && $event_type !== 'group' ){
        
        // Cancel any one-to-one meeting
        do_action( 'gamipress_fluentbooking_cancel_team_meeting', $event_id, $user_id, $booking_id );

        // Cancel specific one-to-one meeting
        do_action( 'gamipress_fluentbooking_cancel_specific_team_meeting', $event_id, $user_id, $booking_id );

        // Cancel specific host in team meeting
        do_action( 'gamipress_fluentbooking_cancel_host_team_meeting', $event_id, $user_id, $booking_id, $host_id );

    }    

}
add_action( 'fluent_booking/booking_schedule_cancelled', 'gamipress_fluentbooking_cancel_meeting', 10, 2 );