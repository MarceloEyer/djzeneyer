<?php
/**
 * Vite Integration Module (Production Ready)
 * Carrega os scripts e estilos gerados pelo Vite (React)
 * @version 3.1.0 (Hash Fix + Robust Module)
 */

if (!defined('ABSPATH')) exit;

class DJZ_Vite_Loader {

    private $manifest = [];
    private $dist_path;
    private $dist_url;

    public function __construct() {
        // Use priority 20 to ensure we run after standard enqueues
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 20);
        add_filter('script_loader_tag', [$this, 'add_module_type'], 10, 3);

        $this->dist_path = get_theme_file_path('/dist');
        $this->dist_url  = get_template_directory_uri() . '/dist';

        // Load manifest
        $this->load_manifest();
    }

    private function load_manifest() {
        // Vite 5+ uses .vite/manifest.json usually, but sometimes root dist/manifest.json
        // Check both locations
        $paths = [
            $this->dist_path . '/.vite/manifest.json',
            $this->dist_path . '/manifest.json'
        ];

        foreach ($paths as $path) {
            if (file_exists($path)) {
                $this->manifest = json_decode(file_get_contents($path), true);
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

        // Try to find the entry point. It's usually 'index.html' or 'src/main.tsx'
        // depending on your vite.config.js input configuration.
        $entry = $this->manifest['index.html'] ?? $this->manifest['src/main.tsx'] ?? null;

        if (!$entry) return;

        // 1. JS
        if (!empty($entry['file'])) {
            wp_enqueue_script('djz-react-main', $this->dist_url . '/' . $entry['file'], [], null, true);
        }

        // 2. CSS - Fixed with MD5 hash for unique handles
        if (!empty($entry['css'])) {
            foreach ($entry['css'] as $css_file) {
                wp_enqueue_style('djz-react-style-' . md5($css_file), $this->dist_url . '/' . $css_file, [], null);
            }
        }

        // 3. Preloads (Optional but good for performance)
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

        // 4. Global Variables (Replaces wp_localize_script for cleaner object injection)
        add_action('wp_footer', function() {
            ?>
            <script>
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
     * Robust Module Type Injection
     * Preserves existing attributes (like nonce) and adds type="module" + crossorigin
     */
    public function add_module_type($tag, $handle, $src) {
        if ($handle === 'djz-react-main' || strpos($handle, 'vite') !== false) {
            $out = $tag;

            // Inject type="module" if missing
            if (strpos($out, 'type=') === false) {
                $out = preg_replace('/<script\b/i', '<script type="module"', $out, 1);
            } else {
                $out = preg_replace('/type=("|\')text\/javascript("|\')/i', 'type="module"', $out);
            }

            // Inject crossorigin if missing
            if (stripos($out, 'crossorigin') === false) {
                $out = preg_replace('/<script\b/i', '<script crossorigin="anonymous"', $out, 1);
            }

            return $out;
        }
        return $tag;
    }
}

new DJZ_Vite_Loader();