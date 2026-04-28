<?php
/**
 * Plugin Name:       Zen Mailer
 * Plugin URI:        https://djzeneyer.com
 * Description:       SMTP transacional para djzeneyer.com. Configura wp_mail() via constantes em wp-config.php. Sem UI desnecessária, sem banco de dados.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.1
 * Author:            DJ Zen Eyer
 * Author URI:        https://djzeneyer.com
 * License:           GPL v2 or later
 * Text Domain:       zen-mailer
 *
 * @package           Zen_Mailer
 */

namespace Zen\Mailer;

if ( ! defined( 'ABSPATH' ) ) exit;

define( 'ZEN_MAILER_VERSION', '1.0.0' );
define( 'ZEN_MAILER_DIR', plugin_dir_path( __FILE__ ) );

require_once ZEN_MAILER_DIR . 'includes/class-smtp-config.php';
require_once ZEN_MAILER_DIR . 'includes/class-rest-handler.php';
require_once ZEN_MAILER_DIR . 'includes/class-admin.php';

add_action( 'plugins_loaded', function () {
    SmtpConfig::init();
    RestHandler::init();
    Admin::init();
} );
