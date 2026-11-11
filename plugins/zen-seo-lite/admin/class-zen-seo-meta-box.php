<?php
namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Meta_Box
{

    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        \add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        \add_action('save_post', [$this, 'save_meta_data'], 10, 2);
    }

    /**
     * Add meta boxes
     */
    public function add_meta_boxes()
    {
        $post_types = Zen_SEO_Helpers::get_supported_post_types();

        foreach ($post_types as $post_type) {
            \add_meta_box(
                'zen_seo_meta',
                __('🔍 Zen SEO', 'zen-seo'),
                [$this, 'render_meta_box'],
                $post_type,
                'normal',
                'high'
            );
        }
    }

    /**
     * Render meta box
     */
    public function render_meta_box($post)
    {
        \wp_nonce_field('zen_seo_meta_box', 'zen_seo_nonce');

        $meta = Zen_SEO_Helpers::get_post_meta($post->ID);
        $post_type = \get_post_type($post);

        ?>
        <div class="zen-seo-meta-box">
            <style>
                .zen-seo-meta-box {
                    padding: 10px 0;
                }

                .zen-seo-field {
                    margin-bottom: 20px;
                }

                .zen-seo-field label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 5px;
                    color: #1d2327;
                }

                .zen-seo-field input[type="text"],
                .zen-seo-field input[type="url"],
                .zen-seo-field input[type="date"],
                .zen-seo-field select,
                .zen-seo-field textarea {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #8c8f94;
                    border-radius: 4px;
                }

                .zen-seo-field textarea {
                    resize: vertical;
                }

                .zen-seo-field .description {
                    margin-top: 5px;
                    color: #646970;
                    font-size: 13px;
                }

                .zen-seo-preview {
                    background: #f6f7f7;
                    border: 1px solid #c3c4c7;
                    border-radius: 4px;
                    padding: 15px;
                    margin-top: 10px;
                }

                .zen-seo-preview-title {
                    color: #1a0dab;
                    font-size: 18px;
                    font-weight: 400;
                    margin-bottom: 5px;
                }

                .zen-seo-preview-url {
                    color: #006621;
                    font-size: 14px;
                    margin-bottom: 5px;
                }

                .zen-seo-preview-desc {
                    color: #545454;
                    font-size: 13px;
                    line-height: 1.4;
                }
            </style>

            <!-- SEO Title -->
            <div class="zen-seo-field">
                <label for="zen_seo_title">
                    <?php _e('SEO Title', 'zen-seo'); ?>
                </label>
                <input type="text" id="zen_seo_title" name="zen_seo[title]"
                    value="<?php echo \esc_attr($meta['title'] ?? ''); ?>"
                    placeholder="<?php echo \esc_attr(\get_the_title($post)); ?>">
                <p class="description">
                    <?php _e('Leave empty to use post title. Recommended: 50-60 characters.', 'zen-seo'); ?>
                </p>
            </div>

            <!-- Meta Description -->
            <div class="zen-seo-field">
                <label for="zen_seo_desc">
                    <?php _e('Meta Description', 'zen-seo'); ?>
                </label>
                <textarea id="zen_seo_desc" name="zen_seo[desc]" rows="3"
                    placeholder="<?php _e('Write a compelling description...', 'zen-seo'); ?>"><?php echo \esc_textarea($meta['desc'] ?? ''); ?></textarea>
                <p class="description">
                    <?php _e('Recommended: 150-160 characters. This appears in search results.', 'zen-seo'); ?>
                </p>
            </div>

            <!-- OG Image -->
            <div class="zen-seo-field">
                <label for="zen_seo_image">
                    <?php _e('Open Graph Image URL', 'zen-seo'); ?>
                </label>
                <input type="url" id="zen_seo_image" name="zen_seo[image]" value="<?php echo \esc_url($meta['image'] ?? ''); ?>"
                    placeholder="<?php echo \esc_url(Zen_SEO_Helpers::get_featured_image($post->ID)); ?>">
                <p class="description">
                    <?php _e('Leave empty to use featured image. Recommended: 1200x630px.', 'zen-seo'); ?>
                </p>
            </div>

            <!-- No Index -->
            <div class="zen-seo-field">
                <label>
                    <input type="checkbox" name="zen_seo[noindex]" value="1" <?php \checked(!empty($meta['noindex']), true); ?>>
                    <?php _e('No Index (hide from search engines)', 'zen-seo'); ?>
                </label>
                <p class="description">
                    <?php _e('Check this to prevent search engines from indexing this page.', 'zen-seo'); ?>
                </p>
            </div>

            <?php if ($post_type === 'flyers'): ?>
                <!-- Event-specific fields -->
                <hr style="margin: 20px 0;">
                <h3><?php _e('Event Information', 'zen-seo'); ?></h3>

                <div class="zen-seo-field">
                    <label for="zen_seo_event_date">
                        <?php _e('Event Date', 'zen-seo'); ?>
                    </label>
                    <input type="date" id="zen_seo_event_date" name="zen_seo[event_date]"
                        value="<?php echo \esc_attr($meta['event_date'] ?? ''); ?>">
                </div>

                <div class="zen-seo-field">
                    <label for="zen_seo_event_location">
                        <?php _e('Event Location', 'zen-seo'); ?>
                    </label>
                    <input type="text" id="zen_seo_event_location" name="zen_seo[event_location]"
                        value="<?php echo \esc_attr($meta['event_location'] ?? ''); ?>"
                        placeholder="<?php _e('São Paulo, Brazil', 'zen-seo'); ?>">
                </div>

                <div class="zen-seo-field">
                    <label for="zen_seo_event_ticket">
                        <?php _e('Ticket URL', 'zen-seo'); ?>
                    </label>
                    <input type="url" id="zen_seo_event_ticket" name="zen_seo[event_ticket]"
                        value="<?php echo \esc_url($meta['event_ticket'] ?? ''); ?>" placeholder="https://...">
                </div>
            <?php endif; ?>

            <?php if ($post_type === 'post'): ?>
                <!-- Music release fields for WordPress posts used as Releases -->
                <hr style="margin: 20px 0;">
                <h3><?php _e('Music Release Schema', 'zen-seo'); ?></h3>
                <p class="description">
                    <?php _e('Optional structured data for release posts. Fill only when this post is a music release.', 'zen-seo'); ?>
                </p>

                <div class="zen-seo-field">
                    <label for="zen_seo_release_type">
                        <?php _e('Release Type', 'zen-seo'); ?>
                    </label>
                    <select id="zen_seo_release_type" name="zen_seo[release_type]">
                        <?php
                        $release_type = (string) ($meta['release_type'] ?? '');
                        $release_types = [
                            '' => __('Not a music release', 'zen-seo'),
                            'single' => __('Single', 'zen-seo'),
                            'remix' => __('Remix', 'zen-seo'),
                            'edit' => __('Edit', 'zen-seo'),
                            'ep' => __('EP', 'zen-seo'),
                            'album' => __('Album', 'zen-seo'),
                        ];
                        foreach ($release_types as $value => $label):
                            ?>
                            <option value="<?php echo \esc_attr($value); ?>" <?php \selected($release_type, $value); ?>>
                                <?php echo \esc_html($label); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div class="zen-seo-field">
                    <label for="zen_seo_release_date">
                        <?php _e('Release Date', 'zen-seo'); ?>
                    </label>
                    <input type="date" id="zen_seo_release_date" name="zen_seo[release_date]"
                        value="<?php echo \esc_attr($meta['release_date'] ?? ''); ?>">
                </div>

                <div class="zen-seo-field">
                    <label for="zen_seo_isrc_code">
                        <?php _e('ISRC Code', 'zen-seo'); ?>
                    </label>
                    <input type="text" id="zen_seo_isrc_code" name="zen_seo[isrc_code]"
                        value="<?php echo \esc_attr($meta['isrc_code'] ?? ''); ?>"
                        placeholder="BRXXX2500001">
                    <p class="description">
                        <?php _e('Optional. Leave empty for unofficial remixes or releases without ISRC.', 'zen-seo'); ?>
                    </p>
                </div>

                <div class="zen-seo-field">
                    <label for="zen_seo_primary_artist">
                        <?php _e('Primary Artist', 'zen-seo'); ?>
                    </label>
                    <input type="text" id="zen_seo_primary_artist" name="zen_seo[primary_artist]"
                        value="<?php echo \esc_attr($meta['primary_artist'] ?? ''); ?>"
                        placeholder="Zen Eyer">
                </div>

                <div class="zen-seo-field">
                    <label for="zen_seo_contributors">
                        <?php _e('Contributors', 'zen-seo'); ?>
                    </label>
                    <textarea id="zen_seo_contributors" name="zen_seo[contributors]" rows="3"
                        placeholder="<?php echo \esc_attr__('One name per line: producer, remixer, composer, vocalist...', 'zen-seo'); ?>"><?php echo \esc_textarea($meta['contributors'] ?? ''); ?></textarea>
                </div>

                <?php
                $release_urls = [
                    'spotify_url' => __('Spotify URL', 'zen-seo'),
                    'apple_music_url' => __('Apple Music URL', 'zen-seo'),
                    'youtube_url' => __('YouTube URL', 'zen-seo'),
                    'soundcloud_url' => __('SoundCloud URL', 'zen-seo'),
                    'musicbrainz_url' => __('MusicBrainz URL', 'zen-seo'),
                ];
                foreach ($release_urls as $field => $label):
                    ?>
                    <div class="zen-seo-field">
                        <label for="zen_seo_<?php echo \esc_attr($field); ?>">
                            <?php echo \esc_html($label); ?>
                        </label>
                        <input type="url" id="zen_seo_<?php echo \esc_attr($field); ?>" name="zen_seo[<?php echo \esc_attr($field); ?>]"
                            value="<?php echo \esc_url($meta[$field] ?? ''); ?>" placeholder="https://...">
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>

            <!-- Preview -->
            <hr style="margin: 20px 0;">
            <h3><?php _e('Search Preview', 'zen-seo'); ?></h3>
            <div class="zen-seo-preview">
                <div class="zen-seo-preview-title" id="zen-preview-title">
                    <?php echo \esc_html($meta['title'] ?? \get_the_title($post)); ?>
                </div>
                <div class="zen-seo-preview-url">
                    <?php echo \esc_url(Zen_SEO_Helpers::get_frontend_url(\get_permalink($post))); ?>
                </div>
                <div class="zen-seo-preview-desc" id="zen-preview-desc">
                    <?php
                    if (!empty($meta['desc'])) {
                        echo \esc_html($meta['desc']);
                    } else {
                        echo \esc_html(Zen_SEO_Helpers::generate_excerpt(\get_post_field('post_content', $post)));
                    }
                    ?>
                </div>
            </div>

            <script>
                (function () {
                    // Live preview update
                    const titleInput = document.getElementById('zen_seo_title');
                    const descInput = document.getElementById('zen_seo_desc');
                    const previewTitle = document.getElementById('zen-preview-title');
                    const previewDesc = document.getElementById('zen-preview-desc');

                    const defaultTitle = <?php echo \json_encode(\get_the_title($post)); ?>;
                    const defaultDesc = <?php echo \json_encode(Zen_SEO_Helpers::generate_excerpt(\get_post_field('post_content', $post))); ?>;

                    if (titleInput && previewTitle) {
                        titleInput.addEventListener('input', function () {
                            previewTitle.textContent = this.value || defaultTitle;
                        });
                    }

                    if (descInput && previewDesc) {
                        descInput.addEventListener('input', function () {
                            previewDesc.textContent = this.value || defaultDesc;
                        });
                    }
                })();
            </script>
        </div>
        <?php
    }

    /**
     * Save meta data
     */
    public function save_meta_data($post_id, $post)
    {
        // Security checks
        $nonce = isset($_POST['zen_seo_nonce']) ? \sanitize_text_field(\wp_unslash($_POST['zen_seo_nonce'])) : '';
        if (!$nonce || !\wp_verify_nonce($nonce, 'zen_seo_meta_box')) {
            return;
        }

        if (\defined('DOING_AUTOSAVE') && \DOING_AUTOSAVE) {
            return;
        }

        if (!\current_user_can('edit_post', $post_id)) {
            return;
        }

        // Don't save for revisions or autosaves
        if (\wp_is_post_revision($post_id) || \wp_is_post_autosave($post_id)) {
            return;
        }

        // Sanitize and save data
        $zen_seo_data = isset($_POST['zen_seo']) ? \wp_unslash($_POST['zen_seo']) : [];
        if (\is_array($zen_seo_data)) {
            $sanitized = [];

            foreach ($zen_seo_data as $key => $value) {
                $key = \sanitize_key($key);
                if (!\is_scalar($value)) {
                    continue;
                }

                switch ($key) {
                    case 'noindex':
                        $sanitized[$key] = !empty($value) ? 1 : 0;
                        break;

                    case 'image':
                    case 'event_ticket':
                    case 'spotify_url':
                    case 'apple_music_url':
                    case 'youtube_url':
                    case 'soundcloud_url':
                    case 'musicbrainz_url':
                        $sanitized[$key] = Zen_SEO_Helpers::sanitize_url($value);
                        break;

                    case 'desc':
                    case 'contributors':
                        $sanitized[$key] = \sanitize_textarea_field($value);
                        break;

                    case 'release_type':
                        $allowed_release_types = ['single', 'remix', 'edit', 'ep', 'album'];
                        $release_type = \sanitize_key($value);
                        $sanitized[$key] = \in_array($release_type, $allowed_release_types, true) ? $release_type : '';
                        break;

                    default:
                        $sanitized[$key] = \sanitize_text_field($value);
                        break;
                }
            }

            \update_post_meta($post_id, '_zen_seo_data', $sanitized);

            // Clear caches
            Zen_SEO_Cache::clear_schema($post_id);
            Zen_SEO_Cache::clear_meta($post_id);
            Zen_SEO_Cache::clear_sitemap();

            Zen_SEO_Helpers::log('Meta data saved', ['post_id' => $post_id]);
        }
    }
}
