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

// Mock functions
function get_transient($key) {
    global $transient_storage;
    return isset($transient_storage[$key]) ? $transient_storage[$key] : false;
}

function set_transient($key, $value, $expiration) {
    global $transient_storage;
    $transient_storage[$key] = $value;
    return true;
}

function get_theme_file_path($path = '') {
    // Mock dist path
    return '/tmp' . $path;
}

function get_template_directory_uri() {
    return 'http://example.com';
}

function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {
    global $actions;
    $actions[$tag][] = $callback;
}

function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) {
    global $filters;
    $filters[$tag][] = $callback;
}

function wp_enqueue_script($handle, $src, $deps = [], $ver = false, $in_footer = false) {
    global $enqueued_scripts;
    $enqueued_scripts[$handle] = $src;
}

function wp_enqueue_style($handle, $src, $deps = [], $ver = false, $media = 'all') {
    global $enqueued_styles;
    $enqueued_styles[$handle] = $src;
}

function esc_url($url) { return $url; }
function esc_attr($str) { return $str; }
function home_url($path = '') { return 'http://example.com' . $path; }
function rest_url($path = '') { return 'http://example.com/wp-json' . $path; }
function wp_create_nonce($action) { return 'nonce'; }
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
