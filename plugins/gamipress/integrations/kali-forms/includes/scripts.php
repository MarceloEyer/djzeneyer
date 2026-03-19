<?php
/**
 * Scripts
 *
 * @package     GamiPress\Kali-Forms\Scripts
 * @since       1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register admin scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_kali_forms_admin_register_scripts() {
    // Use minified libraries if SCRIPT_DEBUG is turned off
    $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

    // Scripts
    wp_register_script( 'gamipress-kali-forms-admin-js', GAMIPRESS_KALI_FORMS_URL . 'assets/js/gamipress-kali-forms-admin' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_KALI_FORMS_VER, true );

}
add_action( 'admin_init', 'gamipress_kali_forms_admin_register_scripts' );

/**
 * Enqueue admin scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_kali_forms_admin_enqueue_scripts( $hook ) {

    global $post_type;

    // Requirements ui script
    if ( $post_type === 'points-type' || in_array( $post_type, gamipress_get_achievement_types_slugs() ) || in_array( $post_type, gamipress_get_rank_types_slugs() ) ) {
        wp_enqueue_script( 'gamipress-kali-forms-admin-js' );
    }

}
add_action( 'admin_enqueue_scripts', 'gamipress_kali_forms_admin_enqueue_scripts', 100 );