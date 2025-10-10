<?php
/**
 * DJ Zen Eyer Theme Functions
 * v6.0.4 - Syntax Error Fix on line 163
 */
if (!defined('ABSPATH')) exit;

// Enqueue scripts & styles
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri());
    wp_enqueue_script('djzeneyer-react', get_template_directory_uri() . '/dist/assets/index.js', [], '6.0.4', true);
    wp_enqueue_style('djzeneyer-react-styles', get_template_directory_uri() . '/dist/assets/index.css', [], '6.0.4');
    wp_localize_script('djzeneyer-react', 'wpData', [
        'siteUrl' => get_site_url(),
        'restUrl' => get_rest_url(),
        'nonce'   => wp_create_nonce('wp_rest')
    ]);
});

// Corrigir tag type=module
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        return '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '-js" crossorigin="use-credentials"></script>';
    }
    return $tag;
}, 10, 3);

// Theme support & menu
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});
add_action('after_switch_theme', function () {
    add_role('dj', 'DJ', ['read' => true]);
});

// Security headers
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

// CORS REST API
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($served) {
        $allowed_origins = ['https://djzeneyer.com', 'https://app.djzeneyer.com'];
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if (in_array($origin, $allowed_origins)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            header('Access-Control-Allow-Origin: https://djzeneyer.com');
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        return $served;
    });
});
add_filter('apache_request_headers', function ($headers) {
    if (!isset($headers['Authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers['Authorization'] = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    return $headers;
});

// Rate limiting REST API
add_filter('rest_pre_dispatch', function($response, $server, $request) {
    if (strpos($request->get_route(), '/djzeneyer/v1/') === 0) {
        $ip = $_SERVER['REMOTE_ADDR'];
        $limit = 100; // requests
        $window = 300; // seconds
        $key = 'api_limit_' . md5($ip);
        $count = get_transient($key);
        if ($count === false) { set_transient($key, 1, $window); }
        elseif ($count >= $limit) { return new WP_Error('rate_limit_exceeded', 'Too many requests.', ['status' => 429]); }
        else { set_transient($key, $count + 1, $window); }
    }
    return $response;
}, 10, 3);

// JWT + GamiPress extra payload (Hook corrigido para plugin de Nicu Micle)
add_filter('simple_jwt_login_jwt_payload_auth', function($payload, $request) {
    if (isset($request['email'])) {
        $user = get_user_by('email', sanitize_email($request['email']));
        if ($user) {
            $payload['display_name'] = $user->display_name;
            $payload['roles'] = $user->roles;
            if (function_exists('gamipress_get_user_points')) {
                $payload['gamipress_points'] = gamipress_get_user_points($user->ID, 'zen-points');
                $payload['gamipress_rank'] = gamipress_get_user_rank($user->ID, 'zen-level');
            }
        }
    }
    return $payload;
}, 10, 2);

// Endpoints: menu, newsletter, perfil, senha, checkout
add_action('rest_api_init', function () {
    $namespace = 'djzeneyer/v1';

    register_rest_route($namespace, '/menu', [
        'methods' => 'GET',
        'callback' => function($request) {
            $lang = sanitize_text_field($request->get_param('lang') ?: 'en');
            if (function_exists('pll_set_language')) pll_set_language($lang);
            $menu_name = ($lang === 'pt') ? 'Menu Principal PT' : 'Menu Principal EN';
            $menu_items = wp_get_nav_menu_items($menu_name);
            if (empty($menu_items)) {
                $locations = get_nav_menu_locations();
                if (isset($locations['primary_menu'])) {
                    $menu_items = wp_get_nav_menu_items($locations['primary_menu']);
                }
            }
            $formatted_items = [];
            foreach ((array)$menu_items as $item) {
                if ($item->menu_item_parent == 0) {
                    $formatted_items[] = [
                        'ID' => $item->ID,
                        'title' => $item->title,
                        'url' => $item->url,
                        'target' => $item->target ?: '_self'
                    ];
                }
            }
            return $formatted_items;
        },
        'permission_callback' => '__return_true'
    ]);

    register_rest_route($namespace, '/subscribe', [
        'methods' => 'POST',
        'callback' => function($request) {
            $email = sanitize_email($request->get_param('email'));
            if (!is_email($email)) return new WP_Error('invalid_email', 'Invalid email address.', ['status' => 400]);
            if (class_exists(\MailPoet\API\API::class)) {
                try {
                    $mailpoet_api = \MailPoet\API\API::MP('v1');
                    $mailpoet_api->addSubscriber(['email' => $email, 'lists' => [1]]);
                    return ['success' => true, 'message' => 'Successfully subscribed! Check your inbox.'];
                } catch (\Exception $e) {
                    return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
                }
            }
            return new WP_Error('mailpoet_not_found', 'MailPoet plugin not active.', ['status' => 500]);
        },
        'permission_callback' => '__return_true'
    ]);

    // User profile
    register_rest_route($namespace, '/user/update-profile', [
        'methods' => 'POST',
        'callback' => function($request) {
            $user_id = get_current_user_id(); // <-- LINHA 163 CORRIGIDA
            if (0 === $user_id) return new WP_Error('not_logged_in', 'Usuário não autenticado.', ['status' => 401]);
            $params = $request->get_json_params();
            $user_data = ['ID' => $user_id];
            if (isset($params['displayName'])) $user_data['display_name'] = sanitize_text_field($params['displayName']);
            $result = wp_update_user($user_data);
            if (is_wp_error($result)) return new WP_Error('profile_update_failed', 'Não foi possível atualizar o perfil.', ['status' => 400]);
            if (isset($params['phone'])) update_user_meta($user_id, 'billing_phone', sanitize_text_field($params['phone']));
            return ['success' => true, 'message' => 'Perfil atualizado com sucesso!'];
        },
        'permission_callback' => 'is_user_logged_in'
    ]);

    // Change password
    register_rest_route($namespace, '/user/change-password', [
        'methods' => 'POST',
        'callback' => function($request) {
            $user = wp_get_current_user();
            if (0 === $user->ID) return new WP_Error('not_logged_in', 'Usuário não autenticado.', ['status' => 401]);
            $params = $request->get_json_params();
            if (empty($params['currentPassword']) || empty($params['newPassword']))
                return new WP_Error('missing_params', 'Senha atual e nova senha são obrigatórias.', ['status' => 400]);
            if (!wp_check_password($params['currentPassword'], $user->user_pass, $user->ID))
                return new WP_Error('wrong_password', 'A senha atual está incorreta.', ['status' => 403]);
            wp_set_password($params['newPassword'], $user->ID);
            return ['success' => true, 'message' => 'Senha alterada com sucesso!'];
        },
        'permission_callback' => 'is_user_logged_in'
    ]);

    // Checkout
    register_rest_route($namespace, '/checkout', [
        'methods' => 'POST',
        'callback' => function($request) {
            if (class_exists('WooCommerce') && !is_admin() && is_null(WC()->session)) {
                WC()->session = new WC_Session_Handler(); WC()->session->init();
            }
            if (class_exists('WooCommerce') && !is_admin() && is_null(WC()->cart)) { wc_load_cart(); }
            if (!class_exists('WooCommerce') || null === WC()->cart || WC()->cart->is_empty())
                return new WP_Error('wc_cart_not_ready', 'O carrinho está vazio ou indisponível.', ['status' => 400]);
            $params = $request->get_json_params();
            $required_fields = ['first_name', 'last_name', 'email'];
            foreach ($required_fields as $field) {
                if (empty($params[$field])) return new WP_Error('missing_field', "O campo {$field} é obrigatório.", ['status' => 400]);
            }
            if (!is_email($params['email'])) return new WP_Error('invalid_email', 'O endereço de email fornecido é inválido.', ['status' => 400]);
            $order = wc_create_order(['customer_id' => get_current_user_id()]);
            try {
                $order->set_billing_first_name(sanitize_text_field($params['first_name']));
                $order->set_billing_last_name(sanitize_text_field($params['last_name']));
                $order->set_billing_email(sanitize_email($params['email']));
                foreach (WC()->cart->get_cart() as $cart_item) {
                    $order->add_product($cart_item['data'], $cart_item['quantity']);
                }
                $order->calculate_totals();
                $order->save(); WC()->cart->empty_cart();
                return ['success' => true, 'order_id' => $order->get_id()];
            } catch (Exception $e) {
                error_log('DJ Zen Eyer Checkout Error: ' . $e->getMessage());
                return new WP_Error('order_creation_failed', 'Ocorreu um erro ao processar seu pedido.', ['status' => 500]);
            }
        },
        'permission_callback' => function($request) {
            $nonce = $request->get_header('X-WP-Nonce');
            if (!$nonce || !wp_verify_nonce($nonce, 'wp_rest')) {
                return new WP_Error('invalid_nonce', 'Token de segurança inválido.', ['status' => 403]);
            }
            return true;
        }
    ]);
});

// GamiPress REST Field
add_action('rest_api_init', function(){
    register_rest_field('user', 'gamipress_data', [
        'get_callback' => function($user) {
            if (!function_exists('gamipress_get_user_points')) return null;
            $user_id = $user['id'];
            return [
                'points' => gamipress_get_user_points($user_id, 'zen-points'),
                'rank' => gamipress_get_user_rank($user_id, 'zen-level'),
                'achievements' => gamipress_get_user_achievements($user_id),
            ];
        },
        'schema' => null,
    ]);
});

/**
 * Força o carregamento da página do App React para todas as rotas de idioma.
 * Esta é uma abordagem mais direta que a rewrite_rule para evitar conflitos.
 */
add_action('parse_request', function() {
    // Pega a URL que o visitante está tentando acessar, sem a query string
    $request_path = strtok($_SERVER['REQUEST_URI'], '?');

    // Verifica se a URL começa com /en ou /pt (com ou sem barra no final)
    if (preg_match('#^/(en|pt)(/.*|/?)?$#', $request_path)) {
        
        // ID da sua página principal do React
        $react_app_page_id = 157;

        // Força o WordPress a entender que ele deve carregar esta página
        // Em vez de procurar pela URL, ele agora vai procurar pelo ID
        global $wp;
        $wp->query_vars = ['page_id' => $react_app_page_id];
    }
});
?>