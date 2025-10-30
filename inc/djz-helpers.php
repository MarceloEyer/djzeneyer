<?php
/**
 * DJ Zen Eyer - Helper Functions (v1.2.0 SECURITY + PERFORMANCE)
 * 🛠️ Funções auxiliares para acessar configurações globais
 * 
 * @package DJZenEyerTheme
 * @version 1.2.0
 * @updated 2025-10-30 @ 16:41 UTC
 * @author DJ Zen Eyer Team
 * 
 * =====================================================
 * 📝 FUNÇÕES DISPONÍVEIS:
 * =====================================================
 * djz_config($key, $default)          → Pega qualquer config (cached)
 * djz_social_urls()                   → Array de URLs sociais (Schema.org)
 * djz_og_image($post_id)              → Open Graph image otimizada
 * djz_meta_description($post_id)      → Meta description SEO
 * djz_canonical_url()                 → Canonical URL correto
 * djz_allowed_origins()               → CORS allowed origins
 * djz_theme_color($name)              → Cor do tema com validação
 * djz_contact($field)                 → Info de contato segura
 * djz_feature_enabled($feature)       → Checa se feature está ativa
 * djz_seo_title()                     → Título SEO dinâmico
 * djz_ai_context()                    → Contexto para IA
 * djz_ai_tags()                       → Tags para IA
 * djz_schema_org()                    → Schema.org JSON-LD completo
 * djz_schema_music_recording()        → Schema MusicRecording
 * djz_spotify_embed($track_id)        → Spotify embed seguro (FIXED XSS)
 */

if (!defined('ABSPATH')) exit;

/* =====================================================
 * 🎯 CORE: Carregar Config (Cache otimizado v1.2.0)
 * ===================================================== */
function djz_config($key = null, $default = null) {
    static $config = null;
    
    // Cache: carrega apenas 1x por request
    if ($config === null) {
        $config_file = get_theme_file_path('/inc/djz-config.php');
        if (!file_exists($config_file)) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log('[DJZeneyer] Config file not found: ' . $config_file);
            }
            $config = [];
        } else {
            $config = require $config_file;
        }
    }
    
    // Retorna tudo se não especificou chave
    if ($key === null) {
        return $config;
    }
    
    // Suporta dot notation: djz_config('social.instagram')
    $keys = explode('.', $key);
    $value = $config;
    
    foreach ($keys as $k) {
        if (!is_array($value) || !isset($value[$k])) {
            return $default;
        }
        $value = $value[$k];
    }
    
    return $value ?? $default;
}

/* =====================================================
 * 🌐 SOCIAL MEDIA
 * ===================================================== */

/**
 * Retorna array de URLs de redes sociais (para Schema.org)
 * Remove campos internos (IDs, handles)
 * 
 * @return array URLs de redes sociais validadas
 */
function djz_social_urls() {
    $social = djz_config('social', []);
    
    if (!is_array($social)) {
        return [];
    }
    
    // Remove campos que não são URLs
    $exclude = ['spotify_id', 'twitter_handle'];
    foreach ($exclude as $key) {
        unset($social[$key]);
    }
    
    // Filtra apenas URLs válidas e retorna valores
    $urls = array_filter($social, function($url) {
        return !empty($url) && filter_var($url, FILTER_VALIDATE_URL);
    });
    
    return array_values($urls);
}

/**
 * Retorna URL do perfil social específico (com validação)
 * 
 * @param string $platform Nome da plataforma
 * @return string URL validada ou string vazia
 */
function djz_social_url($platform) {
    $url = djz_config("social.{$platform}", '');
    
    // Validar se é URL real
    if (!empty($url) && !filter_var($url, FILTER_VALIDATE_URL)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("[DJZeneyer] Invalid social URL for platform: {$platform}");
        }
        return '';
    }
    
    return esc_url($url);
}

/* =====================================================
 * 🖼️ IMAGES & ASSETS
 * ===================================================== */

/**
 * Retorna Open Graph image URL completa
 * Se $post_id tiver thumbnail, usa; senão usa padrão
 * 
 * @param int $post_id Post ID
 * @return string URL escapada
 */
function djz_og_image($post_id = null) {
    // Se tem post e thumbnail
    if ($post_id && has_post_thumbnail($post_id)) {
        $url = get_the_post_thumbnail_url($post_id, 'large');
        if ($url && filter_var($url, FILTER_VALIDATE_URL)) {
            return esc_url($url);
        }
    }
    
    // Fallback para imagem padrão
    $default = djz_config('images.og_image');
    if (!$default) {
        return '';
    }
    
    return esc_url(get_template_directory_uri() . $default);
}

/**
 * Retorna URL de qualquer asset de imagem com validação
 * 
 * @param string $name Config key do arquivo de imagem
 * @return string URL escapada ou fallback
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
    
    // Sanitizar path (previne directory traversal)
    $path = str_replace('..', '', $path);
    
    return esc_url(get_template_directory_uri() . $path);
}

/* =====================================================
 * 📝 SEO & META TAGS
 * ===================================================== */

/**
 * Retorna meta description otimizada
 * 
 * @param int $post_id Post ID
 * @return string Escapado para atributo HTML
 */
function djz_meta_description($post_id = null) {
    // Se tem post com excerpt
    if ($post_id && (is_single($post_id) || is_page($post_id))) {
        $excerpt = get_the_excerpt($post_id);
        if (!empty($excerpt)) {
            $desc = wp_strip_all_tags($excerpt);
            $desc = mb_strimwidth($desc, 0, 160, '...'); // Máx 160 chars
            return esc_attr($desc);
        }
    }
    
    // Fallback para descrição do site
    $default_desc = djz_config('site.description', get_bloginfo('description'));
    $default_desc = mb_strimwidth($default_desc, 0, 160, '...');
    
    return esc_attr($default_desc);
}

/**
 * Retorna canonical URL correto com validação
 * 
 * @return string URL escapada e validada
 */
function djz_canonical_url() {
    $url = '';
    
    if (is_front_page()) {
        $url = home_url('/');
    } elseif (is_singular()) {
        $url = get_permalink();
        if (!$url) {
            $url = home_url('/');
        }
    } elseif (is_category() || is_tag() || is_tax()) {
        $term = get_queried_object();
        if ($term) {
            $url = get_term_link($term);
            // Verifica se get_term_link retornou erro
            if (is_wp_error($url)) {
                $url = home_url('/');
            }
        } else {
            $url = home_url('/');
        }
    } else {
        $url = home_url('/');
    }
    
    return esc_url($url ?: home_url('/'));
}

/**
 * Retorna título SEO otimizado
 * 
 * @return string Título sem escaping (usado em <title>)
 */
function djz_seo_title() {
    $site_name = djz_config('site.name', get_bloginfo('name'));
    $tagline = djz_config('site.tagline', get_bloginfo('description'));
    
    if (is_front_page()) {
        return $site_name . ' | ' . $tagline;
    }
    
    if (is_singular()) {
        $title = get_the_title();
        return $title ? $title . ' | ' . $site_name : $site_name;
    }
    
    if (is_category() || is_tag() || is_tax()) {
        $term_title = single_term_title('', false);
        return $term_title ? $term_title . ' | ' . $site_name : $site_name;
    }
    
    return $site_name;
}

/**
 * Retorna meta keywords (comma-separated)
 * 
 * @return string Escapado para atributo HTML
 */
function djz_meta_keywords() {
    $keywords = djz_config('site.keywords', '');
    return esc_attr($keywords);
}

/* =====================================================
 * 🎨 THEME COLORS
 * ===================================================== */

/**
 * Retorna cor do tema com validação hex
 * 
 * @param string $name Nome da cor (ex: primary, secondary)
 * @return string Cor hex válida
 */
function djz_theme_color($name = 'primary') {
    $color = djz_config("colors.{$name}", '#0A0E27');
    
    // Valida se é cor hex válida (3 ou 6 dígitos)
    if (preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color)) {
        return $color;
    }
    
    // Log warning e retorna fallback seguro
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log("[DJZeneyer] Invalid color value for: {$name} = {$color}");
    }
    
    return '#0A0E27'; // Fallback seguro
}

/**
 * Retorna CSS inline de cores (para <style> com nonce)
 * 
 * @return string CSS puro (já escapado)
 */
function djz_theme_colors_css() {
    $colors = djz_config('colors', []);
    
    if (!is_array($colors) || empty($colors)) {
        return ':root {}'; // Fallback seguro
    }
    
    $css = ':root {';
    
    foreach ($colors as $name => $value) {
        // Sanitização: apenas nomes com - e valores hex
        if (preg_match('/^[a-z-]+$/', $name) && preg_match('/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $value)) {
            $css .= "--color-{$name}:{$value};";
        }
    }
    
    $css .= '}';
    
    return $css; // Não escapa - vai dentro de <style nonce="">
}

/* =====================================================
 * 📧 CONTACT INFO
 * ===================================================== */

/**
 * Retorna informação de contato (sem escape)
 * 
 * @param string $field Nome do campo
 * @return string Valor do campo
 */
function djz_contact($field) {
    return djz_config("contact.{$field}", '');
}

/**
 * Retorna link mailto formatado e seguro
 * 
 * @param string $type Tipo de contato (email, booking)
 * @return string Link mailto escapado ou string vazia
 */
function djz_contact_email($type = 'email') {
    $email = djz_contact($type);
    
    // Validação: se não é email válido
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
 * Remove valores nulos e valida URLs
 * 
 * @return array URLs de origem permitidas
 */
function djz_allowed_origins() {
    $origins = djz_config('allowed_origins', []);
    
    if (!is_array($origins)) {
        return [];
    }
    
    // Remove nulos e filtra URLs válidas
    $valid_origins = array_filter($origins, function($origin) {
        return !empty($origin) && filter_var($origin, FILTER_VALIDATE_URL);
    });
    
    return array_values($valid_origins);
}

/* =====================================================
 * ⚙️ FEATURES
 * ===================================================== */

/**
 * Checa se uma feature está habilitada (cache optimizado)
 * 
 * @param string $feature Nome da feature
 * @return bool Status da feature
 */
function djz_feature_enabled($feature) {
    return (bool) djz_config("features.{$feature}", false);
}

/* =====================================================
 * 🤖 AI & CONTEXT HELPERS
 * ===================================================== */

/**
 * Retorna contexto para IA (meta tag ai:context)
 * 
 * @return string Escapado para atributo HTML
 */
function djz_ai_context() {
    $context = djz_config('ai.context', '');
    return esc_attr($context);
}

/**
 * Retorna tags para IA (comma-separated)
 * 
 * @return string Tags escapadas
 */
function djz_ai_tags() {
    $tags = djz_config('ai.tags', []);
    
    if (!is_array($tags)) {
        return '';
    }
    
    // Sanitizar cada tag e juntar com vírgula
    $sanitized = array_map('sanitize_text_field', $tags);
    return esc_attr(implode(', ', $sanitized));
}

/**
 * Retorna summary para IA
 * 
 * @return string Summary escapado
 */
function djz_ai_summary() {
    $summary = djz_config('ai.context');
    if (empty($summary)) {
        $summary = get_bloginfo('description');
    }
    return esc_attr($summary);
}

/* =====================================================
 * 📐 SCHEMA.ORG (Structured Data - v1.2.0)
 * ===================================================== */

/**
 * Retorna dados estruturados completos (Schema.org)
 * 
 * FIXOS v1.2.0:
 * - Validação null check para get_the_ID()
 * - Validação canonical URL
 * - Sanitização de contextos
 * - Array type hints
 * 
 * @return array Schema.org estrutura
 */
function djz_schema_org() {
    $post_id = (is_singular() && get_the_ID()) ? (int) get_the_ID() : null;
    $canonical = djz_canonical_url();
    
    // Validação: canonical nunca deve ser vazio
    if (!$canonical) {
        $canonical = esc_url(home_url('/'));
    }
    
    return [
        '@context' => 'https://schema.org',
        '@graph' => [
            // Person / Musician
            [
                '@type' => sanitize_key(djz_config('schema.type', 'Person')),
                '@id' => esc_url(home_url() . '#person'),
                'name' => sanitize_text_field(djz_config('site.name')),
                'url' => esc_url(home_url()),
                'sameAs' => djz_social_urls(),
                'jobTitle' => sanitize_text_field(djz_config('schema.job_title', '')),
                'description' => sanitize_textarea_field(djz_config('site.description', '')),
                'nationality' => sanitize_text_field(djz_config('schema.nationality', 'Brazilian')),
                'genre' => array_map('sanitize_text_field', (array) djz_config('schema.genre', [])),
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
                'name' => sanitize_text_field(djz_config('site.name')),
                'description' => sanitize_textarea_field(djz_config('site.description', '')),
                'inLanguage' => sanitize_key(djz_config('site.language', 'pt-BR')),
                'publisher' => ['@id' => esc_url(home_url() . '#person')],
                'potentialAction' => [
                    '@type' => 'SearchAction',
                    'target' => [
                        '@type' => 'EntryPoint',
                        'urlTemplate' => esc_url(home_url() . '?s={search_term_string}')
                    ],
                    'query-input' => 'required name=search_term_string'
                ]
            ],
            // WebPage
            [
                '@type' => 'WebPage',
                '@id' => esc_url($canonical . '#webpage'),
                'url' => esc_url($canonical),
                'name' => $post_id ? sanitize_text_field(get_the_title($post_id)) : sanitize_text_field(djz_config('site.name')),
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
 * Retorna Schema MusicRecording para posts de música
 * 
 * @return array Schema Music Recording ou array vazio
 */
function djz_schema_music_recording() {
    if (!is_single()) {
        return [];
    }
    
    $post_id = get_the_ID();
    if (!$post_id) {
        return [];
    }
    
    return [
        '@context' => 'https://schema.org',
        '@type' => 'MusicRecording',
        'name' => sanitize_text_field(get_the_title($post_id)),
        'url' => esc_url(get_permalink($post_id)),
        'description' => djz_meta_description($post_id),
        'datePublished' => get_the_date('c', $post_id),
        'inLanguage' => sanitize_key(djz_config('site.language', 'pt-BR')),
        'byArtist' => [
            '@type' => 'Person',
            'name' => sanitize_text_field(djz_config('site.name')),
            'url' => esc_url(home_url()),
            'image' => djz_og_image()
        ]
    ];
}

/* =====================================================
 * 🌍 INTERNATIONALIZATION
 * ===================================================== */

/**
 * Retorna URL traduzida para idioma específico
 * 
 * @param string $lang Código do idioma (pt, en, es)
 * @return string URL escapada
 */
function djz_lang_url($lang = 'pt') {
    // Mapear idiomas para URLs
    $lang_map = [
        'pt' => home_url('/pt-br/'),
        'en' => home_url('/en/'),
        'es' => home_url('/es/'),
    ];
    
    $url = isset($lang_map[$lang]) ? $lang_map[$lang] : home_url('/');
    return esc_url($url);
}

/* =====================================================
 * 🎵 MUSIC PLAYER (FIXED v1.2.0 - XSS Protection)
 * ===================================================== */

/**
 * Retorna Spotify embed code seguro (FIXED v1.2.0 - XSS Protection + Performance)
 * 
 * MUDANÇAS v1.2.0:
 * - Sanitização de track_id com regex + sanitize_key
 * - Duplo escaping para URL e atributos
 * - Tratamento de erro melhorado
 * - Title accessibility adicionado
 * - Performance: antes de verificar feature
 * 
 * @param string $track_id ID ou URL do Spotify
 * @param string $type Tipo (track, album, playlist, artist)
 * @return string iframe HTML escapado ou string vazia
 */
function djz_spotify_embed($track_id, $type = 'track') {
    // Verificação de feature flag PRIMEIRO
    if (!djz_feature_enabled('player') || !djz_config('player.spotify_embed')) {
        return '';
    }
    
    if (empty($track_id)) {
        return '';
    }
    
    // Tipos válidos de embed
    $types = ['track', 'album', 'playlist', 'artist'];
    $type = in_array($type, $types, true) ? $type : 'track';
    
    // SEGURANÇA: Sanitizar track_id - extrai apenas alfanuméricos
    $track_id = preg_replace('/[^a-zA-Z0-9]/', '', sanitize_key($track_id));
    
    if (empty($track_id)) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("[DJZeneyer] Invalid Spotify track ID (empty after sanitization)");
        }
        return '';
    }
    
    if (strlen($track_id) < 15 || strlen($track_id) > 25) {
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log("[DJZeneyer] Invalid Spotify track ID (wrong length): " . strlen($track_id));
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
 * Retorna SoundCloud embed code via oEmbed
 * 
 * @param string $track_url URL do SoundCloud
 * @return string HTML do embed ou string vazia
 */
function djz_soundcloud_embed($track_url) {
    if (!djz_config('player.soundcloud_embed')) {
        return '';
    }
    
    if (empty($track_url) || !filter_var($track_url, FILTER_VALIDATE_URL)) {
        return '';
    }
    
    // SoundCloud oferece embed seguro via oEmbed do WordPress
    $embed = wp_oembed_get($track_url);
    return $embed ?: '';
}

/**
 * Retorna Mixcloud embed code via oEmbed
 * 
 * @param string $mix_url URL do Mixcloud
 * @return string HTML do embed ou string vazia
 */
function djz_mixcloud_embed($mix_url) {
    if (!djz_config('player.mixcloud_embed')) {
        return '';
    }
    
    if (empty($mix_url) || !filter_var($mix_url, FILTER_VALIDATE_URL)) {
        return '';
    }
    
    $embed = wp_oembed_get($mix_url);
    return $embed ?: '';
}

/**
 * Retorna YouTube embed code (seguro)
 * 
 * @param string $video_id Video ID do YouTube
 * @return string iframe HTML ou string vazia
 */
function djz_youtube_embed($video_id) {
    if (!djz_config('player.youtube_embed')) {
        return '';
    }
    
    if (empty($video_id)) {
        return '';
    }
    
    // Sanitizar video ID (apenas alphanum, -, _)
    $video_id = preg_replace('/[^a-zA-Z0-9_-]/', '', sanitize_key($video_id));
    
    if (strlen($video_id) < 10 || strlen($video_id) > 15) {
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
 * 
 * @param string $url URL para validar
 * @return bool True se válido
 */
function djz_is_valid_url($url) {
    return (bool) filter_var($url, FILTER_VALIDATE_URL);
}

/**
 * Retorna primeira categoria do post
 * 
 * @param int $post_id Post ID
 * @return WP_Term|null Primeira categoria ou null
 */
function djz_get_first_category($post_id = null) {
    $post_id = $post_id ?? get_the_ID();
    if (!$post_id) {
        return null;
    }
    
    $categories = get_the_category($post_id);
    return !empty($categories) ? $categories[0] : null;
}

/**
 * Retorna tempo de leitura estimado em minutos
 * 
 * @param int $post_id Post ID
 * @return int Minutos (mínimo 1)
 */
function djz_reading_time($post_id = null) {
    $post_id = $post_id ?? get_the_ID();
    if (!$post_id) {
        return 1;
    }
    
    $content = get_post_field('post_content', $post_id);
    if (empty($content)) {
        return 1;
    }
    
    $word_count = str_word_count(strip_tags($content));
    $reading_time = ceil($word_count / 200); // 200 palavras por minuto
    
    return max(1, (int) $reading_time);
}
/* =====================================================
 * 🧩 TEMPLATE FILTERS & HOOKS (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Retorna data formatada em idioma local
 * 
 * @param string $date_string Data em formato padrão
 * @param string $format Formato desejado
 * @return string Data formatada
 */
function djz_format_date($date_string, $format = 'd/m/Y') {
    if (empty($date_string)) {
        return '';
    }
    
    $timestamp = strtotime($date_string);
    if (!$timestamp) {
        return $date_string;
    }
    
    return date_i18n($format, $timestamp);
}

/**
 * Retorna hora formatada em idioma local
 * 
 * @param string $time_string Hora em formato padrão
 * @param string $format Formato desejado
 * @return string Hora formatada
 */
function djz_format_time($time_string, $format = 'H:i') {
    if (empty($time_string)) {
        return '';
    }
    
    $timestamp = strtotime($time_string);
    if (!$timestamp) {
        return $time_string;
    }
    
    return date_i18n($format, $timestamp);
}

/**
 * Retorna link social com ícone (útil para loops)
 * 
 * @param string $platform Nome da plataforma
 * @param string $label Texto do link (opcional)
 * @return string Link HTML ou string vazia
 */
function djz_social_link($platform, $label = '') {
    $url = djz_social_url($platform);
    
    if (empty($url)) {
        return '';
    }
    
    if (empty($label)) {
        $label = ucfirst($platform);
    }
    
    return sprintf(
        '<a href="%s" rel="noopener noreferrer" target="_blank" title="%s">%s</a>',
        esc_attr($url),
        esc_attr($label),
        esc_html($label)
    );
}

/**
 * Retorna todas as redes sociais como links HTML
 * 
 * @return string Lista de links HTML
 */
function djz_social_links_html() {
    $social = djz_config('social', []);
    $exclude = ['spotify_id', 'twitter_handle'];
    $html = '';
    
    foreach ($social as $platform => $url) {
        if (in_array($platform, $exclude, true) || empty($url)) {
            continue;
        }
        
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            continue;
        }
        
        $html .= sprintf(
            '<a href="%s" rel="noopener noreferrer" target="_blank" title="%s" class="djz-social-link djz-social-%s">%s</a>',
            esc_attr($url),
            esc_attr(ucfirst($platform)),
            esc_attr($platform),
            esc_html(ucfirst($platform))
        );
    }
    
    return $html;
}

/* =====================================================
 * 🔍 SEARCH & FILTERING (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Retorna array de termos (tags/categorias) para post
 * Com opção de link URL
 * 
 * @param int $post_id Post ID
 * @param string $taxonomy Taxonomia (category, post_tag, etc)
 * @param bool $link Se deve retornar como links
 * @return array Termos ou links
 */
function djz_get_post_terms($post_id = null, $taxonomy = 'category', $link = false) {
    $post_id = $post_id ?? get_the_ID();
    if (!$post_id) {
        return [];
    }
    
    $terms = get_the_terms($post_id, $taxonomy);
    
    if (is_wp_error($terms) || empty($terms)) {
        return [];
    }
    
    if (!$link) {
        return array_map(function($term) {
            return [
                'name' => $term->name,
                'id' => $term->term_id,
                'slug' => $term->slug
            ];
        }, $terms);
    }
    
    // Com links
    return array_map(function($term) {
        return sprintf(
            '<a href="%s">%s</a>',
            esc_attr(get_term_link($term)),
            esc_html($term->name)
        );
    }, $terms);
}

/**
 * Retorna tags do post (termos da taxonomia post_tag)
 * 
 * @param int $post_id Post ID
 * @param bool $link Se deve retornar como links
 * @return array Tags ou links
 */
function djz_get_post_tags($post_id = null, $link = false) {
    return djz_get_post_terms($post_id, 'post_tag', $link);
}

/* =====================================================
 * 🎯 PAGINATION & NAVIGATION (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Retorna array com informações de paginação
 * 
 * @return array Dados de paginação
 */
function djz_get_pagination_info() {
    global $wp_query;
    
    if (!isset($wp_query)) {
        return [];
    }
    
    return [
        'total_posts' => (int) $wp_query->found_posts,
        'posts_per_page' => (int) $wp_query->query_vars['posts_per_page'],
        'total_pages' => (int) $wp_query->max_num_pages,
        'current_page' => (int) max(1, get_query_var('paged', 1)),
        'has_prev' => get_previous_posts_page_link() !== '',
        'has_next' => get_next_posts_page_link() !== '',
    ];
}

/* =====================================================
 * 📊 POST STATISTICS (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Retorna estatísticas de um post
 * 
 * @param int $post_id Post ID
 * @return array Estatísticas
 */
function djz_get_post_stats($post_id = null) {
    $post_id = $post_id ?? get_the_ID();
    if (!$post_id) {
        return [];
    }
    
    $post = get_post($post_id);
    
    return [
        'words' => str_word_count(strip_tags($post->post_content ?? '')),
        'reading_time' => djz_reading_time($post_id),
        'comments' => (int) $post->comment_count,
        'date_published' => get_the_date('c', $post_id),
        'date_modified' => get_the_modified_date('c', $post_id),
        'author' => get_the_author_meta('display_name', $post->post_author),
        'categories' => wp_get_post_categories($post_id),
    ];
}

/* =====================================================
 * 🎨 RENDER HELPERS (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Retorna classe CSS para elemento baseado em configuração
 * Útil para componentes dinâmicos
 * 
 * @param string $component Tipo de componente
 * @param string $size Tamanho (sm, md, lg)
 * @param string $variant Variante (primary, secondary)
 * @return string Classes CSS
 */
function djz_get_component_classes($component = 'button', $size = 'md', $variant = 'primary') {
    $classes = [
        'djz-component',
        'djz-' . sanitize_html_class($component),
    ];
    
    if (!empty($size)) {
        $classes[] = 'djz-size-' . sanitize_html_class($size);
    }
    
    if (!empty($variant)) {
        $classes[] = 'djz-variant-' . sanitize_html_class($variant);
    }
    
    return implode(' ', array_filter($classes));
}

/**
 * Retorna atributo de cor (data-color) para elemento
 * 
 * @param string $theme_color Nome da cor do tema
 * @return string Atributo HTML
 */
function djz_get_color_attribute($theme_color = 'primary') {
    $color = djz_theme_color($theme_color);
    return sprintf('data-color="%s"', esc_attr($color));
}

/* =====================================================
 * 🌐 PERFORMANCE & CACHING (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Retorna valor do transient ou callable com cache
 * Wrapper para WordPress transients
 * 
 * @param string $key Chave do transient
 * @param callable $callback Função para gerar valor
 * @param int $ttl Tempo em segundos (padrão: 1 hora)
 * @return mixed Valor em cache ou resultado de callback
 */
function djz_get_cached($key, callable $callback, $ttl = 3600) {
    // Sanitizar chave
    $key = 'djz_' . sanitize_key($key);
    
    // Tentar obter do cache
    $cached = get_transient($key);
    
    if ($cached !== false) {
        return $cached;
    }
    
    // Executar callback e cachear
    $value = call_user_func($callback);
    
    if ($value !== false) {
        set_transient($key, $value, $ttl);
    }
    
    return $value;
}

/**
 * Invalida cache de um grupo
 * 
 * @param string $key_pattern Padrão da chave (ex: 'posts_' para 'posts_1', 'posts_2')
 * @return bool Status
 */
function djz_invalidate_cache($key_pattern = '') {
    global $wpdb;
    
    if (empty($key_pattern)) {
        return false;
    }
    
    $key_pattern = 'djz_' . sanitize_key($key_pattern);
    
    // Deletar do banco de dados
    $wpdb->query($wpdb->prepare(
        "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
        '%' . $wpdb->esc_like($key_pattern) . '%'
    ));
    
    return true;
}

/* =====================================================
 * 🛡️ SECURITY HELPERS (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Valida e sanitiza entrada de usuário
 * Multi-tipo de validação
 * 
 * @param mixed $value Valor para validar
 * @param string $type Tipo (email, url, text, int, array)
 * @return mixed Valor sanitizado ou false
 */
function djz_validate_input($value, $type = 'text') {
    switch ($type) {
        case 'email':
            $value = sanitize_email($value);
            return is_email($value) ? $value : false;
        
        case 'url':
            $value = esc_url_raw($value);
            return filter_var($value, FILTER_VALIDATE_URL) ? $value : false;
        
        case 'int':
            return (int) $value;
        
        case 'text':
            return sanitize_text_field($value);
        
        case 'textarea':
            return sanitize_textarea_field($value);
        
        case 'array':
            return is_array($value) ? array_map('sanitize_text_field', $value) : [];
        
        default:
            return sanitize_text_field($value);
    }
}

/**
 * Retorna URL segura com proteção contra XSS
 * 
 * @param string $url URL para proteger
 * @param bool $external Se é URL externa
 * @return string URL escapada
 */
function djz_safe_url($url, $external = true) {
    if (empty($url)) {
        return '';
    }
    
    // Validar URL
    if (!filter_var($url, FILTER_VALIDATE_URL)) {
        return '';
    }
    
    // Se URL externa, adicionar rel attributes
    if ($external && stripos($url, home_url()) === false) {
        return esc_attr($url);
    }
    
    return esc_url($url);
}

/* =====================================================
 * 📈 DEBUG & LOGGING (v1.2.0 - NEW!)
 * ===================================================== */

/**
 * Log de debug para arquivo (apenas se WP_DEBUG)
 * 
 * @param mixed $data Dados para logar
 * @param string $label Rótulo opcional
 * @return bool Status
 */
function djz_debug_log($data, $label = '') {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
        return false;
    }
    
    $message = $label ? "[$label] " : '';
    $message .= is_string($data) ? $data : wp_json_encode($data);
    
    error_log('[DJZeneyer] ' . $message);
    
    return true;
}

/**
 * Retorna informações de performance
 * Tempo de execução, memória, queries
 * 
 * @return array Info de performance
 */
function djz_get_performance_info() {
    global $wpdb;
    
    $info = [
        'time_elapsed' => round((microtime(true) - $_SERVER['REQUEST_TIME_FLOAT']), 4),
        'memory_used' => round(memory_get_usage(true) / 1024 / 1024, 2),
        'memory_peak' => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
        'db_queries' => $wpdb->num_queries,
    ];
    
    // Se WP_DEBUG, adicionar array de queries
    if (defined('WP_DEBUG') && WP_DEBUG && defined('SAVEQUERIES') && SAVEQUERIES) {
        $info['queries'] = $wpdb->queries;
    }
    
    return $info;
}

/* =====================================================
 * 🎯 FINAL INITIALIZATION
 * ===================================================== */

/**
 * Initialize: Valida se config file existe
 */
if (!function_exists('djz_init')) {
    function djz_init() {
        $config_file = get_theme_file_path('/inc/djz-config.php');
        
        if (!file_exists($config_file)) {
            if (current_user_can('manage_options')) {
                trigger_error(
                    '[DJZeneyer] Config file not found: ' . $config_file,
                    E_USER_WARNING
                );
            }
            return false;
        }
        
        return true;
    }
    
    // Execute initialization
    add_action('after_setup_theme', 'djz_init', 1);
}
