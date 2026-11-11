<?php
/**
 * PHPUnit bootstrap for WordPress plugin regression tests.
 *
 * These tests do NOT spin up WordPress — they use Brain\Monkey to stub the
 * handful of WP core functions each class under test calls, so plugin
 * classes can be exercised as plain PHP with real inputs/outputs asserted,
 * rather than relying on string/regex checks against source files.
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    // Plugin files guard their entire body with `if (!defined('ABSPATH')) exit;`
    // A defined-but-fake path is enough to let them load under plain PHP.
    define('ABSPATH', __DIR__ . '/fixtures/fake-wp/');
}

require_once dirname(__DIR__, 2) . '/vendor/autoload.php';

if (!defined('ZENEYER_AUTH_PATH')) {
    define('ZENEYER_AUTH_PATH', dirname(__DIR__, 2) . '/plugins/zeneyer-auth/');
}

require_once ZENEYER_AUTH_PATH . 'includes/Core/class-jwt-manager.php';
require_once ZENEYER_AUTH_PATH . 'includes/Admin/class-settings-page.php';
require_once ZENEYER_AUTH_PATH . 'includes/class-activator.php';
