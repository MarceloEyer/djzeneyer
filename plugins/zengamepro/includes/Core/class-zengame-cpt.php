<?php
/**
 * ZenGame Custom Post Types
 * Registers Ranks and Missions.
 */
namespace ZenEyer\GamePro\Core;

if (!defined('ABSPATH')) {
    die;
}

class CPT {

    public function __construct() {
        \add_action('init', [$this, 'register_post_types'], 5);
    }

    /**
     * Register Custom Post Types for the Game Engine
     */
    public function register_post_types() {
        // 1. Ranks (Níveis)
        \register_post_type('zengame_rank', [
            'labels' => [
                'name'               => 'Níveis',
                'singular_name'      => 'Nível',
                'add_new'            => 'Adicionar Novo Nível',
                'add_new_item'       => 'Adicionar Novo Nível',
                'edit_item'          => 'Editar Nível',
                'new_item'           => 'Novo Nível',
                'view_item'          => 'Ver Nível',
                'search_items'       => 'Procurar Níveis',
                'not_found'          => 'Nenhum nível encontrado',
                'not_found_in_trash' => 'Nenhum nível encontrado na lixeira',
                'menu_name'          => 'Níveis',
            ],
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => 'zengamepro',
            'has_archive'         => false,
            'hierarchical'        => false,
            'supports'            => ['title', 'thumbnail', 'editor'],
            'menu_icon'           => 'dashicons-awards',
            'capability_type'     => 'post',
            'show_in_rest'        => true,
        ]);

        // 2. Missions (Missões)
        \register_post_type('zengame_mission', [
            'labels' => [
                'name'               => 'Missões',
                'singular_name'      => 'Missão',
                'add_new'            => 'Adicionar Nova Missão',
                'add_new_item'       => 'Adicionar Nova Missão',
                'edit_item'          => 'Editar Missão',
                'new_item'           => 'Nova Missão',
                'view_item'          => 'Ver Missão',
                'search_items'       => 'Procurar Missões',
                'not_found'          => 'Nenhuma missão encontrada',
                'not_found_in_trash' => 'Nenhuma missão encontrada na lixeira',
                'menu_name'          => 'Missões',
            ],
            'public'              => false,
            'show_ui'             => true,
            'show_in_menu'        => 'zengamepro',
            'has_archive'         => false,
            'hierarchical'        => false,
            'supports'            => ['title', 'thumbnail', 'editor'],
            'menu_icon'           => 'dashicons-flag',
            'capability_type'     => 'post',
            'show_in_rest'        => true,
        ]);

        // 3. Achievements (Conquistas - Future use)
        \register_post_type('zengame_award', [
            'labels' => [
                'name'          => 'Conquistas',
                'singular_name' => 'Conquista',
                'menu_name'     => 'Conquistas',
            ],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => 'zengamepro',
            'supports'     => ['title', 'thumbnail', 'editor'],
            'menu_icon'    => 'dashicons-star-filled',
        ]);
    }
}
