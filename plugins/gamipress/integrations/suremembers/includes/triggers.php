<?php
/**
 * Triggers
 *
 * @package GamiPress\SureMembers\Triggers
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register SureMembers activity triggers
 *
 * @param array $triggers
 * @return mixed
 */
function gamipress_suremembers_activity_triggers( $triggers ) {

    $triggers[__( 'SureMembers', 'gamipress' )] = array(

        'gamipress_suremembers_user_added_to_any_access_group'              => __( 'Added to any access group', 'gamipress' ),
        'gamipress_suremembers_user_added_to_specific_access_group'         => __( 'Added to a specific access group', 'gamipress' ),

        'gamipress_suremembers_user_removed_from_any_access_group'          => __( 'Removed from any access group', 'gamipress' ),
        'gamipress_suremembers_user_removed_from_specific_access_group'     => __( 'Removed from a specific access group', 'gamipress' ),
        
    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_suremembers_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_suremembers_specific_activity_triggers( $specific_activity_triggers ) {

    $specific_activity_triggers['gamipress_suremembers_user_added_to_specific_access_group'] = array( 'wsm_access_group' );
    $specific_activity_triggers['gamipress_suremembers_user_removed_from_specific_access_group'] = array( 'wsm_access_group' );

    return $specific_activity_triggers;

}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_suremembers_specific_activity_triggers' );


/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_suremembers_specific_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_suremembers_user_added_to_specific_access_group'] = __( 'User added to %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_suremembers_user_removed_from_specific_access_group'] = __( 'User removed from %s', 'gamipress' );

    return $specific_activity_trigger_labels;

}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_suremembers_specific_activity_trigger_label' );

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
function gamipress_suremembers_trigger_get_user_id( $user_id, $trigger, $args ) {

    error_log('$args:');
    error_log(print_r($args, true));
    
    switch ( $trigger ) {
        case 'gamipress_suremembers_user_added_to_any_access_group':
        case 'gamipress_suremembers_user_added_to_specific_access_group':
        case 'gamipress_suremembers_user_removed_from_any_access_group':
        case 'gamipress_suremembers_user_removed_from_specific_access_group':
            $user_id = $args[0];
            break;
    }

    return $user_id;

}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_suremembers_trigger_get_user_id', 10, 3 );

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
function gamipress_suremembers_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_suremembers_user_added_to_specific_access_group':
        case 'gamipress_suremembers_user_removed_from_specific_access_group':
            $specific_id = $args[1];
    }
    return $specific_id;

}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_suremembers_specific_trigger_get_id', 10, 3 );