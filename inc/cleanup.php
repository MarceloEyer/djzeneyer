<?php
if (!defined('ABSPATH')) exit;

/* ==========================================
 * 🧹 CLEANUP.PHP - LIMPEZA EXTREMA
 * Remove APENAS recursos desnecessários (CSS/JS/HTML bloat)
 * 
 * Este arquivo é exclusivamente para:
 * - Remover CSS/JS que não são usados no headless
 * - Limpar <head> de meta tags inúteis
 * - Desabilitar features do WP que geram output frontend
 * 
 * NÃO coloque aqui: CORS, redirects, cache, segurança
 * ========================================== */

/**
 * 1. LIMPEZA DO <HEAD>
 * Remove meta tags, links e discovery inúteis
 */
add_action('after_setup_theme', function () {
    // Emojis (CSS + JS)
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');

    // Links de descoberta e meta tags
    remove_action('wp_head', 'rsd_link');                      // Really Simple Discovery
    remove_action('wp_head', 'wlwmanifest_link');              // Windows Live Writer
    remove_action('wp_head', 'wp_generator');                  // Meta tag com versão WP
    remove_action('wp_head', 'wp_shortlink_wp_head');          // Shortlink rel
    remove_action('wp_head', 'rest_output_link_wp_head');      // Link para REST API (React já sabe)
    remove_action('wp_head', 'wp_oembed_add_discovery_links'); // oEmbed discovery
    remove_action('template_redirect', 'rest_output_link_header', 11);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head'); // Next/Previous posts
    remove_action('wp_head', 'feed_links', 2);                 // RSS feed links
    remove_action('wp_head', 'feed_links_extra', 3);           // Extra RSS feeds
});

/**
 * 2. GUTENBERG: REMOVER SVG FILTERS E GLOBAL STYLES
 * Injeta CSS inline gigante no body - totalmente desnecessário
 */
add_action('init', function() {
    remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
    remove_action('wp_enqueue_scripts', 'wp_enqueue_classic_theme_styles');
});

/**
 * 3. REMOVER TODO CSS/JS DO FRONTEND
 * WordPress, Gutenberg, WooCommerce, Gamipress, Plugins
 */
add_action('wp_enqueue_scripts', function () {
    // Protege admin
    if (is_admin()) return;

    // === WORDPRESS CORE CSS ===
    wp_dequeue_style('wp-block-library');           // Blocos Gutenberg
    wp_dequeue_style('wp-block-library-theme');     // Theme do Gutenberg
    wp_dequeue_style('global-styles');              // Inline styles globais
    wp_dequeue_style('classic-theme-styles');       // Classic editor
    wp_deregister_style('wp-block-library');
    wp_deregister_style('wp-block-library-theme');
    wp_deregister_style('global-styles');
    wp_deregister_style('classic-theme-styles');

    // === WOOCOMMERCE CSS ===
    wp_dequeue_style('woocommerce-layout');         // Layout geral
    wp_dequeue_style('woocommerce-smallscreen');    // Mobile styles
    wp_dequeue_style('woocommerce-general');        // Estilos gerais
    wp_dequeue_style('wc-blocks-style');            // Blocos Gutenberg Woo
    wp_dequeue_style('wc-brands-styles');           // Brands extension
    wp_deregister_style('woocommerce-layout');
    wp_deregister_style('woocommerce-smallscreen');
    wp_deregister_style('woocommerce-general');
    wp_deregister_style('wc-blocks-style');
    wp_deregister_style('wc-brands-styles');
    add_filter('woocommerce_enqueue_styles', '__return_false'); // Bloqueia tudo do Woo

    // === GAMIPRESS CSS ===
    wp_dequeue_style('gamipress-css');
    wp_deregister_style('gamipress-css');

    // === ZEN-BIT (Plugin Custom) CSS ===
    wp_dequeue_style('zen-bit-public-css');
    wp_deregister_style('zen-bit-public-css');

    // === WORDPRESS CORE JS ===
    wp_dequeue_script('wp-embed');                  // Embed posts de outros sites WP
    wp_dequeue_script('wp-emoji');                  // Emoji polyfill
    wp_dequeue_script('wp-api-fetch');              // Fetch API do Gutenberg
    wp_dequeue_script('wp-i18n');                   // Internacionalização Gutenberg
    wp_dequeue_script('wp-hooks');                  // Hooks JS do Gutenberg
    wp_dequeue_script('wp-polyfill');               // Polyfills modernizr
    wp_deregister_script('wp-embed');
    wp_deregister_script('wp-emoji');

    // === WOOCOMMERCE JS ===
    wp_dequeue_script('wc-cart-fragments');         // AJAX do carrinho (pesado!)
    wp_dequeue_script('woocommerce');               // Scripts gerais
    wp_dequeue_script('wc-add-to-cart');            // Add to cart
    wp_dequeue_script('wc-order-attribution');      // Tracking de pedidos
    wp_deregister_script('wc-cart-fragments');
    wp_deregister_script('woocommerce');
    wp_deregister_script('wc-add-to-cart');
    wp_deregister_script('wc-order-attribution');

    // === DASHICONS (ícones do admin) ===
    // Remove para não-logados
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
}, 9999); // Prioridade alta para sobrescrever plugins

/**
 * 4. REMOVER JQUERY MIGRATE
 * Dependência legada - não necessária em headless
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
 * 5. HEARTBEAT API: REDUZIR FREQUÊNCIA
 * De 15s para 60s - reduz CPU no admin
 */
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60;
    return $settings;
});

/**
 * 6. ADMIN BAR: REMOVER CSS/JS NO FRONTEND
 * Se aparecer por algum motivo, remove completamente
 */
add_action('wp_footer', function(){
    if (!is_admin()) {
        wp_dequeue_script('admin-bar');
        wp_dequeue_style('admin-bar');
        wp_deregister_script('admin-bar');
        wp_deregister_style('admin-bar');
    }
}, 9999);

/**
 * 7. WOOCOMMERCE: REMOVER GALLERY NOSCRIPT TAG
 * Injeta <style> inline desnecessário
 */
remove_action('wp_head', 'wc_gallery_noscript');

/**
 * 8. DESABILITAR AUTOCOMPLETE DO WOOCOMMERCE
 * Remove script de autocomplete de endereços
 */
add_action('wp_enqueue_scripts', function() {
    if (class_exists('WooCommerce')) {
        wp_dequeue_script('selectWoo');
        wp_deregister_script('selectWoo');
    }
}, 100);

/**
 * 9. REMOVER JQUERY COMPLETAMENTE (OPCIONAL)
 * ⚠️ CUIDADO: Só ative se tiver certeza que nenhum plugin precisa
 * Descomente as linhas abaixo se quiser testar
 */
// add_action('wp_enqueue_scripts', function() {
//     if (!is_admin()) {
//         wp_deregister_script('jquery');
//         wp_deregister_script('jquery-core');
//         wp_deregister_script('jquery-migrate');
//     }
// }, 100);

/**
 * 10. DESABILITAR ATUALIZAÇÕES DE TRADUÇÃO (reduz cron)
 * Não gera output, mas reduz processamento em background
 */
add_filter('auto_update_translation', '__return_false');

/**
 * 11. REMOVER QUERY STRINGS DE ASSETS ESTÁTICOS
 * Remove ?ver=6.4.2 dos CSS/JS (melhora cache)
 */
add_filter('script_loader_src', function($src) {
    if (!is_admin() && strpos($src, 'ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}, 15);

add_filter('style_loader_src', function($src) {
    if (!is_admin() && strpos($src, 'ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}, 15);

/**
 * 12. LIMPAR OUTPUT DO WOOCOMMERCE NO HEAD
 * Remove meta tags de schema.org injetadas
 */
remove_action('wp_head', 'wc_generator_tag');

/**
 * 🎯 RESUMO DO QUE FOI REMOVIDO:
 * ================================
 * ✅ 9 arquivos CSS do PageSpeed (Woo, Gamipress, Gutenberg, Zen-bit)
 * ✅ ~15 scripts JS desnecessários
 * ✅ Emojis (CSS + JS)
 * ✅ Meta tags e discovery links
 * ✅ Global styles inline do Gutenberg
 * ✅ jQuery Migrate
 * ✅ Admin bar assets
 * ✅ Query strings (?ver=)
 * 
 * RESULTADO ESPERADO: -70KB, -1.110ms render blocking
 */
