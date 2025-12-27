<?php
/**
 * Core Setup & Security
 * Theme support, CORS, performance tuning, and Security Headers
 * @version 2.0.1 (Diamond Performance Edition - CSP Fix)
 */

if (!defined('ABSPATH')) exit;

// Constants
define('DJZ_CACHE_MENU', 6 * HOUR_IN_SECONDS);
define('DJZ_CACHE_PRODUCTS', 30 * MINUTE_IN_SECONDS);
define('DJZ_CACHE_GAMIPRESS', 15 * MINUTE_IN_SECONDS);

/**
 * Allowed origins for CORS
 */
function djz_allowed_origins(): array {
    return [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];
}

/**
 * Theme Support
 */
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('html5', [
        'search-form', 
        'comment-form', 
        'comment-list', 
        'gallery', 
        'caption'
    ]);
    
    register_nav_menus([
        'primary_menu' => __('Menu Principal', 'djzeneyer')
    ]);
});

/**
 * Security Headers (CORREÇÃO CRÍTICA PARA HOSTINGER + REACT)
 * Sincronizado com o plugin ZenEyer Auth Pro para evitar conflitos.
 */
add_action('send_headers', function() {
    if (is_admin() || headers_sent()) return;
    
    // 1. Limpeza de headers antigos/inseguros
    header_remove('X-Powered-By');
    header_remove("Content-Security-Policy");
    header_remove("X-Content-Security-Policy");
    header_remove("X-WebKit-CSP");
    
    // 2. Headers de Segurança Padrão
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    // 3. CSP Permissivo "Padrão Ouro" (Igual ao Plugin)
    // Libera explicitamente script-src com unsafe-eval
    $csp = "default-src 'self' https: data:; " .
           "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://static.cloudflareinsights.com https://accounts.google.com https://apis.google.com https://gsi.client-url.com https://www.googletagmanager.com; " .
           "connect-src 'self' https://djzeneyer.com https://challenges.cloudflare.com https://static.cloudflareinsights.com https://accounts.google.com https://www.googleapis.com https://cloudflareinsights.com; " .
           "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://accounts.google.com; " .
           "font-src 'self' https://fonts.gstatic.com data:; " .
           "img-src 'self' https: data: blob:; " .
           "frame-src 'self' https://challenges.cloudflare.com https://accounts.google.com; " .
           "object-src 'none'; base-uri 'self';";

    header("Content-Security-Policy: " . $csp);
    
    // 4. HSTS (Apenas em SSL)
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}, 999);

/**
 * CORS for REST API
 */
add_action('rest_api_init', function() {
    add_filter('rest_pre_serve_request', function($served) {
        $allowed = djz_allowed_origins();
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin', false);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce');
        
        if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
            status_header(200);
            exit;
        }
        
        return $served;
    }, 15);
});

/**
 * HttpOnly Cookies
 */
add_filter('woocommerce_cookie_duration', function($duration) {
    session_set_cookie_params($duration, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true);
    return $duration;
});

/**
 * Performance: Defer Critical Scripts (Resolve Render Blocking)
 * Adiciona 'defer' aos scripts do Vite e Webfontloader
 */
add_filter('script_loader_tag', function($tag, $handle) {
    if (is_admin()) return $tag;

    // Lista de scripts que devem carregar sem travar a página
    $defer_scripts = ['vite', 'index', 'webfontloader', 'react'];

    foreach ($defer_scripts as $script_name) {
        if (strpos($handle, $script_name) !== false) {
            return str_replace(' src', ' defer src', $tag);
        }
    }
    
    return $tag;
}, 10, 2);

/**
 * Performance: Async CSS Loading (Resolve CSS Render Blocking)
 * Carrega o CSS como 'print' e troca para 'all' depois
 */
add_filter('style_loader_tag', function($html, $handle) {
    if (is_admin()) return $html;

    // Aplica apenas ao CSS principal do tema/vite
    if (strpos($handle, 'index') !== false || strpos($handle, 'style') !== false) {
        return str_replace("media='all'", "media='print' onload=\"this.media='all'\"", $html);
    }
    
    return $html;
}, 10, 2);

/**
 * Performance: Remove Query Strings (Limpeza de URL)
 */
add_filter('style_loader_src', 'djz_remove_query_strings', 10);
add_filter('script_loader_src', 'djz_remove_query_strings', 10);

function djz_remove_query_strings($src) {
    return remove_query_arg('ver', $src);
}

/**
 * Performance: DNS Prefetch
 */
add_action('wp_head', function() {
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">' . "\n";
    echo '<link rel="dns-prefetch" href="//fonts.gstatic.com">' . "\n";
}, 0);

/**
 * Performance: Lazy Loading
 */
add_filter('wp_lazy_loading_enabled', '__return_true');

/**
 * Performance: Fetchpriority on First Image (LCP Optimizer)
 */
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
    static $first = true;
    
    if ($first && is_front_page()) {
        $attr['fetchpriority'] = 'high';
        $first = false;
    }
    
    return $attr;
}, 10, 2);

/**
 * Database: Cleanup & Indexes
 */
add_action('after_switch_theme', function() {
    global $wpdb;
    $wpdb->query("CREATE INDEX IF NOT EXISTS idx_autoload ON {$wpdb->options} (autoload)");
});

// Limpeza diária de transients expirados
add_action('wp_scheduled_delete', function() {
    global $wpdb;
    $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '_transient_timeout_%' AND option_value < UNIX_TIMESTAMP()");
});

/**
 * SEO: Canonical URL Fix
 */
add_filter('wpseo_canonical', 'djz_fix_canonical_slash');
add_filter('rank_math/frontend/canonical', 'djz_fix_canonical_slash');
add_filter('get_canonical_url', 'djz_fix_canonical_slash');

function djz_fix_canonical_slash($url) {
    if (is_string($url) && substr($url, -1) !== '/' && !preg_match('/\.[a-z]{2,4}$/i', $url)) {
        return $url . '/';
    }
    return $url;
}