<?php
/**
 * Custom Post Types for ZenGame (Ranks, Achievements, Missions)
 */
namespace ZenEyer\Game\Core;

if (!defined('ABSPATH')) {
    die;
}

class CPT {

    public function __construct() {
        \add_action('init', [$this, 'register_post_types']);
    }

    public function register_post_types() {
        // 1. Ranks (Níveis)
        $labels_rank = [
            'name'               => 'Níveis',
            'singular_name'      => 'Nível',
            'menu_name'          => 'Níveis',
            'add_new'            => 'Adicionar Novo',
            'add_new_item'       => 'Adicionar Nível',
            'edit_item'          => 'Editar Nível',
            'new_item'           => 'Novo Nível',
            'view_item'          => 'Ver Nível',
            'all_items'          => 'Todos os Níveis'
        ];

        \register_post_type('zengame_rank', [
            'labels'              => $labels_rank,
            'public'              => false, // Internal usage
            'show_ui'             => true,
            'show_in_menu'        => 'zengame',
            'capability_type'     => 'post',
            'hierarchical'        => true,
            'supports'            => ['title', 'thumbnail', 'page-attributes'], // page-attributes for ordering
            'menu_icon'           => 'dashicons-awards',
        ]);

        // 2. Achievements (Conquistas)
        $labels_achv = [
            'name'               => 'Conquistas',
            'singular_name'      => 'Conquista',
            'menu_name'          => 'Conquistas',
            'add_new'            => 'Adicionar Nova',
            'add_new_item'       => 'Adicionar Conquista',
            'edit_item'          => 'Editar Conquista',
            'new_item'           => 'Nova Conquista',
            'view_item'          => 'Ver Conquista',
            'all_items'          => 'Todas as Conquistas'
        ];

        \register_post_type('zengame_achievement', [
            'labels'              => $labels_achv,
            'public'              => false, // Internal usage
            'show_ui'             => true,
            'show_in_menu'        => 'zengame',
            'capability_type'     => 'post',
            'supports'            => ['title', 'editor', 'thumbnail'],
        ]);

        // 3. Missions (Missões/Quizzes)
        $labels_mission = [
            'name'               => 'Missões',
            'singular_name'      => 'Missão',
            'menu_name'          => 'Missões',
            'add_new'            => 'Adicionar Nova',
            'add_new_item'       => 'Adicionar Missão',
            'edit_item'          => 'Editar Missão',
            'new_item'           => 'Nova Missão',
            'view_item'          => 'Ver Missão',
            'all_items'          => 'Todas as Missões'
        ];

        \register_post_type('zengame_mission', [
            'labels'              => $labels_mission,
            'public'              => false, // Exposed via REST API instead
            'show_ui'             => true,
            'show_in_menu'        => 'zengame',
            'capability_type'     => 'post',
            'supports'            => ['title', 'editor', 'thumbnail'],
            'menu_icon'           => 'dashicons-yes',
        ]);
    }
}
