<?php
/**
 * Plugin Name: Zen Plugins Overview
 * Description: Overview page for all Zen plugins family
 * Version: 1.0.0
 * Author: DJ Zen Eyer
 */

if (!defined('ABSPATH')) exit;

class Zen_Plugins_Overview {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('admin_menu', array($this, 'add_overview_page'), 5); // Priority 5 to run before other plugins
    }
    
    public function add_overview_page() {
        add_menu_page(
            __('Zen Plugins', 'zen-plugins'),
            __('Zen Plugins', 'zen-plugins'),
            'manage_options',
            'zen-plugins',
            array($this, 'render_overview_page'),
            'dashicons-admin-plugins',
            99
        );
    }
    
    public function render_overview_page() {
        ?>
        <div class="wrap">
            <h1><?php _e('Zen Plugins Family', 'zen-plugins'); ?></h1>
            <p class="description"><?php _e('Suite of plugins for DJ Zen Eyer website - djzeneyer.com', 'zen-plugins'); ?></p>
            
            <div class="card-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
                
                <?php
                $plugins = array(
                    array(
                        'name' => 'Zen SEO Lite Pro',
                        'slug' => 'zen-seo-lite',
                        'version' => '8.0.0',
                        'description' => 'SEO optimization with schema.org, sitemap, and meta tags for headless WordPress.',
                        'icon' => 'dashicons-chart-line',
                        'menu' => 'zen-seo-settings',
                        'active' => class_exists('Zen_SEO_Lite')
                    ),
                    array(
                        'name' => 'ZenEyer Auth Pro',
                        'slug' => 'zeneyer-auth',
                        'version' => '2.0.0',
                        'description' => 'JWT authentication with Google OAuth and password auth for headless architecture.',
                        'icon' => 'dashicons-lock',
                        'menu' => 'zeneyer-auth',
                        'active' => class_exists('ZenEyer\\Auth\\Plugin')
                    ),
                    array(
                        'name' => 'Zen BIT',
                        'slug' => 'zen-bit',
                        'version' => '1.0.0',
                        'description' => 'Bandsintown events integration with beautiful design and SEO optimization.',
                        'icon' => 'dashicons-calendar-alt',
                        'menu' => 'zen-bit-settings',
                        'active' => class_exists('Zen_BIT')
                    ),
                    array(
                        'name' => 'Zen-RA',
                        'slug' => 'zen-ra',
                        'version' => '1.0.0',
                        'description' => 'Recent Activity API - Gamified user history from WooCommerce and GamiPress.',
                        'icon' => 'dashicons-awards',
                        'menu' => 'zen-ra-settings',
                        'active' => class_exists('Zen_RA')
                    )
                );
                
                foreach ($plugins as $plugin) {
                    $status_class = $plugin['active'] ? 'active' : 'inactive';
                    $status_text = $plugin['active'] ? __('Active', 'zen-plugins') : __('Inactive', 'zen-plugins');
                    $status_color = $plugin['active'] ? '#46b450' : '#dc3232';
                    ?>
                    <div class="card" style="padding: 20px; background: white; border: 1px solid #ccd0d4; border-radius: 4px; box-shadow: 0 1px 1px rgba(0,0,0,.04);">
                        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                            <span class="<?php echo esc_attr($plugin['icon']); ?>" style="font-size: 32px; color: #9D4EDD;"></span>
                            <div>
                                <h2 style="margin: 0; font-size: 18px;"><?php echo esc_html($plugin['name']); ?></h2>
                                <span style="display: inline-block; padding: 2px 8px; background: <?php echo $status_color; ?>; color: white; border-radius: 3px; font-size: 11px; margin-top: 5px;">
                                    <?php echo $status_text; ?>
                                </span>
                            </div>
                        </div>
                        
                        <p style="color: #666; margin: 0 0 15px 0; line-height: 1.5;">
                            <?php echo esc_html($plugin['description']); ?>
                        </p>
                        
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <?php if ($plugin['active']): ?>
                                <a href="<?php echo admin_url('admin.php?page=' . $plugin['menu']); ?>" class="button button-primary">
                                    <?php _e('Settings', 'zen-plugins'); ?>
                                </a>
                                <span style="color: #666; font-size: 12px;">v<?php echo esc_html($plugin['version']); ?></span>
                            <?php else: ?>
                                <a href="<?php echo admin_url('plugins.php'); ?>" class="button">
                                    <?php _e('Activate', 'zen-plugins'); ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php
                }
                ?>
                
            </div>
            
            <hr style="margin: 40px 0;">
            
            <div style="background: #f0f0f1; padding: 20px; border-radius: 4px;">
                <h2><?php _e('About Zen Plugins', 'zen-plugins'); ?></h2>
                <p><?php _e('The Zen Plugins family is a suite of custom WordPress plugins developed specifically for DJ Zen Eyer\'s website (djzeneyer.com). These plugins work together to provide a complete headless WordPress solution with React frontend.', 'zen-plugins'); ?></p>
                
                <h3><?php _e('Architecture', 'zen-plugins'); ?></h3>
                <ul>
                    <li><strong>Frontend:</strong> React 18 + TypeScript + Vite + Tailwind CSS</li>
                    <li><strong>Backend:</strong> WordPress REST API (Headless)</li>
                    <li><strong>Authentication:</strong> JWT + Google OAuth</li>
                    <li><strong>Hosting:</strong> Hostinger + Cloudflare CDN</li>
                    <li><strong>Deployment:</strong> GitHub Actions CI/CD</li>
                </ul>
                
                <h3><?php _e('Key Features', 'zen-plugins'); ?></h3>
                <ul>
                    <li>✅ SEO optimized with Schema.org markup</li>
                    <li>✅ JWT authentication with Google OAuth</li>
                    <li>✅ Bandsintown events integration</li>
                    <li>✅ Gamified user activity tracking</li>
                    <li>✅ Multilingual support (Polylang)</li>
                    <li>✅ WooCommerce integration</li>
                    <li>✅ GamiPress gamification</li>
                </ul>
                
                <p>
                    <strong><?php _e('Developer:', 'zen-plugins'); ?></strong> DJ Zen Eyer<br>
                    <strong><?php _e('Website:', 'zen-plugins'); ?></strong> <a href="https://djzeneyer.com" target="_blank">djzeneyer.com</a><br>
                    <strong><?php _e('Repository:', 'zen-plugins'); ?></strong> <a href="https://github.com/MarceloEyer/djzeneyer" target="_blank">GitHub</a>
                </p>
            </div>
        </div>
        
        <style>
            .card:hover {
                box-shadow: 0 4px 8px rgba(0,0,0,.1);
                transition: box-shadow 0.3s ease;
            }
        </style>
        <?php
    }
}

function zen_plugins_overview_init() {
    return Zen_Plugins_Overview::get_instance();
}

zen_plugins_overview_init();
