<?php
/**
 * ZenGame Triggers Engine
 * Listens to WP hooks and awards points securely
 */
namespace ZenEyer\GamePro\Core;

if (!defined('ABSPATH')) {
    die;
}

class Triggers {

    public function __construct() {
        // Daily Login Trigger
        \add_action('wp_login', [$this, 'daily_login'], 10, 2);

        // WooCommerce Purchase Trigger
        \add_action('woocommerce_order_status_completed', [$this, 'woocommerce_purchase'], 10, 1);

        // Custom Hook for Quizzes / Missions (to be called by REST API later)
        \add_action('zengamepro_mission_completed', [$this, 'mission_completed'], 10, 2);
    }

    /**
     * Trigger: Daily Login
     * Awards 10 points once a day.
     */
    public function daily_login($user_login, $user) {
        $user_id = $user->ID;
        $today = gmdate('Y-m-d');

        // Check if user already got points today
        $last_login_date = \get_user_meta($user_id, '_zengame_last_login_date', true);

        if ($last_login_date !== $today) {
            $yesterday = \gmdate('Y-m-d', \strtotime('-1 day'));
            $current_streak = (int) \get_user_meta($user_id, '_zengame_login_streak', true);
            
            // Increment streak if logged in yesterday, otherwise restart
            if ($last_login_date === $yesterday) {
                $new_streak = $current_streak + 1;
            } else {
                $new_streak = 1;
            }
            
            \update_user_meta($user_id, '_zengame_login_streak', $new_streak);
            \update_user_meta($user_id, '_zengame_last_login_date', $today);

            // Award 10 points
            Engine::award_points(
                $user_id,
                10,
                'daily_login',
                0,
                'system',
                'Pontos por login diário.'
            );
        }
    }

    /**
     * Trigger: WooCommerce Purchase
     * Awards 1 point for every spend.
     */
    public function woocommerce_purchase($order_id) {
        if (!\function_exists('wc_get_order')) {
            return;
        }

        $order = \wc_get_order($order_id);
        if (!$order) {
            return;
        }

        $user_id = $order->get_user_id();
        if (!$user_id) {
            return; // Guest checkout
        }

        // Check if we already rewarded this order (Idempotency)
        $already_rewarded = \get_post_meta($order_id, '_zengamepro_points_awarded', true);
        if ($already_rewarded) {
            return;
        }

        $total = (float) $order->get_total();
        // 1 point per $1
        $points_to_award = (int) floor($total);

        if ($points_to_award > 0) {
            Engine::award_points(
                $user_id,
                $points_to_award,
                'woo_purchase',
                $order_id,
                'order',
                'Pontos por compra na loja (Pedido #' . $order_id . ').'
            );

            // Mark as rewarded
            \update_post_meta($order_id, '_zengamepro_points_awarded', $points_to_award);
            
            // Restore User Stats: totalTracks and eventsAttended
            $this->update_user_purchase_stats($user_id, $order);
        }
    }

    /**
     * Trigger: Mission/Quiz Completed
     */
    public function mission_completed($user_id, $mission_id) {
        // Validation: Verify if the mission exists and is a zengame_mission
        if (\get_post_type($mission_id) !== 'zengame_mission') {
            return false;
        }

        // Idempotency: Has the user already completed this mission?
        global $wpdb;
        $table = $wpdb->prefix . 'zengame_logs';

        $already_completed = $wpdb->get_var($wpdb->prepare(
            "SELECT id FROM $table WHERE user_id = %d AND action = %s AND reference_id = %d LIMIT 1",
            $user_id,
            'mission_completed',
            $mission_id
        ));

        if ($already_completed) {
            return false; // Prevent duplicate points
        }

        // How many points is this mission worth?
        $points = (int) \get_post_meta($mission_id, '_zengame_points_reward', true);
        if ($points <= 0) {
            $points = 10; // Fallback
        }

        $mission_title = \get_the_title($mission_id);

        Engine::award_points(
            $user_id,
            $points,
            'mission_completed',
            $mission_id,
            'mission',
            'Missão Concluída: ' . $mission_title
        );

        return true;
    }

    /**
     * Unified Stat Update: totalTracks and eventsAttended from order items
     * ⚡ Bolt: Logic migrated from the original ZenGame logic to restore O(1) stats lookup
     */
    private function update_user_purchase_stats($user_id, $order) {
        $total_tracks_to_add = 0;
        $total_events_to_add = 0;
        
        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            if (!$product) continue;
            
            // Check for downloadable tracks
            if ($product->is_downloadable()) {
                $total_tracks_to_add++;
            }
            
            // Check for event categories
            $terms = \wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'slugs']);
            if (!\is_wp_error($terms) && (in_array('events', $terms) || in_array('eventos', $terms))) {
                $total_events_to_add++;
            }
        }
        
        if ($total_tracks_to_add > 0) {
            $current = (int) \get_user_meta($user_id, 'zengame_total_tracks', true);
            \update_user_meta($user_id, 'zengame_total_tracks', $current + $total_tracks_to_add);
        }
        
        if ($total_events_to_add > 0) {
            $current = (int) \get_user_meta($user_id, 'zengame_events_attended', true);
            \update_user_meta($user_id, 'zengame_events_attended', $current + $total_events_to_add);
        }
    }
}
