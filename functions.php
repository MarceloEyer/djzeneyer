<?php
/**
 * DJ Zen Eyer Theme Functions
 * v12.1.0 - Architecture Refactor (Modular CPTs)
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

// 6. API REST Endpoints Genéricos
require_once get_theme_file_path('/inc/api.php');

// 7. Custom Post Types & Taxonomias (Flyers e Músicas)
// [NOVO] Toda a lógica de conteúdo fica aqui
require_once get_theme_file_path('/inc/cpt.php');