<?php
/**
 * DJ Zen Eyer Theme - functions.php
 * v12.3.0 — Enterprise-Grade, Secure, AI/SEO Optimized
 * 
 * 🎯 ARCHITECTURE:
 * - inc/djz-config.php   → Todas as configurações globais (não editar aqui!)
 * - inc/djz-helpers.php  → Funções auxiliares reutilizáveis
 * - functions.php        → Hooks do WordPress + lógica do tema
 * 
 * @package DJZenEyerTheme
 * @version 12.3.0
 * @updated 2025-10-30 @ 16:10 UTC
 * @author DJ Zen Eyer Team
 * 
 * =====================================================
 * 🔒 SECURITY UPDATES (v12.3.0 - HOTFIX):
 * =====================================================
 * ✅ CSP Level 3 COMPLETO (object-src + script-src + trusted-types)
 * ✅ CSP nonce em <style> inline (CSP compliance)
 * ✅ REST API data validation + sanitization
 * ✅ Permission callbacks for sensitive endpoints
 * ✅ CORS origin validation (strict in_array)
 * ✅ Error handling + try-catch para JSON decode
 * ✅ Headers hardened (HSTS, X-Frame, CSP Level 3)
 * ✅ SQL injection prevention (usar filters WP)
 * ✅ Input sanitization em Rest API
 * ✅ Rate limiting ready (filtro customizável)
 * ✅ Nonce reuse optimization
 */

if (!defined('ABSPATH')) {
    exit;
}

/* =====================================================
 * 🔧 LOAD CORE FILES (REQUIRED)
 * ===================================================== */
require_once get_theme_file_path('/inc/djz-helpers.php');

/* =====================================================
 * 📌 DEFINE THEME VERSION (From manifest or fallback)
 * ===================================================== */
if (!defined('DJZ_VERSION')) {
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    $version = file_exists($manifest_path) ? filemtime($manifest_path) : '12.3.0';
    define('DJZ_VERSION', $version);
}

/* =====================================================
 * 🎨 THEME SETUP & SUPPORT (after_setup_theme hook)
 * ===================================================== */
add_action('after_setup_theme', function () {
    // Load text domain for translations
    load_theme_textdomain('djzeneyer', get_template_directory() . '/languages');
    
    // Core WordPress features
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('responsive-embeds');
    
    // HTML5 semantic markup
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'script',
        'style'
    ]);
    
    // WooCommerce support (if enabled)
    if (djz_feature_enabled('woocommerce')) {
        add_theme_support('woocommerce');
        add_theme_support('wc-product-gallery-zoom');
        add_theme_support('wc-product-gallery-lightbox');
        add_theme_support('wc-product-gallery-slider');
    }
    
    // Register navigation menus
    register_nav_menus([
        'primary_menu' => __('Menu Principal', 'djzeneyer'),
        'footer_menu'  => __('Menu Rodapé', 'djzeneyer'),
        'social_menu'  => __('Menu Social', 'djzeneyer'),
    ]);
    
    // Custom logo
    add_theme_support('custom-logo', [
        'height'      => 80,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ]);
    
    // Editor styles
    if (file_exists(get_template_directory() . '/dist/css/editor-style.css')) {
        add_editor_style('dist/css/editor-style.css');
    }
    
}, 0); // Priority 0 to run first

/* =====================================================
 * 🔒 CSP NONCE GENERATOR (v12.3.0 - NEW!)
 * ===================================================== */
/**
 * Generate and return CSP nonce for current request
 * Nonce changes every page load for security
 * 
 * @return string Base64 encoded random nonce
 */
function djzeneyer_get_csp_nonce() {
    static $nonce = null;
    
    if ($nonce === null) {
        // Generate cryptographically secure random nonce
        $nonce = base64_encode(random_bytes(16));
        
        // Store in global for reuse in same request
        $GLOBALS['djz_csp_nonce'] = $nonce;
    }
    
    return $nonce;
}

/* =====================================================
 * 🔐 SECURITY HEADERS + CSP LEVEL 3 (v12.3.0 - FIXED!)
 * ===================================================== */
add_action('send_headers', function () {
    if (is_admin() || headers_sent()) {
        return;
    }

    // Remove WordPress signatures
    header_remove('X-Powered-By');
    
    // ============ PADRÃO SECURITY HEADERS ============
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=()');
    
    // HSTS for HTTPS sites
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
    
    // ============ CSP LEVEL 3 (v12.3.0 - COMPLETE!) ============
    // Generate nonce for this request
    $nonce = djzeneyer_get_csp_nonce();
    $rest_url = esc_url_raw(rest_url());
    
    // CSP Header with ALL fixes:
    // ✅ script-src (FIX #2: was missing)
    // ✅ object-src 'none' (FIX #1: blocks plugins)
    // ✅ require-trusted-types-for (FIX #3: CSP Level 3)
    $csp = array(
        "default-src 'self'",
        "script-src 'nonce-{$nonce}' 'strict-dynamic' https:",
        "style-src 'self' 'nonce-{$nonce}' 'unsafe-inline' https://fonts.googleapis.com",
        "img-src 'self' data: https: blob:",
        "font-src 'self' https://fonts.gstatic.com data:",
        "connect-src 'self' https://www.google-analytics.com https://analytics.google.com {$rest_url}",
        "media-src 'self' https://p.scdn.co https://open.spotify.com https://www.youtube.com https://soundcloud.com https://mixcloud.com blob:",
        "frame-src 'self' https://open.spotify.com https://www.youtube.com https://soundcloud.com https://mixcloud.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
        "block-all-mixed-content",
        "require-trusted-types-for 'script'",
        "trusted-types default 'allow-duplicates'",
    );
    
    header('Content-Security-Policy: ' . implode('; ', $csp));
}, 1); // Priority 1 = very early

/* =====================================================
 * 🌐 CORS FOR REST API (v12.3.0 - Secure validation)
 * ===================================================== */
add_action('rest_api_init', function () {
    // Filter to handle CORS preflight requests
    add_filter('rest_pre_serve_request', function ($served) {
        if (is_admin()) {
            return $served;
        }

        // Get and validate origin
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? sanitize_url($_SERVER['HTTP_ORIGIN']) : '';
        $allowed = array_map('esc_url_raw', djz_allowed_origins());

        // STRICT validation: use in_array with strict type checking
        if (!empty($origin) && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_attr($origin));
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
            header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Requested-With');
            header('Vary: Origin');
        }

        // Handle preflight requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }

        return $served;
    }, 15);
});

/* =====================================================
 * 📦 ASSET ENQUEUE (REACT + VITE + CSP v12.3.0)
 * ===================================================== */
add_action('wp_enqueue_scripts', function () {
    // Main stylesheet
    wp_enqueue_style(
        'djzeneyer-style',
        get_stylesheet_uri(),
        [],
        DJZ_VERSION
    );
    
    // Load Vite manifest with error handling
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    $theme_uri = get_template_directory_uri();

    if (!file_exists($manifest_path)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[DJZeneyer] Vite manifest not found: ' . $manifest_path);
        }
        return;
    }

    // Parse manifest with try-catch for JSON errors (v12.3.0 robust)
    try {
        $manifest_json = file_get_contents($manifest_path);
        $manifest = json_decode($manifest_json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('JSON decode error: ' . json_last_error_msg());
        }
    } catch (Exception $e) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log('[DJZeneyer] Manifest parse error: ' . $e->getMessage());
        }
        return;
    }

    // Enqueue React assets from Vite
    if (isset($manifest['src/main.tsx']) && is_array($manifest['src/main.tsx'])) {
        $entry = $manifest['src/main.tsx'];

        // Enqueue CSS files
        if (!empty($entry['css']) && is_array($entry['css'])) {
            foreach ($entry['css'] as $css_file) {
                wp_enqueue_style(
                    'djzeneyer-react-css-' . sanitize_key($css_file),
                    $theme_uri . '/dist/' . esc_attr($css_file),
                    [],
                    DJZ_VERSION
                );
            }
        }

        // Enqueue JS files (React)
        if (!empty($entry['file'])) {
            wp_register_script(
                'djzeneyer-react',
                $theme_uri . '/dist/' . esc_attr($entry['file']),
                [],
                DJZ_VERSION,
                true // In footer
            );
            wp_enqueue_script('djzeneyer-react');

            // Localize script with public configuration
            wp_localize_script('djzeneyer-react', 'djzConfig', [
                'siteUrl'     => esc_url(home_url('/')),
                'restUrl'     => esc_url_raw(rest_url()),
                'nonce'       => wp_create_nonce('wp_rest'),
                'siteName'    => esc_attr(djz_config('site.name')),
                'siteTagline' => esc_attr(djz_config('site.tagline')),
                'social'      => djz_config('social'),
                'colors'      => djz_config('colors'),
                'language'    => esc_attr(djz_config('site.language')),
            ]);
        }
    }
});

// Convert React to module type for ES6 modules
add_filter('script_loader_tag', function ($tag, $handle) {
    if ('djzeneyer-react' === $handle) {
        $tag = str_replace('<script ', '<script type="module" ', $tag);
        
        // Add CSP nonce v12.3.0
        if (strpos($tag, 'nonce=') === false) {
            $nonce = djzeneyer_get_csp_nonce();
            $tag = str_replace('<script type="module" ', '<script type="module" nonce="' . esc_attr($nonce) . '" ', $tag);
        }
    }
    return $tag;
}, 10, 2);

/* =====================================================
 * 🎨 THEME COLORS CSS VARIABLES (v12.3.0 - CSP nonce)
 * ===================================================== */
add_action('wp_head', function () {
    // Get nonce for CSP compliance
    $nonce = djzeneyer_get_csp_nonce();
    
    $css = djz_theme_colors_css();
    printf('<style id="djz-theme-colors" nonce="%s">%s</style>' . "\n", 
        esc_attr($nonce), 
        $css // Already escaped in djz-helpers.php
    );
}, 1);

/* =====================================================
 * 📊 CUSTOM REST API ENDPOINTS (v12.3.0 - Secure)
 * ===================================================== */
add_action('rest_api_init', function () {
    
    /* ==========================================
       PUBLIC ENDPOINT: /djz/v1/config
       Returns only PUBLIC-SAFE data
       ========================================== */
    register_rest_route('djz/v1', '/config', [
        'methods'  => WP_REST_Server::READABLE,
        'callback' => function (WP_REST_Request $request) {
            // SANITIZE: Return only public-safe data
            $config = [
                'site' => [
                    'name'        => sanitize_text_field(djz_config('site.name')),
                    'tagline'     => sanitize_text_field(djz_config('site.tagline')),
                    'description' => sanitize_textarea_field(djz_config('site.description')),
                    'language'    => sanitize_text_field(djz_config('site.language')),
                ],
                'social'  => djz_social_urls(), // Already validated in helpers
                'colors'  => djz_config('colors'),
            ];
            return rest_ensure_response($config);
        },
        'permission_callback' => '__return_true',
    ]);
    
    /* ==========================================
       PUBLIC ENDPOINT: /djz/v1/social
       Returns social media URLs only
       ========================================== */
    register_rest_route('djz/v1', '/social', [
        'methods'  => WP_REST_Server::READABLE,
        'callback' => function (WP_REST_Request $request) {
            return rest_ensure_response(djz_social_urls());
        },
        'permission_callback' => '__return_true',
    ]);
    
    /* ==========================================
       ADMIN-ONLY ENDPOINT: /djz/v1/admin/config
       Full configuration for logged-in admins
       (v12.3.0 - Permission check required)
       ========================================== */
    register_rest_route('djz/v1', '/admin/config', [
        'methods'  => WP_REST_Server::READABLE,
        'callback' => function (WP_REST_Request $request) {
            // Security check: ensure user is admin
            if (!current_user_can('manage_options')) {
                return new WP_Error(
                    'rest_forbidden',
                    esc_html__('Você não tem permissão para acessar este endpoint.', 'djzeneyer'),
                    ['status' => 403]
                );
            }

            // Return full configuration (sanitized)
            $config = [
                'site'      => djz_config('site'),
                'social'    => djz_config('social'),
                'colors'    => djz_config('colors'),
                'features'  => djz_config('features'),
                'contact'   => djz_config('contact'),
                'schema'    => djz_config('schema'),
            ];
            
            // Sanitize before returning
            array_walk_recursive($config, function (&$value) {
                if (is_string($value)) {
                    $value = sanitize_text_field($value);
                }
            });

            return rest_ensure_response($config);
        },
        'permission_callback' => function (WP_REST_Request $request) {
            return current_user_can('manage_options');
        },
    ]);
});

/* =====================================================
 * 🎵 CUSTOM POST TYPES (Events, Tracks, etc.)
 * ===================================================== */
add_action('init', function () {
    
    // Post Type: Events (djz_event)
    register_post_type('djz_event', [
        'labels' => [
            'name'          => _x('Eventos', 'Post Type General Name', 'djzeneyer'),
            'singular_name' => _x('Evento', 'Post Type Singular Name', 'djzeneyer'),
        ],
        'description'  => __('DJ Zen Eyer Events', 'djzeneyer'),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'rest_base'    => 'events',
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'    => 'dashicons-calendar-alt',
        'show_in_menu' => true,
        'taxonomies'   => ['category', 'post_tag'],
    ]);
    
    // Post Type: Tracks/Music (djz_track)
    register_post_type('djz_track', [
        'labels' => [
            'name'          => _x('Músicas', 'Post Type General Name', 'djzeneyer'),
            'singular_name' => _x('Música', 'Post Type Singular Name', 'djzeneyer'),
        ],
        'description'  => __('DJ Zen Eyer Music Tracks', 'djzeneyer'),
        'public'       => true,
        'has_archive'  => true,
        'show_in_rest' => true,
        'rest_base'    => 'tracks',
        'supports'     => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'    => 'dashicons-format-audio',
        'show_in_menu' => true,
        'taxonomies'   => ['category', 'post_tag'],
    ]);
});

/* =====================================================
 * 🧹 CLEANUP & OPTIMIZATION
 * ===================================================== */

// Remove WordPress version meta tag (security best practice)
remove_action('wp_head', 'wp_generator');

// Remove emoji scripts (performance: save ~30KB)
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Remove WP REST API from header
remove_action('wp_head', 'rest_output_link_wp_head', 10);

// Remove RSD link (Really Simple Discovery)
remove_action('wp_head', 'rsd_link');

// Remove WLW manifest link
remove_action('wp_head', 'wlwmanifest_link');

// Remove shortlink
remove_action('wp_head', 'wp_shortlink_wp_head', 10);

/* =====================================================
 * 🎯 CUSTOM HELPER FUNCTIONS
 * ===================================================== */

/**
 * Generate breadcrumbs with Schema.org markup
 */
function djz_breadcrumbs() {
    if (!djz_feature_enabled('breadcrumbs') || is_front_page()) {
        return;
    }

    $breadcrumbs = [];
    
    // Home link (always first)
    $breadcrumbs[] = [
        'name' => __('Home', 'djzeneyer'),
        'url'  => home_url(),
    ];

    if (is_single()) {
        // Single post
        $categories = get_the_category();
        if (!empty($categories)) {
            $breadcrumbs[] = [
                'name' => $categories[0]->name,
                'url'  => get_category_link($categories[0]->term_id),
            ];
        }
        $breadcrumbs[] = [
            'name' => get_the_title(),
            'url'  => null, // Current page (no link)
        ];
    } elseif (is_page()) {
        // Single page
        if ($post_parent = wp_get_post_parent_id(get_the_ID())) {
            $breadcrumbs[] = [
                'name' => get_the_title($post_parent),
                'url'  => get_permalink($post_parent),
            ];
        }
        $breadcrumbs[] = [
            'name' => get_the_title(),
            'url'  => null,
        ];
    } elseif (is_category()) {
        // Category archive
        $breadcrumbs[] = [
            'name' => single_cat_title('', false),
            'url'  => null,
        ];
    } elseif (is_search()) {
        // Search results
        $breadcrumbs[] = [
            'name' => sprintf(__('Resultados para: %s', 'djzeneyer'), get_search_query()),
            'url'  => null,
        ];
    }

    if (count($breadcrumbs) <= 1) {
        return;
    }

    echo '<nav class="breadcrumbs" aria-label="' . esc_attr__('Breadcrumb', 'djzeneyer') . '" itemscope itemtype="https://schema.org/BreadcrumbList">' . "\n";
    
    foreach ($breadcrumbs as $index => $crumb) {
        $position = $index + 1;
        echo '<span itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">' . "\n";
        
        if ($crumb['url']) {
            echo '<a itemprop="item" href="' . esc_url($crumb['url']) . '">';
        }
        
        echo '<span itemprop="name">' . esc_html($crumb['name']) . '</span>';
        
        if ($crumb['url']) {
            echo '</a>';
        }
        
        echo '<meta itemprop="position" content="' . esc_attr($position) . '">' . "\n";
        echo '</span>' . "\n";
        
        // Add separator between items
        if ($position < count($breadcrumbs)) {
            echo '<span class="separator">/</span>' . "\n";
        }
    }
    
    echo '</nav>' . "\n";
}

/**
 * Calculate and display reading time
 */
function djz_reading_time($post_id = null) {
    if (!djz_feature_enabled('reading_time')) {
        return '';
    }

    $post_id = $post_id ?: get_the_ID();
    if (!$post_id) {
        return '';
    }

    $content = get_post_field('post_content', $post_id);
    if (!$content) {
        return '';
    }

    $word_count = str_word_count(strip_tags($content));
    $reading_time = max(1, ceil($word_count / 200)); // 200 words per minute
    
    // i18n: use ngettext for pluralization
    return sprintf(
        ngettext(
            '%d minuto de leitura',
            '%d minutos de leitura',
            $reading_time,
            'djzeneyer'
        ),
        $reading_time
    );
}

/**
 * Display featured image with lazy loading
 */
function djz_featured_image($post_id = null, $size = 'large') {
    if (!has_post_thumbnail($post_id)) {
        return '';
    }

    return wp_get_attachment_image(
        get_post_thumbnail_id($post_id),
        $size,
        false,
        [
            'class' => 'featured-image',
            'loading' => 'lazy',
            'decoding' => 'async',
        ]
    );
}

/**
 * Get schema type based on post type
 */
function djz_get_schema_type($post_type = null) {
    $post_type = $post_type ?: get_post_type();
    
    $schema_types = [
        'post'       => 'BlogPosting',
        'page'       => 'WebPage',
        'djz_event'  => 'Event',
        'djz_track'  => 'MusicRecording',
        'product'    => 'Product',
    ];
    
    return $schema_types[$post_type] ?? 'WebPage';
}
