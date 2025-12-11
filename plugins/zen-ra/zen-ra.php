<?php
/**
 * Plugin Name: Zen-RA (Zen Recent Activity)
 * Plugin URI: https://djzeneyer.com
 * Description: API de histórico gamificado para a Tribo Zen. Integra WooCommerce e GamiPress com narrativa épica.
 * Version: 1.0.0
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 * License: GPL v2 or later
 * Text Domain: zen-ra
 * Requires at least: 5.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) exit;

define('ZEN_RA_VERSION', '1.0.0');
define('ZEN_RA_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZEN_RA_PLUGIN_URL', plugin_dir_url(__FILE__));

class Zen_RA {
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    private function load_dependencies() {
        require_once ZEN_RA_PLUGIN_DIR . 'includes/class-zen-ra-api.php';
        require_once ZEN_RA_PLUGIN_DIR . 'admin/class-zen-ra-admin.php';
    }
    
    private function init_hooks() {
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Clear cache on new activity
        add_action('woocommerce_new_order', array('Zen_RA_API', 'clear_cache_on_order'), 10, 1);
        add_action('woocommerce_order_status_changed', array('Zen_RA_API', 'clear_cache_on_order_status'), 10, 1);
        add_action('gamipress_award_achievement', array('Zen_RA_API', 'clear_cache_on_achievement'), 10, 2);
        add_action('gamipress_update_user_points', array('Zen_RA_API', 'clear_cache_on_points'), 10, 1);

        register_activation_hook(__FILE__, array($this, 'activate'));
    }

    /**
     * Load plugin text domain for translations
     */
    public function load_textdomain() {
        load_plugin_textdomain('zen-ra', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    public function register_rest_routes() {
        register_rest_route('zen-ra/v1', '/activity/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array('Zen_RA_API', 'get_activity'),
            'permission_callback' => array('Zen_RA_API', 'permissions_check'),
            'args' => array(
                'id' => array(
                    'required' => true,
                    'validate_callback' => function($param) {
                        return is_numeric($param);
                    }
                )
            )
        ));
        
        // Endpoint para limpar cache (admin only)
        register_rest_route('zen-ra/v1', '/clear-cache/(?P<id>\d+)', array(
            'methods' => 'POST',
            'callback' => array('Zen_RA_API', 'clear_cache_endpoint'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ));
    }
    
    public function activate() {
        // Set default options
        if (!get_option('zen_ra_cache_time')) {
            add_option('zen_ra_cache_time', '600'); // 10 minutes
        }
        if (!get_option('zen_ra_orders_limit')) {
            add_option('zen_ra_orders_limit', '5');
        }
        if (!get_option('zen_ra_achievements_limit')) {
            add_option('zen_ra_achievements_limit', '5');
        }
        if (!get_option('zen_ra_total_limit')) {
            add_option('zen_ra_total_limit', '10');
        }
        if (!get_option('zen_ra_order_xp')) {
            add_option('zen_ra_order_xp', '50');
        }
        if (!get_option('zen_ra_achievement_xp')) {
            add_option('zen_ra_achievement_xp', '10');
        }
    }
}

function zen_ra_init() {
    return Zen_RA::get_instance();
}

zen_ra_init();
