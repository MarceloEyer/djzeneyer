<?php
/**
 * Listeners
 *
 * @package GamiPress\Easy_Affiliate\Listeners
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Become affiliate listener
 *
 * @since 1.0.0
 *
 * @param array $args       Args from Easy Affiliate event
 *
 * @return mixed
 */
function gamipress_easy_affiliate_become_affiliate_listener( $args ) {

    // Affiliate user ID
    $user_id = $args->evt_id;

    // Bail if no user
    if ( absint( $user_id ) === 0 ) {
        return;
    }

    // Trigger become affiliate
    do_action( 'gamipress_easy_affiliate_become_affiliate', $user_id );

}
add_action( 'esaf_event_affiliate-added', 'gamipress_easy_affiliate_become_affiliate_listener' );


/**
 * Earn referral listener
 *
 * @since 1.0.0
 *
 * @param array $args       Args from Easy Affiliate event
 *
 * @return mixed
 */
function gamipress_easy_affiliate_earn_referral_listener( $args ) {

    // Affiliate user ID
    $user_id = $args->evt_id;

    // Bail if no user
    if ( absint( $user_id ) === 0 ) {
        return;
    }

    $user_affiliate = (bool)get_user_meta( $user_id, 'wafp_is_affiliate', true );

    // Bail if user is not affiliated
    if ( ! $user_affiliate ) {
        return;
    }

    // Trigger become affiliate
    do_action( 'gamipress_easy_affiliate_earn_referral', $user_id );

}
add_action( 'esaf_event_transaction-recorded', 'gamipress_easy_affiliate_earn_referral_listener' );

/**
 * Get payment listener
 *
 * @since 1.0.0
 *
 * @param array $args       Args from Easy Affiliate event
 *
 * @return mixed
 */
function gamipress_easy_affiliate_get_payment_listener( $args ) {

    // Affiliate user ID
    $user_id = $args->evt_id;

    // Bail if no user
    if ( absint( $user_id ) === 0 ) {
        return;
    }

    $user_affiliate = (bool)get_user_meta( $user_id, 'wafp_is_affiliate', true );

    // Bail if user is not affiliated
    if ( ! $user_affiliate ) {
        return;
    }

    // Trigger become affiliate
    do_action( 'gamipress_easy_affiliate_get_payment', $user_id );

}
add_action( 'esaf_event_payment-added', 'gamipress_easy_affiliate_get_payment_listener' );
