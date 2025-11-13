<?php
if (!defined('ABSPATH')) exit;

/* ==========================================
 * 🧹 LIMPEZA PROFUNDA (Deep Cleanup)
 * Remove CSS e JS desnecessários do WP Core & Plugins
 * ========================================== */

add_action('after_setup_theme', function () {
    // 1. Esconder a Barra de Admin (Backend visual)
    show_admin_bar(false);
    
    // 2. Remover Emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
});

add_action('wp_enqueue_scripts', function () {
    // 3. REMOVER ESTILOS (CSS)
    wp_dequeue_style('wp-block-library');        // Gutenberg Core
    wp_dequeue_style('wp-block-library-theme');  // Gutenberg Theme
    wp_dequeue_style('wc-blocks-style');         // WooCommerce Blocks
    wp_dequeue_style('global-styles');           // Inline Global Styles
    wp_dequeue_style('classic-theme-styles');    // WP 6.x Classic Styles
    wp_dequeue_style('rank-math-animate');       // Rank Math Animation CSS

    // 4. REMOVER CSS PADRÃO DO WOOCOMMERCE
    add_filter('woocommerce_enqueue_styles', '__return_false');

    // 5. REMOVER SCRIPTS (JS) - CORREÇÃO DE ERROS DE CONSOLE
    // Apenas no frontend (não quebra o admin)
    if (!is_admin()) {
        // WP Core Bloat
        wp_dequeue_script('wp-embed');
        wp_dequeue_script('admin-bar');          // Remove erro "admin-bar.js"
        wp_dequeue_script('wp-emoji');
        
        // Gutenberg / React Conflicts (Remove erros "primitives.min.js", "data.min.js")
        wp_dequeue_script('wp-i18n');
        wp_dequeue_script('wp-hooks');
        wp_dequeue_script('wp-data');            
        wp_dequeue_script('wp-api-fetch');
        wp_dequeue_script('wp-primitives');      

        // Rank Math (Remove erro 404 de analytics)
        // Deregister remove o registro completamente, garantindo que não carregue
        wp_deregister_script('rank-math'); 
        wp_dequeue_script('rank-math');
        wp_deregister_script('rank-math-analyzer'); 
        wp_dequeue_script('rank-math-analyzer');
    }
}, 100); // Prioridade alta (100) para rodar depois dos plugins

add_action('init', function() {
    // 6. Limpeza de Cabeçalho (Security)
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    
    // Remove JSON API Links do head (se você não usa descoberta automática)
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');

    // Desativa a injeção automática de JSON-LD do Rank Math
    // (Já estamos fazendo isso manualmente no inc/seo.php)
    add_filter('rank_math/json_ld', '__return_false');
});

// 7. Garante que a Admin Bar não injete CSS/JS no footer
add_action('wp_footer', function(){
    wp_dequeue_script('admin-bar');
    wp_dequeue_style('admin-bar');
}, 1);
