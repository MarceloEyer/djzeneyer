<?php
/**
 * ✅ FUNÇÕES PARA CARREGAR ASSETS (CORRIGIDAS)
 */

function djz_get_manifest() {
    static $manifest = null;
    if ($manifest !== null) {
        return $manifest;
    }
    
    // ✅ CORRIGIDO: Vite gera .vite/manifest.json
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
    } else {
        // Fallback para desenvolvimento
        error_log('⚠️ Manifest não encontrado: ' . $manifest_path);
        $manifest = [];
    }
    
    return $manifest;
}

function djz_get_asset_version() {
    static $version = null;
    if ($version !== null) {
        return $version;
    }
    
    $manifest = djz_get_manifest();
    
    // ✅ CORRIGIDO: Vite usa 'src/main.tsx' como chave
    if (isset($manifest['src/main.tsx']['file'])) {
        $version = substr(md5($manifest['src/main.tsx']['file']), 0, 8);
    } else {
        $version = DJZ_VERSION;
    }
    
    return $version;
}

/* =========================
 * ✅ ENQUEUE SCRIPTS (CORRIGIDO)
 * ========================= */
add_action('wp_enqueue_scripts', function () {
    $manifest = djz_get_manifest();
    
    if (empty($manifest)) {
        error_log('❌ Manifest vazio! Build pode ter falho.');
        return;
    }
    
    // ✅ Vite usa 'src/main.tsx' como entrada
    $entry = $manifest['src/main.tsx'] ?? null;
    
    if (!$entry) {
        error_log('❌ Entry "src/main.tsx" não encontrado no manifest!');
        return;
    }
    
    // ✅ Carregar CSS principal
    if (isset($entry['css']) && is_array($entry['css'])) {
        foreach ($entry['css'] as $index => $css_file) {
            wp_enqueue_style(
                'djzeneyer-react-styles-' . $index,
                get_template_directory_uri() . '/dist/' . $css_file,
                [],
                null // Sem versão, hash já está no nome
            );
        }
    }
    
    // ✅ Carregar JS principal
    wp_enqueue_script(
        'djzeneyer-react',
        get_template_directory_uri() . '/dist/' . $entry['file'],
        [],
        null, // Sem versão, hash já está no nome
        true
    );
    
    // ✅ Dados para o React
    wp_localize_script('djzeneyer-react', 'wpData', [
        'siteUrl' => esc_url(home_url('/')),
        'restUrl' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
        'themeUrl' => get_template_directory_uri(),
        'allowedOrigins' => djz_allowed_origins(),
        'isUserLoggedIn' => is_user_logged_in(),
        'currentUser' => is_user_logged_in() ? [
            'id' => get_current_user_id(),
            'name' => wp_get_current_user()->display_name,
            'email' => wp_get_current_user()->user_email,
        ] : null,
    ]);
});

/* =========================
 * ✅ ADICIONAR ATRIBUTO TYPE="MODULE"
 * ========================= */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        return sprintf(
            '<script type="module" src="%s" id="%s" crossorigin defer></script>',
            esc_url($src),
            esc_attr($handle . '-js')
        );
    }
    return $tag;
}, 10, 3);