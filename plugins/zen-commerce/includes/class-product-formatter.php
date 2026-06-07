<?php
/**
 * Formats a WC_Product into the JSON shape used by the headless frontend.
 * Single source of truth for product serialization — eliminates the duplication
 * that previously existed between djz_query_products and djz_get_shop_page.
 */

if (!defined('ABSPATH')) exit;

class Zen_Commerce_Product_Formatter {

    /**
     * @param WC_Product $product
     * @param bool       $is_list_view      true = only first image, no full description
     * @param int[]|null $preloaded_img_ids Pre-computed image IDs (batch optimization). If null, computes internally.
     * @return array
     */
    public static function format(WC_Product $product, bool $is_list_view = false, ?array $preloaded_img_ids = null): array {
        $img_ids = $preloaded_img_ids ?? self::get_image_ids($product, $is_list_view);
        $images  = self::format_images($img_ids, $is_list_view);

        $categories = wp_get_post_terms($product->get_id(), 'product_cat');
        if (is_wp_error($categories)) $categories = [];

        return [
            'id'                => $product->get_id(),
            'name'              => $product->get_name(),
            'slug'              => $product->get_slug(),
            'price'             => $product->get_price(),
            'regular_price'     => $product->get_regular_price(),
            'sale_price'        => $product->get_sale_price(),
            'on_sale'           => $product->is_on_sale(),
            'stock_status'      => $product->get_stock_status(),
            'images'            => $images,
            'short_description' => $product->get_short_description(),
            'description'       => $is_list_view ? '' : $product->get_description(),
            'permalink'         => $product->get_permalink(),
            'categories'        => array_map(
                static fn($term) => ['id' => $term->term_id, 'name' => $term->name, 'slug' => $term->slug],
                $categories
            ),
        ];
    }

    /**
     * Returns image IDs for a product. In list view only the first image is returned.
     *
     * @param WC_Product $product
     * @param bool       $is_list_view
     * @return int[]
     */
    public static function get_image_ids(WC_Product $product, bool $is_list_view = false): array {
        $ids = $product->get_gallery_image_ids();
        $featured_id = $product->get_image_id();

        if ($featured_id) {
            array_unshift($ids, $featured_id);
            $ids = array_unique($ids);
        }

        if ($is_list_view && !empty($ids)) {
            return array_slice($ids, 0, 1);
        }

        return $ids;
    }

    /**
     * Prime the WP thumbnail/post caches for a batch of attachment IDs.
     *
     * @param int[] $ids
     */
    public static function prime_thumbnails_cache(array $ids): void {
        if (empty($ids)) return;
        $ids = array_unique(array_map('intval', $ids));

        if (function_exists('_prime_post_caches')) {
            _prime_post_caches($ids, false, true);
        }
    }

    // -------------------------------------------------------------------------

    private static function format_images(array $img_ids, bool $is_list_view): array {
        $sizes_to_fetch = $is_list_view
            ? ['medium', 'medium_large']
            : ['thumbnail', 'medium', 'medium_large', 'large'];

        $images = [];
        foreach ($img_ids as $img_id) {
            $src = wp_get_attachment_url($img_id);
            if (!$src) continue;

            $img_data = [
                'id'  => $img_id,
                'src' => $src,
                'alt' => get_post_meta($img_id, '_wp_attachment_image_alt', true),
            ];

            $meta     = wp_get_attachment_metadata($img_id);
            $base_url = trailingslashit(dirname((string) $src));
            $img_sizes = [];

            foreach ($sizes_to_fetch as $size) {
                if (is_array($meta) && isset($meta['sizes'][$size]['file'])) {
                    $file_url = $base_url . $meta['sizes'][$size]['file'];
                    $img_sizes[$size] = apply_filters('wp_get_attachment_url', $file_url, $img_id);
                } else {
                    $img_sizes[$size] = $src;
                }
            }

            if (!empty($img_sizes)) {
                $img_data['sizes'] = $img_sizes;
            }

            $images[] = $img_data;
        }
        return $images;
    }
}
