<?php
/**
 * Plugin Name: Zen BIT - Bandsintown Events
 * Plugin URI:  https://djzeneyer.com
 * Description: Proxy Bandsintown com cache SWR, canonical paths, JSON-LD MusicEvent e admin health para arquitetura headless.
 * Version:     3.1.0
 * Author:      Zen Eyer
 * Author URI:  https://djzeneyer.com
 * License:     GPL v2 or later
 * Text Domain: zen-bit
 */

namespace ZenBit;

if (!defined('ABSPATH'))
    die;

define('ZEN_BIT_VERSION', '3.1.0');
define('ZEN_BIT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZEN_BIT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load Composer dependencies and PSR-4 autoloader
if (file_exists(ZEN_BIT_PLUGIN_DIR . 'vendor/autoload.php')) {
    require_once ZEN_BIT_PLUGIN_DIR . 'vendor/autoload.php';
}

if (!class_exists('ZenBit\Zen_BIT')) {

    class Zen_BIT
    {
        private static $instance = null;

        public static function get_instance(): self
        {
            if (null === self::$instance)
                self::$instance = new self();
            return self::$instance;
        }

        private function __construct()
        {
            $this->init_hooks();
        }

        private function init_hooks(): void
        {
            add_action('init', [$this, 'load_textdomain']);
            add_action('rest_api_init', [$this, 'register_rest_routes']);
            add_action('wp_enqueue_scripts', [$this, 'register_public_assets']);
            register_activation_hook(__FILE__, [$this, 'activate']);
            register_deactivation_hook(__FILE__, [$this, 'deactivate']);

            // Inicializa Sitemap
            if (class_exists(__NAMESPACE__ . '\\Zen_Bit_Sitemap')) {
                new Zen_Bit_Sitemap();
            }

            // Shortcode [zen_bit_events] — Enfileiramento condicional
            add_shortcode('zen_bit_events', [$this, 'render_shortcode']);

            if (is_admin()) {
                new Zen_Bit_Admin();
            }
        }

        public function render_shortcode($atts): string
        {
            wp_enqueue_style('zen-bit-public');
            return '<div id="zen-bit-events-root" class="zen-bit-events-container"></div>';
        }

        public function load_textdomain(): void
        {
            load_plugin_textdomain('zen-bit', false, dirname(plugin_basename(__FILE__)) . '/languages');
        }

        public function register_public_assets(): void
        {
            wp_register_style(
                'zen-bit-public',
                ZEN_BIT_PLUGIN_URL . 'public/css/zen-bit-public.css',
                [],
                ZEN_BIT_VERSION
            );
        }

        // =====================================================================
        // ROTAS REST — apenas zen-bit/v2
        // =====================================================================

        public function register_rest_routes(): void
        {
            $api_class = __NAMESPACE__ . '\\Zen_Bit_API'; // updated class name based on file rename

            // ---- Público ----

            // Lista de eventos (payload enxuto)
            register_rest_route('zen-bit/v2', '/events', [
                'methods' => 'GET',
                'callback' => [$api_class, 'list_events'],
                'permission_callback' => '__return_true',
                'args' => [
                    'mode' => ['type' => 'string', 'default' => 'upcoming'],
                    'days' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 730],
                    'date' => ['type' => 'string'],
                    'limit' => ['type' => 'integer', 'default' => 50, 'minimum' => 1, 'maximum' => 200],
                    'lang' => ['type' => 'string', 'default' => 'en'],
                ],
            ]);

            // Schema JSON-LD — lista  (/events/schema ANTES de /events/{id})
            register_rest_route('zen-bit/v2', '/events/schema', [
                'methods' => 'GET',
                'callback' => [$api_class, 'list_events_schema'],
                'permission_callback' => '__return_true',
                'args' => [
                    'mode' => ['type' => 'string', 'default' => 'upcoming'],
                    'days' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 730],
                    'date' => ['type' => 'string'],
                    'limit' => ['type' => 'integer', 'default' => 50, 'minimum' => 1, 'maximum' => 200],
                ],
            ]);

            // Detalhe de evento (event_id numérico)
            register_rest_route('zen-bit/v2', '/events/(?P<event_id>\d+)', [
                'methods' => 'GET',
                'callback' => [$api_class, 'get_event'],
                'permission_callback' => '__return_true',
                'args' => [
                    'event_id' => ['type' => 'integer', 'required' => true, 'minimum' => 1],
                ],
            ]);

            // Schema JSON-LD — evento individual
            register_rest_route('zen-bit/v2', '/events/(?P<event_id>\d+)/schema', [
                'methods' => 'GET',
                'callback' => [$api_class, 'get_event_schema'],
                'permission_callback' => '__return_true',
                'args' => [
                    'event_id' => ['type' => 'integer', 'required' => true],
                ],
            ]);

            // ---- Admin (manage_options) ----

            register_rest_route('zen-bit/v2', '/admin/fetch-now', [
                'methods' => 'POST',
                'callback' => [$api_class, 'admin_fetch_now'],
                'permission_callback' => [$api_class, 'check_admin_auth'],
            ]);

            register_rest_route('zen-bit/v2', '/admin/clear-cache', [
                'methods' => 'POST',
                'callback' => [$api_class, 'admin_clear_cache'],
                'permission_callback' => [$api_class, 'check_admin_auth'],
            ]);

            register_rest_route('zen-bit/v2', '/admin/health', [
                'methods' => 'GET',
                'callback' => [$api_class, 'admin_health'],
                'permission_callback' => [$api_class, 'check_admin_auth'],
            ]);
        }

        // =====================================================================
        // ATIVAÇÃO / DESATIVAÇÃO
        // =====================================================================

        public function activate(): void
        {
            $defaults = [
                'zen_bit_artist_id' => '15619775',
                'zen_bit_artist_name' => '',
                'zen_bit_api_key' => '',
                'zen_bit_default_days' => '365',
                'zen_bit_ttl_upcoming' => '21600',
                'zen_bit_ttl_detail' => '86400',
                'zen_bit_ttl_past' => '604800',
                'zen_bit_enable_schema' => '1',
                'zen_bit_include_raw_debug' => '0',
            ];
            foreach ($defaults as $key => $val) {
                if (get_option($key) === false)
                    add_option($key, $val);
            }
            if (class_exists(__NAMESPACE__ . '\\Zen_Bit_Cache'))
                Zen_Bit_Cache::clear_all();
        }

        public function deactivate(): void
        {
            if (class_exists(__NAMESPACE__ . '\\Zen_Bit_Cache'))
                Zen_Bit_Cache::clear_all();
        }
    }
}

function zen_bit_init(): Zen_BIT
{
    return Zen_BIT::get_instance();
}
zen_bit_init();
