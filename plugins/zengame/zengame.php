<?php
/**
 * Plugin Name:  ZenGame Pro
 * Plugin URI:   https://djzeneyer.com
 * Description:  Gaming & Activity Bridge for DJ Zen Eyer — SSOT for GamiPress + WooCommerce
 *               headless gamification. Provides REST endpoints consumed by the React frontend.
 * Version:      1.3.9
 * Author:       DJ Zen Eyer
 * Author URI:   https://djzeneyer.com
 * Text Domain:  zengame
 * Domain Path:  /languages
 * Requires at least: 6.0
 * Requires PHP:      8.1
 *
 * @package ZenEyer\Game
 */

// Hard die if accessed outside WordPress.
if (!defined('ABSPATH')) {
    die;
}

// Define plugin constants
define('ZENGAME_VERSION', '1.3.9');
define('ZENGAME_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZENGAME_PLUGIN_URL', plugin_dir_url(__FILE__));

// Autoload dependencies
require_once ZENGAME_PLUGIN_DIR . 'includes/class-zengame.php';
require_once ZENGAME_PLUGIN_DIR . 'admin/class-admin.php';

// Initialize the plugin
\ZenEyer\Game\ZenGame::get_instance();

/**
 * Register the deactivation hook at file-scope (not inside a class method) so
 * that __FILE__ resolves to the plugin's main file. WordPress requires this for
 * register_deactivation_hook() to work correctly.
 */
\register_deactivation_hook(__FILE__, [\ZenEyer\Game\ZenGame::class, 'on_deactivation']);
