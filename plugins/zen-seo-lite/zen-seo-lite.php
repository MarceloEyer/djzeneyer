<?php
/**
 * Plugin Name: Zen SEO Lite Pro
 * Plugin URI: https://djzeneyer.com
 * Description: SEO profissional para WordPress Headless com React SPA, Schema.org avançado, Sitemap multilíngue e REST API completa.
 * Version: 8.0.0
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 * Text Domain: zen-seo
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Plugin constants
define('ZEN_SEO_VERSION', '8.0.0');
define('ZEN_SEO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZEN_SEO_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ZEN_SEO_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main plugin class - Singleton pattern
 */
final class Zen_SEO_Lite_Pro {
    
    private static $instance = null;
    
    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor - Initialize plugin
     */
    private function __construct() {
        $this->load_dependencies();
        $this->init_hooks();
    }
    
    /**
     * Load required files
     */
    private function load_dependencies() {
        // Utilities
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-helpers.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-cache.php';
        
        // Core functionality
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-meta-tags.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-schema.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-sitemap.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-rest-api.php';
        
        // Admin only
        if (is_admin()) {
            require_once ZEN_SEO_PLUGIN_DIR . 'admin/class-zen-seo-admin.php';
            require_once ZEN_SEO_PLUGIN_DIR . 'admin/class-zen-seo-meta-box.php';
        }
    }
    
    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Activation/Deactivation
        register_activation_hook(__FILE__, [$this, 'activate']);
        register_deactivation_hook(__FILE__, [$this, 'deactivate']);
        
        // Initialize components
        add_action('plugins_loaded', [$this, 'init_components']);
        
        // Load text domain
        add_action('init', [$this, 'load_textdomain']);
    }
    
    /**
     * Initialize plugin components
     */
    public function init_components() {
        // Core components (always loaded)
        Zen_SEO_Meta_Tags::get_instance();
        Zen_SEO_Schema::get_instance();
        Zen_SEO_Sitemap::get_instance();
        Zen_SEO_REST_API::get_instance();
        
        // Admin components
        if (is_admin()) {
            Zen_SEO_Admin::get_instance();
            Zen_SEO_Meta_Box::get_instance();
        }
    }
    
    /**
     * Plugin activation
     */
    public function activate() {
        // Add sitemap rewrite rules
        Zen_SEO_Sitemap::register_rewrite_rules();
        flush_rewrite_rules();
        
        // Set default options
        $defaults = [
            'real_name' => get_bloginfo('name'),
            'react_routes' => $this->get_default_routes(),
        ];
        
        if (!get_option('zen_seo_global')) {
            add_option('zen_seo_global', $defaults);
        }
        
        // Clear all caches
        Zen_SEO_Cache::clear_all();
    }
    
    /**
     * Plugin deactivation
     */
    public function deactivate() {
        flush_rewrite_rules();
        Zen_SEO_Cache::clear_all();
    }
    
    /**
     * Load plugin text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'zen-seo',
            false,
            dirname(ZEN_SEO_PLUGIN_BASENAME) . '/languages'
        );
    }
    
    /**
     * Get default React routes
     */
    private function get_default_routes() {
        return "/, /pt/
/about, /pt/sobre
/events, /pt/eventos
/music, /pt/musica
/tribe, /pt/tribo
/shop, /pt/loja
/dashboard, /pt/painel
/my-account, /pt/minha-conta
/faq, /pt/faq";
    }
}

/**
 * Initialize plugin
 */
function zen_seo_lite_pro() {
    return Zen_SEO_Lite_Pro::get_instance();
}

// Start the plugin
zen_seo_lite_pro();
