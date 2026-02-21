<?php
/**
 * Vite Integration Module (Production Ready)
 * Carrega os scripts e estilos gerados pelo Vite (React)
 * @version 3.2.0 (Hash Fix + CSP Nonce Support)
 */

if (!defined('ABSPATH')) exit;

class DJZ_Vite_Loader {

    private $manifest = null;
    private $dist_path = null;
    private $dist_url = null;

    public function __construct() {
        // Prioridade 20 para rodar depois dos enqueues padrões
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 20);
        add_filter('script_loader_tag', [$this, 'add_module_type'], 10, 3);
    }

    private function get_dist_path() {
        if ($this->dist_path === null) {
            $this->dist_path = get_theme_file_path('/dist');
        }
        return $this->dist_path;
    }

    private function get_dist_url() {
        if ($this->dist_url === null) {
            $this->dist_url = get_template_directory_uri() . '/dist';
        }
        return $this->dist_url;
    }

    private function load_manifest() {
        $dist_path = $this->get_dist_path();
        $paths = [
            $dist_path . '/.vite/manifest.json',
            $dist_path . '/manifest.json'
        ];

        foreach ($paths as $path) {
            if (file_exists($path)) {
                $cache_key = 'djz_vite_manifest_v2_' . md5($path);
                $cached    = get_transient($cache_key);

                // Check cache validity (Mtime check to be safe, though transient logic should handle hit/miss)
                // However, we need to compare current file mtime to cached mtime to invalidate on deployment.
                // To do this without reading the file content, we normally need filemtime.
                // But the instruction says: "Race Condition... Ler mtime APÓS ler o conteúdo".
                // If we read content every time to avoid race condition, we defeat the purpose of caching (IO reduction).
                // Let's optimize: check mtime first for cache hit. If hit, good.
                // If miss, read content, then read mtime again to store.

                $mtime = filemtime($path);
                if ($mtime === false) $mtime = 0;

                if (
                    is_array($cached) &&
                    isset($cached['mtime'], $cached['data']) &&
                    $cached['mtime'] === $mtime &&
                    $mtime !== 0 // Force refresh if mtime is broken/0 to be safe or rely on short cache
                ) {
                    $this->manifest = $cached['data'];
                    return;
                }

                // Cache Miss or Stale: Read file
                $content = file_get_contents($path);

                if ($content !== false) {
                    // Re-read mtime after content read to reduce race condition window for the stored cache entry
                    $mtime_post_read = filemtime($path);
                    if ($mtime_post_read === false) $mtime_post_read = 0;

                    $data = json_decode($content, true);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        $this->manifest = $data;

                        // Timeout shorter if mtime failed
                        $cache_duration = ($mtime_post_read === 0) ? 5 * MINUTE_IN_SECONDS : 7 * DAY_IN_SECONDS;

                        set_transient($cache_key, [
                            'path'  => $path,
                            'mtime' => $mtime_post_read,
                            'data'  => $data
                        ], $cache_duration);
                    } else {
                        error_log('DJZ Vite: JSON Decode Error in ' . $path . ': ' . json_last_error_msg());
                        // File exists but is invalid. Stop trying other paths?
                        // If one exists, it's the one.
                        return;
                    }
                } else {
                    error_log('DJZ Vite: Failed to read manifest file: ' . $path);
                    return;
                }

                return;
            }
        }
    }

    /**
     * Get manifest data, lazy-loading if necessary
     */
    private function get_manifest() {
        // Prevent infinite retry loops using null sentinel
        if ($this->manifest !== null) {
            return $this->manifest;
        }

        $this->load_manifest();

        // If still null after attempt, mark as empty array to prevent retries
        if ($this->manifest === null) {
            $this->manifest = [];
        }

        return $this->manifest;
    }

    public function enqueue_assets() {
        // Dev Mode
        if (defined('DJZ_IS_DEV') && DJZ_IS_DEV) {
            wp_enqueue_script('vite-client', 'http://localhost:5173/@vite/client', [], null, true);
            wp_enqueue_script('vite-main', 'http://localhost:5173/src/main.tsx', [], null, true);
            return;
        }

        $manifest = $this->get_manifest();
        if (empty($manifest)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('DJZ Vite: Manifest is empty or failed to load.');
            }
            return;
        }

        $entry = $manifest['index.html'] ?? $manifest['src/main.tsx'] ?? null;
        if (!$entry) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('DJZ Vite: Entry point (index.html or src/main.tsx) not found in manifest.');
            }
            return;
        }

        $dist_url = $this->get_dist_url();

        // 1. JS
        if (!empty($entry['file'])) {
            wp_enqueue_script('djz-react-main', $dist_url . '/' . $entry['file'], [], null, true);
        }

        // 2. CSS (Com Hash MD5)
        if (!empty($entry['css'])) {
            foreach ($entry['css'] as $css_file) {
                wp_enqueue_style('djz-react-style-' . md5($css_file), $dist_url . '/' . $css_file, [], null);
            }
        }

        // 3. Preloads
        add_action('wp_head', function() use ($entry, $manifest, $dist_url) {
            if (!empty($entry['file'])) {
                echo '<link rel="modulepreload" href="' . esc_url($dist_url . '/' . $entry['file']) . '" />' . "\n";
            }
            if (!empty($entry['imports'])) {
                foreach ($entry['imports'] as $import_key) {
                    if (isset($manifest[$import_key]['file'])) {
                        $chunk_url = $dist_url . '/' . $manifest[$import_key]['file'];
                        echo '<link rel="modulepreload" href="' . esc_url($chunk_url) . '" />' . "\n";
                    }
                }
            }
        }, 1);

        // 4. Variáveis Globais (COM PROTEÇÃO CSP NONCE)
        add_action('wp_footer', function() {
            // Pega o Nonce gerado pelo inc/csp.php
            $nonce = !empty($GLOBALS['DJZ_CSP_NONCE']) ? $GLOBALS['DJZ_CSP_NONCE'] : '';
            ?>
            <script<?php echo $nonce ? ' nonce="' . esc_attr($nonce) . '"' : ''; ?>>
                window.wpData = {
                    rootUrl: "<?php echo esc_url(home_url('/')); ?>",
                    restUrl: "<?php echo esc_url(rest_url()); ?>",
                    nonce: "<?php echo wp_create_nonce('wp_rest'); ?>",
                    userId: <?php echo get_current_user_id(); ?>,
                    themeUrl: "<?php echo esc_url(get_template_directory_uri()); ?>"
                };
            </script>
            <?php
        }, 1);
    }

    /**
     * Injeção Robusta de Module + Crossorigin
     */
    public function add_module_type($tag, $handle, $src) {
        if ($handle === 'djz-react-main' || strpos($handle, 'vite') !== false) {
            $out = $tag;

            if (strpos($out, 'type=') === false) {
                $out = preg_replace('/<script\b/i', '<script type="module"', $out, 1);
            } else {
                $out = preg_replace('/type=("|\')text\/javascript("|\')/i', 'type="module"', $out);
            }

            if (stripos($out, 'crossorigin') === false) {
                $out = preg_replace('/<script\b/i', '<script crossorigin="anonymous"', $out, 1);
            }

            return $out;
        }
        return $tag;
    }
}

// Singleton-like guard: Ensure we don't instantiate twice if file is included multiple times
if (!isset($GLOBALS['djz_vite_loader'])) {
    $GLOBALS['djz_vite_loader'] = new DJZ_Vite_Loader();
}