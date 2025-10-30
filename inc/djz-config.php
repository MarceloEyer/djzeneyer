<?php
/**
 * DJ Zen Eyer - Helper Functions (v1.1.0 SECURITY FIXED)
 * 🛠️ Funções auxiliares para acessar configurações globais
 * 
 * @package DJZenEyerTheme
 * @version 1.1.0
 * @updated 2025-10-30 @ 15:32 UTC
 * @author DJ Zen Eyer Team
 * 
 * =====================================================
 * 📝 FUNÇÕES DISPONÍVEIS:
 * =====================================================
 * 
 * djz_config($key, $default)          → Pega qualquer config
 * djz_social_urls()                   → Array de URLs sociais (Schema.org)
 * djz_og_image($post_id)              → Open Graph image otimizada
 * djz_meta_description($post_id)      → Meta description SEO
 * djz_canonical_url()                 → Canonical URL correto
 * djz_allowed_origins()               → CORS allowed origins
 * djz_theme_color($name)              → Cor do tema
 * djz_contact($field)                 → Info de contato
 * djz_feature_enabled($feature)       → Checa se feature está ativa
 * djz_seo_title()                     → Título SEO dinâmico
 * djz_ai_context()                    → Contexto para IA
 * djz_ai_tags()                       → Tags para IA (novo)
 * djz_ai_summary()                    → Summary para IA (novo)
 * djz_schema_org()                    → Schema.org JSON-LD completo
 * djz_schema_music_recording()        → Schema MusicRecording (novo)
 * djz_lang_url($lang)                 → URL traduzida (novo)
 * djz_spotify_embed($track_id)        → Spotify embed seguro (FIXED XSS)
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
 * Retorna URL de qualquer asset de imagem (FIXED v1.1)
 * Agora com validação e fallback melhorado
 */
function djz_image($name = 'favicon') {
    $path = djz_config("images.{$name}");
    
    if (!$path) {
        // Log de aviso em debug
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("[DJZeneyer] Missing image config: images.{$name}");
        }
        // Fallback seguro: favicon padrão
        return esc_url(get_template_directory_uri() . '/dist/favicon.svg');
    }
    
    return esc_url(get_template_directory_uri() . $path);
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
 * Retorna canonical URL correto com validação
 */
function djz_canonical_url() {
    $url = '';
    
    if (is_front_page()) {
        $url = home_url('/');
    } elseif (is_singular()) {
        $url = get_permalink();
    } elseif (is_category() || is_tag() || is_tax()) {
        $url = get_term_link(get_queried_object());
        // Verifica se get_term_link retornou erro
        if (is_wp_error($url)) {
            $url = home_url('/');
        }
    } else {
        $url = home_url('/');
    }
    
    return esc_url($url);
}

/**
 * Retorna título SEO otimizado
 */
function djz_seo_title() {
    $site_name = djz_config('site.name');
    $tagline = djz_config('site.tagline');
    
    if (is_front_page()) {
        return $site_name . ' | ' . $tagline;
    }
    if (is_singular()) {
        return get_the_title() . ' | ' . $site_name;
    }
    if (is_category() || is_tag() || is_tax()) {
        return single_term_title('', false) . ' | ' . $site_name;
    }
    return $site_name;
}

/**
 * Retorna meta keywords (comma-separated)
 */
function djz_meta_keywords() {
    return esc_attr(djz_config('site.keywords', ''));
}

/* =====================================================
 * 🎨 THEME COLORS
 * ===================================================== */

/**
 * Retorna cor do tema com validação
 */
function djz_theme_color($name = 'primary') {
    $color = djz_config("colors.{$name}", '#0A0E27');
    
    // Valida se é cor hex válida
    if (preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
        return $color;
    }
    
    return '#0A0E27'; // Fallback seguro
}

/**
 * Retorna CSS inline de cores (para <style>)
 */
function djz_theme_colors_css() {
    $colors = djz_config('colors', []);
    $css = ':root {';
    foreach ($colors as $name => $value) {
        if (preg_match('/^[a-z-]+$/', $name) && preg_match('/^#/', $value)) {
            $css .= "--color-{$name}:{$value};";
        }
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
 * Retorna link mailto formatado e seguro
 */
function djz_contact_email($type = 'email') {
    $email = djz_contact($type);
    
    if (!$email || !is_email($email)) {
        return '';
    }
    
    return 'mailto:' . esc_attr($email);
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
 * 🤖 AI & CONTEXT HELPERS (NEW v1.1)
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
 * Retorna summary para IA (NEW)
 */
function djz_ai_summary() {
    $summary = djz_config('ai.context');
    return esc_attr($summary ?? get_bloginfo('description'));
}

/* =====================================================
 * 📐 SCHEMA.ORG (Structured Data)
 * ===================================================== */

/**
 * Retorna dados estruturados completos (Schema.org)
 * Uso: echo wp_json_encode(djz_schema_org());
 * 
 * FIXED v1.1:
 * - Validação null check para get_the_ID()
 * - Validação canonical URL
 * - Sanitização de contextos
 */
function djz_schema_org() {
    $post_id = (is_singular() && get_the_ID()) ? get_the_ID() : null;
    $canonical = djz_canonical_url();
    
    // Validação: canonical nunca deve ser vazio
    if (!$canonical) {
        $canonical = home_url('/');
    }
    
    return [
        '@context' => 'https://schema.org',
        '@graph' => [
            // Person / Musician
            [
                '@type' => djz_config('schema.type', 'Person'),
                '@id' => esc_url(home_url() . '#person'),
                'name' => djz_config('site.name'),
                'url' => esc_url(home_url()),
                'sameAs' => djz_social_urls(),
                'jobTitle' => djz_config('schema.job_title'),
                'description' => djz_config('site.description'),
                'nationality' => djz_config('schema.nationality'),
                'genre' => djz_config('schema.genre', []),
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
                '@id' => esc_url(home_url() . '#website'),
                'url' => esc_url(home_url()),
                'name' => djz_config('site.name'),
                'description' => djz_config('site.description'),
                'inLanguage' => djz_config('site.language', 'pt-BR'),
                'publisher' => ['@id' => esc_url(home_url() . '#person')],
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
                '@id' => esc_url($canonical . '#webpage'),
                'url' => esc_url($canonical),
                'name' => $post_id ? get_the_title($post_id) : djz_config('site.name'),
                'description' => djz_meta_description($post_id),
                'datePublished' => $post_id && is_single() ? get_the_date('c', $post_id) : get_option('gmt_offset'),
                'dateModified' => $post_id && is_single() ? get_the_modified_date('c', $post_id) : current_time('c'),
                'isPartOf' => ['@id' => esc_url(home_url() . '#website')],
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

/**
 * Retorna Schema MusicRecording para posts de música (NEW)
 */
function djz_schema_music_recording() {
    if (!is_single()) {
        return [];
    }
    
    $post_id = get_the_ID();
    
    return [
        '@context' => 'https://schema.org',
        '@type' => 'MusicRecording',
        'name' => esc_attr(get_the_title($post_id)),
        'url' => esc_url(get_permalink($post_id)),
        'description' => esc_attr(djz_meta_description($post_id)),
        'datePublished' => get_the_date('c', $post_id),
        'inLanguage' => djz_config('site.language', 'pt-BR'),
        'byArtist' => [
            '@type' => 'Person',
            'name' => djz_config('site.name'),
            'url' => esc_url(home_url()),
            'image' => djz_og_image()
        ]
    ];
}

/* =====================================================
 * 🌍 INTERNATIONALIZATION (NEW)
 * ===================================================== */

/**
 * Retorna URL traduzida para idioma específico (NEW)
 */
function djz_lang_url($lang = 'pt') {
    // Mapear idiomas para URLs
    $lang_map = [
        'pt' => home_url('/pt-br/'),
        'en' => home_url('/en/'),
        'es' => home_url('/es/'),
    ];
    
    return esc_url($lang_map[$lang] ?? home_url('/'));
}

/* =====================================================
 * 🎵 MUSIC PLAYER (FIXED v1.1 - XSS Protection)
 * ===================================================== */

/**
 * Retorna Spotify embed code seguro (FIXED v1.1 - XSS Protection)
 * 
 * MUDANÇAS:
 * - Sanitização de track_id com regex
 * - Duplo escaping para URL e atributos
 * - Tratamento de erro melhorado
 * - Title accessibility adicionado
 */
function djz_spotify_embed($track_id, $type = 'track') {
    // Verificação de feature flag
    if (!djz_feature_enabled('player') || !djz_config('player.spotify_embed')) {
        return '';
    }
    
    // Tipos válidos de embed
    $types = ['track', 'album', 'playlist', 'artist'];
    $type = in_array($type, $types, true) ? $type : 'track';
    
    // SEGURANÇA: Sanitizar track_id - apenas alfanuméricos
    $track_id = sanitize_key($track_id);
    if (!preg_match('/^[a-zA-Z0-9]+$/', $track_id)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("[DJZeneyer] Invalid Spotify track ID: " . var_export($track_id, true));
        }
        return '';
    }
    
    // Construir URL segura
    $base_url = 'https://open.spotify.com/embed/' . esc_attr($type) . '/' . esc_attr($track_id);
    
    // Retornar iframe com escaping completo
    return sprintf(
        '<iframe src="%s" width="100%%" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media" loading="lazy" title="%s"></iframe>',
        esc_attr($base_url),
        esc_attr('Spotify ' . ucfirst($type))
    );
}

/**
 * Retorna SoundCloud embed code (auxiliar)
 */
function djz_soundcloud_embed($track_url) {
    if (!djz_config('player.soundcloud_embed')) {
        return '';
    }
    
    // SoundCloud oferece embed seguro via oEmbed do WordPress
    return wp_oembed_get($track_url);
}

/**
 * Retorna Mixcloud embed code (auxiliar)
 */
function djz_mixcloud_embed($mix_url) {
    if (!djz_config('player.mixcloud_embed')) {
        return '';
    }
    
    return wp_oembed_get($mix_url);
}

/**
 * Retorna YouTube embed code (auxiliar)
 */
function djz_youtube_embed($video_id) {
    if (!djz_config('player.youtube_embed')) {
        return '';
    }
    
    // Sanitizar video ID
    $video_id = sanitize_key($video_id);
    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $video_id)) {
        return '';
    }
    
    return sprintf(
        '<iframe width="100%%" height="380" src="https://www.youtube.com/embed/%s" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>',
        esc_attr($video_id)
    );
}

/* =====================================================
 * 📚 UTILITY HELPERS
 * ===================================================== */

/**
 * Valida se um valor é um URL válido
 */
function djz_is_valid_url($url) {
    return (bool) filter_var($url, FILTER_VALIDATE_URL);
}

/**
 * Retorna primeira categoria do post
 */
function djz_get_first_category($post_id = null) {
    $post_id = $post_id ?? get_the_ID();
    $categories = get_the_category($post_id);
    
    if (!empty($categories)) {
        return $categories[0];
    }
    
    return null;
}

/**
 * Retorna tempo de leitura estimado em minutos
 */
function djz_reading_time($post_id = null) {
    $post_id = $post_id ?? get_the_ID();
    $content = get_post_field('post_content', $post_id);
    $word_count = str_word_count(strip_tags($content));
    $reading_time = ceil($word_count / 200); // 200 palavras por minuto
    
    return max(1, $reading_time);
}
