<?php
/**
 * Plugin Name: Zen Commerce
 * Description: Headless read-model layer on top of WooCommerce. Provides optimized
 *              product and shop endpoints for the React frontend under djzeneyer/v1.
 * Version:     1.0.0
 * Author:      Zen Eyer
 * Author URI:  https://djzeneyer.com
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * License:     GPL v2 or later
 * Text Domain: zen-commerce
 */

if (!defined('ABSPATH')) exit;

define('ZEN_COMMERCE_VERSION',    '1.0.0');
define('ZEN_COMMERCE_PLUGIN_DIR', plugin_dir_path(__FILE__));

// ---------------------------------------------------------------------------
// Load classes
// ---------------------------------------------------------------------------

require_once ZEN_COMMERCE_PLUGIN_DIR . 'includes/class-product-formatter.php';
require_once ZEN_COMMERCE_PLUGIN_DIR . 'includes/class-product-repository.php';
require_once ZEN_COMMERCE_PLUGIN_DIR . 'includes/class-shop-view-model.php';
require_once ZEN_COMMERCE_PLUGIN_DIR . 'includes/class-rest-controller.php';

// ---------------------------------------------------------------------------
// REST routes
// ---------------------------------------------------------------------------

add_action('rest_api_init', ['Zen_Commerce_REST_Controller', 'register_routes']);

// ---------------------------------------------------------------------------
// Cache invalidation
// ---------------------------------------------------------------------------

add_action('save_post_product', function (int $post_id): void {
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) return;
    Zen_Commerce_Product_Repository::flush_cache();
    Zen_Commerce_Shop_View_Model::flush_cache();
}, 10, 1);

// ---------------------------------------------------------------------------
// Admin: "Clear Commerce Cache" button in admin bar
// ---------------------------------------------------------------------------

add_action('admin_bar_menu', function (WP_Admin_Bar $wp_admin_bar): void {
    if (!current_user_can('manage_options')) return;

    $wp_admin_bar->add_node([
        'id'    => 'zen_commerce_clear_cache',
        'title' => '🛍 Clear Shop Cache',
        'href'  => wp_nonce_url(
            add_query_arg('zen_commerce_clear_cache', '1', admin_url()),
            'zen_commerce_clear_cache'
        ),
    ]);
}, 999);

add_action('admin_init', function (): void {
    if (!isset($_GET['zen_commerce_clear_cache']) || !current_user_can('manage_options')) return;
    check_admin_referer('zen_commerce_clear_cache');

    Zen_Commerce_Product_Repository::flush_cache();
    Zen_Commerce_Shop_View_Model::flush_cache();

    wp_safe_redirect(remove_query_arg('zen_commerce_clear_cache'));
    exit;
});
