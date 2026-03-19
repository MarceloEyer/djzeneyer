<?php
/**
 * Triggers
 *
 * @package GamiPress\Eventin\Triggers
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
function gamipress_eventin_activity_triggers( $triggers ) {

    $triggers[__( 'Eventin', 'gamipress' )] = array(
        'gamipress_eventin_purchase_ticket_event'           => __( 'Purchase a ticket for any event', 'gamipress' ),
        'gamipress_eventin_purchase_ticket_specific_event'  => __( 'Purchase a ticket for specific event', 'gamipress' ),
        'gamipress_eventin_create_event'                    => __( 'Create an event', 'gamipress' ),
        'gamipress_eventin_delete_event'                    => __( 'Delete any event', 'gamipress' ),
        'gamipress_eventin_delete_specific_event'           => __( 'Delete a specific event', 'gamipress' ),
        'gamipress_eventin_update_event'                    => __( 'Update any event', 'gamipress' ),
        'gamipress_eventin_update_specific_event'           => __( 'Update a specific event', 'gamipress' ),
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_eventin_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_eventin_specific_activity_triggers( $specific_activity_triggers ) {

    $specific_activity_triggers['gamipress_eventin_purchase_ticket_specific_event'] = array( 'etn' );
    $specific_activity_triggers['gamipress_eventin_delete_specific_event'] = array( 'etn' );
    $specific_activity_triggers['gamipress_eventin_update_specific_event'] = array( 'etn' );

    return $specific_activity_triggers;
}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_eventin_specific_activity_triggers' );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_eventin_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_eventin_purchase_ticket_specific_event'] = __( 'Purchase ticket for %s event', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_eventin_delete_specific_event'] = __( 'Delete %s event', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_eventin_update_specific_event'] = __( 'Update %s event', 'gamipress' );

    return $specific_activity_trigger_labels;
}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_eventin_specific_activity_trigger_label' );

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
function gamipress_eventin_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch ($trigger) {
        case 'gamipress_eventin_purchase_ticket_event':
        case 'gamipress_eventin_purchase_ticket_specific_event':
        case 'gamipress_eventin_create_event':
        case 'gamipress_eventin_delete_event':
        case 'gamipress_eventin_delete_specific_event':
        case 'gamipress_eventin_update_event':
        case 'gamipress_eventin_update_specific_event':
            $user_id = $args[1];
            break;
    }

    return $user_id;
}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_eventin_trigger_get_user_id', 10, 3 );

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
function gamipress_eventin_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_eventin_purchase_ticket_specific_event':
        case 'gamipress_eventin_delete_specific_event':
        case 'gamipress_eventin_update_specific_event':
            $specific_id = $args[0];
            break;
    }

    return $specific_id;
}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_eventin_specific_trigger_get_id', 10, 3 );

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
function gamipress_eventin_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch( $trigger ) {
        case 'gamipress_eventin_purchase_ticket_specific_event':
        case 'gamipress_eventin_delete_specific_event':
        case 'gamipress_eventin_update_specific_event':
            // Add the event ID
            $log_meta['event_id'] = $args[0];
            break;
    }

    return $log_meta;
}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_eventin_log_event_trigger_meta_data', 10, 5 );