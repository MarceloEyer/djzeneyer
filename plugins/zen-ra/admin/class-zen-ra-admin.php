<?php
/**
 * Zen-RA Admin Settings
 */

if (!defined('ABSPATH')) exit;

class Zen_RA_Admin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    public function add_admin_menu() {
        add_submenu_page(
            'zen-plugins',
            __('Zen-RA Settings', 'zen-ra'),
            __('Zen-RA Activity', 'zen-ra'),
            'manage_options',
            'zen-ra-settings',
            array($this, 'render_settings_page')
        );
    }
    
    public function register_settings() {
        register_setting('zen_ra_settings', 'zen_ra_cache_time');
        register_setting('zen_ra_settings', 'zen_ra_orders_limit');
        register_setting('zen_ra_settings', 'zen_ra_achievements_limit');
        register_setting('zen_ra_settings', 'zen_ra_total_limit');
        register_setting('zen_ra_settings', 'zen_ra_order_xp');
        register_setting('zen_ra_settings', 'zen_ra_achievement_xp');
    }
    
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Zen-RA - Recent Activity Settings', 'zen-ra'); ?></h1>
            
            <div class="notice notice-info">
                <p><strong><?php _e('REST API Endpoint:', 'zen-ra'); ?></strong></p>
                <p><code>GET /wp-json/zen-ra/v1/activity/{user_id}</code></p>
                <p><strong><?php _e('Example:', 'zen-ra'); ?></strong></p>
                <p><code><?php echo rest_url('zen-ra/v1/activity/1'); ?></code></p>
                <p><strong><?php _e('Clear Cache:', 'zen-ra'); ?></strong></p>
                <p><code>POST /wp-json/zen-ra/v1/clear-cache/{user_id}</code> (Admin only)</p>
            </div>
            
            <form method="post" action="options.php">
                <?php settings_fields('zen_ra_settings'); ?>
                
                <h2><?php _e('Cache Settings', 'zen-ra'); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="zen_ra_cache_time"><?php _e('Cache Duration (seconds)', 'zen-ra'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="zen_ra_cache_time" 
                                   name="zen_ra_cache_time" 
                                   value="<?php echo esc_attr(get_option('zen_ra_cache_time', '600')); ?>" 
                                   class="small-text">
                            <p class="description">
                                <?php _e('Default: 600 (10 minutes). Cache is automatically cleared on new orders/achievements.', 'zen-ra'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <h2><?php _e('Activity Limits', 'zen-ra'); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="zen_ra_orders_limit"><?php _e('WooCommerce Orders Limit', 'zen-ra'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="zen_ra_orders_limit" 
                                   name="zen_ra_orders_limit" 
                                   value="<?php echo esc_attr(get_option('zen_ra_orders_limit', '5')); ?>" 
                                   class="small-text" 
                                   min="1" 
                                   max="20">
                            <p class="description">
                                <?php _e('Number of recent orders to fetch (default: 5)', 'zen-ra'); ?>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="zen_ra_achievements_limit"><?php _e('GamiPress Achievements Limit', 'zen-ra'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="zen_ra_achievements_limit" 
                                   name="zen_ra_achievements_limit" 
                                   value="<?php echo esc_attr(get_option('zen_ra_achievements_limit', '5')); ?>" 
                                   class="small-text" 
                                   min="1" 
                                   max="20">
                            <p class="description">
                                <?php _e('Number of recent achievements to fetch (default: 5)', 'zen-ra'); ?>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="zen_ra_total_limit"><?php _e('Total Activities Limit', 'zen-ra'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="zen_ra_total_limit" 
                                   name="zen_ra_total_limit" 
                                   value="<?php echo esc_attr(get_option('zen_ra_total_limit', '10')); ?>" 
                                   class="small-text" 
                                   min="1" 
                                   max="50">
                            <p class="description">
                                <?php _e('Maximum total activities to return (default: 10)', 'zen-ra'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <h2><?php _e('XP/Points Settings', 'zen-ra'); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="zen_ra_order_xp"><?php _e('XP per Order', 'zen-ra'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="zen_ra_order_xp" 
                                   name="zen_ra_order_xp" 
                                   value="<?php echo esc_attr(get_option('zen_ra_order_xp', '50')); ?>" 
                                   class="small-text" 
                                   min="0">
                            <p class="description">
                                <?php _e('XP awarded for each completed order (default: 50)', 'zen-ra'); ?>
                            </p>
                        </td>
                    </tr>
                    
                    <tr>
                        <th scope="row">
                            <label for="zen_ra_achievement_xp"><?php _e('Default XP per Achievement', 'zen-ra'); ?></label>
                        </th>
                        <td>
                            <input type="number" 
                                   id="zen_ra_achievement_xp" 
                                   name="zen_ra_achievement_xp" 
                                   value="<?php echo esc_attr(get_option('zen_ra_achievement_xp', '10')); ?>" 
                                   class="small-text" 
                                   min="0">
                            <p class="description">
                                <?php _e('Default XP if achievement has no points defined (default: 10)', 'zen-ra'); ?>
                            </p>
                        </td>
                    </tr>
                </table>
                
                <?php submit_button(); ?>
            </form>
            
            <hr>
            
            <h2><?php _e('API Response Example', 'zen-ra'); ?></h2>
            <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto;">
{
  "success": true,
  "cached": false,
  "user_id": 1,
  "count": 3,
  "activities": [
    {
      "id": "order_123",
      "type": "loot",
      "title": "Adquiriu Artefato Musical",
      "description": "Ingresso VIP Festival",
      "xp": 50,
      "date": "2025-12-01 10:30:00",
      "timestamp": 1733053800,
      "meta": {
        "order_id": 123,
        "total": "150.00",
        "currency": "BRL",
        "status": "completed"
      }
    },
    {
      "id": "ach_456",
      "type": "achievement",
      "title": "Desbloqueou Conquista Épica",
      "description": "Membro da Tribo Zen",
      "xp": 100,
      "date": "2025-11-30 15:20:00",
      "timestamp": 1732984800,
      "meta": {
        "achievement_id": 789,
        "earning_id": 456,
        "post_type": "achievement"
      }
    }
  ]
}
            </pre>
            
            <h2><?php _e('Activity Types', 'zen-ra'); ?></h2>
            <table class="widefat">
                <thead>
                    <tr>
                        <th><?php _e('Type', 'zen-ra'); ?></th>
                        <th><?php _e('Title', 'zen-ra'); ?></th>
                        <th><?php _e('Source', 'zen-ra'); ?></th>
                        <th><?php _e('Icon Suggestion', 'zen-ra'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><code>loot</code></td>
                        <td>Adquiriu Artefato Musical</td>
                        <td>WooCommerce Orders</td>
                        <td>🎁 Chest/Gift Box</td>
                    </tr>
                    <tr>
                        <td><code>achievement</code></td>
                        <td>Desbloqueou Conquista Épica</td>
                        <td>GamiPress Achievements</td>
                        <td>🏆 Trophy/Medal</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <?php
    }
}

new Zen_RA_Admin();
