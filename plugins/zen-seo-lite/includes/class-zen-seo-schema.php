<?php
/**
 * Schema.org JSON-LD generator
 *
 * @package Zen_SEO_Lite_Pro
 * @since 8.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Schema {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        // Schema is rendered by Zen_SEO_Meta_Tags
    }
    
    /**
     * Generate schema for current page
     */
    public function generate_schema() {
        global $post;
        
        // Check cache
        $cache_key = 'schema_' . ($post->ID ?? 'home');
        $cached = Zen_SEO_Cache::get($cache_key);
        
        if ($cached !== false) {
            return $cached;
        }
        
        $schema = [
            '@context' => 'https://schema.org',
            '@graph' => []
        ];
        
        // Always include Person schema (the artist)
        $schema['@graph'][] = $this->generate_person_schema();
        
        // Add WebSite schema for homepage
        if (is_front_page() || is_home()) {
            $schema['@graph'][] = $this->generate_website_schema();
        }
        
        // Add page-specific schema
        if (Zen_SEO_Helpers::is_supported_post_type() && $post) {
            $schema['@graph'][] = $this->generate_webpage_schema($post);
            
            // Add type-specific schema
            switch ($post->post_type) {
                case 'flyers':
                    $event_schema = $this->generate_event_schema($post);
                    if ($event_schema) {
                        $schema['@graph'][] = $event_schema;
                    }
                    break;
                    
                case 'remixes':
                    $schema['@graph'][] = $this->generate_music_schema($post);
                    break;
                    
                case 'product':
                    $product_schema = $this->generate_product_schema($post);
                    if ($product_schema) {
                        $schema['@graph'][] = $product_schema;
                    }
                    break;
            }
                        $schema['@graph'][] = $this->generate_breadcrumb_schema($post);
        }
        
        // Cache for 24 hours
        Zen_SEO_Cache::set($cache_key, $schema, Zen_SEO_Cache::SCHEMA_DURATION);
        
        return apply_filters('zen_seo_schema', $schema);
    }
    
    /**
     * Generate Person schema (the artist)
     */
    private function generate_person_schema() {
        $settings = Zen_SEO_Helpers::get_global_settings();
        
        $name = !empty($settings['real_name']) ? sanitize_text_field($settings['real_name']) : get_bloginfo('name');
        
        $person = [
            '@type' => 'Person',
            '@id' => home_url('/#artist'),
            'name' => $name,
            'url' => home_url('/'),
            'image' => $settings['default_image'] ?? '',
            'jobTitle' => ['DJ', 'Music Producer', 'Remixer'],
            'knowsAbout' => ['Brazilian Zouk', 'Zouk', 'Kizomba', 'Music Production', 'DJing'],
            'gender' => 'Male',
        ];
        
        // Nationality
        $person['nationality'] = [
            '@type' => 'Country',
            'name' => 'Brazil'
        ];
        
        // Birth place
        if (!empty($settings['birth_place'])) {
            $person['birthPlace'] = [
                '@type' => 'Place',
                'name' => sanitize_text_field($settings['birth_place'])
            ];
        }
        
        // Home location
        if (!empty($settings['home_location'])) {
            $person['homeLocation'] = [
                '@type' => 'Place',
                'name' => sanitize_text_field($settings['home_location'])
            ];
        }
        
        // ISNI identifier
        if (!empty($settings['isni_code'])) {
            $person['identifier'] = [
                '@type' => 'PropertyValue',
                'propertyID' => 'ISNI',
                'value' => sanitize_text_field($settings['isni_code'])
            ];
        }
        
        // Tax ID (CNPJ)
        if (!empty($settings['cnpj'])) {
            $person['taxID'] = sanitize_text_field($settings['cnpj']);
        }
        
        // Contact point
        if (!empty($settings['booking_email'])) {
            $person['contactPoint'] = [
                '@type' => 'ContactPoint',
                'email' => sanitize_email($settings['booking_email']),
                'contactType' => 'booking',
                'areaServed' => 'World'
            ];
        }
        
        // Mensa membership
        if (!empty($settings['mensa_url'])) {
            $person['memberOf'] = [
                '@type' => 'Organization',
                'name' => 'Mensa International',
                'url' => esc_url($settings['mensa_url'])
            ];
        }
        
        // Awards
        if (!empty($settings['awards_list'])) {
            $awards = array_filter(array_map('trim', explode("\n", $settings['awards_list'])));
            if (!empty($awards)) {
                $person['award'] = array_values($awards);
            }
        }
        
        // SameAs (social profiles)
        $person['sameAs'] = $this->get_same_as_urls($settings);
        
        return $person;
    }
    
    /**
     * Generate WebSite schema
     */
    private function generate_website_schema() {
        return [
            '@type' => 'WebSite',
            '@id' => home_url('/#website'),
            'url' => home_url('/'),
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'publisher' => [
                '@id' => home_url('/#artist')
            ],
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => home_url('/?s={search_term_string}')
                ],
                'query-input' => 'required name=search_term_string'
            ]
        ];
    }
    
    /**
     * Generate WebPage schema
     */
    private function generate_webpage_schema($post) {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
        
        $title = !empty($meta['title']) ? $meta['title'] : get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(get_post_field('post_content', $post));
        
        return [
            '@type' => 'WebPage',
            '@id' => get_permalink($post) . '#webpage',
            'url' => get_permalink($post),
            'name' => sanitize_text_field($title),
            'description' => sanitize_text_field($description),
            'datePublished' => get_post_time('c', true, $post),
            'dateModified' => get_post_modified_time('c', true, $post),
            'publisher' => [
                '@id' => home_url('/#artist')
            ],
            'isPartOf' => [
                '@id' => home_url('/#website')
            ]
        ];
    }
    
    /**
     * Generate Event schema
     */
    private function generate_event_schema($post) {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
        
        // Event date is required
        if (empty($meta['event_date'])) {
            return null;
        }
        
        $title = !empty($meta['title']) ? $meta['title'] : get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(get_post_field('post_content', $post));
        $image = !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post->ID);
        
        $event = [
            '@type' => 'MusicEvent',
            'name' => sanitize_text_field($title),
            'description' => sanitize_text_field($description),
            'startDate' => sanitize_text_field($meta['event_date']),
            'eventStatus' => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
            'performer' => [
                '@id' => home_url('/#artist')
            ],
        ];
        
        // Image
        if ($image) {
            $event['image'] = esc_url($image);
        }
        
        // Location
        if (!empty($meta['event_location'])) {
            $event['location'] = [
                '@type' => 'Place',
                'name' => sanitize_text_field($meta['event_location']),
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressCountry' => 'BR'
                ]
            ];
        }
        
        // Offers (ticket)
        $ticket_url = !empty($meta['event_ticket']) ? $meta['event_ticket'] : get_permalink($post);
        $event['offers'] = [
            '@type' => 'Offer',
            'url' => esc_url($ticket_url),
            'availability' => 'https://schema.org/InStock'
        ];
        
        return $event;
    }
    
    /**
     * Generate MusicRecording schema
     */
    private function generate_music_schema($post) {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
        
        $title = !empty($meta['title']) ? $meta['title'] : get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(get_post_field('post_content', $post));
        $image = !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post->ID);
        
        $music = [
            '@type' => 'MusicRecording',
            'name' => sanitize_text_field($title),
            'description' => sanitize_text_field($description),
            'datePublished' => get_post_time('c', true, $post),
            'byArtist' => [
                '@id' => home_url('/#artist')
            ],
        ];
        
        if ($image) {
            $music['image'] = esc_url($image);
        }
        
        // Get audio URL from custom fields
        $audio_url = get_post_meta($post->ID, 'audio_url', true);
        if ($audio_url) {
            $music['audio'] = esc_url($audio_url);
        }
        
        // Genre from tags
        $tags = get_the_terms($post->ID, 'music_tags');
        if ($tags && !is_wp_error($tags)) {
            $music['genre'] = array_map(function($tag) {
                return $tag->name;
            }, $tags);
        }
        
        return $music;
    }
    
    /**
     * Generate Product schema (WooCommerce)
     */
    private function generate_product_schema($post) {
        if (!function_exists('wc_get_product')) {
            return null;
        }
        
        $product = wc_get_product($post->ID);
        
        if (!$product) {
            return null;
        }
        
        $schema = [
            '@type' => 'Product',
            'name' => $product->get_name(),
            'description' => wp_strip_all_tags($product->get_description()),
            'sku' => $product->get_sku(),
            'image' => wp_get_attachment_url($product->get_image_id()),
            'offers' => [
                '@type' => 'Offer',
                'url' => get_permalink($post),
                'priceCurrency' => get_woocommerce_currency(),
                'price' => $product->get_price(),
                'availability' => $product->is_in_stock() ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                'seller' => [
                    '@id' => home_url('/#artist')
                ]
            ]
        ];
        
        return $schema;
    }
    
    /**
     * Get sameAs URLs from settings
     */
    private function get_same_as_urls($settings) {
        $urls = [];
        
        // Google Knowledge Graph
        if (!empty($settings['google_kg'])) {
            $kg = trim($settings['google_kg']);
            if (strpos($kg, 'http') === 0) {
                $urls[] = esc_url($kg);
            } else {
                $urls[] = 'https://g.co/kg' . $kg;
            }
        }
        
        // Social and music platforms
        $platforms = [
            'musicbrainz', 'wikidata', 'beatport', 'spotify', 'apple_music',
            'shazam', 'soundcloud', 'mixcloud', 'bandcamp', 'songkick',
            'bandsintown', 'instagram', 'youtube', 'facebook', 'ranker_list'
        ];
        
        foreach ($platforms as $platform) {
            if (!empty($settings[$platform])) {
                $urls[] = esc_url(trim($settings[$platform]));
            }
        }
        
        return array_values(array_filter($urls));

            /**
     * Generate Breadcrumb Schema
     * Google loves breadcrumb schema for better SERP display
     */
    private function generate_breadcrumb_schema($post) {
        return [
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                [
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Home',
                    'item' => home_url('/')
                ],
                [
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => get_the_title($post),
                    'item' => get_permalink($post)
                ]
            ]
        ];
    }
    }
}
