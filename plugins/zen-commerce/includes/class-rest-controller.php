<?php
/**
 * Registers the headless commerce REST endpoints under djzeneyer/v1.
 * Kept under the same namespace as the theme for zero frontend changes.
 */

if (!defined('ABSPATH')) exit;

class Zen_Commerce_REST_Controller {

    const NAMESPACE = 'djzeneyer/v1';
    const SUPPORTED_LANGUAGES = ['en', 'pt'];

    public static function register_routes(): void {
        register_rest_route(self::NAMESPACE, '/products', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [__CLASS__, 'get_products'],
            'permission_callback' => '__return_true',
            'args'                => [
                'lang'             => ['sanitize_callback' => [__CLASS__, 'sanitize_language'], 'validate_callback' => [__CLASS__, 'validate_language'], 'default' => 'en'],
                'slug'             => ['sanitize_callback' => 'sanitize_title',      'default' => ''],
                'category'         => ['sanitize_callback' => 'sanitize_title',      'default' => ''],
                'exclude_category' => ['sanitize_callback' => 'sanitize_title',      'default' => ''],
                'on_sale'          => ['sanitize_callback' => [__CLASS__, 'sanitize_boolean_or_null'], 'default' => null],
                'limit'            => ['sanitize_callback' => [__CLASS__, 'sanitize_limit'], 'default' => 100],
                'orderby'          => ['sanitize_callback' => 'sanitize_key', 'validate_callback' => [__CLASS__, 'validate_orderby'], 'default' => 'date'],
                'order'            => ['sanitize_callback' => [__CLASS__, 'sanitize_order'], 'validate_callback' => [__CLASS__, 'validate_order'], 'default' => 'DESC'],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/products/collections', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [__CLASS__, 'get_collections'],
            'permission_callback' => '__return_true',
            'args'                => [
                'lang'  => ['sanitize_callback' => [__CLASS__, 'sanitize_language'], 'validate_callback' => [__CLASS__, 'validate_language'], 'default' => 'en'],
                'limit' => ['sanitize_callback' => [__CLASS__, 'sanitize_limit'], 'default' => 10],
            ],
        ]);

        register_rest_route(self::NAMESPACE, '/shop/page', [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => [__CLASS__, 'get_shop_page'],
            'permission_callback' => '__return_true',
            'args'                => [
                'lang' => ['sanitize_callback' => [__CLASS__, 'sanitize_language'], 'validate_callback' => [__CLASS__, 'validate_language'], 'default' => 'en'],
            ],
        ]);
    }

    public static function get_products(WP_REST_Request $request): WP_REST_Response {
        $on_sale = $request->get_param('on_sale');

        $products = Zen_Commerce_Product_Repository::query([
            'lang'             => $request->get_param('lang'),
            'slug'             => $request->get_param('slug'),
            'category'         => $request->get_param('category'),
            'exclude_category' => $request->get_param('exclude_category'),
            'on_sale'          => $on_sale,
            'limit'            => $request->get_param('limit'),
            'orderby'          => $request->get_param('orderby'),
            'order'            => $request->get_param('order'),
        ]);

        return rest_ensure_response($products);
    }

    public static function get_collections(WP_REST_Request $request): WP_REST_Response {
        $lang  = $request->get_param('lang');
        $limit = max(1, min(20, (int) $request->get_param('limit')));

        // Use the same version counter as the product repository so both caches
        // are invalidated atomically when Zen_Commerce_Product_Repository::flush_cache() runs.
        $col_version = (int) get_option('zen_commerce_products_cache_version', 0);
        $cache_key = 'zen_commerce_collections_v' . $col_version . '_' . md5($lang . '|' . $limit);
        $cached    = get_transient($cache_key);
        if ($cached !== false) return rest_ensure_response($cached);

        $response = [
            'featured'     => Zen_Commerce_Product_Repository::query(['lang' => $lang, 'featured' => true, 'limit' => 1, 'orderby' => 'date', 'order' => 'DESC']),
            'new_releases' => Zen_Commerce_Product_Repository::query(['lang' => $lang, 'exclude_category' => 'featured', 'limit' => $limit, 'orderby' => 'date', 'order' => 'DESC']),
            'best_sellers' => Zen_Commerce_Product_Repository::query(['lang' => $lang, 'limit' => $limit, 'meta_key' => 'total_sales', 'orderby' => 'meta_value_num', 'order' => 'DESC']),
            'top_picks'    => Zen_Commerce_Product_Repository::query(['lang' => $lang, 'limit' => $limit, 'orderby' => 'rand', 'order' => 'DESC']),
        ];

        set_transient($cache_key, $response, Zen_Commerce_Product_Repository::CACHE_TTL);
        return rest_ensure_response($response);
    }

    public static function get_shop_page(WP_REST_Request $request): WP_REST_Response {
        $data = Zen_Commerce_Shop_View_Model::build($request->get_param('lang'));
        return rest_ensure_response($data);
    }

    public static function sanitize_language($value): string {
        $lang = strtolower(sanitize_key((string) $value));
        return in_array($lang, self::SUPPORTED_LANGUAGES, true) ? $lang : 'en';
    }

    public static function validate_language($value): bool {
        return in_array(strtolower((string) $value), self::SUPPORTED_LANGUAGES, true);
    }

    public static function sanitize_boolean_or_null($value): ?bool {
        if ($value === null || $value === '') {
            return null;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }

    public static function sanitize_limit($value): int {
        return max(1, min(100, absint($value)));
    }

    public static function sanitize_order($value): string {
        return strtoupper(sanitize_text_field((string) $value));
    }

    public static function validate_order($value): bool {
        return in_array(strtoupper((string) $value), ['ASC', 'DESC'], true);
    }

    public static function validate_orderby($value): bool {
        return in_array((string) $value, ['date', 'title', 'menu_order', 'modified', 'rand', 'meta_value_num'], true);
    }
}
