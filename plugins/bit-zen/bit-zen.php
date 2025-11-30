<?php
/**
 * Plugin Name: BIT-Zen - Bandsintown Events
 * Plugin URI: https://djzeneyer.com
 * Description: Display Bandsintown events with beautiful design and SEO optimization for search engines and AI bots
 * Version: 1.0.0
 * Author: Zen Eyer
 * Author URI: https://djzeneyer.com
 * License: GPL v2 or later
 * Text Domain: bit-zen
 */

if (!defined('ABSPATH')) exit;

define('BIT_ZEN_VERSION', '1.0.0');
define('BIT_ZEN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('BIT_ZEN_PLUGIN_URL', plugin_dir_url(__FILE__));

class BIT_Zen {
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
        require_once BIT_ZEN_PLUGIN_DIR . 'includes/class-bit-zen-api.php';
        require_once BIT_ZEN_PLUGIN_DIR . 'includes/class-bit-zen-shortcode.php';
        require_once BIT_ZEN_PLUGIN_DIR . 'admin/class-bit-zen-admin.php';
    }
    
    private function init_hooks() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_public_assets'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
        register_activation_hook(__FILE__, array($this, 'activate'));
    }
    
    public function enqueue_public_assets() {
        wp_enqueue_style('bit-zen-public', BIT_ZEN_PLUGIN_URL . 'public/css/bit-zen-public.css', array(), BIT_ZEN_VERSION);
        wp_enqueue_script('bit-zen-public', BIT_ZEN_PLUGIN_URL . 'public/js/bit-zen-public.js', array('jquery'), BIT_ZEN_VERSION, true);
    }
    
    public function register_rest_routes() {
        register_rest_route('bit-zen/v1', '/events', array(
            'methods' => 'GET',
            'callback' => array('BIT_Zen_API', 'get_events_rest'),
            'permission_callback' => '__return_true'
        ));
    }
    
    public function activate() {
        if (!get_option('bit_zen_artist_id')) {
            add_option('bit_zen_artist_id', '15552355');
        }
        if (!get_option('bit_zen_cache_time')) {
            add_option('bit_zen_cache_time', '3600');
        }
    }
}

function bit_zen_init() {
    return BIT_Zen::get_instance();
}

bit_zen_init();
