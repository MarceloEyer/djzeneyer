<?php
/**
 * Limpeza de Headless (Head Cleanup)
 * Remove scripts e estilos desnecessários para React
 */

if (!defined('ABSPATH')) exit;

add_action('after_setup_theme', function () {
    // 1. Remover Barra de Admin no Frontend
    show_admin_bar(false);
    
    // 2. Remover Emojis do WP
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
});

add_action('wp_enqueue_scripts', function () {
    // 3. Remover CSS do Gutenberg e Woo
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-blocks-style');
    
    // 4. Remover CSS padrão do WooCommerce
    add_filter('woocommerce_enqueue_styles', '__return_false');
}, 100);

add_action('init', function() {
    // 5. Limpeza de Cabeçalho
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
});