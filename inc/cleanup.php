<?php
/**
 * Cleanup: Remove WordPress Bloat
 * Removes unused CSS/JS for headless architecture
 */

if (!defined('ABSPATH')) exit;

/**
 * Disable WordPress Comments entirely (headless — unused)
 * Prevents WP_Comment_Query from running on every frontend request
 */
add_action('init', function() {
    foreach (get_post_types() as $post_type) {
        if (post_type_supports($post_type, 'comments')) {
            remove_post_type_support($post_type, 'comments');
            remove_post_type_support($post_type, 'trackbacks');
        }
    }
});
add_filter('comments_open', '__return_false', 20, 2);
add_filter('pings_open', '__return_false', 20, 2);
add_filter('comments_array', '__return_empty_array', 10, 2);
add_action('rest_api_init', function() {
    add_filter('rest_endpoints', function($endpoints) {
        unset($endpoints['/wp/v2/comments']);
        unset($endpoints['/wp/v2/comments/(?P<id>[\d]+)']);
        return $endpoints;
    });
}, 100);

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
    remove_action('template_redirect', 'wp_shortlink_header', 11);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head');
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
});

/**
 * Disable MailPoet page view tracking cookie
 * Settings change in admin was insufficient — cookie still being set
 * with 10-year expiry on every response, interfering with LiteSpeed cache
 */
add_filter('option_mailpoet_settings', function($settings) {
    if (is_array($settings)) {
        $settings['tracking']['enabled'] = '0';
    }
    return $settings;
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
 * Disable WP 6.7+ template output buffer for late-printed styles
 * Only useful for block editor rendering — pure overhead in headless
 */
add_filter('wp_should_output_buffer_template_for_enhancement', '__return_false');

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
        'gamipress-js',        // headless — React handles UI, no frontend JS needed
        'sourcebuster-js',     // WooCommerce order attribution — disabled
        'wc-order-attribution', // WooCommerce order attribution — disabled
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
 * Prevent WooCommerce from updating wc_last_active usermeta on every frontend request
 * Feeds WooCommerce Analytics which is disabled — data serves no purpose
 */
add_filter('update_user_metadata', function($check, $object_id, $meta_key) {
    if ($meta_key === 'wc_last_active') return false;
    return $check;
}, 10, 3);

/**
 * Disable WooCommerce Geolocation redirect
 * Prevents per-request geolocation check when not using location-based pricing
 */
add_filter('woocommerce_geolocation_update_customer_from_request', '__return_false');

/**
 * Disable WooCommerce Order Attribution tracking (sbjs_*, tk_ai, tk_qs cookies)
 * Feeds WooCommerce Analytics which is disabled — cookies serve no purpose
 */
add_filter('woocommerce_order_attribution_tracking_enabled', '__return_false');

/**
 * Disable WooCommerce Analytics entirely (not used)
 * Elimina queries de relatórios, customer tracking e admin notes no frontend
 */
add_filter('woocommerce_analytics_enabled', '__return_false');
add_action('init', function() {
    remove_action(
        'wp_loaded',
        ['Automattic\WooCommerce\Admin\API\Reports\Customers\DataStore', 'update_registered_customer']
    );
}, 1);

/**
 * Disable WooCommerce Blocks remote pattern fetching
 * PTKPatternsStore queries Action Scheduler em toda requisição para agendar
 * fetch_patterns. Site headless não usa block patterns do editor.
 */
add_filter('woocommerce_admin_features', function($features) {
    unset($features['pattern-toolkit-full-composability']);
    unset($features['pattern-toolkit-customization']);
    return $features;
}, 999);

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