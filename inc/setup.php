<?php
if (!defined('ABSPATH')) exit;

/* =========================
 * CONSTANTES & CONFIGURAÇÕES GLOBAIS
 * ========================= */
if (!defined('DJZ_VERSION')) {
    define('DJZ_VERSION', '12.0.2');
}

/**
 * Retorna a lista de origens permitidas para CORS.
 */
function djz_allowed_origins(): array {
    return [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'https://app.djzeneyer.com',
        'http://localhost:5173',
        'http://127.0.0.1:5173'
    ];
}

/* =========================
 * THEME SUPPORT
 * ========================= */
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});

/* =========================
 * SEGURANÇA (HEADERS)
 * ========================= */
add_action('send_headers', function() {
    if (is_admin() || headers_sent()) return;
    
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
});

/* =========================
 * CORS (REST API)
 * ========================= */
add_action('rest_api_init', function() {
    add_filter('rest_pre_serve_request', function($served) {
        $allowed_origins = djz_allowed_origins();
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim($_SERVER['HTTP_ORIGIN']) : '';
        
        if (in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin', false);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With');
        
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
        
        return $served;
    }, 15);
});