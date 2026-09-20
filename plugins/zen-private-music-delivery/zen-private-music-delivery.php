<?php
/**
 * Plugin Name:       Zen Private Music Delivery
 * Plugin URI:        https://djzeneyer.com
 * Description:       Private MP3 delivery for invited DJs and collaborators.
 * Version:           0.1.0
 * Requires at least: 7.1.1
 * Requires PHP:      8.5
 * Author:            DJ Zen Eyer
 * Author URI:        https://djzeneyer.com
 * License:           GPL v2 or later
 * Text Domain:       zen-private-music
 *
 * @package Zen_Private_Music
 */

if (!defined('ABSPATH')) {
	exit;
}

define('ZEN_PRIVATE_MUSIC_VERSION', '0.1.0');
define('ZEN_PRIVATE_MUSIC_PATH', plugin_dir_path(__FILE__));

require_once ZEN_PRIVATE_MUSIC_PATH . 'includes/class-zen-private-music.php';

register_activation_hook(__FILE__, ['Zen_Private_Music', 'activate']);
register_deactivation_hook(__FILE__, ['Zen_Private_Music', 'deactivate']);

Zen_Private_Music::init();
