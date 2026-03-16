<?php
/**
 * Plugin Name:       ZenEyer Auth Pro
 * Plugin URI:        https://djzeneyer.com
 * Description:       Enterprise-grade JWT Authentication for Headless WordPress + React. Secure, fast, and production-ready. Includes Anti-Bot Security Shield.
 * Version:           2.4.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            DJ Zen Eyer
 * Author URI:        https://djzeneyer.com
 * License:           GPL v2 or later
 * Text Domain:       zeneyer-auth
 * Domain Path:       /languages
 *
 * @package           ZenEyer_Auth_Pro
 */

namespace ZenEyer\Auth;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * BOOTSTRAP — THE ENTRY POINT
 * ═══════════════════════════════════════════════════════════════════════════════
 * This file acts as the loader. Most of the logic is located in the /includes
 * directory to follow WordPress.org and PSR coding standards.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// 1. Definition of critical paths
define('ZENEYER_AUTH_VERSION', '2.4.0');
define('ZENEYER_AUTH_PATH', \plugin_dir_path(__FILE__));
define('ZENEYER_AUTH_URL', \plugin_dir_url(__FILE__));

// 2. Autoload dependencies (Composer / Firebase JWT)
if (\file_exists(ZENEYER_AUTH_PATH . 'vendor/autoload.php')) {
    require_once ZENEYER_AUTH_PATH . 'vendor/autoload.php';
}

// 3. Load the Main Controller class
require_once ZENEYER_AUTH_PATH . 'includes/class-zeneyer-auth.php';

/**
 * Activation / Deactivation logic (outside classes for early hook resolution)
 */
\register_activation_hook(__FILE__, function() {
    if (\file_exists(ZENEYER_AUTH_PATH . 'includes/class-activator.php')) {
        require_once ZENEYER_AUTH_PATH . 'includes/class-activator.php';
        \ZenEyer\Auth\Activator::activate();
    }
});

\register_deactivation_hook(__FILE__, function() {
    if (\file_exists(ZENEYER_AUTH_PATH . 'includes/class-activator.php')) {
        require_once ZENEYER_AUTH_PATH . 'includes/class-activator.php';
        \ZenEyer\Auth\Activator::deactivate();
    }
});

// 4. Fire it up!
ZenEyer_Auth_Pro::get_instance();