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
        require_once ZEN_BIT_PLUGIN_DIR . 'includes/class-zen-bit-sitemap.php'; // ✅ NEW (sitemap-events.xml)
        require_once ZEN_BIT_PLUGIN_DIR . 'admin/class-zen-bit-admin.php';
    }

    private function init_hooks() {
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_public_assets'));

        add_action('rest_api_init', array($this, 'register_rest_routes'));

        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));

        // ✅ Premium SEO: evento como “página” SSR via query var
        add_filter('query_vars', array($this, 'register_query_vars'));
        add_action('template_redirect', array($this, 'maybe_render_single_event_page'));

        // ✅ Premium SEO: sitemap de eventos
        if (class_exists('Zen_BIT_Sitemap')) {
            new Zen_BIT_Sitemap();
        }
    }

    /**
     * Load plugin text domain for translations
     */
    public function load_textdomain() {
        load_plugin_textdomain('zen-bit', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    public function enqueue_public_assets() {
        // Só carrega CSS se shortcode estiver na página
        if (is_singular() && has_shortcode(get_post_field('post_content', get_queried_object_id()), 'zen_bit_events')) {
            wp_enqueue_style(
                'zen-bit-public',
                ZEN_BIT_PLUGIN_URL . 'public/css/zen-bit-public.css',
                array(),
                ZEN_BIT_VERSION
            );
        }

        // JS (se você usa em algum lugar). Se não precisa, pode remover.
        wp_enqueue_script(
            'zen-bit-public',
            ZEN_BIT_PLUGIN_URL . 'public/js/zen-bit-public.js',
            array('jquery'),
            ZEN_BIT_VERSION,
            true
        );
    }

    public function register_rest_routes() {
        register_rest_route('zen-bit/v1', '/events', array(
            'methods' => 'GET',
            'callback' => array('Zen_BIT_API', 'get_events_rest'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route('zen-bit/v1', '/clear-cache', array(
            'methods' => 'POST',
            'callback' => array($this, 'clear_cache_rest'),
            'permission_callback' => function() {
                return current_user_can('manage_options');
            }
        ));
    }

    public function clear_cache_rest() {
        // Limpa cache do endpoint
        if (class_exists('Zen_BIT_API')) {
            Zen_BIT_API::clear_cache();
        }

        // Limpa cache do sitemap (se existir)
        if (class_exists('Zen_BIT_Sitemap')) {
            Zen_BIT_Sitemap::clear_cache();
        }

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
            add_option('zen_bit_api_key', 'f8f1216ea03be95a3ea91c7ebe7117e7');
        }
        if (!get_option('zen_bit_cache_time')) {
            add_option('zen_bit_cache_time', '3600');
        }

        // ✅ Importantíssimo: garante que /sitemap-events.xml funcione imediatamente
        flush_rewrite_rules();
    }

    public function deactivate() {
        flush_rewrite_rules();
    }

    // =========================================================================
    // Premium SEO: Evento como página SSR
    // =========================================================================

    public function register_query_vars($vars) {
        $vars[] = 'bit_event';
        return $vars;
    }

    private function sanitize_url($url) {
        if (empty($url) || !is_string($url)) return '';
        $url = trim($url);

        // Permite caminho relativo
        if (strpos($url, '/') === 0) return $url;

        $parsed = wp_parse_url($url);
        if (!$parsed || empty($parsed['scheme'])) return '';

        $scheme = strtolower($parsed['scheme']);
        if (!in_array($scheme, array('http', 'https'), true)) return '';

        return esc_url_raw($url);
    }

    private function compute_internal_event_id($event) {
        if (!is_array($event)) return '';

        if (!empty($event['id'])) {
            return (string) $event['id'];
        }

        $seed = (string)($event['url'] ?? '') . '|' . (string)($event['datetime'] ?? '');
        return md5($seed);
    }

    private function get_internal_event_url_by_id($event_id) {
        return add_query_arg(
            array('bit_event' => $event_id),
            home_url('/events/')
        );
    }

    private function find_event_by_id($event_id, $events) {
        foreach ((array)$events as $event) {
            $id = $this->compute_internal_event_id($event);
            if ($id && hash_equals((string)$event_id, (string)$id)) {
                return $event;
            }
        }
        return null;
    }

    private function build_event_title($event) {
        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();
        if (!empty($event['title']) && is_string($event['title'])) return $event['title'];
        return sprintf('DJ Zen Eyer at %s', $venue['name'] ?? 'Event');
    }

    private function build_event_description($event) {
        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();
        if (!empty($event['description']) && is_string($event['description'])) return $event['description'];

        $city = $venue['city'] ?? '';
        $country = $venue['country'] ?? '';
        $place = trim($city . (empty($country) ? '' : ', ' . $country));

        return sprintf(
            'Official event page: DJ Zen Eyer performing live at %s%s.',
            $venue['name'] ?? 'venue',
            $place ? (' in ' . $place) : ''
        );
    }

    private function build_event_image($event) {
        if (!empty($event['image']) && is_string($event['image'])) {
            $img = $this->sanitize_url($event['image']);
            if ($img) return $img;
        }
        return 'https://djzeneyer.com/images/event-default.jpg';
    }

    private function build_event_datetime_iso($event) {
        if (empty($event['datetime']) || !is_string($event['datetime'])) return '';
        $ts = strtotime($event['datetime']);
        if (!$ts) return '';
        return wp_date('c', $ts);
    }

    private function build_ticket_url($event) {
        if (!empty($event['offers'][0]['url']) && is_string($event['offers'][0]['url'])) {
            $u = $this->sanitize_url($event['offers'][0]['url']);
            if ($u) return $u;
        }
        if (!empty($event['url']) && is_string($event['url'])) {
            $u = $this->sanitize_url($event['url']);
            if ($u) return $u;
        }
        return '';
    }

    private function render_json_ld_single($event, $event_id) {
        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();

        $title = $this->build_event_title($event);
        $desc  = $this->build_event_description($event);
        $img   = $this->build_event_image($event);

        $start = $this->build_event_datetime_iso($event);
        if (!$start) return '';

        $canonical = $this->get_internal_event_url_by_id($event_id);
        $external  = !empty($event['url']) && is_string($event['url']) ? $this->sanitize_url($event['url']) : '';
        $tickets   = $this->build_ticket_url($event);

        $place_name = $venue['name'] ?? 'Venue';

        $graph = array();

        // Breadcrumb
        $graph[] = array(
            '@type' => 'BreadcrumbList',
            '@id' => $canonical . '#breadcrumb',
            'itemListElement' => array(
                array(
                    '@type' => 'ListItem',
                    'position' => 1,
                    'name' => 'Home',
                    'item' => home_url('/')
                ),
                array(
                    '@type' => 'ListItem',
                    'position' => 2,
                    'name' => 'Events',
                    'item' => home_url('/events/')
                ),
                array(
                    '@type' => 'ListItem',
                    'position' => 3,
                    'name' => wp_strip_all_tags($title),
                    'item' => $canonical
                ),
            )
        );

        // Performer entity
        $graph[] = array(
            '@type' => 'MusicGroup',
            '@id' => home_url('/') . '#djzeneyer',
            'name' => 'DJ Zen Eyer',
            'genre' => 'Brazilian Zouk',
            'url' => home_url('/'),
            'sameAs' => array(
                'https://www.instagram.com/djzeneyer/',
                'https://soundcloud.com/djzeneyer',
                'https://www.bandsintown.com/a/15552355'
            )
        );

        // WebPage entity
        $graph[] = array(
            '@type' => 'WebPage',
            '@id' => $canonical . '#webpage',
            'url' => $canonical,
            'name' => wp_strip_all_tags($title),
            'description' => wp_strip_all_tags($desc),
            'isPartOf' => array(
                '@type' => 'WebSite',
                '@id' => home_url('/') . '#website'
            ),
            'breadcrumb' => array('@id' => $canonical . '#breadcrumb')
        );

        // MusicEvent entity
        $event_schema = array(
            '@type' => 'MusicEvent',
            '@id' => $canonical . '#event',
            'name' => wp_strip_all_tags($title),
            'description' => wp_strip_all_tags($desc),
            'startDate' => $start,
            'eventStatus' => 'https://schema.org/EventScheduled',
            'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
            'url' => $canonical,
            'image' => $img,
            'location' => array(
                '@type' => 'Place',
                'name' => $place_name,
                'address' => array(
                    '@type' => 'PostalAddress',
                    'addressLocality' => $venue['city'] ?? '',
                    'addressRegion' => $venue['region'] ?? '',
                    'addressCountry' => $venue['country'] ?? '',
                )
            ),
            'performer' => array(
                '@id' => home_url('/') . '#djzeneyer'
            ),
        );

        if (!empty($external)) {
            $event_schema['sameAs'] = $external;
        }

        if (!empty($tickets)) {
            $event_schema['offers'] = array(
                '@type' => 'Offer',
                'url' => $tickets,
                'availability' => 'https://schema.org/InStock'
            );
        }

        $graph[] = $event_schema;

        $json_ld = array(
            '@context' => 'https://schema.org',
            '@graph' => $graph
        );

        return '<script type="application/ld+json">' .
            wp_json_encode($json_ld, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) .
        '</script>';
    }

    private function output_meta_tags($title, $desc, $canonical, $image) {
        $title = wp_strip_all_tags($title);
        $desc  = wp_strip_all_tags($desc);

        echo "\n<!-- Zen BIT Premium SEO -->\n";
        echo '<link rel="canonical" href="' . esc_url($canonical) . '">' . "\n";

        echo '<meta property="og:type" content="website">' . "\n";
        echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
        echo '<meta property="og:description" content="' . esc_attr($desc) . '">' . "\n";
        echo '<meta property="og:url" content="' . esc_url($canonical) . '">' . "\n";
        if (!empty($image)) echo '<meta property="og:image" content="' . esc_url($image) . '">' . "\n";

        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
        echo '<meta name="twitter:description" content="' . esc_attr($desc) . '">' . "\n";
        if (!empty($image)) echo '<meta name="twitter:image" content="' . esc_url($image) . '">' . "\n";
        echo "<!-- /Zen BIT Premium SEO -->\n\n";
    }

    /**
     * Se /events/?bit_event=XYZ => render SSR do evento e sai (exit)
     */
    public function maybe_render_single_event_page() {
        $event_id = get_query_var('bit_event');
        if (empty($event_id)) return;

        // Só renderiza dentro da “área events” (evita “página fantasma” em qualquer URL)
        $req_uri = isset($_SERVER['REQUEST_URI']) ? sanitize_text_field(wp_unslash($_SERVER['REQUEST_URI'])) : '';
        if (strpos($req_uri, '/events') === false) {
            return;
        }

        // Puxa eventos e acha pelo ID
        $events = class_exists('Zen_BIT_API') ? Zen_BIT_API::get_events(200) : array();
        $event = $this->find_event_by_id($event_id, $events);

        if (!$event) {
            status_header(404);
            nocache_headers();
            echo '<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"></head><body>Event not found.</body></html>';
            exit;
        }

        $title = $this->build_event_title($event);
        $desc  = $this->build_event_description($event);
        $img   = $this->build_event_image($event);
        $canonical = $this->get_internal_event_url_by_id($event_id);

        add_filter('pre_get_document_title', function() use ($title) {
            return $title . ' | DJ Zen Eyer';
        }, 999);

        add_action('wp_head', function() use ($title, $desc, $canonical, $img, $event, $event_id) {
            $this->output_meta_tags($title, $desc, $canonical, $img);
            echo $this->render_json_ld_single($event, $event_id);
        }, 1);

        status_header(200);
        nocache_headers();

        $venue = is_array($event['venue'] ?? null) ? $event['venue'] : array();
        $datetime_iso = $this->build_event_datetime_iso($event);
        $tickets = $this->build_ticket_url($event);
        $external = !empty($event['url']) && is_string($event['url']) ? $this->sanitize_url($event['url']) : '';

        $date_human = '';
        $time_human = '';
        if ($datetime_iso) {
            $ts = strtotime($datetime_iso);
            if ($ts) {
                $date_human = wp_date('d M Y', $ts);
                $time_human = wp_date('H:i', $ts);
            }
        }

        $city = $venue['city'] ?? '';
        $country = $venue['country'] ?? '';
        $place = trim($city . (empty($country) ? '' : ', ' . $country));

        ?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class('zen-bit-single-event'); ?>>
<?php if (function_exists('wp_body_open')) wp_body_open(); ?>

<main class="zen-bit-single-wrap" style="padding:96px 16px 64px;max-width:1000px;margin:0 auto;">
    <header style="margin-bottom:24px;">
        <p style="opacity:.7;margin:0 0 8px;">
            <a href="<?php echo esc_url(home_url('/events/')); ?>" style="text-decoration:none;">← Events</a>
        </p>
        <h1 style="margin:0 0 8px;"><?php echo esc_html($title); ?></h1>
        <p style="opacity:.75;margin:0;">
            <?php if ($date_human): ?>
                <strong><?php echo esc_html($date_human); ?></strong><?php if ($time_human) echo ' • ' . esc_html($time_human); ?>
            <?php endif; ?>
            <?php if (!empty($place)) echo ' • ' . esc_html($place); ?>
        </p>
    </header>

    <section style="display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:start;">
        <article style="border:1px solid rgba(255,255,255,.08);border-radius:16px;overflow:hidden;background:rgba(255,255,255,.03);">
            <div style="aspect-ratio:16/9;background:#111;overflow:hidden;">
                <img src="<?php echo esc_url($img); ?>" alt="<?php echo esc_attr($title); ?>" style="width:100%;height:100%;object-fit:cover;display:block;">
            </div>
            <div style="padding:18px 18px 20px;">
                <h2 style="margin:0 0 10px;font-size:18px;">About this event</h2>
                <p style="margin:0;opacity:.85;line-height:1.6;"><?php echo esc_html($desc); ?></p>
            </div>
        </article>

        <aside style="border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(255,255,255,.03);padding:18px;">
            <h2 style="margin:0 0 12px;font-size:18px;">Details</h2>

            <div style="margin-bottom:12px;opacity:.9;">
                <div style="font-weight:700;margin-bottom:4px;">Venue</div>
                <div><?php echo esc_html($venue['name'] ?? ''); ?></div>
            </div>

            <div style="margin-bottom:12px;opacity:.9;">
                <div style="font-weight:700;margin-bottom:4px;">Location</div>
                <div><?php echo esc_html($place); ?></div>
            </div>

            <?php if (!empty($tickets)): ?>
                <a href="<?php echo esc_url($tickets); ?>" target="_blank" rel="noopener noreferrer"
                   style="display:block;text-align:center;padding:12px 14px;border-radius:12px;text-decoration:none;font-weight:800;background:#0D96FF;color:#0b0b0b;margin-top:10px;">
                    Get Tickets
                </a>
            <?php endif; ?>

            <?php if (!empty($external)): ?>
                <a href="<?php echo esc_url($external); ?>" target="_blank" rel="noopener noreferrer"
                   style="display:block;text-align:center;padding:10px 14px;border-radius:12px;text-decoration:none;font-weight:700;border:1px solid rgba(255,255,255,.15);margin-top:10px;">
                    View on Bandsintown
                </a>
            <?php endif; ?>
        </aside>
    </section>
</main>

<?php wp_footer(); ?>
</body>
</html>
<?php
        exit;
    }
}

function zen_bit_init() {
    return Zen_BIT::get_instance();
}

zen_bit_init();
