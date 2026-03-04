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

namespace ZenBit;

if (!defined('ABSPATH'))
    exit;

class Zen_BIT_Sitemap
{

    const CACHE_KEY = 'zen_bit_sitemap_events_xml';
    const CACHE_TTL = 21600; // 6h (6 * 3600)

    public function __construct()
    {
        add_action('init', [$this, 'add_rewrite_rules']);
        add_action('template_redirect', [$this, 'maybe_serve_sitemap']);
    }

    public function add_rewrite_rules(): void
    {
        add_rewrite_rule('^sitemap-events\.xml$', 'index.php?zen_bit_sitemap=events', 'top');

        add_filter('query_vars', function ($vars) {
            $vars[] = 'zen_bit_sitemap';
            return $vars;
        });
    }

    public function maybe_serve_sitemap(): void
    {
        $type = get_query_var('zen_bit_sitemap');
        if ($type !== 'events')
            return;

        header('Content-Type: application/xml; charset=UTF-8');

        $cached = get_transient(self::CACHE_KEY);
        if ($cached !== false && is_string($cached) && strlen($cached) > 50) {
            $this->send_cache_headers();
            echo $cached;
            exit;
        }

        $xml = $this->build_sitemap_xml();

        if (!is_string($xml) || strlen($xml) < 50) {
            echo $this->empty_sitemap();
            exit;
        }

        set_transient(self::CACHE_KEY, $xml, self::CACHE_TTL);
        $this->send_cache_headers();

        echo $xml;
        exit;
    }

    private function send_cache_headers(): void
    {
        $max_age = self::CACHE_TTL;
        header('Cache-Control: public, max-age=' . $max_age);
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $max_age) . ' GMT');
    }

    private function empty_sitemap(): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
    }

    private function build_sitemap_xml(): string
    {
        if (!class_exists(__NAMESPACE__ . '\\Zen_BIT_API_V2')) {
            return $this->empty_sitemap();
        }

        // v2: Busca direta do Bandsintown para garantir dados frescos no crawler
        $events = Zen_BIT_API_V2::fetch_from_bandsintown('upcoming');
        if (!is_array($events) || empty($events)) {
            return $this->empty_sitemap();
        }

        $now = gmdate('c');
        $lines = [];
        $lines[] = '<?xml version="1.0" encoding="UTF-8"?>';
        $lines[] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($events as $event) {
            if (!is_array($event) || empty($event['id']))
                continue;

            $event_id = (string) $event['id'];

            // lastmod: na v2 usamos datetime raw da BIT ou agora
            $lastmod = $now;
            if (!empty($event['datetime']) && is_string($event['datetime'])) {
                $ts = strtotime($event['datetime']);
                if ($ts)
                    $lastmod = gmdate('c', $ts);
            }

            // O sitemap aponta para o path canônico do headless /events/ID
            $loc = home_url('/events/' . $event_id);

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

    public static function clear_cache(): void
    {
        delete_transient(self::CACHE_KEY);
    }
}
