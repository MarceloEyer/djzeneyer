<?php
/**
 * Core Setup & Security
 * Theme support, CORS, performance tuning
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
 * Security Headers
 */
add_action('send_headers', function() {
    if (is_admin() || headers_sent()) return;
    
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
});

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
 * Performance: Defer Scripts
 */
add_filter('script_loader_tag', function($tag, $handle) {
    if (is_admin() || strpos($tag, 'defer') || strpos($tag, 'async')) {
        return $tag;
    }
    return str_replace(' src', ' defer src', $tag);
}, 10, 2);

/**
 * Performance: Remove Query Strings
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
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">';
    echo '<link rel="dns-prefetch" href="//fonts.gstatic.com">';
}, 0);

/**
 * Performance: Lazy Loading
 */
add_filter('wp_lazy_loading_enabled', '__return_true');

/**
 * Performance: Limit Revisions
 */
if (!defined('WP_POST_REVISIONS')) {
    define('WP_POST_REVISIONS', 3);
}

/**
 * Performance: Memory Limit
 */
if (!defined('WP_MEMORY_LIMIT')) {
    define('WP_MEMORY_LIMIT', '256M');
}

/**
 * Performance: Fetchpriority on First Image
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
 * Database: Create Indexes (runs once)
 */
add_action('after_switch_theme', function() {
    global $wpdb;
    
    $wpdb->query("
        CREATE INDEX IF NOT EXISTS idx_option_name_transient 
        ON {$wpdb->options} (option_name(191))
    ");
    
    $wpdb->query("
        CREATE INDEX IF NOT EXISTS idx_autoload 
        ON {$wpdb->options} (autoload)
    ");
});

/**
 * Database: Clean Expired Transients Daily
 */
add_action('wp_scheduled_delete', function() {
    global $wpdb;
    
    $wpdb->query("
        DELETE FROM {$wpdb->options}
        WHERE option_name LIKE '_transient_timeout_%'
        AND option_value < UNIX_TIMESTAMP()
    ");
    
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
});

/**
 * SEO: Canonical URL with Trailing Slash
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