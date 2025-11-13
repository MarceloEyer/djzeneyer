<?php
if (!defined('ABSPATH')) exit;

/* ==========================================
 * 🧹 LIMPEZA PROFUNDA (Deep Cleanup)
 * Remove CSS e JS desnecessários do WP Core & Plugins
 * ========================================== */

add_action('after_setup_theme', function () {
    // 1. Esconder a Barra de Admin
    show_admin_bar(false);
    
    // 2. Remover Emojis
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
});

// 3. REMOVER SCRIPTS E ESTILOS (Prioridade 9999 = Roda por último)
add_action('wp_enqueue_scripts', function () {
    // Remover Estilos
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-blocks-style');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
    wp_dequeue_style('rank-math-animate');

    // Remover CSS padrão do WooCommerce
    add_filter('woocommerce_enqueue_styles', '__return_false');

    // Remover Scripts (Apenas no frontend)
    if (!is_admin()) {
        // WP Core
        wp_dequeue_script('wp-embed');
        wp_dequeue_script('admin-bar');
        wp_dequeue_script('wp-emoji');
        
        // Dependências do Gutenberg (Matando o erro do api-fetch)
        // Deregister é vital aqui para quebrar a cadeia de dependências
        wp_deregister_script('wp-api-fetch'); 
        wp_dequeue_script('wp-api-fetch');
        
        wp_dequeue_script('wp-i18n');
        wp_dequeue_script('wp-hooks');
        wp_dequeue_script('wp-data');            
        wp_dequeue_script('wp-primitives');      

        // Rank Math (Limpeza agressiva)
        wp_deregister_script('rank-math'); 
        wp_dequeue_script('rank-math');
        wp_deregister_script('rank-math-analyzer'); 
        wp_dequeue_script('rank-math-analyzer');
        wp_deregister_script('rank-math-bundle'); 
        wp_dequeue_script('rank-math-bundle');
    }
}, 9999); 

add_action('init', function() {
    // 4. Limpeza de Cabeçalho
    remove_action('wp_head', 'rsd_link');
    remove_action('wp_head', 'wlwmanifest_link');
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'feed_links', 2);
    remove_action('wp_head', 'feed_links_extra', 3);
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');

    // Desativa funções internas do Rank Math no frontend
    add_filter('rank_math/json_ld', '__return_false');
    add_filter('rank_math/sitemap/enable_caching', '__return_false');
});

// 5. Garantia Final no Footer
add_action('wp_footer', function(){
    wp_dequeue_script('admin-bar');
    wp_dequeue_style('admin-bar');
    wp_dequeue_script('wp-api-fetch'); // O golpe de misericórdia no erro 404
}, 9999);