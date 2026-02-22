<?php
// Mock WP Environment
define('ABSPATH', '/tmp');
define('MINUTE_IN_SECONDS', 60);
define('DAY_IN_SECONDS', 86400);

// Global state
$transient_storage = [];
$actions = [];
$filters = [];
$enqueued_scripts = [];
$enqueued_styles = [];

/**
 * Retrieve a value from the mocked transient storage by key.
 *
 * @param string $key The transient key to look up.
 * @return mixed The stored value for the given key, or `false` if the key does not exist.
 */
function get_transient($key) {
    global $transient_storage;
    return isset($transient_storage[$key]) ? $transient_storage[$key] : false;
}

/**
 * Stores a value in the mock transient storage under the specified key.
 *
 * The `$expiration` parameter is accepted for API compatibility but is ignored by this mock implementation.
 *
 * @param string $key The transient key.
 * @param mixed $value The value to store.
 * @param int $expiration Expiration time in seconds (ignored).
 * @return bool `true` if the value was stored (always `true` in this mock).
 */
function set_transient($key, $value, $expiration) {
    global $transient_storage;
    $transient_storage[$key] = $value;
    return true;
}

/**
 * Get a mocked theme file path rooted at /tmp.
 *
 * @param string $path Optional relative path to append to the mocked theme directory. Leading slash may be included.
 * @return string The combined mocked file path (prefixed with `/tmp`).
 */
function get_theme_file_path($path = '') {
    // Mock dist path
    return '/tmp' . $path;
}

/**
 * Get the URI of the current theme's template directory.
 *
 * Test/mock implementation that returns 'http://example.com'.
 *
 * @return string The template directory URI.
 */
function get_template_directory_uri() {
    return 'http://example.com';
}

/ **
 * Registers a callback for the given action hook in the mocked environment.
 *
 * @param string   $tag           Name of the action hook.
 * @param callable $callback      Callback to register.
 * @param int      $priority      Optional. Callback priority (accepted for compatibility; ignored by this mock).
 * @param int      $accepted_args Optional. Number of arguments the callback accepts (accepted for compatibility; ignored by this mock).
 */
function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {
    global $actions;
    $actions[$tag][] = $callback;
}

/**
 * Registers a callback for a given filter tag.
 *
 * Adds the provided callback to the global filter registry so it will be invoked
 * when the specified tag is applied.
 *
 * @param string   $tag           The filter tag name.
 * @param callable $callback      The callback to register for the tag.
 * @param int      $priority      Priority for execution; lower numbers run earlier.
 * @param int      $accepted_args Number of arguments the callback accepts.
 */
function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) {
    global $filters;
    $filters[$tag][] = $callback;
}

/**
 * Records a script handle and its source URL in the mock enqueued scripts registry.
 *
 * The function stores the provided `$src` under `$handle` in the global `$enqueued_scripts`
 * array. Other parameters are accepted for compatibility but are not used by the mock.
 *
 * @param string $handle Unique script handle.
 * @param string|null $src Script source URL or null.
 * @param array $deps Optional list of dependency handles (unused in this mock).
 * @param string|false $ver Optional version string (unused in this mock).
 * @param bool $in_footer Whether to enqueue script in footer (unused in this mock).
 * @return void
 */
function wp_enqueue_script($handle, $src, $deps = [], $ver = false, $in_footer = false) {
    global $enqueued_scripts;
    $enqueued_scripts[$handle] = $src;
}

/**
 * Registers a stylesheet handle and source into the mock enqueued styles storage.
 *
 * This mock implementation records the stylesheet source by handle in the global
 * $enqueued_styles array so tests can verify enqueued assets.
 *
 * @param string $handle Unique identifier for the stylesheet.
 * @param string|null $src URL or path to the stylesheet. May be null for inline or dependency-only handles.
 * @param array $deps Ignored in this mock; present for API compatibility.
 * @param string|false $ver Ignored in this mock; present for API compatibility.
 * @param string $media Ignored in this mock; present for API compatibility.
 */
function wp_enqueue_style($handle, $src, $deps = [], $ver = false, $media = 'all') {
    global $enqueued_styles;
    $enqueued_styles[$handle] = $src;
}

/**
 * Mock URL sanitizer that returns the provided URL unchanged.
 *
 * @param string $url The URL to sanitize.
 * @return string The original URL passed in.
 */
function esc_url($url) { return $url; }
/**
 * Mock attribute escaper used in tests; returns the given string unchanged.
 *
 * @param string $str The string to return unchanged.
 * @return string The identical input string.
 */
function esc_attr($str) { return $str; }
/**
 * Get the site's home URL with an optional appended path.
 *
 * @param string $path Optional path to append to the home URL; appended verbatim.
 * @return string The full URL composed of the site's home URL followed by the provided path.
 */
function home_url($path = '') { return 'http://example.com' . $path; }
/**
 * Builds a REST API URL for the mock site.
 *
 * @param string $path Optional path or endpoint to append to the REST base (should begin with a slash if needed).
 * @return string The full REST API URL including the provided path.
 */
function rest_url($path = '') { return 'http://example.com/wp-json' . $path; }
/**
 * Generate a nonce string for the given action.
 *
 * @param string $action Action name used to create the nonce.
 * @return string A nonce string.
 */
function wp_create_nonce($action) { return 'nonce'; }
/**
 * Retrieve the ID of the current user in the mocked environment.
 *
 * @return int The current user's numeric ID; in this mock implementation this always returns 1.
 */
function get_current_user_id() { return 1; }

// Create mock manifest file
$mock_dist_dir = '/tmp/dist/.vite';
if (!is_dir($mock_dist_dir)) {
    mkdir($mock_dist_dir, 0777, true);
}
$manifest_content = json_encode([
    'src/main.tsx' => [
        'file' => 'assets/main.js',
        'css' => ['assets/style.css'],
        'imports' => []
    ]
]);
file_put_contents($mock_dist_dir . '/manifest.json', $manifest_content);

// Include the class file
require_once __DIR__ . '/../inc/vite.php';

// Test
echo "Instantiating DJZ_Vite_Loader...\n";
$loader = new DJZ_Vite_Loader();

echo "Running enqueue_assets...\n";
$loader->enqueue_assets();

// Check if assets were enqueued
if (isset($enqueued_scripts['djz-react-main']) &&
    strpos($enqueued_scripts['djz-react-main'], 'assets/main.js') !== false) {
    echo "SUCCESS: Script enqueued correctly.\n";
} else {
    echo "FAILURE: Script not enqueued.\n";
    print_r($enqueued_scripts);
    exit(1);
}

// Verify Cache was set
$expected_cache_key = 'djz_vite_manifest_v2_' . md5('/tmp/dist/.vite/manifest.json');
if (get_transient($expected_cache_key)) {
    echo "SUCCESS: Transient cache set.\n";
} else {
    echo "FAILURE: Transient cache not set.\n";
    // Check path 2
    $expected_cache_key_2 = 'djz_vite_manifest_v2_' . md5('/tmp/dist/manifest.json');
    if (get_transient($expected_cache_key_2)) {
         echo "SUCCESS: Transient cache set (path 2).\n";
    } else {
         echo "FAILURE: No transient cache found.\n";
         exit(1);
    }
}

// Test Optimization: Delete file, check if it still works via cache
echo "Testing Optimization (Cache Hit, File Missing)...\n";
unlink($mock_dist_dir . '/manifest.json');

// New instance to force re-evaluation of load_manifest (but it will use global transient)
$loader2 = new DJZ_Vite_Loader();
$enqueued_scripts = []; // Reset

$loader2->enqueue_assets();

if (isset($enqueued_scripts['djz-react-main'])) {
    echo "SUCCESS: Script enqueued from cache even though file is missing (Optimization Works!).\n";
} else {
    echo "FAILURE: Script NOT enqueued from cache.\n";
    exit(1);
}

echo "All verifications passed.\n";
?>