<?php
/**
 * Zen BIT — Events Sitemap
 *
 * Exposes /sitemap-events.xml with SEO-optimised canonical URLs.
 *
 * CRITICAL FIX (v3.1.0):
 *   The sitemap previously pointed to `/events/{event_id}` — a URL that only
 *   exists as a short-form alias and is NOT what the React router renders.
 *   The canonical URL is `/events/{yyyy-mm-dd}-{slug}-{event_id}`, built by
 *   Zen_BIT_Normalizer::normalize_list_item(). Feeding search engines the wrong
 *   URL caused index misses and potential duplicate-content signals.
 *
 *   Fix: normalise each raw event through the Normalizer before writing <loc>,
 *   so the sitemap always matches the URL the React SPA actually renders.
 *
 * Cache strategy:
 *   Cached as a plain string transient (CACHE_KEY) for CACHE_TTL seconds (6 h).
 *   Cleared automatically when Zen_BIT_Cache::clear_all() is called (admin UI,
 *   deactivation, or POST /admin/clear-cache endpoint).
 *
 * @package ZenBit
 * @version 3.1.0
 */

namespace ZenBit;

if (!defined('ABSPATH')) {
    exit;
}

class Zen_BIT_Sitemap
{

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTANTS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Transient key for the cached sitemap XML string.
     * Intentionally NOT prefixed with `zen_bit_` so clear_all() (which deletes
     * _transient_zen_bit_*) does NOT auto-expire the sitemap — the sitemap has
     * its own clear() method called explicitly from Zen_BIT_Cache::clear_all().
     *
     * If you want the sitemap to be swept by clear_all(), rename to `zen_bit_sitemap_xml`.
     *
     * @var string
     */
    const CACHE_KEY = 'zen_bit_sitemap_events_xml';

    /**
     * Sitemap cache lifetime: 6 hours.
     * Matches the TTL of the upcoming-events pool so they expire in sync.
     *
     * @var int
     */
    const CACHE_TTL = 21600;

    // ─────────────────────────────────────────────────────────────────────────
    // CONSTRUCTOR
    // ─────────────────────────────────────────────────────────────────────────

    public function __construct()
    {
        \add_action('init', [$this, 'add_rewrite_rules']);
        \add_action('template_redirect', [$this, 'maybe_serve_sitemap']);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ROUTING
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Registers the rewrite rule that maps /sitemap-events.xml to WordPress
     * and adds `zen_bit_sitemap` to the list of recognised query variables.
     */
    public function add_rewrite_rules(): void
    {
        \add_rewrite_rule(
            '^sitemap-events\.xml$',
            'index.php?zen_bit_sitemap=events',
            'top'
        );

        \add_filter('query_vars', static function (array $vars): array {
            $vars[] = 'zen_bit_sitemap';
            return $vars;
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REQUEST HANDLER
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Intercepts the request for /sitemap-events.xml and serves the XML response.
     *
     * Flow:
     *  1. Return early if this is not a sitemap request.
     *  2. Send Content-Type header before any output.
     *  3. Serve from transient cache when available (cache HIT).
     *  4. Build fresh XML, cache it, then serve (cache MISS).
     *  5. Fall back to an empty <urlset> if the build fails.
     */
    public function maybe_serve_sitemap(): void
    {
        if (\get_query_var('zen_bit_sitemap') !== 'events') {
            return;
        }

        \header('Content-Type: application/xml; charset=UTF-8');

        // ── Cache HIT ───────────────────────────────────────────────────────
        $cached = \get_transient(self::CACHE_KEY);
        if (false !== $cached && \is_string($cached) && \strlen($cached) > 50) {
            $this->send_cache_headers();
            echo $cached; // phpcs:ignore WordPress.Security.EscapeOutput
            exit;
        }

        // ── Cache MISS — build fresh sitemap ────────────────────────────────
        $xml = $this->build_sitemap_xml();

        if (!\is_string($xml) || \strlen($xml) < 50) {
            // Build failed (no events, API down) — serve empty skeleton.
            echo $this->empty_sitemap(); // phpcs:ignore WordPress.Security.EscapeOutput
            exit;
        }

        \set_transient(self::CACHE_KEY, $xml, self::CACHE_TTL);
        $this->send_cache_headers();

        echo $xml; // phpcs:ignore WordPress.Security.EscapeOutput
        exit;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SITEMAP BUILDER
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Fetches upcoming events from Bandsintown and builds the XML string.
     *
     * CANONICAL URL FIX:
     *   Each raw event is passed through Zen_BIT_Normalizer::normalize_list_item()
     *   which calls build_canonical_path() internally:
     *     /events/{yyyy-mm-dd}-{slug}-{event_id}
     *
     *   This is the EXACT URL the React router renders — search engines will find
     *   a live page at that address. Previously the sitemap pointed to
     *   /events/{event_id} which is a short-form URL that may redirect or 404.
     *
     * @return string Valid XML string, or empty_sitemap() on failure.
     */
    private function build_sitemap_xml(): string
    {
        if (!\class_exists(__NAMESPACE__ . '\\Zen_BIT_API_V2')) {
            return $this->empty_sitemap();
        }

        // Fetch raw events directly from Bandsintown to ensure freshness for crawlers.
        // This deliberately bypasses the SWR pool — sitemaps should always reflect
        // the live event list, not stale cache.
        $raw_events = Zen_BIT_API_V2::fetch_from_bandsintown('upcoming');
        if (!\is_array($raw_events) || empty($raw_events)) {
            return $this->empty_sitemap();
        }

        $lines = [];
        $lines[] = '<?xml version="1.0" encoding="UTF-8"?>';
        $lines[] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
        $lines[] = '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"';
        $lines[] = '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9';
        $lines[] = '          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">';

        foreach ($raw_events as $raw) {
            if (!\is_array($raw) || empty($raw['id'])) {
                continue;
            }

            // ── Normalise through the Normalizer ────────────────────────────
            // normalize_list_item() calls build_canonical_path() internally.
            // This guarantees the <loc> in the sitemap matches the React route.
            $item = Zen_BIT_Normalizer::normalize_list_item($raw);

            // canonical_url is the absolute URL (home_url + canonical_path).
            $loc = $item['canonical_url'];
            if (empty($loc)) {
                continue; // Skip events with no canonical path (missing ID/date).
            }

            // <lastmod>: use event datetime if available; fall back to now.
            // ISO 8601 / W3C Datetime format required by the sitemap protocol.
            $lastmod = \gmdate('c');
            if (!empty($item['starts_at'])) {
                $ts = \strtotime($item['starts_at']);
                if ($ts) {
                    $lastmod = \gmdate('c', $ts);
                }
            }

            $lines[] = '  <url>';
            $lines[] = '    <loc>' . \esc_url($loc) . '</loc>';
            $lines[] = '    <lastmod>' . \esc_html($lastmod) . '</lastmod>';
            $lines[] = '    <changefreq>weekly</changefreq>';
            $lines[] = '    <priority>0.7</priority>';
            $lines[] = '  </url>';
        }

        $lines[] = '</urlset>';

        return implode("\n", $lines);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Sends HTTP caching headers instructing CDNs and browsers to cache the
     * sitemap for CACHE_TTL seconds.
     */
    private function send_cache_headers(): void
    {
        \header('Cache-Control: public, max-age=' . self::CACHE_TTL);
        \header('Expires: ' . \gmdate('D, d M Y H:i:s', time() + self::CACHE_TTL) . ' GMT');
    }

    /**
     * Returns a minimal valid XML sitemap with no URLs.
     * Served when the event list is empty or the API is unreachable.
     *
     * @return string
     */
    private function empty_sitemap(): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>' . "\n"
            . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CACHE INVALIDATION
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Deletes the cached sitemap XML.
     * Called by Zen_BIT_Cache::clear_all() and the admin "Clear Cache" action
     * so the sitemap is regenerated on the next crawl after a data change.
     */
    public static function clear_cache(): void
    {
        \delete_transient(self::CACHE_KEY);
    }
}
