<?php
namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Schema
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
        // Schema is rendered by Zen_SEO_Meta_Tags
    }

    /**
     * Generate schema for current page
     *
     * @return array
     */
    public function generate_schema()
    {
        global $post;

        $post_id = $post->ID ?? 0;
        if ($post_id) {
            return $this->generate_schema_for_post($post_id);
        }

        return $this->generate_default_schema();
    }

    /**
     * Generate schema for a specific post (used by REST API)
     *
     * @param int $post_id
     * @return array
     */
    public function generate_schema_for_post($post_id)
    {
        $post = \get_post($post_id);
        if (!$post) {
            return $this->generate_default_schema();
        }

        // Check cache
        $cache_key = 'schema_' . $post_id;
        $cached = Zen_SEO_Cache::get($cache_key);
        if ($cached !== false) {
            return $cached;
        }

        $schema = [
            '@context' => 'https://schema.org',
            '@graph' => []
        ];

        // Core fragments
        $schema['@graph'][] = $this->generate_person_schema();
        $schema['@graph'][] = $this->generate_webpage_schema($post);
        $schema['@graph'][] = $this->generate_breadcrumb_schema($post);

        // Type-specific logic
        switch ($post->post_type) {
            case 'post':
                $article_schema = $this->generate_article_schema($post);
                if ($article_schema) {
                    $schema['@graph'][] = $article_schema;
                }

                $music_release_schema = $this->generate_music_release_schema($post);
                if ($music_release_schema) {
                    $schema['@graph'][] = $music_release_schema;
                }
                break;
            case 'flyers':
                $event_schema = $this->generate_event_schema($post);
                if ($event_schema)
                    $schema['@graph'][] = $event_schema;
                break;
            case 'remixes':
                $schema['@graph'][] = $this->generate_music_schema($post);
                break;
            case 'product':
                $product_schema = $this->generate_product_schema($post);
                if ($product_schema)
                    $schema['@graph'][] = $product_schema;
                break;
        }

        $schema = \apply_filters('zen_seo_schema', $schema, $post_id);
        Zen_SEO_Cache::set($cache_key, $schema, 3 * \DAY_IN_SECONDS);

        return $schema;
    }

    /**
     * Generate default global schema (for Home or unknown routes)
     *
     * @return array
     */
    public function generate_default_schema()
    {
        $cache_key = 'schema_global_default';
        $cached = Zen_SEO_Cache::get($cache_key);
        if ($cached !== false) {
            return $cached;
        }

        $schema = [
            '@context' => 'https://schema.org',
            '@graph' => [
                $this->generate_person_schema(),
                $this->generate_website_schema()
            ]
        ];

        $schema = \apply_filters('zen_seo_default_schema', $schema);
        Zen_SEO_Cache::set($cache_key, $schema, 3 * \DAY_IN_SECONDS);

        return $schema;
    }

    /**
     * Generate Person schema (the artist)
     *
     * @return array
     */
    private function generate_person_schema()
    {
        $settings = Zen_SEO_Helpers::get_global_settings();

        $blog_name = (string) \get_bloginfo('name');
        $real_name = !empty($settings['real_name']) ? (string) $settings['real_name'] : $blog_name;
        $name = \sanitize_text_field($real_name ?: 'DJ Zen Eyer');

        $person = [
            '@type' => 'Person',
            '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist')),
            'name' => $name,
            'url' => Zen_SEO_Helpers::get_frontend_url(\home_url('/')),
            'jobTitle' => ['DJ', 'Music Producer', 'Remixer'],
            'knowsAbout' => ['Brazilian Zouk', 'Zouk', 'Kizomba', 'Music Production', 'DJing'],
            'gender' => 'Male',
        ];

        // Image
        if (!empty($settings['default_image'])) {
            $person['image'] = \esc_url((string) ($settings['default_image'] ?? ''));
        }

        // Nationality
        $person['nationality'] = [
            '@type' => 'Country',
            'name' => 'Brazil'
        ];

        // Birth place
        if (!empty($settings['birth_place'])) {
            $person['birthPlace'] = [
                '@type' => 'Place',
                'name' => \sanitize_text_field((string) $settings['birth_place'])
            ];
        }

        // Home location
        if (!empty($settings['home_location'])) {
            $person['homeLocation'] = [
                '@type' => 'Place',
                'name' => \sanitize_text_field((string) $settings['home_location'])
            ];
        }

        // ISNI identifier
        if (!empty($settings['isni_code'])) {
            $person['identifier'] = [
                '@type' => 'PropertyValue',
                'propertyID' => 'ISNI',
                'value' => \sanitize_text_field((string) $settings['isni_code'])
            ];
        }

        // Tax ID (CNPJ) - Only if set
        if (!empty($settings['cnpj'])) {
            $person['taxID'] = \sanitize_text_field((string) $settings['cnpj']);
        }

        // Contact point - Only if email is set
        if (!empty($settings['booking_email'])) {
            $person['contactPoint'] = [
                '@type' => 'ContactPoint',
                'email' => \sanitize_email((string) $settings['booking_email']),
                'contactType' => 'booking',
                'areaServed' => 'World'
            ];
        }

        // Mensa membership
        if (!empty($settings['mensa_url'])) {
            $person['memberOf'] = [
                '@type' => 'Organization',
                'name' => 'Mensa International',
                'url' => \esc_url((string) ($settings['mensa_url'] ?? ''))
            ];
        }

        // Awards
        if (!empty($settings['awards_list'])) {
            $awards = \array_filter(\array_map('trim', \explode("\n", (string) ($settings['awards_list'] ?? ''))));
            if (!empty($awards)) {
                $person['award'] = \array_values($awards);
            }
        }

        // SameAs (social profiles)
        $person['sameAs'] = $this->get_same_as_urls($settings);

        return $person;
    }

    /**
     * Generate WebSite schema
     *
     * @return array
     */
    private function generate_website_schema()
    {
        return [
            '@type' => 'WebSite',
            '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#website')),
            'url' => Zen_SEO_Helpers::get_frontend_url(\home_url('/')),
            'name' => (string) \get_bloginfo('name'),
            'description' => (string) \get_bloginfo('description'),
            'publisher' => [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist'))
            ],
            'potentialAction' => [
                '@type' => 'SearchAction',
                'target' => [
                    '@type' => 'EntryPoint',
                    'urlTemplate' => Zen_SEO_Helpers::get_frontend_url(\home_url('/releases')) . '?search={search_term_string}',
                ],
                'query-input' => 'required name=search_term_string',
            ]
        ];
    }

    /**
     * Generate Breadcrumb schema
     *
     * @param \WP_Post|null $post
     * @return array
     */
    private function generate_breadcrumb_schema($post = null)
    {
        $items = [];

        // 1. Home
        $items[] = [
            '@type' => 'ListItem',
            'position' => 1,
            'name' => \__('Home', 'zen-seo'),
            'item' => Zen_SEO_Helpers::get_frontend_url(\home_url('/'))
        ];

        if ($post) {
            // 2. Post Type Archive (if applicable)
            $post_type_obj = \get_post_type_object($post->post_type);
            $position = 2;

            if ($post_type_obj && $post_type_obj->has_archive) {
                $items[] = [
                    '@type' => 'ListItem',
                    'position' => $position++,
                    'name' => $post_type_obj->labels->name,
                    'item' => Zen_SEO_Helpers::get_frontend_url(\get_post_type_archive_link($post->post_type))
                ];
            }

            // 3. Current Page
            $items[] = [
                '@type' => 'ListItem',
                'position' => $position,
                'name' => \get_the_title($post),
                'item' => Zen_SEO_Helpers::get_frontend_url(\get_permalink($post))
            ];
        }

        return [
            '@type' => 'BreadcrumbList',
            '@id' => Zen_SEO_Helpers::get_frontend_url(($post ? \get_permalink($post) : \home_url('/')) . '#breadcrumb'),
            'itemListElement' => $items
        ];
    }

    /**
     * Generate WebPage schema
     *
     * @param \WP_Post $post
     * @return array
     */
    private function generate_webpage_schema($post)
    {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);

        $title = !empty($meta['title']) ? $meta['title'] : \get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(\get_post_field(
            'post_content',
            $post
        ));

        return [
            '@type' => 'WebPage',
            '@id' => Zen_SEO_Helpers::get_frontend_url(\get_permalink($post)) . '#webpage',
            'url' => Zen_SEO_Helpers::get_frontend_url(\get_permalink($post)),
            'name' => \sanitize_text_field((string) $title),
            'description' => \sanitize_text_field((string) $description),
            'datePublished' => \str_replace(' ', 'T', $post->post_date_gmt) . '+00:00',
            'dateModified' => \str_replace(' ', 'T', $post->post_modified_gmt) . '+00:00',
            'publisher' => [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist'))
            ],
            'isPartOf' => [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#website'))
            ]
        ];
    }

    /**
     * Generate Article schema for WordPress posts.
     *
     * @param \WP_Post $post
     * @return array
     */
    private function generate_article_schema($post)
    {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);

        $title = !empty($meta['title']) ? $meta['title'] : \get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(\get_post_field(
            'post_content',
            $post
        ));
        $image = !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post->ID);
        $url = Zen_SEO_Helpers::get_frontend_url(\get_permalink($post));

        $article = [
            '@type' => 'BlogPosting',
            '@id' => $url . '#article',
            'headline' => \sanitize_text_field((string) $title),
            'description' => \sanitize_text_field((string) $description),
            'url' => $url,
            'datePublished' => \str_replace(' ', 'T', $post->post_date_gmt) . '+00:00',
            'dateModified' => \str_replace(' ', 'T', $post->post_modified_gmt) . '+00:00',
            'author' => [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist'))
            ],
            'publisher' => [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist'))
            ],
            'mainEntityOfPage' => [
                '@id' => $url . '#webpage'
            ],
        ];

        if ($image) {
            $article['image'] = \esc_url((string) ($image ?? ''));
        }

        if (!empty($meta['release_type'])) {
            $article['about'] = [
                '@id' => $url . '#music-release'
            ];
        }

        return $article;
    }

    /**
     * Generate Event schema
     *
     * @param \WP_Post $post
     * @return array|null
     */
    private function generate_event_schema($post)
    {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);

        // Event date is required
        if (empty($meta['event_date'])) {
            return null;
        }

        $title = !empty($meta['title']) ? $meta['title'] : \get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(\get_post_field(
            'post_content',
            $post
        ));
        $image = !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post->ID);

        $event = [
            '@type' => 'MusicEvent',
            'name' => \sanitize_text_field((string) $title),
            'description' => \sanitize_text_field((string) $description),
            'startDate' => \sanitize_text_field((string) $meta['event_date']),
            'eventStatus' => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
            'performer' => [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist'))
            ],
        ];

        // Image
        if ($image) {
            $event['image'] = \esc_url((string) ($image ?? ''));
        }

        // Location
        if (!empty($meta['event_location'])) {
            $event['location'] = [
                '@type' => 'Place',
                'name' => \sanitize_text_field((string) $meta['event_location']),
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressCountry' => 'BR'
                ]
            ];
        }

        // Offers (ticket)
        $ticket_url = !empty($meta['event_ticket']) ? $meta['event_ticket'] : Zen_SEO_Helpers::get_frontend_url(\get_permalink($post));
        $event['offers'] = [
            '@type' => 'Offer',
            'url' => \esc_url((string) ($ticket_url ?? '')),
            'availability' => 'https://schema.org/InStock'
        ];

        return $event;
    }

    /**
     * Generate MusicRecording or MusicAlbum schema for release posts.
     *
     * @param \WP_Post $post
     * @return array|null
     */
    private function generate_music_release_schema($post)
    {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
        $release_type = \sanitize_key((string) ($meta['release_type'] ?? ''));

        if (empty($release_type)) {
            return null;
        }

        $album_types = ['album', 'ep'];
        $schema_type = \in_array($release_type, $album_types, true) ? 'MusicAlbum' : 'MusicRecording';
        $title = !empty($meta['title']) ? $meta['title'] : \get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(\get_post_field(
            'post_content',
            $post
        ));
        $image = !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post->ID);
        $url = Zen_SEO_Helpers::get_frontend_url(\get_permalink($post));
        $artist_name = !empty($meta['primary_artist']) ? \sanitize_text_field((string) $meta['primary_artist']) : '';

        $music = [
            '@type' => $schema_type,
            '@id' => $url . '#music-release',
            'name' => \sanitize_text_field((string) $title),
            'description' => \sanitize_text_field((string) $description),
            'url' => $url,
            'datePublished' => !empty($meta['release_date'])
                ? \sanitize_text_field((string) $meta['release_date'])
                : \str_replace(' ', 'T', $post->post_date_gmt) . '+00:00',
            'byArtist' => $artist_name ? [
                '@type' => 'MusicGroup',
                'name' => $artist_name,
            ] : [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#musicgroup'))
            ],
            'mainEntityOfPage' => [
                '@id' => $url . '#webpage'
            ],
        ];

        if ($image) {
            $music['image'] = \esc_url((string) ($image ?? ''));
        }

        if (!empty($meta['isrc_code']) && $schema_type === 'MusicRecording') {
            $music['isrcCode'] = \sanitize_text_field((string) $meta['isrc_code']);
        }

        $same_as = $this->get_music_release_same_as($meta);
        if (!empty($same_as)) {
            $music['sameAs'] = $same_as;
        }

        $contributors = $this->get_music_release_contributors((string) ($meta['contributors'] ?? ''));
        if (!empty($contributors)) {
            $music['contributor'] = $contributors;
        }

        return $music;
    }

    /**
     * Get official release-specific URLs for sameAs.
     *
     * @param array $meta
     * @return array<string>
     */
    private function get_music_release_same_as($meta)
    {
        $fields = [
            'spotify_url',
            'apple_music_url',
            'youtube_url',
            'soundcloud_url',
            'musicbrainz_url',
        ];

        $urls = [];
        foreach ($fields as $field) {
            $value = \trim((string) ($meta[$field] ?? ''));
            if ($value !== '') {
                $urls[] = \esc_url($value);
            }
        }

        return \array_values(\array_filter(\array_unique($urls)));
    }

    /**
     * Normalize line-separated contributor names.
     *
     * @param string $contributors
     * @return array<int, array<string, string>>
     */
    private function get_music_release_contributors($contributors)
    {
        $contributors = \str_replace(',', "\n", $contributors);
        $names = \array_filter(\array_map('trim', \explode("\n", $contributors)));

        return \array_values(\array_map(function ($name) {
            return [
                '@type' => 'Person',
                'name' => \sanitize_text_field((string) $name),
            ];
        }, $names));
    }

    /**
     * Generate MusicRecording schema
     *
     * @param \WP_Post $post
     * @return array
     */
    private function generate_music_schema($post)
    {
        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);

        $title = !empty($meta['title']) ? $meta['title'] : \get_the_title($post);
        $description = !empty($meta['desc']) ? $meta['desc'] : Zen_SEO_Helpers::generate_excerpt(\get_post_field(
            'post_content',
            $post
        ));
        $image = !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post->ID);

        $music = [
            '@type' => 'MusicRecording',
            'name' => \sanitize_text_field((string) $title),
            'description' => \sanitize_text_field((string) $description),
            'datePublished' => \str_replace(' ', 'T', $post->post_date_gmt) . '+00:00',
            'byArtist' => [
                '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist'))
            ],
        ];

        if ($image) {
            $music['image'] = \esc_url((string) ($image ?? ''));
        }

        // Get audio URL from custom fields
        $audio_url = (string) \get_post_meta($post->ID, 'audio_url', true);
        if ($audio_url) {
            $music['audio'] = \esc_url((string) $audio_url);
        }

        // Genre from tags
        $tags = \get_the_terms($post->ID, 'music_tags');
        if ($tags && !\is_wp_error($tags)) {
            $music['genre'] = \array_map(function ($tag) {
                return $tag->name;
            }, $tags);
        }

        return $music;
    }

    /**
     * Generate Product schema (WooCommerce)
     *
     * @param \WP_Post $post
     * @return array|null
     */
    private function generate_product_schema($post)
    {
        if (!\function_exists('wc_get_product')) {
            return null;
        }

        $product = \wc_get_product($post->ID);

        if (!$product) {
            return null;
        }

        $schema = [
            '@type' => 'Product',
            'name' => $product->get_name(),
            'description' => \wp_strip_all_tags((string) $product->get_description()),
            'sku' => $product->get_sku(),
            'image' => \esc_url((string) \wp_get_attachment_url($product->get_image_id())),
            'offers' => [
                '@type' => 'Offer',
                'url' => Zen_SEO_Helpers::get_frontend_url(\get_permalink($post)),
                'priceCurrency' => \get_woocommerce_currency(),
                'price' => $product->get_price(),
                'availability' => $product->is_in_stock() ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                'seller' => [
                    '@id' => Zen_SEO_Helpers::get_frontend_url(\home_url('/#artist'))
                ]
            ]
        ];

        return $schema;
    }

    /**
     * Get sameAs URLs from settings
     *
     */
    private function get_same_as_urls($settings)
    {
        $urls = [];

        // Google Knowledge Graph
        $kg = \trim((string) ($settings['google_kg'] ?? ''));
        if ($kg !== '') {
            if (\strpos($kg, 'http') === 0) {
                $urls[] = \esc_url($kg);
            } else {
                $urls[] = 'https://g.co/kg' . $kg;
            }
        }

        // Social and music platforms
        $platforms = [
            'musicbrainz',
            'wikidata',
            'beatport',
            'spotify',
            'apple_music',
            'shazam',
            'soundcloud',
            'mixcloud',
            'bandcamp',
            'songkick',
            'bandsintown',
            'instagram',
            'youtube',
            'facebook',
            'ranker_list',
        ];

        foreach ($platforms as $platform) {
            $value = \trim((string) ($settings[$platform] ?? ''));
            if ($value !== '') {
                $urls[] = \esc_url($value);
            }
        }

        return \array_values(\array_filter($urls));
    }
}
