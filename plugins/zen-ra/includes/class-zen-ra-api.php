<?php
/**
 * Zen-RA API Class
 * Handles activity fetching from WooCommerce and GamiPress
 */

if (!defined('ABSPATH')) exit;

class Zen_RA_API {
    
    /**
     * Permission check - only allow user to see their own activity or admin
     */
    public static function permissions_check($request) {
        $user_id = $request->get_param('id');
        $current_user = get_current_user_id();
        
        if (!$current_user) {
            return new WP_Error(
                'rest_forbidden',
                __('You must be logged in to view activity.', 'zen-ra'),
                array('status' => 401)
            );
        }
        
        // Allow if viewing own profile or is admin (strict comparison prevents type juggling)
        return ($current_user === (int)$user_id || current_user_can('manage_options'));
    }
    
    /**
     * Get user activity (main endpoint)
     */
    public static function get_activity($request) {
        $user_id = $request->get_param('id');
        
        // Check cache first
        $cache_key = 'zen_ra_activity_' . $user_id;
        $cached = get_transient($cache_key);
        
        if (false !== $cached) {
            return rest_ensure_response(array(
                'success' => true,
                'cached' => true,
                'user_id' => $user_id,
                'count' => count($cached),
                'activities' => $cached
            ));
        }
        
        $activities = array();
        
        // Fetch WooCommerce orders
        $orders = self::fetch_woocommerce_orders($user_id);
        $activities = array_merge($activities, $orders);
        
        // Fetch GamiPress achievements
        $achievements = self::fetch_gamipress_achievements($user_id);
        $activities = array_merge($activities, $achievements);
        
        // Sort by timestamp (newest first)
        usort($activities, function($a, $b) {
            return $b['timestamp'] - $a['timestamp'];
        });
        
        // Limit total activities
        $total_limit = (int) get_option('zen_ra_total_limit', 10);
        $activities = array_slice($activities, 0, $total_limit);
        
        // Cache for configured time
        $cache_time = (int) get_option('zen_ra_cache_time', 600);
        set_transient($cache_key, $activities, $cache_time);
        
        return rest_ensure_response(array(
            'success' => true,
            'cached' => false,
            'user_id' => $user_id,
            'count' => count($activities),
            'activities' => $activities
        ));
    }
    
    /**
     * Fetch WooCommerce orders
     */
    private static function fetch_woocommerce_orders($user_id) {
        $activities = array();
        
        if (!class_exists('WooCommerce')) {
            return $activities;
        }
        
        $limit = (int) get_option('zen_ra_orders_limit', 5);
        $order_xp = (int) get_option('zen_ra_order_xp', 50);
        
        $orders = wc_get_orders(array(
            'customer_id' => $user_id,
            'limit' => $limit,
            'orderby' => 'date',
            'order' => 'DESC',
            'status' => array('completed', 'processing')
        ));
        
        foreach ($orders as $order) {
            $items = $order->get_items();
            $item_names = array();
            
            foreach ($items as $item) {
                $item_names[] = $item->get_name();
            }
            
            $activities[] = array(
                'id' => 'order_' . $order->get_id(),
                'type' => 'loot',
                'title' => __('Adquiriu Artefato Musical', 'zen-ra'),
                'description' => implode(', ', $item_names),
                'xp' => $order_xp,
                'date' => $order->get_date_created()->date('Y-m-d H:i:s'),
                'timestamp' => $order->get_date_created()->getTimestamp(),
                'meta' => array(
                    'order_id' => $order->get_id(),
                    'total' => $order->get_total(),
                    'currency' => $order->get_currency(),
                    'status' => $order->get_status()
                )
            );
        }
        
        return $activities;
    }
    
    /**
     * Fetch GamiPress achievements
     */
    private static function fetch_gamipress_achievements($user_id) {
        $activities = array();
        
        if (!function_exists('gamipress_get_user_earnings')) {
            return $activities;
        }
        
        $limit = (int) get_option('zen_ra_achievements_limit', 5);
        $achievement_xp = (int) get_option('zen_ra_achievement_xp', 10);
        
        try {
            $earnings = gamipress_get_user_earnings($user_id, array(
                'limit' => $limit,
                'orderby' => 'date',
                'order' => 'DESC',
                'post_type' => gamipress_get_achievement_types_slugs()
            ));
            
            foreach ($earnings as $earning) {
                // Try to get points from post meta
                $points = (int) get_post_meta($earning->post_id, '_gamipress_points', true);
                if ($points <= 0) {
                    $points = $achievement_xp;
                }
                
                $activities[] = array(
                    'id' => 'ach_' . $earning->user_earning_id,
                    'type' => 'achievement',
                    'title' => __('Desbloqueou Conquista Épica', 'zen-ra'),
                    'description' => get_the_title($earning->post_id),
                    'xp' => $points,
                    'date' => $earning->date,
                    'timestamp' => strtotime($earning->date),
                    'meta' => array(
                        'achievement_id' => $earning->post_id,
                        'earning_id' => $earning->user_earning_id,
                        'post_type' => get_post_type($earning->post_id)
                    )
                );
            }
        } catch (Exception $e) {
            error_log('Zen-RA: Error fetching GamiPress achievements - ' . $e->getMessage());
        }
        
        return $activities;
    }
    
    /**
     * Clear cache on new order
     */
    public static function clear_cache_on_order($order_id) {
        $order = wc_get_order($order_id);
        if ($order) {
            $user_id = $order->get_customer_id();
            if ($user_id) {
                delete_transient('zen_ra_activity_' . $user_id);
                error_log('Zen-RA: Cache cleared for user ' . $user_id . ' (new order)');
            }
        }
    }
    
    /**
     * Clear cache on order status change
     */
    public static function clear_cache_on_order_status($order_id) {
        self::clear_cache_on_order($order_id);
    }
    
    /**
     * Clear cache on new achievement
     */
    public static function clear_cache_on_achievement($user_id, $achievement_id) {
        delete_transient('zen_ra_activity_' . $user_id);
        error_log('Zen-RA: Cache cleared for user ' . $user_id . ' (new achievement)');
    }
    
    /**
     * Clear cache on points update
     */
    public static function clear_cache_on_points($user_id) {
        delete_transient('zen_ra_activity_' . $user_id);
        error_log('Zen-RA: Cache cleared for user ' . $user_id . ' (points update)');
    }
    
    /**
     * Clear cache endpoint (admin only)
     */
    public static function clear_cache_endpoint($request) {
        $user_id = $request->get_param('id');
        $deleted = delete_transient('zen_ra_activity_' . $user_id);
        
        return rest_ensure_response(array(
            'success' => true,
            'message' => $deleted ? 'Cache cleared successfully' : 'No cache found',
            'user_id' => $user_id
        ));
    }
}
