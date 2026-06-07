<?php
/**
 * Assembles the full shop page view-model in one cached response.
 * Replaces djz_get_shop_page() from inc/api.php.
 */

if (!defined('ABSPATH')) exit;

class Zen_Commerce_Shop_View_Model {

    const CACHE_PREFIX = 'zen_commerce_shop_page_';
    const CACHE_TTL    = 24 * HOUR_IN_SECONDS;

    public static function build(string $lang): array {
        $cache_key = self::CACHE_PREFIX . 'v1_' . sanitize_key($lang);
        $cached    = get_transient($cache_key);
        if ($cached !== false) return $cached;

        $featured = Zen_Commerce_Product_Repository::query([
            'lang'     => $lang,
            'featured' => true,
            'limit'    => 1,
            'orderby'  => 'date',
            'order'    => 'DESC',
        ]);

        $new_releases = Zen_Commerce_Product_Repository::query([
            'lang'             => $lang,
            'exclude_category' => 'featured',
            'limit'            => 10,
            'orderby'          => 'date',
            'order'            => 'DESC',
        ]);

        // Preserve the previous /shop/page behavior: this row is rendered in
        // React with title `badge_sale`, so it should contain products currently
        // on sale rather than true all-time best sellers.
        $sale_products = Zen_Commerce_Product_Repository::query([
            'lang'    => $lang,
            'limit'   => 10,
            'on_sale' => true,
            'orderby' => 'date',
            'order'   => 'DESC',
        ]);

        $curated = Zen_Commerce_Product_Repository::query([
            'lang'    => $lang,
            'limit'   => 10,
            'orderby' => 'date',
            'order'   => 'ASC',
        ]);

        $data = [
            'featured'     => !empty($featured) ? $featured[0] : null,
            'new_releases' => $new_releases,
            // Backwards-compatible key kept for the frontend contract.
            'best_sellers' => $sale_products,
            'curated'      => $curated,
        ];

        set_transient($cache_key, $data, self::CACHE_TTL);
        return $data;
    }

    /**
     * Flush shop page transients. Called alongside Product_Repository::flush_cache().
     */
    public static function flush_cache(): void {
        global $wpdb;
        $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM $wpdb->options WHERE option_name LIKE %s OR option_name LIKE %s",
                '_transient_' . self::CACHE_PREFIX . '%',
                '_transient_timeout_' . self::CACHE_PREFIX . '%'
            )
        );
    }
}
