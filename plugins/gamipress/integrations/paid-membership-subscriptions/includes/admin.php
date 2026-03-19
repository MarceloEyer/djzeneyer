<?php
/**
 * Admin
 *
 * @package GamiPress\Paid_Membership_Subscriptions\Admin
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Paid Membership Subscriptions automatic updates
 *
 * @since  1.0.0
 *
 * @param array $automatic_updates_plugins
 *
 * @return array
 */
function gamipress_paid_membership_subscriptions_automatic_updates( $automatic_updates_plugins ) {

    $automatic_updates_plugins['gamipress'] = __( 'Paid Membership Subscriptions integration', 'gamipress' );

    return $automatic_updates_plugins;

}
add_filter( 'gamipress_automatic_updates_plugins', 'gamipress_paid_membership_subscriptions_automatic_updates' );