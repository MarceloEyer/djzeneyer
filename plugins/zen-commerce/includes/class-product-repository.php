<?php
/**
 * Queries WooCommerce products and returns the formatted headless payload.
 * Cache is stored as transients; invalidated on save_post_product (see zen-commerce.php).
 */

if (!defined('ABSPATH')) exit;

class Zen_Commerce_Product_Repository {

    const CACHE_PREFIX  = 'zen_commerce_products_';
    const CACHE_TTL     = 24 * HOUR_IN_SECONDS;

    /**
     * @param array $options {
     *   lang, slug, category, exclude_category, on_sale, featured,
     *   limit, orderby, order, meta_key
     * }
     * @return array[]
     */
    public static function query(array $options = []): array {
        $lang             = sanitize_text_field($options['lang'] ?? 'en');
        $slug             = sanitize_title($options['slug'] ?? '');
        $category         = sanitize_title($options['category'] ?? '');
        $exclude_category = sanitize_title($options['exclude_category'] ?? '');
        $on_sale          = $options['on_sale'] ?? null;
        $featured         = filter_var($options['featured'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $meta_key         = sanitize_key($options['meta_key'] ?? '');
        $limit            = max(1, min(100, (int) ($options['limit'] ?? 10)));
        $orderby          = in_array($options['orderby'] ?? '', ['date', 'title', 'menu_order', 'modified', 'rand', 'meta_value_num'], true)
                            ? $options['orderby']
                            : 'date';
        $order            = in_array(strtoupper($options['order'] ?? ''), ['ASC', 'DESC'], true)
                            ? strtoupper($options['order'])
                            : 'DESC';

        $version = (int) get_option('zen_commerce_products_cache_version', 0);
        $cache_suffix = md5((string) wp_json_encode(compact(
            'lang', 'slug', 'category', 'exclude_category',
            'on_sale', 'featured', 'limit', 'orderby', 'order', 'meta_key'
        )));
        $cache_key = self::CACHE_PREFIX . 'v' . $version . '_' . $cache_suffix;

        $cached = get_transient($cache_key);
        if ($cached !== false && empty($slug)) return $cached;

        $args = [
            'post_type'      => 'product',
            'posts_per_page' => $slug ? 1 : $limit,
            'post_status'    => 'publish',
            'no_found_rows'  => true,
            'orderby'        => $orderby,
            'order'          => $order,
        ];

        if (!empty($meta_key)) $args['meta_key'] = $meta_key;
        if (!empty($slug))     $args['name']      = $slug;

        $tax_query = self::build_tax_query($category, $exclude_category, $featured);
        if (!empty($tax_query)) $args['tax_query'] = $tax_query;

        if (function_exists('pll_get_post_language')) $args['lang'] = $lang;

        if ($on_sale === true) {
            $args['meta_query'] = [['key' => '_sale_price', 'value' => 0, 'type' => 'NUMERIC', 'compare' => '>']];
        }

        $products = self::run_query($args, $on_sale, $slug);

        if (empty($slug)) {
            set_transient($cache_key, $products, self::CACHE_TTL);
        }

        return $products;
    }

    /**
     * Flush all product transients. Called on save_post_product.
     */
    public static function flush_cache(): void {
        $version = (int) get_option('zen_commerce_products_cache_version', 0);
        update_option('zen_commerce_products_cache_version', $version + 1, false);
    }

    // -------------------------------------------------------------------------

    private static function build_tax_query(string $category, string $exclude_category, bool $featured): array {
        $tax_query = [];

        if (!empty($category)) {
            $tax_query[] = ['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => [$category]];
        }
        if (!empty($exclude_category)) {
            $tax_query[] = ['taxonomy' => 'product_cat', 'field' => 'slug', 'terms' => [$exclude_category], 'operator' => 'NOT IN'];
        }
        if ($featured) {
            $tax_query[] = ['taxonomy' => 'product_visibility', 'field' => 'name', 'terms' => 'featured', 'operator' => 'IN'];
        }

        return $tax_query;
    }

    private static function run_query(array $args, $on_sale, string $slug): array {
        $query = new WP_Query($args);
        if (!$query->have_posts()) return [];

        $product_objects    = [];
        $product_ids        = [];
        $all_img_ids        = [];
        $product_images_map = [];
        $is_list_view       = empty($slug);

        while ($query->have_posts()) {
            $query->the_post();
            $product = wc_get_product(get_the_ID());
            if (!$product) continue;
            if ($on_sale === true && !$product->is_on_sale()) continue;

            $product_objects[] = $product;
            $product_ids[]     = $product->get_id();

            $img_ids = Zen_Commerce_Product_Formatter::get_image_ids($product, $is_list_view);
            $product_images_map[$product->get_id()] = $img_ids;

            if (!empty($img_ids)) {
                array_push($all_img_ids, ...array_values($img_ids));
            }
        }

        if (!empty($all_img_ids)) {
            Zen_Commerce_Product_Formatter::prime_thumbnails_cache($all_img_ids);
        }
        if (!empty($product_ids)) {
            update_object_term_cache($product_ids, 'product');
        }

        $products = [];
        foreach ($product_objects as $product) {
            $preloaded = $product_images_map[$product->get_id()] ?? [];
            $products[] = Zen_Commerce_Product_Formatter::format($product, $is_list_view, $preloaded);
        }

        wp_reset_postdata();
        return $products;
    }
}
