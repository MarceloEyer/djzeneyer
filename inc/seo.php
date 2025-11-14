<?php
if (!defined('ABSPATH')) exit;

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

// Desativa sitemaps nativos do WP (para não conflitar)
add_filter('wp_sitemaps_enabled', '__return_false');

add_action('template_redirect', function() {
    if (get_query_var('djz_sitemap') != 1) return;
    
    header('Content-Type: application/xml; charset=utf-8');
    
    // 1. Rotas Estáticas do React (Adicione aqui se criar novas páginas no Frontend)
    $urls = [
        ['loc' => home_url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        ['loc' => home_url('/events'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => home_url('/shop'), 'priority' => '0.9', 'changefreq' => 'daily'],
        ['loc' => home_url('/zentribe'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => home_url('/music'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ['loc' => home_url('/work-with-me'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => home_url('/faq'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['loc' => home_url('/minha-conta'), 'priority' => '0.5', 'changefreq' => 'yearly'], // Login
    ];
    
    // 2. Conteúdo Dinâmico do WordPress (Produtos WooCommerce)
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

    // 3. Posts do Blog (Se houver)
    $posts = get_posts(['numberposts' => -1, 'post_type' => 'post', 'post_status' => 'publish']);
    foreach ($posts as $post) {
        $urls[] = [
            'loc' => get_permalink($post->ID),
            'priority' => '0.7',
            'changefreq' => 'monthly'
        ];
    }
    
    // Gera o XML
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    
    foreach ($urls as $url) {
        echo '<url>';
        echo '<loc>' . esc_url($url['loc']) . '</loc>';
        echo '<priority>' . $url['priority'] . '</priority>';
        echo '<changefreq>' . $url['changefreq'] . '</changefreq>';
        echo '<lastmod>' . date('Y-m-d') . '</lastmod>';
        // Hreflang Básico (Assumindo estrutura /pt no frontend)
        echo '<xhtml:link rel="alternate" hreflang="en" href="' . esc_url($url['loc']) . '"/>';
        echo '<xhtml:link rel="alternate" hreflang="pt-BR" href="' . esc_url($url['loc'] . 'pt') . '"/>';
        echo '</url>';
    }
    
    echo '</urlset>';
    exit;
});

/* =========================
 * 2. ROBOTS.TXT (Permissivo para Renderização)
 * ========================= */
add_filter('robots_txt', function($output) {
    $sitemap = home_url('/sitemap.xml');
    
    return "# DJ Zen Eyer - Robots.txt Otimizado
User-agent: *
Allow: /
# Libera recursos para o Google renderizar o site corretamente
Allow: /wp-content/uploads/
Allow: /wp-content/themes/
Allow: /wp-content/plugins/
Allow: /wp-includes/js/
Allow: /wp-includes/css/
Allow: /wp-includes/images/

# Bloqueia áreas sensíveis
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /xmlrpc.php
Disallow: /wp-content/cache/
Disallow: /trackback/
Disallow: /feed/
Disallow: /comments/

# Bots de IA (Permitido para citações)
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

Sitemap: {$sitemap}";
});

/* =========================
 * 3. SOCIAL META TAGS (Open Graph & Twitter)
 * ========================= */
add_action('wp_head', function() {
    $title = get_bloginfo('name') . ' | ' . get_bloginfo('description');
    $desc = "Experience exclusive Brazilian Zouk remixes, live shows and premium music experiences by DJ Zen Eyer.";
    $url = home_url('/');
    // URL da imagem na raiz (upload manual)
    $img = home_url('/images/og-image.png'); 

    echo "\n\n";
    
    // HREFLANG (SEO Internacional)
    echo '<link rel="alternate" hreflang="en" href="' . esc_url($url) . '" />' . "\n";
    echo '<link rel="alternate" hreflang="pt-BR" href="' . esc_url($url . 'pt') . '" />' . "\n";
    echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($url) . '" />' . "\n";

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
    echo '<meta property="og:locale:alternate" content="pt_BR">' . "\n";

    // Twitter
    echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
    echo '<meta name="twitter:domain" content="djzeneyer.com">' . "\n";
    echo '<meta name="twitter:url" content="' . esc_url($url) . '">' . "\n";
    echo '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
    echo '<meta name="twitter:description" content="' . esc_attr($desc) . '">' . "\n";
    echo '<meta name="twitter:image" content="' . esc_url($img) . '">' . "\n";
}, 0);

/* =========================
 * 4. SCHEMAS (Artist & Organization)
 * ========================= */
add_action('wp_head', function() {
    if (!is_front_page()) return;

    $site_url = esc_url(home_url('/'));
    $logo_url = esc_url($site_url . 'images/zen-eyer-logo.png');
    $image_url = esc_url($site_url . 'images/zen-eyer-profile.jpg');

	// --- INÍCIO DAS ALTERAÇÕES ---

    $schema_artist = [
        "@context" => "https://schema.org",
        "@type" => ["MusicGroup", "Person"], // Correto para um artista solo (Pessoa e Marca)
        "name" => "DJ Zen Eyer",
        "alternateName" => ["Zen Eyer", "DJ Zen", "Marcelo Eyer Fernandes"],
        "description" => "World-class Brazilian Zouk DJ and music producer based in Brazil, performing globally.",
        "url" => $site_url,
        "logo" => $logo_url,
        "image" => $image_url,
        "genre" => ["Brazilian Zouk", "RnB", "Kizomba"],
        "telephone" => "+55-21-98741-3091",
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
		"sameAs" => [
			"https://instagram.com/djzeneyer",
			"https://youtube.com/@djzeneyer",
			"https://www.tiktok.com/@djzeneyer",
			"https://facebook.com/djzeneyer",
			"https://x.com/djzeneyer",
			"https://www.linkedin.com/in/eyermarcelo",
			"https://br.pinterest.com/djzeneyer/", // ATUALIZADO: Link do Pinterest
			"https://t.me/djzeneyer",
			"https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw", // Mantido o link que você confirmou
			"https://music.apple.com/us/artist/zen-eyer/1439280950",
			"https://www.deezer.com/br/artist/72153362",
			"https://djzeneyer.bandcamp.com/",
			"https://soundcloud.com/djzeneyer",
			"https://www.mixcloud.com/djzeneyer/",
			"https://hearthis.at/djzeneyer/",
			"https://www.last.fm/music/Zen+Eyer",
			"https://ra.co/dj/djzeneyer",
			"https://www.gigmit.com/djzeneyer",
			"https://www.bandsintown.com/a/15552355-dj-zen-eyer",
			"https://www.songkick.com/artists/8815204-zen-eyer",
			"https://www.wikidata.org/wiki/Q136551855",
			"https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
			"https://www.discogs.com/artist/Zen-Eyer",
			"https://www.crunchbase.com/organization/zen-eyer",
			"https://www.reverbnation.com/zeneyer"
		]
    ];
    echo '<script type="application/ld+json">' . json_encode($schema_artist, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";

    $schema_org = [
        "@context" => "https://schema.org",
        "@type" => "Organization",
		"name" => "Zen Eyer", // ATUALIZADO: Razão Social
		"legalName" => "Marcelo Eyer Fernandes", // ATUALIZADO: Nome Legal
		"alternateName" => "DJ Zen Eyer", // ATUALIZADO: Nome Fantasia
        "url" => $site_url,
        "logo" => $logo_url,
		"foundingDate" => "2021-10-28", // ATUALIZADO: Data de fundação do CNPJ
		"identifier" => [ // ATUALIZADO: Adição do CNPJ
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
	// --- FIM DAS ALTERAÇÕES ---

    echo '<script type="application/ld+json">' . json_encode($schema_org, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
}, 1);

/* =========================
 * 5. SCHEMA (WooCommerce Product)
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
                "name" => "Zen Eyer" // Isso está correto, pois o vendedor é a "marca"
            ]
        ]
    ];
    
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>';
}, 5);