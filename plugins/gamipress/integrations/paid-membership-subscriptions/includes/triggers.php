<?php
/**
 * Triggers
 *
 * @package GamiPress\Paid-Membership-Subscriptions\Triggers
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
function gamipress_paid_membership_subscriptions_activity_triggers( $triggers ) {

    $triggers[__( 'Paid Membership Subscriptions', 'gamipress' )] = array(

        'gamipress_paid_membership_subscriptions_purchase_subscription'             => __( 'Purchase a subscription', 'gamipress' ),
        'gamipress_paid_membership_subscriptions_purchase_specific_subscription'    => __( 'Purchase a specific subscription', 'gamipress' ),

        'gamipress_paid_membership_subscriptions_pay_subscription'                  => __( 'Pay a subscription', 'gamipress' ),
        'gamipress_paid_membership_subscriptions_pay_specific_subscription'         => __( 'Pay a specific subscription', 'gamipress' ),

        'gamipress_paid_membership_subscriptions_renew_subscription'                => __( 'Renew a subscription', 'gamipress' ),
        'gamipress_paid_membership_subscriptions_renew_specific_subscription'       => __( 'Renew a specific subscription', 'gamipress' ),

        'gamipress_paid_membership_subscriptions_change_subscription'               => __( 'Change a subscription', 'gamipress' ),
        'gamipress_paid_membership_subscriptions_change_specific_subscription'      => __( 'Change a specific subscription', 'gamipress' ),

        'gamipress_paid_membership_subscriptions_cancel_subscription'               => __( 'Cancel a subscription', 'gamipress' ),
        'gamipress_paid_membership_subscriptions_cancel_specific_subscription'      => __( 'Cancel a specific subscription', 'gamipress' ),

        'gamipress_paid_membership_subscriptions_abandon_subscription'              => __( 'Abandon a subscription', 'gamipress' ),
        'gamipress_paid_membership_subscriptions_abandon_specific_subscription'     => __( 'Abandon a specific subscription', 'gamipress' ),

    );

    return $triggers;

}
add_filter( 'gamipress_activity_triggers', 'gamipress_paid_membership_subscriptions_activity_triggers' );

/**
 * Register plugin specific activity triggers
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_triggers
 * @return array
 */
function gamipress_paid_membership_subscriptions_specific_activity_triggers( $specific_activity_triggers ) {

    $specific_activity_triggers['gamipress_paid_membership_subscriptions_purchase_specific_subscription'] = array( 'pms-subscription' );
    $specific_activity_triggers['gamipress_paid_membership_subscriptions_pay_specific_subscription'] = array( 'pms-subscription' );
    $specific_activity_triggers['gamipress_paid_membership_subscriptions_renew_specific_subscription'] = array( 'pms-subscription' );
    $specific_activity_triggers['gamipress_paid_membership_subscriptions_change_specific_subscription'] = array( 'pms-subscription' );
    $specific_activity_triggers['gamipress_paid_membership_subscriptions_cancel_specific_subscription'] = array( 'pms-subscription' );
    $specific_activity_triggers['gamipress_paid_membership_subscriptions_abandon_specific_subscription'] = array( 'pms-subscription' );

    return $specific_activity_triggers;

}
add_filter( 'gamipress_specific_activity_triggers', 'gamipress_paid_membership_subscriptions_specific_activity_triggers' );

/**
 * Register plugin specific activity triggers labels
 *
 * @since  1.0.0
 *
 * @param  array $specific_activity_trigger_labels
 * @return array
 */
function gamipress_paid_membership_subscriptions_activity_trigger_label( $specific_activity_trigger_labels ) {

    $specific_activity_trigger_labels['gamipress_paid_membership_subscriptions_purchase_specific_subscription'] = __( 'Purchase %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_paid_membership_subscriptions_pay_specific_subscription'] = __( 'Pay %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_paid_membership_subscriptions_renew_specific_subscription'] = __( 'Renew %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_paid_membership_subscriptions_change_specific_subscription'] = __( 'Change %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_paid_membership_subscriptions_cancel_specific_subscription'] = __( 'Cancel %s', 'gamipress' );
    $specific_activity_trigger_labels['gamipress_paid_membership_subscriptions_abandon_specific_subscription'] = __( 'Abandon %s', 'gamipress' );

    return $specific_activity_trigger_labels;

}
add_filter( 'gamipress_specific_activity_trigger_label', 'gamipress_paid_membership_subscriptions_activity_trigger_label' );

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
function gamipress_paid_membership_subscriptions_trigger_get_user_id( $user_id, $trigger, $args ) {

    switch ( $trigger ) {
        case 'gamipress_paid_membership_subscriptions_purchase_subscription':
        case 'gamipress_paid_membership_subscriptions_purchase_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_pay_subscription':
        case 'gamipress_paid_membership_subscriptions_pay_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_renew_subscription':
        case 'gamipress_paid_membership_subscriptions_renew_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_change_subscription':
        case 'gamipress_paid_membership_subscriptions_change_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_cancel_subscription':
        case 'gamipress_paid_membership_subscriptions_cancel_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_abandon_subscription':
        case 'gamipress_paid_membership_subscriptions_abandon_specific_subscription':
            $user_id = $args[1];
            break;
    }

    return $user_id;
}
add_filter( 'gamipress_trigger_get_user_id', 'gamipress_paid_membership_subscriptions_trigger_get_user_id', 10, 3 );

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
function gamipress_paid_membership_subscriptions_specific_trigger_get_id( $specific_id, $trigger = '', $args = array() ) {

    switch( $trigger ) {
        case 'gamipress_paid_membership_subscriptions_purchase_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_pay_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_renew_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_change_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_cancel_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_abandon_specific_subscription':
            $specific_id = $args[0];
            break;
    }

    return $specific_id;

}
add_filter( 'gamipress_specific_trigger_get_id', 'gamipress_paid_membership_subscriptions_specific_trigger_get_id', 10, 3 );

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
function gamipress_paid_membership_subscriptions_log_event_trigger_meta_data( $log_meta, $user_id, $trigger, $site_id, $args ) {

    switch ($trigger) {
        case 'gamipress_paid_membership_subscriptions_purchase_subscription':
        case 'gamipress_paid_membership_subscriptions_purchase_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_pay_subscription':
        case 'gamipress_paid_membership_subscriptions_pay_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_renew_subscription':
        case 'gamipress_paid_membership_subscriptions_renew_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_change_subscription':
        case 'gamipress_paid_membership_subscriptions_change_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_cancel_subscription':
        case 'gamipress_paid_membership_subscriptions_cancel_specific_subscription':
        case 'gamipress_paid_membership_subscriptions_abandon_subscription':
        case 'gamipress_paid_membership_subscriptions_abandon_specific_subscription':  
            // Add the subscription plan ID
            $log_meta['subscription_plan_id'] = $args[0];
            break;
    }

    return $log_meta;

}
add_filter( 'gamipress_log_event_trigger_meta_data', 'gamipress_paid_membership_subscriptions_log_event_trigger_meta_data', 10, 5 );