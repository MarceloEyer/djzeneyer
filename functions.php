<?php
/**
 * DJ Zen Eyer Theme 2 - functions.php
 * v11.0.0 — Professional-grade, AI/SEO optimized, secure
 * Inspired by WordPress VIP, Netflix, and modern DevOps practices.
 */

if (!defined('ABSPATH')) {
    exit;
}

/* =========================
 * CORE CONFIGURATION
 * ========================= */

if (!defined('DJZ_VERSION')) {
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    $version = file_exists($manifest_path) ? filemtime($manifest_path) : '11.0.0';
    define('DJZ_VERSION', $version);
}

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
 * THEME SUPPORT & SETUP
 * ========================= */

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});

/* =========================
 * ASSET ENQUEUE (REACT + VITE)
 * ========================= */

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri(), [], DJZ_VERSION);

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

                wp_localize_script('djzeneyer-react', 'wpData', [
                    'siteUrl' => esc_url(home_url('/')),
                    'restUrl' => esc_url_raw(rest_url()),
                    'nonce'   => wp_create_nonce('wp_rest'),
                ]);
            }
        }
    }
});

add_filter('script_loader_tag', function ($tag, $handle) {
    if ('djzeneyer-react' === $handle) {
        return str_replace('<script ', '<script type="module" ', $tag);
    }
    return $tag;
}, 10, 2);

/* =========================
 * SECURITY & HEADERS
 * ========================= */

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

/* =========================
 * CUSTOM REST API ENDPOINTS
 * (Keep your existing handlers — they are excellent)
 * ========================= */

// ... (mantenha todas as suas funções djz_*_handler aqui)

add_action('rest_api_init', function () {
    // ... (seus register_rest_route)
});