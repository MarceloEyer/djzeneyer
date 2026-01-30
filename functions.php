<?php
/**
 * DJ Zen Eyer Theme
 * Headless WordPress + React Architecture
 * @version 15.0.3 (SSR Ready)
 */

if (!defined('ABSPATH')) exit;

define('DJZ_VERSION', '15.0.3-SSR-READY');

// Module loader - ORDEM CORRETA
require_once get_theme_file_path('/inc/setup.php');
require_once get_theme_file_path('/inc/csp.php');
require_once get_theme_file_path('/inc/cleanup.php');
require_once get_theme_file_path('/inc/vite.php');
require_once get_theme_file_path('/inc/spa.php');
require_once get_theme_file_path('/inc/api.php');
require_once get_theme_file_path('/inc/cpt.php');
require_once get_theme_file_path('/inc/metaboxes.php');
require_once get_theme_file_path('/inc/ai-llm.php');
require_once get_theme_file_path('/inc/ssr-handler.php');

add_filter('show_admin_bar', '__return_false');