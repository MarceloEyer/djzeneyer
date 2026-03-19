<?php
/**
 * Scripts
 *
 * @package     GamiPress\Asgaros_Forum\Scripts
 * @since       1.0.1
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register admin scripts
 *
 * @since       1.0.1
 * @return      void
 */
function gamipress_asgaros_forum_admin_register_scripts() {
    // Use minified libraries if SCRIPT_DEBUG is turned off
    $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

    // Stylesheets
    wp_register_style( 'gamipress-asgaros-forum-admin-css', GAMIPRESS_ASGAROS_FORUM_URL . 'assets/css/gamipress-asgaros-forum-admin' . $suffix . '.css', array( ), GAMIPRESS_ASGAROS_FORUM_VER, 'all' );

    // Scripts
    wp_register_script( 'gamipress-asgaros-forum-admin-js', GAMIPRESS_ASGAROS_FORUM_URL . 'assets/js/gamipress-asgaros-forum-admin' . $suffix . '.js', array( 'jquery', 'jquery-ui-sortable' ), GAMIPRESS_ASGAROS_FORUM_VER, true );

}
add_action( 'admin_init', 'gamipress_asgaros_forum_admin_register_scripts' );

/**
 * Enqueue admin scripts
 *
 * @since       1.0.1
 * @return      void
 */
function gamipress_asgaros_forum_admin_enqueue_scripts( $hook ) {

    // Settings page
    if( $hook === 'gamipress_page_gamipress_settings' ) {

        //Stylesheets
        wp_enqueue_style( 'gamipress-asgaros-forum-admin-css' );


    }

    global $post_type;

    // Requirements ui script
    if ( $post_type === 'points-type' || in_array( $post_type, gamipress_get_achievement_types_slugs() ) || in_array( $post_type, gamipress_get_rank_types_slugs() ) ) {
        wp_enqueue_script( 'gamipress-asgaros-forum-admin-js' );
    }

}
add_action( 'admin_enqueue_scripts', 'gamipress_asgaros_forum_admin_enqueue_scripts', 100 );