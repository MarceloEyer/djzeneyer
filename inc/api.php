<?php
if (!defined('ABSPATH')) exit;

// Helper GamiPress
function djz_format_requirements($post_id) {
    if (!function_exists('gamipress_get_post_requirements')) return [];
    $reqs = gamipress_get_post_requirements($post_id);
    return array_map(function($r) {
        return ['id' => $r->ID, 'title' => $r->post_title, 'count' => (int)get_post_meta($r->ID, '_gamipress_count', true)];
    }, is_array($reqs) ? $reqs : []);
}

// Handlers (Lógica resumida, use o seu código original se precisar de detalhes)
function djz_api_menu($req) {
    // ... (Sua lógica de menu do functions.php original) ...
    // Para economizar espaço aqui, estou abreviando, mas você deve colar a função completa djz_get_multilang_menu_handler aqui
    // Se quiser, posso reenviar o código completo deste arquivo específico.
    return rest_ensure_response([]); 
}

// Registro de Rotas
add_action('rest_api_init', function () {
    $ns = 'djzeneyer/v1';

    register_rest_route($ns, '/menu', ['methods' => 'GET', 'callback' => 'djz_get_multilang_menu_handler', 'permission_callback' => '__return_true']);
    register_rest_route($ns, '/subscribe', ['methods' => 'POST', 'callback' => 'djz_mailpoet_subscribe_handler', 'permission_callback' => '__return_true']);
    register_rest_route($ns, '/products', ['methods' => 'GET', 'callback' => 'djz_get_products_with_lang_handler', 'permission_callback' => '__return_true']);
    register_rest_route($ns, '/gamipress/(?P<user_id>\d+)', ['methods' => 'GET', 'callback' => 'djz_get_gamipress_handler', 'permission_callback' => '__return_true']);
    register_rest_route('simple-jwt-login/v1', '/auth/google', ['methods' => 'POST', 'callback' => 'djz_google_oauth_handler', 'permission_callback' => '__return_true']);
});

// *** IMPORTANTE: ***
// Você deve copiar e colar as funções completas do seu functions.php antigo para cá:
// - djz_get_gamipress_handler
// - djz_get_multilang_menu_handler
// - djz_mailpoet_subscribe_handler
// - djz_google_oauth_handler
// - djz_get_products_with_lang_handler