<?php
/**
 * Admin settings page
 *
 * @package Zen_SEO_Lite_Pro
 * @since 8.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Admin {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_action('admin_notices', [$this, 'show_admin_notices']);
    }
    
    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_submenu_page(
            'zen-plugins',
            __('Zen SEO Settings', 'zen-seo'),
            __('Zen SEO', 'zen-seo'),
            'manage_options',
            'zen-seo-settings',
            [$this, 'render_settings_page']
        );
        
        add_submenu_page(
            'zen-plugins',
            __('Cache Manager', 'zen-seo'),
            __('SEO Cache', 'zen-seo'),
            'manage_options',
            'zen-seo-cache',
            [$this, 'render_cache_page']
        );
    }
    
    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('zen_seo_options', 'zen_seo_global', [
            'sanitize_callback' => [$this, 'sanitize_settings'],
            'default' => []
        ]);
        
        // Identity section
        add_settings_section(
            'zen_identity',
            __('👤 Identity & Business', 'zen-seo'),
            [$this, 'render_section_identity'],
            'zen-seo-settings'
        );
        
        $identity_fields = [
            'real_name' => [
                'label' => __('Full Legal Name', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: Marcelo Eyer Fernandes', 'zen-seo')
            ],
            'booking_email' => [
                'label' => __('Booking Email', 'zen-seo'),
                'type' => 'email',
                'desc' => __('Example: booking@djzeneyer.com', 'zen-seo')
            ],
            'cnpj' => [
                'label' => __('CNPJ', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Format: 00.000.000/0000-00', 'zen-seo')
            ],
            'birth_place' => [
                'label' => __('Birth Place', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: Rio de Janeiro, Brazil', 'zen-seo')
            ],
            'home_location' => [
                'label' => __('Home Location', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: São Paulo, Brazil', 'zen-seo')
            ],
        ];
        
        foreach ($identity_fields as $id => $field) {
            add_settings_field(
                $id,
                $field['label'],
                [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_identity',
                array_merge($field, ['id' => $id])
            );
        }
        
        // Authority section
        add_settings_section(
            'zen_authority',
            __('🏛️ Musical Authority', 'zen-seo'),
            [$this, 'render_section_authority'],
            'zen-seo-settings'
        );
        
        $authority_fields = [
            'isni_code' => [
                'label' => __('ISNI Code', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Format: 0000 0001 2345 6789', 'zen-seo')
            ],
            'musicbrainz' => [
                'label' => __('MusicBrainz URL', 'zen-seo'),
                'type' => 'url'
            ],
            'wikidata' => [
                'label' => __('Wikidata URL', 'zen-seo'),
                'type' => 'url'
            ],
            'google_kg' => [
                'label' => __('Google Knowledge Graph ID', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: /g/11... or full URL', 'zen-seo')
            ],
            'mensa_url' => [
                'label' => __('Mensa International URL', 'zen-seo'),
                'type' => 'url'
            ],
        ];
        
        foreach ($authority_fields as $id => $field) {
            add_settings_field(
                $id,
                $field['label'],
                [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_authority',
                array_merge($field, ['id' => $id])
            );
        }
        
        // Social section
        add_settings_section(
            'zen_social',
            __('🌐 Digital Ecosystem', 'zen-seo'),
            [$this, 'render_section_social'],
            'zen-seo-settings'
        );
        
        $social_platforms = [
            'beatport', 'spotify', 'apple_music', 'shazam', 'soundcloud',
            'mixcloud', 'bandcamp', 'songkick', 'bandsintown',
            'instagram', 'youtube', 'facebook', 'ranker_list'
        ];
        
        foreach ($social_platforms as $platform) {
            $label = ucwords(str_replace('_', ' ', $platform));
            if ($platform === 'ranker_list') {
                $label = __('Ranker List (#1 Zouk)', 'zen-seo');
            }
            
            add_settings_field(
                $platform,
                $label,
                [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_social',
                ['id' => $platform, 'type' => 'url']
            );
        }
        
        // Technical section
        add_settings_section(
            'zen_technical',
            __('⚙️ Technical & Awards', 'zen-seo'),
            [$this, 'render_section_technical'],
            'zen-seo-settings'
        );
        
        add_settings_field(
            'awards_list',
            __('Awards List', 'zen-seo'),
            [$this, 'render_textarea_field'],
            'zen-seo-settings',
            'zen_technical',
            [
                'id' => 'awards_list',
                'desc' => __('One award per line. Example: 2022 - World Champion (Remix)', 'zen-seo'),
                'rows' => 5
            ]
        );
        
        add_settings_field(
            'default_image',
            __('Default OG Image', 'zen-seo'),
            [$this, 'render_image_field'],
            'zen-seo-settings',
            'zen_technical',
            ['id' => 'default_image']
        );
        
        add_settings_field(
            'react_routes',
            __('React Routes (Polylang)', 'zen-seo'),
            [$this, 'render_textarea_field'],
            'zen-seo-settings',
            'zen_technical',
            [
                'id' => 'react_routes',
                'desc' => __('Format: /en-route, /pt-route (one per line)', 'zen-seo'),
                'rows' => 10
            ]
        );
    }
    
    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        if (!current_user_can('manage_options')) {
            return Zen_SEO_Helpers::get_global_settings();
        }
        
        $sanitized = [];
        
        foreach ($input as $key => $value) {
            if (empty($value)) {
                continue;
            }
            
            // Email fields
            if ($key === 'booking_email') {
                $sanitized[$key] = sanitize_email($value);
                continue;
            }
            
            // URL fields
            $url_fields = [
                'musicbrainz', 'wikidata', 'beatport', 'spotify', 'apple_music',
                'shazam', 'soundcloud', 'mixcloud', 'bandcamp', 'songkick',
                'bandsintown', 'instagram', 'youtube', 'facebook', 'ranker_list',
                'default_image', 'mensa_url'
            ];
            
            if (in_array($key, $url_fields)) {
                $sanitized[$key] = Zen_SEO_Helpers::sanitize_url($value);
                continue;
            }
            
            // Textarea fields
            if (in_array($key, ['awards_list', 'react_routes'])) {
                $sanitized[$key] = sanitize_textarea_field($value);
                continue;
            }
            
            // Text fields
            $sanitized[$key] = sanitize_text_field($value);
        }
        
        // Validate ISNI if provided
        if (!empty($sanitized['isni_code']) && !Zen_SEO_Helpers::validate_isni($sanitized['isni_code'])) {
            add_settings_error(
                'zen_seo_global',
                'invalid_isni',
                __('Invalid ISNI format. Expected: 0000 0001 2345 6789', 'zen-seo'),
                'warning'
            );
        }
        
        // Validate CNPJ if provided
        if (!empty($sanitized['cnpj']) && !Zen_SEO_Helpers::validate_cnpj($sanitized['cnpj'])) {
            add_settings_error(
                'zen_seo_global',
                'invalid_cnpj',
                __('Invalid CNPJ format. Expected: 00.000.000/0000-00', 'zen-seo'),
                'warning'
            );
        }
        
        // Clear caches after save
        Zen_SEO_Cache::clear_all();
        
        add_settings_error(
            'zen_seo_global',
            'settings_updated',
            __('Settings saved successfully! All caches cleared.', 'zen-seo'),
            'success'
        );
        
        return $sanitized;
    }
    
    /**
     * Render input field
     */
    public function render_input_field($args) {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $id = $args['id'];
        $type = $args['type'] ?? 'text';
        $value = esc_attr($settings[$id] ?? '');
        $desc = $args['desc'] ?? '';
        
        echo '<input type="' . esc_attr($type) . '" 
                     name="zen_seo_global[' . esc_attr($id) . ']" 
                     value="' . $value . '" 
                     class="regular-text" 
                     style="width: 100%; max-width: 600px;">';
        
        if ($desc) {
            echo '<p class="description">' . esc_html($desc) . '</p>';
        }
    }
    
    /**
     * Render textarea field
     */
    public function render_textarea_field($args) {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $id = $args['id'];
        $value = esc_textarea($settings[$id] ?? '');
        $desc = $args['desc'] ?? '';
        $rows = $args['rows'] ?? 4;
        
        echo '<textarea name="zen_seo_global[' . esc_attr($id) . ']" 
                        rows="' . esc_attr($rows) . '" 
                        class="large-text code" 
                        style="width: 100%; max-width: 600px;">' . $value . '</textarea>';
        
        if ($desc) {
            echo '<p class="description">' . esc_html($desc) . '</p>';
        }
    }
    
    /**
     * Render image field with media uploader
     */
    public function render_image_field($args) {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $id = $args['id'];
        $value = esc_url($settings[$id] ?? '');
        
        echo '<div class="zen-seo-image-field">';
        echo '<input type="url" 
                     name="zen_seo_global[' . esc_attr($id) . ']" 
                     value="' . $value . '" 
                     class="regular-text zen-seo-image-url" 
                     style="width: 100%; max-width: 600px;">';
        echo '<button type="button" class="button zen-seo-upload-image" style="margin-top: 5px;">' 
             . __('Upload Image', 'zen-seo') . '</button>';
        
        if ($value) {
            echo '<div class="zen-seo-image-preview" style="margin-top: 10px;">';
            echo '<img src="' . $value . '" style="max-width: 300px; height: auto; border: 1px solid #ddd;">';
            echo '</div>';
        }
        
        echo '</div>';
    }
    
    /**
     * Section descriptions
     */
    public function render_section_identity() {
        echo '<p>' . __('Basic information about the artist for Schema.org markup.', 'zen-seo') . '</p>';
    }
    
    public function render_section_authority() {
        echo '<p>' . __('Authority identifiers to establish credibility with search engines.', 'zen-seo') . '</p>';
    }
    
    public function render_section_social() {
        echo '<p>' . __('Social media and music platform profiles for sameAs schema.', 'zen-seo') . '</p>';
    }
    
    public function render_section_technical() {
        echo '<p>' . __('Technical settings and React SPA configuration.', 'zen-seo') . '</p>';
    }
    
    /**
     * Render settings page
     */
    public function render_settings_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <p><?php _e('Configure SEO settings for your headless WordPress + React SPA.', 'zen-seo'); ?></p>
            
            <form method="post" action="options.php">
                <?php
                settings_fields('zen_seo_options');
                do_settings_sections('zen-seo-settings');
                submit_button(__('Save Settings', 'zen-seo'));
                ?>
            </form>
        </div>
        <?php
    }
    
    /**
     * Render cache management page
     */
    public function render_cache_page() {
        if (!current_user_can('manage_options')) {
            return;
        }
        
        // Handle cache clear action
        if (isset($_POST['zen_seo_clear_cache']) && check_admin_referer('zen_seo_clear_cache')) {
            $cleared = Zen_SEO_Cache::clear_all();
            echo '<div class="notice notice-success"><p>' 
                 . sprintf(__('Cleared %d cache entries.', 'zen-seo'), $cleared) 
                 . '</p></div>';
        }
        
        $stats = Zen_SEO_Cache::get_stats();
        
        ?>
        <div class="wrap">
            <h1><?php _e('Cache Manager', 'zen-seo'); ?></h1>
            
            <div class="card">
                <h2><?php _e('Cache Statistics', 'zen-seo'); ?></h2>
                <table class="widefat">
                    <tr>
                        <th><?php _e('Total Cache Items', 'zen-seo'); ?></th>
                        <td><?php echo esc_html($stats['total_items']); ?></td>
                    </tr>
                    <tr>
                        <th><?php _e('Total Cache Size', 'zen-seo'); ?></th>
                        <td><?php echo esc_html($stats['size_formatted']); ?></td>
                    </tr>
                </table>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h2><?php _e('Clear Cache', 'zen-seo'); ?></h2>
                <p><?php _e('Clear all Zen SEO caches (sitemap, schema, meta tags).', 'zen-seo'); ?></p>
                
                <form method="post">
                    <?php wp_nonce_field('zen_seo_clear_cache'); ?>
                    <button type="submit" name="zen_seo_clear_cache" class="button button-primary">
                        <?php _e('Clear All Caches', 'zen-seo'); ?>
                    </button>
                </form>
            </div>
        </div>
        <?php
    }
    
    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        if (strpos($hook, 'zen-seo') === false) {
            return;
        }
        
        wp_enqueue_media();
        wp_enqueue_script(
            'zen-seo-admin',
            ZEN_SEO_PLUGIN_URL . 'admin/js/admin.js',
            ['jquery'],
            ZEN_SEO_VERSION,
            true
        );
    }
    
    /**
     * Show admin notices
     */
    public function show_admin_notices() {
        $settings = Zen_SEO_Helpers::get_global_settings();
        
        // Check if essential fields are missing
        if (empty($settings['real_name']) || empty($settings['default_image'])) {
            ?>
            <div class="notice notice-warning">
                <p>
                    <strong><?php _e('Zen SEO:', 'zen-seo'); ?></strong>
                    <?php _e('Please configure essential SEO settings for optimal results.', 'zen-seo'); ?>
                    <a href="<?php echo admin_url('admin.php?page=zen-seo-settings'); ?>">
                        <?php _e('Configure now', 'zen-seo'); ?>
                    </a>
                </p>
            </div>
            <?php
        }
    }
}
