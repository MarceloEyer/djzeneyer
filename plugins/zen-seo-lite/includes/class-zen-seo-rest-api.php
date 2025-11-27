<?php
/**
 * REST API integration
 *
 * @package Zen_SEO_Lite_Pro
 * @since 8.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Zen_SEO_REST_API {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('rest_api_init', [$this, 'register_api_fields']);
        add_action('rest_api_init', [$this, 'register_api_routes']);
    }
    
    /**
     * Register custom fields in REST API
     */
    public function register_api_fields() {
        $post_types = Zen_SEO_Helpers::get_supported_post_types();
        
        // Add zen_seo field
        register_rest_field($post_types, 'zen_seo', [
            'get_callback' => [$this, 'get_seo_data'],
            'schema' => [
                'description' => __('SEO metadata', 'zen-seo'),
                'type' => 'object',
                'context' => ['view', 'edit'],
                'properties' => [
                    'title' => [
                        'type' => 'string',
                        'description' => __('SEO title', 'zen-seo')
                    ],
                    'desc' => [
                        'type' => 'string',
                        'description' => __('Meta description', 'zen-seo')
                    ],
                    'image' => [
                        'type' => 'string',
                        'format' => 'uri',
                        'description' => __('OG image URL', 'zen-seo')
                    ],
                    'noindex' => [
                        'type' => 'boolean',
                        'description' => __('No index flag', 'zen-seo')
                    ],
                ]
            ]
        ]);
        
        // Add zen_schema field
        register_rest_field($post_types, 'zen_schema', [
            'get_callback' => [$this, 'get_schema_data'],
            'schema' => [
                'description' => __('Schema.org JSON-LD', 'zen-seo'),
                'type' => 'object',
                'context' => ['view']
            ]
        ]);
        
        // Add zen_translations field
        register_rest_field($post_types, 'zen_translations', [
            'get_callback' => [$this, 'get_translations_data'],
            'schema' => [
                'description' => __('Polylang translations', 'zen-seo'),
                'type' => 'object',
                'context' => ['view']
            ]
        ]);
    }
    
    /**
     * Register custom REST routes
     */
    public function register_api_routes() {
        // Get SEO settings
        register_rest_route('zen-seo/v1', '/settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_settings'],
            'permission_callback' => '__return_true',
        ]);
        
        // Get sitemap data
        register_rest_route('zen-seo/v1', '/sitemap', [
            'methods' => 'GET',
            'callback' => [$this, 'get_sitemap_data'],
            'permission_callback' => '__return_true',
        ]);
        
        // Clear cache (admin only)
        register_rest_route('zen-seo/v1', '/cache/clear', [
            'methods' => 'POST',
            'callback' => [$this, 'clear_cache'],
            'permission_callback' => function() {
                return current_user_can('manage_options');
            },
        ]);
    }
    
    /**
     * Get SEO data for a post
     */
    public function get_seo_data($object) {
        $meta = Zen_SEO_Helpers::get_post_meta($object['id']);
        
        // Ensure all fields exist
        return [
            'title' => $meta['title'] ?? '',
            'desc' => $meta['desc'] ?? '',
            'image' => $meta['image'] ?? '',
            'noindex' => !empty($meta['noindex']),
            'event_date' => $meta['event_date'] ?? '',
            'event_location' => $meta['event_location'] ?? '',
            'event_ticket' => $meta['event_ticket'] ?? '',
        ];
    }
    
    /**
     * Get Schema.org data for a post
     */
    public function get_schema_data($object) {
        global $post;
        
        // Temporarily set global post
        $original_post = $post;
        $post = get_post($object['id']);
        
        $schema = Zen_SEO_Schema::get_instance()->generate_schema();
        
        // Restore original post
        $post = $original_post;
        
        return $schema;
    }
    
    /**
     * Get translations for a post
     */
    public function get_translations_data($object) {
        return Zen_SEO_Helpers::get_translations($object['id']);
    }
    
    /**
     * Get global settings
     */
    public function get_settings($request) {
        $settings = Zen_SEO_Helpers::get_global_settings();
        
        // Remove sensitive data
        unset($settings['booking_email']);
        unset($settings['cnpj']);
        
        return rest_ensure_response([
            'success' => true,
            'data' => $settings
        ]);
    }
    
    /**
     * Get sitemap data (for React to generate client-side sitemap)
     */
    public function get_sitemap_data($request) {
        $data = [
            'routes' => [],
            'posts' => []
        ];
        
        // Get React routes
        $settings = Zen_SEO_Helpers::get_global_settings();
        $routes_raw = $settings['react_routes'] ?? '';
        
        if (!empty($routes_raw)) {
            $routes = array_filter(array_map('trim', explode("\n", $routes_raw)));
            
            foreach ($routes as $line) {
                $parts = array_map('trim', explode(',', $line));
                
                if (!empty($parts[0])) {
                    $data['routes'][] = [
                        'en' => $parts[0],
                        'pt' => $parts[1] ?? null
                    ];
                }
            }
        }
        
        // Get posts
        $post_types = Zen_SEO_Helpers::get_supported_post_types();
        
        $args = [
            'post_type' => $post_types,
            'post_status' => 'publish',
            'posts_per_page' => 100,
            'orderby' => 'modified',
            'order' => 'DESC',
        ];
        
        $posts = get_posts($args);
        
        foreach ($posts as $post) {
            $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
            
            // Skip noindex posts
            if (!empty($meta['noindex'])) {
                continue;
            }
            
            $translations = Zen_SEO_Helpers::get_translations($post->ID);
            
            $data['posts'][] = [
                'id' => $post->ID,
                'type' => $post->post_type,
                'title' => get_the_title($post),
                'modified' => get_post_modified_time('c', true, $post),
                'translations' => $translations
            ];
        }
        
        return rest_ensure_response([
            'success' => true,
            'data' => $data
        ]);
    }
    
    /**
     * Clear all caches
     */
    public function clear_cache($request) {
        $cleared = Zen_SEO_Cache::clear_all();
        
        return rest_ensure_response([
            'success' => true,
            'message' => sprintf(__('Cleared %d cache entries', 'zen-seo'), $cleared),
            'data' => [
                'cleared' => $cleared
            ]
        ]);
    }
}
