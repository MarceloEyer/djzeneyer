<?php
if (!defined('ABSPATH')) exit;

class BIT_Zen_Admin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_post_bit_zen_clear_cache', array($this, 'clear_cache'));
    }
    
    public function add_admin_menu() {
        // Create parent menu if it doesn't exist
        global $admin_page_hooks;
        if (empty($admin_page_hooks['zen-plugins'])) {
            add_menu_page(
                __('Zen Plugins', 'bit-zen'),
                __('Zen Plugins', 'bit-zen'),
                'manage_options',
                'zen-plugins',
                null,
                'dashicons-admin-plugins',
                99
            );
        }
        
        add_submenu_page(
            'zen-plugins',
            __('BIT-Zen Settings', 'bit-zen'),
            __('BIT-Zen Events', 'bit-zen'),
            'manage_options',
            'bit-zen-settings',
            array($this, 'render_settings_page')
        );
    }
    
    public function register_settings() {
        register_setting('bit_zen_settings', 'bit_zen_artist_id');
        register_setting('bit_zen_settings', 'bit_zen_cache_time');
    }
    
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('BIT-Zen - Bandsintown Events', 'bit-zen'); ?></h1>
            
            <div class="notice notice-info">
                <p><strong><?php _e('Shortcode:', 'bit-zen'); ?></strong> <code>[bit_zen_events]</code></p>
                <p><strong><?php _e('REST API:', 'bit-zen'); ?></strong> <code>/wp-json/bit-zen/v1/events</code></p>
            </div>
            
            <form method="post" action="options.php">
                <?php settings_fields('bit_zen_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="bit_zen_artist_id"><?php _e('Bandsintown Artist ID', 'bit-zen'); ?></label>
                        </th>
                        <td>
                            <input type="text" 
                                   id="bit_zen_artist_id" 
                                   name="bit_zen_artist_id" 
                                   value="<?php echo esc_attr(get_option('bit_zen_artist_id', '15552355')); ?>" 
                                   class="regular-text">
                            <p class="description">
                                <?php _e('Your Bandsintown artist ID. Find it at:', 'bit-zen'); ?> 
                                <a href="https://www.bandsintown.com/a/15552355" target="_blank">bandsintown.com/a/15552355</a>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="bit_zen_cache_time"><?php _e('Cache Duration (seconds)', 'bit-zen'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="bit_zen_cache_time" 
                                   name="bit_zen_cache_time" 
                                   value="<?php echo esc_attr(get_option('bit_zen_cache_time', '3600')); ?>" 
                                   class="small-text">
                            <p class="description">
                                <?php _e('How long to cache events (default: 3600 = 1 hour)', 'bit-zen'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <hr>
            
            <h2><?php _e('Cache Management', 'bit-zen'); ?></h2>
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="bit_zen_clear_cache">
                <?php wp_nonce_field('bit_zen_clear_cache'); ?>
                <p>
                    <?php submit_button(__('Clear Events Cache', 'bit-zen'), 'secondary', 'submit', false); ?>
                    <span class="description" style="margin-left: 10px;">
                        <?php _e('Force refresh events from Bandsintown API', 'bit-zen'); ?>
                    </span>
                </p>
            </form>
            
            <hr>
            
            <h2><?php _e('Usage Examples', 'bit-zen'); ?></h2>
            <h3><?php _e('Shortcode Options:', 'bit-zen'); ?></h3>
            <ul>
                <li><code>[bit_zen_events]</code> - <?php _e('Display all events', 'bit-zen'); ?></li>
                <li><code>[bit_zen_events limit="10"]</code> - <?php _e('Display 10 events', 'bit-zen'); ?></li>
                <li><code>[bit_zen_events layout="grid"]</code> - <?php _e('Grid layout (default)', 'bit-zen'); ?></li>
            </ul>
            
            <h3><?php _e('REST API:', 'bit-zen'); ?></h3>
            <p><code>GET <?php echo rest_url('bit-zen/v1/events'); ?></code></p>
            <p><code>GET <?php echo rest_url('bit-zen/v1/events?limit=10'); ?></code></p>
        </div>
        <?php
    }
    
    public function clear_cache() {
        check_admin_referer('bit_zen_clear_cache');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'bit-zen'));
        }
        
        BIT_Zen_API::clear_cache();
        
        wp_redirect(add_query_arg(
            array('page' => 'bit-zen-settings', 'cache_cleared' => '1'),
            admin_url('options-general.php')
        ));
        exit;
    }
}

new BIT_Zen_Admin();
