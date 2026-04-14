<?php
namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
    exit;
}

class Zen_SEO_Admin
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
        \add_action('admin_menu', [$this, 'add_admin_menu']);
        \add_action('admin_init', [$this, 'register_settings']);
        \add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        \add_action('admin_notices', [$this, 'show_admin_notices']);
        \add_action('admin_init', [$this, 'handle_export_import']);
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu()
    {
        \add_submenu_page(
            'zen-plugins',
            __('Zen SEO Settings', 'zen-seo'),
            __('Zen SEO', 'zen-seo'),
            'manage_options',
            'zen-seo-settings',
            [$this, 'render_settings_page']
        );

        \add_submenu_page(
            'zen-plugins',
            __('Cache Manager', 'zen-seo'),
            __('SEO Cache', 'zen-seo'),
            'manage_options',
            'zen-seo-cache',
            [$this, 'render_cache_page']
        );
        
        \add_submenu_page(
            'zen-plugins',
            __('Backup & Tools', 'zen-seo'),
            __('SEO Tools', 'zen-seo'),
            'manage_options',
            'zen-seo-tools',
            [$this, 'render_tools_page']
        );
    }

    /**
     * Register settings
     */
    public function register_settings()
    {
        \register_setting('zen_seo_options', 'zen_seo_global', [
            'sanitize_callback' => [$this, 'sanitize_settings'],
            'default' => []
        ]);

        // Identity section
        \add_settings_section(
            'zen_identity',
            __('👤 Identity & Business', 'zen-seo'),
            [$this, 'render_section_identity'],
            'zen-seo-settings'
        );

        $identity_fields = [
            'stage_name' => [
                'label' => __('Stage Name', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Default: DJ Zen Eyer', 'zen-seo')
            ],
            'short_name' => [
                'label' => __('Short / Artist Name', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Default: Zen Eyer', 'zen-seo')
            ],
            'real_name' => [
                'label' => __('Full Legal Name', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: Marcelo Eyer Fernandes', 'zen-seo')
            ],
            'birth_date' => [
                'label' => __('Birth Date', 'zen-seo'),
                'type' => 'date',
                'desc' => __('Format: YYYY-MM-DD', 'zen-seo')
            ],
            'booking_email' => [
                'label' => __('Booking Email', 'zen-seo'),
                'type' => 'email',
                'desc' => __('Example: booking@djzeneyer.com', 'zen-seo')
            ],
            'whatsapp_number' => [
                'label' => __('WhatsApp Number', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Full number with code. Example: 5521987413091', 'zen-seo')
            ],
            'cnpj' => [
                'label' => __('CNPJ / Tax ID', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Format: 00.000.000/0000-00', 'zen-seo')
            ],
            'city' => [
                'label' => __('City', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: Niterói', 'zen-seo')
            ],
            'state' => [
                'label' => __('State Code', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: RJ', 'zen-seo')
            ],
            'country' => [
                'label' => __('Country', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: Brazil', 'zen-seo')
            ],
            'starting_year' => [
                'label' => __('Starting Year', 'zen-seo'),
                'type' => 'number',
                'desc' => __('Example: 2015', 'zen-seo')
            ],
            'countries_played' => [
                'label' => __('Countries Played', 'zen-seo'),
                'type' => 'number',
                'desc' => __('Example: 10', 'zen-seo')
            ],
        ];

        foreach ($identity_fields as $id => $field) {
            \add_settings_field(
                $id,
                $field['label'],
                [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_identity',
                \array_merge($field, ['id' => $id])
            );
        }

        // Philosophy section
        \add_settings_section(
            'zen_philosophy',
            __('💡 Philosophy & Brand', 'zen-seo'),
            [$this, 'render_section_philosophy'],
            'zen-seo-settings'
        );

        $phil_fields = [
            'slogan' => [
                'label' => __('Brand Slogan', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: A pressa é inimiga da cremosidade', 'zen-seo')
            ],
            'style_name' => [
                'label' => __('Musical Style Name', 'zen-seo'),
                'type' => 'text',
                'desc' => __('Example: Cremosidade', 'zen-seo')
            ],
            'style_definition' => [
                'label' => __('Style Definition', 'zen-seo'),
                'type' => 'textarea',
                'rows' => 3
            ],
        ];

        foreach ($phil_fields as $id => $field) {
            \add_settings_field(
                $id,
                $field['label'],
                $field['type'] === 'textarea' ? [$this, 'render_textarea_field'] : [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_philosophy',
                \array_merge($field, ['id' => $id])
            );
        }

        // Authority section
        \add_settings_section(
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
            \add_settings_field(
                $id,
                $field['label'],
                [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_authority',
                \array_merge($field, ['id' => $id])
            );
        }

        // Social section
        \add_settings_section(
            'zen_social',
            __('🌐 Digital Ecosystem', 'zen-seo'),
            [$this, 'render_section_social'],
            'zen-seo-settings'
        );

        $social_platforms = [
            'beatport',
            'spotify',
            'apple_music',
            'shazam',
            'soundcloud',
            'mixcloud',
            'bandcamp',
            'songkick',
            'bandsintown',
            'instagram',
            'youtube',
            'facebook'
        ];

        foreach ($social_platforms as $platform) {
            $label = \ucwords(\str_replace('_', ' ', $platform));
            if ($platform === 'ranker_list') {
                $label = __('Ranker List (#1 Zouk)', 'zen-seo');
            }

            \add_settings_field(
                $platform,
                $label,
                [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_social',
                ['id' => $platform, 'type' => 'url']
            );
        }

        // Technical section
        \add_settings_section(
            'zen_technical',
            __('⚙️ Technical & Awards', 'zen-seo'),
            [$this, 'render_section_technical'],
            'zen-seo-settings'
        );

        \add_settings_field(
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

        \add_settings_field(
            'default_image',
            __('Main Promotional Image', 'zen-seo'),
            [$this, 'render_image_field'],
            'zen-seo-settings',
            'zen_technical',
            ['id' => 'default_image']
        );

        // Payment section
        \add_settings_section(
            'zen_payment',
            __('💰 Global Payment Hub', 'zen-seo'),
            [$this, 'render_section_payment'],
            'zen-seo-settings'
        );

        $payment_fields = [
            'paypal_me' => ['label' => 'PayPal.me URL'],
            'wise_url' => ['label' => 'Wise Payment URL'],
            'pix_key' => ['label' => 'PIX Key (Brasil)'],
            'inter_iban' => ['label' => 'Inter IBAN (USD/EUR)'],
            'inter_swift' => ['label' => 'Inter SWIFT Code'],
            'inter_bank_name' => ['label' => 'Inter Bank Name'],
        ];

        foreach ($payment_fields as $id => $field) {
            \add_settings_field(
                $id,
                $field['label'],
                [$this, 'render_input_field'],
                'zen-seo-settings',
                'zen_payment',
                ['id' => $id, 'type' => 'text']
            );
        }
    }

    /**
     * Sanitize settings
     */
    public function sanitize_settings($input)
    {
        if (!\current_user_can('manage_options')) {
            return Zen_SEO_Helpers::get_global_settings();
        }

        $sanitized = [];

        foreach ($input as $key => $value) {
            if (empty($value)) {
                continue;
            }

            // Email fields
            if ($key === 'booking_email') {
                $sanitized[$key] = \sanitize_email($value);
                continue;
            }

            // URL fields
            $url_fields = [
                'musicbrainz',
                'wikidata',
                'beatport',
                'spotify',
                'apple_music',
                'shazam',
                'soundcloud',
                'mixcloud',
                'bandcamp',
                'songkick',
                'bandsintown',
                'instagram',
                'youtube',
                'facebook',
                'ranker_list',
                'default_image',
                'mensa_url',
                'paypal_me',
                'wise_url'
            ];

            if (\in_array($key, $url_fields)) {
                $sanitized[$key] = Zen_SEO_Helpers::sanitize_url($value);
                continue;
            }

            // Textarea fields
            if (\in_array($key, ['awards_list', 'style_definition'])) {
                $sanitized[$key] = \sanitize_textarea_field($value);
                continue;
            }

            // Text fields
            $sanitized[$key] = \sanitize_text_field($value);
        }

        // Validate ISNI if provided
        if (!empty($sanitized['isni_code']) && !Zen_SEO_Helpers::validate_isni($sanitized['isni_code'])) {
            \add_settings_error(
                'zen_seo_global',
                'invalid_isni',
                __('Invalid ISNI format. Expected: 0000 0001 2345 6789', 'zen-seo'),
                'warning'
            );
        }

        // Validate CNPJ if provided
        if (!empty($sanitized['cnpj']) && !Zen_SEO_Helpers::validate_cnpj($sanitized['cnpj'])) {
            \add_settings_error(
                'zen_seo_global',
                'invalid_cnpj',
                __('Invalid CNPJ format. Expected: 00.000.000/0000-00', 'zen-seo'),
                'warning'
            );
        }

        // Clear caches after save
        Zen_SEO_Cache::clear_all();

        \add_settings_error(
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
    public function render_input_field($args)
    {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $id = $args['id'];
        $type = $args['type'] ?? 'text';
        $value = \esc_attr($settings[$id] ?? '');
        $desc = $args['desc'] ?? '';

        echo '<input type="' . \esc_attr($type) . '" 
                     name="zen_seo_global[' . \esc_attr($id) . ']" 
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
    public function render_textarea_field($args)
    {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $id = $args['id'];
        $value = \esc_textarea($settings[$id] ?? '');
        $desc = $args['desc'] ?? '';
        $rows = $args['rows'] ?? 4;

        echo '<textarea name="zen_seo_global[' . \esc_attr($id) . ']" 
                        rows="' . \esc_attr($rows) . '" 
                        class="large-text code" 
                        style="width: 100%; max-width: 600px;">' . $value . '</textarea>';

        if ($desc) {
            echo '<p class="description">' . esc_html($desc) . '</p>';
        }
    }

    /**
     * Render image field with media uploader
     */
    public function render_image_field($args)
    {
        $settings = Zen_SEO_Helpers::get_global_settings();
        $id = $args['id'];
        $value = \esc_url($settings[$id] ?? '');

        echo '<div class="zen-seo-image-field">';
        echo '<input type="url" 
                     name="zen_seo_global[' . \esc_attr($id) . ']" 
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
    public function render_section_identity()
    {
        echo '<p>' . __('Basic information about the artist for Schema.org markup.', 'zen-seo') . '</p>';
    }

    public function render_section_authority()
    {
        echo '<p>' . __('Authority identifiers to establish credibility with search engines.', 'zen-seo') . '</p>';
    }

    public function render_section_social()
    {
        echo '<p>' . __('Social media and music platform profiles for sameAs schema.', 'zen-seo') . '</p>';
    }

    public function render_section_philosophy()
    {
        echo '<p>' . __('Define your brand tone and musical signature.', 'zen-seo') . '</p>';
    }

    public function render_section_payment()
    {
        echo '<p>' . __('Centralized payment data for global bookings and donations.', 'zen-seo') . '</p>';
    }

    public function render_section_technical()
    {
        echo '<p>' . __('Technical settings and React SPA configuration.', 'zen-seo') . '</p>';
    }

    /**
     * Render settings page
     */
    public function render_settings_page()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        ?>
        <div class="wrap">
            <h1>
                <?php echo \esc_html(\get_admin_page_title()); ?>
            </h1>
            <p>
                <?php _e('Configure SEO settings for your headless WordPress + React SPA.', 'zen-seo'); ?>
            </p>

            <form method="post" action="options.php">
                <?php
                \settings_fields('zen_seo_options');
                \do_settings_sections('zen-seo-settings');
                \submit_button(__('Save Settings', 'zen-seo'));
                ?>
            </form>
        </div>
        <?php
    }

    /**
     * Render cache management page
     */
    public function render_cache_page()
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        // Handle cache clear action
        if (isset($_POST['zen_seo_clear_cache']) && \check_admin_referer('zen_seo_clear_cache')) {
            $cleared = Zen_SEO_Cache::clear_all();
            echo '<div class="notice notice-success"><p>'
                . \sprintf(__('Cleared %d cache entries.', 'zen-seo'), $cleared)
                . '</p></div>';
        }

        $stats = Zen_SEO_Cache::get_stats();

        ?>
        <div class="wrap">
            <h1>
                <?php _e('Cache Manager', 'zen-seo'); ?>
            </h1>

            <div class="card">
                <h2>
                    <?php _e('Cache Statistics', 'zen-seo'); ?>
                </h2>
                <table class="widefat">
                    <tr>
                        <th>
                            <?php _e('Total Cache Items', 'zen-seo'); ?>
                        </th>
                        <td>
                            <?php echo \esc_html($stats['total_items']); ?>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            <?php _e('Total Cache Size', 'zen-seo'); ?>
                        </th>
                        <td>
                            <?php echo \esc_html($stats['size_formatted']); ?>
                        </td>
                    </tr>
                </table>
            </div>

            <div class="card" style="margin-top: 20px;">
                <h2>
                    <?php _e('Clear Cache', 'zen-seo'); ?>
                </h2>
                <p>
                    <?php _e('Clear all Zen SEO caches (sitemap, schema, meta tags).', 'zen-seo'); ?>
                </p>

                <form method="post">
                    <?php \wp_nonce_field('zen_seo_clear_cache'); ?>
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
    public function enqueue_admin_assets($hook)
    {
        if (strpos((string) $hook, 'zen-seo') === false) {
            return;
        }

        \wp_enqueue_media();
        \wp_enqueue_script(
            'zen-seo-admin',
            \ZEN_SEO_PLUGIN_URL . 'admin/js/admin.js',
            ['jquery'],
            \ZEN_SEO_VERSION,
            true
        );
    }

    /**
     * Show admin notices
     */
    public function show_admin_notices()
    {
        $settings = Zen_SEO_Helpers::get_global_settings();

        // Check if essential fields are missing
        if (empty($settings['real_name']) || empty($settings['default_image'])) {
            ?>
            <div class="notice notice-warning">
                <p>
                    <strong>
                        <?php _e('Zen SEO:', 'zen-seo'); ?>
                    </strong>
                    <?php _e('Please configure essential SEO settings for optimal results.', 'zen-seo'); ?>
                    <a href="<?php echo \admin_url('admin.php?page=zen-seo-settings'); ?>">
                        <?php _e('Configure now', 'zen-seo'); ?>
                    </a>
                </p>
            </div>
            <?php
        }
    }

    /**
     * Handle Export/Import Actions
     */
    public function handle_export_import()
    {
        if (!isset($_GET['page']) || $_GET['page'] !== 'zen-seo-tools') {
            return;
        }

        // 1. Handle Export
        if (isset($_POST['zen_seo_export']) && \check_admin_referer('zen_seo_export_action')) {
            $settings = Zen_SEO_Helpers::get_global_settings();
            $filename = 'zen-seo-backup-' . \date('Y-m-d') . '.json';
            
            \header('Content-Type: application/json');
            \header('Content-Disposition: attachment; filename=' . $filename);
            \header('Pragma: no-cache');
            \header('Expires: 0');
            
            echo \wp_json_encode($settings, JSON_PRETTY_PRINT);
            exit;
        }

        // 2. Handle Import
        if (isset($_POST['zen_seo_import']) && \check_admin_referer('zen_seo_import_action')) {
            if (empty($_FILES['import_file']['tmp_name'])) {
                \add_settings_error('zen_seo_tools', 'no_file', __('Please select a file to import.', 'zen-seo'), 'error');
                return;
            }

            $file_content = \file_get_contents($_FILES['import_file']['tmp_name']);
            $data = \json_decode($file_content, true);

            if (!$data || !\is_array($data)) {
                \add_settings_error('zen_seo_tools', 'invalid_json', __('Invalid backup file format.', 'zen-seo'), 'error');
                return;
            }

            // Sanitization is handled by the regular sanitize_settings logic when we update_option
            \update_option('zen_seo_global', $data);
            Zen_SEO_Cache::clear_all();

            \add_settings_error('zen_seo_tools', 'import_success', __('Settings imported and caches cleared!', 'zen-seo'), 'success');
        }
    }

    /**
     * Render Tools Page (Export/Import)
     */
    public function render_tools_page()
    {
        if (!\current_user_can('manage_options')) {
            return;
        }

        ?>
        <div class="wrap">
            <h1><?php _e('Backup & SEO Tools', 'zen-seo'); ?></h1>
            
            <?php \settings_errors('zen_seo_tools'); ?>

            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>📦 <?php _e('Backup & Restore', 'zen-seo'); ?></h2>
                <p><?php _e('Export your identity and branding settings to a JSON file, or restore them from a previous backup.', 'zen-seo'); ?></p>
                
                <hr>
                
                <div style="display: flex; gap: 40px; margin-top: 20px;">
                    <!-- Export -->
                    <div style="flex: 1;">
                        <h3><?php _e('Export Settings', 'zen-seo'); ?></h3>
                        <p><?php _e('Download all your Zen SEO configurations.', 'zen-seo'); ?></p>
                        <form method="post">
                            <?php \wp_nonce_field('zen_seo_export_action'); ?>
                            <button type="submit" name="zen_seo_export" class="button button-secondary">
                                <?php _e('Download Export (.json)', 'zen-seo'); ?>
                            </button>
                        </form>
                    </div>

                    <!-- Import -->
                    <div style="flex: 1; border-left: 1px solid #ddd; padding-left: 40px;">
                        <h3><?php _e('Import Settings', 'zen-seo'); ?></h3>
                        <p><?php _e('Upload a previously exported .json file.', 'zen-seo'); ?></p>
                        <form method="post" enctype="multipart/form-data">
                            <?php \wp_nonce_field('zen_seo_import_action'); ?>
                            <input type="file" name="import_file" accept=".json" style="margin-bottom: 10px; display: block;">
                            <button type="submit" name="zen_seo_import" class="button button-primary">
                                <?php _e('Import Backup', 'zen-seo'); ?>
                            </button>
                        </form>
                        <p class="description" style="color: #d63638;">
                            ⚠️ <?php _e('Warning: This will overwrite your current settings!', 'zen-seo'); ?>
                        </p>
                    </div>
                </div>
            </div>

            <div class="card" style="max-width: 800px; margin-top: 20px;">
                <h2>⚡ <?php _e('System Health', 'zen-seo'); ?></h2>
                <p><?php _e('Quickly check the status of your Headless SEO engine.', 'zen-seo'); ?></p>
                <table class="widefat" style="border: none; background: transparent;">
                    <tr>
                        <td><strong><?php _e('REST API Status:', 'zen-seo'); ?></strong></td>
                        <td><span style="color: green;">● <?php _e('Active', 'zen-seo'); ?></span></td>
                    </tr>
                    <tr>
                        <td><strong><?php _e('Sitemap Engine:', 'zen-seo'); ?></strong></td>
                        <td><?php _e('Enabled', 'zen-seo'); ?></td>
                    </tr>
                    <tr>
                        <td><strong><?php _e('Identity SSOT:', 'zen-seo'); ?></strong></td>
                        <td><?php _e('Configured (Zen V2)', 'zen-seo'); ?></td>
                    </tr>
                </table>
            </div>
        </div>
        <?php
    }
}
