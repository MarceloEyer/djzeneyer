<?php
/**
 * Core Game Engine for ZenGame Pro
 *
 * @package ZenGamePro
 * @since 1.4.0
 */

namespace ZenEyer\GamePro\Core;
 
 use ZenEyer\GamePro\Core\Constants;

 if (!defined('ABSPATH')) {
    exit;
}

/**
 * Engine Class
 * 
 * Handles the standalone point economy, custom logs, and elite caching.
 */
class Engine
{
    /**
     * Award points to a user
     * 
     * @param int    $user_id
     * @param int    $amount
     * @param string $action
     * @param int    $reference_id
     * @param string $reference_type
     * @param string $description
     * @return int New balance
     */
    public static function award_points($user_id, $amount, $action, $reference_id = 0, $reference_type = '', $description = '') {
        global $wpdb;

        if ($amount === 0) return self::get_user_balance($user_id);

        // 1. Immutable Ledger (Log)
        $table_name = $wpdb->prefix . 'zengame_logs';
        $wpdb->insert($table_name, [
            'user_id'        => $user_id,
            'action'         => $action,
            'points'         => $amount,
            'reference_id'   => $reference_id,
            'reference_type' => $reference_type,
            'description'    => $description,
            'created_at'     => \current_time('mysql')
        ]);

        // 2. Update Fast Balance Cache (User Meta) - ATOMIC UPDATE
        $updated = $wpdb->query($wpdb->prepare(
            "UPDATE {$wpdb->usermeta} SET meta_value = CAST(meta_value AS SIGNED) + %d WHERE user_id = %d AND meta_key = %s",
            $amount,
            $user_id,
            Constants::POINTS_BALANCE
        ));

        if (!$updated && !self::get_user_balance($user_id)) {
            \add_user_meta($user_id, Constants::POINTS_BALANCE, (string)$amount, true);
        }

        $new_balance = self::get_user_balance($user_id);

        // 3. Purge Transients
        self::clear_user_cache($user_id);

        // 4. Trigger Hook for Rank Ups or Notifications
        \do_action('zengamepro_points_awarded', $user_id, $new_balance, $amount, $action);

        return $new_balance;
    }

    /**
     * Get user point balance
     */
    public static function get_user_balance($user_id) {
        return (int) \get_user_meta($user_id, Constants::POINTS_BALANCE, true);
    }

    /**
     * Get user's current rank
     */
    public static function get_user_rank($user_id) {
        $points = self::get_user_balance($user_id);
        
        $ranks = \get_posts([
            'post_type'      => 'zengame_rank',
            'posts_per_page' => -1,
            'meta_key'       => Constants::POINTS_REQUIRED,
            'orderby'        => 'meta_value_num',
            'order'          => 'DESC'
        ]);

        foreach ($ranks as $rank) {
            $required = (int) \get_post_meta($rank->ID, Constants::POINTS_REQUIRED, true);
            if ($points >= $required) {
                return [
                    'id'    => $rank->ID,
                    'title' => $rank->post_title,
                    'icon'  => \get_the_post_thumbnail_url($rank->ID, 'thumbnail')
                ];
            }
        }

        return ['title' => 'Iniciante', 'icon' => ''];
    }

    /**
     * Clear user cache transients
     */
    public static function clear_user_cache($user_id) {
        global $wpdb;
        // Generic pattern for ZenGame Pro transients
        $like = '%_transient_djz_zengame_' . $user_id . '%';
        $wpdb->query($wpdb->prepare("DELETE FROM {$wpdb->options} WHERE option_name LIKE %s", $like));
    }
}
