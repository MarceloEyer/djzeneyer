// ... (seu código atual)

require_once get_theme_file_path('/inc/metaboxes.php');

/**
 * NOTA: SEO removido daqui.
 * Todo o SEO (Sitemap, Schema, Meta Tags) é gerenciado
 * pelo plugin "Zen SEO Lite".
 */

// ═══════════════════════════════════════════════════════════════════════════════
// 🔧 FIX: CANONICAL URL & TITLE TAG SUPPORT
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Garante suporte a tag de título (caso o plugin Zen não esteja fazendo)
function zen_add_title_support() {
    add_theme_support('title-tag');
}
add_action('after_setup_theme', 'zen_add_title_support');

// 2. Força a barra "/" no final das URLs (Canonical Trailing Slash)
function zen_fix_canonical_slash($url) {
    if (is_string($url) && substr($url, -1) !== '/' && !preg_match('/\.[a-z0-9]{2,4}$/i', $url)) {
        return $url . '/';
    }
    return $url;
}
add_filter('wpseo_canonical', 'zen_fix_canonical_slash');
add_filter('rank_math/frontend/canonical', 'zen_fix_canonical_slash');
add_filter('get_canonical_url', 'zen_fix_canonical_slash');