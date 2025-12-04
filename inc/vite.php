<?php
/**
 * inc/vite.php
 * Integração WordPress + React (Vite v5 Compatible)
 */

if (!defined('ABSPATH')) exit;

// Constantes de Configuração
define('VITE_SERVER', 'http://localhost:5173');
define('VITE_ENTRY_POINT', 'index.html'); // Vite 5 usa o HTML como chave principal
define('DIST_PATH', get_template_directory() . '/dist');
define('DIST_URI', get_template_directory_uri() . '/dist');

/**
 * 1. Helper para ler o manifesto do Vite
 */
function djz_get_manifest(): array {
    // Tenta o caminho padrão do Vite 5 (.vite/manifest.json)
    $manifest_path = DIST_PATH . '/.vite/manifest.json';
    
    // Fallback para Vite 4 (raiz da dist)
    if (!file_exists($manifest_path)) {
        $manifest_path = DIST_PATH . '/manifest.json';
    }

    if (file_exists($manifest_path)) {
        return json_decode(file_get_contents($manifest_path), true);
    }

    return [];
}

/**
 * 2. Enfileira os Scripts e Estilos
 */
add_action('wp_enqueue_scripts', function () {
    $manifest = djz_get_manifest();
    $entry = null;

    // Tenta encontrar a entrada principal (index.html)
    if (isset($manifest[VITE_ENTRY_POINT])) {
        $entry = $manifest[VITE_ENTRY_POINT];
    } 
    // Fallback: Tenta src/main.tsx se index.html falhar
    elseif (isset($manifest['src/main.tsx'])) {
        $entry = $manifest['src/main.tsx'];
    }

    if (!$entry) {
        // Se não achou nada (provavelmente ambiente local sem build), não faz nada
        // Em dev, você deve rodar o servidor Vite localmente.
        return;
    }

    // A. Carrega CSS do Build - Deletado para carregar apenas no main.tsx

    // B. Carrega JS Principal
    if (isset($entry['file'])) {
        wp_enqueue_script(
            'djzeneyer-react',
            DIST_URI . '/' . $entry['file'],
            [],
            null,
            true
        );

        // C. Injeta Imports Dinâmicos (Preload para performance)
        if (isset($entry['imports']) && is_array($entry['imports'])) {
            foreach ($entry['imports'] as $import_key) {
                if (isset($manifest[$import_key]['file'])) {
                    $preload_uri = DIST_URI . '/' . $manifest[$import_key]['file'];
                    add_action('wp_head', function() use ($preload_uri) {
                        echo '<link rel="modulepreload" href="' . esc_url($preload_uri) . '">' . PHP_EOL;
                    });
                }
            }
        }
    }

    // D. Passa Dados do WordPress para o React (CRÍTICO PARA LOGIN)
    // Mantive sua lógica original aqui, pois ela estava perfeita.
    wp_localize_script('djzeneyer-react', 'wpData', [
        'siteUrl'        => esc_url(home_url('/')),
        'restUrl'        => esc_url_raw(rest_url()),
        'nonce'          => wp_create_nonce('wp_rest'),
        'themeUrl'       => get_template_directory_uri(),
        'isUserLoggedIn' => is_user_logged_in(),
        'currentUser'    => is_user_logged_in() ? [
            'id'    => get_current_user_id(),
            'name'  => wp_get_current_user()->display_name,
            'email' => wp_get_current_user()->user_email,
        ] : null,
    ]);
});

/**
 * 3. Adiciona type="module" aos scripts
 */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        return sprintf(
            '<script type="module" src="%s" id="%s" defer></script>',
            esc_url($src),
            esc_attr($handle . '-js')
        );
    }
    return $tag;
}, 10, 3);