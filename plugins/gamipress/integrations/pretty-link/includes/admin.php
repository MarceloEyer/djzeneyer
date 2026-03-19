<?php
/**
 * Admin
 *
 * @package GamiPress\Pretty-Link\Admin
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * WP Pretty Link automatic updates
 *
 * @since  1.0.0
 *
 * @param array $automatic_updates_plugins
 *
 * @return array
 */
function gamipress_pretty_link_automatic_updates( $automatic_updates_plugins ) {

    $automatic_updates_plugins['gamipress'] = __( 'WP Pretty Link integration', 'gamipress' );

    return $automatic_updates_plugins;

}
add_filter( 'gamipress_automatic_updates_plugins', 'gamipress_pretty_link_automatic_updates' );