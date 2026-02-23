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

    // Featured images (Medium & Full) for remixes and posts
    register_rest_field(['remixes', 'post'], 'featured_image_src', [
        'get_callback' => function($object) {
            $img_id = get_post_thumbnail_id($object['id']);
            if (!$img_id) return null;
            $src = wp_get_attachment_image_src($img_id, 'medium_large');
            $url = $src ? $src[0] : wp_get_attachment_url($img_id);
            return $url ?: null; // Coerce false to null
        },
    ]);

    register_rest_field(['remixes', 'post'], 'featured_image_src_full', [
        'get_callback' => function($object) {
            $img_id = get_post_thumbnail_id($object['id']);
            if (!$img_id) return null;
            return wp_get_attachment_url($img_id) ?: null; // Coerce false to null
        },
    ]);

    // Author Name for posts (to avoid _embed)
    register_rest_field('post', 'author_name', [
        'get_callback' => function($object) {
            $author_id = $object['author'] ?? get_post_field('post_author', $object['id']);
            return get_the_author_meta('display_name', $author_id) ?: 'Zen Eyer';
        },
    ]);
});

/**
 * Optimization: Batch prime attachment caches for REST API
 * Resolves N+1 query issue when fetching 'remixes' with 'featured_image_src'
 */
add_filter('the_posts', function($posts, $query) {
    // 1. Context check: is_main_query() is false for REST requests.
    // We target REST context or main query for standard pages.
    $is_rest = defined('REST_REQUEST') && REST_REQUEST;
    if (!$query instanceof WP_Query || empty($posts)) {
        return $posts;
    }
    
    if (!$is_rest && !$query->is_main_query()) {
        return $posts;
    }

    // 2. Validate post types (remixes and post)
    $post_type = $query->get('post_type');
    $target_types = ['remixes', 'post'];
    
    $has_target_type = false;
    if (is_array($post_type)) {
        $has_target_type = !empty(array_intersect($target_types, $post_type));
    } else {
        $has_target_type = in_array($post_type, $target_types, true);
    }

    if (!$has_target_type) {
        return $posts;
    }

    // 3. Collect thumbnail IDs from the posts
    $img_ids = array();
    foreach ($posts as $post) {
        if ($post instanceof WP_Post) {
            $thumb_id = get_post_thumbnail_id($post->ID);
            if ($thumb_id) {
                $img_ids[] = (int) $thumb_id;
            }
        }
    }

    // 4. Prime caches in bulk (2 queries total)
    if (!empty($img_ids)) {
        $img_ids = array_unique($img_ids);
        // Prime metadata cache
        update_meta_cache('post', $img_ids);
        // Prime post objects cache (3rd param 'false' avoids redundant meta update)
        if (function_exists('_prime_post_caches')) {
            _prime_post_caches($img_ids, false, false);
        }
    }

    return $posts;
}, 10, 2);
