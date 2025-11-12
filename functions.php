<?php
/**
 * DJ Zen Eyer Theme Functions
 * v12.0.3 - Modular & Optimized for Vite/React
 */

if (!defined('ABSPATH')) exit;

/* ==========================================
 * CARREGAMENTO DE MÓDULOS (INC)
 * ========================================== */

// 1. Configurações Básicas e Segurança
require_once get_theme_file_path('/inc/setup.php');

// 2. Limpeza de Headless (Remove bloat)
require_once get_theme_file_path('/inc/cleanup.php');

// 3. Integração Vite (Assets CSS/JS)
require_once get_theme_file_path('/inc/vite.php');

// 4. Roteamento SPA
require_once get_theme_file_path('/inc/spa.php');

// 5. SEO & Schemas
require_once get_theme_file_path('/inc/seo.php');

// 6. API REST Endpoints
require_once get_theme_file_path('/inc/api.php');