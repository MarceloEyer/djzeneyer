<?php
namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
    exit;
}

class Zen_SEO_REST_API
{

    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        \add_action('rest_api_init', [$this, 'register_api_fields']);
        \add_action('rest_api_init', [$this, 'register_api_routes']);
    }

    /**
     * Register custom fields in REST API
     */
    public function register_api_fields()
    {
        $post_types = Zen_SEO_Helpers::get_supported_post_types();

        // Add zen_seo field
        \register_rest_field($post_types, 'zen_seo', [
            'get_callback' => [$this, 'get_seo_data'],
            'schema' => [
                'description' => \__('SEO metadata', 'zen-seo'),
                'type' => 'object',
                'context' => ['view', 'edit'],
                'properties' => [
                    'title' => [
                        'type' => 'string',
                        'description' => \__('SEO title', 'zen-seo')
                    ],
                    'desc' => [
                        'type' => 'string',
                        'description' => \__('Meta description', 'zen-seo')
                    ],
                    'image' => [
                        'type' => 'string',
                        'format' => 'uri',
                        'description' => \__('OG image URL', 'zen-seo')
                    ],
                    'noindex' => [
                        'type' => 'boolean',
                        'description' => \__('No index flag', 'zen-seo')
                    ],
                ]
            ]
        ]);

        // Add zen_schema field
        \register_rest_field($post_types, 'zen_schema', [
            'get_callback' => [$this, 'get_schema_data'],
            'schema' => [
                'description' => \__('Schema.org JSON-LD', 'zen-seo'),
                'type' => 'object',
                'context' => ['view']
            ]
        ]);

        // Add zen_translations field
        \register_rest_field($post_types, 'zen_translations', [
            'get_callback' => [$this, 'get_translations_data'],
            'schema' => [
                'description' => \__('Polylang translations', 'zen-seo'),
                'type' => 'object',
                'context' => ['view']
            ]
        ]);
    }

    /**
     * Register custom REST routes
     */
    public function register_api_routes()
    {
        // Get unified SEO data by URL (CRITICAL FOR HEADLESS)
        \register_rest_route('zen-seo/v1', '/meta', [
            'methods' => 'GET',
            'callback' => [$this, 'get_meta_by_url'],
            'args' => [
                'url' => [
                    'required' => true,
                    'sanitize_callback' => 'esc_url_raw',
                ],
                'lang' => [
                    'required' => false,
                    'sanitize_callback' => 'sanitize_text_field',
                ],
            ],
            'permission_callback' => '__return_true',
        ]);

        // Get SEO settings
        \register_rest_route('zen-seo/v1', '/settings', [
            'methods' => 'GET',
            'callback' => [$this, 'get_settings'],
            'permission_callback' => '__return_true',
        ]);

        // Get FULL Artist Profile (for SSOT in React)
        \register_rest_route('zen-seo/v1', '/profile', [
            'methods' => 'GET',
            'callback' => [$this, 'get_artist_profile'],
            'permission_callback' => '__return_true',
        ]);

        // Get sitemap data
        \register_rest_route('zen-seo/v1', '/sitemap', [
            'methods' => 'GET',
            'callback' => [$this, 'get_sitemap_data'],
            'permission_callback' => '__return_true',
        ]);

        // Clear cache (admin only)
        \register_rest_route('zen-seo/v1', '/cache/clear', [
            'methods' => 'POST',
            'callback' => [$this, 'clear_cache'],
            'permission_callback' => function () {
                return \current_user_can('manage_options');
            },
        ]);
    }

    /**
     * Get unified SEO data by URL
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_meta_by_url($request)
    {
        $url = $request->get_param('url');
        $lang = $request->get_param('lang');

        // Validate Domain (Security Shield)
        $allowed_domains = ['djzeneyer.com', \wp_parse_url(\home_url(), PHP_URL_HOST)];
        $request_domain = \wp_parse_url($url, PHP_URL_HOST);

        if (!in_array($request_domain, $allowed_domains)) {
            return new \WP_Error('invalid_domain', 'Domain not authorized for SEO metadata', ['status' => 403]);
        }

        // Try cache first - Using sha256 for collision resistance
        $cache_key = 'meta_v3_' . \hash('sha256', $url . $lang);
        $cached = Zen_SEO_Cache::get($cache_key);
        if ($cached) {
            return \rest_ensure_response(['success' => true, 'data' => $cached, 'cached' => true]);
        }

        // Resolve URL to ID
        $post_id = \url_to_postid($url);

        // Special handling for Home or untracked paths
        if (!$post_id) {
            $post_id = $this->resolve_special_urls($url);
        }

        $meta_tags_instance = Zen_SEO_Meta_Tags::get_instance();
        $schema_instance = Zen_SEO_Schema::get_instance();

        if ($post_id) {
            $page_data = $meta_tags_instance->get_post_data($post_id);
            $schema = $schema_instance->generate_schema_for_post($post_id);
        } else {
            $page_data = $meta_tags_instance->get_default_data();
            $schema = $schema_instance->generate_default_schema();
        }

        $data = [
            'title' => $page_data['title'],
            'description' => $page_data['description'],
            'canonical' => $page_data['canonical'],
            'og_image' => $page_data['image'],
            'og_type' => $page_data['og_type'],
            'locale' => $page_data['locale'],
            'robots' => $page_data['noindex'] ? 'noindex, follow' : 'index, follow',
            'translations' => $page_data['translations'],
            'schema' => $schema,
            'published_time' => $page_data['published_time'],
            'modified_time' => $page_data['modified_time'],
        ];

        Zen_SEO_Cache::set($cache_key, $data, \HOUR_IN_SECONDS * 12);

        return \rest_ensure_response([
            'success' => true,
            'data' => $data,
            'cached' => false
        ]);
    }

    /**
     * Resolve special URLs like Home, Archives or specific Polylang paths
     */
    private function resolve_special_urls($url)
    {
        $path = \parse_url($url, \PHP_URL_PATH);
        $path = \trim((string) $path, '/');

        // Home Page check
        if (empty($path) || $path === 'pt' || $path === 'en') {
            return (int) \get_option('page_on_front');
        }

        // Mapping React-only routes to WP Page equivalents or special IDs
        $route_map = Zen_SEO_Helpers::get_mapped_routes();

        // Try to match path to a mapped slug
        if (isset($route_map[$path])) {
            $page = \get_page_by_path($route_map[$path]);
            if ($page) {
                return $page->ID;
            }
        }

        return 0;
    }

    /**
     * Get SEO data for a post
     *
     * @param array $object
     * @return array
     */
    public function get_seo_data($object)
    {
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
     *
     * @param array $object
     * @return array
     */
    public function get_schema_data($object)
    {
        return Zen_SEO_Schema::get_instance()->generate_schema_for_post($object['id']);
    }

    /**
     * Get translations for a post
     *
     * @param array $object
     * @return array
     */
    public function get_translations_data($object)
    {
        return Zen_SEO_Helpers::get_translations($object['id']);
    }

    /**
     * Get global settings
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_settings($request)
    {
        $settings = Zen_SEO_Helpers::get_global_settings();

        // Remove sensitive data from public settings if needed
        // but keep the endpoint functional for general SEO use

        return \rest_ensure_response([
            'success' => true,
            'data' => $settings
        ]);
    }

    /**
     * Get FULL Artist Profile (SSOT)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_artist_profile($request)
    {
        $settings = Zen_SEO_Helpers::get_global_settings();

        // Map data to match React object structure (src/data/artistData.ts)
        $profile = [
            'identity' => [
                'stageName' => $settings['stage_name'] ?? 'DJ Zen Eyer',
                'shortName' => $settings['short_name'] ?? 'Zen Eyer',
                'fullName'  => $settings['real_name'] ?? 'Marcelo Eyer Fernandes',
                'birthDate' => $settings['birth_date'] ?? '1989-08-30',
                'cnpj'      => $settings['cnpj'] ?? '',
                'city'      => $settings['city'] ?? '',
                'state'     => $settings['state'] ?? '',
                'country'   => $settings['country'] ?? 'Brazil',
            ],
            'philosophy' => [
                'slogan'         => $settings['slogan'] ?? '',
                'style'          => $settings['style_name'] ?? '',
                'styleDefinition' => $settings['style_definition'] ?? '',
            ],
            'social' => $this->get_mapped_social_links($settings),
            'payment' => [
                'paypal' => ['me' => $settings['paypal_me'] ?? ''],
                'wise'   => ['url' => $settings['wise_url'] ?? ''],
                'pix'    => ['key' => $settings['pix_key'] ?? ''],
                'inter'  => [
                    'iban'      => $settings['inter_iban'] ?? '',
                    'swift'     => $settings['inter_swift'] ?? '',
                    'bankName'  => $settings['inter_bank_name'] ?? '',
                ]
            ],
            'stats' => [
                'startingYear'    => (int) ($settings['starting_year'] ?? 2015),
                'countriesPlayed' => (int) ($settings['countries_played'] ?? 10),
            ],
            'identifiers' => [
                'isni'        => $settings['isni_code'] ?? '',
                'musicbrainz' => $settings['musicbrainz'] ?? '',
                'wikidata'    => $settings['wikidata'] ?? '',
            ],
            'awards' => !empty($settings['awards_list']) ? \array_filter(\array_map('trim', \explode("\n", (string) ($settings['awards_list'] ?? '')))) : []
        ];

        return \rest_ensure_response([
            'success' => true,
            'data' => $profile
        ]);
    }

    /**
     * Map social settings to structured objects
     */
    private function get_mapped_social_links($settings)
    {
        $social = [];
        $platforms = [
            'instagram', 'youtube', 'facebook', 'spotify', 'soundcloud',
            'mixcloud', 'bandcamp', 'apple_music', 'beatport', 'shazam', 'songkick', 'bandsintown'
        ];

        foreach ($platforms as $platform) {
            $url = (string) ($settings[$platform] ?? '');
            if ($url) {
                // CamelCase keys for React compatibility
                $key = \str_replace(' ', '', \lcfirst(\ucwords(\str_replace('_', ' ', $platform))));
                $social[$key] = [
                    'url' => $url,
                    'handle' => $this->extract_handle($url, $platform)
                ];
            }
        }

        return $social;
    }

    /**
     * Crude handle extractor from URL
     */
    private function extract_handle($url, $platform)
    {
        if (empty($url)) return '';

        // Clean URL: remove fragment and query
        $url = \strtok($url, '#');
        $url = \strtok($url, '?');
        $path = \trim((string) \wp_parse_url($url, \PHP_URL_PATH), '/');
        
        $parts = \explode('/', $path);
        if (empty($parts)) return '';

        $handle = \end($parts);

        // Remove "user" or "channel" prefixes if they exist (common in Youtube)
        if ($handle === 'user' || $handle === 'channel' || $handle === 'c') {
            // Not a real handle, try the previous part
            $handle = $parts[\count($parts)-2] ?? $handle;
        }

        if ($platform === 'instagram' || $platform === 'facebook' || $platform === 'youtube' || $platform === 'twitter' || $platform === 'tiktok') {
            return '@' . $handle;
        }

        return $handle;
    }

    /**
     * Get sitemap data (for React to generate client-side sitemap)
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function get_sitemap_data($request)
    {
        $data = [
            'routes' => [],
            'posts' => [],
            'last_updated' => \current_time('c'),
            'total_urls' => 0
        ];

        // Get posts
        $post_types = Zen_SEO_Helpers::get_supported_post_types();

        $args = [
            'post_type' => $post_types,
            'post_status' => 'publish',
            'posts_per_page' => \apply_filters('zen_seo_sitemap_limit', 1000),
            'orderby' => 'modified',
            'order' => 'DESC',
        ];

        $posts = \get_posts($args);

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
                'slug' => $post->post_name,
                'modified' => \get_post_modified_time('c', true, $post),
                'translations' => $translations,
                'lang' => \function_exists('pll_get_post_language') ? \pll_get_post_language($post->ID) : 'en'
            ];
            $data['total_urls']++;
        }

        return \rest_ensure_response([
            'success' => true,
            'data' => $data
        ]);
    }

    /**
     * Clear all caches
     *
     * @param \WP_REST_Request $request
     * @return \WP_REST_Response
     */
    public function clear_cache($request)
    {
        $cleared = Zen_SEO_Cache::clear_all();

        return \rest_ensure_response([
            'success' => true,
            'message' => \sprintf(\__('Cleared %d cache entries', 'zen-seo'), $cleared),
            'data' => [
                'cleared' => $cleared
            ]
        ]);
    }
}