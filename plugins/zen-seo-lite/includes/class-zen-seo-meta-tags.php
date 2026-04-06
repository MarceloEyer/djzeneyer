<?php
namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
    \exit;
}

class Zen_SEO_Meta_Tags
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
        // Remove default WordPress SEO
        \remove_action('wp_head', 'rel_canonical');
        \remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0);
        \remove_action('wp_head', '_wp_render_title_tag', 1);
        \add_filter('document_title_parts', '__return_empty_array', 9999);

        // Headless mode: meta tags are managed entirely by the React SPA (HeadlessSEO / react-helmet-async).
        // Injecting them here via wp_head() would produce duplicate canonical, OG, hreflang, and
        // Twitter Card tags in the prerendered HTML. The REST API endpoints remain active.
        // \add_action('wp_head', [$this, 'render_meta_tags'], 1);
        // \add_action('wp_head', [$this, 'render_schema'], 2);
    }

    /**
     * Render all meta tags
     */
    public function render_meta_tags()
    {
        $data = $this->get_page_data();

        // Check cache first
        $cache_key = 'meta_' . ($data['post_id'] ?? 'home');
        $cached = Zen_SEO_Cache::get($cache_key);

        if ($cached !== false) {
            echo $cached;
            return;
        }

        \ob_start();

        // Title
        echo '<title>' . \esc_html($data['title']) . '</title>' . "\n";

        // Meta description
        if (!empty($data['description'])) {
            echo '
<meta name="description" content="' . \esc_attr($data['description']) . '">' . "\n";
        }

        // Canonical
        echo '
<link rel="canonical" href="' . \esc_url($data['canonical']) . '">' . "\n";

        // Robots
        if (!empty($data['noindex'])) {
            echo '
<meta name="robots" content="noindex, follow">' . "\n";
        } else {
            echo '
<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">' . "\n";
        }

        // Open Graph
        $this->render_open_graph($data);

        // Twitter Card
        $this->render_twitter_card($data);

        // Hreflang
        $this->render_hreflang($data);

        $output = \ob_get_clean();

        // Cache for 12 hours
        Zen_SEO_Cache::set($cache_key, $output, Zen_SEO_Cache::META_DURATION);

        echo $output;
    }

    /**
     * Render Open Graph tags
     *
     * @param array $data
     * @return void
     */
    private function render_open_graph($data)
    {
        echo '
<meta property="og:locale" content="' . \esc_attr($data['locale']) . '">' . "\n";
        echo '
<meta property="og:type" content="' . \esc_attr($data['og_type']) . '">' . "\n";
        echo '
<meta property="og:title" content="' . \esc_attr($data['title']) . '">' . "\n";

        if (!empty($data['description'])) {
            echo '
<meta property="og:description" content="' . \esc_attr($data['description']) . '">' . "\n";
        }

        echo '
<meta property="og:url" content="' . \esc_url($data['canonical']) . '">' . "\n";
        echo '
<meta property="og:site_name" content="' . \esc_attr((string) \get_bloginfo('name')) . '">' . "\n";

        if (!empty($data['image'])) {
            echo '
<meta property="og:image" content="' . \esc_url($data['image']) . '">' . "\n";
            echo '
<meta property="og:image:width" content="1200">' . "\n";
            echo '
<meta property="og:image:height" content="630">' . "\n";
        }

        if (!empty($data['published_time'])) {
            echo '
<meta property="article:published_time" content="' . \esc_attr($data['published_time']) . '">' . "\n";
        }

        if (!empty($data['modified_time'])) {
            echo '
<meta property="article:modified_time" content="' . \esc_attr($data['modified_time']) . '">' . "\n";
        }
    }

    /**
     * Twitter Card tags
     *
     * @param array $data
     * @return void
     */
    private function render_twitter_card($data)
    {
        echo '
<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '
<meta name="twitter:title" content="' . \esc_attr($data['title']) . '">' . "\n";

        if (!empty($data['description'])) {
            echo '
<meta name="twitter:description" content="' . \esc_attr($data['description']) . '">' . "\n";
        }

        if (!empty($data['image'])) {
            echo '
<meta name="twitter:image" content="' . \esc_url($data['image']) . '">' . "\n";
        }

        // Add Twitter handle if available
        $settings = Zen_SEO_Helpers::get_global_settings();
        if (!empty($settings['twitter'])) {
            $handle = \str_replace('https://twitter.com/', '@', (string) $settings['twitter']);
            echo '
<meta name="twitter:site" content="' . \esc_attr($handle) . '">' . "\n";
            echo '
<meta name="twitter:creator" content="' . \esc_attr($handle) . '">' . "\n";
        }
    }

    /**
     * Render hreflang tags
     *
     * @param array $data
     * @return void
     */
    private function render_hreflang($data)
    {
        if (empty($data['translations'])) {
            return;
        }

        foreach ($data['translations'] as $lang => $url) {
            echo '
<link rel="alternate" hreflang="' . \esc_attr($lang) . '" href="' . \esc_url($url) . '" />' . "\n";
        }

        // x-default should point to default language
        $default_lang = Zen_SEO_Helpers::get_default_language();
        $default_hreflang = Zen_SEO_Helpers::convert_lang_to_hreflang($default_lang);

        if (isset($data['translations'][$default_hreflang])) {
            echo '
<link rel="alternate" hreflang="x-default" href="' . \esc_url($data['translations'][$default_hreflang]) . '" />' . "\n";
        }
    }

    /**
     * Render Schema.org JSON-LD
     */
    public function render_schema()
    {
        $schema = Zen_SEO_Schema::get_instance()->generate_schema();

        if (!empty($schema)) {
            echo '
<script type="application/ld+json">' . "\n";
            echo \wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            echo "\n" . '</script>' . "\n";
        }
    }

    /**
     * Get page data for meta tags (Used by REST API and wp_head)
     *
     * @return array
     */
    public function get_page_data()
    {
        if (Zen_SEO_Helpers::is_supported_post_type()) {
            global $post;
            return $this->get_post_data($post->ID);
        }

        return $this->get_default_data();
    }

    /**
     * Get data for a specific post
     *
     * @param int $post_id
     * @return array
     */
    public function get_post_data($post_id)
    {
        $post = \get_post($post_id);
        if (!$post)
            return $this->get_default_data();

        $meta = Zen_SEO_Helpers::get_post_meta($post_id);
        $settings = Zen_SEO_Helpers::get_global_settings();

        $data = [
            'post_id' => $post_id,
            'title' => !empty($meta['title']) ? $meta['title'] : \get_the_title($post),
            'description' => !empty($meta['desc']) ? $meta['desc'] :
                Zen_SEO_Helpers::generate_excerpt(\get_post_field('post_content', $post)),
            'canonical' => Zen_SEO_Helpers::get_frontend_url(\get_permalink($post)),
            'image' => !empty($meta['image']) ? $meta['image'] : Zen_SEO_Helpers::get_featured_image($post_id),
            'noindex' => !empty($meta['noindex']),
            'translations' => Zen_SEO_Helpers::get_translations($post_id),
            'og_type' => 'article',
            'locale' => 'en_US',
            'published_time' => \get_post_time('c', true, $post),
            'modified_time' => \get_post_modified_time('c', true, $post),
        ];

        // Locale from Polylang
        if (\function_exists('pll_get_post_language')) {
            $lang = \pll_get_post_language($post_id);
            $data['locale'] = $lang === 'pt' ? 'pt_BR' : 'en_US';
        }

        return $this->finalize_data($data, $settings);
    }

    /**
     * Get default global data
     *
     * @return array
     */
    public function get_default_data()
    {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $request_uri = isset($_SERVER['REQUEST_URI']) ? \esc_url_raw($_SERVER['REQUEST_URI']) : '/';

        $data = [
            'post_id' => null,
            'title' => (string) \get_bloginfo('name'),
            'description' => (string) \get_bloginfo('description'),
            'canonical' => Zen_SEO_Helpers::get_frontend_url(\home_url($request_uri)),
            'image' => $settings['default_image'] ?? '',
            'og_type' => 'website',
            'locale' => 'en_US',
            'noindex' => false,
            'translations' => [
                'en' => \home_url('/'),
                'pt-BR' => \home_url('/pt/')
            ],
            'published_time' => '',
            'modified_time' => '',
        ];

        return $this->finalize_data($data, $settings);
    }

    /**
     * Finalize data with fallbacks and site name
     *
     * @param array $data
     * @param array $settings
     * @return array
     */
    private function finalize_data($data, $settings)
    {
        // Fallback image
        if (empty($data['image']) && !empty($settings['default_image'])) {
            $data['image'] = $settings['default_image'];
        }

        // Ensure title has site name
        $site_name = (string) \get_bloginfo('name');
        $data['title'] = (string) ($data['title'] ?? '');

        if (!\str_contains($data['title'], $site_name)) {
            $data['title'] .= ' | ' . $site_name;
        }

        return \apply_filters('zen_seo_page_data', $data);
    }
}