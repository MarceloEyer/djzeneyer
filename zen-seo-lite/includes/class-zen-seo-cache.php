<?php
/**
 * Cache management
 *
 * @package Zen_SEO_Lite_Pro
 * @since 8.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Cache {
    
    /**
     * Cache durations
     */
    const SITEMAP_DURATION = 2 * DAY_IN_SECONDS;
    const SCHEMA_DURATION = DAY_IN_SECONDS;
    const META_DURATION = 12 * HOUR_IN_SECONDS;
    
    /**
     * Get cached data
     *
     * @param string $key
     * @return mixed|false
     */
    public static function get($key) {
        return get_transient(self::get_cache_key($key));
    }
    
    /**
     * Set cached data
     *
     * @param string $key
     * @param mixed $data
     * @param int $expiration
     * @return bool
     */
    public static function set($key, $data, $expiration = null) {
        if ($expiration === null) {
            $expiration = self::META_DURATION;
        }
        
        return set_transient(self::get_cache_key($key), $data, $expiration);
    }
    
    /**
     * Delete cached data
     *
     * @param string $key
     * @return bool
     */
    public static function delete($key) {
        return delete_transient(self::get_cache_key($key));
    }
    
    /**
     * Clear all plugin caches
     *
     * @return int Number of caches cleared
     */
    public static function clear_all() {
        global $wpdb;
        
        $count = $wpdb->query(
            $wpdb->prepare(
                "DELETE FROM {$wpdb->options} 
                WHERE option_name LIKE %s 
                OR option_name LIKE %s",
                '_transient_zen_seo_%',
                '_transient_timeout_zen_seo_%'
            )
        );
        
        Zen_SEO_Helpers::log('Cleared all caches', ['count' => $count]);
        
        return $count;
    }
    
    /**
     * Clear sitemap cache
     */
    public static function clear_sitemap() {
        self::delete('sitemap');
        Zen_SEO_Helpers::log('Cleared sitemap cache');
    }
    
    /**
     * Clear schema cache for a post
     *
     * @param int $post_id
     */
    public static function clear_schema($post_id) {
        self::delete('schema_' . $post_id);
        Zen_SEO_Helpers::log('Cleared schema cache', ['post_id' => $post_id]);
    }
    
    /**
     * Clear meta cache for a post
     *
     * @param int $post_id
     */
    public static function clear_meta($post_id) {
        self::delete('meta_' . $post_id);
        Zen_SEO_Helpers::log('Cleared meta cache', ['post_id' => $post_id]);
    }
    
    /**
     * Get full cache key with prefix
     *
     * @param string $key
     * @return string
     */
    private static function get_cache_key($key) {
        return 'zen_seo_' . $key;
    }
    
    /**
     * Get cache statistics
     *
     * @return array
     */
    public static function get_stats() {
        global $wpdb;
        
        $total = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT COUNT(*) FROM {$wpdb->options} 
                WHERE option_name LIKE %s",
                '_transient_zen_seo_%'
            )
        );
        
        $size = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT SUM(LENGTH(option_value)) FROM {$wpdb->options} 
                WHERE option_name LIKE %s",
                '_transient_zen_seo_%'
            )
        );
        
        return [
            'total_items' => (int) $total,
            'total_size' => (int) $size,
            'size_formatted' => size_format($size),
        ];
    }
}
