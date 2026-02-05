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
    
    $get_type_callback = function($object) {
        $terms = get_the_terms($object['id'], 'music_type');
        return $terms ? $terms[0]->name : 'Music';
    };

    register_rest_field('remixes', 'type_name', ['get_callback' => $get_type_callback]);
    register_rest_field('remixes', 'category_name', ['get_callback' => $get_type_callback]);

    register_rest_field('remixes', 'featured_image_src', [
        'get_callback' => function($object) {
            $img_id = get_post_thumbnail_id($object['id']);
            if (!$img_id) return null;
            $src = wp_get_attachment_image_src($img_id, 'medium_large');
            return $src ? $src[0] : wp_get_attachment_url($img_id);
        },
    ]);

    register_rest_field('remixes', 'featured_image_src_full', [
        'get_callback' => function($object) {
            $img_id = get_post_thumbnail_id($object['id']);
            return $img_id ? wp_get_attachment_url($img_id) : null;
        },
    ]);
});

/**
 * Optimize REST API: Batch Prime Attachments
 * Solves N+1 problem for featured_image_src field
 */
add_filter('the_posts', function($posts, $query) {
    if (empty($posts)) return $posts;
    if ($query->get('post_type') !== 'remixes') return $posts;

    // Only target REST requests to be safe
    if (!defined('REST_REQUEST') || !REST_REQUEST) return $posts;

    $attachment_ids = [];
    foreach ($posts as $post) {
        $thumb_id = get_post_thumbnail_id($post->ID);
        if ($thumb_id) {
            $attachment_ids[] = $thumb_id;
        }
    }

    if (!empty($attachment_ids)) {
        $attachment_ids = array_unique($attachment_ids);
        update_meta_cache('post', $attachment_ids);
        if (function_exists('_prime_post_caches')) {
            _prime_post_caches($attachment_ids, false, false);
        }
    }

    return $posts;
}, 10, 2);
