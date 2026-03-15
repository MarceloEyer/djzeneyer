<?php
/**
 * Admin: Clear Cache Button & Menus
 */

if (!defined('ABSPATH')) return;

/**
 * Admin: Clear Cache Button
 */
add_action('admin_bar_menu', function ($wp_admin_bar) {
    if (!current_user_can('manage_options'))
        return;

    $wp_admin_bar->add_node([
        'id' => 'djz_clear_cache',
        'title' => '🧹 Clear Cache',
        'href' => wp_nonce_url(add_query_arg('djz_clear_cache', '1', admin_url()), 'djz_clear_cache'),
    ]);
}, 999);

add_action('admin_init', function () {
    if (!isset($_GET['djz_clear_cache']) || !current_user_can('manage_options'))
        return;

    check_admin_referer('djz_clear_cache');

    global $wpdb;
    $wpdb->query("DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_djz_%'");

    wp_safe_redirect(remove_query_arg('djz_clear_cache'));
    die();
});

/**
 * Cleanup Admin Bloat
 */
add_action('init', function() {
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('admin_print_styles', 'print_emoji_styles');
});
