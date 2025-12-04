<?php
if (!defined('ABSPATH')) exit;

/* ==========================================
 * 🧹 CLEANUP.PHP - LIMPEZA EXTREMA HEADLESS
 * 
 * Remove APENAS recursos desnecessários (CSS/JS/HTML bloat)
 * 
 * FILOSOFIA:
 * - Se pode ser desabilitado no plugin → Desabilite lá
 * - Se é do zen-bit → Altere o zen-bit
 * - Se não tem configuração → Vai aqui
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
    remove_action('wp_head', 'rest_output_link_wp_head');      // Link para REST API
    remove_action('wp_head', 'wp_oembed_add_discovery_links'); // oEmbed discovery
    remove_action('template_redirect', 'rest_output_link_header', 11);
    remove_action('wp_head', 'adjacent_posts_rel_link_wp_head'); // Next/Previous
    remove_action('wp_head', 'feed_links', 2);                 // RSS feeds
    remove_action('wp_head', 'feed_links_extra', 3);           // Extra RSS
});

/**
 * 2. GUTENBERG: REMOVER SVG FILTERS E GLOBAL STYLES
 */
add_action('init', function() {
    remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
    remove_action('wp_enqueue_scripts', 'wp_enqueue_classic_theme_styles');
});

/**
 * 3. REMOVER TODO CSS/JS DO FRONTEND
 * WordPress Core, Gutenberg, WooCommerce
 */
add_action('wp_enqueue_scripts', function () {
    // Protege admin
    if (is_admin()) return;

    // === WORDPRESS CORE CSS ===
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
    wp_deregister_style('wp-block-library');
    wp_deregister_style('wp-block-library-theme');
    wp_deregister_style('global-styles');
    wp_deregister_style('classic-theme-styles');

    // === WOOCOMMERCE CSS ===
    wp_dequeue_style('woocommerce-layout');
    wp_dequeue_style('woocommerce-smallscreen');
    wp_dequeue_style('woocommerce-general');
    wp_dequeue_style('wc-blocks-style');
    wp_deregister_style('woocommerce-layout');
    wp_deregister_style('woocommerce-smallscreen');
    wp_deregister_style('woocommerce-general');
    wp_deregister_style('wc-blocks-style');
    
    // Desabilita TODOS os estilos do Woo
    add_filter('woocommerce_enqueue_styles', '__return_false');

    // === WOOCOMMERCE BRANDS CSS (Extension) ===
    // Esse é o brands.css do PageSpeed
    wp_dequeue_style('wc-brands-styles');
    wp_dequeue_style('woocommerce-brands');
    wp_deregister_style('wc-brands-styles');
    wp_deregister_style('woocommerce-brands');
    
    // Fallback: busca dinamicamente qualquer CSS com "brands" no nome
    global $wp_styles;
    if (isset($wp_styles->registered)) {
        foreach ($wp_styles->registered as $handle => $style) {
            if (strpos($style->src, 'brands.css') !== false) {
                wp_dequeue_style($handle);
                wp_deregister_style($handle);
            }
        }
    }

    // === GAMIPRESS CSS ===
    wp_dequeue_style('gamipress-css');
    wp_deregister_style('gamipress-css');

    // === NOTA: zen-bit-public.css ===
    // ⚠️ REMOVA DIRETAMENTE NO PLUGIN ZEN-BIT (melhor prática)
    // Mas mantemos aqui como fallback de segurança
    wp_dequeue_style('zen-bit-public-css');
    wp_deregister_style('zen-bit-public-css');

    // === WORDPRESS CORE JS ===
    wp_dequeue_script('wp-embed');
    wp_dequeue_script('wp-emoji');
    wp_dequeue_script('wp-api-fetch');
    wp_dequeue_script('wp-i18n');
    wp_dequeue_script('wp-hooks');
    wp_dequeue_script('wp-polyfill');
    wp_deregister_script('wp-embed');
    wp_deregister_script('wp-emoji');

    // === WOOCOMMERCE JS ===
    wp_dequeue_script('wc-cart-fragments');
    wp_dequeue_script('woocommerce');
    wp_dequeue_script('wc-add-to-cart');
    wp_dequeue_script('wc-order-attribution');
    wp_deregister_script('wc-cart-fragments');
    wp_deregister_script('woocommerce');
    wp_deregister_script('wc-add-to-cart');
    wp_deregister_script('wc-order-attribution');

    // === LITESPEED CACHE: WEBFONTLOADER ===
    // ⚠️ DESABILITE NO PLUGIN: LiteSpeed → Page Optimization → CSS → "Load Google Fonts Async" = OFF
    // Mas mantemos aqui como fallback
    wp_dequeue_script('litespeed-webfontloader');
    wp_deregister_script('litespeed-webfontloader');

    // === DASHICONS (ícones do admin) ===
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
}, 9999);

/**
 * 4. REMOVER JQUERY MIGRATE
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
 */
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60; // De 15s para 60s
    return $settings;
});

/**
 * 6. ADMIN BAR: REMOVER CSS/JS NO FRONTEND
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
 * 7. WOOCOMMERCE: REMOVER GALLERY NOSCRIPT
 */
remove_action('wp_head', 'wc_gallery_noscript');
remove_action('wp_head', 'wc_generator_tag');

/**
 * 8. DESABILITAR AUTOCOMPLETE DO WOOCOMMERCE
 */
add_action('wp_enqueue_scripts', function() {
    if (class_exists('WooCommerce')) {
        wp_dequeue_script('selectWoo');
        wp_deregister_script('selectWoo');
    }
}, 100);

/**
 * 9. DESABILITAR ATUALIZAÇÕES DE TRADUÇÃO
 */
add_filter('auto_update_translation', '__return_false');

/**
 * 10. REMOVER QUERY STRINGS (?ver=) DE ASSETS
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
 * 11. FALLBACK: REMOVE LITESPEED WEBFONTLOADER DO HTML
 * Caso o dequeue não funcione
 */
add_filter('litespeed_optm_html_head', function($content) {
    $content = preg_replace('/<script[^>]*webfontloader[^>]*>.*?<\/script>/is', '', $content);
    return $content;
}, 999);

/* ==========================================
 * 🎯 RESUMO - ARQUIVOS DO PAGESPEED RESOLVIDOS:
 * ==========================================
 * 
 * ✅ brands.css (2.9 KB)           → Removido aqui (linha 67-82)
 * ✅ zen-bit-public.css (3.3 KB)   → Remover no plugin zen-bit + fallback aqui
 * ✅ webfontloader.min.js (6.9 KB) → Desabilitar no LiteSpeed + fallback aqui
 * ⚠️ index-Dv96D_EQ.css (9.9 KB)   → Carregar async no functions.php do tema
 * 
 * ECONOMIA ESPERADA: ~1.030 ms
 * ==========================================
 */
