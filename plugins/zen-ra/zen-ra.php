<?php
/**
 * Plugin Name: Zen-RA (Zen Recent Activity & Gamification)
 * Version: 3.1.0-SAFE
 * Description: Engine de Gamificação com proteção contra erros
 */

if (!defined('ABSPATH')) exit;

class Zen_RA {

    private static $instance = null;
    const CACHE_GROUP = 'zen_ra_cache';

    public static function get_instance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('gamipress_award_points', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('gamipress_award_achievement', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('woocommerce_order_status_completed', [$this, 'clear_order_cache_hook'], 10, 1);
        add_action('wp_login', [$this, 'update_login_streak'], 10, 2);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function add_admin_menu() {
        add_submenu_page(
            'options-general.php',
            'Zen Gamification',
            'Zen Gamification',
            'manage_options',
            'zen-ra-settings',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings() {
        register_setting('zen_ra_opts', 'zen_ra_order_xp', ['default' => 50, 'sanitize_callback' => 'absint']);
        register_setting('zen_ra_opts', 'zen_ra_achievement_default_xp', ['default' => 10, 'sanitize_callback' => 'absint']);
        register_setting('zen_ra_opts', 'zen_ra_cache_ttl', ['default' => 600, 'sanitize_callback' => 'absint']);
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>🎛️ Zen Gamification Control</h1>
            <form method="post" action="options.php">
                <?php settings_fields('zen_ra_opts'); ?>
                <table class="form-table">
                    <tr>
                        <th>XP por Compra</th>
                        <td><input type="number" name="zen_ra_order_xp" value="<?php echo esc_attr(get_option('zen_ra_order_xp', 50)); ?>"></td>
                    </tr>
                    <tr>
                        <th>XP Padrão Conquista</th>
                        <td><input type="number" name="zen_ra_achievement_default_xp" value="<?php echo esc_attr(get_option('zen_ra_achievement_default_xp', 10)); ?>"></td>
                    </tr>
                    <tr>
                        <th>Cache (segundos)</th>
                        <td><input type="number" name="zen_ra_cache_ttl" value="<?php echo esc_attr(get_option('zen_ra_cache_ttl', 600)); ?>"></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            <p><strong>Modo:</strong> Engine interna (REST API exposta via tema em /djzeneyer/v1/)</p>
        </div>
        <?php
    }

    // ✅ SAFE: Wrapped em try-catch
    public function get_activity_feed(array $request) {
        try {
            $user_id = (int) ($request['id'] ?? 0);
            
            if (!$user_id) {
                return ['success' => false, 'activities' => []];
            }

            if ($cache = $this->get_cache($user_id, 'feed')) {
                return $cache;
            }

            $activities = [];
            $order_xp = (int) get_option('zen_ra_order_xp', 50);
            $default_xp = (int) get_option('zen_ra_achievement_default_xp', 10);

            // WooCommerce Orders
            if (class_exists('WooCommerce') && function_exists('wc_get_orders')) {
                $orders = wc_get_orders(['customer_id' => $user_id, 'limit' => 5, 'status' => 'completed']);
                if (is_array($orders)) {
                    foreach ($orders as $order) {
                        if (!is_object($order)) continue;
                        $activities[] = [
                            'id' => 'ord_' . $order->get_id(),
                            'type' => 'loot',
                            'description' => 'Order #' . $order->get_id(),
                            'xp' => $order_xp,
                            'timestamp' => $order->get_date_created()->getTimestamp(),
                        ];
                    }
                }
            }

            // GamiPress Achievements
            if (function_exists('gamipress_get_user_achievements')) {
                $achs = gamipress_get_user_achievements(['user_id' => $user_id, 'limit' => 5]);
                if (is_array($achs)) {
                    foreach ($achs as $ach) {
                        if (!is_object($ach)) continue;
                        $xp = (int) gamipress_get_post_points($ach->ID, 'xp');
                        if ($xp <= 0) $xp = $default_xp;

                        $activities[] = [
                            'id' => 'ach_' . $ach->ID,
                            'type' => 'achievement',
                            'description' => $ach->post_title,
                            'xp' => $xp,
                            'timestamp' => strtotime($ach->date_earned),
                        ];
                    }
                }
            }

            usort($activities, fn($a, $b) => $b['timestamp'] <=> $a['timestamp']);

            $data = [
                'success' => true,
                'activities' => array_slice($activities, 0, 10),
            ];

            $this->set_cache($user_id, 'feed', $data);
            return $data;
            
        } catch (Exception $e) {
            error_log('[Zen_RA] get_activity_feed error: ' . $e->getMessage());
            return ['success' => false, 'activities' => []];
        }
    }

    public function get_user_tracks(array $request) {
        try {
            return ['success' => true, 'tracks' => $this->get_products_by_category((int)$request['id'], ['music', 'tracks'])];
        } catch (Exception $e) {
            error_log('[Zen_RA] get_user_tracks error: ' . $e->getMessage());
            return ['success' => true, 'tracks' => []];
        }
    }

    public function get_user_events(array $request) {
        try {
            return ['success' => true, 'events' => $this->get_products_by_category((int)$request['id'], ['events', 'eventos'])];
        } catch (Exception $e) {
            error_log('[Zen_RA] get_user_events error: ' . $e->getMessage());
            return ['success' => true, 'events' => []];
        }
    }

    public function get_streak_data(array $request) {
        try {
            $streak = (int) get_user_meta($request['id'], 'zen_login_streak', true);
            return ['success' => true, 'streak' => $streak];
        } catch (Exception $e) {
            error_log('[Zen_RA] get_streak_data error: ' . $e->getMessage());
            return ['success' => true, 'streak' => 0];
        }
    }

    private function get_products_by_category($user_id, $slugs) {
        if (!class_exists('WooCommerce') || !function_exists('wc_get_orders')) {
            return [];
        }

        $orders = wc_get_orders(['customer_id' => $user_id, 'status' => 'completed', 'limit' => -1]);
        $items = [];
        $candidates = [];
        $product_ids = [];

        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                $product = $item->get_product();
                if (!$product) continue;

                $pid = $product->get_id();
                $candidates[] = [
                    'product' => $product,
                    'date' => $order->get_date_created()->date('Y-m-d'),
                ];
                $product_ids[] = $pid;
            }
        }

        if (empty($product_ids)) return [];

        $product_ids = array_unique($product_ids);
        $terms = wp_get_object_terms($product_ids, 'product_cat', ['fields' => 'all_with_object_id']);

        $product_cats = [];
        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $product_cats[$term->object_id][] = $term->slug;
            }
        }

        foreach ($candidates as $candidate) {
            $product = $candidate['product'];
            $pid = $product->get_id();

            $cats = $product_cats[$pid] ?? [];

            if (array_intersect($slugs, $cats)) {
                $items[] = [
                    'id' => $pid,
                    'title' => $product->get_name(),
                    'image' => wp_get_attachment_url($product->get_image_id()),
                    'date' => $candidate['date'],
                ];
            }
        }

        return $items;
    }

    private function get_cache($user_id, $key) {
        return wp_cache_get("{$key}_{$user_id}", self::CACHE_GROUP);
    }

    private function set_cache($user_id, $key, $data) {
        wp_cache_set("{$key}_{$user_id}", $data, self::CACHE_GROUP, (int) get_option('zen_ra_cache_ttl', 600));
    }

    private function flush_all_user_cache($user_id) {
        wp_cache_delete("stats_{$user_id}", self::CACHE_GROUP);
        wp_cache_delete("feed_{$user_id}", self::CACHE_GROUP);
    }

    public function clear_user_cache_hook($user_id) {
        $this->flush_all_user_cache($user_id);
    }

    public function clear_order_cache_hook($order_id) {
        if ($order = wc_get_order($order_id)) {
            $this->flush_all_user_cache($order->get_user_id());
        }
    }

    public function update_login_streak($login, $user) {
        $user_id = $user->ID;
        $today = date('Y-m-d');
        $last = get_user_meta($user_id, 'zen_last_login', true);

        $streak = ($last === date('Y-m-d', strtotime('-1 day')))
            ? (int) get_user_meta($user_id, 'zen_login_streak', true) + 1
            : 1;

        update_user_meta($user_id, 'zen_login_streak', $streak);
        update_user_meta($user_id, 'zen_last_login', $today);
    }
}

Zen_RA::get_instance();