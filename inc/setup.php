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
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'http://127.0.0.1:3000'
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
 * SEGURANÇA: HttpOnly Cookies
 * ========================= */
add_filter( 'woocommerce_cookie_duration', function ( $duration ) {
    session_set_cookie_params( $duration, COOKIEPATH, COOKIE_DOMAIN, is_ssl(), true ); 
    return $duration;
} );

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

/**
 * Lazy Load nativo
 */
add_filter('wp_lazy_loading_enabled', '__return_true');

/**
 * Remove query strings (?ver=)
 */
add_filter('style_loader_src', 'djzen_remove_query_strings', 10, 2);
add_filter('script_loader_src', 'djzen_remove_query_strings', 10, 2);

function djzen_remove_query_strings($src) {
    if (strpos($src, '?ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}

/**
 * DNS Prefetch para Google Fonts
 */
add_action('wp_head', function() {
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">';
    echo '<link rel="dns-prefetch" href="//fonts.gstatic.com">';
}, 0);

/**
 * Limita revisões de posts (economia de DB)
 */
if (!defined('WP_POST_REVISIONS')) {
    define('WP_POST_REVISIONS', 3);
}

/**
 * Aumenta limite de memória PHP
 */
if (!defined('WP_MEMORY_LIMIT')) {
    define('WP_MEMORY_LIMIT', '256M');
}

/**
 * Fetchpriority na primeira imagem (melhora LCP)
 */
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
    static $first_image = true;
    
    if ($first_image && is_front_page()) {
        $attr['fetchpriority'] = 'high';
        $first_image = false;
    }
    
    return $attr;
}, 10, 2);


/* ==========================================
 * ⚡ PERFORMANCE 80/20: DEFER SCRIPTS
 * ========================================== 
 * Essencial para shared hosting: libera o servidor para entregar 
 * o HTML primeiro, baixando scripts pesados em paralelo.
 */
add_filter('script_loader_tag', function($tag, $handle) {
    // Não altera scripts no painel administrativo
    if (is_admin()) {
        return $tag;
    }

    // Se já tiver defer ou async, ignora
    if (strpos($tag, 'defer') !== false || strpos($tag, 'async') !== false) {
        return $tag;
    }

    // Aplica defer. Isso faz o download em paralelo e executa só no final.
    return str_replace(' src', ' defer src', $tag);
}, 10, 2);

/**
 * OTIMIZAÇÃO DE BANCO - Índices para Transients
 * Roda apenas 1x na ativação do tema
 */
add_action('after_switch_theme', function() {
    global $wpdb;
    
    // Índice para transients (acelera get_transient)
    $wpdb->query("
        CREATE INDEX IF NOT EXISTS idx_option_name_transient 
        ON {$wpdb->options} (option_name(191))
    ");
    
    // Índice para autoload (acelera wp_load_alloptions)
    $wpdb->query("
        CREATE INDEX IF NOT EXISTS idx_autoload 
        ON {$wpdb->options} (autoload)
    ");
    
    // Log
    error_log('[DJ Zen] Database indexes created');
}, 10);

/**
 * LIMPEZA DE TRANSIENTS EXPIRADOS
 * Roda 1x por dia via WP Cron
 */
add_action('wp_scheduled_delete', function() {
    global $wpdb;
    
    // Deleta transients expirados
    $deleted = $wpdb->query("
        DELETE FROM {$wpdb->options}
        WHERE option_name LIKE '_transient_timeout_%'
        AND option_value < UNIX_TIMESTAMP()
    ");
    
    // Deleta os valores orfãos
    $wpdb->query("
        DELETE FROM {$wpdb->options}
        WHERE option_name LIKE '_transient_%'
        AND option_name NOT LIKE '_transient_timeout_%'
        AND option_name NOT IN (
            SELECT REPLACE(option_name, '_transient_timeout_', '_transient_')
            FROM {$wpdb->options}
            WHERE option_name LIKE '_transient_timeout_%'
        )
    ");
    
    error_log("[DJ Zen] Cleaned {$deleted} expired transients");
});

/**
 * 🔗 FIX: CANONICAL URL & TITLE TAG SUPPORT
 * Fornece suporte para canonical URL (Campos para Drive/SoundCloud)
 */

/**
 * 1. Garante suporte a tag de titulo (caso o plugin Zen não esteja fazendo)
 */
function zen_add_title_support() {
    add_theme_support('title-tag');
}


/**
 * 2. Força a barra "/" no final das URLs (Canonical Trailing Slash)
 * Isso evita duplicação de conteúdo e loops de redirecionamento
 */
function zen_fix_canonical_slash($url) {
    if (is_string($url) && substr($url, -1) !== '/' && !preg_match('/\.[a-z]{2,4}$/i', $url)) {
        return $url . '/';
    }
    return $url;
}

add_filter('wpseo_canonical', 'zen_fix_canonical_slash'); // Yoast
add_filter('rank_math/canonical', 'zen_fix_canonical_slash'); // RankMath
