<?php
if (!defined('ABSPATH')) exit;

/* ==========================================
 * 🚀 LIMPEZA EXTREMA: HEADLESS MODE
 * Remove tudo que não é essencial para a API.
 * ========================================== */

/**
 * 1. LIMPEZA DO HEADER E EMOJIS
 * Remove meta tags, links e scripts inúteis do <head>.
 */
add_action('after_setup_theme', function () {
    // Remove Emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');

    // Remove Links de Descoberta/Meta (RSD, WLW, Shortlinks)
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator'); // Segurança: esconde a versão do WP
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'rest_output_link_wp_head'); // O Front headless já sabe onde a API está
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
});

/**
 * 2. REMOÇÃO DE BLOAT DO GUTENBERG (SVG/CSS)
 */
add_action('init', function() {
    // Remove filtros SVG e CSS globais injetados no body
    remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
});

/**
 * 3. DESATIVAR CSS E JS DO FRONTEND
 * Como é Headless, o WP não precisa estilizar nada.
 */
add_action('wp_enqueue_scripts', function () {
    if (is_admin()) return; // Protege o painel administrativo

    // REMOVER ESTILOS (CSS)
    wp_dequeue_style('wp-block-library');        // CSS do Gutenberg
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-blocks-style');         // CSS de blocos Woo
    wp_dequeue_style('global-styles');           // Inline styles gigantes
    wp_dequeue_style('classic-theme-styles');
    
    // Se tiver WooCommerce, remove o CSS dele também
    add_filter('woocommerce_enqueue_styles', '__return_false');

    // REMOVER SCRIPTS (JS)
    wp_dequeue_script('wp-embed');      // Embed de outros sites WP
    wp_dequeue_script('wp-emoji');
    
    // Scripts de API/Utilidades (Geralmente não usados no output HTML do Headless)
    wp_dequeue_script('wp-api-fetch'); 
    wp_dequeue_script('wp-i18n');
    wp_dequeue_script('wp-hooks');
    wp_dequeue_script('wp-polyfill'); 
    
    // Remove Dashicons para usuários não logados
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
}, 9999);

/**
 * 4. REMOVER JQUERY MIGRATE
 * Remove a dependência legada completamente.
 */
add_action('wp_default_scripts', function( $scripts ) {
    if ( ! is_admin() && ! empty( $scripts->registered['jquery'] ) ) {
        $scripts->registered['jquery']->deps = array_diff(
            $scripts->registered['jquery']->deps,
            array( 'jquery-migrate' )
        );
    }
});

/**
 * 5. OTIMIZAÇÕES DE BACKEND/API
 */

// Reduz uso da CPU pelo Heartbeat API (de 15s para 60s)
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60; 
    return $settings;
});

// Desabilita scripts de "Order Attribution" do WooCommerce (Performance)
add_action('wp_enqueue_scripts', function() {
    if (class_exists('WooCommerce') && !is_admin()) {
        wp_dequeue_script('wc-order-attribution');
        wp_deregister_script('wc-order-attribution');
    }
}, 100);

// Limpeza final no Footer
add_action('wp_footer', function(){
    if (!is_admin()) {
        wp_dequeue_script('admin-bar');
        wp_dequeue_style('admin-bar');
    }
}, 9999);