<?php
/**
 * SPA Routing
 * Makes React Router work with WordPress
 * @version 2.0.0 (404 Handling Fix)
 */

if (!defined('ABSPATH')) exit;

/**
 * Route all React paths through index.php
 *
 * Important:
 * - We intentionally serve index.php for unknown front-end routes so React Router can handle them.
 * - Avoid emitting an HTTP 404 status when we decided to serve the SPA.
 */
add_filter('template_include', function($template) {
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) {
        return $template;
    }
    
    // Only intercept main front-end 404s (i.e., unknown WP routes) and hand them to the SPA.
    if (is_404() && is_main_query()) {
        // Mark that we intentionally routed to the SPA so other hooks do not restore the 404 header.
        $GLOBALS['DJZ_SPA_ROUTED'] = true;

        status_header(200);
        nocache_headers();

        return get_theme_file_path('/index.php');
    }
    
    return $template;
});

/**
 * "Real 404s" handling
 *
 * If WordPress is still returning a 404 AND we did NOT route to the SPA, then keep the 404 status.
 * This prevents accidental 404 responses for SPA routes, while preserving proper 404s for genuine misses.
 */
add_action('template_redirect', function() {
    // Only force 404 if it wasn't intercepted by our SPA logic
    if (is_404() && empty($GLOBALS['DJZ_SPA_ROUTED'])) {
        status_header(404);
        nocache_headers();
    }
}, 999);