<?php
/**
 * Triggers
 *
 * @package GamiPress\ShortLinksPro\Triggers
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
function gamipress_shortlinkspro_activity_triggers( $triggers ) {

    $triggers[__( 'ShortLinks Pro', 'gamipress' )] = array(
        'gamipress_shortlinkspro_click'                    => __( 'User clicks a link', 'gamipress' ),
        'gamipress_shortlinkspro_specific_click'           => __( 'User clicks a specific link', 'gamipress' ),
        'gamipress_shortlinkspro_click_specific_category'  => __( 'User clicks a link of a category', 'gamipress' ),
        'gamipress_shortlinkspro_click_specific_tag'       => __( 'User clicks a link of a tag', 'gamipress' ),
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_shortlinkspro_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_shortlinkspro_specific_activity_triggers( $specific_activity_triggers ) {

    $specific_activity_triggers['gamipress_shortlinkspro_specific_click'] = array( 'slp_links' );

    return $specific_activity_triggers;

}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_shortlinkspro_specific_activity_triggers' );

/**
 * Build custom activity trigger label
 *
 * @since  1.0.0
 *
 * @param string    $title
 * @param integer   $requirement_id
 * @param array     $requirement
 *
 * @return string
 */
function gamipress_shortlinkspro_activity_trigger_label( $title, $requirement_id, $requirement ) {

    $category = ( isset( $requirement['shortlinkspro_category'] ) ) ? $requirement['shortlinkspro_category'] : '';
    $category_name = shortlinkspro_get_link_category_name( $category );
    $tag = ( isset( $requirement['shortlinkspro_tag'] ) ) ? $requirement['shortlinkspro_tag'] : '';
    $tag_name = shortlinkspro_get_link_tag_name( $tag );

    switch( $requirement['trigger_type'] ) {
        // Category field value
        case 'gamipress_shortlinkspro_click_specific_category':
            return sprintf( __( 'User clicks a link of %s category', 'gamipress' ), $category_name );
            break;
        // Tag field value
        case 'gamipress_shortlinkspro_click_specific_tag':
            return sprintf( __( 'User clicks a link of %s tag', 'gamipress' ), $tag_name );
            break;
    }

    return $title;
}
add_filter( 'gamipress_activity_trigger_label', 'gamipress_shortlinkspro_activity_trigger_label', 10, 3 );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_shortlinkspro_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_shortlinkspro_specific_click'] = __( 'User clicks %s', 'gamipress' );

    return $specific_activity_trigger_labels;

}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_shortlinkspro_specific_activity_trigger_label' );

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
function gamipress_shortlinkspro_specific_activity_trigger_post_title( $post_title, $specific_id, $trigger_type ) {

    global $wpdb;

    switch ($trigger_type) {
        case 'gamipress_shortlinkspro_specific_click':

           if( absint( $specific_id ) !== 0 ) {

                // Get the link title
                $link_title = shortlinkspro_get_link_title( $specific_id );

                $post_title = $link_title;
            }
            break;
    }

    return $post_title;

}
add_filter( 'gamipress_specific_activity_trigger_post_title', 'gamipress_shortlinkspro_specific_activity_trigger_post_title', 10, 3 );


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
function gamipress_shortlinkspro_trigger_get_user_id( $user_id, $trigger, $args ) {
    
    switch ( $trigger ) {
        case 'gamipress_shortlinkspro_click':
        case 'gamipress_shortlinkspro_specific_click':
        case 'gamipress_shortlinkspro_click_specific_category':
        case 'gamipress_shortlinkspro_click_specific_tag':
            $user_id = $args[1];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_shortlinkspro_trigger_get_user_id', 10, 3 );

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
function gamipress_shortlinkspro_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_shortlinkspro_specific_click':
            $specific_id = $args[0];
    }
    return $specific_id;

}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_shortlinkspro_specific_trigger_get_id', 10, 3 );

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
function gamipress_shortlinkspro_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch ($trigger) {
        case 'gamipress_shortlinkspro_click':
        case 'gamipress_shortlinkspro_specific_click':
            // Add the link ID
            $log_meta['link_id'] = $args[0];
            break;
    }

    return $log_meta;
}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_shortlinkspro_log_event_trigger_meta_data', 10, 5 );