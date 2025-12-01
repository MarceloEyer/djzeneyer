<?php
/**
 * DJ Zen Eyer Theme Functions
 * v13.3.0 - Modular Architecture (Zero Logic Here)
 * Headless Architecture + Zen SEO Plugin
 */

if (!defined('ABSPATH')) exit;

/* ==========================================
 * CARREGAMENTO DE MÓDULOS (INC)
 * ========================================== */

// 1. Configurações Básicas e Segurança
require_once get_theme_file_path('/inc/setup.php');

// 2. Limpeza de Headless (Remove Emojis, Feeds, Scripts WP Core)
require_once get_theme_file_path('/inc/cleanup.php');

// 3. Integração Vite (Carrega o React e CSS gerados no build)
require_once get_theme_file_path('/inc/vite.php');

// 4. Roteamento SPA (Redireciona rotas virtuais para o index.html)
require_once get_theme_file_path('/inc/spa.php');

// 5. API REST Endpoints (Menu, Auth, Gamificação, Media Fix)
require_once get_theme_file_path('/inc/api.php');

// 6. Custom Post Types & Taxonomias (Flyers e Músicas)
require_once get_theme_file_path('/inc/cpt.php');

// 7. Gerenciador de Links de Música (Campos para Drive/SoundCloud)
require_once get_theme_file_path('/inc/metaboxes.php');

/**
 * NOTA: SEO removido daqui.
 * Todo o SEO (Sitemap, Schema, Meta Tags) é gerenciado
 * pelo plugin "Zen SEO Lite".
 */