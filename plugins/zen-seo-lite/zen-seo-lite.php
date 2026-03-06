<?php
/**
 * Plugin Name: Zen SEO Lite Pro
 * Plugin URI: https://djzeneyer.com
 * Description: SEO profissional para WordPress Headless com React SPA, Schema.org avançado, Sitemap multilíngue e REST API completa.
 * Version: 8.1.1
 * Author: DJ Zen Eyer
 * Author URI: https://djzeneyer.com
 * Text Domain: zen-seo
 * Domain Path: /languages
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

namespace ZenEyer\SEO;

if (!\defined('ABSPATH')) {
    \exit; // Exit if accessed directly
}

/**
 * Main plugin class - Singleton pattern
 */
final class Zen_SEO_Lite_Pro
{
    /**
     * @var Zen_SEO_Lite_Pro|null
     */
    private static $instance = null;

    /**
     * Get singleton instance
     * 
     * @return Zen_SEO_Lite_Pro
     */
    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor - Initialize plugin hooks/bootstrap
     */
    private function __construct()
    {
        $this->define_constants();
        $this->load_dependencies();
        $this->init_hooks();
    }

    /**
     * Define plugin constants
     *
     * @return void
     */
    private function define_constants()
    {
        \define('ZEN_SEO_VERSION', '8.1.1');
        \define('ZEN_SEO_PLUGIN_DIR', \plugin_dir_path(__FILE__));
        \define('ZEN_SEO_PLUGIN_URL', \plugin_dir_url(__FILE__));
        \define('ZEN_SEO_PLUGIN_BASENAME', \plugin_basename(__FILE__));

        // Legacy support
        \define('ZEN_SEO_PATH', ZEN_SEO_PLUGIN_DIR);
        \define('ZEN_SEO_URL', ZEN_SEO_PLUGIN_URL);
    }

    /**
     * Load required files
     *
     * @return void
     */
    private function load_dependencies()
    {
        // Utilities first
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-helpers.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-cache.php';

        // Core logic
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-meta-tags.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-schema.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-sitemap.php';
        require_once ZEN_SEO_PLUGIN_DIR . 'includes/class-zen-seo-rest-api.php';

        // Admin components
        if (\is_admin()) {
            require_once ZEN_SEO_PLUGIN_DIR . 'admin/class-zen-seo-admin.php';
            require_once ZEN_SEO_PLUGIN_DIR . 'admin/class-zen-seo-meta-box.php';
        }
    }

    /**
     * Initialize WordPress hooks
     *
     * @return void
     */
    private function init_hooks()
    {
        // Plugin life-cycle
        \register_activation_hook(__FILE__, [$this, 'activate']);
        \register_deactivation_hook(__FILE__, [$this, 'deactivate']);

        // Initialize core components
        \add_action('plugins_loaded', [$this, 'init_components']);

        // Translations
        \add_action('init', [$this, 'load_textdomain']);
    }

    /**
     * Initialize plugin components after plugins are loaded
     *
     * @return void
     */
    public function init_components()
    {
        // Singleton factories for components
        Zen_SEO_Meta_Tags::get_instance();
        Zen_SEO_Schema::get_instance();
        Zen_SEO_Sitemap::get_instance();
        Zen_SEO_REST_API::get_instance();

        if (\is_admin()) {
            Zen_SEO_Admin::get_instance();
            Zen_SEO_Meta_Box::get_instance();
        }
    }

    /**
     * Activation routine
     */
    public function activate()
    {
        Zen_SEO_Sitemap::register_rewrite_rules();
        \flush_rewrite_rules();

        // Default options
        $defaults = [
            'real_name' => \get_bloginfo('name'),
        ];

        if (!\get_option('zen_seo_global')) {
            \add_option('zen_seo_global', $defaults);
        }

        Zen_SEO_Cache::clear_all();
    }

    /**
     * Deactivation routine
     *
     * @return void
     */
    public function deactivate()
    {
        \flush_rewrite_rules();
        Zen_SEO_Cache::clear_all();
    }

    /**
     * Load translation files
     *
     * @return void
     */
    public function load_textdomain()
    {
        \load_plugin_textdomain(
            'zen-seo',
            false,
            \dirname(ZEN_SEO_PLUGIN_BASENAME) . '/languages'
        );
    }
}

/**
 * Global accessor function for the main instance
 * 
 * @return Zen_SEO_Lite_Pro
 */
function zen_seo_lite_pro()
{
    return Zen_SEO_Lite_Pro::get_instance();
}

// Start the plugin engine
zen_seo_lite_pro();
