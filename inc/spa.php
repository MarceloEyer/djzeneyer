<?php
if (!defined('ABSPATH')) exit;

/* =========================
 * ROTEAMENTO SPA
 * (Este é o trecho que você perguntou)
 * ========================= */
add_filter('template_include', function ($template) {
    // Se for admin, API REST ou não for a query principal, deixa o WP agir normal
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || !is_main_query() || !is_404()) {
        return $template;
    }
    
    // Se for uma rota do React (que pro WP parece 404), força status 200 e carrega o index.php
    status_header(200);
    return get_theme_file_path('/index.php');
});

/* =========================
 * FIX 404 REAL
 * (Agrupamos aqui pois faz parte da lógica de rotas)
 * ========================= */
add_action('template_redirect', function() {
    if (is_404()) {
        status_header(404);
        nocache_headers();
    }
}, 999);