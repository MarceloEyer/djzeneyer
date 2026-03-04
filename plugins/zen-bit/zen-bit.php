<?php
/**
 * Plugin Name: Zen BIT - Bandsintown Events
 * Plugin URI: https://djzeneyer.com
 * Description: Proxy Bandsintown com cache SWR, canonical paths, JSON-LD MusicEvent e admin health para arquitetura headless.
 * Version: 2.0.0
 * Author: Zen Eyer
 * Author URI: https://djzeneyer.com
 * License: GPL v2 or later
 * Text Domain: zen-bit
 */

if (!defined('ABSPATH'))
    exit;

define('ZEN_BIT_VERSION', '2.0.0');
define('ZEN_BIT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ZEN_BIT_PLUGIN_URL', plugin_dir_url(__FILE__));

if (!class_exists('Zen_BIT')) {

    class Zen_BIT
    {
        private static $instance = null;

        public static function get_instance()
        {
            if (null === self::$instance) {
                self::$instance = new self();
            }
            return self::$instance;
        }

        private function __construct()
        {
            $this->load_dependencies();
            $this->init_hooks();
        }

        private function load_dependencies()
        {
            // Ordem importa: Normalizer e Cache primeiro (sem deps WP pesadas)
            if (!class_exists('Zen_BIT_Normalizer')) {
                require_once ZEN_BIT_PLUGIN_DIR . 'includes/class-zen-bit-normalizer.php';
            }
            if (!class_exists('Zen_BIT_Cache')) {
                require_once ZEN_BIT_PLUGIN_DIR . 'includes/class-zen-bit-cache.php';
            }
            if (!class_exists('Zen_BIT_API')) {
                require_once ZEN_BIT_PLUGIN_DIR . 'includes/class-zen-bit-api.php';
            }
            if (!class_exists('Zen_BIT_Shortcode')) {
                require_once ZEN_BIT_PLUGIN_DIR . 'includes/class-zen-bit-shortcode.php';
            }
            if (is_admin()) {
                require_once ZEN_BIT_PLUGIN_DIR . 'admin/class-zen-bit-admin.php';
            }
        }

        private function init_hooks()
        {
            /**
             * WP 6.7+: textdomain deve carregar no init (não cedo demais)
             */
            add_action('init', array($this, 'load_textdomain'));

            add_action('wp_enqueue_scripts', array($this, 'enqueue_public_assets'));

            add_action('rest_api_init', array($this, 'register_rest_routes'));

            // Shortcode que injeta o JSON-LD (pra SSR / páginas WP)
            add_shortcode('zen_bit_events_schema', array($this, 'shortcode_events_schema'));

            // Hooks de ciclo de vida
            register_activation_hook(__FILE__, array($this, 'activate'));
            register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        }

        public function load_textdomain()
        {
            load_plugin_textdomain('zen-bit', false, dirname(plugin_basename(__FILE__)) . '/languages');
        }

        /**
         * Só carrega CSS/JS quando a página contém o shortcode [zen_bit_events]
         * (performance + menos ruído para crawlers)
         */
        public function enqueue_public_assets()
        {
            if (is_admin())
                return;

            if (!function_exists('has_shortcode') || !is_singular())
                return;

            $post_id = get_queried_object_id();
            if (!$post_id)
                return;

            $content = get_post_field('post_content', $post_id);
            if (!is_string($content) || $content === '')
                return;

            $has_events = has_shortcode($content, 'zen_bit_events');
            if (!$has_events)
                return;

            // CSS
            wp_enqueue_style(
                'zen-bit-public',
                ZEN_BIT_PLUGIN_URL . 'public/css/zen-bit-public.css',
                array(),
                ZEN_BIT_VERSION
            );

            // JS (somente quando precisa)
            wp_enqueue_script(
                'zen-bit-public',
                ZEN_BIT_PLUGIN_URL . 'public/js/zen-bit-public.js',
                array('jquery'),
                ZEN_BIT_VERSION,
                true
            );
        }

        public function register_rest_routes()
        {
            // Lista de eventos (payload enxuto)
            register_rest_route('zen-bit/v1', '/events', array(
                'methods' => 'GET',
                'callback' => array('Zen_BIT_API', 'get_events_rest'),
                'permission_callback' => '__return_true',
            ));

            // Detalhe completo de um evento
            register_rest_route('zen-bit/v1', '/events/(?P<id>[\w-]+)', array(
                'methods' => 'GET',
                'callback' => array('Zen_BIT_API', 'get_single_event_rest'),
                'permission_callback' => '__return_true',
            ));

            // Schema JSON-LD para um evento
            register_rest_route('zen-bit/v1', '/events/(?P<id>[\w-]+)/schema', array(
                'methods' => 'GET',
                'callback' => array('Zen_BIT_API', 'get_single_event_schema_rest'),
                'permission_callback' => '__return_true',
            ));

            // Schema JSON-LD para lista de eventos
            register_rest_route('zen-bit/v1', '/events-schema', array(
                'methods' => 'GET',
                'callback' => array('Zen_BIT_API', 'get_events_schema_rest'),
                'permission_callback' => '__return_true',
            ));

            // Limpar cache (admin)
            register_rest_route('zen-bit/v1', '/clear-cache', array(
                'methods' => 'POST',
                'callback' => array($this, 'clear_cache_rest'),
                'permission_callback' => function () {
                    return current_user_can('manage_options'); },
            ));

            // Forçar refresh imediato (admin)
            register_rest_route('zen-bit/v1', '/fetch-now', array(
                'methods' => 'POST',
                'callback' => array('Zen_BIT_API', 'fetch_now_rest'),
                'permission_callback' => function () {
                    return current_user_can('manage_options'); },
            ));
        }

        public function shortcode_events_schema($atts)
        {
            $atts = shortcode_atts(array(
                'limit' => 25,
            ), $atts, 'zen_bit_events_schema');

            $limit = (int) $atts['limit'];
            if ($limit <= 0)
                $limit = 25;
            if ($limit > 100)
                $limit = 100;

            if (!class_exists('Zen_BIT_API'))
                return '';

            $graph = Zen_BIT_API::get_events_schema_graph($limit);
            if (empty($graph))
                return '';

            $json = wp_json_encode($graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            return '<script type="application/ld+json">' . $json . '</script>';
        }

        public function clear_cache_rest()
        {
            if (!class_exists('Zen_BIT_API')) {
                return rest_ensure_response(array('success' => false, 'message' => 'Zen_BIT_API not available'));
            }

            Zen_BIT_API::clear_cache();
            return rest_ensure_response(array(
                'success' => true,
                'message' => 'Cache cleared successfully'
            ));
        }

        public function activate()
        {
            if (!get_option('zen_bit_artist_id')) {
                add_option('zen_bit_artist_id', '15619775');
            }
            if (!get_option('zen_bit_api_key')) {
                // sem key hardcoded
                add_option('zen_bit_api_key', '');
            }
            if (!get_option('zen_bit_cache_time')) {
                add_option('zen_bit_cache_time', '86400'); // legado em segundos
            }
            if (!get_option('zen_bit_throttle_hours')) {
                add_option('zen_bit_throttle_hours', '24'); // Novo padrão: 24h entre chamadas externas
            }

            // Opcional: limpa cache ao ativar (garante primeira carga “limpa”)
            if (class_exists('Zen_BIT_API')) {
                Zen_BIT_API::clear_cache();
            }
        }

        public function deactivate()
        {
            // Limpa transient para evitar resíduos após desativar
            if (class_exists('Zen_BIT_API')) {
                Zen_BIT_API::clear_cache();
            }
        }
    }

} // class_exists guard

/**
 * Bootstrap: DEVE EXISTIR APENAS AQUI (arquivo principal).
 * Blindagem: evita fatal se alguém duplicar isso sem querer.
 */
if (!function_exists('zen_bit_init')) {
    function zen_bit_init()
    {
        return Zen_BIT::get_instance();
    }
}

zen_bit_init();
