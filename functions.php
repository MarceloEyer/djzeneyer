<?php
/**
 * DJ Zen Eyer Theme Functions
 */

// Enqueue scripts and styles
function djzeneyer_enqueue_scripts() {
    // Enqueue main stylesheet
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri());
    
    // Enqueue React built assets
    wp_enqueue_script('djzeneyer-react', get_template_directory_uri() . '/dist/assets/index.js', array(), '1.0.0', true);
    wp_enqueue_style('djzeneyer-react-styles', get_template_directory_uri() . '/dist/assets/index.css');
    
    // Pass WordPress data to React
    wp_localize_script('djzeneyer-react', 'wpData', array(
        'siteUrl' => get_site_url(),
        'restUrl' => get_rest_url(),
        'nonce' => wp_create_nonce('wp_rest')
    ));
}
add_action('wp_enqueue_scripts', 'djzeneyer_enqueue_scripts');

// Add theme support
function djzeneyer_theme_support() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
}
add_action('after_setup_theme', 'djzeneyer_theme_support');

// Register REST API endpoints
function djzeneyer_register_rest_routes() {
    register_rest_route('djzeneyer/v1', '/menu', array(
        'methods' => 'GET',
        'callback' => 'djzeneyer_get_menu_items',
        'permission_callback' => '__return_true'
    ));
}
add_action('rest_api_init', 'djzeneyer_register_rest_routes');

// Get menu items for the REST API
function djzeneyer_get_menu_items() {
    $menu_items = wp_get_nav_menu_items('primary-menu');
    return rest_ensure_response($menu_items);
}