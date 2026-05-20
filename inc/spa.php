<?php
/**
 * SPA Routing
 * Makes React Router work with WordPress
 * @version 2.0.0 (404 Handling Fix)
 */

if (!defined('ABSPATH')) exit;

function djz_spa_normalize_path(string $path): string
{
    $path = strtok($path, '?') ?: '/';
    $path = str_replace("\0", '', rawurldecode($path));
    $segments = array_values(array_filter(explode('/', trim($path, '/')), static function ($segment) {
        return $segment !== '' && $segment !== '.';
    }));

    if (in_array('..', $segments, true)) {
        return '/__invalid_spa_path__';
    }

    $path = '/' . implode('/', $segments);
    return $path === '/' ? '/' : rtrim($path, '/');
}

function djz_spa_known_paths(): array
{
    static $known_paths = null;

    if ($known_paths !== null) {
        return $known_paths;
    }

    $known_paths = ['/'];
    $routes_file = get_theme_file_path('/src/config/routes-slugs.json');
    if (!file_exists($routes_file)) {
        return $known_paths;
    }

    $routes_json = file_get_contents($routes_file);
    $routes_data = $routes_json !== false ? json_decode($routes_json, true) : null;
    if (!is_array($routes_data) || empty($routes_data['routes']) || !is_array($routes_data['routes'])) {
        return $known_paths;
    }

    foreach ($routes_data['routes'] as $route) {
        if (!is_array($route)) {
            continue;
        }

        foreach (['en', 'pt'] as $lang) {
            $slug = isset($route[$lang]) ? trim((string) $route[$lang], '/') : '';
            $path = $lang === 'pt' ? '/pt' . ($slug === '' ? '' : '/' . $slug) : '/' . $slug;
            $known_paths[] = djz_spa_normalize_path($path);
        }

        if (!empty($route['aliases']) && is_array($route['aliases'])) {
            foreach (['en', 'pt'] as $lang) {
                if (empty($route['aliases'][$lang]) || !is_array($route['aliases'][$lang])) {
                    continue;
                }
                foreach ($route['aliases'][$lang] as $alias) {
                    $slug = trim((string) $alias, '/');
                    if ($slug === '') {
                        continue;
                    }
                    $path = $lang === 'pt' ? '/pt/' . $slug : '/' . $slug;
                    $known_paths[] = djz_spa_normalize_path($path);
                }
            }
        }
    }

    return array_values(array_unique($known_paths));
}

function djz_spa_path_is_known(string $path): bool
{
    $normalized_path = djz_spa_normalize_path($path);
    if ($normalized_path === '/__invalid_spa_path__') {
        return false;
    }

    if (in_array($normalized_path, djz_spa_known_paths(), true)) {
        return true;
    }

    $dist_root = realpath(get_theme_file_path('/dist'));
    if ($dist_root === false) {
        return false;
    }

    $dist_route = realpath(get_theme_file_path('/dist' . ($normalized_path === '/' ? '' : $normalized_path) . '/index.html'));
    if ($dist_route === false || !is_file($dist_route)) {
        return false;
    }

    $dist_root = rtrim($dist_root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    return strpos($dist_route, $dist_root) === 0;
}

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
        // SEGURANÇA: Se o path parece um arquivo estático (está no wp-content ou tem extensão comum),
        // NÃO intercepte. Deixe o WordPress retornar 404 real ou o Web Server tratar.
        // Isso evita loops 522 ao tentar servir HTML pesado para cada imagem/js quebrado.
        $path = strtok($_SERVER['REQUEST_URI'], '?');
        if (preg_match('/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|webmanifest|php)$/i', $path)) {
            return $template;
        }

        if (strpos($path, '/wp-content/') !== false || strpos($path, '/wp-includes/') !== false) {
            return $template;
        }

        if (!djz_spa_path_is_known($path)) {
            return $template;
        }

        // Mark that we intentionally routed to the SPA so other hooks do not restore the 404 header.
        $GLOBALS['DJZ_SPA_ROUTED'] = true;
        
        global $wp_query;
        $wp_query->is_404 = false;
        $wp_query->is_page = true;

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
