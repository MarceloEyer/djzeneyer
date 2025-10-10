<?php
/**
 * DJ Zen Eyer Theme Functions - Definitive SPA + WooCommerce + REST helpers
 * Version: 6.0.11-stable
 *
 * Instalação: cole no final do arquivo /wp-content/themes/seu-tema/functions.php
 *
 * Objetivos implementados
 * - Roteamento SPA sem incluir index.php diretamente (usa template_include)
 * - CORS seguro e consistente para REST API e pré-flight OPTIONS
 * - Endpoints REST: menu multilíngue, subscribe (MailPoet), Google OAuth (gera JWT se plugin disponível)
 * - Enqueue de assets React com type=module
 * - Integrações: WooCommerce, Polylang/WPML, GamiPress, LiteSpeed purge
 * - Práticas modernas: checks, timeouts, headers_sent, roles seguros, tratamento de erros
 */

if (!defined('ABSPATH')) {
    exit;
}

/* =========================
   Configuração central
   ========================= */

if (!defined('DJZ_VERSION')) {
    define('DJZ_VERSION', '6.0.11');
}

/**
 * Lista de origens permitidas para CORS (modifique conforme necessário)
 * Inclui localhost para desenvolvimento; remova em produção se não preciso.
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
   CORS / Preflight OPTIONS
   ========================= */

/**
 * Applies CORS headers consistently for REST responses.
 */
add_filter('rest_pre_serve_request', function ($served) {
    $allowed = djz_allowed_origins();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (!headers_sent()) {
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Vary: Origin', false);
            header('Access-Control-Allow-Credentials: true');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With');
        header('Access-Control-Expose-Headers: Content-Length, Content-Range');
    }

    return $served;
}, 15);

/**
 * Handles global OPTIONS preflight early in request lifecycle.
 * Returns 200 and the same CORS headers used above.
 */
add_action('init', function () {
    if (empty($_SERVER['REQUEST_METHOD'])) {
        return;
    }

    if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'OPTIONS') {
        return;
    }

    $allowed = djz_allowed_origins();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (!headers_sent()) {
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Vary: Origin', false);
            header('Access-Control-Allow-Credentials: true');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With');
        header('Access-Control-Expose-Headers: Content-Length, Content-Range');
    }

    status_header(200);
    exit;
}, 0);

/* =========================
   SPA routing without duplicating WP flow
   ========================= */

/**
 * For SPA deep-links: when WP would render 404 for a frontend route, serve theme index.php
 * using template_include filter to preserve proper WP lifecycle.
 */
add_filter('template_include', function ($template) {
    // Only intervene on front-end, not admin, not REST, not feeds, and only for 404 state
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || is_feed() || !is_404()) {
        return $template;
    }

    $index = get_template_directory() . '/index.php';
    if (file_exists($index)) {
        // status 200 so browsers and clients treat as successful page
        status_header(200);
        return $index;
    }

    return $template;
}, 5);

/* =========================
   Enqueue scripts & styles (React build)
   ========================= */

add_action('wp_enqueue_scripts', function () {
    // Main theme stylesheet
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri(), [], DJZ_VERSION);

    // React build files (paths depend on your build output)
    $js_handle = 'djzeneyer-react';
    $js_src = get_template_directory_uri() . '/dist/assets/index.js';
    $css_src = get_template_directory_uri() . '/dist/assets/index.css';

    if (file_exists(get_theme_file_path('/dist/assets/index.css'))) {
        wp_enqueue_style('djzeneyer-react-styles', $css_src, [], DJZ_VERSION);
    }

    if (file_exists(get_theme_file_path('/dist/assets/index.js'))) {
        wp_register_script($js_handle, $js_src, [], DJZ_VERSION, true);
        wp_enqueue_script($js_handle);
        // Localize values for SPA
        wp_localize_script($js_handle, 'wpData', [
            'siteUrl' => esc_url(home_url('/')),
            'restUrl' => esc_url(rest_url()),
            'nonce'   => wp_create_nonce('wp_rest'),
            'version' => DJZ_VERSION
        ]);
    }
});

/**
 * Add type="module" and crossorigin attribute for the React script
 */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        // Use-credentials only if you need cookies/auth in module fetch; ensure CORS origins configured
        return sprintf('<script type="module" src="%s" id="%s" crossorigin="use-credentials"></script>', esc_url($src), esc_attr($handle . '-js'));
    }
    return $tag;
}, 10, 3);

/* =========================
   Theme supports & menus
   ========================= */

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});

/* =========================
   Security headers
   ========================= */

add_action('send_headers', function () {
    if (is_admin() || headers_sent()) {
        return;
    }

    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
});

/* =========================
   REST endpoints: menu, subscribe, google oauth
   ========================= */

/**
 * Helpers
 */
function djz_wp_make_link_relative_safe($url) {
    if (empty($url)) {
        return '';
    }
    return wp_make_link_relative($url);
}

/**
 * Multilang menu endpoint
 */
function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? '');

    // Polylang / WPML switching best-effort
    if (!empty($lang) && function_exists('pll_set_language')) {
        // Polylang
        pll_set_language($lang);
    } elseif (!empty($lang) && defined('ICL_LANGUAGE_CODE')) {
        do_action('wpml_switch_language', $lang);
    }

    $locations = get_nav_menu_locations();
    $menu_id = $locations['primary_menu'] ?? null;
    if (!$menu_id) {
        return rest_ensure_response([]);
    }

    $items = wp_get_nav_menu_items($menu_id);
    if (!is_array($items)) {
        return rest_ensure_response([]);
    }

    $formatted = [];
    foreach ($items as $item) {
        if (empty($item->ID)) {
            continue;
        }
        if ((int)$item->menu_item_parent === 0) {
            $formatted[] = [
                'ID' => (int)$item->ID,
                'title' => $item->title ?? '',
                'url' => djz_wp_make_link_relative_safe($item->url ?? '#'),
                'target' => !empty($item->target) ? $item->target : '_self'
            ];
        }
    }

    return rest_ensure_response($formatted);
}

/**
 * MailPoet subscribe endpoint
 */
function djz_mailpoet_subscribe_handler($request) {
    $email = sanitize_email($request->get_param('email') ?? '');
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    }

    if (!class_exists('\MailPoet\API\API')) {
        return new WP_Error('mailpoet_inactive', 'MailPoet inactive', ['status' => 500]);
    }

    try {
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $lists = $mailpoet_api->getLists();
        $list_id = !empty($lists) ? $lists[0]['id'] : 1;

        $mailpoet_api->addSubscriber(['email' => $email, 'status' => 'subscribed'], [$list_id]);

        return rest_ensure_response(['success' => true, 'message' => 'Subscribed!']);
    } catch (Exception $e) {
        $msg = $e->getMessage();
        if (stripos($msg, 'already exists') !== false) {
            return rest_ensure_response(['success' => true, 'message' => 'Already subscribed!']);
        }
        return new WP_Error('subscription_failed', $msg, ['status' => 500]);
    }
}

/**
 * Google OAuth endpoint -> verifies id_token and returns/creates user + JWT (if available)
 */
function djz_google_oauth_handler($request) {
    $token = sanitize_text_field($request->get_param('token') ?? '');
    if (empty($token)) {
        return new WP_Error('no_token', 'Token is required', ['status' => 400]);
    }

    $verify_url = add_query_arg('id_token', rawurlencode($token), 'https://oauth2.googleapis.com/tokeninfo');
    $response = wp_remote_get($verify_url, ['timeout' => 10, 'sslverify' => true]);

    if (is_wp_error($response)) {
        return new WP_Error('invalid_token', 'Failed to verify token', ['status' => 401]);
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code !== 200 || empty($body) || empty($body['email'])) {
        return new WP_Error('invalid_token', 'Invalid token', ['status' => 401]);
    }

    $email = sanitize_email($body['email']);
    $name = sanitize_text_field($body['name'] ?? '');

    $user = get_user_by('email', $email);
    if (!$user) {
        $password = wp_generate_password(24, true);
        // create as 'customer' to be safe on WooCommerce installs
        $user_id = wp_create_user($email, $password, $email);
        if (is_wp_error($user_id)) {
            return $user_id;
        }
        wp_update_user([
            'ID' => $user_id,
            'display_name' => $name ?: $email,
            'first_name' => $name ? current(explode(' ', $name)) : ''
        ]);
        // set role to customer if WooCommerce exists
        if (function_exists('wc_get_default_customer_role')) {
            $u = new WP_User($user_id);
            $u->set_role('customer');
        }
        $user = get_user_by('ID', $user_id);
    }

    // Generate JWT if Simple JWT plugin exists (attempt common namespaces)
    $jwt_payload = null;
    $jwt_string = null;

    // Common plugin class check (adjust if plugin uses different namespace)
    if (class_exists('\SimpleJwtLogin\Classes\SimpleJwtLoginJWT')) {
        try {
            $inst = new \SimpleJwtLogin\Classes\SimpleJwtLoginJWT();
            if (method_exists($inst, 'getJwt')) {
                $jwt_string = $inst->getJwt($user);
            } elseif (method_exists($inst, 'encode')) {
                $payload = [
                    'id' => $user->ID,
                    'email' => $user->user_email,
                    'display_name' => $user->display_name,
                    'roles' => array_values($user->roles)
                ];
                $jwt_string = $inst->encode($payload);
            }
        } catch (Exception $e) {
            // ignore here; will return error below if not generated
        }
    } elseif (class_exists('SimpleJwtLoginJWT')) {
        try {
            $inst = new SimpleJwtLoginJWT();
            if (method_exists($inst, 'encode')) {
                $payload = [
                    'id' => $user->ID,
                    'email' => $user->user_email,
                    'display_name' => $user->display_name,
                    'roles' => array_values($user->roles)
                ];
                $jwt_string = $inst->encode($payload);
            }
        } catch (Exception $e) {
            // pass
        }
    }

    if (empty($jwt_string)) {
        // Plugin not available or failed
        return new WP_Error('jwt_missing', 'JWT generator not available', ['status' => 500]);
    }

    return rest_ensure_response([
        'jwt' => $jwt_string,
        'user' => [
            'id' => (int)$user->ID,
            'email' => $user->user_email,
            'name' => $user->display_name
        ]
    ]);
}

/* Register REST routes */
add_action('rest_api_init', function () {
    $namespace = 'djzeneyer/v1';

    register_rest_route($namespace, '/menu', [
        'methods' => 'GET',
        'callback' => 'djz_get_multilang_menu_handler',
        'permission_callback' => '__return_true'
    ]);

    register_rest_route($namespace, '/subscribe', [
        'methods' => 'POST',
        'callback' => 'djz_mailpoet_subscribe_handler',
        'permission_callback' => '__return_true'
    ]);

    // Google OAuth registered under simple-jwt-login namespace to match client expectation
    register_rest_route('simple-jwt-login/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'djz_google_oauth_handler',
        'permission_callback' => '__return_true'
    ]);
}, 9);

/* =========================
   GamiPress: add extra user fields to REST user responses
   ========================= */

add_action('rest_api_init', function () {
    register_rest_field('user', 'gamipress_data', [
        'get_callback' => function ($user) {
            if (!function_exists('gamipress_get_user_points')) {
                return null;
            }
            $user_id = $user['id'] ?? null;
            if (empty($user_id)) {
                return null;
            }

            return [
                'points' => gamipress_get_user_points($user_id, 'zen-points'),
                'rank' => gamipress_get_user_rank($user_id, 'zen-level'),
                'achievements' => function_exists('gamipress_get_user_achievements') ? gamipress_get_user_achievements($user_id) : []
            ];
        },
        'schema' => null
    ]);
});

/* =========================
   LiteSpeed purge triggers (if available)
   ========================= */

add_action('woocommerce_new_product', function () {
    if (has_action('litespeed_purge_all')) {
        do_action('litespeed_purge_all');
    }
});
add_action('woocommerce_thankyou', function () {
    if (has_action('litespeed_purge_all')) {
        do_action('litespeed_purge_all');
    }
});
add_action('wp_login', function () {
    if (has_action('litespeed_purge_all')) {
        do_action('litespeed_purge_all');
    }
});

/* =========================
   WooCommerce URL adjustments for Polylang
   ========================= */

add_filter('woocommerce_get_checkout_url', function ($url) {
    if (function_exists('pll_current_language') && pll_current_language() === 'pt') {
        return home_url('/pt/finalizar-compra/');
    }
    return $url;
});

add_filter('woocommerce_get_cart_url', function ($url) {
    if (function_exists('pll_current_language') && pll_current_language() === 'pt') {
        return home_url('/pt/carrinho/');
    }
    return $url;
});

/* =========================
   JWT payload extra (Simple JWT integration)
   Hook into plugin filter if present to append gamipress data
   ========================= */

add_filter('simple_jwt_login_jwt_payload_auth', function ($payload, $request) {
    if (!empty($request['email'])) {
        $user = get_user_by('email', sanitize_email($request['email']));
        if ($user) {
            $payload['display_name'] = $user->display_name;
            $payload['roles'] = array_values($user->roles);
            if (function_exists('gamipress_get_user_points')) {
                $payload['gamipress_points'] = gamipress_get_user_points($user->ID, 'zen-points');
                $payload['gamipress_rank'] = gamipress_get_user_rank($user->ID, 'zen-level');
            }
        }
    }
    return $payload;
}, 10, 2);

/* =========================
   Utilities: safe role creation on theme activation
   ========================= */

add_action('after_switch_theme', function () {
    if (!get_role('dj')) {
        add_role('dj', 'DJ', ['read' => true]);
    }
});

/* =========================
   End of file
   ========================= */
