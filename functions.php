<?php
/**
 * DJ Zen Eyer Theme - functions.php (clean)
 * v10.2.1 - Corrigido: origens CORS sem espaços + segurança reforçada
 */

if (!defined('ABSPATH')) {
    exit;
}

/* =========================
 * Configuração Central
 * ========================= */

if (!defined('DJZ_VERSION')) {
    $asset_file = get_theme_file_path('/dist/assets/index.js');
    $version = file_exists($asset_file) ? filemtime($asset_file) : '10.2.1';
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
 * SPA router fallback (only for frontend 404s)
 * ========================= */

add_filter('template_include', function ($template) {
    if ( is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || ! is_main_query() || ! is_404() ) {
        return $template;
    }
    status_header(200);
    return get_theme_file_path('/index.php');
});

/* =========================
 * Enqueue de Scripts & Estilos (React/Vite bundle)
 * ========================= */

add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri(), [], DJZ_VERSION);

    $theme_uri = get_template_directory_uri();

    // CSS gerado pelo build (se existir)
    $css_path = get_theme_file_path('/dist/assets/index.css');
    if (file_exists($css_path)) {
        wp_enqueue_style(
            'djzeneyer-react-styles',
            $theme_uri . '/dist/assets/index.css',
            [],
            DJZ_VERSION
        );
    }

    // JS compilado (module)
    $js_path = get_theme_file_path('/dist/assets/index.js');
    if (file_exists($js_path)) {
        wp_register_script(
            'djzeneyer-react',
            $theme_uri . '/dist/assets/index.js',
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
});

/* Add type="module" to the specific handle so browsers treat it as an ES module */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        return sprintf(
            '<script type="module" src="%s" id="%s" defer></script>',
            esc_url($src),
            esc_attr($handle . '-js')
        );
    }
    return $tag;
}, 10, 3);

/* =========================
 * Suportes do Tema & Roles
 * ========================= */

add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});

add_action('after_switch_theme', function () {
    if (!get_role('dj')) {
        add_role('dj', 'DJ', ['read' => true]);
    }
});

/* =========================
 * Segurança & CORS (REST)
 * ========================= */

add_action('send_headers', function() {
    if ( is_admin() || headers_sent() ) return;
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
});

add_action('rest_api_init', function() {
    add_filter('rest_pre_serve_request', function($served) {
        $allowed_origins = array_map('trim', djz_allowed_origins());
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

/* =========================
 * Integrações de Plugins (JWT, GamiPress)
 * ========================= */

add_filter('simple_jwt_login_jwt_payload_auth', function($payload, $request) {
    if (!empty($request['email'])) {
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

add_action('rest_api_init', function(){
    register_rest_field('user', 'gamipress_data', [
        'get_callback' => function($user) {
            if (!function_exists('gamipress_get_user_points')) return null;
            $user_id = isset($user['id']) ? intval($user['id']) : 0;
            return [
                'points' => gamipress_get_user_points($user_id, 'zen-points'),
                'rank' => gamipress_get_user_rank($user_id, 'zen-level'),
                'achievements' => function_exists('gamipress_get_user_achievements') ? gamipress_get_user_achievements($user_id) : [],
            ];
        },
        'schema' => null,
    ]);
});

/* =======================================================
 * Handlers dos Endpoints Customizados da API REST
 * ======================================================= */

function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    if (function_exists('pll_set_language')) {
        pll_set_language($lang);
    }
    $locations = get_nav_menu_locations();
    $menu_id = $locations['primary_menu'] ?? null;
    if (!$menu_id) return rest_ensure_response([]);
    $items = wp_get_nav_menu_items($menu_id);
    if (!is_array($items)) return rest_ensure_response([]);
    $formatted = [];
    foreach ($items as $item) {
        if (empty($item->ID) || (int)$item->menu_item_parent !== 0) continue;
        $formatted[] = [ 
            'ID' => (int)$item->ID, 
            'title' => $item->title ?? '', 
            'url' => esc_url_raw($item->url ?? '#'), 
            'target' => !empty($item->target) ? $item->target : '_self' 
        ];
    }
    return rest_ensure_response($formatted);
}

function djz_mailpoet_subscribe_handler($request) {
    $email = sanitize_email($request->get_param('email') ?? '');
    if (!is_email($email)) return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    if (!class_exists('\MailPoet\API\API')) return new WP_Error('mailpoet_inactive', 'MailPoet inactive', ['status' => 500]);
    try {
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $lists = $mailpoet_api->getLists();
        $list_id = !empty($lists) ? $lists[0]['id'] : 1;
        $mailpoet_api->addSubscriber(['email' => $email, 'status' => 'subscribed'], [$list_id]);
        return rest_ensure_response(['success' => true, 'message' => 'Subscribed!']);
    } catch (Exception $e) {
        if (stripos($e->getMessage(), 'already exists') !== false) {
            return rest_ensure_response(['success' => true, 'message' => 'Already subscribed!']);
        }
        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}

function djz_google_oauth_handler($request) {
    $token = sanitize_text_field($request->get_param('token') ?? '');
    if (empty($token)) return new WP_Error('no_token', 'Token is required', ['status' => 400]);
    $verify_url = add_query_arg('id_token', rawurlencode($token), 'https://oauth2.googleapis.com/tokeninfo');
    $response = wp_remote_get($verify_url, ['timeout' => 10]);
    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        return new WP_Error('invalid_token', 'Failed to verify Google token', ['status' => 401]);
    }
    $body = json_decode(wp_remote_retrieve_body($response), true);
    if (empty($body) || empty($body['email'])) {
        return new WP_Error('invalid_token', 'Invalid token body from Google', ['status' => 401]);
    }
    $email = sanitize_email($body['email']);
    $name = sanitize_text_field($body['name'] ?? '');
    $user = get_user_by('email', $email);
    if (!$user) {
        $user_id = wp_create_user($email, wp_generate_password(), $email);
        if (is_wp_error($user_id)) return $user_id;
        wp_update_user(['ID' => $user_id, 'display_name' => $name, 'first_name' => current(explode(' ', $name))]);
        $user = get_user_by('id', $user_id);
    }
    if (class_exists('\SimpleJwtLogin\Classes\SimpleJwtLoginJWT')) {
        $jwt_instance = new \SimpleJwtLogin\Classes\SimpleJwtLoginJWT();
        $jwt = $jwt_instance->getJwt($user);
        return rest_ensure_response([
            'jwt' => $jwt, 
            'user' => ['id' => $user->ID, 'email' => $user->user_email, 'name' => $user->display_name]
        ]);
    }
    return new WP_Error('jwt_plugin_missing', 'Simple JWT Login plugin not available', ['status' => 500]);
}

function djz_get_products_with_lang_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? '');
    
    if (empty($lang) && function_exists('pll_default_language')) {
        $lang = pll_default_language();
    }
    
    if (empty($lang)) {
        $lang = 'en';
    }
    
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );
    
    if (function_exists('pll_get_post_language')) {
        $args['lang'] = $lang;
    }
    
    $query = new WP_Query($args);
    $products = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product_id = get_the_ID();
            $product = wc_get_product($product_id);
            
            if (!$product) continue;
            
            $product_lang = $lang;
            if (function_exists('pll_get_post_language')) {
                $detected_lang = pll_get_post_language($product_id);
                if ($detected_lang) {
                    $product_lang = $detected_lang;
                }
            }
            
            $translations = array();
            if (function_exists('pll_get_post_translations')) {
                $translations = pll_get_post_translations($product_id);
            }
            
            $images = array();
            $image_ids = $product->get_gallery_image_ids();
            
            if ($product->get_image_id()) {
                array_unshift($image_ids, $product->get_image_id());
            }
            
            foreach ($image_ids as $image_id) {
                $images[] = array(
                    'id' => $image_id,
                    'src' => wp_get_attachment_url($image_id),
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                );
            }
            
            if (empty($images)) {
                $images[] = array(
                    'id' => 0,
                    'src' => 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer',
                    'alt' => $product->get_name(),
                );
            }
            
            $products[] = array(
                'id' => $product_id,
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(),
                'images' => $images,
                'lang' => $product_lang,
                'translations' => $translations,
            );
        }
    }
    
    wp_reset_postdata();
    
    return new WP_Rest_Response($products, 200);
}

/* =========================
 * Registro dos Endpoints na API
 * ========================= */

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

    register_rest_route($namespace, '/products', [
        'methods' => 'GET',
        'callback' => 'djz_get_products_with_lang_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'lang' => [
                'required' => false,
                'type' => 'string',
                'description' => 'Código do idioma (pt, en, etc)',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);

    register_rest_route($namespace, '/user/update-profile', [
        'methods' => 'POST',
        'callback' => function($request) {
            $user_id = get_current_user_id();
            if (0 === $user_id) {
                return new WP_Error('not_logged_in', 'Usuário não autenticado.', ['status' => 401]);
            }
            $params = $request->get_json_params();
            $user_data = ['ID' => $user_id];
            if (isset($params['displayName'])) {
                $user_data['display_name'] = sanitize_text_field($params['displayName']);
            }
            $result = wp_update_user($user_data);
            if (is_wp_error($result)) {
                return new WP_Error('profile_update_failed', 'Não foi possível atualizar o perfil.', ['status' => 400]);
            }
            return rest_ensure_response(['success' => true, 'message' => 'Perfil atualizado com sucesso!']);
        },
        'permission_callback' => 'is_user_logged_in'
    ]);

    register_rest_route('simple-jwt-login/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'djz_google_oauth_handler',
        'permission_callback' => '__return_true'
    ]);
});