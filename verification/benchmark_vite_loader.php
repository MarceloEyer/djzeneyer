<?php
// Mock WP Environment
define('ABSPATH', '/tmp');
define('MINUTE_IN_SECONDS', 60);
define('DAY_IN_SECONDS', 86400);

$transient_storage = [];
$stats = ['file_exists' => 0, 'filemtime' => 0, 'get_transient' => 0];

function get_transient($key) {
    global $transient_storage, $stats;
    $stats['get_transient']++;
    return isset($transient_storage[$key]) ? $transient_storage[$key] : false;
}

function set_transient($key, $value, $expiration) {
    global $transient_storage;
    $transient_storage[$key] = $value;
    return true;
}

function get_theme_file_path($path = '') {
    return '/tmp' . $path;
}

function get_template_directory_uri() {
    return 'http://example.com';
}

function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {}
function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) {}
function wp_enqueue_script() {}
function wp_enqueue_style() {}
function esc_url($url) { return $url; }

// Mock filesystem
function mock_file_exists($path) {
    global $stats;
    $stats['file_exists']++;
    // Simulate manifest exists at path 2
    return strpos($path, 'manifest.json') !== false;
}

function mock_filemtime($path) {
    global $stats;
    $stats['filemtime']++;
    return 1234567890;
}

function mock_file_get_contents($path) {
    return json_encode(['src/main.tsx' => ['file' => 'assets/main.js']]);
}

class DJZ_Vite_Loader_Original {
    private $manifest = null;
    private $dist_path = '/tmp';

    public function load_manifest() {
        $paths = [
            $this->dist_path . '/.vite/manifest.json',
            $this->dist_path . '/manifest.json'
        ];

        foreach ($paths as $path) {
            if (mock_file_exists($path)) {
                $cache_key = 'djz_vite_manifest_v2_' . md5($path);
                $cached    = get_transient($cache_key);

                $mtime = mock_filemtime($path);
                if ($mtime === false) $mtime = 0;

                if (
                    is_array($cached) &&
                    isset($cached['mtime'], $cached['data']) &&
                    $cached['mtime'] === $mtime &&
                    $mtime !== 0
                ) {
                    $this->manifest = $cached['data'];
                    return;
                }

                // Simulate read and set transient
                $this->manifest = ['test'];
                set_transient($cache_key, ['mtime' => $mtime, 'data' => ['test']], 60);
                return;
            }
        }
    }
}

class DJZ_Vite_Loader_Optimized {
    private $manifest = null;
    private $dist_path = '/tmp';

    public function load_manifest() {
        $paths = [
            $this->dist_path . '/.vite/manifest.json',
            $this->dist_path . '/manifest.json'
        ];

        foreach ($paths as $path) {
            $cache_key = 'djz_vite_manifest_v2_' . md5($path);
            $cached    = get_transient($cache_key);

            if (
                is_array($cached) &&
                isset($cached['data'])
            ) {
                $this->manifest = $cached['data'];
                return;
            }

            if (mock_file_exists($path)) {
                $mtime = mock_filemtime($path);
                if ($mtime === false) $mtime = 0;

                $this->manifest = ['test'];
                set_transient($cache_key, ['mtime' => $mtime, 'data' => ['test']], 60);
                return;
            }
        }
    }
}

// Warm up cache
$warmup = new DJZ_Vite_Loader_Original();
$warmup->load_manifest();

// Bench Original
$stats = ['file_exists' => 0, 'filemtime' => 0, 'get_transient' => 0];
$start = microtime(true);
for ($i = 0; $i < 10000; $i++) {
    $loader = new DJZ_Vite_Loader_Original();
    $loader->load_manifest();
}
$time_orig = microtime(true) - $start;
echo "Original Time: " . number_format($time_orig, 4) . "s\n";
echo "Original Stats: " . json_encode($stats) . "\n";

// Bench Optimized
$stats = ['file_exists' => 0, 'filemtime' => 0, 'get_transient' => 0];
$start = microtime(true);
for ($i = 0; $i < 10000; $i++) {
    $loader = new DJZ_Vite_Loader_Optimized();
    $loader->load_manifest();
}
$time_opt = microtime(true) - $start;
echo "Optimized Time: " . number_format($time_opt, 4) . "s\n";
echo "Optimized Stats: " . json_encode($stats) . "\n";

?>
