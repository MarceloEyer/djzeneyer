<?php
/**
 * DJ Zen Eyer Theme
 * Headless WordPress + React Architecture
 * * @version 14.1.0 (Dashboard Fixed)
 */

if (!defined('ABSPATH')) exit;

// Version constant
define('DJZ_VERSION', '14.1.0');

// Module loader - A ORDEM DA ORGANIZAÇÃO
require_once get_theme_file_path('/inc/setup.php');      // Core setup & security
require_once get_theme_file_path('/inc/cleanup.php');    // Remove WP bloat
require_once get_theme_file_path('/inc/vite.php');       // React integration
require_once get_theme_file_path('/inc/spa.php');        // SPA routing
require_once get_theme_file_path('/inc/api.php');        // General REST endpoints
require_once get_theme_file_path('/inc/api-dashboard.php'); // ✨ NOVO: Rotas do Painel (Tracks, Streak)
require_once get_theme_file_path('/inc/cpt.php');        // Custom post types
require_once get_theme_file_path('/inc/metaboxes.php');  // Admin metaboxes
require_once get_theme_file_path('/inc/ai-llm.php');     // AI LLM Training 

/**
 * Disable admin bar on frontend
 * (Breaks headless layout)
 */
add_filter('show_admin_bar', '__return_false');