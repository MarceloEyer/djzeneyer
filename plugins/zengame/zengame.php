<?php
/**
 * Plugin Name:       ZenGame Pro
 * Plugin URI:        https://djzeneyer.com
 * Description:       The High-Performance Bridge for GamiPress + Headless React. Optimized SQL queries, advanced caching, and elite game logic.
 * Version:           1.4.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            DJ Zen Eyer
 * Author URI:        https://djzeneyer.com
 * License:           GPL v2 or later
 * Text Domain:       zengame
 * Domain Path:       /languages
 *
 * @package           ZenGame
 */

namespace ZenEyer\Game;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ZENGAME LOADER
 * ═══════════════════════════════════════════════════════════════════════════════
 * This file bootstraps the ZenGame Pro engine.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// 1. Definition of critical paths
define('ZENGAME_VERSION', '1.4.0');
define('ZENGAME_PATH', \plugin_dir_path(__FILE__));
define('ZENGAME_URL', \plugin_dir_url(__FILE__));

// 2. Load the main class
require_once ZENGAME_PATH . 'includes/class-zengame.php';

/**
 * Activation / Deactivation hooks
 */
\register_activation_hook(__FILE__, function() {
    require_once ZENGAME_PATH . 'includes/class-zengame-activator.php';
    Activator::activate();
});

\register_deactivation_hook(__FILE__, function() {
    require_once ZENGAME_PATH . 'includes/class-zengame-activator.php';
    Activator::deactivate();
});

// 3. Launch the engine
ZenGame::get_instance();
