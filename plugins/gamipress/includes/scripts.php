<?php
/**
 * Scripts
 *
 * @package     GamiPress\Scripts
 * @author      GamiPress <contact@gamipress.com>, Ruben Garcia <rubengcdev@gmail.com>
 * @since       1.0.0
 */
// Exit if accessed directly
if( !defined( 'ABSPATH' ) ) exit;

/**
 * Register frontend scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_register_scripts() {

    // Use minified libraries if SCRIPT_DEBUG is turned off
    $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

    // Stylesheets
    wp_register_style( 'gamipress-css', GAMIPRESS_URL . 'assets/css/gamipress' . $suffix . '.css', array( ), GAMIPRESS_VER, 'all' );
    wp_register_style( 'gamipress-admin-bar-css', GAMIPRESS_URL . 'assets/css/gamipress-admin-bar' . $suffix . '.css', array( ), GAMIPRESS_VER, 'all' );

    // Scripts
    wp_register_script( 'gamipress-js', GAMIPRESS_URL . 'assets/js/gamipress' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_VER, true );

}
add_action( 'init', 'gamipress_register_scripts' );

/**
 * Enqueue frontend scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_enqueue_scripts( $hook = null ) {

    // Stylesheets
    wp_enqueue_style( 'gamipress-css' );

    // Scripts
    $achievement_fields = array();

    if( isset( GamiPress()->shortcodes['gamipress_achievement'] ) && is_array( GamiPress()->shortcodes['gamipress_achievement']->fields ) ) {
        $achievement_fields = array_keys( GamiPress()->shortcodes['gamipress_achievement']->fields );
    }

    wp_localize_script( 'gamipress-js', 'gamipress', array(
        'ajaxurl'               => esc_url( admin_url( 'admin-ajax.php', 'relative' ) ),
        'nonce'                 => gamipress_get_nonce(),
        'achievement_fields'    => $achievement_fields
    ) );

    wp_enqueue_script( 'gamipress-js' );

}
add_action( 'wp_enqueue_scripts', 'gamipress_enqueue_scripts' );

/**
 * Register admin scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_admin_register_scripts() {

    // Use minified libraries if SCRIPT_DEBUG is turned off
    $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

    // Libraries
    wp_register_style( 'gamipress-select2-css', GAMIPRESS_URL . 'assets/libs/select2/css/select2' . $suffix . '.css', array( ), GAMIPRESS_VER, 'all' );
    wp_register_script( 'gamipress-select2-js', GAMIPRESS_URL . 'assets/js/gamipress-select2' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-fabric-js', GAMIPRESS_URL . 'assets/libs/fabric/fabric.min.js', array( 'jquery' ), GAMIPRESS_VER, true );

    // Stylesheets
    wp_register_style( 'gamipress-admin-css', GAMIPRESS_URL . 'assets/css/gamipress-admin' . $suffix . '.css', array( ), GAMIPRESS_VER, 'all' );

    // Scripts
    wp_register_script( 'gamipress-admin-functions-js', GAMIPRESS_URL . 'assets/js/gamipress-admin-functions' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-admin-js', GAMIPRESS_URL . 'assets/js/gamipress-admin' . $suffix . '.js', array( 'jquery', 'gamipress-admin-functions-js', 'gamipress-select2-js' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-admin-widgets-js', GAMIPRESS_URL . 'assets/js/gamipress-admin-widgets' . $suffix . '.js', array( 'jquery', 'gamipress-admin-functions-js', 'gamipress-select2-js' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-requirements-ui-js', GAMIPRESS_URL . 'assets/js/gamipress-requirements-ui' . $suffix . '.js', array( 'jquery', 'jquery-ui-sortable', 'gamipress-admin-functions-js', 'gamipress-select2-js' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-log-extra-data-ui-js', GAMIPRESS_URL . 'assets/js/gamipress-log-extra-data-ui' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-admin-settings-js', GAMIPRESS_URL . 'assets/js/gamipress-admin-settings' . $suffix . '.js', array( 'jquery' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-admin-tools-js', GAMIPRESS_URL . 'assets/js/gamipress-admin-tools' . $suffix . '.js', array( 'jquery', 'jquery-ui-dialog', 'gamipress-admin-functions-js', 'gamipress-select2-js' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-admin-badge-builder-js', GAMIPRESS_URL . 'assets/js/gamipress-admin-badge-builder' . $suffix . '.js', array( 'jquery', 'gamipress-fabric-js' ), GAMIPRESS_VER, true );
    wp_register_script( 'gamipress-badge-builder-editor-js', GAMIPRESS_URL . 'assets/js/gamipress-badge-builder-editor.min.js', array( 'jquery', 'gamipress-admin-badge-builder-js' ), GAMIPRESS_VER, true );

}
add_action( 'admin_init', 'gamipress_admin_register_scripts' );

/**
 * Enqueue admin scripts
 *
 * @since       1.0.0
 * @return      void
 */
function gamipress_admin_enqueue_scripts( $hook ) {

    global $post_type;

    // Stylesheets
    wp_enqueue_style( 'gamipress-admin-css' );

    // Localize admin script
    wp_localize_script( 'gamipress-admin-js', 'gamipress_admin', array(
        'nonce' => gamipress_get_admin_nonce(),
    ) );

    // Scripts
    wp_enqueue_script( 'gamipress-admin-js' );

    // Enqueue admin functions
    gamipress_enqueue_admin_functions_script();

    // Requirements ui script
    if (
        $post_type === 'points-type'
        || in_array( $post_type, gamipress_get_achievement_types_slugs() )
        || in_array( $post_type, gamipress_get_rank_types_slugs() )
    ) {
        // Localize requirements ui script
        wp_localize_script( 'gamipress-requirements-ui-js', 'gamipress_requirements_ui', array(
            'nonce'                         => gamipress_get_admin_nonce(),
            'post_placeholder'              => __( 'Select a Post', 'gamipress' ),
            'unsaved_changes_text'          => __( 'Unsaved Changes', 'gamipress' ),
            'specific_activity_triggers'    => gamipress_get_specific_activity_triggers(),
            'triggers_excluded_from_limit'  => gamipress_get_activity_triggers_excluded_from_activity_limit(),
            'points_triggers'               => gamipress_get_points_triggers(),
            'achievement_type_triggers'     => gamipress_get_achievement_type_triggers(),
            'rank_type_triggers'            => gamipress_get_rank_type_triggers(),
            'post_type_triggers'            => gamipress_get_post_type_triggers(),
            'user_role_triggers'            => gamipress_get_user_role_triggers(),
        ) );

        wp_enqueue_script( 'gamipress-requirements-ui-js' );
    }

    // Logs scripts
    if (
        $hook === 'gamipress_page_gamipress_logs'
        || $hook === 'admin_page_edit_gamipress_logs'
    ) {
        // Localize log extra data ui script
        wp_localize_script( 'gamipress-log-extra-data-ui-js', 'gamipress_log_extra_data_ui', array(
            'nonce' => gamipress_get_admin_nonce(),
        ) );

        wp_enqueue_script( 'gamipress-log-extra-data-ui-js' );
    }

    // Widgets scripts
    if( $hook === 'widgets.php' ) {
        wp_localize_script( 'gamipress-admin-widgets-js', 'gamipress_admin_widgets', array(
            'nonce'                   => gamipress_get_admin_nonce(),
            'id_placeholder'          => __( 'Select a Post', 'gamipress' ),
            'id_multiple_placeholder' => __( 'Select Post(s)', 'gamipress' ),
            'user_placeholder'        => __( 'Select an User', 'gamipress' ),
            'post_type_placeholder'   => __( 'Default: All', 'gamipress' ),
            'rank_placeholder'        => __( 'Select a Rank', 'gamipress' ),
        ) );

        wp_enqueue_script( 'gamipress-admin-widgets-js' );
    }

    // Settings page
    if( $hook === 'gamipress_page_gamipress_settings' ) {
        wp_enqueue_script( 'gamipress-admin-settings-js' );
    }

    // Tools page
    if( $hook === 'gamipress_page_gamipress_tools' ) {

        $user = get_userdata( get_current_user_id() );

        wp_localize_script( 'gamipress-admin-tools-js', 'gamipress_admin_tools', array(
            'nonce'                     => gamipress_get_admin_nonce(),
            // Notices
            'recount_activity_notice'   => __( 'Please be patient while this process is running. This can take a while, up to some minutes. Do not navigate away from this page until this script is done. You will be notified via this page when the recount process is completed.', 'gamipress' ),
            // User data (used as sample on CSV templates)
            'user_id'                   => $user->ID,
            'user_name'                 => $user->user_login,
            'user_email'                => $user->user_email,
        ) );

        wp_enqueue_script( 'gamipress-admin-tools-js' );

        // Enqueue WordPress jQuery UI Dialog style
        wp_enqueue_style ( 'wp-jquery-ui-dialog' );

    }

    // Badge Builder
    if( $hook === 'gamipress_page_gamipress_badge_builder' ) {

        $icons = gamipress_badge_builder_get_icons();
        $shapes_ids = array_keys( $icons['shapes']['icons'] );
        $icons_ids = array();
        foreach( $icons as $group_id => $group ) {
            if( in_array( $group_id, array( 'shapes', 'editor', 'logos' ) ) ) continue;

            $icons_ids = array_merge( $icons_ids, array_keys( $icons[$group_id]['icons'] ) );
        }

        // Scripts
        wp_localize_script( 'gamipress-admin-badge-builder-js', 'gamipress_admin_badge_builder', array(
            'nonce'                     => gamipress_get_admin_nonce(),
            'color_palettes'            => gamipress_badge_builder_get_color_palettes(),
            'insert_text_here'          => __( 'Insert text here', 'gamipress' ),
            'show_text'                 => __( 'Show', 'gamipress' ),
            'hide_text'                 => __( 'Hide', 'gamipress' ),
            'shapes'                    => $shapes_ids,
            'icons'                     => $icons_ids,
        ) );

        wp_enqueue_script( 'gamipress-fabric-js' );
        wp_enqueue_script( 'gamipress-admin-badge-builder-js' );
        wp_enqueue_script( 'gamipress-badge-builder-editor-js' );

    }

}
add_action( 'admin_enqueue_scripts', 'gamipress_admin_enqueue_scripts' );

/**
 * Register and enqueue admin bar scripts
 *
 * @since       1.5.1
 * @return      void
 */
function gamipress_enqueue_admin_bar_scripts() {

    wp_enqueue_style( 'gamipress-admin-bar-css' );

}
add_action( 'admin_bar_init', 'gamipress_enqueue_admin_bar_scripts' );

/**
 * Enqueue Gutenberg block assets for backend editor
 *
 * @since 1.6.0
 */
function gamipress_blocks_editor_assets() {

    // Scripts
    wp_enqueue_script( 'gamipress-blocks-js', GAMIPRESS_URL . 'assets/js/gamipress-blocks.js', array( 'wp-blocks', 'wp-i18n', 'wp-element' ), GAMIPRESS_VER, true );

    // Styles
    wp_enqueue_style( 'gamipress-blocks-editor-css', GAMIPRESS_URL . 'assets/css/gamipress-blocks-editor.css', array( 'wp-edit-blocks' ), GAMIPRESS_VER );
}
add_action( 'enqueue_block_editor_assets', 'gamipress_blocks_editor_assets' );

/**
 * Localize Gutenberg block assets.
 *
 * @since 1.6.0
 */
function gamipress_localize_blocks_editor_assets() {

    // Setup shortcode to be converted as gutenberg block
    $shortcodes = array();

    foreach( GamiPress()->shortcodes as $shortcode ) {

        $shortcodes[$shortcode->slug] = array(
            'name'          => $shortcode->name,
            'slug'          => $shortcode->slug,
            'icon'          => $shortcode->icon,
            'fields'        => gamipress_get_block_fields( $shortcode ),
            'tabs'          => $shortcode->tabs,
            'attributes'    => gamipress_get_block_attributes( $shortcode ),
        );

    }

    // Setup an array of post type labels to use on post selector field
    $post_types = get_post_types( array(), 'objects' );
    $post_type_labels = array();

    foreach( $post_types as $key => $obj ) {
        $post_type_labels[$key] = $obj->labels->singular_name;
    }

    // Localize gamipress-blocks-js script
    wp_localize_script( 'gamipress-blocks-js', 'gamipress_blocks', array(
        'shortcodes' => $shortcodes,
        'icons' => gamipress_get_block_icons(),
        'post_type_labels' => $post_type_labels,
    ) );

}
add_action( 'enqueue_block_editor_assets', 'gamipress_localize_blocks_editor_assets', 11 );

/**
 * Enqueue the admin functions script with all required components
 *
 * @since       1.7.4.1
 * @return      void
 */
function gamipress_enqueue_admin_functions_script() {

    // Enqueue Select2 library
    wp_enqueue_script( 'gamipress-select2-js' );
    wp_enqueue_style( 'gamipress-select2-css' );

    // Setup an array of post type labels to use on post selector field
    $post_types = get_post_types( array(), 'objects' );
    $post_type_labels = array();

    foreach( $post_types as $key => $obj ) {
        $post_type_labels[$key] = $obj->labels->singular_name;
    }

    // Localize admin functions script
    wp_localize_script( 'gamipress-admin-functions-js', 'gamipress_admin_functions', array(
        'nonce'                     => gamipress_get_admin_nonce(),
        'post_type_labels'          => $post_type_labels,
        'reserved_terms'            => gamipress_get_reserved_terms(),
        // Selector placeholders
        'selector_placeholder'      => __( 'Select an option', 'gamipress' ),
        'post_selector_placeholder' => __( 'Select a post', 'gamipress' ),
        'user_selector_placeholder' => __( 'Select a user', 'gamipress' ),
        // Slug error messages
        'slug_error_special_char'   => __( 'Slug can\'t contain special characters. Only alphanumeric characters are allowed.', 'gamipress' ),
        'slug_error_max_length'     => __( 'Slug supports a maximum of 20 characters.', 'gamipress' ),
        'slug_error_post_type'      => __( 'The %s post type already uses this slug.', 'gamipress' ),
        'slug_error_reserved_term'  => __( 'Slug can\'t match any <a href="https://codex.wordpress.org/Reserved_Terms">WordPress reserved term</a>.', 'gamipress' ),

    ) );

    wp_enqueue_script( 'gamipress-admin-functions-js' );

}

/**
 * Setup a global nonce for all frontend scripts
 *
 * @since       1.7.9
 *
 * @return      string
 */
function gamipress_get_nonce() {

    if( ! defined( 'GAMIPRESS_NONCE' ) )
        define( 'GAMIPRESS_NONCE', wp_create_nonce( 'gamipress' ) );

    return GAMIPRESS_NONCE;

}

/**
 * Setup a global nonce for all admin scripts
 *
 * @since       1.7.9
 *
 * @return      string
 */
function gamipress_get_admin_nonce() {

    if( ! defined( 'GAMIPRESS_ADMIN_NONCE' ) )
        define( 'GAMIPRESS_ADMIN_NONCE', wp_create_nonce( 'gamipress_admin' ) );

    return GAMIPRESS_ADMIN_NONCE;

}
