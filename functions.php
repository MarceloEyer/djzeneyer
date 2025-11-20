<?php
/**
 * DJ Zen Eyer Theme Functions
 * v12.0.4 - Modular & Optimized for Vite/React
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

/* ==========================================
 * CUSTOM POST TYPES
 * ========================================== */

// Registro do CPT "Flyers" para Galeria Automática
function create_flyer_post_type() {
    register_post_type('flyers',
        array(
            'labels' => array(
                'name' => __('Flyers'),
                'singular_name' => __('Flyer'),
                'add_new' => __('Adicionar Novo Flyer'),
                'add_new_item' => __('Adicionar Novo Flyer de Evento'),
                'edit_item' => __('Editar Flyer'),
                'new_item' => __('Novo Flyer'),
                'view_item' => __('Ver Flyer'),
                'search_items' => __('Buscar Flyers'),
                'not_found' => __('Nenhum flyer encontrado'),
                'not_found_in_trash' => __('Nenhum flyer na lixeira')
            ),
            'public' => true,
            'has_archive' => false,
            'show_in_rest' => true, // CRUCIAL: Habilita API JSON para o React
            'supports' => array('title', 'editor', 'thumbnail'), // Título + Imagem Destacada
            'menu_icon' => 'dashicons-format-gallery',
            'rewrite' => array('slug' => 'flyers'),
        )
    );
}
add_action('init', 'create_flyer_post_type');