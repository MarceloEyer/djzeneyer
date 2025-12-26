<?php
/**
 * SPA Routing
 * Makes React Router work with WordPress
 */

if (!defined('ABSPATH')) exit;

/**
 * Route all React paths through index.php
 */
add_filter('template_include', function($template) {
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return $template;
    }
    
    if (is_404() && is_main_query()) {
        status_header(200);
        return get_theme_file_path('/index.php');
    }
    
    return $template;
});

/**
 * Fix real 404s
 */
add_action('template_redirect', function() {
    if (is_404()) {
        status_header(404);
        nocache_headers();
    }
}, 999);