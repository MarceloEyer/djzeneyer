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

        // Register ZenGame triggers in GamiPress
        \add_filter('gamipress_activity_triggers', [$this, 'register_triggers']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // OPTIMIZED ANALYTICS (SQL DIRECT)
    // ─────────────────────────────────────────────────────────────────────────

    public function get_user_total_tracks(int $user_id): int
    {
        $cache_key = 'djz_stats_tracks_' . $user_id;
        $cached = \get_transient($cache_key);
        if (false !== $cached) return (int) $cached;

        global $wpdb;
        $query = "
            SELECT SUM(item_meta_qty.meta_value)
            FROM {$wpdb->prefix}woocommerce_order_items AS items
            INNER JOIN {$wpdb->prefix}posts AS orders ON items.order_id = orders.ID
            INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS item_meta_qty ON items.order_item_id = item_meta_qty.order_item_id
            INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS item_meta_product ON items.order_item_id = item_meta_product.order_item_id
            INNER JOIN {$wpdb->postmeta} AS product_meta ON item_meta_product.meta_value = product_meta.post_id
            WHERE orders.post_type = 'shop_order'
              AND orders.post_status = 'wc-completed'
              AND orders.post_author = %d
              AND item_meta_qty.meta_key = '_qty'
              AND item_meta_product.meta_key = '_product_id'
              AND product_meta.meta_key = '_downloadable'
              AND product_meta.meta_value = 'yes'
        ";
        $total = (int) $wpdb->get_var($wpdb->prepare($query, $user_id));
        \set_transient($cache_key, $total, self::STATS_CACHE_TTL);
        return $total;
    }

    public function get_user_events_attended(int $user_id): int
    {
        $cache_key = 'djz_stats_events_' . $user_id;
        $cached = \get_transient($cache_key);
        if (false !== $cached) return (int) $cached;

        global $wpdb;
        $target_slugs = \apply_filters('zengame_event_category_slugs', ['events', 'tickets', 'congressos', 'workshops', 'social', 'festivais', 'pass']);
        $placeholders = \array_fill(0, \count($target_slugs), '%s');
        $slugs_list = \implode(',', $placeholders);

        $query = "
            SELECT SUM(item_meta_qty.meta_value)
            FROM {$wpdb->prefix}woocommerce_order_items AS items
            INNER JOIN {$wpdb->prefix}posts AS orders ON items.order_id = orders.ID
            INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS item_meta_qty ON items.order_item_id = item_meta_qty.order_item_id
            INNER JOIN {$wpdb->prefix}woocommerce_order_itemmeta AS item_meta_product ON items.order_item_id = item_meta_product.order_item_id
            INNER JOIN {$wpdb->term_relationships} AS rel ON item_meta_product.meta_value = rel.object_id
            INNER JOIN {$wpdb->term_taxonomy} AS tax ON rel.term_taxonomy_id = tax.term_taxonomy_id
            INNER JOIN {$wpdb->terms} AS terms ON tax.term_id = terms.term_id
            WHERE orders.post_type = 'shop_order'
              AND orders.post_status IN ('wc-completed', 'wc-processing')
              AND orders.post_author = %d
              AND item_meta_qty.meta_key = '_qty'
              AND item_meta_product.meta_key = '_product_id'
              AND tax.taxonomy = 'product_cat'
              AND terms.slug IN ($slugs_list)
        ";
        $prep_args = \array_merge([$user_id], $target_slugs);
        $total = (int) $wpdb->get_var($wpdb->prepare($query, ...$prep_args));
        \set_transient($cache_key, $total, self::STATS_CACHE_TTL);
        return $total;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GAMIFICATION LOGIC
    // ─────────────────────────────────────────────────────────────────────────

    public function update_login_streak(string $user_login, \WP_User $user): void
    {
        $user_id = $user->ID;
        $today = \current_time('Y-m-d');
        $last = (string) \get_user_meta($user_id, 'zen_last_login', true);
        $streak = (int) \get_user_meta($user_id, 'zen_login_streak', true);

        if ($last === $today) return;

        $yesterday = \date('Y-m-d', \strtotime('-1 day', \current_time('timestamp')));
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
    }

    public function clear_user_cache(int $user_id): void
    {
        \delete_transient('djz_gamipress_dashboard_' . \ZenEyer\Game\ZenGame::CACHE_VERSION . '_' . $user_id);
        \delete_transient('djz_stats_events_' . $user_id);
        \delete_transient('djz_stats_tracks_' . $user_id);
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
            'zengame_download' => \__('Download a track', 'zengame'),
            'zengame_share'    => \__('Share content', 'zengame'),
            'zengame_listen'   => \__('Listen to a preview', 'zengame'),
            'zengame_click'    => \__('Click a premium button', 'zengame'),
        ];
        return $triggers;
    }

    public function clear_cache_by_order_id(int $order_id): void
    {
        if (!\function_exists('wc_get_order')) return;
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
