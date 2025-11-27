<?php
/**
 * Sitemap generator
 *
 * @package Zen_SEO_Lite_Pro
 * @since 8.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Sitemap {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('init', [__CLASS__, 'register_rewrite_rules']);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('template_redirect', [$this, 'render_sitemap'], 0);
        add_filter('robots_txt', [$this, 'add_sitemap_to_robots'], 10, 2);
        
        // Clear cache hooks
        add_action('save_post', [$this, 'clear_cache_on_save']);
        add_action('update_option_zen_seo_global', [$this, 'clear_cache_on_settings_update']);
    }
    
    /**
     * Register rewrite rules for sitemap
     */
    public static function register_rewrite_rules() {
        add_rewrite_rule('sitemap\.xml$', 'index.php?zen_sitemap=1', 'top');
    }
    
    /**
     * Register query vars
     */
    public function register_query_vars($vars) {
        $vars[] = 'zen_sitemap';
        return $vars;
    }
    
    /**
     * Render sitemap
     */
    public function render_sitemap() {
        if (!get_query_var('zen_sitemap')) {
            return;
        }
        
        // Check cache
        $sitemap = Zen_SEO_Cache::get('sitemap');
        
        if ($sitemap === false) {
            $sitemap = $this->generate_sitemap();
            Zen_SEO_Cache::set('sitemap', $sitemap, Zen_SEO_Cache::SITEMAP_DURATION);
        }
        
        // Set headers
        if (!headers_sent()) {
            status_header(200);
            header('Content-Type: application/xml; charset=utf-8');
            header('X-Robots-Tag: noindex, follow');
        }
        
        echo $sitemap;
        exit;
    }
    
    /**
     * Generate sitemap XML
     */
    private function generate_sitemap() {
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' . "\n";
        
        // Add React routes
        $xml .= $this->generate_react_routes();
        
        // Add WordPress posts
        $xml .= $this->generate_post_urls();
        
        $xml .= '</urlset>';
        
        return $xml;
    }
    
    /**
     * Generate React route URLs
     */
    private function generate_react_routes() {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $routes_raw = $settings['react_routes'] ?? '';
        
        if (empty($routes_raw)) {
            return '';
        }
        
        $xml = '';
        $routes = array_filter(array_map('trim', explode("\n", $routes_raw)));
        
        foreach ($routes as $line) {
            $parts = array_map('trim', explode(',', $line));
            
            if (empty($parts[0])) {
                continue;
            }
            
            $url_en = home_url($parts[0]);
            $url_pt = isset($parts[1]) ? home_url($parts[1]) : null;
            
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . esc_url($url_en) . '</loc>' . "\n";
            $xml .= '    <changefreq>weekly</changefreq>' . "\n";
            $xml .= '    <priority>0.8</priority>' . "\n";
            
            // Hreflang
            $xml .= '    <xhtml:link rel="alternate" hreflang="en" href="' . esc_url($url_en) . '"/>' . "\n";
            $xml .= '    <xhtml:link rel="alternate" hreflang="x-default" href="' . esc_url($url_en) . '"/>' . "\n";
            
            if ($url_pt) {
                $xml .= '    <xhtml:link rel="alternate" hreflang="pt-BR" href="' . esc_url($url_pt) . '"/>' . "\n";
            }
            
            $xml .= '  </url>' . "\n";
        }
        
        return $xml;
    }
    
    /**
     * Generate post URLs
     */
    private function generate_post_urls() {
        $xml = '';
        $post_types = Zen_SEO_Helpers::get_supported_post_types();
        
        // Query args
        $args = [
            'post_type' => $post_types,
            'post_status' => 'publish',
            'posts_per_page' => 500, // Reasonable limit
            'orderby' => 'modified',
            'order' => 'DESC',
            'no_found_rows' => true,
            'update_post_meta_cache' => false,
            'update_post_term_cache' => false,
        ];
        
        // If Polylang is active, get English posts only (translations will be added via hreflang)
        if (function_exists('pll_languages_list')) {
            $args['lang'] = Zen_SEO_Helpers::get_default_language();
        }
        
        $posts = get_posts($args);
        
        foreach ($posts as $post) {
            // Check if post should be indexed
            $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
            
            if (!empty($meta['noindex'])) {
                continue;
            }
            
            $translations = Zen_SEO_Helpers::get_translations($post->ID);
            
            // Skip if no valid URL
            if (empty($translations)) {
                continue;
            }
            
            // Get primary URL (default language)
            $default_lang = Zen_SEO_Helpers::get_default_language();
            $default_hreflang = Zen_SEO_Helpers::convert_lang_to_hreflang($default_lang);
            $primary_url = $translations[$default_hreflang] ?? reset($translations);
            
            if (!$primary_url) {
                continue;
            }
            
            $xml .= '  <url>' . "\n";
            $xml .= '    <loc>' . esc_url($primary_url) . '</loc>' . "\n";
            $xml .= '    <lastmod>' . get_post_modified_time('c', true, $post) . '</lastmod>' . "\n";
            
            // Priority based on post type
            $priority = $this->get_priority_for_post_type($post->post_type);
            $xml .= '    <priority>' . $priority . '</priority>' . "\n";
            $xml .= '    <changefreq>weekly</changefreq>' . "\n";
            
            // Hreflang for all translations
            foreach ($translations as $lang => $url) {
                $xml .= '    <xhtml:link rel="alternate" hreflang="' . esc_attr($lang) . '" href="' . esc_url($url) . '"/>' . "\n";
            }
            
            // x-default
            $xml .= '    <xhtml:link rel="alternate" hreflang="x-default" href="' . esc_url($primary_url) . '"/>' . "\n";
            
            $xml .= '  </url>' . "\n";
        }
        
        return $xml;
    }
    
    /**
     * Get priority for post type
     */
    private function get_priority_for_post_type($post_type) {
        $priorities = [
            'page' => '0.8',
            'post' => '0.6',
            'product' => '0.7',
            'flyers' => '0.6',
            'remixes' => '0.7',
        ];
        
        return $priorities[$post_type] ?? '0.5';
    }
    
    /**
     * Add sitemap to robots.txt
     */
    public function add_sitemap_to_robots($output, $public) {
        if ($public == '0') {
            return "User-agent: *\nDisallow: /\n";
        }
        
        $sitemap_url = home_url('/sitemap.xml');
        
        $rules = "User-agent: *\n";
        $rules .= "Allow: /\n";
        $rules .= "Disallow: /wp-admin/\n";
        $rules .= "Disallow: /wp-includes/\n";
        $rules .= "Disallow: /wp-content/plugins/\n";
        $rules .= "Disallow: /wp-content/themes/\n";
        $rules .= "Allow: /wp-content/uploads/\n";
        $rules .= "\n";
        $rules .= "Sitemap: " . $sitemap_url . "\n";
        
        return $rules;
    }
    
    /**
     * Clear cache when post is saved
     */
    public function clear_cache_on_save($post_id) {
        // Don't clear for autosaves or revisions
        if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id)) {
            return;
        }
        
        Zen_SEO_Cache::clear_sitemap();
    }
    
    /**
     * Clear cache when settings are updated
     */
    public function clear_cache_on_settings_update() {
        Zen_SEO_Cache::clear_sitemap();
    }
}
