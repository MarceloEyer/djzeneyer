<?php
/**
 * DJ Zen Eyer Theme Functions
 * v5.0.0 - Hardened and Optimized Version
 */

if (!defined('ABSPATH')) exit;

// 1. ENQUEUE SCRIPTS AND STYLES
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri());
    wp_enqueue_script('djzeneyer-react', get_template_directory_uri() . '/dist/assets/index.js', array(), '5.0.0', true);
    wp_enqueue_style('djzeneyer-react-styles', get_template_directory_uri() . '/dist/assets/index.css', array(), '5.0.0');
    
    wp_localize_script('djzeneyer-react', 'wpData', [
        'siteUrl' => get_site_url(),
        'restUrl' => get_rest_url(),
        'nonce'   => wp_create_nonce('wp_rest')
    ]);
});

add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        return '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '-js" crossorigin="use-credentials"></script>';
    }
    return $tag;
}, 10, 3);

// 2. THEME SUPPORT
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});

// 3. SECURITY HEADERS
add_action('send_headers', function() {
    if (!is_admin() && !headers_sent()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        if (is_ssl()) {
            header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
        }
    }
});

// 4. CORS CONFIGURATION (Hardened)
add_action('init', function () {
    if (is_admin() || headers_sent()) return;

    $allowed_origins = [ get_site_url() ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed_origins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Credentials: true");
    }

    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce");

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit(0);
    }
});

add_filter('apache_request_headers', function ($headers) {
    if (!isset($headers['Authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    return $headers;
});

// 5. JWT & USER ROLES FIX
add_filter('simple_jwt_login_payload_data', function ($payload_data, $user) {
    if (isset($user->roles) && is_array($user->roles)) {
        $payload_data['user']['roles'] = $user->roles;
    }
    return $payload_data;
}, 10, 2);

// 6. RATE LIMITING
add_filter('rest_pre_dispatch', function($response, $server, $request) {
    if (strpos($request->get_route(), '/djzeneyer/v1/') === 0) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $limit = 100; // 100 requests
        $window = 300; // in 5 minutes
        $key = 'api_limit_' . md5($ip);
        $count = get_transient($key);

        if ($count === false) {
            set_transient($key, 1, $window);
        } elseif ($count >= $limit) {
            return new WP_Error('rate_limit_exceeded', 'Too many requests.', ['status' => 429]);
        } else {
            set_transient($key, $count + 1, $window);
        }
    }
    return $response;
}, 10, 3);

// 7. CUSTOM REST API ENDPOINTS
add_action('rest_api_init', function () {
    $namespace = 'djzeneyer/v1';

    $permission_nonce_callback = function($request) {
        $nonce = $request->get_header('X-WP-Nonce');
        if (!$nonce || !wp_verify_nonce($nonce, 'wp_rest')) {
            return new WP_Error('invalid_nonce', 'Token de segurança inválido.', ['status' => 403]);
        }
        return true;
    };
    
    register_rest_route($namespace, '/menu', ['methods' => 'GET', 'callback' => 'djzeneyer_get_menu_items_callback', 'permission_callback' => '__return_true']);
    register_rest_route($namespace, '/checkout', ['methods'  => 'POST', 'callback' => 'djzeneyer_process_checkout_callback', 'permission_callback' => $permission_nonce_callback]);
    register_rest_route($namespace, '/user/update-profile', ['methods'  => 'POST', 'callback' => 'djzeneyer_update_profile_callback', 'permission_callback' => 'is_user_logged_in']);
    register_rest_route($namespace, '/user/change-password', ['methods'  => 'POST', 'callback' => 'djzeneyer_change_password_callback', 'permission_callback' => 'is_user_logged_in']);
});

// --- Callback Functions for REST API ---

function djzeneyer_get_menu_items_callback(WP_REST_Request $request) {
    $lang = sanitize_text_field($request->get_param('lang') ?: 'en');
    $cache_key = 'djzeneyer_menu_items_' . $lang;
    $menu_items = get_transient($cache_key);

    if (false === $menu_items) {
        $menu_name = ($lang === 'pt') ? 'Menu Principal PT' : 'Menu Principal EN';
        $menu_items = wp_get_nav_menu_items($menu_name);

        if (empty($menu_items)) {
            $locations = get_nav_menu_locations();
            if (isset($locations['primary_menu'])) {
                 $menu_items = wp_get_nav_menu_items($locations['primary_menu']);
            }
        }
        set_transient($cache_key, $menu_items, HOUR_IN_SECONDS);
    }

    if (empty($menu_items)) return new WP_Error('no_menu_found', 'Nenhum item de menu encontrado.', ['status' => 404]);
    return rest_ensure_response($menu_items);
}

function djzeneyer_process_checkout_callback(WP_REST_Request $request) {
    if (class_exists('WooCommerce') && !is_admin() && is_null(WC()->session)) { WC()->session = new WC_Session_Handler(); WC()->session->init(); }
    if (class_exists('WooCommerce') && !is_admin() && is_null(WC()->cart)) { wc_load_cart(); }
    if (!class_exists('WooCommerce') || null === WC()->cart || WC()->cart->is_empty()) { return new WP_Error('wc_cart_not_ready', 'O carrinho está vazio ou indisponível.', ['status' => 400]); }
    
    $params = $request->get_json_params();
    $required_fields = ['first_name', 'last_name', 'email'];
    foreach ($required_fields as $field) {
        if (empty($params[$field])) { return new WP_Error('missing_field', "O campo {$field} é obrigatório.", ['status' => 400]); }
    }
    if (!is_email($params['email'])) { return new WP_Error('invalid_email', 'O endereço de email fornecido é inválido.', ['status' => 400]); }

    $order = wc_create_order(['customer_id' => get_current_user_id()]);
    try {
        $order->set_billing_first_name(sanitize_text_field($params['first_name']));
        $order->set_billing_last_name(sanitize_text_field($params['last_name']));
        $order->set_billing_email(sanitize_email($params['email']));
        foreach (WC()->cart->get_cart() as $cart_item) {
            $order->add_product($cart_item['data'], $cart_item['quantity']);
        }
        $order->calculate_totals();
        $order_id = $order->save();
        WC()->cart->empty_cart();
        return rest_ensure_response(['success' => true, 'order_id' => $order->get_id()]);
    } catch (Exception $e) {
        error_log('DJ Zen Eyer Checkout Error: ' . $e->getMessage());
        return new WP_Error('order_creation_failed', 'Ocorreu um erro ao processar seu pedido.', ['status' => 500]);
    }
}

function djzeneyer_update_profile_callback(WP_REST_Request $request) {
    $user_id = get_current_user_id();
    if (0 === $user_id) return new WP_Error('not_logged_in', 'Usuário não autenticado.', ['status' => 401]);
    $params = $request->get_json_params();
    $user_data = ['ID' => $user_id];
    if (isset($params['displayName'])) { $user_data['display_name'] = sanitize_text_field($params['displayName']); }
    $result = wp_update_user($user_data);
    if (is_wp_error($result)) { return new WP_Error('profile_update_failed', 'Não foi possível atualizar o perfil.', ['status' => 400]); }
    if (isset($params['phone'])) { update_user_meta($user_id, 'billing_phone', sanitize_text_field($params['phone'])); }
    return rest_ensure_response(['success' => true, 'message' => 'Perfil atualizado com sucesso!']);
}

function djzeneyer_change_password_callback(WP_REST_Request $request) {
    $user = wp_get_current_user();
    if (0 === $user->ID) return new WP_Error('not_logged_in', 'Usuário não autenticado.', ['status' => 401]);
    $params = $request->get_json_params();
    if (empty($params['currentPassword']) || empty($params['newPassword'])) { return new WP_Error('missing_params', 'Senha atual e nova senha são obrigatórias.', ['status' => 400]); }
    if (!wp_check_password($params['currentPassword'], $user->user_pass, $user->ID)) { return new WP_Error('wrong_password', 'A senha atual está incorreta.', ['status' => 403]); }
    wp_set_password($params['newPassword'], $user->ID);
    return rest_ensure_response(['success' => true, 'message' => 'Senha alterada com sucesso!']);
}

// 8. DJ USER ROLE
add_action('after_switch_theme', function () {
    add_role('dj', 'DJ', ['read' => true]);
});