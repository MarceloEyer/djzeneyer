<?php
/**
 * Vite Integration Module (Production Ready)
 * Carrega os scripts e estilos gerados pelo Vite (React)
 * @version 3.2.0 (Hash Fix + CSP Nonce Support)
 */

if (!defined('ABSPATH')) exit;

class DJZ_Vite_Loader {

    private $manifest = [];
    private $dist_path;
    private $dist_url;

    public function __construct() {
        // Prioridade 20 para rodar depois dos enqueues padrões
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 20);
        add_filter('script_loader_tag', [$this, 'add_module_type'], 10, 3);

        $this->dist_path = get_theme_file_path('/dist');
        $this->dist_url  = get_template_directory_uri() . '/dist';

        $this->load_manifest();
    }

    private function load_manifest() {
        $paths = [
            $this->dist_path . '/.vite/manifest.json',
            $this->dist_path . '/manifest.json'
        ];

        $cache_key = 'djz_vite_manifest_v2';
        $cached    = get_transient($cache_key);

        foreach ($paths as $path) {
            if (file_exists($path)) {
                $mtime = filemtime($path);

                // Defensive handling if filemtime fails
                if ($mtime === false) {
                    $mtime = 0;
                }

                // Check cache validity (Path match + Mtime match)
                if (
                    is_array($cached) &&
                    isset($cached['path'], $cached['mtime'], $cached['data']) &&
                    $cached['path'] === $path &&
                    $cached['mtime'] === $mtime
                ) {
                    $this->manifest = $cached['data'];
                    return;
                }

                // Cache Miss or Stale: Read file
                $content = file_get_contents($path);

                if ($content !== false) {
                    $data = json_decode($content, true);

                    if (json_last_error() === JSON_ERROR_NONE) {
                        $this->manifest = $data;
                        set_transient($cache_key, [
                            'path'  => $path,
                            'mtime' => $mtime,
                            'data'  => $data
                        ], 7 * DAY_IN_SECONDS);
                    } else {
                        error_log('DJZ Vite: JSON Decode Error in ' . $path . ': ' . json_last_error_msg());
                    }
                }

                return;
            }
        }
    }

    public function enqueue_assets() {
        // Dev Mode
        if (defined('DJZ_IS_DEV') && DJZ_IS_DEV) {
            wp_enqueue_script('vite-client', 'http://localhost:5173/@vite/client', [], null, true);
            wp_enqueue_script('vite-main', 'http://localhost:5173/src/main.tsx', [], null, true);
            return;
        }

        if (empty($this->manifest)) return;

        $entry = $this->manifest['index.html'] ?? $this->manifest['src/main.tsx'] ?? null;
        if (!$entry) return;

        // 1. JS
        if (!empty($entry['file'])) {
            wp_enqueue_script('djz-react-main', $this->dist_url . '/' . $entry['file'], [], null, true);
        }

        // 2. CSS (Com Hash MD5)
        if (!empty($entry['css'])) {
            foreach ($entry['css'] as $css_file) {
                wp_enqueue_style('djz-react-style-' . md5($css_file), $this->dist_url . '/' . $css_file, [], null);
            }
        }

        // 3. Preloads
        add_action('wp_head', function() use ($entry) {
            if (!empty($entry['file'])) {
                echo '<link rel="modulepreload" href="' . esc_url($this->dist_url . '/' . $entry['file']) . '" />' . "\n";
            }
            if (!empty($entry['imports'])) {
                foreach ($entry['imports'] as $import_key) {
                    if (isset($this->manifest[$import_key]['file'])) {
                        $chunk_url = $this->dist_url . '/' . $this->manifest[$import_key]['file'];
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

new DJZ_Vite_Loader();