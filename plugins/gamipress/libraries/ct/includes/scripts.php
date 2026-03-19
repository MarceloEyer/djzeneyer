<?php
/**
 * CT Scripts
 *
 * @since 1.0.0
 */
// Exit if accessed directly
defined( 'ABSPATH' ) || exit;

/**
 * Register admin scripts
 *
 * @since       1.0.0
 * @return      void
 */
function ct_admin_register_scripts() {

    // Scripts
    wp_register_script( 'ct-js', CT_URL . 'assets/js/ct.js', array( 'jquery' ), CT_VER, true );
}
add_action( 'admin_init', 'ct_admin_register_scripts' );

/**
 * Enqueue admin scripts
 *
 * @since       1.0.0
 *
 * @param string $hook
 *
 * @return      void
 */
function ct_admin_enqueue_scripts( $hook ) {

    // Localize admin script
    wp_localize_script( 'ct-js', 'ct_admin', array(
        'ajaxurl'               => esc_url( admin_url( 'admin-ajax.php', 'relative' ) ),
        'nonce'                 => ct_get_admin_nonce(),
    ) );

    // Scripts
    wp_enqueue_script( 'ct-js' );

}
add_action( 'admin_enqueue_scripts', 'ct_admin_enqueue_scripts' );

/**
 * Setup a global nonce for all admin scripts
 *
 * @since       1.0.0
 *
 * @return      string
 */
function ct_get_admin_nonce() {

    if( ! defined( 'CT_ADMIN_NONCE' ) )
        define( 'CT_ADMIN_NONCE', wp_create_nonce( 'ct_admin' ) );

    return CT_ADMIN_NONCE;

}