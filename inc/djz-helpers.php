<?php
/**
 * DJ Zen Eyer - Helper Functions
 * Funções auxiliares para acessar configurações globais
 * 
 * @package DJZenEyerTheme
 * @version 1.0.0
 */

if (!defined('ABSPATH')) exit;

/**
 * Carrega configurações globais (cache otimizado)
 */
function djz_config($key = null, $default = null) {
    static $config = null;
    
    if ($config === null) {
        $config_file = get_theme_file_path('/inc/djz-config.php');
        $config = file_exists($config_file) ? require $config_file : [];
    }
    
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

/**
 * Retorna array de URLs de redes sociais (para Schema.org)
 */
function djz_social_urls() {
    $social = djz_config('social', []);
    unset($social['spotify_id']); // Remove ID puro
    unset($social['twitter_handle']); // Remove handle
    return array_values(array_filter($social));
}

/**
 * Retorna Open Graph image URL completa
 */
function djz_og_image($post_id = null) {
    // Se tem post e thumbnail
    if ($post_id && has_post_thumbnail($post_id)) {
        $url = get_the_post_thumbnail_url($post_id, 'large');
        if ($url) return $url;
    }
    
    // Fallback para imagem padrão
    $default = djz_config('images.og_image');
    return $default ? get_template_directory_uri() . $default : '';
}

/**
 * Retorna meta description otimizada
 */
function djz_meta_description($post_id = null) {
    if ($post_id && (is_single($post_id) || is_page($post_id))) {
        $excerpt = get_the_excerpt($post_id);
        if ($excerpt) {
            return wp_strip_all_tags($excerpt);
        }
    }
    return djz_config('site.description', get_bloginfo('description'));
}

/**
 * Retorna canonical URL correto
 */
function djz_canonical_url() {
    if (is_front_page()) {
        return home_url('/');
    }
    if (is_singular()) {
        return get_permalink();
    }
    return home_url('/');
}

/**
 * Retorna array de allowed origins (CORS)
 */
function djz_allowed_origins() {
    return djz_config('allowed_origins', []);
}
