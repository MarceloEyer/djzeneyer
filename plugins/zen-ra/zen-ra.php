<?php
/**
 * Plugin Name: Zen-RA (Zen Recent Activity & Gamification)
 * Plugin URI: https://djzeneyer.com
 * Description: Sistema completo de Gamificação (API + Configurações). Gerencia Histórico, XP, Ranks e Streaks.
 * Version: 2.1.0-COMPATIBILITY
 * Author: DJ Zen Eyer
 * License: GPL v2 or later
 * Text Domain: zen-ra
 */

if (!defined('ABSPATH')) exit;

class Zen_RA {

    private static $instance = null;
    const NAMESPACE = 'zen-ra/v1';
    const CACHE_GROUP = 'zen_ra_cache';

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // API & Hooks
        
        // 🚨 MUDANÇA CRÍTICA AQUI EMBAIXO:
        // Comentei a linha da API para não dar conflito (Erro 401) com o api-dashboard.php
        // O plugin continua calculando pontos, mas quem entrega os dados pro React é o outro arquivo.
        // add_action('rest_api_init', [$this, 'register_endpoints']);

        add_action('gamipress_award_points', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('gamipress_award_achievement', [$this, 'clear_user_cache_hook'], 10, 2);
        add_action('woocommerce_order_status_completed', [$this, 'clear_order_cache_hook'], 10, 1);
        add_action('wp_login', [$this, 'update_login_streak'], 10, 2);

        // Admin & Settings
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    // =========================================================================
    // 1. ADMIN SETTINGS (Onde você controla os pontos!)
    // =========================================================================
    public function add_admin_menu() {
        add_submenu_page(
            'options-general.php', // Fica em Configurações > Zen Gamification
            'Zen Gamification',
            'Zen Gamification',
            'manage_options',
            'zen-ra-settings',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings() {
        // Pontuação e Limites
        register_setting('zen_ra_opts', 'zen_ra_order_xp', ['default' => 50, 'sanitize_callback' => 'absint']);
        register_setting('zen_ra_opts', 'zen_ra_achievement_default_xp', ['default' => 10, 'sanitize_callback' => 'absint']);
        register_setting('zen_ra_opts', 'zen_ra_cache_ttl', ['default' => 600, 'sanitize_callback' => 'absint']);
    }

    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1>🎛️ Zen Gamification Control</h1>
            <form method="post" action="options.php">
                <?php settings_fields('zen_ra_opts'); do_settings_sections('zen_ra_opts'); ?>
                
                <table class="form-table">
                    <tr valign="top">
                        <th scope="row">XP por Compra (Loot)</th>
                        <td>
                            <input type="number" name="zen_ra_order_xp" value="<?php echo esc_attr(get_option('zen_ra_order_xp', 50)); ?>" />
                            <p class="description">Quantos XP aparecem no histórico quando alguém compra algo.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">XP Padrão (Fallback)</th>
                        <td>
                            <input type="number" name="zen_ra_achievement_default_xp" value="<?php echo esc_attr(get_option('zen_ra_achievement_default_xp', 10)); ?>" />
                            <p class="description">Se uma conquista do GamiPress não tiver pontos definidos, usa este valor.</p>
                        </td>
                    </tr>
                    <tr valign="top">
                        <th scope="row">Tempo de Cache (segundos)</th>
                        <td>
                            <input type="number" name="zen_ra_cache_ttl" value="<?php echo esc_attr(get_option('zen_ra_cache_ttl', 600)); ?>" />
                            <p class="description">Padrão: 600 (10 min). Diminua se precisar de updates instantâneos em testes.</p>
                        </td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            <div class="card">
                <h3>🛠️ Status do Plugin</h3>
                <p><strong>Cálculos de Pontos:</strong> ✅ Ativos</p>
                <p><strong>API REST:</strong> ⏸️ Pausada (Gerenciada pelo tema)</p>
            </div>
        </div>
        <?php
    }

    // =========================================================================
    // 2. REGISTRO DE ROTAS (Desativado temporariamente)
    // =========================================================================
    public function register_endpoints() {
        // Player Stats (XP, Level, Rank)
        register_rest_route(self::NAMESPACE, '/gamipress/(?P<id>\d+)', [
            'methods' => 'GET', 'callback' => [$this, 'get_player_stats'], 'permission_callback' => [$this, 'check_permission']
        ]);
        // Activity Feed
        register_rest_route(self::NAMESPACE, '/activity/(?P<id>\d+)', [
            'methods' => 'GET', 'callback' => [$this, 'get_activity_feed'], 'permission_callback' => [$this, 'check_permission']
        ]);
        // Events
        register_rest_route(self::NAMESPACE, '/events/(?P<id>\d+)', [
            'methods' => 'GET', 'callback' => [$this, 'get_user_events'], 'permission_callback' => [$this, 'check_permission']
        ]);
        // Tracks
        register_rest_route(self::NAMESPACE, '/tracks/(?P<id>\d+)', [
            'methods' => 'GET', 'callback' => [$this, 'get_user_tracks'], 'permission_callback' => [$this, 'check_permission']
        ]);
        // Streak
        register_rest_route(self::NAMESPACE, '/streak/(?P<id>\d+)', [
            'methods' => 'GET', 'callback' => [$this, 'get_streak_data'], 'permission_callback' => [$this, 'check_permission']
        ]);
        // Clear Cache
        register_rest_route(self::NAMESPACE, '/clear-cache/(?P<id>\d+)', [
            'methods' => 'POST', 'callback' => [$this, 'manual_clear_cache'], 'permission_callback' => function() { return current_user_can('manage_options'); }
        ]);
    }

    // =========================================================================
    // 3. LOGICA DOS ENDPOINTS
    // =========================================================================

    public function get_player_stats($request) {
        $user_id = $request['id'];
        if (!function_exists('gamipress_get_user_points')) return $this->error('GamiPress not active');

        $cache = $this->get_cache($user_id, 'stats');
        if ($cache) return rest_ensure_response($cache);

        // Pontos Reais do GamiPress
        $xp = gamipress_get_user_points($user_id, 'xp');
        
        // Rank Real do GamiPress
        $rank_types = gamipress_get_rank_types();
        $rank_slug = !empty($rank_types) ? array_key_first($rank_types) : 'zen-rank';
        $rank_post = gamipress_get_user_rank($user_id, $rank_slug);
        
        $rank_title = $rank_post ? $rank_post->post_title : 'Novice';
        $rank_icon  = $rank_post ? get_the_post_thumbnail_url($rank_post->ID, 'thumbnail') : '';

        // Lógica de Próximo Nível (1000 XP por nível fixo ou usar settings do rank)
        $next_milestone = (floor($xp / 1000) + 1) * 1000; 
        $progress = min(100, ($xp > 0 ? ($xp % 1000) / 10 : 0));

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

    public function get_activity_feed($request) {
        $user_id = $request['id'];
        $cache = $this->get_cache($user_id, 'feed');
        if ($cache) return rest_ensure_response($cache);

        $activities = [];
        
        // Pega valor configurado no Admin
        $order_xp = (int) get_option('zen_ra_order_xp', 50);
        $default_ach_xp = (int) get_option('zen_ra_achievement_default_xp', 10);

        // 1. WooCommerce Orders (Loot)
        if (class_exists('WooCommerce')) {
            $orders = wc_get_orders(['customer_id' => $user_id, 'limit' => 5, 'status' => 'completed']);
            foreach ($orders as $order) {
                $activities[] = [
                    'id' => 'ord_' . $order->get_id(),
                    'type' => 'loot',
                    'title' => 'Loot Acquired',
                    'description' => 'Order #' . $order->get_id(),
                    'xp' => $order_xp, // USA O VALOR DA CONFIGURAÇÃO
                    'timestamp' => $order->get_date_created()->getTimestamp(),
                    'icon' => '🎁'
                ];
            }
        }

        // 2. GamiPress Achievements
        if (function_exists('gamipress_get_user_achievements')) {
            $achievements = gamipress_get_user_achievements(['user_id' => $user_id, 'limit' => 5]);
            foreach ($achievements as $ach) {
                // Tenta pegar pontos reais da conquista, senão usa padrão
                $points = (int)gamipress_get_post_points($ach->ID, 'xp');
                if ($points <= 0) $points = $default_ach_xp;

                $activities[] = [
                    'id' => 'ach_' . $ach->ID,
                    'type' => 'achievement',
                    'title' => $ach->post_title,
                    'description' => $ach->post_excerpt,
                    'xp' => $points,
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

    public function get_user_events($request) {
        $user_id = $request['id'];
        $data = $this->get_products_by_category($user_id, ['events', 'eventos']);
        return rest_ensure_response(['success' => true, 'events' => $data]);
    }

    public function get_user_tracks($request) {
        $user_id = $request['id'];
        $data = $this->get_products_by_category($user_id, ['music', 'musica', 'tracks']);
        return rest_ensure_response(['success' => true, 'tracks' => $data]);
    }

    public function get_streak_data($request) {
        $user_id = $request['id'];
        $streak = (int) get_user_meta($user_id, 'zen_login_streak', true);
        return rest_ensure_response(['success' => true, 'streak' => $streak]);
    }

    // =========================================================================
    // 4. HELPERS
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

    // Cache System
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
    public function manual_clear_cache($request) {
        $this->flush_all_user_cache($request['id']);
        return rest_ensure_response(['success' => true]);
    }
    public function clear_user_cache_hook($user_id, $args = null) { $this->flush_all_user_cache($user_id); }
    public function clear_order_cache_hook($order_id) {
        $order = wc_get_order($order_id);
        if ($order) $this->flush_all_user_cache($order->get_user_id());
    }

    // Login Streak Logic
    public function update_login_streak($user_login, $user) {
        $user_id = $user->ID;
        $last_login = get_user_meta($user_id, 'zen_last_login', true);
        $today = date('Y-m-d');
        if ($last_login === $today) return;

        $streak = (int) get_user_meta($user_id, 'zen_login_streak', true);
        $yesterday = date('Y-m-d', strtotime('-1 day'));

        if ($last_login === $yesterday) $streak++;
        else $streak = 1;

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

Zen_RA::get_instance();