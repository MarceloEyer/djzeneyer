<?php
/**
 * Vite Integration
 * Loads React build in production
 */

if (!defined('ABSPATH')) exit;

define('DIST_PATH', get_template_directory() . '/dist');
define('DIST_URI', get_template_directory_uri() . '/dist');

/**
 * Read Vite Manifest
 */
function djz_get_manifest(): array {
    $paths = [
        DIST_PATH . '/.vite/manifest.json',
        DIST_PATH . '/manifest.json',
    ];
    
    foreach ($paths as $path) {
        if (file_exists($path)) {
            return json_decode(file_get_contents($path), true) ?: [];
        }
    }
    
    return [];
}

/**
 * Enqueue React Build
 */
add_action('wp_enqueue_scripts', function() {
    $manifest = djz_get_manifest();
    $entry = $manifest['index.html'] ?? $manifest['src/main.tsx'] ?? null;
    
    if (!$entry) return;
    
    // CSS
    if (!empty($entry['css'])) {
        foreach ($entry['css'] as $i => $css) {
            wp_enqueue_style(
                'djz-react-' . $i,
                DIST_URI . '/' . $css,
                [],
                null
            );
        }
    }
    
    // JS
    if (!empty($entry['file'])) {
        wp_enqueue_script(
            'djz-react',
            DIST_URI . '/' . $entry['file'],
            [],
            null,
            true
        );
        
        // Preload imports
        if (!empty($entry['imports'])) {
            foreach ($entry['imports'] as $import) {
                if (isset($manifest[$import]['file'])) {
                    $url = DIST_URI . '/' . $manifest[$import]['file'];
                    add_action('wp_head', function() use ($url) {
                        echo '<link rel="modulepreload" href="' . esc_url($url) . '">';
                    });
                }
            }
        }
    }
    
    // Pass data to React
    wp_localize_script('djz-react', 'wpData', [
        'siteUrl' => esc_url(home_url('/')),
        'restUrl' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
        'themeUrl' => get_template_directory_uri(),
        'isUserLoggedIn' => is_user_logged_in(),
        'currentUser' => is_user_logged_in() ? [
            'id' => get_current_user_id(),
            'name' => wp_get_current_user()->display_name,
            'email' => wp_get_current_user()->user_email,
        ] : null,
    ]);
});

/**
 * Add type="module" to React script
 */
add_filter('script_loader_tag', function($tag, $handle) {
    if ($handle === 'djz-react') {
        return str_replace('<script ', '<script type="module" ', $tag);
    }
    return $tag;
}, 10, 2);