<?php
/**
 * Listeners
 *
 * @package GamiPress\Eventin\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Purchase ticket listener
 *
 * @since 1.0.0
 *
 * @param int OrderModel       $order    $order data
 */
function gamipress_eventin_purchase_ticket_listener( $order ) {

    $user_id = get_current_user_id();

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Get the event related to order
    $event_id = get_post_meta( $order->id, 'event_id', true );

    // Trigger purchase ticket for any event
    do_action( 'gamipress_eventin_purchase_ticket_event', $event_id, $user_id );

    // Trigger purchase ticket for specific event
    do_action( 'gamipress_eventin_purchase_ticket_specific_event', $event_id, $user_id );

}
add_action( 'eventin_order_completed', 'gamipress_eventin_purchase_ticket_listener', 10, 1 );

/**
 * Set create event listener
 *
 * @since 1.0.0
 *
 * @param Event_Model       $event    $event data
 */
function gamipress_eventin_create_event_listener( $event ) {
    
    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger create event
    do_action( 'gamipress_eventin_create_event', $event->id, $user_id );

}
add_action( 'eventin_event_created', 'gamipress_eventin_create_event_listener', 10, 1 );

/**
 * Set delete event listener
 *
 * @since 1.0.0
 *
 * @param Event_Model       $event    $event data
 */
function gamipress_eventin_delete_event_listener( $event ) {
    
    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger delete any event
    do_action( 'gamipress_eventin_delete_event', $event->id, $user_id );

    // Trigger delete a specific event
    do_action( 'gamipress_eventin_delete_specific_event', $event->id, $user_id );

}
add_action( 'eventin_event_before_delete', 'gamipress_eventin_delete_event_listener', 10, 1 );

/**
 * Set update event listener
 *
 * @since 1.0.0
 *
 * @param Event_Model       $event    $event data
 */
function gamipress_eventin_update_event_listener( $event ) {
    
    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    // Trigger update any event
    do_action( 'gamipress_eventin_update_event', $event->id, $user_id );

    // Trigger update a specific event
    do_action( 'gamipress_eventin_update_specific_event', $event->id, $user_id );

}
add_action( 'eventin_event_updated', 'gamipress_eventin_update_event_listener', 10, 1 );