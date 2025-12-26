<?php
/**
 * Metaboxes
 * Music link manager (Download, SoundCloud, YouTube)
 */

if (!defined('ABSPATH')) exit;

/**
 * Add metabox
 */
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
 * Metabox HTML
 */
function djz_music_links_html($post) {
    $download = get_post_meta($post->ID, 'audio_url', true);
    $soundcloud = get_post_meta($post->ID, 'soundcloud_url', true);
    $youtube = get_post_meta($post->ID, 'youtube_url', true);
    
    wp_nonce_field('zen_save_music', 'zen_music_nonce');
    ?>
    <div style="display:grid;gap:15px;padding:15px;background:#f0f6fc;border:1px solid #cce5ff;border-radius:5px;">
        
        <div style="border-bottom:1px solid #ddd;padding-bottom:15px;">
            <label style="font-weight:bold;display:block;margin-bottom:5px;">
                📥 Link de Download (Principal)
            </label>
            <input type="url" name="audio_url" value="<?= esc_attr($download) ?>" 
                   style="width:100%;padding:10px;" 
                   placeholder="https://drive.google.com/file/d/..." />
            <p style="color:#666;font-size:12px;margin-top:4px;">
                Link que o botão "Download Grátis" vai abrir
            </p>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
            <div>
                <label style="font-weight:bold;display:block;margin-bottom:5px;">
                    ☁️ SoundCloud
                </label>
                <input type="url" name="soundcloud_url" value="<?= esc_attr($soundcloud) ?>" 
                       style="width:100%;padding:8px;" 
                       placeholder="https://soundcloud.com/djzeneyer/..." />
            </div>
            
            <div>
                <label style="font-weight:bold;display:block;margin-bottom:5px;">
                    ▶️ YouTube
                </label>
                <input type="url" name="youtube_url" value="<?= esc_attr($youtube) ?>" 
                       style="width:100%;padding:8px;" 
                       placeholder="https://youtube.com/watch?v=..." />
            </div>
        </div>
    </div>
    <?php
}

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