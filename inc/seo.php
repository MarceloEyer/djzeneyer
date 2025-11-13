<?php
if (!defined('ABSPATH')) exit;

/* =========================
 * SITEMAP.XML
 * ========================= */
add_action('init', function() {
    add_rewrite_rule('^sitemap\.xml$', 'index.php?djz_sitemap=1', 'top');
});

add_filter('query_vars', function($vars) {
    $vars[] = 'djz_sitemap';
    return $vars;
});

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
        ['loc' => home_url('/work-with-me'), 'priority' => '0.9', 'changefreq' => 'monthly'],
        ['loc' => home_url('/zentribe'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => home_url('/faq'), 'priority' => '0.7', 'changefreq' => 'monthly'],
    ];
    
    if (class_exists('WooCommerce')) {
        $products = wc_get_products(['limit' => -1, 'status' => 'publish']);
        foreach ($products as $product) {
            $urls[] = [
                'loc' => get_permalink($product->get_id()),
                'priority' => '0.7',
                'changefreq' => 'weekly'
            ];
        }
    }
    
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    foreach ($urls as $url) {
        echo '<url>';
        echo '<loc>' . esc_url($url['loc']) . '</loc>';
        echo '<priority>' . $url['priority'] . '</priority>';
        echo '<changefreq>' . $url['changefreq'] . '</changefreq>';
        echo '<lastmod>' . date('Y-m-d') . '</lastmod>';
        echo '</url>';
    }
    
    echo '</urlset>';
    exit;
});

/* =========================
 * ROBOTS.TXT
 * ========================= */
add_filter('robots_txt', function($output) {
    $output = "# DJ Zen Eyer - Optimized for AI Bots\n";
    $output .= "User-agent: *\n";
    $output .= "Allow: /\n";
    $output .= "Allow: /wp-content/uploads/\n";
    $output .= "Allow: /wp-content/themes/zentheme/dist/\n";
    $output .= "\n";
    $output .= "Disallow: /wp-admin/\n";
    $output .= "Disallow: /wp-includes/\n";
    $output .= "Disallow: /wp-json/\n";
    $output .= "Disallow: /cart/\n";
    $output .= "Disallow: /checkout/\n";
    $output .= "Disallow: /my-account/\n";
    $output .= "\n";
    $output .= "# AI Bots - Full Access\n";
    $output .= "User-agent: GPTBot\n";
    $output .= "User-agent: ChatGPT-User\n";
    $output .= "User-agent: Claude-Web\n";
    $output .= "User-agent: anthropic-ai\n";
    $output .= "User-agent: PerplexityBot\n";
    $output .= "Allow: /\n";
    $output .= "\n";
    $output .= "Sitemap: " . home_url('/sitemap.xml') . "\n";
    return $output;
});

/* =========================
 * SOCIAL META TAGS (Open Graph & Twitter)
 * ========================= */
add_action('wp_head', function() {
    $title = get_bloginfo('name') . ' | ' . get_bloginfo('description');
    $desc = "Experience exclusive Brazilian Zouk remixes, live shows and premium music experiences by DJ Zen Eyer.";
    $url = home_url('/');
    // Aponta para a raiz onde você subiu a imagem PNG
    $img = home_url('/images/og-image.png'); 

    echo "\n\n";
    
    // Open Graph
    echo '<meta property="og:type" content="website">' . "\n";
    echo '<meta property="og:site_name" content="DJ Zen Eyer">' . "\n";
    echo '<meta property="og:url" content="' . esc_url($url) . '">' . "\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    echo '<meta property="og:description" content="' . esc_attr($desc) . '">' . "\n";
    echo '<meta property="og:image" content="' . esc_url($img) . '">' . "\n";
    echo '<meta property="og:image:width" content="1200">' . "\n";
    echo '<meta property="og:image:height" content="630">' . "\n";
    echo '<meta property="og:locale" content="en_US">' . "\n";

    // Twitter Cards
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:domain" content="djzeneyer.com">' . "\n";
    echo '<meta name="twitter:url" content="' . esc_url($url) . '">' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($desc) . '">' . "\n";
    echo '<meta name="twitter:image" content="' . esc_url($img) . '">' . "\n";
}, 0);

/* =========================
 * SCHEMAS (Global Artist Profile)
 * ========================= */
add_action('wp_head', function() {
    if (!is_front_page()) return;

    $site_url = esc_url(home_url('/'));
    $logo_url = esc_url($site_url . 'images/zen-eyer-logo.png');
    $image_url = esc_url($site_url . 'images/zen-eyer-profile.jpg');

    // 1. MusicGroup + Person (Foco Global)
    $schema_artist = [
        "@context" => "https://schema.org",
        "@type" => ["MusicGroup", "Person"], 
        "name" => "DJ Zen Eyer",
        "alternateName" => ["Zen Eyer", "DJ Zen", "Marcelo Fernandes"],
        "description" => "World-class Brazilian Zouk DJ and music producer based in Brazil, performing globally.",
        "url" => $site_url,
        "logo" => $logo_url,
        "image" => $image_url,
        "genre" => ["Brazilian Zouk", "Electronic Music", "Dance"],
        
        // Dados de Contato e Preço (Para Rich Snippets)
        "telephone" => "+55-21-98741-3091",
        "priceRange" => "$$$",
        
        // Localização Base (Apenas Cidade/País para privacidade e alcance global)
        "location" => [
            "@type" => "Place",
            "address" => [
                "@type" => "PostalAddress",
                "addressLocality" => "Niterói",
                "addressRegion" => "RJ",
                "addressCountry" => "BR"
            ]
        ],

        // Área de Atuação Global
        "areaServed" => [
            ["@type" => "Country", "name" => "Worldwide"],
            ["@type" => "Country", "name" => "Brazil"],
            ["@type" => "Country", "name" => "United States"],
            ["@type" => "Country", "name" => "Europe"]
        ],

        "sameAs" => [
            "https://instagram.com/djzeneyer",
            "https://soundcloud.com/djzeneyer",
            "https://youtube.com/@djzeneyer",
            "https://www.wikidata.org/wiki/Q136551855",
            "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
            "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw"
        ]
    ];
    echo '<script type="application/ld+json">' . json_encode($schema_artist, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";

    // 2. Organization (Para fins comerciais e Knowledge Graph)
    $schema_org = [
        "@context" => "https://schema.org",
        "@type" => "Organization",
        "name" => "DJ Zen Eyer",
        "url" => $site_url,
        "logo" => $logo_url,
        "foundingDate" => "2014",
        "founder" => [
            "@type" => "Person",
            "name" => "Marcelo Fernandes",
            "alternateName" => "DJ Zen Eyer"
        ],
        "contactPoint" => [
            "@type" => "ContactPoint",
            "telephone" => "+55-21-98741-3091",
            "contactType" => "Booking",
            "email" => "booking@djzeneyer.com",
            "availableLanguage" => ["English", "Portuguese"]
        ]
    ];
    echo '<script type="application/ld+json">' . json_encode($schema_org, JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}, 1);

/* =========================
 * SCHEMA (WooCommerce Product)
 * ========================= */
add_action('woocommerce_single_product_summary', function() {
    global $product;
    if (!$product) return;
    
    $schema = [
        "@context" => "https://schema.org",
        "@type" => "Product",
        "name" => $product->get_name(),
        "description" => wp_strip_all_tags($product->get_description()),
        "sku" => $product->get_sku(),
        "image" => wp_get_attachment_url($product->get_image_id()) ?: 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer',
        "offers" => [
            "@type" => "Offer",
            "url" => get_permalink($product->get_id()),
            "priceCurrency" => "BRL",
            "price" => (float) $product->get_price(),
            "availability" => $product->is_in_stock() ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "priceValidUntil" => date('Y-12-31'),
            "seller" => [
                "@type" => "Organization",
                "name" => "DJ Zen Eyer"
            ]
        ]
    ];
    
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES) . '</script>';
}, 5);