<?php
/**
 * Vite Integration Module (Production Ready)
 * Carrega os scripts e estilos gerados pelo Vite (React)
 * @version 3.0.0 (Manifest Fix)
 */

if (!defined('ABSPATH')) exit;

class DJZ_Vite_Loader {

    private $manifest = [];
    private $dist_path;
    private $dist_url;

    public function __construct() {
        // Define caminhos
        $this->dist_path = get_template_directory() . '/dist';
        $this->dist_url = get_template_directory_uri() . '/dist';

        // Carrega o manifesto se existir (cache na memória)
        $this->load_manifest();

        // Ganchos
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 100);
        add_filter('script_loader_tag', [$this, 'add_module_type'], 10, 3);
    }

    /**
     * Lê o arquivo manifest.json gerado pelo npm run build
     */
    private function load_manifest() {
        // Vite 5 gera o manifesto em dist/.vite/manifest.json
        $manifest_path = $this->dist_path . '/.vite/manifest.json';
        
        // Fallback para Vite 4 ou configurações antigas
        if (!file_exists($manifest_path)) {
            $manifest_path = $this->dist_path . '/manifest.json';
        }

        if (file_exists($manifest_path)) {
            $this->manifest = json_decode(file_get_contents($manifest_path), true);
        }
    }

    /**
     * Enfileira CSS e JS
     */
    public function enqueue_assets() {
        // Em ambiente de desenvolvimento local (não deve acontecer em prod, mas por segurança)
        if (defined('DJZ_IS_DEV') && DJZ_IS_DEV) {
            wp_enqueue_script('vite-client', 'http://localhost:5173/@vite/client', [], null, true);
            wp_enqueue_script('vite-main', 'http://localhost:5173/src/main.tsx', [], null, true);
            return;
        }

        // Se não tiver manifesto, aborta
        if (empty($this->manifest) || !isset($this->manifest['index.html'])) {
            return;
        }

        $entry = $this->manifest['index.html'];

        // 1. Carrega o JavaScript Principal (main.tsx compilado)
        if (!empty($entry['file'])) {
            $js_url = $this->dist_url . '/' . $entry['file'];
            // O 'ver' com time() força o navegador a baixar a versão nova se o cache estiver teimoso
            wp_enqueue_script('djz-react-main', $js_url, [], null, true);
            
            // Injeta dados do WordPress para o React (Nonce, URLs, etc)
            wp_localize_script('djz-react-main', 'wpData', [
                'rootUrl' => home_url('/'),
                'restUrl' => rest_url(), // Garante a URL correta da API
                'nonce'   => wp_create_nonce('wp_rest'), // O CRACHÁ DE SEGURANÇA
                'userId'  => get_current_user_id(),
                'themeUrl'=> get_template_directory_uri()
            ]);
        }

        // 2. Carrega o CSS Principal
        if (!empty($entry['css'])) {
            foreach ($entry['css'] as $css_file) {
                wp_enqueue_style('djz-react-style', $this->dist_url . '/' . $css_file, [], null);
            }
        }
        
        // 3. Carrega Preloads (Performance LCP)
        add_action('wp_head', function() use ($entry) {
            // Preload do script principal
            if (!empty($entry['file'])) {
                echo '<link rel="modulepreload" href="' . esc_url($this->dist_url . '/' . $entry['file']) . '" />' . "\n";
            }
            // Preload dos imports dinâmicos (chunks)
            if (!empty($entry['imports'])) {
                foreach ($entry['imports'] as $import_key) {
                    if (isset($this->manifest[$import_key]['file'])) {
                         $chunk_url = $this->dist_url . '/' . $this->manifest[$import_key]['file'];
                         echo '<link rel="modulepreload" href="' . esc_url($chunk_url) . '" />' . "\n";
                    }
                }
            }
        }, 1);
    }

    /**
     * Adiciona type="module" e crossorigin para o React funcionar
     */
    public function add_module_type($tag, $handle, $src) {
        if ($handle === 'djz-react-main' || strpos($handle, 'vite') !== false) {
            return '<script type="module" src="' . esc_url($src) . '"></script>';
        }
        return $tag;
    }
}

new DJZ_Vite_Loader();