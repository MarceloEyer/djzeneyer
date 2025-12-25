<?php
/**
 * Helper functions and utilities
 *
 * @package Zen_SEO_Lite_Pro
 * @since 8.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Helpers {
    
    /**
     * Get global SEO settings
     *
     * @return array
     */
    public static function get_global_settings() {
        $settings = get_option('zen_seo_global', []);
        return is_array($settings) ? $settings : [];
    }
    
    /**
     * Get post SEO meta data
     *
     * @param int $post_id
     * @return array
     */
    public static function get_post_meta($post_id) {
        $meta = get_post_meta($post_id, '_zen_seo_data', true);
        return is_array($meta) ? $meta : [];
    }
    
    /**
     * Get translations for a post (Polylang support)
     *
     * @param int $post_id
     * @return array ['en' => 'url', 'pt-BR' => 'url']
     */
    public static function get_translations($post_id) {
        $translations = [];
        
        if (!function_exists('pll_get_post_translations')) {
            // No Polylang, return current post only
            $translations['en'] = get_permalink($post_id);
            return $translations;
        }
        
        $trans = pll_get_post_translations($post_id);
        
        if (empty($trans) || !is_array($trans)) {
            $translations['en'] = get_permalink($post_id);
            return $translations;
        }
        
        foreach ($trans as $lang => $trans_id) {
            $hreflang = self::convert_lang_to_hreflang($lang);
            $permalink = get_permalink($trans_id);
            
            if ($permalink) {
                $translations[$hreflang] = $permalink;
            }
        }
        
        return $translations;
    }
    
    /**
     * Convert Polylang language code to hreflang format
     *
     * @param string $lang
     * @return string
     */
    public static function convert_lang_to_hreflang($lang) {
        $map = [
            'pt' => 'pt-BR',
            'en' => 'en',
            'es' => 'es',
            'fr' => 'fr',
        ];
        
        return isset($map[$lang]) ? $map[$lang] : $lang;
    }
    
    /**
     * Get default language
     *
     * @return string
     */
    public static function get_default_language() {
        if (function_exists('pll_default_language')) {
            return pll_default_language();
        }
        return 'en';
    }
    
    /**
     * Get all available languages
     *
     * @return array
     */
    public static function get_available_languages() {
        if (function_exists('pll_languages_list')) {
            return pll_languages_list();
        }
        return ['en'];
    }
    
    /**
     * Sanitize URL or return empty string
     *
     * @param string $url
     * @return string
     */
    public static function sanitize_url($url) {
        if (empty($url)) {
            return '';
        }
        return esc_url_raw(trim($url));
    }
    
    /**
     * Get post featured image URL
     *
     * @param int $post_id
     * @param string $size
     * @return string
     */
    public static function get_featured_image($post_id, $size = 'large') {
        $image_id = get_post_thumbnail_id($post_id);
        
        if (!$image_id) {
            return '';
        }
        
        $image = wp_get_attachment_image_src($image_id, $size);
        
        return $image ? $image[0] : '';
    }
    
    /**
     * Generate excerpt from content
     *
     * @param string $content
     * @param int $length
     * @return string
     */
    public static function generate_excerpt($content, $length = 160) {
        $content = strip_tags($content);
        $content = strip_shortcodes($content);
        
        if (strlen($content) <= $length) {
            return $content;
        }
        
        return substr($content, 0, $length) . '...';
    }
    
    /**
     * Check if current page is a supported post type
     *
     * @return bool
     */
    public static function is_supported_post_type() {
        $supported = ['post', 'page', 'flyers', 'remixes', 'product'];
        return is_singular($supported);
    }
    
    /**
     * Get supported post types
     *
     * @return array
     */
    public static function get_supported_post_types() {
        return apply_filters('zen_seo_supported_post_types', [
            'post',
            'page',
            'flyers',
            'remixes',
            'product'
        ]);
    }
    
    /**
     * Validate ISNI code format
     *
     * @param string $isni
     * @return bool
     */
    public static function validate_isni($isni) {
        // ISNI format: 0000 0001 2345 6789
        $pattern = '/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/';
        return preg_match($pattern, $isni) === 1;
    }
    
    /**
     * Validate CNPJ format
     *
     * @param string $cnpj
     * @return bool
     */
    public static function validate_cnpj($cnpj) {
        // CNPJ format: 00.000.000/0000-00
        $pattern = '/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/';
        return preg_match($pattern, $cnpj) === 1;
    }
    
    /**
     * Log debug message (only if WP_DEBUG is enabled)
     *
     * @param string $message
     * @param mixed $data
     */
    public static function log($message, $data = null) {
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            return;
        }
        
        $log_message = '[Zen SEO] ' . $message;
        
        if ($data !== null) {
            $log_message .= ' | Data: ' . print_r($data, true);
        }
        
        error_log($log_message);
    }
}
