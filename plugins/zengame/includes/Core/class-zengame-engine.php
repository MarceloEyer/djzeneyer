<?php
/**
 * Core Game Engine
 *
 * @package ZenGame
 * @since 1.4.0
 */

namespace ZenEyer\Game\Core;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Engine Class
 * 
 * Handles massive data processing, SQL optimization, and cache management.
 */
final class Engine
{
    /** @var Engine|null */
    private static $instance = null;

    /** TTL Constants */
    private const STATS_CACHE_TTL = 21600;      // 6 hours
    private const LEADERBOARD_CACHE_TTL = 3600; // 1 hour

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function init()
    {
        $this->init_cache_hooks();
        \add_action('wp_login', [$this, 'update_login_streak'], 10, 2);
        // Atualiza streak em qualquer requisição REST autenticada.
        // Cobre usuários que voltam ao site usando JWT (sem novo login).
        \add_filter('rest_pre_dispatch', [$this, 'maybe_update_streak_on_rest'], 10, 3);

        // Register ZenGame triggers in GamiPress
        \add_filter('gamipress_activity_triggers', [$this, 'register_triggers']);
        \add_filter('gamipress_log_event_trigger_meta_data', [$this, 'map_log_meta'], 10, 5);
        \add_filter('gamipress_get_activity_trigger_label', [$this, 'get_trigger_label'], 10, 2);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // OPTIMIZED ANALYTICS (SQL DIRECT)
    // ─────────────────────────────────────────────────────────────────────────


    public function get_user_events_attended(int $user_id): int
    {
        $cache_key = 'djz_stats_events_' . $user_id;
        $cached = \get_transient($cache_key);
        if (false !== $cached) return (int) $cached;

        if (!\function_exists('\wc_get_orders')) {
            \set_transient($cache_key, 0, self::STATS_CACHE_TTL);
            return 0;
        }

        $target_slugs = \apply_filters('zengame_event_category_slugs', [
            'events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass',
        ]);

        // wc_get_orders() is HPOS-compatible: works with legacy wp_posts and wc_orders table
        $order_ids = \wc_get_orders([
            'customer_id' => $user_id,
            'status'      => ['wc-completed', 'wc-processing'],
            'limit'       => -1,
            'return'      => 'ids',
        ]);

        $total = 0;
        foreach ($order_ids as $order_id) {
            $order = \wc_get_order($order_id);
            if (!$order) continue;
            foreach ($order->get_items() as $item) {
                $product_id = $item->get_product_id();
                $terms = \wp_get_post_terms($product_id, 'product_cat', ['fields' => 'slugs']);
                if (!\is_wp_error($terms) && !empty(\array_intersect($terms, $target_slugs))) {
                    $total += (int) $item->get_quantity();
                }
            }
        }

        \set_transient($cache_key, $total, self::STATS_CACHE_TTL);
        return $total;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GAMIFICATION LOGIC
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Chamado via rest_pre_dispatch para atualizar streak de usuários JWT
     * que voltam ao site sem fazer um novo login (wp_login não dispara para eles).
     *
     * @param mixed            $result  Passthrough.
     * @param \WP_REST_Server  $server  Passthrough.
     * @param \WP_REST_Request $request Passthrough.
     * @return mixed $result inalterado.
     */
    public function maybe_update_streak_on_rest($result, $server, $request)
    {
        static $done = false;
        if ($done) return $result;
        $done = true;

        $user_id = \get_current_user_id();
        if ($user_id > 0) {
            $user = \get_user_by('ID', $user_id);
            if ($user instanceof \WP_User) {
                $this->update_login_streak($user->user_login, $user);
            }
        }

        return $result;
    }

    public function update_login_streak(string $user_login, \WP_User $user): void
    {
        $user_id = $user->ID;
        $today = \current_time('Y-m-d');
        $last = (string) \get_user_meta($user_id, 'zen_last_login', true);
        $streak = (int) \get_user_meta($user_id, 'zen_login_streak', true);

        if ($last === $today) return;

        // Calcular "ontem" a partir de $today (já no timezone do WP) para evitar
        // discrepância entre date() (PHP/UTC) e current_time() (WP timezone).
        $yesterday = \date('Y-m-d', \strtotime($today . ' -1 day'));
        $streak = ($last === $yesterday) ? $streak + 1 : 1;

        \update_user_meta($user_id, 'zen_last_login', $today);
        \update_user_meta($user_id, 'zen_login_streak', $streak);
        $this->clear_user_cache($user_id);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CACHE MANAGEMENT
    // ─────────────────────────────────────────────────────────────────────────

    private function init_cache_hooks(): void
    {
        \add_action('woocommerce_order_status_completed', [$this, 'clear_cache_by_order_id']);
        \add_action('gamipress_award_points_to_user', fn($uid) => $this->clear_user_cache((int)$uid), 10, 1);
        \add_action('gamipress_award_achievement', fn($uid) => $this->clear_user_cache((int)$uid), 10, 1);
        \add_action('gamipress_set_user_rank', fn($uid) => $this->clear_user_cache((int)$uid), 10, 1);
        \add_action('set_user_role', fn($uid) => $this->clear_user_cache((int)$uid), 10, 1);
    }

    public function clear_user_cache(int $user_id): void
    {
        \delete_transient('djz_gamipress_dashboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION . '_' . $user_id);
        \delete_transient('djz_stats_events_' . $user_id);

        // Leaderboard rankings change whenever any user's points change.
        // Clear the most common limit variants so the next request fetches fresh data.
        foreach ([5, 10, 25, 50] as $limit) {
            \delete_transient('djz_gamipress_leaderboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION . '_' . $limit);
        }
    }

    /**
     * Tracks a user interaction (click, download, share) and triggers GamiPress events.
     */
    public function track_interaction(int $user_id, string $action, int $object_id = 0): bool
    {
        if (!\defined('GAMIPRESS_VER')) return false;

        // Trigger action for GamiPress to catch
        // Format: zengame_{action} (e.g., zengame_download)
        $hook = "zengame_" . \sanitize_key($action);
        \do_action($hook, $user_id, $object_id);

        $this->clear_user_cache($user_id);
        return true;
    }

    /**
     * Registers ZenGame activity triggers so they appear in GamiPress rule selection UI.
     */
    public function register_triggers(array $triggers): array
    {
        $triggers['ZenGame'] = [
            'zengame_share'    => \__('Share content', 'zengame'),
            'zengame_click'    => \__('Click a premium button', 'zengame'),
        ];
        return $triggers;
    }

    /**
     * Maps ZenGame interaction metadata (like post_id) to GamiPress logs.
     */
    public function map_log_meta(array $log_meta, int $user_id, string $trigger, int $site_id, array $args): array
    {
        if (\strpos($trigger, 'zengame_') === 0) {
            // Store the object ID as 'post_id' in the log if it exists in the args
            // ZenGame passes $object_id as the second argument to \do_action
            if (isset($args[1]) && \is_numeric($args[1])) {
                $log_meta['post_id'] = (int) $args[1];
            }
        }
        return $log_meta;
    }

    /**
     * Provides clean labels for ZenGame triggers in GamiPress logs.
     */
    public function get_trigger_label(string $label, string $trigger): string
    {
        $labels = [
            'zengame_share'    => \__('Share content', 'zengame'),
            'zengame_click'    => \__('Click a premium button', 'zengame'),
        ];

        return $labels[$trigger] ?? $label;
    }

    public function clear_cache_by_order_id(int $order_id): void
    {
        if (!\function_exists('\wc_get_order')) return;
        $order = \wc_get_order($order_id);
        if ($order && ($uid = $order->get_user_id())) {
            $this->clear_user_cache((int)$uid);
        }
    }

    public function clear_all_cache(): void
    {
        global $wpdb;
        $wpdb->query($wpdb->prepare(
            "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s OR option_name LIKE %s",
            '%_transient_djz_gamipress_%', '%_transient_djz_stats_%', '%_transient_timeout_djz_%'
        ));
        \update_option('zengame_last_purge', \current_time('mysql'));
    }
}
