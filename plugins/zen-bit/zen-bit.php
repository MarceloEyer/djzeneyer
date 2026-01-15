<?php
/**
 * Plugin Name: Zen BIT - Bandsintown Events
 * Plugin URI: https://djzeneyer.com
 * Description: Display Bandsintown events with beautiful design and SEO optimization for search engines and AI bots
 * Version: 1.1.0
 * Author: Zen Eyer
 * Author URI: https://djzeneyer.com
 * License: GPL v2 or later
 * Text Domain: zen-bit
 */

if (!defined('ABSPATH')) exit;

define('ZEN_BIT_VERSION', '1.1.0');
define('ZEN_BIT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZEN_BIT_PLUGIN_URL', plugin_dir_url(__FILE__));

class Zen_BIT {
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
        require_once ZEN_BIT_PLUGIN_DIR . 'includes/class-zen-bit-api.php';
        require_once ZEN_BIT_PLUGIN_DIR . 'includes/class-zen-bit-shortcode.php';
        require_once ZEN_BIT_PLUGIN_DIR . 'admin/class-zen-bit-admin.php';
    }

    private function init_hooks() {
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_public_assets'));

        add_action('rest_api_init', array($this, 'register_rest_routes'));
        add_shortcode('zen_bit_events_schema', array($this, 'shortcode_events_schema'));

        register_activation_hook(__FILE__, array($this, 'activate'));
    }

    public function load_textdomain() {
        load_plugin_textdomain('zen-bit', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    public function enqueue_public_assets() {
        // Só carrega CSS se shortcode estiver na página (se for WP tradicional)
        if (function_exists('has_shortcode') && is_singular()) {
            $content = get_post_field('post_content', get_the_ID());
            if (is_string($content) && has_shortcode($content, 'zen_bit_events')) {
                wp_enqueue_style(
                    'zen-bit-public',
                    ZEN_BIT_PLUGIN_URL . 'public/css/zen-bit-public.css',
                    [],
                    ZEN_BIT_VERSION
                );
            }
        }

        wp_enqueue_script(
            'zen-bit-public',
            ZEN_BIT_PLUGIN_URL . 'public/js/zen-bit-public.js',
            array('jquery'),
            ZEN_BIT_VERSION,
            true
        );
    }

    public function register_rest_routes() {
        // Eventos (JSON cru)
        register_rest_route('zen-bit/v1', '/events', array(
            'methods' => 'GET',
            'callback' => array('Zen_BIT_API', 'get_events_rest'),
            'permission_callback' => '__return_true'
        ));

        // Eventos (JSON-LD Schema graph)
        register_rest_route('zen-bit/v1', '/events-schema', array(
            'methods' => 'GET',
            'callback' => array('Zen_BIT_API', 'get_events_schema_rest'),
            'permission_callback' => '__return_true'
        ));

        // Clear cache (admin)
        register_rest_route('zen-bit/v1', '/clear-cache', array(
            'methods' => 'POST',
            'callback' => array($this, 'clear_cache_rest'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ));
    }

    public function shortcode_events_schema($atts) {
        $atts = shortcode_atts(array(
            'limit' => 25,
        ), $atts, 'zen_bit_events_schema');

        $limit = (int) $atts['limit'];
        if ($limit <= 0) $limit = 25;
        if ($limit > 100) $limit = 100;

        $graph = Zen_BIT_API::get_events_schema_graph($limit);
        if (empty($graph)) return '';

        $json = wp_json_encode($graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        return '<script type="application/ld+json">' . $json . '</script>';
    }

    public function clear_cache_rest() {
        Zen_BIT_API::clear_cache();
        return rest_ensure_response(array(
            'success' => true,
            'message' => 'Cache cleared successfully'
        ));
    }

    public function activate() {
        if (!get_option('zen_bit_artist_id')) {
            add_option('zen_bit_artist_id', '15619775');
        }
        if (!get_option('zen_bit_api_key')) {
            // Importante: sem key hardcoded.
            add_option('zen_bit_api_key', '');
        }
        if (!get_option('zen_bit_cache_time')) {
            add_option('zen_bit_cache_time', '86400'); // 24h
        }
    }
}

function zen_bit_init() {
    return Zen_BIT::get_instance();
}

zen_bit_init();
