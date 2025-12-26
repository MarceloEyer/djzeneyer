<?php
/**
 * Meta tags renderer
 *
 * @package Zen_SEO_Lite_Pro
 * @since 8.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Meta_Tags {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Remove default WordPress SEO
        remove_action('wp_head', 'rel_canonical');
        remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
        remove_action('wp_head', '_wp_render_title_tag', 1);
        add_filter('document_title_parts', '__return_empty_array', 9999);
        
        // Add our SEO
        add_action('wp_head', [$this, 'render_meta_tags'], 1);
        add_action('wp_head', [$this, 'render_schema'], 2);
    }
    
    /**
     * Render all meta tags
     */
    public function render_meta_tags() {
        $data = $this->get_page_data();
        
        // Check cache first
        $cache_key = 'meta_' . ($data['post_id'] ?? 'home');
        $cached = Zen_SEO_Cache::get($cache_key);
        
        if ($cached !== false) {
            echo $cached;
            return;
        }
        
        ob_start();
        
        // Title
        echo '<title>' . esc_html($data['title']) . '</title>' . "\n";
        
        // Meta description
        if (!empty($data['description'])) {
            echo '<meta name="description" content="' . esc_attr($data['description']) . '">' . "\n";
        }
        
        // Canonical
        echo '<link rel="canonical" href="' . esc_url($data['canonical']) . '">' . "\n";
        
        // Robots
        if (!empty($data['noindex'])) {
            echo '<meta name="robots" content="noindex, follow">' . "\n";
        } else {
            echo '<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">' . "\n";
        }
        
        // Open Graph
        $this->render_open_graph($data);
        
        // Twitter Card
        $this->render_twitter_card($data);
        
        // Hreflang
        $this->render_hreflang($data);
        
        $output = ob_get_clean();
        
        // Cache for 12 hours
        Zen_SEO_Cache::set($cache_key, $output, Zen_SEO_Cache::META_DURATION);
        
        echo $output;
    }
    
    /**
     * Render Open Graph tags
     */
    private function render_open_graph($data) {
        echo '<meta property="og:locale" content="' . esc_attr($data['locale']) . '">' . "\n";
        echo '<meta property="og:type" content="' . esc_attr($data['og_type']) . '">' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($data['title']) . '">' . "\n";
        
        if (!empty($data['description'])) {
            echo '<meta property="og:description" content="' . esc_attr($data['description']) . '">' . "\n";
        }
        
        echo '<meta property="og:url" content="' . esc_url($data['canonical']) . '">' . "\n";
        echo '<meta property="og:site_name" content="' . esc_attr(get_bloginfo('name')) . '">' . "\n";
        
        if (!empty($data['image'])) {
            echo '<meta property="og:image" content="' . esc_url($data['image']) . '">' . "\n";
            echo '<meta property="og:image:width" content="1200">' . "\n";
            echo '<meta property="og:image:height" content="630">' . "\n";
        }
        
        if (!empty($data['published_time'])) {
            echo '<meta property="article:published_time" content="' . esc_attr($data['published_time']) . '">' . "\n";
        }
        
        if (!empty($data['modified_time'])) {
            echo '<meta property="article:modified_time" content="' . esc_attr($data['modified_time']) . '">' . "\n";
        }
    }
    
    /**
     * Render Twitter Card tags
     */
    private function render_twitter_card($data) {
        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($data['title']) . '">' . "\n";
        
        if (!empty($data['description'])) {
            echo '<meta name="twitter:description" content="' . esc_attr($data['description']) . '">' . "\n";
        }
        
        if (!empty($data['image'])) {
            echo '<meta name="twitter:image" content="' . esc_url($data['image']) . '">' . "\n";
        }
        
        // Add Twitter handle if available
        $settings = Zen_SEO_Helpers::get_global_settings();
        if (!empty($settings['twitter'])) {
            $handle = str_replace('https://twitter.com/', '@', $settings['twitter']);
            echo '<meta name="twitter:site" content="' . esc_attr($handle) . '">' . "\n";
            echo '<meta name="twitter:creator" content="' . esc_attr($handle) . '">' . "\n";
        }
    }
    
    /**
     * Render hreflang tags
     */
    private function render_hreflang($data) {
        if (empty($data['translations'])) {
            return;
        }
        
        foreach ($data['translations'] as $lang => $url) {
            echo '<link rel="alternate" hreflang="' . esc_attr($lang) . '" href="' . esc_url($url) . '" />' . "\n";
        }
        
        // x-default should point to default language
        $default_lang = Zen_SEO_Helpers::get_default_language();
        $default_hreflang = Zen_SEO_Helpers::convert_lang_to_hreflang($default_lang);
        
        if (isset($data['translations'][$default_hreflang])) {
            echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($data['translations'][$default_hreflang]) . '" />' . "\n";
        }
    }
    
    /**
     * Render Schema.org JSON-LD
     */
    public function render_schema() {
        $schema = Zen_SEO_Schema::get_instance()->generate_schema();
        
        if (!empty($schema)) {
            echo '<script type="application/ld+json">' . "\n";
            echo wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            echo "\n" . '</script>' . "\n";
        }
    }
    
    /**
     * Get page data for meta tags
     */
    private function get_page_data() {
        $data = [
            'title' => '',
            'description' => '',
            'canonical' => '',
            'image' => '',
            'og_type' => 'website',
            'locale' => 'en_US',
            'noindex' => false,
            'translations' => [],
            'post_id' => null,
            'published_time' => '',
            'modified_time' => '',
        ];
        
        $settings = Zen_SEO_Helpers::get_global_settings();
        
        // Single post/page
        if (Zen_SEO_Helpers::is_supported_post_type()) {
            global $post;
            
            $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
            
            $data['post_id'] = $post->ID;
            $data['title'] = !empty($meta['title']) ? $meta['title'] : get_the_title($post);
            $data['description'] = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(get_post_field('post_content', $post));
            $data['canonical'] = get_permalink($post);
            $data['image'] = !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post->ID);
            $data['noindex'] = !empty($meta['noindex']);
            $data['translations'] = Zen_SEO_Helpers::get_translations($post->ID);
            $data['og_type'] = 'article';
            $data['published_time'] = get_post_time('c', true, $post);
            $data['modified_time'] = get_post_modified_time('c', true, $post);
            
            // Detect locale from Polylang
            if (function_exists('pll_get_post_language')) {
                $lang = pll_get_post_language($post->ID);
                $data['locale'] = $lang === 'pt' ? 'pt_BR' : 'en_US';
            }
            
        } else {
            // Homepage or other pages
            $data['title'] = get_bloginfo('name');
            $data['description'] = get_bloginfo('description');
            $request_uri = isset($_SERVER['REQUEST_URI']) ? esc_url_raw($_SERVER['REQUEST_URI']) : '/';
            $data['canonical'] = esc_url(home_url($request_uri));
            $data['image'] = $settings['default_image'] ?? '';
            
            // Translations for homepage
            $data['translations'] = [
                'en' => home_url('/'),
                'pt-BR' => home_url('/pt/')
            ];
        }
        
        // Fallback image
        if (empty($data['image']) && !empty($settings['default_image'])) {
            $data['image'] = $settings['default_image'];
        }
        
        // Ensure title has site name
        if (!str_contains($data['title'], get_bloginfo('name'))) {
            $data['title'] .= ' | ' . get_bloginfo('name');
        }
        
        return apply_filters('zen_seo_page_data', $data);
    }
}
