<?php
/**
 * DJ Zen Eyer Theme Functions - SEO ULTIMATE VERSION (CORRIGIDA)
 * v12.0.1 - Otimizado para IA Bots + Google + Performance + Correções de URL
 */

if (!defined('ABSPATH')) exit;

/* =========================
 * VERSÃO & CACHE
 * ========================= */
if (!defined('DJZ_VERSION')) {
    $asset_file = get_theme_file_path('/dist/assets/index.js');
    $version = file_exists($asset_file) ? filemtime($asset_file) : '12.0.1';
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
 * ROTEAMENTO SPA
 * ========================= */
add_filter('template_include', function ($template) {
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || !is_main_query() || !is_404()) {
        return $template;
    }
    status_header(200);
    return get_theme_file_path('/index.php');
});

/* =========================
 * ENQUEUE SCRIPTS - OTIMIZADO
 * ========================= */
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri(), [], DJZ_VERSION);

    $js_src = get_template_directory_uri() . '/dist/assets/index.js';
    $css_src = get_template_directory_uri() . '/dist/assets/index.css';

    if (file_exists(get_theme_file_path('/dist/assets/index.css'))) {
        wp_enqueue_style('djzeneyer-react-styles', $css_src, [], DJZ_VERSION);
    }

    if (file_exists(get_theme_file_path('/dist/assets/index.js'))) {
        wp_register_script('djzeneyer-react', $js_src, [], DJZ_VERSION, true);
        wp_enqueue_script('djzeneyer-react');
        wp_localize_script('djzeneyer-react', 'wpData', [
            'siteUrl' => esc_url(home_url('/')),
            'restUrl' => esc_url_raw(rest_url()),
            'nonce' => wp_create_nonce('wp_rest'),
            'themeUrl' => get_template_directory_uri(),
            'allowedOrigins' => djz_allowed_origins(),
            'isUserLoggedIn' => is_user_logged_in(),
            'currentUser' => is_user_logged_in() ? [
                'id' => get_current_user_id(),
                'name' => wp_get_current_user()->display_name,
                'email' => wp_get_current_user()->user_email,
            ] : null,
        ]);
    }
});
/* =========================
 * REST API ENDPOINTS
 * ========================= */
add_action('rest_api_init', function () {
    $namespace = 'djzeneyer/v1';

    register_rest_route($namespace, '/menu/(?P<lang>[a-z]{2})', [
        'methods' => 'GET',
        'callback' => 'djz_get_multilang_menu_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'lang' => [
                'required' => false,
                'default' => 'en',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);

    register_rest_route($namespace, '/mailpoet/subscribe', [
        'methods' => 'POST',
        'callback' => 'djz_mailpoet_subscribe_handler',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($namespace, '/gamipress/user/(?P<user_id>\\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_gamipress_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'user_id' => [
                'required' => true,
                'type' => 'integer',
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                },
            ],
        ],
    ]);

    register_rest_route($namespace, '/products', [
        'methods' => 'GET',
        'callback' => 'djz_get_products_with_lang_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'lang' => [
                'required' => false,
                'default' => '',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);

    register_rest_route($namespace, '/user/update-profile', [
        'methods' => 'POST',
        'callback' => function($request) {
            $user_id = get_current_user_id();
            if (0 === $user_id) {
                return new WP_Error('not_logged_in', 'User not authenticated', ['status' => 401]);
            }
            $params = $request->get_json_params();
            $user_data = ['ID' => $user_id];
            if (isset($params['displayName'])) {
                $user_data['display_name'] = sanitize_text_field($params['displayName']);
            }
            $result = wp_update_user($user_data);
            if (is_wp_error($result)) {
                return new WP_Error('profile_update_failed', 'Could not update profile', ['status' => 400]);
            }
            return rest_ensure_response(['success' => true, 'message' => 'Profile updated!']);
        },
        'permission_callback' => 'is_user_logged_in'
    ]);

    register_rest_route('simple-jwt-login/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'djz_google_oauth_handler',
        'permission_callback' => '__return_true'
    ]);
});

/* =========================
 * SEO Fixes
 * ========================= */
add_action('template_redirect', function() {
    if (is_404()) {
        status_header(404);
        nocache_headers();
    }
}, 999);

add_filter('wp_sitemaps_enabled', '__return_false');

/* =========================
 * NOVAS FUNÇÕES DE ASSETS
 * ========================= */
function djz_get_asset_version() {
    static $version = null;

    if ($version !== null) {
        return $version;
    }

    $manifest_path = get_theme_file_path('/dist/mix-manifest.json');
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        $version = isset($manifest['/dist/assets/index.js']) ? $manifest['/dist/assets/index.js']['file'] : DJZ_VERSION;
    } else {
        $version = DJZ_VERSION;
    }

    return $version;
}

function djz_get_manifest() {
    static $manifest = null;

    if ($manifest !== null) {
        return $manifest;
    }

    $manifest_path = get_theme_file_path('/dist/mix-manifest.json');
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
    } else {
        $manifest = [];
    }

    return $manifest;
}
?>
