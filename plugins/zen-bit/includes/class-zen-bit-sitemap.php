<?php
/**
 * Zen BIT - Events Sitemap (Premium SEO)
 * File: wp-content/plugins/zen-bit/includes/class-zen-bit-sitemap.php
 *
 * Exposes:
 * - /sitemap-events.xml   (dynamic, cached)
 *
 * @version 1.0.0
 */

if (!defined('ABSPATH')) exit;

class Zen_BIT_Sitemap {

    const CACHE_KEY = 'zen_bit_sitemap_events_xml';
    const CACHE_TTL = 6 * HOUR_IN_SECONDS; // 6h é um bom equilíbrio

    public function __construct() {
        add_action('init', [$this, 'add_rewrite_rules']);
        add_action('template_redirect', [$this, 'maybe_serve_sitemap']);
    }

    public function add_rewrite_rules() {
        // /sitemap-events.xml
        add_rewrite_rule('^sitemap-events\.xml$', 'index.php?zen_bit_sitemap=events', 'top');

        // registra query var
        add_filter('query_vars', function($vars) {
            $vars[] = 'zen_bit_sitemap';
            return $vars;
        });
    }

    public function maybe_serve_sitemap() {
        $type = get_query_var('zen_bit_sitemap');
        if ($type !== 'events') return;

        // Segurança: sempre XML
        header('Content-Type: application/xml; charset=UTF-8');

        // Cache de sitemap (evita hits repetidos no Bandsintown)
        $cached = get_transient(self::CACHE_KEY);
        if ($cached !== false && is_string($cached) && strlen($cached) > 50) {
            $this->send_cache_headers();
            echo $cached;
            exit;
        }

        $xml = $this->build_sitemap_xml();

        // Se der ruim, não serve vazio “indexável”
        if (!is_string($xml) || strlen($xml) < 50) {
            status_header(503);
            echo $this->empty_sitemap();
            exit;
        }

        set_transient(self::CACHE_KEY, $xml, self::CACHE_TTL);
        $this->send_cache_headers();

        echo $xml;
        exit;
    }

    private function send_cache_headers() {
        $max_age = self::CACHE_TTL;
        header('Cache-Control: public, max-age=' . $max_age);
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $max_age) . ' GMT');
    }

    private function empty_sitemap() {
        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
    }

    private function compute_internal_event_id($event) {
        if (!is_array($event)) return '';
        if (!empty($event['id'])) return (string)$event['id'];

        $seed = (string)($event['url'] ?? '') . '|' . (string)($event['datetime'] ?? '');
        return md5($seed);
    }

    private function build_event_internal_url($event_id) {
        return add_query_arg(['bit_event' => $event_id], home_url('/events/'));
    }

    private function build_sitemap_xml() {
        if (!class_exists('Zen_BIT_API')) return $this->empty_sitemap();

        // Pega mais eventos para sitemap. Se você tiver MUITOS, a gente pagina em vários sitemaps depois.
        $events = Zen_BIT_API::get_events(200);
        if (!is_array($events) || empty($events)) return $this->empty_sitemap();

        $now = gmdate('c');

        $lines = [];
        $lines[] = '<?xml version="1.0" encoding="UTF-8"?>';
        $lines[] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($events as $event) {
            if (!is_array($event)) continue;

            $event_id = $this->compute_internal_event_id($event);
            if (!$event_id) continue;

            // lastmod: usa datetime do evento se existir; senão, agora
            $lastmod = $now;
            if (!empty($event['datetime']) && is_string($event['datetime'])) {
                $ts = strtotime($event['datetime']);
                if ($ts) $lastmod = gmdate('c', $ts);
            }

            $loc = $this->build_event_internal_url($event_id);

            // Importante: escapando XML
            $lines[] = '  <url>';
            $lines[] = '    <loc>' . esc_url($loc) . '</loc>';
            $lines[] = '    <lastmod>' . esc_html($lastmod) . '</lastmod>';
            $lines[] = '    <changefreq>weekly</changefreq>';
            $lines[] = '    <priority>0.7</priority>';
            $lines[] = '  </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines);
    }

    public static function clear_cache() {
        delete_transient(self::CACHE_KEY);
    }
}
