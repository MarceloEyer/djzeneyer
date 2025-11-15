<?php
if (!defined('ABSPATH')) exit;

/* =========================
 * 🎯 SEO OTIMIZADO PARA KNOWLEDGE GRAPH DO GOOGLE
 * Versão: 2.0 - Corrigida com ISNI, Wikidata e MusicBrainz
 * ========================= */

/* =========================
 * 1. SITEMAP.XML (Híbrido: React + WP)
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
    
    // Rotas Estáticas do React
    $urls = [
        ['loc' => home_url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        ['loc' => home_url('/events'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => home_url('/shop'), 'priority' => '0.9', 'changefreq' => 'daily'],
        ['loc' => home_url('/zentribe'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => home_url('/music'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ['loc' => home_url('/work-with-me'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => home_url('/faq'), 'priority' => '0.6', 'changefreq' => 'monthly'],
    ];
    
    // Produtos WooCommerce
    if (class_exists('WooCommerce')) {
        $products = wc_get_products(['limit' => -1, 'status' => 'publish']);
        foreach ($products as $product) {
            $urls[] = [
                'loc' => get_permalink($product->get_id()),
                'priority' => '0.8',
                'changefreq' => 'weekly'
            ];
        }
    }
    
    // Posts do Blog
    $posts = get_posts(['numberposts' => -1, 'post_type' => 'post', 'post_status' => 'publish']);
    foreach ($posts as $post) {
        $urls[] = [
            'loc' => get_permalink($post->ID),
            'priority' => '0.7',
            'changefreq' => 'monthly'
        ];
    }
    
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    
    foreach ($urls as $url) {
        echo '<url>';
        echo '<loc>' . esc_url($url['loc']) . '</loc>';
        echo '<priority>' . $url['priority'] . '</priority>';
        echo '<changefreq>' . $url['changefreq'] . '</changefreq>';
        echo '<lastmod>' . date('Y-m-d') . '</lastmod>';
        echo '<xhtml:link rel="alternate" hreflang="en" href="' . esc_url($url['loc']) . '"/>';
        echo '<xhtml:link rel="alternate" hreflang="pt-BR" href="' . esc_url($url['loc'] . '/pt') . '"/>';
        echo '</url>';
    }
    
    echo '</urlset>';
    exit;
});

/* =========================
 * 2. ROBOTS.TXT (Permissivo para Renderização + IA Bots)
 * ========================= */
add_filter('robots_txt', function($output) {
    $sitemap = home_url('/sitemap.xml');
    return "# DJ Zen Eyer - Robots.txt Otimizado para IA e SEO
User-agent: *
Allow: /
Allow: /wp-content/uploads/
Allow: /wp-includes/

# Bloqueios de Segurança
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /xmlrpc.php
Disallow: /wp-content/cache/
Disallow: /trackback/
Disallow: /feed/
Disallow: /comments/

# Bots de IA (PERMITIDO para citações e aprendizado)
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

Sitemap: {$sitemap}";
});

/* =========================
 * 3. META TAGS (Open Graph & Twitter)
 * ========================= */
add_action('wp_head', function() {
    $title = get_bloginfo('name') . ' | ' . get_bloginfo('description');
    $desc = "Two-time world champion Brazilian Zouk DJ and music producer. International performances, award-winning remixes, Zouk authority.";
    $url = home_url('/');
    $img = home_url('/images/og-image.jpg');
    
    $output = '';
    
    // Hreflang
    $output .= '<link rel="alternate" hreflang="en" href="' . esc_url($url) . '" />' . "\n";
    $output .= '<link rel="alternate" hreflang="pt-BR" href="' . esc_url($url . 'pt') . '" />' . "\n";
    $output .= '<link rel="alternate" hreflang="x-default" href="' . esc_url($url) . '" />' . "\n";
    
    // Open Graph
    $output .= '<meta property="og:type" content="music.musician">' . "\n";
    $output .= '<meta property="og:site_name" content="DJ Zen Eyer">' . "\n";
    $output .= '<meta property="og:url" content="' . esc_url($url) . '">' . "\n";
    $output .= '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    $output .= '<meta property="og:description" content="' . esc_attr($desc) . '">' . "\n";
    $output .= '<meta property="og:image" content="' . esc_url($img) . '">' . "\n";
    $output .= '<meta property="og:image:width" content="1200">' . "\n";
    $output .= '<meta property="og:image:height" content="630">' . "\n";
    $output .= '<meta property="og:locale" content="en_US">' . "\n";
    $output .= '<meta property="og:locale:alternate" content="pt_BR">' . "\n";
    
    // Twitter
    $output .= '<meta name="twitter:card" content="summary_large_image">' . "\n";
    $output .= '<meta name="twitter:site" content="@djzeneyer">' . "\n";
    $output .= '<meta name="twitter:creator" content="@djzeneyer">' . "\n";
    $output .= '<meta name="twitter:domain" content="djzeneyer.com">' . "\n";
    $output .= '<meta name="twitter:url" content="' . esc_url($url) . '">' . "\n";
    $output .= '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
    $output .= '<meta name="twitter:description" content="' . esc_attr($desc) . '">' . "\n";
    $output .= '<meta name="twitter:image" content="' . esc_url($img) . '">' . "\n";
    
    echo $output;
}, 1);

/* =========================
 * 4. SCHEMA.ORG - ARTIST + ORGANIZATION (OTIMIZADO PARA KNOWLEDGE GRAPH)
 * 🎯 CORREÇÃO PRINCIPAL: Incluir ISNI, Wikidata e MusicBrainz
 * ========================= */
add_action('wp_head', function() {
    if (!is_front_page()) return;
    
    $site_url = esc_url(home_url('/'));
    $logo_url = esc_url($site_url . 'images/zen-eyer-logo.png');
    $image_url = esc_url($site_url . 'images/zen-eyer-profile.jpg');
    
    // 1. SCHEMA PRINCIPAL: MusicGroup + Person
    $schema_artist = [
        "@context" => "https://schema.org",
        "@type" => ["MusicGroup", "Person"],
        "@id" => $site_url . "#artist",
        "name" => "DJ Zen Eyer",
        "alternateName" => ["Zen Eyer", "DJ Zen", "Marcelo Eyer Fernandes"],
        "legalName" => "Marcelo Eyer Fernandes",
        
        // 🎯 CORREÇÃO: Adicionar ISNI (Critical para Knowledge Graph)
        "identifier" => [
            [
                "@type" => "PropertyValue",
                "propertyID" => "ISNI",
                "value" => "0000000528931015"
            ],
            [
                "@type" => "PropertyValue",
                "propertyID" => "MusicBrainz",
                "value" => "13afa63c-8164-4697-9cad-c5100062a154"
            ],
            [
                "@type" => "PropertyValue",
                "propertyID" => "Wikidata",
                "value" => "Q136551855"
            ]
        ],
        
        "description" => "World-renowned DJ and producer specializing exclusively in Brazilian Zouk. Two-time world champion, performs globally, produces original Zouk music, and teaches masterclasses worldwide.",
        "url" => $site_url,
        "logo" => $logo_url,
        "image" => $image_url,
        
        // 🎯 CORREÇÃO: Lista completa de gêneros do Wikidata/MusicBrainz
        "genre" => [
            "Brazilian Zouk",
            "Kizomba", 
            "Zouk",
            "RnB",
            "Reggaeton",
            "Moombahton",
            "Dancehall",
            "Afrohouse",
            "Afrobeat"
        ],
        
        "telephone" => "+55-21-98741-3091",
        "email" => "booking@djzeneyer.com",
        "priceRange" => "$$$",
        
        "location" => [
            "@type" => "Place",
            "address" => [
                "@type" => "PostalAddress",
                "addressLocality" => "Niterói",
                "addressRegion" => "RJ",
                "addressCountry" => "BR"
            ]
        ],
        
        "areaServed" => [
            ["@type" => "Country", "name" => "Worldwide"],
            ["@type" => "Country", "name" => "Brazil"],
            ["@type" => "Country", "name" => "United States"],
            ["@type" => "Country", "name" => "Europe"]
        ],
        
        // 🎯 CORREÇÃO: Lista completa com Wikidata e MusicBrainz
        "sameAs" => [
            // Perfis Autoritativos (CRÍTICO)
            "https://www.wikidata.org/wiki/Q136551855",
            "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
            "https://isni.org/isni/0000000528931015",
            
            // Redes Sociais
            "https://instagram.com/djzeneyer",
            "https://facebook.com/djzeneyer",
            "https://youtube.com/@djzeneyer",
            "https://www.tiktok.com/@djzeneyer",
            "https://x.com/djzeneyer",
            "https://www.linkedin.com/in/eyermarcelo",
            "https://br.pinterest.com/djzeneyer/",
            "https://t.me/djzeneyer",
            
            // Música
            "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
            "https://music.apple.com/us/artist/zen-eyer/1439280950",
            "https://www.deezer.com/br/artist/72153362",
            "https://soundcloud.com/djzeneyer",
            "https://djzeneyer.bandcamp.com/",
            "https://www.mixcloud.com/djzeneyer/",
            "https://hearthis.at/djzeneyer/",
            "https://www.last.fm/music/Zen+Eyer",
            
            // Plataformas DJ
            "https://ra.co/dj/djzeneyer",
            "https://www.gigmit.com/djzeneyer",
            "https://www.reverbnation.com/zeneyer",
            
            // Eventos
            "https://www.bandsintown.com/a/15552355-dj-zen-eyer",
            "https://artists.bandsintown.com/artists/15619775",
            "https://www.songkick.com/artists/8815204-zen-eyer",
            
            // Outros
            "https://www.discogs.com/artist/16872046-Zen-Eyer",
            "https://www.crunchbase.com/organization/zen-eyer"
        ]
    ];
    
    echo '<script type="application/ld+json">' . wp_json_encode($schema_artist, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
    
    // 2. SCHEMA: Organization (Dados Legais - CNPJ)
    $schema_org = [
        "@context" => "https://schema.org",
        "@type" => "Organization",
        "@id" => $site_url . "#organization",
        "name" => "Zen Eyer",
        "legalName" => "Marcelo Eyer Fernandes",
        "alternateName" => "DJ Zen Eyer",
        "taxID" => "44063765000146",
        "url" => $site_url,
        "logo" => $logo_url,
        "foundingDate" => "2021-10-28",
        
        "identifier" => [
            "@type" => "PropertyValue",
            "name" => "CNPJ",
            "value" => "44.063.765/0001-46"
        ],
        
        "founder" => [
            "@type" => "Person",
            "name" => "Marcelo Eyer Fernandes",
            "alternateName" => "Zen Eyer"
        ],
        
        "contactPoint" => [
            "@type" => "ContactPoint",
            "telephone" => "+55-21-98741-3091",
            "contactType" => "Booking",
            "email" => "booking@djzeneyer.com",
            "availableLanguage" => ["English", "Portuguese"]
        ]
    ];
    
    echo '<script type="application/ld+json">' . wp_json_encode($schema_org, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
    
}, 2);

/* =========================
 * 5. SCHEMA PARA PRODUTOS WOOCOMMERCE
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
                "name" => "Zen Eyer"
            ]
        ]
    ];
    
    echo '<script type="application/ld+json">' . wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
}, 5);