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

// Flyers
function create_flyer_post_type() {
    register_post_type('flyers',
        array(
            'labels' => array(
                'name' => __('Flyers'),
                'singular_name' => __('Flyer')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true, // Habilita a API para o React ler
            'supports' => array('title', 'thumbnail'), // Só precisa de Título e Imagem
            'menu_icon' => 'dashicons-format-gallery',
        )
    );
}
add_action('init', 'create_flyer_post_type');