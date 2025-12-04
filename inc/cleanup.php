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
    remove_action('wp_head', 'wp_generator');
    remove_action('wp_head', 'wp_shortlink_wp_head');
    remove_action('wp_head', 'rest_output_link_wp_head');
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
    remove_action('template_redirect', 'rest_output_link_header', 11);
});

/**
 * 2. REMOÇÃO DE BLOAT DO GUTENBERG (SVG/CSS)
 */
add_action('init', function() {
    remove_action('wp_body_open', 'wp_global_styles_render_svg_filters');
    remove_action('wp_enqueue_scripts', 'wp_enqueue_global_styles');
    remove_action('wp_footer', 'wp_enqueue_global_styles', 1);
});

/**
 * 3. DESATIVAR CSS E JS DO FRONTEND
 * Como é Headless, o WP não precisa estilizar nada.
 */
add_action('wp_enqueue_scripts', function () {
    if (is_admin()) return;

    // REMOVER ESTILOS (CSS) - GUTENBERG
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-blocks-style');
    wp_dequeue_style('global-styles');
    wp_dequeue_style('classic-theme-styles');
    
    // 🆕 REMOVER CSS DO WOOCOMMERCE (conforme PageSpeed)
    wp_dequeue_style('woocommerce-layout');
    wp_dequeue_style('woocommerce-smallscreen');
    wp_dequeue_style('woocommerce-general');
    wp_deregister_style('woocommerce-layout');
    wp_deregister_style('woocommerce-smallscreen');
    wp_deregister_style('woocommerce-general');
    add_filter('woocommerce_enqueue_styles', '__return_false');
    
    // 🆕 REMOVER CSS DO GAMIPRESS
    wp_dequeue_style('gamipress-css');
    wp_deregister_style('gamipress-css');
    
    // 🆕 REMOVER CSS DO ZEN-BIT (seu plugin custom)
    wp_dequeue_style('zen-bit-public-css');
    wp_deregister_style('zen-bit-public-css');
    
    // 🆕 REMOVER BRANDS.CSS do WooCommerce
    wp_dequeue_style('wc-brands-styles');
    wp_deregister_style('wc-brands-styles');

    // REMOVER SCRIPTS (JS)
    wp_dequeue_script('wp-embed');
    wp_dequeue_script('wp-emoji');
    wp_dequeue_script('wp-api-fetch'); 
    wp_dequeue_script('wp-i18n');
    wp_dequeue_script('wp-hooks');
    wp_dequeue_script('wp-polyfill');
    
    // 🆕 REMOVER SCRIPTS DO WOOCOMMERCE
    wp_dequeue_script('wc-cart-fragments');
    wp_dequeue_script('woocommerce');
    wp_dequeue_script('wc-add-to-cart');
    
    // Remove Dashicons para não-logados
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
}, 9999);

/**
 * 4. REMOVER JQUERY MIGRATE
 */
add_action('wp_default_scripts', function( $scripts ) {
    if (!is_admin() && !empty($scripts->registered['jquery'])) {
        $scripts->registered['jquery']->deps = array_diff(
            $scripts->registered['jquery']->deps,
            ['jquery-migrate']
        );
    }
});

/**
 * 🆕 5. DESABILITAR FRONTEND COMPLETAMENTE (HEADLESS MODE)
 * Redireciona qualquer tentativa de acessar páginas WP tradicionais
 */
add_action('template_redirect', function() {
    // Permitir: Admin, REST API, wp-login, xmlrpc, wp-cron
    $allowed_paths = [
        '/wp-admin',
        '/wp-json',
        '/wp-login.php',
        '/xmlrpc.php',
        '/wp-cron.php'
    ];
    
    $request_uri = $_SERVER['REQUEST_URI'];
    
    foreach ($allowed_paths as $path) {
        if (strpos($request_uri, $path) === 0) {
            return; // Permite
        }
    }
    
    // Bloqueia tudo que não é API/Admin
    status_header(404);
    nocache_headers();
    include(get_query_template('404'));
    die();
}, 1);

/**
 * 🆕 6. CORS HEADERS PARA REST API
 * Permite que seu React acesse a API
 */
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: https://djzeneyer.com');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
        
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit();
        }
        
        return $value;
    });
}, 15);

/**
 * 🆕 7. SEGURANÇA: PREVENIR ENUMERAÇÃO DE USUÁRIOS
 */
add_action('rest_api_init', function() {
    if (!is_user_logged_in()) {
        // Bloqueia endpoint /wp-json/wp/v2/users
        add_filter('rest_endpoints', function($endpoints) {
            if (isset($endpoints['/wp/v2/users'])) {
                unset($endpoints['/wp/v2/users']);
            }
            if (isset($endpoints['/wp/v2/users/(?P<id>[\d]+)'])) {
                unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
            }
            return $endpoints;
        });
    }
});

/**
 * 🆕 8. OTIMIZAR HEARTBEAT API (reduz CPU)
 */
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60; // De 15s para 60s
    return $settings;
});

/**
 * 🆕 9. DESABILITAR XML-RPC (segurança)
 * A menos que você precise para alguma integração específica
 */
add_filter('xmlrpc_enabled', '__return_false');

/**
 * 10. REMOVER SCRIPTS DO WOOCOMMERCE - ORDER ATTRIBUTION
 */
add_action('wp_enqueue_scripts', function() {
    if (class_exists('WooCommerce') && !is_admin()) {
        wp_dequeue_script('wc-order-attribution');
        wp_deregister_script('wc-order-attribution');
    }
}, 100);

/**
 * 🆕 11. CACHE HEADERS PARA REST API (melhora performance)
 */
add_filter('rest_post_dispatch', function($response, $server, $request) {
    $response->header('Cache-Control', 'public, max-age=300'); // 5 minutos
    return $response;
}, 10, 3);

/**
 * 12. LIMPEZA FINAL NO FOOTER
 */
add_action('wp_footer', function(){
    if (!is_admin()) {
        wp_dequeue_script('admin-bar');
        wp_dequeue_style('admin-bar');
    }
}, 9999);

/**
 * 🆕 13. REMOVER EMBED DO WOOCOMMERCE NO HEAD
 */
remove_action('wp_head', 'wc_gallery_noscript');

/**
 * 🆕 14. OTIMIZAÇÃO: LIMITAR REVISÕES DE POST
 */
if (!defined('WP_POST_REVISIONS')) {
    define('WP_POST_REVISIONS', 3);
}

/**
 * 🆕 15. DESABILITAR ATUALIZAÇÕES AUTOMÁTICAS DE TRADUÇÃO (reduz cron load)
 */
add_filter('auto_update_translation', '__return_false');
