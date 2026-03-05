namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
\exit;
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
*/
public function get_meta_by_url($request)
{
$url = $request->get_param('url');
$lang = $request->get_param('lang');

// Try cache first
$cache_key = 'meta_url_v2_' . \md5($url . $lang);
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
$path = \trim($path, '/');

// Home Page check
if (empty($path) || $path === 'pt' || $path === 'en') {
return \get_option('page_on_front');
}

// TODO: Map SPA routes from settings here if needed

return 0;
}

/**
* Get SEO data for a post
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
*/
public function get_schema_data($object)
{
return Zen_SEO_Schema::get_instance()->generate_schema_for_post($object['id']);
}

/**
* Get translations for a post
*/
public function get_translations_data($object)
{
return Zen_SEO_Helpers::get_translations($object['id']);
}

/**
* Get global settings
*/
public function get_settings($request)
{
$settings = Zen_SEO_Helpers::get_global_settings();

// Remove sensitive data
unset($settings['booking_email']);
unset($settings['cnpj']);

return \rest_ensure_response([
'success' => true,
'data' => $settings
]);
}

/**
* Get sitemap data (for React to generate client-side sitemap)
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
'posts_per_page' => 500, // Increased for Pro
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