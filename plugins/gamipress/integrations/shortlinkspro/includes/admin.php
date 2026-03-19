<?php
/**
 * Admin
 *
 * @package GamiPress\ShortLinksPro\Admin
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * ShortLinks Pro automatic updates
 *
 * @since  1.0.0
 *
 * @param array $automatic_updates_plugins
 *
 * @return array
 */
function gamipress_shortlinkspro_automatic_updates( $automatic_updates_plugins ) {

    $automatic_updates_plugins['gamipress'] = __( 'ShortLinks Pro integration', 'gamipress' );

    return $automatic_updates_plugins;

}
add_filter( 'gamipress_automatic_updates_plugins', 'gamipress_shortlinkspro_automatic_updates' );