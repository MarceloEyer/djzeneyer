<?php
/**
 * inc/cpt.php
 * Registro de Custom Post Types e Taxonomias
 */

if (!defined('ABSPATH')) exit;

/* ==========================================================================
 * 1. FLYERS (Galeria de Eventos)
 * ========================================================================== */
function zen_register_flyer_cpt() {
    register_post_type('flyers',
        array(
            'labels' => array(
                'name' => __('Flyers'),
                'singular_name' => __('Flyer'),
                'add_new_item' => __('Adicionar Novo Flyer'),
                'edit_item' => __('Editar Flyer'),
                'search_items' => __('Buscar Flyers'),
            ),
            'public' => true,
            'show_in_rest' => true, // API Habilitada
            'supports' => array('title', 'thumbnail'), // A imagem destacada é o Flyer
            'menu_icon' => 'dashicons-format-gallery',
            'rewrite' => array('slug' => 'flyers'),
        )
    );
}
add_action('init', 'zen_register_flyer_cpt');


/* ==========================================================================
 * 2. MÚSICAS & REMIXES (Library)
 * ========================================================================== */
function zen_register_music_cpt() {
    $labels = array(
        'name' => __('Músicas'),
        'singular_name' => __('Música'),
        'menu_name' => 'Músicas',
        'add_new_item' => __('Adicionar Nova Música/Set'),
        'edit_item' => __('Editar Música'),
        'search_items' => __('Buscar na Biblioteca'),
    );

    register_post_type('remixes',
        array(
            'labels' => $labels,
            'public' => true,
            'show_in_rest' => true, // API Habilitada
            'rest_base' => 'remixes', // Endpoint: /wp-json/wp/v2/remixes
            'supports' => array('title', 'thumbnail', 'custom-fields', 'excerpt'),
            'menu_icon' => 'dashicons-album',
            'rewrite' => array('slug' => 'music'),
        )
    );
}
add_action('init', 'zen_register_music_cpt');

/**
 * 2.1 Taxonomia: TAGS MUSICAIS (Para estilos: RnB, Kizomba, Chill, etc)
 * Não hierárquico (igual tags de blog), permite múltiplas seleções.
 */
function zen_register_music_tags() {
    register_taxonomy(
        'music_tags', // ID da taxonomia
        'remixes',    // Post type associado
        array(
            'label' => __('Tags Musicais'),
            'rewrite' => array('slug' => 'genre'),
            'hierarchical' => false, // FALSE = Comportamento de Tag (nuvem)
            'show_in_rest' => true,  // CRÍTICO para o React
            'show_admin_column' => true,
        )
    );
}
add_action('init', 'zen_register_music_tags');

/**
 * 2.2 Taxonomia: TIPO (Para estrutura: Set, Track, Remix)
 * Hierárquico (igual categoria), ideal para "Formato".
 */
function zen_register_music_type() {
    register_taxonomy(
        'music_type',
        'remixes',
        array(
            'label' => __('Tipo/Formato'), // Ex: Set, Single, EP
            'hierarchical' => true, // TRUE = Comportamento de Categoria
            'show_in_rest' => true,
            'show_admin_column' => true,
        )
    );
}
add_action('init', 'zen_register_music_type');


/* ==========================================================================
 * 3. API CUSTOM FIELDS (Expor URL e Tags para o React)
 * ========================================================================== */
function zen_expose_music_data_to_api() {
    
    // 3.1 Link do Áudio (Custom Field 'audio_url')
    register_rest_field('remixes', 'audio_url', array(
        'get_callback' => function($object) {
            return get_post_meta($object['id'], 'audio_url', true);
        },
        'schema' => null,
    ));

    // 3.2 Nomes das Tags (Para mostrar "Kizomba, RnB" no player)
    register_rest_field('remixes', 'tag_names', array(
        'get_callback' => function($object) {
            $terms = get_the_terms($object['id'], 'music_tags');
            if ($terms && !is_wp_error($terms)) {
                return array_map(function($term) { return $term->name; }, $terms);
            }
            return [];
        }
    ));
    
    // 3.3 Nome do Tipo (Set ou Track)
    register_rest_field('remixes', 'type_name', array(
        'get_callback' => function($object) {
            $terms = get_the_terms($object['id'], 'music_type');
            if ($terms && !is_wp_error($terms)) {
                return $terms[0]->name;
            }
            return 'Music';
        }
    ));
}
add_action('rest_api_init', 'zen_expose_music_data_to_api');