<?php
/**
 * Triggers
 *
 * @package GamiPress\Pretty-Link\Triggers
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
function gamipress_pretty_link_activity_triggers( $triggers ) {

    $triggers[__( 'Pretty Link', 'gamipress' )] = array(
        'gamipress_pretty_link_redirection'             => __( 'User clicks a pretty link', 'gamipress' ),
        'gamipress_pretty_link_specific_redirection'    => __( 'User clicks a specific pretty link', 'gamipress' ),
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_pretty_link_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_pretty_link_specific_activity_triggers( $specific_activity_triggers ) {

    $specific_activity_triggers['gamipress_pretty_link_specific_redirection'] = array( 'pretty-link' );

    return $specific_activity_triggers;

}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_pretty_link_specific_activity_triggers' );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_pretty_link_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_pretty_link_specific_redirection'] = __( 'User clicks %s', 'gamipress' );

    return $specific_activity_trigger_labels;

}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_pretty_link_specific_activity_trigger_label' );

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
function gamipress_pretty_link_specific_activity_trigger_post_title( $post_title, $specific_id, $trigger_type ) {

    global $wpdb;

    switch ($trigger_type) {
        case 'gamipress_pretty_link_specific_redirection':

            $prliLink = new PrliLink();
            $one_link = $prliLink->get_one_by( 'id', $specific_id );
            $link_data = json_decode(json_encode($one_link), true);
            $post_title = $link_data['name'];
            break;
    }

    return $post_title;

}
add_filter( 'gamipress_specific_activity_trigger_post_title', 'gamipress_pretty_link_specific_activity_trigger_post_title', 10, 3 );


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
function gamipress_pretty_link_trigger_get_user_id( $user_id, $trigger, $args ) {
    
    switch ( $trigger ) {
        case 'gamipress_pretty_link_redirection':
        case 'gamipress_pretty_link_specific_redirection':
            $user_id = $args[2];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_pretty_link_trigger_get_user_id', 10, 3 );

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
function gamipress_pretty_link_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_pretty_link_specific_redirection':
            $specific_id = $args[0];
    }
    return $specific_id;

}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_pretty_link_specific_trigger_get_id', 10, 3 );

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
function gamipress_pretty_link_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch ($trigger) {
        case 'gamipress_pretty_link_redirection':
        case 'gamipress_pretty_link_specific_redirection':
            // Add the link ID
            $log_meta['link_id'] = $args[0];
            break;
    }

    return $log_meta;
}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_pretty_link_log_event_trigger_meta_data', 10, 5 );