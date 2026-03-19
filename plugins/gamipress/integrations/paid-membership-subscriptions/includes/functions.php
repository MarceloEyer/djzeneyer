<?php
/**
 * Functions
 *
 * @package GamiPress\Paid-Membership-Subscriptions\Functions
 * @since 1.0.0
 */

// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Overrides GamiPress AJAX Helper for selecting posts
 *
 * @since 1.0.0
 */
function gamipress_paid_membership_subscriptions_add_active_status(  ){
	
	$where = " OR p.post_status = 'active'";
	
	return $where;
}
add_filter( 'gamipress_ajax_get_posts_query_args', 'gamipress_paid_membership_subscriptions_add_active_status' );