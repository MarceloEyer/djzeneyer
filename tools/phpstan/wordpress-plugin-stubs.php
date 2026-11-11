<?php

declare(strict_types=1);

define('ZEN_SEO_VERSION', '0.0.0');
define('ZEN_SEO_PLUGIN_DIR', '');
define('ZEN_SEO_PLUGIN_URL', '');
define('ZEN_SEO_PLUGIN_BASENAME', '');
define('ZEN_SEO_PATH', '');
define('ZEN_SEO_URL', '');

define('ZENEYER_AUTH_VERSION', '0.0.0');
define('ZENEYER_AUTH_PATH', dirname(__DIR__, 2) . '/plugins/zeneyer-auth/');
define('ZENEYER_AUTH_URL', '');

define('ZENGAME_VERSION', '0.0.0');
define('ZENGAME_PATH', '');
define('ZENGAME_URL', '');

define('ZEN_SMTP_HOST', '');
define('ZEN_SMTP_PORT', 587);
define('ZEN_SMTP_USER', '');
define('ZEN_SMTP_PASS', '');
define('ZEN_SMTP_FROM_EMAIL', '');

function gamipress_get_user_points(int $user_id, string $points_type = ''): int
{
    return 0;
}
