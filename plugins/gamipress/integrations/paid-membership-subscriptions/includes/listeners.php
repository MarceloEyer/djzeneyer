<?php
/**
 * Listeners
 *
 * @package GamiPress\Paid-Membership-Subscriptions\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Purchase subscription listener
 *
 * @since 1.0.0
 *
 * @param int $id
 * @param array $data
 */
function gamipress_paid_membership_subscriptions_purchase_subscription_listener( $id, $data ) {

    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $subscription_plan_id = $data['subscription_plan_id'];

    // Trigger for purchasing any plan
    do_action( 'gamipress_paid_membership_subscriptions_purchase_subscription', $subscription_plan_id, $user_id );

    // Trigger for purchasing a specific plan
    do_action( 'gamipress_paid_membership_subscriptions_purchase_specific_subscription', $subscription_plan_id, $user_id );

}
add_action( 'pms_member_subscription_insert', 'gamipress_paid_membership_subscriptions_purchase_subscription_listener', 10, 2 );

/**
 * Pay subscription listener
 *
 * @since 1.0.0
 *
 * @param int $id
 * @param array $data
 */
function gamipress_paid_membership_subscriptions_pay_subscription_listener( $payment_gateway_data ) {

    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $subscription_plan_id = $payment_gateway_data['subscription_data']['subscription_plan_id'];

    // Trigger for paying any plan
    do_action( 'gamipress_paid_membership_subscriptions_pay_subscription', $subscription_plan_id, $user_id );

    // Trigger for paying a specific plan
    do_action( 'gamipress_paid_membership_subscriptions_pay_specific_subscription', $subscription_plan_id, $user_id );

}
add_action( 'pms_register_payment', 'gamipress_paid_membership_subscriptions_pay_subscription_listener', 10, 1 );

/**
 * Renew a subscription listener
 *
 * @since 1.0.0
 *
 * @param int $id
 * @param array $data
 */
function gamipress_paid_membership_subscriptions_renew_subscription_listener( $user_id ) {

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $member = pms_get_member($user_id);
    $subscriptions = $member->get_subscriptions_ids();
    $subscription_plan_id = $subscriptions[0];

    // Trigger for renewing any plan
    do_action( 'gamipress_paid_membership_subscriptions_renew_subscription', $subscription_plan_id, $user_id );

    // Trigger for renewing a specific plan
    do_action( 'gamipress_paid_membership_subscriptions_renew_specific_subscription', $subscription_plan_id, $user_id );

}
add_action( 'pms_renew_subscription_form_extra', 'gamipress_paid_membership_subscriptions_renew_subscription_listener', 10, 1 );

/**
 * Change a subscription listener
 *
 * @since 1.0.0
 *
 * @param int $id
 * @param array $data
 */
function gamipress_paid_membership_subscriptions_change_subscription_listener( $user_id ) {

    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $member = pms_get_member($user_id);
    $subscriptions = $member->get_subscriptions_ids();
    $subscription_plan_id = $subscriptions[0]; 
    
    // Trigger for changing any plan
    do_action( 'gamipress_paid_membership_subscriptions_change_subscription',  $subscription_plan_id, $user_id );

    // Trigger for changing a specific plan
    do_action( 'gamipress_paid_membership_subscriptions_change_specific_subscription', $subscription_plan_id, $user_id );

}
add_action( 'pms_change_subscription_form_extra', 'gamipress_paid_membership_subscriptions_change_subscription_listener', 10, 1 );

/**
 * Cancel a subscription listener
 *
 * @since 1.0.0
 *
 * @param int $id
 * @param array $data
 */
function gamipress_paid_membership_subscriptions_cancel_subscription_listener( $member_data, $member_subscription ) {

    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $subscription_plan_id = $member_subscription->subscription_plan_id;

    // Trigger for canceling any plan
    do_action( 'gamipress_paid_membership_subscriptions_cancel_subscription', $subscription_plan_id, $user_id );

    // Trigger for canceling specific plan
    do_action( 'gamipress_paid_membership_subscriptions_cancel_specific_subscription', $subscription_plan_id, $user_id );

}
add_action( 'pms_cancel_member_subscription_successful', 'gamipress_paid_membership_subscriptions_cancel_subscription_listener', 10, 2 );

/**
 * Abanadon a subscription listener
 *
 * @since 1.0.0
 *
 * @param int $id
 * @param array $data
 */
function gamipress_paid_membership_subscriptions_abandon_subscription_listener( $member_data, $member_subscription ) {

    $user_id = get_current_user_id();
    
    // Login is required
    if ( $user_id === 0 ) {
        return;
    }

    $subscription_plan_id = $member_subscription->subscription_plan_id;

    // Trigger for abandoning any plan
    do_action( 'gamipress_paid_membership_subscriptions_abandon_subscription', $subscription_plan_id, $user_id );

    // Trigger for abandoning a specific plan
    do_action( 'gamipress_paid_membership_subscriptions_abandon_specific_subscription', $subscription_plan_id, $user_id );

}
add_action( 'pms_abandon_member_subscription_successful', 'gamipress_paid_membership_subscriptions_abandon_subscription_listener', 10, 2 );