<?php
if (!defined('ABSPATH')) exit;

/* ============================================================================
 * SEO TÉCNICO PARA HEADLESS WORDPRESS
 * Responsável por: Sitemap, Robots.txt e Schema de Produto Dinâmico
 * Nota: O Schema de Artista/Marca agora é gerado pelo React (artistData.ts)
 * ============================================================================ */

/* =========================
 * 1. SITEMAP.XML (Híbrido: Rotas React + Produtos WP)
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
    
    // 1. Rotas Estáticas do React (Adicione novas páginas aqui)
    $urls = [
        ['loc' => home_url('/'), 'priority' => '1.0', 'changefreq' => 'daily'],
        ['loc' => home_url('/events'), 'priority' => '0.9', 'changefreq' => 'weekly'],
        ['loc' => home_url('/shop'), 'priority' => '0.9', 'changefreq' => 'daily'],
        ['loc' => home_url('/zentribe'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => home_url('/music'), 'priority' => '0.8', 'changefreq' => 'weekly'],
        ['loc' => home_url('/work-with-me'), 'priority' => '0.8', 'changefreq' => 'monthly'],
        ['loc' => home_url('/faq'), 'priority' => '0.6', 'changefreq' => 'monthly'],
        ['loc' => home_url('/minha-conta'), 'priority' => '0.5', 'changefreq' => 'yearly'],
        ['loc' => home_url('/cart'), 'priority' => '0.3', 'changefreq' => 'weekly'],
        ['loc' => home_url('/checkout'), 'priority' => '0.3', 'changefreq' => 'weekly'],
    ];
    
    // 2. Produtos do WooCommerce
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
    
    echo '<?xml version="1.0" encoding="UTF-8"?>';
    echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">';
    
    $home = home_url(); // ex: https://djzeneyer.com
    
    foreach ($urls as $url) {
        $loc = esc_url($url['loc']);
        
        // Gera a URL em Português inserindo /pt logo após o domínio
        // Ex: https://djzeneyer.com/events -> https://djzeneyer.com/pt/events
        if ($loc === $home || $loc === $home . '/') {
             $loc_pt = home_url('/pt/');
        } else {
             $loc_pt = str_replace($home, $home . '/pt', $loc);
        }

        echo '<url>';
        echo '<loc>' . $loc . '</loc>';
        echo '<priority>' . $url['priority'] . '</priority>';
        echo '<changefreq>' . $url['changefreq'] . '</changefreq>';
        echo '<lastmod>' . date('Y-m-d') . '</lastmod>';
        
        // Hreflang para SEO Internacional
        echo '<xhtml:link rel="alternate" hreflang="en" href="' . $loc . '"/>';
        echo '<xhtml:link rel="alternate" hreflang="pt-BR" href="' . esc_url($loc_pt) . '"/>';
        echo '<xhtml:link rel="alternate" hreflang="x-default" href="' . $loc . '"/>';
        
        echo '</url>';
    }
    
    echo '</urlset>';
    exit;
});

/* =========================
 * 2. ROBOTS.TXT (Otimizado para Google & AI)
 * ========================= */
add_filter('robots_txt', function($output) {
    $sitemap = home_url('/sitemap.xml');
    
    return "# DJ Zen Eyer - Robots.txt
User-agent: *
Allow: /
# Recursos essenciais para renderização
Allow: /wp-content/uploads/
Allow: /wp-content/themes/
Allow: /wp-content/plugins/
Allow: /wp-includes/js/
Allow: /wp-includes/css/
Allow: /wp-includes/images/

# Bloqueios de Segurança
Disallow: /wp-admin/
Disallow: /wp-login.php
Disallow: /xmlrpc.php
Disallow: /wp-content/cache/
Disallow: /trackback/
Disallow: /feed/
Disallow: /comments/

# Bots de IA (Bem-vindos para indexação)
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
 * 3. SCHEMA DE PRODUTO (WooCommerce)
 * Mantido no PHP pois depende do banco de dados do WP
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