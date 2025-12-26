<?php
/**
 * Custom Post Types & Taxonomies
 * Flyers, Music Library
 */

if (!defined('ABSPATH')) exit;

/**
 * Flyers (Event Gallery)
 */
add_action('init', function() {
    register_post_type('flyers', [
        'labels' => [
            'name' => 'Flyers',
            'singular_name' => 'Flyer',
        ],
        'public' => true,
        'show_in_rest' => true,
        'supports' => ['title', 'thumbnail'],
        'menu_icon' => 'dashicons-format-gallery',
        'rewrite' => ['slug' => 'flyers'],
    ]);
});

/**
 * Music (Remixes & Sets)
 */
add_action('init', function() {
    register_post_type('remixes', [
        'labels' => [
            'name' => 'Músicas',
            'singular_name' => 'Música',
        ],
        'public' => true,
        'show_in_rest' => true,
        'rest_base' => 'remixes',
        'supports' => ['title', 'thumbnail', 'custom-fields', 'excerpt'],
        'menu_icon' => 'dashicons-album',
        'rewrite' => ['slug' => 'music'],
    ]);
});

/**
 * Music Tags (Genres: RnB, Kizomba, etc)
 */
add_action('init', function() {
    register_taxonomy('music_tags', 'remixes', [
        'label' => 'Tags Musicais',
        'hierarchical' => false,
        'show_in_rest' => true,
        'show_admin_column' => true,
        'rewrite' => ['slug' => 'genre'],
    ]);
});

/**
 * Music Type (Set, Track, Remix)
 */
add_action('init', function() {
    register_taxonomy('music_type', 'remixes', [
        'label' => 'Tipo/Formato',
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_admin_column' => true,
    ]);
});

/**
 * Expose Custom Fields to REST API
 */
add_action('rest_api_init', function() {
    register_rest_field('remixes', 'audio_url', [
        'get_callback' => fn($object) => get_post_meta($object['id'], 'audio_url', true),
    ]);
    
    register_rest_field('remixes', 'tag_names', [
        'get_callback' => function($object) {
            $terms = get_the_terms($object['id'], 'music_tags');
            return $terms ? array_map(fn($t) => $t->name, $terms) : [];
        },
    ]);
    
    register_rest_field('remixes', 'type_name', [
        'get_callback' => function($object) {
            $terms = get_the_terms($object['id'], 'music_type');
            return $terms ? $terms[0]->name : 'Music';
        },
    ]);
});