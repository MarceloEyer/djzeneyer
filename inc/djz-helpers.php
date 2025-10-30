<?php
/**
 * DJ Zen Eyer - Helper Functions
 * 🛠️ Funções auxiliares para acessar configurações globais
 * 
 * @package DJZenEyerTheme
 * @version 1.0.0
 * @created 2025-10-30
 * @author DJ Zen Eyer Team
 * 
 * =====================================================
 * 📝 FUNÇÕES DISPONÍVEIS:
 * =====================================================
 * 
 * djz_config($key, $default)         → Pega qualquer config
 * djz_social_urls()                  → Array de URLs sociais (Schema.org)
 * djz_og_image($post_id)             → Open Graph image otimizada
 * djz_meta_description($post_id)     → Meta description SEO
 * djz_canonical_url()                → Canonical URL correto
 * djz_allowed_origins()              → CORS allowed origins
 * djz_theme_color($name)             → Cor do tema
 * djz_contact($field)                → Info de contato
 * djz_feature_enabled($feature)      → Checa se feature está ativa
 */

if (!defined('ABSPATH')) exit;

/* =====================================================
 * 🎯 CORE: Carregar Config (Cache otimizado)
 * ===================================================== */
function djz_config($key = null, $default = null) {
    static $config = null;
    
    // Cache: carrega apenas 1x por request
    if ($config === null) {
        $config_file = get_theme_file_path('/inc/djz-config.php');
        $config = file_exists($config_file) ? require $config_file : [];
    }
    
    // Retorna tudo se não especificou chave
    if ($key === null) {
        return $config;
    }
    
    // Suporta dot notation: djz_config('social.instagram')
    $keys = explode('.', $key);
    $value = $config;
    
    foreach ($keys as $k) {
        if (!isset($value[$k])) {
            return $default;
        }
        $value = $value[$k];
    }
    
    return $value;
}

/* =====================================================
 * 🌐 SOCIAL MEDIA
 * ===================================================== */

/**
 * Retorna array de URLs de redes sociais (para Schema.org)
 * Remove campos internos (IDs, handles)
 */
function djz_social_urls() {
    $social = djz_config('social', []);
    
    // Remove campos que não são URLs
    $exclude = ['spotify_id', 'twitter_handle'];
    foreach ($exclude as $key) {
        unset($social[$key]);
    }
    
    // Remove vazios e retorna apenas valores
    return array_values(array_filter($social));
}

/**
 * Retorna URL do perfil social específico
 */
function djz_social_url($platform) {
    return djz_config("social.{$platform}", '');
}

/* =====================================================
 * 🖼️ IMAGES & ASSETS
 * ===================================================== */

/**
 * Retorna Open Graph image URL completa
 * Se $post_id tiver thumbnail, usa; senão usa padrão
 */
function djz_og_image($post_id = null) {
    // Se tem post e thumbnail
    if ($post_id && has_post_thumbnail($post_id)) {
        $url = get_the_post_thumbnail_url($post_id, 'large');
        if ($url) return esc_url($url);
    }
    
    // Fallback para imagem padrão
    $default = djz_config('images.og_image');
    return $default ? esc_url(get_template_directory_uri() . $default) : '';
}

/**
 * Retorna URL de qualquer asset de imagem
 */
function djz_image($name) {
    $path = djz_config("images.{$name}");
    return $path ? esc_url(get_template_directory_uri() . $path) : '';
}

/* =====================================================
 * 📝 SEO & META TAGS
 * ===================================================== */

/**
 * Retorna meta description otimizada
 */
function djz_meta_description($post_id = null) {
    // Se tem post com excerpt
    if ($post_id && (is_single($post_id) || is_page($post_id))) {
        $excerpt = get_the_excerpt($post_id);
        if ($excerpt) {
            return esc_attr(wp_strip_all_tags($excerpt));
        }
    }
    
    // Fallback para descrição do site
    return esc_attr(djz_config('site.description', get_bloginfo('description')));
}

/**
 * Retorna canonical URL correto
 */
function djz_canonical_url() {
    if (is_front_page()) {
        return esc_url(home_url('/'));
    }
    if (is_singular()) {
        return esc_url(get_permalink());
    }
    if (is_category() || is_tag() || is_tax()) {
        return esc_url(get_term_link(get_queried_object()));
    }
    return esc_url(home_url('/'));
}

/**
 * Retorna título SEO otimizado
 */
function djz_seo_title() {
    $site_name = djz_config('site.name');
    
    if (is_front_page()) {
        return $site_name . ' | ' . djz_config('site.tagline');
    }
    if (is_singular()) {
        return get_the_title() . ' | ' . $site_name;
    }
    if (is_category() || is_tag() || is_tax()) {
        return single_term_title('', false) . ' | ' . $site_name;
    }
    return $site_name;
}

/* =====================================================
 * 🎨 THEME COLORS
 * ===================================================== */

/**
 * Retorna cor do tema
 */
function djz_theme_color($name = 'primary') {
    return djz_config("colors.{$name}", '#0A0E27');
}

/**
 * Retorna CSS inline de cores (para <style>)
 */
function djz_theme_colors_css() {
    $colors = djz_config('colors', []);
    $css = ':root {';
    foreach ($colors as $name => $value) {
        $css .= "--color-{$name}: {$value};";
    }
    $css .= '}';
    return $css;
}

/* =====================================================
 * 📧 CONTACT INFO
 * ===================================================== */

/**
 * Retorna informação de contato
 */
function djz_contact($field) {
    return djz_config("contact.{$field}", '');
}

/**
 * Retorna link mailto formatado
 */
function djz_contact_email($type = 'email') {
    $email = djz_contact($type);
    return $email ? 'mailto:' . esc_attr($email) : '';
}

/* =====================================================
 * 🔐 CORS & API
 * ===================================================== */

/**
 * Retorna array de allowed origins (CORS)
 */
function djz_allowed_origins() {
    return djz_config('allowed_origins', []);
}

/* =====================================================
 * ⚙️ FEATURES
 * ===================================================== */

/**
 * Checa se uma feature está habilitada
 */
function djz_feature_enabled($feature) {
    return (bool) djz_config("features.{$feature}", false);
}

/* =====================================================
 * 🤖 AI & SCHEMA.ORG HELPERS
 * ===================================================== */

/**
 * Retorna contexto para IA (meta tag ai:context)
 */
function djz_ai_context() {
    return esc_attr(djz_config('ai.context', ''));
}

/**
 * Retorna tags para IA (comma-separated)
 */
function djz_ai_tags() {
    $tags = djz_config('ai.tags', []);
    return esc_attr(implode(', ', $tags));
}

/**
 * Retorna dados estruturados completos (Schema.org)
 * Uso: echo wp_json_encode(djz_schema_org());
 */
function djz_schema_org() {
    $post_id = is_singular() ? get_the_ID() : null;
    
    return [
        '@context' => 'https://schema.org',
        '@graph' => [
            // Person
            [
                '@type' => djz_config('schema.type'),
                '@id' => home_url() . '#person',
                'name' => djz_config('site.name'),
                'url' => home_url(),
                'sameAs' => djz_social_urls(),
                'jobTitle' => djz_config('schema.job_title'),
                'description' => djz_config('site.description'),
                'nationality' => djz_config('schema.nationality'),
                'genre' => djz_config('schema.genre'),
                'image' => [
                    '@type' => 'ImageObject',
                    'url' => djz_og_image(),
                    'width' => 1200,
                    'height' => 630
                ]
            ],
            // WebSite
            [
                '@type' => 'WebSite',
                '@id' => home_url() . '#website',
                'url' => home_url(),
                'name' => djz_config('site.name'),
                'description' => djz_config('site.description'),
                'inLanguage' => djz_config('site.language'),
                'publisher' => ['@id' => home_url() . '#person'],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => [
                        '@type' => 'EntryPoint',
                        'urlTemplate' => home_url() . '?s={search_term_string}'
                    ],
                    'query-input' => 'required name=search_term_string'
                ]
            ],
            // WebPage
            [
                '@type' => 'WebPage',
                '@id' => djz_canonical_url() . '#webpage',
                'url' => djz_canonical_url(),
                'name' => $post_id ? get_the_title($post_id) : djz_config('site.name'),
                'description' => djz_meta_description($post_id),
                'datePublished' => $post_id && is_single() ? get_the_date('c', $post_id) : get_bloginfo('start_date'),
                'dateModified' => $post_id && is_single() ? get_the_modified_date('c', $post_id) : current_time('c'),
                'isPartOf' => ['@id' => home_url() . '#website'],
                'primaryImageOfPage' => [
                    '@type' => 'ImageObject',
                    'url' => djz_og_image($post_id),
                    'width' => 1200,
                    'height' => 630
                ]
            ]
        ]
    ];
}

/* =====================================================
 * 🎵 MUSIC PLAYER
 * ===================================================== */

/**
 * Retorna Spotify embed code
 */
function djz_spotify_embed($track_id, $type = 'track') {
    if (!djz_config('player.spotify_embed')) return '';
    
    $types = ['track', 'album', 'playlist', 'artist'];
    $type = in_array($type, $types) ? $type : 'track';
    
    return '<iframe src="https://open.spotify.com/embed/' . $type . '/' . esc_attr($track_id) . '" 
            width="100%" height="380" frameBorder="0" allowtransparency="true" 
            allow="encrypted-media" loading="lazy"></iframe>';
}
