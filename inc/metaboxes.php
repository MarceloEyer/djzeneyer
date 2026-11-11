<?php
/**
 * Metaboxes
 * Music link manager (Download, SoundCloud, YouTube)
 */

if (!defined('ABSPATH')) exit;

/**
 * Add metabox
 */
if (is_admin()) {
    add_action('add_meta_boxes', function() {
        add_meta_box(
            'zen_music_links',
            '🔗 Links de Distribuição',
            'djz_music_links_html',
            'remixes',
            'normal',
            'high'
        );
    });

    /**
     * Save metabox
     */
    add_action('save_post_remixes', function($post_id) {
        if (!isset($_POST['zen_music_nonce']) || 
            !wp_verify_nonce($_POST['zen_music_nonce'], 'zen_save_music')) return;
        
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;
        
        $fields = ['audio_url', 'soundcloud_url', 'youtube_url'];
        
        foreach ($fields as $field) {
            if (isset($_POST[$field])) {
                update_post_meta($post_id, $field, esc_url_raw($_POST[$field]));
            }
        }
    });
}

/**
 * Expose to REST API
 */
add_action('rest_api_init', function() {
    register_rest_field('remixes', 'links', [
        'get_callback' => function($object) {
            return [
                'download' => get_post_meta($object['id'], 'audio_url', true),
                'soundcloud' => get_post_meta($object['id'], 'soundcloud_url', true),
                'youtube' => get_post_meta($object['id'], 'youtube_url', true),
            ];
        },
    ]);
});