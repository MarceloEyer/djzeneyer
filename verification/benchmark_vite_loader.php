<?php
// Mock WP Environment
define('ABSPATH', '/tmp');
define('MINUTE_IN_SECONDS', 60);
define('DAY_IN_SECONDS', 86400);

$transient_storage = [];
$stats = ['file_exists' => 0, 'filemtime' => 0, 'get_transient' => 0];

/**
 * Retrieve a stored transient value by key.
 *
 * Increments the global `$stats['get_transient']` counter.
 *
 * @param string $key The transient key.
 * @return mixed The stored value for `$key`, or `false` if the transient is not set.
 */
function get_transient($key) {
    global $transient_storage, $stats;
    $stats['get_transient']++;
    return isset($transient_storage[$key]) ? $transient_storage[$key] : false;
}

/**
 * Stores a transient value under the given key (expiration parameter is accepted but ignored).
 *
 * @param string $key The transient key.
 * @param mixed $value The value to store.
 * @param int $expiration Expiration in seconds (ignored in this mock implementation).
 * @return bool Always returns true.
 */
function set_transient($key, $value, $expiration) {
    global $transient_storage;
    $transient_storage[$key] = $value;
    return true;
}

/**
 * Resolve a theme file path by prepending the theme directory root.
 *
 * @param string $path Optional relative path within the theme directory (leading slash allowed).
 * @return string The resolved filesystem path to the requested theme file.
 */
function get_theme_file_path($path = '') {
    return '/tmp' . $path;
}

/**
 * Get the template directory URI.
 *
 * @return string The template directory URI ('http://example.com').
 */
function get_template_directory_uri() {
    return 'http://example.com';
}

/**
 * No-op replacement for WordPress' add_action used in this mocked environment.
 *
 * Accepts the same parameters as the real function but performs no registration or side effects.
 *
 * @param string $tag The name of the action to hook the $callback to.
 * @param callable|string $callback The callback to be executed when the action is triggered.
 * @param int $priority Optional. Used to specify the order in which the functions associated with a particular action are executed. Default 10.
 * @param int $accepted_args Optional. The number of arguments the callback accepts. Default 1.
 */
function add_action($tag, $callback, $priority = 10, $accepted_args = 1) {}
/**
 * Registers a filter hook for a given tag — no-op stub in this mock environment.
 *
 * This function mirrors WordPress's add_filter signature but performs no action here.
 *
 * @param string $tag The name of the filter hook.
 * @param callable|string $callback The callback to be executed when the filter is applied.
 * @param int $priority Priority at which the function should be executed (lower numbers run earlier).
 * @param int $accepted_args Number of arguments the callback accepts.
 */
function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) {}
/**
 * No-op replacement of WordPress's wp_enqueue_script used in the test harness.
 *
 * Intentionally performs no action; present to allow code that enqueues scripts to run without side effects.
 */
function wp_enqueue_script() {}
/**
 * No-op replacement for WordPress's wp_enqueue_style used to mock/enqueue styles in the test environment.
 *
 * This stub intentionally performs no action and exists to satisfy calls to wp_enqueue_style during benchmarking and tests.
 */
function wp_enqueue_style() {}
/**
 * Return the provided URL unchanged.
 *
 * @param string $url The URL to return.
 * @return string The same URL that was passed in.
 */
function esc_url($url) { return $url; }

/**
 * Check whether a given file path corresponds to a mocked manifest file.
 *
 * Increments the global $stats['file_exists'] counter as a side effect and
 * simulates existence for any path containing "manifest.json".
 *
 * @param string $path The file path to check.
 * @return bool `true` if the path contains "manifest.json", `false` otherwise.
 */
function mock_file_exists($path) {
    global $stats;
    $stats['file_exists']++;
    // Simulate manifest exists at path 2
    return strpos($path, 'manifest.json') !== false;
}

/**
 * Return a fixed file modification timestamp and increment the filemtime statistic.
 *
 * This mock simulates retrieving a file's modification time by always returning the same
 * timestamp and incrementing the global $stats['filemtime'] counter as a side effect.
 *
 * @param string $path The file path to query (ignored by this mock).
 * @return int The fixed UNIX timestamp 1234567890.
 */
function mock_filemtime($path) {
    global $stats;
    $stats['filemtime']++;
    return 1234567890;
}

/**
 * Provide a fixed Vite manifest JSON string for testing.
 *
 * @param string $path The file path to read (ignored; function always returns the same test manifest).
 * @return string A JSON-encoded manifest mapping `src/main.tsx` to `assets/main.js`.
 */
function mock_file_get_contents($path) {
    return json_encode(['src/main.tsx' => ['file' => 'assets/main.js']]);
}

class DJZ_Vite_Loader_Original {
    private $manifest = null;
    private $dist_path = '/tmp';

    /**
     * Loads the Vite manifest into the object's manifest property from cache or disk.
     *
     * Checks candidate manifest paths and tries to reuse a cached manifest identified by a cache key derived from the path.
     * If a cached entry exists and its stored mtime equals the file's current mtime (and is non-zero), the cached `data` is assigned to `$this->manifest`.
     * Otherwise the manifest is read from disk and cached along with its mtime, and `$this->manifest` is updated.
     *
     * Side effects:
     * - Sets `$this->manifest`.
     * - Writes a transient cache entry for the manifest when the cached entry is missing or stale.
     */
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

    /**
     * Loads the Vite manifest into $this->manifest using a transient cache or the dist manifest file.
     *
     * If a cached manifest exists in transients, assigns its data to $this->manifest; otherwise, if a manifest file is present,
     * loads a manifest value and stores it in the transient cache.
     */
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