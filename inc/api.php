<?php
/**
 * REST API Endpoints — Theme layer
 *
 * Responsabilidade: menu, newsletter subscribe e user meta.
 * Shop/produtos → plugin zen-commerce.
 * Auth/perfil   → plugin zeneyer-auth.
 * Eventos       → plugin zen-bit.
 * Gamificação   → plugin zengame.
 */

if (!defined('ABSPATH'))
    exit;

add_action('rest_api_init', function () {
    $ns = 'djzeneyer/v1';

    register_rest_route($ns, '/menu', [
        'methods'             => 'GET',
        'callback'            => 'djz_get_menu',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route($ns, '/subscribe', [
        'methods'             => 'POST',
        'callback'            => 'djz_subscribe_newsletter',
        'permission_callback' => '__return_true',
    ]);

    // User meta exposed to REST — auth_callback restricts write to owner or admin
    register_meta('user', 'zen_login_streak', [
        'show_in_rest'  => true,
        'single'        => true,
        'type'          => 'integer',
        'auth_callback' => function ($allowed, $meta_key, $object_id) {
            return current_user_can('edit_user', $object_id);
        },
    ]);

    register_meta('user', 'zen_last_login', [
        'show_in_rest'  => true,
        'single'        => true,
        'type'          => 'string',
        'auth_callback' => function ($allowed, $meta_key, $object_id) {
            return current_user_can('edit_user', $object_id);
        },
    ]);
});

// ---------------------------------------------------------------------------
// Menu endpoint (cached 6h)
// ---------------------------------------------------------------------------

function djz_get_menu($request)
{
    $lang = sanitize_key($request->get_param('lang') ?? 'en');
    $lang = str_starts_with($lang, 'pt') ? 'pt' : 'en';
    $cache_key = 'djz_menu_v3_' . $lang;

    $cached = get_transient($cache_key);
    if ($cached !== false)
        return rest_ensure_response($cached);

    if (function_exists('pll_set_language')) {
        pll_set_language($lang);
    }

    $locations = get_nav_menu_locations();
    $menu_id   = $locations['primary_menu'] ?? 0;

    if (!$menu_id) {
        $menus   = wp_get_nav_menus();
        $menu_id = $menus[0]->term_id ?? 0;
    }

    $items     = wp_get_nav_menu_items($menu_id);
    $formatted = [];
    $home      = home_url();

    if ($items) {
        foreach ($items as $item) {
            if ((int) $item->menu_item_parent !== 0) continue;

            $formatted[] = [
                'ID'     => $item->ID,
                'title'  => $item->title,
                'url'    => djz_localize_menu_url($item->url, $lang, $home),
                'target' => $item->target ?: '_self',
            ];
        }
    }

    set_transient($cache_key, $formatted, 6 * HOUR_IN_SECONDS);
    return rest_ensure_response($formatted);
}

/**
 * Localizes a WordPress menu URL using the React route SSOT (routes-slugs.json).
 * Polylang can return the translated title while keeping a custom-link URL in the
 * default language — this fixes it server-side so prerender and REST are consistent.
 */
function djz_localize_menu_url(string $url, string $lang, string $home): string
{
    $parsed_url = wp_parse_url($url);
    if (is_array($parsed_url) && !empty($parsed_url['scheme'])) {
        $scheme = strtolower((string) $parsed_url['scheme']);
        if (!in_array($scheme, ['http', 'https'], true)) return $url;
    }

    if (is_array($parsed_url) && !empty($parsed_url['host'])) {
        $home_host = wp_parse_url($home, PHP_URL_HOST);
        if (!is_string($home_host) || strcasecmp((string) $parsed_url['host'], $home_host) !== 0) return $url;
    }

    $path = $url;
    if (str_starts_with($path, $home)) {
        $path = '/' . ltrim(substr($path, strlen($home)), '/');
    }

    $parts       = wp_parse_url($path);
    $raw_path    = isset($parts['path']) ? (string) $parts['path'] : '/';
    $query       = isset($parts['query'])    && $parts['query']    !== '' ? '?' . $parts['query']    : '';
    $fragment    = isset($parts['fragment']) && $parts['fragment'] !== '' ? '#' . $parts['fragment'] : '';

    $normalized  = djz_normalize_menu_path($raw_path);
    $route       = djz_menu_route_by_path($normalized);

    if (!$route) {
        $fallback = '/' . ltrim($normalized, '/');
        if ($fallback !== '/') $fallback = rtrim($fallback, '/') . '/';
        return $fallback . $query . $fragment;
    }

    return djz_menu_route_path($route, $lang) . $query . $fragment;
}

function djz_normalize_menu_path(string $path): string
{
    $segments = array_values(array_filter(
        explode('/', trim(rawurldecode($path), '/')),
        static fn($s) => $s !== '' && $s !== '.'
    ));

    if (in_array('..', $segments, true)) return '/';

    return '/' . implode('/', $segments);
}

function djz_menu_routes(): array
{
    static $routes = null;
    if ($routes !== null) return $routes;

    $routes      = [];
    $routes_file = get_theme_file_path('/src/config/routes-slugs.json');
    if (!file_exists($routes_file)) return $routes;

    $raw  = file_get_contents($routes_file);
    $data = $raw !== false ? json_decode($raw, true) : null;
    if (!is_array($data) || empty($data['routes']) || !is_array($data['routes'])) return $routes;

    foreach ($data['routes'] as $route) {
        if (is_array($route) && empty($route['private'])) $routes[] = $route;
    }

    return $routes;
}

function djz_menu_route_by_path(string $path): ?array
{
    $normalized = djz_normalize_menu_path($path);

    foreach (djz_menu_routes() as $route) {
        foreach (['en', 'pt'] as $lang) {
            $slug       = isset($route[$lang]) ? trim((string) $route[$lang], '/') : '';
            $route_path = $lang === 'pt' ? '/pt' . ($slug === '' ? '' : '/' . $slug) : '/' . $slug;
            if (djz_normalize_menu_path($route_path) === $normalized) return $route;

            if (empty($route['aliases'][$lang]) || !is_array($route['aliases'][$lang])) continue;

            foreach ($route['aliases'][$lang] as $alias) {
                $alias_slug = trim((string) $alias, '/');
                if ($alias_slug === '') continue;
                $alias_path = $lang === 'pt' ? '/pt/' . $alias_slug : '/' . $alias_slug;
                if (djz_normalize_menu_path($alias_path) === $normalized) return $route;
            }
        }
    }

    return null;
}

function djz_menu_route_path(array $route, string $lang): string
{
    $slug = isset($route[$lang]) ? trim((string) $route[$lang], '/') : '';
    $path = $lang === 'pt' ? '/pt' . ($slug === '' ? '' : '/' . $slug) : '/' . $slug;
    return $path === '/' ? '/' : rtrim($path, '/') . '/';
}

// ---------------------------------------------------------------------------
// Newsletter subscribe
// ---------------------------------------------------------------------------

function djz_subscribe_newsletter($request)
{
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    }

    if (!class_exists('\MailPoet\API\API')) {
        return new WP_Error('mailpoet_inactive', 'MailPoet not active', ['status' => 500]);
    }

    try {
        $api     = \MailPoet\API\API::MP('v1');
        $lists   = $api->getLists();
        $list_id = (int) apply_filters('djz_mailpoet_list_id', 0);
        if ($list_id <= 0) $list_id = $lists[0]['id'] ?? 1;

        $api->addSubscriber(['email' => $email, 'status' => 'subscribed'], [$list_id]);

        return rest_ensure_response(['success' => true, 'message' => 'Subscribed!']);
    } catch (Exception $e) {
        if (stripos($e->getMessage(), 'already exists') !== false) {
            return rest_ensure_response(['success' => true, 'message' => 'Already subscribed!']);
        }
        return new WP_Error('subscription_failed', 'Ocorreu um erro na inscrição. Tente novamente mais tarde.', ['status' => 500]);
    }
}

// ---------------------------------------------------------------------------
// Cache hooks
// ---------------------------------------------------------------------------

add_action('wp_update_nav_menu', function () {
    global $wpdb;
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_djz_menu_%',
            '_transient_timeout_djz_menu_%'
        )
    );
});

add_action('save_post_achievement', function () {
    global $wpdb;
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_djz_gamipress_%',
            '_transient_timeout_djz_gamipress_%'
        )
    );
});

// ---------------------------------------------------------------------------
// Admin: "Clear All Cache" button (menu + gamipress; shop cache is in zen-commerce)
// ---------------------------------------------------------------------------

add_action('admin_bar_menu', function (WP_Admin_Bar $wp_admin_bar) {
    if (!current_user_can('manage_options')) return;

    $wp_admin_bar->add_node([
        'id'    => 'djz_clear_cache',
        'title' => '🧹 Clear Cache',
        'href'  => wp_nonce_url(add_query_arg('djz_clear_cache', '1', admin_url()), 'djz_clear_cache'),
    ]);
}, 999);

add_action('admin_init', function () {
    if (!isset($_GET['djz_clear_cache']) || !current_user_can('manage_options')) return;
    check_admin_referer('djz_clear_cache');

    global $wpdb;
    $wpdb->query(
        $wpdb->prepare(
            "DELETE FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
            '_transient_djz_%',
            '_transient_timeout_djz_%'
        )
    );

    wp_safe_redirect(remove_query_arg('djz_clear_cache'));
    exit;
});
