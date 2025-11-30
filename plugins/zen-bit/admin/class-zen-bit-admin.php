<?php
if (!defined('ABSPATH')) exit;

class Zen_BIT_Admin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_post_zen_bit_clear_cache', array($this, 'clear_cache'));
    }
    
    public function add_admin_menu() {
        // Create parent menu if it doesn't exist
        global $admin_page_hooks;
        if (empty($admin_page_hooks['zen-plugins'])) {
            add_menu_page(
                __('Zen Plugins', 'zen-bit'),
                __('Zen Plugins', 'zen-bit'),
                'manage_options',
                'zen-plugins',
                null,
                'dashicons-admin-plugins',
                99
            );
        }
        
        add_submenu_page(
            'zen-plugins',
            __('Zen BIT Settings', 'zen-bit'),
            __('Zen BIT Events', 'zen-bit'),
            'manage_options',
            'zen-bit-settings',
            array($this, 'render_settings_page')
        );
    }
    
    public function register_settings() {
        register_setting('zen_bit_settings', 'zen_bit_artist_id');
        register_setting('zen_bit_settings', 'zen_bit_api_key');
        register_setting('zen_bit_settings', 'zen_bit_cache_time');
    }
    
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Zen BIT - Bandsintown Events', 'zen-bit'); ?></h1>
            
            <div class="notice notice-info">
                <p><strong><?php _e('Shortcode:', 'zen-bit'); ?></strong> <code>[zen_bit_events]</code></p>
                <p><strong><?php _e('REST API:', 'zen-bit'); ?></strong> <code>/wp-json/zen-bit/v1/events</code></p>
            </div>
            
            <form method="post" action="options.php">
                <?php settings_fields('zen_bit_settings'); ?>
                
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="zen_bit_artist_id"><?php _e('Bandsintown Artist ID', 'zen-bit'); ?></label>
                        </th>
                        <td>
                            <input type="text" 
                                   id="zen_bit_artist_id" 
                                   name="zen_bit_artist_id" 
                                   value="<?php echo esc_attr(get_option('zen_bit_artist_id', '15619775')); ?>" 
                                   class="regular-text">
                            <p class="description">
                                <?php _e('Your Bandsintown artist ID. Find it at:', 'zen-bit'); ?> 
                                <a href="https://www.bandsintown.com/a/15619775" target="_blank">bandsintown.com/a/15619775</a>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="zen_bit_api_key"><?php _e('Bandsintown API Key', 'zen-bit'); ?></label>
                        </th>
                        <td>
                            <input type="text" 
                                   id="zen_bit_api_key" 
                                   name="zen_bit_api_key" 
                                   value="<?php echo esc_attr(get_option('zen_bit_api_key', 'f8f1216ea03be95a3ea91c7ebe7117e7')); ?>" 
                                   class="regular-text">
                            <p class="description">
                                <?php _e('Your Bandsintown API key (app_id)', 'zen-bit'); ?>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="zen_bit_cache_time"><?php _e('Cache Duration (seconds)', 'zen-bit'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="zen_bit_cache_time" 
                                   name="zen_bit_cache_time" 
                                   value="<?php echo esc_attr(get_option('zen_bit_cache_time', '3600')); ?>" 
                                   class="small-text">
                            <p class="description">
                                <?php _e('How long to cache events (default: 3600 = 1 hour)', 'zen-bit'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <hr>
            
            <h2><?php _e('Cache Management', 'zen-bit'); ?></h2>
            <form method="post" action="<?php echo admin_url('admin-post.php'); ?>">
                <input type="hidden" name="action" value="zen_bit_clear_cache">
                <?php wp_nonce_field('zen_bit_clear_cache'); ?>
                <p>
                    <?php submit_button(__('Clear Events Cache', 'zen-bit'), 'secondary', 'submit', false); ?>
                    <span class="description" style="margin-left: 10px;">
                        <?php _e('Force refresh events from Bandsintown API', 'zen-bit'); ?>
                    </span>
                </p>
            </form>
            
            <hr>
            
            <h2><?php _e('Usage Examples', 'zen-bit'); ?></h2>
            <h3><?php _e('Shortcode Options:', 'zen-bit'); ?></h3>
            <ul>
                <li><code>[zen_bit_events]</code> - <?php _e('Display all events', 'zen-bit'); ?></li>
                <li><code>[zen_bit_events limit="10"]</code> - <?php _e('Display 10 events', 'zen-bit'); ?></li>
                <li><code>[zen_bit_events layout="grid"]</code> - <?php _e('Grid layout (default)', 'zen-bit'); ?></li>
            </ul>
            
            <h3><?php _e('REST API:', 'zen-bit'); ?></h3>
            <p><code>GET <?php echo rest_url('zen-bit/v1/events'); ?></code></p>
            <p><code>GET <?php echo rest_url('zen-bit/v1/events?limit=10'); ?></code></p>
        </div>
        <?php
    }
    
    public function clear_cache() {
        check_admin_referer('zen_bit_clear_cache');
        
        if (!current_user_can('manage_options')) {
            wp_die(__('Unauthorized', 'zen-bit'));
        }
        
        Zen_BIT_API::clear_cache();
        
        wp_redirect(add_query_arg(
            array('page' => 'zen-bit-settings', 'cache_cleared' => '1'),
            admin_url('options-general.php')
        ));
        exit;
    }
}

new Zen_BIT_Admin();
