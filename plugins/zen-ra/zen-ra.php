<?php
/**
 * Plugin Name: Zen-RA (Zen Recent Activity & Gamification)
 * Plugin URI: https://djzeneyer.com
 * Description: Engine de Gamificação (WooCommerce + GamiPress). Usado via PHP por temas headless.
 * Version: 3.2.0-STABLE
 * Author: DJ Zen Eyer
 * License: GPL v2 or later
 * Text Domain: zen-ra
 * 
 * IMPORTANTE: Este plugin funciona como ENGINE INTERNA (não expõe REST API própria).
 * Os endpoints REST são expostos pelo tema via inc/api-dashboard.php no namespace /djzeneyer/v1/
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
        // Hooks de atualização de estado
        add_action('gamipress_award_points', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('gamipress_award_achievement', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('woocommerce_order_status_completed', [$this, 'clear_order_cache_hook'], 10, 1);
        add_action('wp_login', [$this, 'update_login_streak'], 10, 2);

        // Admin
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    // ======================================================
    // ADMIN
    // ======================================================

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

    // ======================================================
    // ENGINE METHODS (USADOS PELO TEMA)
    // ======================================================

    /**
     * Retorna estatísticas do jogador
     */
    public function get_player_stats(array $request) {
        try {
            $user_id = (int) ($request['id'] ?? 0);
            
            if (!$user_id || !function_exists('gamipress_get_user_points')) {
                return ['success' => false, 'stats' => []];
            }

            if ($cache = $this->get_cache($user_id, 'stats')) {
                return $cache;
            }

            $xp = (int) gamipress_get_user_points($user_id, 'xp');

            // Buscar rank do GamiPress
            $rank_title = 'Zen Novice';
            $rank_icon = '';
            
            if (function_exists('gamipress_get_rank_types')) {
                $rank_types = gamipress_get_rank_types();
                $rank_slug = !empty($rank_types) ? array_key_first($rank_types) : null;
                
                if ($rank_slug && function_exists('gamipress_get_user_rank')) {
                    $rank_post = gamipress_get_user_rank($user_id, $rank_slug);
                    if ($rank_post) {
                        $rank_title = $rank_post->post_title;
                        $rank_icon = get_the_post_thumbnail_url($rank_post->ID, 'thumbnail') ?: '';
                    }
                }
            }

            // Calcular progresso para próximo nível (cada 1000 XP = 1 nível)
            $next = (floor($xp / 1000) + 1) * 1000;
            $progress = $next > 0 ? min(100, round(($xp % 1000) / 10)) : 0;

            $data = [
                'success' => true,
                'stats' => [
                    'xp' => $xp,
                    'level' => 1 + floor($xp / 1000),
                    'rank' => [
                        'current' => $rank_title,
                        'icon' => $rank_icon,
                        'next_milestone' => $next,
                        'progress_percent' => $progress,
                    ]
                ]
            ];

            $this->set_cache($user_id, 'stats', $data);
            return $data;
            
        } catch (Exception $e) {
            error_log('[Zen_RA] get_player_stats error: ' . $e->getMessage());
            return ['success' => false, 'stats' => []];
        }
    }

    /**
     * Retorna feed de atividades (pedidos + conquistas)
     */
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
                $orders = wc_get_orders([
                    'customer_id' => $user_id, 
                    'limit' => 5, 
                    'status' => 'completed'
                ]);
                
                if (is_array($orders)) {
                    foreach ($orders as $order) {
                        if (!is_object($order) || !method_exists($order, 'get_id')) continue;
                        
                        $date = $order->get_date_created();
                        $timestamp = $date ? $date->getTimestamp() : time();
                        
                        $activities[] = [
                            'id' => 'ord_' . $order->get_id(),
                            'type' => 'loot',
                            'description' => 'Order #' . $order->get_id(),
                            'xp' => $order_xp,
                            'timestamp' => $timestamp,
                        ];
                    }
                }
            }

            // GamiPress Achievements
            if (function_exists('gamipress_get_user_achievements')) {
                $achs = gamipress_get_user_achievements([
                    'user_id' => $user_id, 
                    'limit' => 5
                ]);
                
                if (is_array($achs)) {
                    foreach ($achs as $ach) {
                        if (!is_object($ach) || !isset($ach->ID)) continue;
                        
                        $xp = 0;
                        if (function_exists('gamipress_get_post_points')) {
                            $xp = (int) gamipress_get_post_points($ach->ID, 'xp');
                        }
                        if ($xp <= 0) $xp = $default_xp;

                        $timestamp = isset($ach->date_earned) ? strtotime($ach->date_earned) : time();

                        $activities[] = [
                            'id' => 'ach_' . $ach->ID,
                            'type' => 'achievement',
                            'description' => $ach->post_title ?? 'Achievement',
                            'xp' => $xp,
                            'timestamp' => $timestamp,
                        ];
                    }
                }
            }

            // Ordenar por timestamp (mais recente primeiro)
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

    /**
     * Retorna produtos de música comprados
     */
    public function get_user_tracks(array $request) {
        try {
            return [
                'success' => true, 
                'tracks' => $this->get_products_by_category((int)$request['id'], ['music', 'tracks'])
            ];
        } catch (Exception $e) {
            error_log('[Zen_RA] get_user_tracks error: ' . $e->getMessage());
            return ['success' => true, 'tracks' => []];
        }
    }

    /**
     * Retorna ingressos de eventos comprados
     */
    public function get_user_events(array $request) {
        try {
            return [
                'success' => true, 
                'events' => $this->get_products_by_category((int)$request['id'], ['events', 'eventos'])
            ];
        } catch (Exception $e) {
            error_log('[Zen_RA] get_user_events error: ' . $e->getMessage());
            return ['success' => true, 'events' => []];
        }
    }

    /**
     * Retorna contador de login streak
     */
    public function get_streak_data(array $request) {
        try {
            $user_id = (int) ($request['id'] ?? 0);
            if (!$user_id) {
                return ['success' => true, 'streak' => 0];
            }
            
            $streak = (int) get_user_meta($user_id, 'zen_login_streak', true);
            return ['success' => true, 'streak' => $streak];
            
        } catch (Exception $e) {
            error_log('[Zen_RA] get_streak_data error: ' . $e->getMessage());
            return ['success' => true, 'streak' => 0];
        }
    }

    // ======================================================
    // HELPERS
    // ======================================================

    /**
     * Busca produtos comprados por categoria
     */
    private function get_products_by_category($user_id, $slugs) {
        if (!class_exists('WooCommerce') || !function_exists('wc_get_orders')) {
            return [];
        }

        try {
            $orders = wc_get_orders([
                'customer_id' => $user_id, 
                'status' => 'completed', 
                'limit' => -1
            ]);
            
            $items = [];
            $candidates = [];
            $product_ids = [];

            foreach ($orders as $order) {
                if (!is_object($order)) continue;
                
                foreach ($order->get_items() as $item) {
                    $product = $item->get_product();
                    if (!$product) continue;

                    $pid = $product->get_id();
                    $date = $order->get_date_created();
                    
                    $candidates[] = [
                        'product' => $product,
                        'date' => $date ? $date->date('Y-m-d') : date('Y-m-d'),
                    ];
                    $product_ids[] = $pid;
                }
            }

            if (empty($product_ids)) return [];

            $product_ids = array_unique($product_ids);

            // Batch fetch categories
            $terms = wp_get_object_terms($product_ids, 'product_cat', ['fields' => 'all_with_object_id']);

            // Map product_id => [slugs]
            $product_cats = [];
            if (!is_wp_error($terms) && is_array($terms)) {
                foreach ($terms as $term) {
                    if (!isset($term->object_id) || !isset($term->slug)) continue;
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
                        'image' => wp_get_attachment_url($product->get_image_id()) ?: '',
                        'date' => $candidate['date'],
                    ];
                }
            }

            return $items;
            
        } catch (Exception $e) {
            error_log('[Zen_RA] get_products_by_category error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Cache helpers
     */
    private function get_cache($user_id, $key) {
        return wp_cache_get("{$key}_{$user_id}", self::CACHE_GROUP);
    }

    private function set_cache($user_id, $key, $data) {
        $ttl = (int) get_option('zen_ra_cache_ttl', 600);
        wp_cache_set("{$key}_{$user_id}", $data, self::CACHE_GROUP, $ttl);
    }

    private function flush_all_user_cache($user_id) {
        wp_cache_delete("stats_{$user_id}", self::CACHE_GROUP);
        wp_cache_delete("feed_{$user_id}", self::CACHE_GROUP);
    }

    /**
     * Clear cache hooks
     */
    public function clear_user_cache_hook($user_id) {
        $this->flush_all_user_cache($user_id);
    }

    public function clear_order_cache_hook($order_id) {
        if ($order = wc_get_order($order_id)) {
            $this->flush_all_user_cache($order->get_user_id());
        }
    }

    /**
     * Update login streak
     */
    public function update_login_streak($login, $user) {
        try {
            $user_id = $user->ID;
            $today = date('Y-m-d');
            $last = get_user_meta($user_id, 'zen_last_login', true);

            $streak = ($last === date('Y-m-d', strtotime('-1 day')))
                ? (int) get_user_meta($user_id, 'zen_login_streak', true) + 1
                : 1;

            update_user_meta($user_id, 'zen_login_streak', $streak);
            update_user_meta($user_id, 'zen_last_login', $today);
            
        } catch (Exception $e) {
            error_log('[Zen_RA] update_login_streak error: ' . $e->getMessage());
        }
    }
}

Zen_RA::get_instance();