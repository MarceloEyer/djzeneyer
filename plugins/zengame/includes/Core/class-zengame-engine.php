<?php
/**
 * Core Gaming Engine
 * Handles Point calculations, Ranks, and Achievements
 */
namespace ZenEyer\Game\Core;

if (!defined('ABSPATH')) {
    die;
}

class Engine {

    public function __construct() {
        // Init logic will go here
    }

    /**
     * Award Points to User
     * This is the SSOT for point distribution and logging.
     */
    public static function award_points($user_id, $amount, $action, $ref_id = 0, $ref_type = '', $description = '') {
        if (!$user_id || $amount == 0) {
            return false;
        }

        global $wpdb;
        $table = $wpdb->prefix . 'zengame_logs';

        // 1. Log the transaction
        $wpdb->insert(
            $table,
            [
                'user_id' => $user_id,
                'action' => $action,
                'points' => $amount,
                'reference_id' => $ref_id,
                'reference_type' => $ref_type,
                'description' => $description,
            ],
            ['%d', '%s', '%d', '%d', '%s', '%s']
        );

        // 2. Update User Balance (Meta) for fast retrieval
        $current_balance = (int) \get_user_meta($user_id, 'zengame_points_balance', true);
        $new_balance = $current_balance + $amount;

        // Never go below 0
        if ($new_balance < 0) {
            $new_balance = 0;
        }

        \update_user_meta($user_id, 'zengame_points_balance', $new_balance);

        // 3. Clear Caches
        self::clear_user_cache($user_id);

        // 4. Check for Rank Ups or Coupons (Future hook)
        \do_action('zengame_points_awarded', $user_id, $new_balance, $amount, $action);

        return $new_balance;
    }

    /**
     * Clear Gamipress/ZenGame cache transients
     */
    public static function clear_user_cache($user_id) {
        global $wpdb;
        $like = '%_transient_djz_gamipress_%' . $user_id . '%';
        $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $like));
    }
}
