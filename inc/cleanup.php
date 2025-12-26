<?php
/**
 * Cleanup: Remove WordPress Bloat
 * Removes unused CSS/JS for headless architecture
 */

if (!defined('ABSPATH')) exit;

/**
 * Remove <head> Bloat
 */
add_action('after_setup_theme', function() {
    // Emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    
    // Discovery links
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('template_redirect', 'rest_output_link_header', 11);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
});

/**
 * Remove Gutenberg Bloat
 */
add_action('init', function() {
    remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
    remove_action('wp_enqueue_scripts', 'wp_enqueue_classic_theme_styles');
});

/**
 * Dequeue All Frontend CSS/JS
 */
add_action('wp_enqueue_scripts', function() {
    if (is_admin()) return;
    
    // WordPress Core
    $core_styles = [
        'wp-block-library',
        'wp-block-library-theme',
        'global-styles',
        'classic-theme-styles',
    ];
    
    foreach ($core_styles as $style) {
        wp_dequeue_style($style);
        wp_deregister_style($style);
    }
    
    // WooCommerce
    $woo_styles = [
        'woocommerce-layout',
        'woocommerce-smallscreen',
        'woocommerce-general',
        'wc-blocks-style',
        'wc-brands-styles',
        'woocommerce-brands',
    ];
    
    foreach ($woo_styles as $style) {
        wp_dequeue_style($style);
        wp_deregister_style($style);
    }
    
    add_filter('woocommerce_enqueue_styles', '__return_false');
    
    // GamiPress
    wp_dequeue_style('gamipress-css');
    wp_deregister_style('gamipress-css');
    
    // Scripts
    $scripts = [
        'wp-embed',
        'wp-emoji',
        'wc-cart-fragments',
        'woocommerce',
        'wc-add-to-cart',
    ];
    
    foreach ($scripts as $script) {
        wp_dequeue_script($script);
        wp_deregister_script($script);
    }
    
    // Dashicons (only if not logged in)
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
}, 9999);

/**
 * Remove jQuery Migrate
 */
add_action('wp_default_scripts', function($scripts) {
    if (!is_admin() && !empty($scripts->registered['jquery'])) {
        $scripts->registered['jquery']->deps = array_diff(
            $scripts->registered['jquery']->deps,
            ['jquery-migrate']
        );
    }
});

/**
 * Reduce Heartbeat Frequency
 */
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60;
    return $settings;
});

/**
 * Remove WooCommerce Generator
 */
remove_action('wp_head', 'wc_gallery_noscript');
remove_action('wp_head', 'wc_generator_tag');

/**
 * Disable Translation Updates
 */
add_filter('auto_update_translation', '__return_false');

/**
 * Remove REST Endpoints (security)
 */
add_action('rest_api_init', function() {
    if (!is_user_logged_in()) {
        add_filter('rest_endpoints', function($endpoints) {
            unset($endpoints['/wp/v2/users']);
            unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
            return $endpoints;
        });
    }
}, 99);