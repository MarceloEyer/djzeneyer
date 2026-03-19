<?php
/**
 * Admin
 *
 * @package GamiPress\Everest-Forms\Admin
 * @since 1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * WP Everest Forms automatic updates
 *
 * @since  1.0.0
 *
 * @param array $automatic_updates_plugins
 *
 * @return array
 */
function gamipress_everest_forms_automatic_updates( $automatic_updates_plugins ) {

    $automatic_updates_plugins['gamipress'] = __( 'WP Everest Forms integration', 'gamipress' );

    return $automatic_updates_plugins;

}
add_filter( 'gamipress_automatic_updates_plugins', 'gamipress_everest_forms_automatic_updates' );