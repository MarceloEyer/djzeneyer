<?php
/**
 * Plugin Name: Zen-RA (Zen Recent Activity & Gamification)
 * Plugin URI: https://djzeneyer.com
 * Description: API Unificada "Diamond Master" da Tribo Zen. Gerencia Histórico, Gamificação (XP/Ranks), Eventos e Streaks.
 * Version: 2.0.0
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 * License: GPL v2 or later
 * Text Domain: zen-ra
 */

if (!defined('ABSPATH')) exit;

class Zen_RA {

    private static $instance = null;
    const NAMESPACE = 'zen-ra/v1';
    const CACHE_GROUP = 'zen_ra_cache';
    const CACHE_TTL = 600; // 10 minutos

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Init API
        add_action('rest_api_init', [$this, 'register_endpoints']);
        
        // Hooks de Limpeza de Cache (Automático)
        add_action('gamipress_award_points', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('gamipress_award_achievement', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('woocommerce_order_status_completed', [$this, 'clear_order_cache_hook'], 10, 1);
        
        // Hook de Login Streak
        add_action('wp_login', [$this, 'update_login_streak'], 10, 2);
    }

    // =========================================================================
    // 1. REGISTRO DE ROTAS (ROUTER)
    // =========================================================================
    public function register_endpoints() {
        
        // A. PLAYER STATS (XP, Level, Rank)
        register_rest_route(self::NAMESPACE, '/gamipress/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_player_stats'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // B. ACTIVITY FEED (Histórico Geral)
        register_rest_route(self::NAMESPACE, '/activity/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_activity_feed'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // C. EVENTS (Ingressos Comprados)
        register_rest_route(self::NAMESPACE, '/events/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_events'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // D. TRACKS (Músicas Compradas)
        register_rest_route(self::NAMESPACE, '/tracks/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_user_tracks'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // E. STREAK (Sequência de Login)
        register_rest_route(self::NAMESPACE, '/streak/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [$this, 'get_streak_data'],
            'permission_callback' => [$this, 'check_permission'],
        ]);

        // F. CLEAR CACHE (Admin)
        register_rest_route(self::NAMESPACE, '/clear-cache/(?P<id>\d+)', [
            'methods' => 'POST',
            'callback' => [$this, 'manual_clear_cache'],
            'permission_callback' => function() { return current_user_can('manage_options'); },
        ]);
    }

    // =========================================================================
    // 2. ENDPOINTS (CONTROLLERS)
    // =========================================================================

    /**
     * Endpoint: Stats do Jogador (XP, Nível, Rank)
     */
    public function get_player_stats($request) {
        $user_id = $request['id'];
        
        if (!function_exists('gamipress_get_user_points')) {
            return $this->error('GamiPress not active');
        }

        // Cache Check
        $cache = $this->get_cache($user_id, 'stats');
        if ($cache) return rest_ensure_response($cache);

        // Logic
        $xp = gamipress_get_user_points($user_id, 'xp');
        
        // Rank Atual
        $rank_types = gamipress_get_rank_types();
        $rank_slug = !empty($rank_types) ? array_key_first($rank_types) : 'zen-rank';
        $rank_post = gamipress_get_user_rank($user_id, $rank_slug);
        
        $rank_title = $rank_post ? $rank_post->post_title : 'Novice';
        $rank_icon  = $rank_post ? get_the_post_thumbnail_url($rank_post->ID, 'thumbnail') : '';

        // Próximo Nível (Simples: Rank atual + 1 ou Milestone fixo)
        // Para simplificar, assumimos que níveis mudam a cada 1000 XP se não houver lógica de rank complexa
        $next_milestone = (floor($xp / 1000) + 1) * 1000; 
        $progress = min(100, ($xp > 0 ? ($xp % 1000) / 10 : 0)); // % de 0 a 100 dentro do milhar

        $data = [
            'success' => true,
            'stats' => [
                'xp' => (int)$xp,
                'level' => 1 + floor($xp / 1000),
                'rank' => [
                    'current' => $rank_title,
                    'icon' => $rank_icon,
                    'next_milestone' => $next_milestone,
                    'progress_percent' => $progress
                ]
            ]
        ];

        $this->set_cache($user_id, 'stats', $data);
        return rest_ensure_response($data);
    }

    /**
     * Endpoint: Feed de Atividades (Legacy Zen-RA)
     */
    public function get_activity_feed($request) {
        $user_id = $request['id'];
        $cache = $this->get_cache($user_id, 'feed');
        if ($cache) return rest_ensure_response($cache);

        $activities = [];

        // WooCommerce Orders
        if (class_exists('WooCommerce')) {
            $orders = wc_get_orders(['customer_id' => $user_id, 'limit' => 5, 'status' => 'completed']);
            foreach ($orders as $order) {
                $activities[] = [
                    'id' => 'ord_' . $order->get_id(),
                    'type' => 'loot',
                    'title' => 'Loot Acquired',
                    'description' => 'Order #' . $order->get_id(),
                    'xp' => 50, // Fixo por enquanto
                    'timestamp' => $order->get_date_created()->getTimestamp(),
                    'icon' => '🎁'
                ];
            }
        }

        // GamiPress Achievements
        if (function_exists('gamipress_get_user_achievements')) {
            $achievements = gamipress_get_user_achievements(['user_id' => $user_id, 'limit' => 5]);
            foreach ($achievements as $ach) {
                $activities[] = [
                    'id' => 'ach_' . $ach->ID,
                    'type' => 'achievement',
                    'title' => $ach->post_title,
                    'description' => $ach->post_excerpt,
                    'xp' => (int)gamipress_get_post_points($ach->ID, 'xp'),
                    'timestamp' => strtotime($ach->date_earned),
                    'icon' => '🏆'
                ];
            }
        }

        usort($activities, function($a, $b) { return $b['timestamp'] - $a['timestamp']; });

        $data = ['success' => true, 'activities' => array_slice($activities, 0, 10)];
        $this->set_cache($user_id, 'feed', $data);
        return rest_ensure_response($data);
    }

    /**
     * Endpoint: Eventos (Produtos da categoria 'events')
     */
    public function get_user_events($request) {
        $user_id = $request['id'];
        $data = $this->get_products_by_category($user_id, ['events', 'eventos']);
        return rest_ensure_response(['success' => true, 'events' => $data]);
    }

    /**
     * Endpoint: Tracks (Produtos da categoria 'music')
     */
    public function get_user_tracks($request) {
        $user_id = $request['id'];
        $data = $this->get_products_by_category($user_id, ['music', 'musica', 'tracks']);
        return rest_ensure_response(['success' => true, 'tracks' => $data]);
    }

    /**
     * Endpoint: Streak
     */
    public function get_streak_data($request) {
        $user_id = $request['id'];
        $streak = (int) get_user_meta($user_id, 'zen_login_streak', true);
        return rest_ensure_response(['success' => true, 'streak' => $streak]);
    }

    // =========================================================================
    // 3. HELPERS & LOGIC
    // =========================================================================

    private function get_products_by_category($user_id, $slugs) {
        if (!class_exists('WooCommerce')) return [];
        
        $orders = wc_get_orders(['customer_id' => $user_id, 'status' => 'completed', 'limit' => -1]);
        $items_found = [];

        foreach ($orders as $order) {
            foreach ($order->get_items() as $item) {
                $product = $item->get_product();
                if (!$product) continue;
                
                $cats = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'slugs']);
                if (array_intersect($slugs, $cats)) {
                    $items_found[] = [
                        'id' => $product->get_id(),
                        'title' => $product->get_name(),
                        'image' => wp_get_attachment_url($product->get_image_id()),
                        'date' => $order->get_date_created()->date('Y-m-d')
                    ];
                }
            }
        }
        return $items_found;
    }

    // Cache Helpers
    private function get_cache($user_id, $key) {
        return wp_cache_get("{$key}_{$user_id}", self::CACHE_GROUP);
    }

    private function set_cache($user_id, $key, $data) {
        wp_cache_set("{$key}_{$user_id}", $data, self::CACHE_GROUP, self::CACHE_TTL);
    }

    public function manual_clear_cache($request) {
        $this->flush_all_user_cache($request['id']);
        return rest_ensure_response(['success' => true]);
    }

    private function flush_all_user_cache($user_id) {
        wp_cache_delete("stats_{$user_id}", self::CACHE_GROUP);
        wp_cache_delete("feed_{$user_id}", self::CACHE_GROUP);
    }

    // Hooks Callbacks
    public function clear_user_cache_hook($user_id, $args = null) {
        $this->flush_all_user_cache($user_id);
    }

    public function clear_order_cache_hook($order_id) {
        $order = wc_get_order($order_id);
        if ($order) $this->flush_all_user_cache($order->get_user_id());
    }

    public function update_login_streak($user_login, $user) {
        $user_id = $user->ID;
        $last_login = get_user_meta($user_id, 'zen_last_login', true);
        $today = date('Y-m-d');

        if ($last_login === $today) return;

        $streak = (int) get_user_meta($user_id, 'zen_login_streak', true);
        $yesterday = date('Y-m-d', strtotime('-1 day'));

        if ($last_login === $yesterday) {
            $streak++;
        } else {
            $streak = 1;
        }

        update_user_meta($user_id, 'zen_login_streak', $streak);
        update_user_meta($user_id, 'zen_last_login', $today);
    }

    public function check_permission($request) {
        $user_id = $request['id'];
        $current = get_current_user_id();
        return ($user_id == $current || user_can($current, 'manage_options'));
    }

    private function error($msg, $code = 500) {
        return new WP_Error('zen_error', $msg, ['status' => $code]);
    }
}

// Inicia o plugin
Zen_RA::get_instance();