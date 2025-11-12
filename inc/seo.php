<?php
if (!defined('ABSPATH')) exit;

// Sitemap Customizado
add_action('init', function() {
    add_rewrite_rule('^sitemap\.xml$', 'index.php?djz_sitemap=1', 'top');
});
add_filter('query_vars', function($vars) { $vars[] = 'djz_sitemap'; return $vars; });
add_filter('wp_sitemaps_enabled', '__return_false');

add_action('template_redirect', function() {
    if (get_query_var('djz_sitemap') != 1) return;
    header('Content-Type: application/xml; charset=utf-8');
    
    $urls = [
        ['loc' => home_url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        ['loc' => home_url('/about'), 'priority' => '0.9', 'changefreq' => 'monthly'],
        ['loc' => home_url('/music'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => home_url('/events'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => home_url('/shop'), 'priority' => '0.8', 'changefreq' => 'daily'],
    ];
    
    if (class_exists('WooCommerce')) {
        $products = wc_get_products(['limit' => -1, 'status' => 'publish']);
        foreach ($products as $product) {
            $urls[] = ['loc' => get_permalink($product->get_id()), 'priority' => '0.7', 'changefreq' => 'weekly'];
        }
    }
    
    echo '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    foreach ($urls as $url) {
        echo '<url><loc>' . esc_url($url['loc']) . '</loc><priority>' . $url['priority'] . '</priority><changefreq>' . $url['changefreq'] . '</changefreq><lastmod>' . date('Y-m-d') . '</lastmod></url>';
    }
    echo '</urlset>';
    exit;
});

// Robots.txt Otimizado
add_filter('robots_txt', function($output) {
    return "# DJ Zen Eyer - AI Optimized\nUser-agent: *\nAllow: /\nDisallow: /wp-admin/\nDisallow: /wp-json/\nSitemap: " . home_url('/sitemap.xml') . "\n";
});

// Schema: LocalBusiness
add_action('wp_head', function() {
    if (!is_front_page()) return;
    $schema = [
        "@context" => "https://schema.org",
        "@type" => ["MusicGroup", "LocalBusiness"],
        "name" => "DJ Zen Eyer",
        "url" => home_url('/'),
        "image" => home_url('/images/zen-eyer-profile.jpg'),
        "description" => "World champion Brazilian Zouk DJ based in Niterói, Brazil."
    ];
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}, 1);

// Schema: Product (WooCommerce)
add_action('woocommerce_single_product_summary', function() {
    global $product;
    if (!$product) return;
    $schema = [
        "@context" => "https://schema.org", "@type" => "Product",
        "name" => $product->get_name(),
        "sku" => $product->get_sku(),
        "offers" => ["@type" => "Offer", "price" => $product->get_price(), "priceCurrency" => "BRL"]
    ];
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES) . '</script>';
}, 5);