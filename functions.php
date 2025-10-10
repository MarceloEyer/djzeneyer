<?php
/**
 * DJ Zen Eyer Theme Functions
 * v7.0.0 - FINAL STABLE VERSION (corrigido)
 */
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Força o carregamento do App React para rotas de SPA que o WordPress marcaria como 404.
 * Retorna o index.php do tema, mas só para requisições não-admin e não-REST.
 */
add_filter('template_include', function ($template) {
    if ( is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || ! is_main_query() || ! is_404() ) {
        return $template;
    }
    // Retorna o index.php do tema para permitir que o SPA monte a rota
    status_header(200);
    return get_theme_file_path('/index.php');
});

/**
 * Helper: caminho e versão dos assets do build (dist)
 */
function djz_get_dist_asset($path) {
    $rel = "/dist/{$path}";
    $file = get_theme_file_path($rel);
    if (file_exists($file)) {
        return esc_url( get_template_directory_uri() . $rel ) . '?v=' . filemtime($file);
    }
    return false;
}

/**
 * Enqueue scripts & styles (usar filemtime para cache busting)
 */
add_action('wp_enqueue_scripts', function () {
    // estilo principal do tema (style.css)
    wp_enqueue_style('djzeneyer-style', get_stylesheet_uri());

    // assets do build React (dist)
    $css = djz_get_dist_asset('assets/index.css');
    $js  = djz_get_dist_asset('assets/index.js');

    if ($css) {
        wp_enqueue_style('djzeneyer-react-styles', $css, [], null);
    }

    if ($js) {
        // registrar para poder modificar atributos via script_loader_tag
        wp_register_script('djzeneyer-react', $js, [], null, true);
        wp_enqueue_script('djzeneyer-react');

        // Expor dados necessários ao cliente
        wp_localize_script('djzeneyer-react', 'wpData', [
            'siteUrl' => esc_url(home_url('/')),
            'restUrl' => esc_url_raw(rest_url()),
            'nonce'   => wp_create_nonce('wp_rest'),
        ]);
    }
}, 20);

/**
 * Corrigir tag type=module e crossorigin para o handle do app
 * Mantém tags existentes para outros handles
 */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        // Preserve id e outros atributos se necessário; garantir type=module
        $id_attr = ' id="' . esc_attr($handle) . '-js"';
        // Use use-credentials apenas se você precisa enviar cookies/autenticação cross-origin.
        // Aqui assumimos que rest API usa origens explícitas e credenciais, então mantemos use-credentials.
        return '<script type="module" src="' . esc_url($src) . '"' . $id_attr . ' crossorigin="use-credentials" defer></script>';
    }
    return $tag;
}, 10, 3);

/**
 * Theme support & menus
 */
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('woocommerce');
    register_nav_menus(['primary_menu' => __('Menu Principal', 'djzeneyer')]);
});

/**
 * Criar role 'dj' ao ativar o tema, se ainda não existir
 */
add_action('after_switch_theme', function () {
    if (!get_role('dj')) {
        add_role('dj', 'DJ', ['read' => true]);
    }
});

/**
 * Security headers enviados pelo WordPress (apenas em front-end)
 */
add_action('send_headers', function() {
    if ( is_admin() || headers_sent() ) {
        return;
    }
    header_remove('X-Powered-By');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
});

/**
 * CORS REST API: adicionar cabeçalhos controlados para origens permitidas
 * Permite credenciais; ajuste a lista de origens conforme produção.
 */
add_action('rest_api_init', function() {
    // Não remover o handler global do WP; apenas adicionar lógica própria no pre_serve
    add_filter('rest_pre_serve_request', function($served) {
        $allowed_origins = [
            'https://djzeneyer.com',
            'https://www.djzeneyer.com',
            'https://app.djzeneyer.com',
            'http://localhost:5173'
        ];
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim($_SERVER['HTTP_ORIGIN']) : '';
        if (in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With');
        // Se for preflight, termine aqui com 200
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
        return $served;
    }, 15);
});

/**
 * JWT + GamiPress extra payload
 */
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

/**
 * Endpoints personalizados (menu, subscribe, etc.)
 * Placeholder — mantenha aqui seu código de endpoints
 */
add_action('rest_api_init', function () {
    $namespace = 'djzeneyer/v1';
    // register_rest_route( $namespace, '/menu', [ ... ] );
    // register_rest_route( $namespace, '/subscribe', [ ... ] );
});

/**
 * GamiPress REST Field
 */
add_action('rest_api_init', function(){
    register_rest_field('user', 'gamipress_data', [
        'get_callback' => function($user) {
            if (!function_exists('gamipress_get_user_points')) {
                return null;
            }
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
