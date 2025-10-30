<?php
/**
 * DJ Zen Eyer Theme - functions.php
 * v12.0.0 — Centralized Config, AI/SEO Optimized, Enterprise-Grade
 * 
 * @package DJZenEyerTheme
 * @version 12.0.0
 * @updated 2025-10-30
 * @author DJ Zen Eyer Team
 * 
 * =====================================================
 * 📝 ARCHITECTURE:
 * =====================================================
 * 
 * - inc/djz-config.php   → Todas as configurações globais
 * - inc/djz-helpers.php  → Funções auxiliares reutilizáveis
 * - functions.php        → Hooks do WordPress + lógica do tema
 * 
 * Para EDITAR: Vá em inc/djz-config.php (não aqui!)
 */

if (!defined('ABSPATH')) exit;

/* =====================================================
 * 🔧 LOAD CORE FILES
 * ===================================================== */
require_once get_theme_file_path('/inc/djz-helpers.php');

/* =====================================================
 * 📌 CORE CONFIGURATION
 * ===================================================== */
if (!defined('DJZ_VERSION')) {
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    $version = file_exists($manifest_path) ? filemtime($manifest_path) : '12.0.0';
    define('DJZ_VERSION', $version);
}

/* =====================================================
 * 🎨 THEME SUPPORT & SETUP
 * ===================================================== */
add_action('after_setup_theme', function () {
    // Core WordPress features
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'script',
        'style'
    ]);
    
    // WooCommerce (se habilitado)
    if (djz_feature_enabled('woocommerce')) {
        add_theme_support('woocommerce');
    }
    
    // Menus
    register_nav_menus([
        'primary_menu'   => __('Menu Principal', 'djzeneyer'),
        'footer_menu'    => __('Menu Rodapé', 'djzeneyer'),
        'social_menu'    => __('Menu Social', 'djzeneyer'),
    ]);
    
    // Custom logo
    add_theme_support('custom-logo', [
        'height'      => 80,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    
    // Editor styles
    add_editor_style('dist/css/editor-style.css');
});

/* =====================================================
 * 📦 ASSET ENQUEUE (REACT + VITE)
 * ===================================================== */
add_action('wp_enqueue_scripts', function () {
    // Main stylesheet
    wp_enqueue_style(
        'djzeneyer-style',
        get_stylesheet_uri(),
        [],
        DJZ_VERSION
    );
    
    // Vite manifest
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    $theme_uri = get_template_directory_uri();

    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        
        if (isset($manifest['src/main.tsx'])) {
            $entry = $manifest['src/main.tsx'];

            // Enqueue CSS
            if (!empty($entry['css']) && is_array($entry['css'])) {
                wp_enqueue_style(
                    'djzeneyer-react-styles',
                    $theme_uri . '/dist/' . $entry['css'][0],
                    [],
                    DJZ_VERSION
                );
            }

            // Enqueue JS
            if (!empty($entry['file'])) {
                wp_register_script(
                    'djzeneyer-react',
                    $theme_uri . '/dist/' . $entry['file'],
                    [],
                    DJZ_VERSION,
                    true
                );
                wp_enqueue_script('djzeneyer-react');

                // Localize script com configurações
                wp_localize_script('djzeneyer-react', 'djzConfig', [
                    'siteUrl'     => esc_url(home_url('/')),
                    'restUrl'     => esc_url_raw(rest_url()),
                    'nonce'       => wp_create_nonce('wp_rest'),
                    'siteName'    => djz_config('site.name'),
                    'siteTagline' => djz_config('site.tagline'),
                    'social'      => djz_config('social'),
                    'colors'      => djz_config('colors'),
                    'features'    => djz_config('features'),
                ]);
            }
        }
    }
});

// Module type para React
add_filter('script_loader_tag', function ($tag, $handle) {
    if ('djzeneyer-react' === $handle) {
        return str_replace('<script ', '<script type="module" ', $tag);
    }
    return $tag;
}, 10, 2);

/* =====================================================
 * 🔒 SECURITY & HEADERS
 * ===================================================== */
add_action('send_headers', function () {
    if (is_admin() || headers_sent()) return;

    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
});

/* =====================================================
 * 🌐 CORS FOR REST API
 * ===================================================== */
add_action('rest_api_init', function () {
    add_filter('rest_pre_serve_request', function ($served) {
        $allowed = array_map('trim', djz_allowed_origins());
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim($_SERVER['HTTP_ORIGIN']) : '';

        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Requested-With');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }

        return $served;
    }, 15);
});

/* =====================================================
 * 🎨 THEME COLORS CSS VARIABLES
 * ===================================================== */
add_action('wp_head', function () {
    echo '<style id="djz-theme-colors">' . djz_theme_colors_css() . '</style>';
}, 1);

/* =====================================================
 * 📊 CUSTOM REST API ENDPOINTS
 * ===================================================== */
add_action('rest_api_init', function () {
    // Endpoint: /wp-json/djz/v1/config
    register_rest_route('djz/v1', '/config', [
        'methods'  => 'GET',
        'callback' => function () {
            return rest_ensure_response([
                'site'    => djz_config('site'),
                'social'  => djz_config('social'),
                'colors'  => djz_config('colors'),
                'features' => djz_config('features'),
            ]);
        },
        'permission_callback' => '__return_true',
    ]);
    
    // Endpoint: /wp-json/djz/v1/social
    register_rest_route('djz/v1', '/social', [
        'methods'  => 'GET',
        'callback' => function () {
            return rest_ensure_response(djz_social_urls());
        },
        'permission_callback' => '__return_true',
    ]);
    
    // Adicione mais endpoints aqui se necessário
});

/* =====================================================
 * 🎵 CUSTOM POST TYPES (Eventos, Músicas, etc.)
 * ===================================================== */
add_action('init', function () {
    // Post Type: Eventos
    register_post_type('djz_event', [
        'labels' => [
            'name'          => __('Eventos', 'djzeneyer'),
            'singular_name' => __('Evento', 'djzeneyer'),
        ],
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon'    => 'dashicons-calendar-alt',
    ]);
    
    // Post Type: Músicas/Tracks
    register_post_type('djz_track', [
        'labels' => [
            'name'          => __('Músicas', 'djzeneyer'),
            'singular_name' => __('Música', 'djzeneyer'),
        ],
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon'    => 'dashicons-format-audio',
    ]);
});

/* =====================================================
 * 🧹 CLEANUP & OPTIMIZATION
 * ===================================================== */

// Remove WordPress version
remove_action('wp_head', 'wp_generator');

// Remove emoji scripts
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Remove RSD link
remove_action('wp_head', 'rsd_link');

// Remove WLW manifest
remove_action('wp_head', 'wlwmanifest_link');

/* =====================================================
 * 📝 CUSTOM FUNCTIONS (Adicione suas funções aqui)
 * ===================================================== */

// Exemplo: Breadcrumbs SEO
function djz_breadcrumbs() {
    if (!djz_feature_enabled('breadcrumbs') || is_front_page()) return;
    
    echo '<nav class="breadcrumbs" aria-label="Breadcrumb">';
    echo '<a href="' . home_url() . '">Home</a> › ';
    
    if (is_single()) {
        the_category(' › ');
        echo ' › ' . get_the_title();
    } elseif (is_page()) {
        echo get_the_title();
    }
    
    echo '</nav>';
}

// Exemplo: Reading time
function djz_reading_time($post_id = null) {
    if (!djz_feature_enabled('reading_time')) return '';
    
    $post_id = $post_id ?: get_the_ID();
    $content = get_post_field('post_content', $post_id);
    $word_count = str_word_count(strip_tags($content));
    $minutes = ceil($word_count / 200);
    
    return sprintf(__('%d min de leitura', 'djzeneyer'), $minutes);
}
