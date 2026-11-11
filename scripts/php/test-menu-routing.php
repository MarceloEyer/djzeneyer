<?php
/**
 * Regression tests for the theme menu URL localizer.
 *
 * This script stubs the minimal WordPress functions required by `inc/api.php`
 * so the route mapping logic can be validated without booting WordPress.
 */

define('ABSPATH', __DIR__);
define('WP_PLUGIN_DIR', __DIR__ . '/../../plugins');
define('HOUR_IN_SECONDS', 3600);

class Zen_Commerce_REST_Controller {}

function add_action($hook, $callback, $priority = 10, $accepted_args = 1) {}
function register_rest_route($namespace, $route, $args = []) {}
function register_meta($object_type, $meta_key, $args = []) {}
function register_rest_field($object_type, $attribute, $args = []) {}
function class_exists_without_autoload($class) { return class_exists($class, false); }
function file_exists_without_warning($path) { return file_exists($path); }
function get_theme_file_path($path = '') { return dirname(__DIR__, 2) . $path; }
function wp_parse_url($url, $component = -1) { return parse_url($url, $component); }
function home_url($path = '') { return 'https://djzeneyer.com' . $path; }
function wp_nonce_url($actionurl, $action = -1, $name = '_wpnonce') { return $actionurl; }
function add_query_arg(...$args) { return ''; }
function admin_url($path = '') { return 'https://djzeneyer.com/wp-admin/' . ltrim($path, '/'); }
function current_user_can($capability, ...$args) { return false; }
function sanitize_key($key) { return preg_replace('/[^a-z0-9_\-]/', '', strtolower((string) $key)); }
function sanitize_email($email) { return (string) $email; }
function is_email($email) { return filter_var($email, FILTER_VALIDATE_EMAIL); }
function rest_ensure_response($response) { return $response; }
function __($text, $domain = 'default') { return $text; }
function check_admin_referer($action = -1, $query_arg = '_wpnonce') {}
function wp_safe_redirect($location, $status = 302, $x_redirect_by = 'WordPress') {}
function remove_query_arg($key, $query = false) { return ''; }

require_once dirname(__DIR__, 2) . '/inc/api.php';

$cases = [
    ['https://djzeneyer.com/about-dj-zen-eyer/?ref=menu#bio', 'pt', '/pt/sobre-dj-zen-eyer/?ref=menu#bio', 'localized EN canonical path to PT and preserved suffixes'],
    ['/about-dj-zen-eyer/', 'pt', '/pt/sobre-dj-zen-eyer/', 'localized EN canonical path to PT canonical path'],
    ['/pt/sobre-dj-zen-eyer/', 'en', '/about-dj-zen-eyer/', 'localized PT canonical path to EN canonical path'],
    ['/does-not-exist?x=1#frag', 'pt', '/does-not-exist/?x=1#frag', 'preserved unknown same-origin custom path'],
    ['https://external.example/path?x=1#frag', 'pt', 'https://external.example/path?x=1#frag', 'left external URL untouched'],
    ['/../private', 'en', '/', 'normalized traversal attempt to home'],
    ['/', 'pt', '/pt/', 'localized EN home path to PT home path'],
    ['/pt', 'en', '/', 'localized PT home path to EN home path'],
    ['/pt/', 'en', '/', 'localized PT home path with trailing slash to EN home path'],
];

$failures = [];
foreach ($cases as [$url, $lang, $expected, $label]) {
    $actual = djz_localize_menu_url($url, $lang, home_url());
    if ($actual !== $expected) {
        $failures[] = sprintf("%s\n  expected: %s\n  actual:   %s", $label, $expected, $actual);
    }
}

if ($failures) {
    fwrite(STDERR, "Menu routing regression failures:\n" . implode("\n\n", $failures) . "\n");
    exit(1);
}

echo "Menu routing regression tests passed.\n";
