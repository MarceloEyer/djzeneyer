<?php
/**
 * Triggers
 *
 * @package GamiPress\Geodirectory\Triggers
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
function gamipress_geodirectory_activity_triggers( $triggers ) {

    $triggers[__( 'Geodirectory', 'gamipress' )] = array(
        'gamipress_geodirectory_new_place_added'                => __( 'Add a new place', 'gamipress' ),
        'gamipress_geodirectory_new_category_added'             => __( 'Add a new category', 'gamipress' ),
        'gamipress_geodirectory_new_comment_posted'             => __( 'Add a new review on any place', 'gamipress' ),
        'gamipress_geodirectory_specific_new_comment_posted'    => __( 'Add a new review on a specific place', 'gamipress' ),
    );

    return $triggers;
}
add_filter( 'gamipress_activity_triggers', 'gamipress_geodirectory_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_geodirectory_specific_activity_triggers( $specific_activity_triggers ) {

    $specific_activity_triggers['gamipress_geodirectory_specific_new_comment_posted'] = array( 'gd_place' );

    return $specific_activity_triggers;
}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_geodirectory_specific_activity_triggers' );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_geodirectory_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_geodirectory_specific_new_comment_posted'] = __( 'New comment posted on %s', 'gamipress' );

    return $specific_activity_trigger_labels;
}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_geodirectory_specific_activity_trigger_label' );

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
function gamipress_geodirectory_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch( $trigger ) {
        case 'gamipress_geodirectory_new_place_added':
        case 'gamipress_geodirectory_new_category_added':
        case 'gamipress_geodirectory_new_comment_posted':
        case 'gamipress_geodirectory_specific_new_comment_posted':
            $user_id = $args[1];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_geodirectory_trigger_get_user_id', 10, 3 );

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
function gamipress_geodirectory_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_geodirectory_specific_new_comment_posted':
            $specific_id = $args[0];
            break;
    }

    return $specific_id;
}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_geodirectory_specific_trigger_get_id', 10, 3 );

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
function gamipress_geodirectory_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch( $trigger ) {
        case 'gamipress_geodirectory_new_place_added':
        case 'gamipress_geodirectory_new_category_added':
        case 'gamipress_geodirectory_new_comment_posted':
        case 'gamipress_geodirectory_specific_new_comment_posted':
            // Add the post ID
            $log_meta['post_id'] = $args[0];
    }

    return $log_meta;

}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_geodirectory_log_event_trigger_meta_data', 10, 5 );
