<?php
/**
 * Plugin Name: Zen BIT - Bandsintown Events
 * Plugin URI:  https://djzeneyer.com
 * Description: Proxy Bandsintown com cache SWR, canonical paths, JSON-LD MusicEvent e admin health para arquitetura headless.
 * Version:     3.1.0
 * Author:      Zen Eyer
 * Author URI:  https://djzeneyer.com
 * License:     GPL v2 or later
 * Text Domain: zen-bit
 */

namespace ZenBit;

if (!defined('ABSPATH')) {
    die;
}

define('ZEN_BIT_VERSION', '3.1.0');
define('ZEN_BIT_PLUGIN_DIR', \plugin_dir_path(__FILE__));
define('ZEN_BIT_PLUGIN_URL', \plugin_dir_url(__FILE__));

/**
 * Activate the plugin.
 */
function zen_bit_activate(): void
{
    $defaults = [
        'zen_bit_artist_id'         => '15619775',
        'zen_bit_artist_name'       => '',
        'zen_bit_api_key'           => '',
        'zen_bit_default_days'      => '365',
        'zen_bit_ttl_upcoming'      => '21600',
        'zen_bit_ttl_detail'        => '86400',
        'zen_bit_ttl_past'          => '604800',
        'zen_bit_enable_schema'     => '1',
        'zen_bit_include_raw_debug' => '0',
    ];

    foreach ($defaults as $key => $val) {
        if (\get_option($key) === false) {
            \add_option($key, $val);
        }
    }

    if (class_exists('ZenBit\Zen_BIT_Cache')) {
        Zen_BIT_Cache::clear_all();
    }
}
\register_activation_hook(__FILE__, 'ZenBit\zen_bit_activate');

/**
 * Deactivate the plugin.
 */
function zen_bit_deactivate(): void
{
    if (class_exists('ZenBit\Zen_BIT_Cache')) {
        Zen_BIT_Cache::clear_all();
    }
}
\register_deactivation_hook(__FILE__, 'ZenBit\zen_bit_deactivate');

/**
 * Boot the plugin.
 */
function zen_bit_run_plugin(): void
{
    $dependencies = [
        'includes/class-zen-bit-normalizer.php',
        'includes/class-zen-bit-cache.php',
        'includes/class-zen-bit-api.php',
        'includes/class-zen-bit-sitemap.php',
        'includes/class-zen-bit-loader.php',
        'includes/class-zen-bit-public.php',
    ];

    foreach ($dependencies as $file) {
        require_once ZEN_BIT_PLUGIN_DIR . $file;
    }

    $loader = new Zen_BIT_Loader();

    $api = new Zen_BIT_API_V2();
    $api->define_hooks($loader);

    $sitemap = new Zen_BIT_Sitemap();
    $sitemap->define_hooks($loader);

    $public = new Zen_BIT_Public();
    $public->define_hooks($loader);

    if (\is_admin()) {
        require_once ZEN_BIT_PLUGIN_DIR . 'admin/class-zen-bit-admin.php';
        $admin = new Zen_BIT_Admin();
        $admin->define_hooks($loader);
    }

    $loader->run();
}

zen_bit_run_plugin();
