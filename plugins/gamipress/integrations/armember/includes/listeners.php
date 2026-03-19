<?php
/**
 * Listeners
 *
 * @package GamiPress\ARMember\Listeners
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Add Membership plan
 *
 * @since  1.0.0
 *
 * @param int $user_id    User ID.
 * @param int $plan_id    Membership plan ID.
 */
function gamipress_armember_add_membership( $user_id, $plan_id ) {

    // Add any membership plan
    do_action( 'gamipress_armember_add_membership', $plan_id, $user_id );

    // Add specific membership plan
    do_action( 'gamipress_armember_add_specific_membership', $plan_id, $user_id );

}

add_action( 'arm_after_user_plan_change_by_admin', 'gamipress_armember_add_membership', 10, 2 );
add_action( 'arm_after_user_plan_change', 'gamipress_armember_add_membership', 10, 2 );

/**
 * Cancel Membership plan
 *
 * @since  1.0.0
 *
 * @param int $user_id    User ID.
 * @param int $plan_id    Membership plan ID.
 */
function gamipress_armember_cancel_membership( $user_id, $plan_id ) {

    // Cancel any membership plan
    do_action( 'gamipress_armember_cancel_membership', $plan_id, $user_id );

    // Cancel specific membership plan
    do_action( 'gamipress_armember_cancel_specific_membership', $plan_id, $user_id );

}

add_action( 'arm_cancel_subscription_gateway_action', 'gamipress_armember_cancel_membership', 10, 2 );
add_action( 'arm_cancel_subscription', 'gamipress_armember_cancel_membership', 10, 2 );

/**
 * Renew Membership plan
 *
 * @since  1.0.0
 *
 * @param int       $user_id
 * @param int       $plan_id
 * @param string    $payment_gateway
 * @param string    $payment_mode
 */
function gamipress_armember_renew_membership( $user_id, $plan_id, $payment_gateway, $payment_mode ) {

    // Renew any membership plan
    do_action( 'gamipress_armember_renew_membership', $plan_id, $user_id );

    // Renew specific membership plan
    do_action( 'gamipress_armember_renew_specific_membership', $plan_id, $user_id );

}

add_action( 'arm_after_recurring_payment_success_outside', 'gamipress_armember_renew_membership', 10, 4 );