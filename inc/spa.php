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
 * - We intentionally serve index.php for all frontend routes (including products) so React Router can handle them.
 * - This prevents WordPress from serving plugin templates (like WooCommerce) that lack the React root.
 */
add_filter('template_include', function($template) {
    // 1. Exclude Admin, API, and special non-HTML requests
    if (
        is_admin() ||
        (defined('REST_REQUEST') && REST_REQUEST) ||
        is_feed() ||
        is_trackback() ||
        is_robots() ||
        is_embed()
    ) {
        return $template;
    }
    
    // 2. Force SPA for everything else (Products, Pages, Posts, 404s)
    // Mark that we intentionally routed to the SPA so other hooks do not restore the 404 header.
    $GLOBALS['DJZ_SPA_ROUTED'] = true;

    status_header(200);
    nocache_headers();

    return get_theme_file_path('/index.php');
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