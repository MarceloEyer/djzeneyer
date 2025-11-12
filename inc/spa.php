<?php
if (!defined('ABSPATH')) exit;

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
 * FIX 404
 * ========================= */
add_action('template_redirect', function() {
    if (is_404()) {
        status_header(404);
        nocache_headers();
    }
}, 999);