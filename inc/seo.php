<?php
if (!defined('ABSPATH')) exit;

/* =========================
 * 🎯 SEO OTIMIZADO PARA KNOWLEDGE GRAPH DO GOOGLE
 * Versão: 4.0 - CORRIGIDO SITEMAP (Inclusão de Rotas Estáticas)
 * ========================= */

/* =========================
 * 1. SITEMAP.XML (Híbrido: React + WP) - CORRIGIDO
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
    
    // Rotas Estáticas do React (COMPLETAS)
    $urls = [
        ['loc' => home_url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        // Rotas principais corrigidas (incluídas todas as páginas refatoradas)
        ['loc' => home_url('/about'), 'priority' => '0.9', 'changefreq' => 'monthly'],
        ['loc' => home_url('/events'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => home_url('/music'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ['loc' => home_url('/faq'), 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['loc' => home_url('/zentribe'), 'priority' => '0.7', 'changefreq' => 'monthly'],
        ['loc' => home_url('/press-kit'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        
        // Rotas de utilidade/e-commerce
        ['loc' => home_url('/shop'), 'priority' => '0.5', 'changefreq' => 'daily'],
        ['loc' => home_url('/work-with-me'), 'priority' => '0.5', 'changefreq' => 'monthly'],
        ['loc' => home_url('/cart'), 'priority' => '0.3', 'changefreq' => 'weekly'],
        ['loc' => home_url('/checkout'), 'priority' => '0.3', 'changefreq' => 'weekly'],
        ['loc' => home_url('/my-account'), 'priority' => '0.3', 'changefreq' => 'weekly'],
        ['loc' => home_url('/dashboard'), 'priority' => '0.3', 'changefreq' => 'weekly'],
        ['loc' => home_url('/privacy-policy'), 'priority' => '0.1', 'changefreq' => 'monthly'],
        ['loc' => home_url('/return-policy'), 'priority' => '0.1', 'changefreq' => 'monthly'],
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
 * 2. ROBOTS.TXT (Permissivo para Renderização + IA Bots) - MANTIDO
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
 * 3. META TAGS (Open Graph & Twitter) - REMOVIDO
 * A lógica para estas tags é movida integralmente para o React Helmet.
 * ========================= */
// A seção 3 foi removida.

/* =========================
 * 4. SCHEMA.ORG - ARTIST + ORGANIZATION (OTIMIZADO PARA KNOWLEDGE GRAPH) - REMOVIDO
 * Este Schema é agora injetado via React Helmet, garantindo o controle do Frontend.
 * ========================= */
// A seção 4 foi removida.

/* =========================
 * 5. SCHEMA PARA PRODUTOS WOOCOMMERCE - MANTIDO
 * Isso garante que produtos ainda renderizados pelo WP ou em fluxo híbrido tenham Schema.
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
}});