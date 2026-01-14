<?php
/**
 * Core Setup & Security
 * Theme support, CORS, performance tuning, and Security Headers
 * @version 2.1.0 (CSP Compatible - Async CSS Disabled)
 */

if (!defined('ABSPATH')) exit;

// Constants
define('DJZ_CACHE_MENU', 6 * HOUR_IN_SECONDS);
define('DJZ_CACHE_PRODUCTS', 30 * MINUTE_IN_SECONDS);
define('DJZ_CACHE_GAMIPRESS', 15 * MINUTE_IN_SECONDS);

/**
 * GamiPress helper: resolve points type slug with fallback.
 */
function djz_get_gamipress_points_type_slug(): string {
    $default = 'zen-points';
    if (!function_exists('gamipress_get_points_types')) {
        return $default;
    }

    $points_types = gamipress_get_points_types();
    if (empty($points_types)) {
        return $default;
    }

    if (isset($points_types[$default])) {
        return $default;
    }

    $first = array_key_first($points_types);
    return $first ?: $default;
}

/**
 * GamiPress helper: resolve rank tiers with fallback.
 *
 * @return array{tiers: array<int, array{name: string, min: int, next: int}>, source: string}
 */
function djz_get_gamipress_rank_tiers(): array {
    $fallback = [
        ['name' => 'Zen Novice', 'min' => 0, 'next' => 100],
        ['name' => 'Zen Apprentice', 'min' => 100, 'next' => 500],
        ['name' => 'Zen Voyager', 'min' => 500, 'next' => 1500],
        ['name' => 'Zen Master', 'min' => 1500, 'next' => 4000],
        ['name' => 'Zen Legend', 'min' => 4000, 'next' => 10000],
    ];

    if (!function_exists('gamipress_get_rank_types')) {
        return [
            'tiers' => apply_filters('djz_gamipress_rank_tiers', $fallback),
            'source' => 'fallback',
        ];
    }

    $rank_types = gamipress_get_rank_types();
    $rank_slug = !empty($rank_types) ? array_key_first($rank_types) : null;
    if (!$rank_slug) {
        return [
            'tiers' => apply_filters('djz_gamipress_rank_tiers', $fallback),
            'source' => 'fallback',
        ];
    }

    $ranks = get_posts([
        'post_type' => $rank_slug,
        'post_status' => 'publish',
        'numberposts' => -1,
        'orderby' => 'menu_order',
        'order' => 'ASC',
    ]);

    if (empty($ranks)) {
        return [
            'tiers' => apply_filters('djz_gamipress_rank_tiers', $fallback),
            'source' => 'fallback',
        ];
    }

    $tiers = [];
    foreach ($ranks as $rank) {
        $min_points = (int) get_post_meta($rank->ID, '_gamipress_points_required', true);
        if ($min_points <= 0) {
            $min_points = (int) get_post_meta($rank->ID, '_gamipress_points', true);
        }

        $tiers[] = [
            'name' => $rank->post_title,
            'min' => max(0, $min_points),
            'next' => 0,
        ];
    }

    usort($tiers, function($a, $b) {
        return $a['min'] <=> $b['min'];
    });

    $count = count($tiers);
    for ($i = 0; $i < $count; $i++) {
        $next_min = $tiers[$i + 1]['min'] ?? 0;
        if ($next_min <= $tiers[$i]['min']) {
            $next_min = $tiers[$i]['min'] + 1000;
        }
        $tiers[$i]['next'] = $next_min;
    }

    return [
        'tiers' => apply_filters('djz_gamipress_rank_tiers', $tiers),
        'source' => 'gamipress',
    ];
}

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
 * CORS for REST API
 * (Mantido como fallback para o .htaccess)
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
 * [DESATIVADO] Performance: Async CSS Loading
 * MOTIVO: Conflito com CSP Strict (unsafe-inline).
 * O truque onload="this.media='all'" é bloqueado pela política de segurança.
 * O carregamento do CSS agora é gerido de forma padrão ou via Preload no vite.php.
 */
/*
add_filter('style_loader_tag', function($html, $handle) {
    if (is_admin()) return $html;

    if (strpos($handle, 'index') !== false || strpos($handle, 'style') !== false) {
        return str_replace("media='all'", "media='print' onload=\"this.media='all'\"", $html);
    }
    
    return $html;
}, 10, 2);
*/

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
