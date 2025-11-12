<?php
if (!defined('ABSPATH')) exit;

function djz_get_manifest(): array {
    static $manifest = null;
    if ($manifest !== null) return $manifest;
    
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
    } else {
        error_log('⚠️ DJZ Theme: Manifesto Vite não encontrado em ' . $manifest_path);
        $manifest = [];
    }
    return $manifest;
}

add_action('wp_enqueue_scripts', function () {
    $manifest = djz_get_manifest();
    if (empty($manifest)) return;
    
    $entry_key = 'src/main.tsx';
    if (!isset($manifest[$entry_key])) return;
    
    $entry = $manifest[$entry_key];

    // CSS
    if (isset($entry['css']) && is_array($entry['css'])) {
        foreach ($entry['css'] as $index => $css_file) {
            wp_enqueue_style('djz-style-' . $index, get_template_directory_uri() . '/dist/' . $css_file, [], null);
        }
    }
    
    // JS
    wp_enqueue_script('djz-react', get_template_directory_uri() . '/dist/' . $entry['file'], [], null, true);
    
    // Dados para o React
    wp_localize_script('djz-react', 'wpData', [
        'siteUrl' => esc_url(home_url('/')),
        'restUrl' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
        'themeUrl' => get_template_directory_uri(),
        'allowedOrigins' => djz_allowed_origins(), // Usa função do setup.php
        'isUserLoggedIn' => is_user_logged_in(),
        'currentUser' => is_user_logged_in() ? [
            'id' => get_current_user_id(),
            'name' => wp_get_current_user()->display_name,
            'email' => wp_get_current_user()->user_email,
        ] : null,
    ]);
});

add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djz-react' === $handle) {
        return sprintf('<script type="module" src="%s" id="%s" crossorigin="use-credentials" defer></script>', esc_url($src), esc_attr($handle . '-js'));
    }
    return $tag;
}, 10, 3);