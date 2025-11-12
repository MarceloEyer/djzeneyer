<?php
/**
 * DJ Zen Eyer Theme Functions - Versão 12.0.2
 *
 * Otimizado para Vite, IA Bots, Google, Performance e SPA (Single Page Application).
 *
 * Este arquivo gerencia todas as funcionalidades do tema, incluindo:
 * - Carregamento de scripts e estilos (Vite)
 * - Roteamento de Single Page Application (SPA)
 * - Otimizações de SEO (Schemas, Sitemap, Robots.txt)
 * - Endpoints da API REST (Menu, Produtos, GamiPress, Auth)
 * - Configurações de segurança e CORS.
 */

if (!defined('ABSPATH')) exit; // Previne acesso direto

/* =========================
 * CONSTANTES E CONFIGURAÇÕES
 * ========================= */

if (!defined('DJZ_VERSION')) {
    /**
     * Versão do tema, usada como fallback.
     * Os assets do Vite usam seus próprios hashes.
     */
    define('DJZ_VERSION', '12.0.2');
}

/**
 * Retorna a lista de origens permitidas para CORS (Cross-Origin Resource Sharing).
 * Essencial para que o app React (ex: localhost:5173) possa se comunicar com a API do WordPress.
 *
 * @return array Lista de URLs permitidas.
 */
function djz_allowed_origins(): array {
    return [
        'https://djzeneyer.com',
        'https://www.djzeneyer.com',
        'https://app.djzeneyer.com',
        'http://localhost:5173',     // Servidor de desenvolvimento Vite
        'http://127.0.0.1:5173'    // Servidor de desenvolvimento Vite
    ];
}

/* =========================
 * ROTEAMENTO SPA
 * ========================= */

/**
 * Redireciona todas as requisições 404 da query principal para o index.php.
 * Isso permite que o React Router (no frontend) assuma o controle do roteamento.
 *
 * @param string $template O template que o WordPress iria carregar.
 * @return string O caminho para o index.php do tema se for uma 404 da SPA.
 */
add_filter('template_include', function ($template) {
    // Não interfere com admin, REST API, queries secundárias
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || !is_main_query() || !is_404()) {
        return $template;
    }
    
    // Define o status como 200 OK para que o React trate a rota
    status_header(200);
    return get_theme_file_path('/index.php');
});

/* =========================
 * CARREGAMENTO DE ASSETS (VITE)
 * ========================= */

/**
 * Carrega e armazena o manifesto do Vite (gerado no build).
 * O manifesto mapeia os arquivos de entrada para seus arquivos de saída com hash.
 *
 * @return array O manifesto decodificado ou um array vazio se não encontrado.
 */
function djz_get_manifest(): array {
    static $manifest = null;
    if ($manifest !== null) {
        return $manifest;
    }
    
    // ✅ CORRIGIDO: Vite gera o manifesto em /dist/.vite/manifest.json
    $manifest_path = get_theme_file_path('/dist/.vite/manifest.json');
    
    if (file_exists($manifest_path)) {
        $manifest = json_decode(file_get_contents($manifest_path), true);
    } else {
        error_log('⚠️ DJZ Theme: Manifesto Vite não encontrado em ' . $manifest_path . '. Verifique o processo de build.');
        $manifest = [];
    }
    
    return $manifest;
}

/**
 * Enfileira os scripts e estilos principais gerados pelo Vite.
 * Usa o manifesto para encontrar os arquivos corretos (com hash).
 */
add_action('wp_enqueue_scripts', function () {
    $manifest = djz_get_manifest();
    
    if (empty($manifest)) {
        error_log('❌ DJZ Theme: Manifesto Vite vazio! Build pode ter falhado.');
        return;
    }
    
    // ✅ Vite usa 'src/main.tsx' (ou similar) como entrada
    $entry_key = 'src/main.tsx'; // Ajuste se a entrada do seu vite.config.js for outra
    
    if (!isset($manifest[$entry_key])) {
        error_log('❌ DJZ Theme: Entry "' . $entry_key . '" não encontrada no manifest!');
        return;
    }
    
    $entry = $manifest[$entry_key];

    // ✅ Carregar CSS principal
    if (isset($entry['css']) && is_array($entry['css'])) {
        foreach ($entry['css'] as $index => $css_file) {
            wp_enqueue_style(
                'djzeneyer-react-styles-' . $index,
                get_template_directory_uri() . '/dist/' . $css_file,
                [],
                null // Versão é nula, pois o hash já está no nome do arquivo
            );
        }
    }
    
    // ✅ Carregar JS principal
    wp_enqueue_script(
        'djzeneyer-react',
        get_template_directory_uri() . '/dist/' . $entry['file'],
        [],
        null, // Versão é nula, pois o hash já está no nome do arquivo
        true  // Carregar no footer
    );
    
    // ✅ Enviar dados do WordPress para o React (disponível no objeto window.wpData)
    wp_localize_script('djzeneyer-react', 'wpData', [
        'siteUrl' => esc_url(home_url('/')),
        'restUrl' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest'),
        'themeUrl' => get_template_directory_uri(),
        'allowedOrigins' => djz_allowed_origins(),
        'isUserLoggedIn' => is_user_logged_in(),
        'currentUser' => is_user_logged_in() ? [
            'id' => get_current_user_id(),
            'name' => wp_get_current_user()->display_name,
            'email' => wp_get_current_user()->user_email,
        ] : null,
    ]);
});

/**
 * Adiciona os atributos type="module" e crossorigin ao script principal.
 * Isso é essencial para que os módulos JavaScript do Vite funcionem.
 */
add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ('djzeneyer-react' === $handle) {
        // Adiciona type="module" (essencial para Vite)
        // Adiciona crossorigin="use-credentials" (para lidar com auth/CORS)
        // Adiciona defer (para carregar após o HTML)
        return sprintf(
            '<script type="module" src="%s" id="%s" crossorigin="use-credentials" defer></script>',
            esc_url($src),
            esc_attr($handle . '-js')
        );
    }
    return $tag;
}, 10, 3);

/* =========================
 * SUPORTE AO TEMA
 * ========================= */

/**
 * Ativa funcionalidades básicas do WordPress.
 */
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');          // Deixa o WordPress gerenciar o <title>
    add_theme_support('post-thumbnails');    // Ativa imagens destacadas
    add_theme_support('woocommerce');        // Ativa suporte ao WooCommerce
    add_theme_support('html5', [             // Ativa HTML5 semântico
        'search-form', 
        'comment-form', 
        'comment-list', 
        'gallery', 
        'caption'
    ]);
    register_nav_menus([                     // Registra o local do menu
        'primary_menu' => __('Menu Principal', 'djzeneyer')
    ]);
});

/* =========================
 * 🎯 SEO ULTIMATE - SCHEMAS
 * ========================= */

/**
 * ✅ 1. Adiciona o Schema LocalBusiness + MusicGroup no <head> da front-page.
 */
add_action('wp_head', function() {
    if (!is_front_page()) return;

    $site_url = esc_url(home_url('/'));
    $logo_url = esc_url($site_url . 'images/zen-eyer-logo.png');
    $image_url = esc_url($site_url . 'images/zen-eyer-profile.jpg');

    $schema = [
        "@context" => "https://schema.org",
        "@type" => ["MusicGroup", "LocalBusiness"],
        "name" => "DJ Zen Eyer",
        "alternateName" => ["Zen Eyer", "DJ Zen", "Marcelo Fernandes"],
        "description" => "Two-time world champion Brazilian Zouk DJ and music producer based in Niterói, Brazil. Specializing in Brazilian Zouk music with 100+ international performances across 11 countries.",
        "url" => $site_url,
        "logo" => $logo_url,
        "image" => $image_url,
        
        "address" => [
            "@type" => "PostalAddress",
            "addressLocality" => "Niterói",
            "addressRegion" => "RJ",
            "addressCountry" => "BR"
        ],
        "geo" => [
            "@type" => "GeoCoordinates",
            "latitude" => "-22.8833",
            "longitude" => "-43.1036"
        ],
        "areaServed" => [
            ["@type" => "Country", "name" => "Brazil"],
            ["@type" => "Country", "name" => "Netherlands"],
            ["@type" => "Country", "name" => "United States"],
            ["@type" => "Country", "name" => "Australia"],
            ["@type" => "Country", "name" => "Czech Republic"],
            ["@type" => "Country", "name" => "Germany"],
            ["@type" => "Country", "name" => "Spain"]
        ],
        
        "award" => [
            "World Champion Brazilian Zouk DJ 2022 - Best Performance",
            "World Champion Brazilian Zouk DJ 2022 - Best Remix"
        ],
        
        "contactPoint" => [
            "@type" => "ContactPoint",
            "telephone" => "+55-21-98741-3091",
            "contactType" => "Booking",
            "email" => "booking@djzeneyer.com",
            "availableLanguage" => ["Portuguese", "English"]
        ],
        
        "genre" => ["Brazilian Zouk", "Electronic Music", "Dance Music"],
        
        "sameAs" => [
            "https://instagram.com/djzeneyer",
            "https://soundcloud.com/djzeneyer",
            "https://youtube.com/@djzeneyer",
            "https://www.wikidata.org/wiki/Q136551855",
            "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
            "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw"
        ],
        
        "interactionStatistic" => [
            [
                "@type" => "InteractionCounter",
                "interactionType" => "https://schema.org/ListenAction",
                "userInteractionCount" => 500000
            ]
        ]
    ];
    
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
}, 1);

/**
 * ✅ 2. Adiciona o Schema Organization no <head> da front-page.
 */
add_action('wp_head', function() {
    if (!is_front_page()) return;

    $site_url = esc_url(home_url('/'));
    $logo_url = esc_url($site_url . 'images/zen-eyer-logo.png');

    $schema = [
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
            "email" => "booking@djzeneyer.com"
        ]
    ];
    
    echo '<script type="application/ld+json">' . json_encode($schema, JSON_UNESCAPED_SLASHES) . '</script>' . "\n";
}, 2);

/* =========================
 * 🎯 WOOCOMMERCE PRODUCT SCHEMA
 * ========================= */

/**
 * Adiciona o Schema de Produto JSON-LD nas páginas de produto do WooCommerce.
 */
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

/* =========================
 * 🎯 SITEMAP.XML AUTOMÁTICO
 * ========================= */

/**
 * Registra a regra de reescrita para o sitemap.xml customizado.
 */
add_action('init', function() {
    add_rewrite_rule('^sitemap\.xml$', 'index.php?djz_sitemap=1', 'top');
});

/**
 * Adiciona a variável 'djz_sitemap' às query vars permitidas.
 */
add_filter('query_vars', function($vars) {
    $vars[] = 'djz_sitemap';
    return $vars;
});

/**
 * Gera o conteúdo do sitemap.xml quando a query var 'djz_sitemap' está presente.
 */
add_action('template_redirect', function() {
    if (get_query_var('djz_sitemap') != 1) return;
    
    header('Content-Type: application/xml; charset=utf-8');
    
    // URLs estáticas (SPA)
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
    
    // Adiciona produtos do WooCommerce
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
 * 🎯 ROBOTS.TXT OTIMIZADO
 * ========================= */

/**
 * Modifica o conteúdo do robots.txt virtual.
 * Otimizado para Bots de IA e SEO.
 */
add_filter('robots_txt', function($output) {
    $output = "# DJ Zen Eyer - Optimized for AI Bots\n";
    $output .= "User-agent: *\n";
    $output .= "Allow: /\n";
    $output .= "Allow: /wp-content/uploads/\n";
    $output .= "Allow: /wp-content/themes/zentheme/dist/\n"; // Permite assets
    $output .= "\n";
    $output .= "Disallow: /wp-admin/\n";
    $output .= "Disallow: /wp-includes/\n";
    $output .= "Disallow: /wp-json/\n"; // Bloqueia listagem de /wp-json/, mas endpoints específicos funcionam
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
 * SEGURANÇA & CORS
 * ========================= */

/**
 * Adiciona headers de segurança em todas as requisições do frontend.
 */
add_action('send_headers', function() {
    if (is_admin() || headers_sent()) return;
    
    header_remove('X-Powered-By'); // Remove versão do PHP
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY'); // Previne clickjacking
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (is_ssl()) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    }
});

/**
 * Configura os headers CORS para a API REST.
 * Permite que o app React se comunique com a API.
 */
add_action('rest_api_init', function() {
    add_filter('rest_pre_serve_request', function($served) {
        $allowed_origins = djz_allowed_origins();
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim($_SERVER['HTTP_ORIGIN']) : '';
        
        if (in_array($origin, $allowed_origins, true)) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
            header('Access-Control-Allow-Credentials: true');
            header('Vary: Origin', false);
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, X-Client-Info, Apikey, X-Requested-With');
        
        // Trata requisições OPTIONS (pre-flight)
        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            status_header(200);
            exit;
        }
        
        return $served;
    }, 15);
});

/* =========================
 * HELPER: GamiPress Requirements
 * ========================= */

/**
 * Função helper para formatar os requisitos do GamiPress para a API.
 *
 * @param int $post_id ID do post (conquista, rank, etc.).
 * @return array Lista formatada de requisitos.
 */
function djz_format_requirements($post_id) {
    if (!function_exists('gamipress_get_post_requirements')) {
        return [];
    }
    
    $requirements = gamipress_get_post_requirements($post_id);
    $formatted = [];
    
    if (is_array($requirements)) {
        foreach ($requirements as $req) {
            $formatted[] = [
                'id' => $req->ID ?? 0,
                'title' => $req->post_title ?? '',
                'type' => get_post_meta($req->ID, '_gamipress_trigger_type', true),
                'count' => (int) get_post_meta($req->ID, '_gamipress_count', true),
            ];
        }
    }
    
    return $formatted;
}

/* =========================
 * ENDPOINT: GamiPress
 * ========================= */

/**
 * Handler da API REST para buscar dados do GamiPress de um usuário.
 *
 * @param WP_REST_Request $request A requisição da API.
 * @return WP_REST_Response|WP_Error
 */
function djz_get_gamipress_handler($request) {
    $user_id = intval($request->get_param('user_id'));
    
    if ($user_id <= 0) {
        return new WP_Error('invalid_user_id', 'Invalid user ID', ['status' => 400]);
    }
    
    // Verifica se o GamiPress está ativo
    if (!function_exists('gamipress_get_user_points')) {
        return rest_ensure_response([
            'success' => false,
            'message' => 'GamiPress not active',
            'data' => [
                'points' => 0,
                'rank' => 'Novice',
                'achievements' => [],
                'allRanks' => [],
                'allAchievements' => [],
            ],
        ]);
    }
    
    // Buscar Pontos
    $points_types = gamipress_get_points_types();
    $user_points = [];
    $total_points = 0;
    
    foreach ($points_types as $slug => $data) {
        $points = (int) gamipress_get_user_points($user_id, $slug);
        $user_points[] = [
            'slug' => $slug,
            'name' => $data['plural_name'],
            'singular' => $data['singular_name'],
            'points' => $points,
        ];
        $total_points += $points;
    }
    
    // Buscar Ranks
    $rank_types = gamipress_get_rank_types();
    $current_rank = 'Novice';
    $rank_id = 0;
    $rank_type_slug = '';
    
    foreach ($rank_types as $slug => $data) {
        $user_rank = gamipress_get_user_rank($user_id, $slug);
        if ($user_rank && is_object($user_rank)) {
            $rank_id = $user_rank->ID;
            $current_rank = $user_rank->post_title;
            $rank_type_slug = $slug;
            break;
        }
    }
    
    // Buscar Todos os Ranks
    $all_ranks = [];
    if (!empty($rank_type_slug)) {
        $ranks_query = new WP_Query([
            'post_type' => $rank_type_slug,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);
        
        if ($ranks_query->have_posts()) {
            while ($ranks_query->have_posts()) {
                $ranks_query->the_post();
                $r_id = get_the_ID();
                $all_ranks[] = [
                    'id' => $r_id,
                    'title' => get_the_title(),
                    'description' => get_the_content(),
                    'excerpt' => get_the_excerpt(),
                    'image' => get_the_post_thumbnail_url($r_id, 'medium') ?: '',
                    'current' => ($r_id === $rank_id),
                    'requirements' => djz_format_requirements($r_id),
                ];
            }
            wp_reset_postdata();
        }
    }
    
    // Buscar Conquistas Ganhadas
    $achievement_types = gamipress_get_achievement_types();
    $earned_achievements = [];
    
    foreach ($achievement_types as $type_slug => $type_data) {
        $user_achievements = gamipress_get_user_achievements([
            'user_id' => $user_id,
            'achievement_type' => $type_slug,
        ]);
        
        if (is_array($user_achievements)) {
            foreach ($user_achievements as $ach) {
                if (isset($ach->ID)) {
                    $earned_achievements[] = [
                        'id' => $ach->ID,
                        'type' => $type_slug,
                        'title' => $ach->post_title ?? '',
                        'description' => $ach->post_content ?? '',
                        'excerpt' => $ach->post_excerpt ?? '',
                        'image' => get_the_post_thumbnail_url($ach->ID, 'medium') ?: '',
                        'earned' => true,
                        'earnedDate' => get_post_time('Y-m-d H:i:s', false, $ach->ID),
                        'points' => (int) get_post_meta($ach->ID, '_gamipress_points', true),
                    ];
                }
            }
        }
    }
    
    // Buscar Todas as Conquistas
    $all_achievements = [];
    foreach ($achievement_types as $type_slug => $type_data) {
        $achievements_query = new WP_Query([
            'post_type' => $type_slug,
            'posts_per_page' => -1,
            'post_status' => 'publish',
            'orderby' => 'menu_order',
            'order' => 'ASC',
        ]);
        
        if ($achievements_query->have_posts()) {
            while ($achievements_query->have_posts()) {
                $achievements_query->the_post();
                $a_id = get_the_ID();
                $earned = gamipress_has_user_earned_achievement($a_id, $user_id);
                $all_achievements[] = [
                    'id' => $a_id,
                    'type' => $type_slug,
                    'typeName' => $type_data['singular_name'],
                    'title' => get_the_title(),
                    'description' => get_the_content(),
                    'excerpt' => get_the_excerpt(),
                    'image' => get_the_post_thumbnail_url($a_id, 'medium') ?: '',
                    'earned' => $earned,
                    'earnedDate' => $earned ? get_post_time('Y-m-d H:i:s', false, $a_id) : null,
                    'points' => (int) get_post_meta($a_id, '_gamipress_points', true),
                    'requirements' => djz_format_requirements($a_id),
                ];
            }
            wp_reset_postdata();
        }
    }
    
    // Calcular Nível (baseado no índice do rank atual)
    $level = 1;
    foreach ($all_ranks as $index => $rank) {
        if ($rank['current']) {
            $level = $index + 1;
            break;
        }
    }
    
    // Resposta final
    return rest_ensure_response([
        'success' => true,
        'data' => [
            'points' => $total_points,
            'pointsBreakdown' => $user_points,
            'level' => $level,
            'rank' => $current_rank,
            'rankId' => $rank_id,
            'earnedAchievements' => $earned_achievements,
            'allRanks' => $all_ranks,
            'allAchievements' => $all_achievements,
            'stats' => [
                'totalAchievements' => count($all_achievements),
                'earnedAchievements' => count($earned_achievements),
                'totalRanks' => count($all_ranks),
                'currentRankIndex' => $level - 1,
            ],
        ],
    ]);
}

/* =========================
 * OUTROS ENDPOINTS (Menu, Produtos, Auth)
 * ========================= */

/**
 * Handler da API REST para buscar o menu primário (suporta Polylang).
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function djz_get_multilang_menu_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? 'en');
    
    // Define o idioma da requisição se Polylang estiver ativo
    if (function_exists('pll_set_language')) {
        pll_set_language($lang);
    }
    
    $locations = get_nav_menu_locations();
    $menu_id = $locations['primary_menu'] ?? null;
    
    if (!$menu_id) return rest_ensure_response([]);
    
    $items = wp_get_nav_menu_items($menu_id);
    if (!is_array($items)) return rest_ensure_response([]);
    
    $formatted = [];
    foreach ($items as $item) {
        // Apenas itens de nível superior
        if (empty($item->ID) || (int)$item->menu_item_parent !== 0) continue;
        
        $formatted[] = [
            'ID' => (int)$item->ID,
            'title' => $item->title ?? '',
            'url' => wp_make_link_relative($item->url ?? '#'), // Torna URL relativa
            'target' => !empty($item->target) ? $item->target : '_self'
        ];
    }
    return rest_ensure_response($formatted);
}

/**
 * Handler da API REST para inscrever um email no MailPoet.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function djz_mailpoet_subscribe_handler($request) {
    $email = sanitize_email($request->get_param('email') ?? '');
    
    if (!is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email', ['status' => 400]);
    }
    if (!class_exists('\MailPoet\API\API')) {
        return new WP_Error('mailpoet_inactive', 'MailPoet inactive', ['status' => 500]);
    }
    
    try {
        $mailpoet_api = \MailPoet\API\API::MP('v1');
        $lists = $mailpoet_api->getLists();
        // Inscreve na primeira lista disponível
        $list_id = !empty($lists) ? $lists[0]['id'] : 1; 
        
        $mailpoet_api->addSubscriber(['email' => $email, 'status' => 'subscribed'], [$list_id]);
        
        return rest_ensure_response(['success' => true, 'message' => 'Subscribed!']);
        
    } catch (Exception $e) {
        // Trata caso o usuário já esteja inscrito
        if (stripos($e->getMessage(), 'already exists') !== false) {
            return rest_ensure_response(['success' => true, 'message' => 'Already subscribed!']);
        }
        return new WP_Error('subscription_failed', $e->getMessage(), ['status' => 500]);
    }
}

/**
 * Handler da API REST para autenticação via Google OAuth.
 * Verifica o token do Google, cria ou loga o usuário, e retorna um JWT.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response|WP_Error
 */
function djz_google_oauth_handler($request) {
    $token = sanitize_text_field($request->get_param('token') ?? '');
    
    if (empty($token)) {
        return new WP_Error('no_token', 'Token is required', ['status' => 400]);
    }
    
    // Verifica o token com o Google
    $verify_url = add_query_arg('id_token', rawurlencode($token), 'https://oauth2.googleapis.com/tokeninfo');
    $response = wp_remote_get($verify_url, ['timeout' => 10]);
    
    if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) {
        return new WP_Error('invalid_token', 'Failed to verify Google token', ['status' => 401]);
    }
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    
    if (empty($body) || empty($body['email'])) {
        return new WP_Error('invalid_token', 'Invalid token body from Google', ['status' => 401]);
    }
    
    $email = sanitize_email($body['email']);
    $name = sanitize_text_field($body['name'] ?? '');
    
    // Encontra ou cria o usuário
    $user = get_user_by('email', $email);
    
    if (!$user) {
        // Cria novo usuário
        $user_id = wp_create_user($email, wp_generate_password(), $email);
        if (is_wp_error($user_id)) return $user_id;
        
        wp_update_user(['ID' => $user_id, 'display_name' => $name, 'first_name' => current(explode(' ', $name))]);
        $user = get_user_by('id', $user_id);
    }
    
    // Gera um JWT usando o plugin Simple JWT Login
    if (class_exists('\SimpleJwtLogin\Classes\SimpleJwtLoginJWT')) {
        $jwt_instance = new \SimpleJwtLogin\Classes\SimpleJwtLoginJWT();
        $jwt = $jwt_instance->getJwt($user);
        
        return rest_ensure_response([
            'jwt' => $jwt,
            'user' => ['id' => $user->ID, 'email' => $user->user_email, 'name' => $user->display_name]
        ]);
    }
    
    return new WP_Error('jwt_plugin_missing', 'Simple JWT Login plugin not available', ['status' => 500]);
}

/**
 * Handler da API REST para buscar produtos do WooCommerce (suporta Polylang).
 *
 * @param WP_REST_Request $request
 * @return WP_Rest_Response
 */
function djz_get_products_with_lang_handler($request) {
    $lang = sanitize_text_field($request->get_param('lang') ?? '');
    
    // Define o idioma padrão se não for passado
    if (empty($lang) && function_exists('pll_default_language')) {
        $lang = pll_default_language();
    }
    if (empty($lang)) {
        $lang = 'en'; // Fallback
    }
    
    $args = array(
        'post_type' => 'product',
        'posts_per_page' => -1,
        'post_status' => 'publish',
        'orderby' => 'date',
        'order' => 'DESC',
    );
    
    // Filtra por idioma se Polylang estiver ativo
    if (function_exists('pll_get_post_language')) {
        $args['lang'] = $lang;
    }
    
    $query = new WP_Query($args);
    $products = array();
    
    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product_id = get_the_ID();
            $product = wc_get_product($product_id);
            
            if (!$product) continue;
            
            // Detecta o idioma do produto
            $product_lang = $lang;
            if (function_exists('pll_get_post_language')) {
                $detected_lang = pll_get_post_language($product_id);
                if ($detected_lang) {
                    $product_lang = $detected_lang;
                }
            }
            
            // Busca traduções
            $translations = array();
            if (function_exists('pll_get_post_translations')) {
                $translations = pll_get_post_translations($product_id);
            }
            
            // Formata imagens
            $images = array();
            $image_ids = $product->get_gallery_image_ids();
            
            if ($product->get_image_id()) {
                array_unshift($image_ids, $product->get_image_id()); // Imagem principal primeiro
            }
            
            foreach ($image_ids as $image_id) {
                $images[] = array(
                    'id' => $image_id,
                    'src' => wp_get_attachment_url($image_id),
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                );
            }
            
            // Imagem placeholder se não houver
            if (empty($images)) {
                $images[] = array(
                    'id' => 0,
                    'src' => 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer',
                    'alt' => $product->get_name(),
                );
            }
            
            // Adiciona dados do produto à resposta
            $products[] = array(
                'id' => $product_id,
                'name' => $product->get_name(),
                'slug' => $product->get_slug(),
                'price' => $product->get_price(),
                'regular_price' => $product->get_regular_price(),
                'sale_price' => $product->get_sale_price(),
                'on_sale' => $product->is_on_sale(),
                'stock_status' => $product->get_stock_status(),
                'images' => $images,
                'lang' => $product_lang,
                'translations' => $translations,
            );
        }
    }
    
    wp_reset_postdata();
    
    return new WP_Rest_Response($products, 200);
}

/* =========================
 * REGISTRO DOS ENDPOINTS
 * ========================= */

/**
 * Registra todos os endpoints customizados da API REST.
 */
add_action('rest_api_init', function () {
    $namespace = 'djzeneyer/v1';

    // Endpoint para Menu
    register_rest_route($namespace, '/menu', [
        'methods' => 'GET',
        'callback' => 'djz_get_multilang_menu_handler',
        'permission_callback' => '__return_true'
    ]);

    // Endpoint para Inscrição (MailPoet)
    register_rest_route($namespace, '/subscribe', [
        'methods' => 'POST',
        'callback' => 'djz_mailpoet_subscribe_handler',
        'permission_callback' => '__return_true'
    ]);

    // Endpoint para Produtos (WooCommerce + Polylang)
    register_rest_route($namespace, '/products', [
        'methods' => 'GET',
        'callback' => 'djz_get_products_with_lang_handler',
        'permission_callback' => '__return_true',
        'args' => [
            'lang' => [
                'required' => false,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
        ],
    ]);
    
    // Endpoint para GamiPress
    register_rest_route($namespace, '/gamipress/(?P<user_id>\d+)', [
        'methods' => 'GET',
        'callback' => 'djz_get_gamipress_handler',
        'permission_callback' => '__return_true', // Pode ser alterado para 'is_user_logged_in' se for privado
        'args' => [
            'user_id' => [
                'required' => true,
                'type' => 'integer',
                'validate_callback' => function($param) {
                    return is_numeric($param) && $param > 0;
                },
            ],
        ],
    ]);

    // Endpoint para Atualizar Perfil do Usuário
    register_rest_route($namespace, '/user/update-profile', [
        'methods' => 'POST',
        'callback' => function($request) {
            $user_id = get_current_user_id();
            if (0 === $user_id) {
                return new WP_Error('not_logged_in', 'User not authenticated', ['status' => 401]);
            }
            
            $params = $request->get_json_params();
            $user_data = ['ID' => $user_id];
            
            if (isset($params['displayName'])) {
                $user_data['display_name'] = sanitize_text_field($params['displayName']);
            }
            // Outros campos (como 'first_name', 'last_name') podem ser adicionados aqui
            
            $result = wp_update_user($user_data);
            
            if (is_wp_error($result)) {
                return new WP_Error('profile_update_failed', 'Could not update profile', ['status' => 400]);
            }
            
            return rest_ensure_response(['success' => true, 'message' => 'Profile updated!']);
        },
        'permission_callback' => 'is_user_logged_in' // Apenas usuários logados
    ]);

    // Endpoint customizado para Google Auth (plugin Simple JWT Login)
    register_rest_route('simple-jwt-login/v1', '/auth/google', [
        'methods' => 'POST',
        'callback' => 'djz_google_oauth_handler',
        'permission_callback' => '__return_true'
    ]);
});

/* =========================
 * SEO FIXES
 * ========================= */

/**
 * Garante que 404s *reais* (como arquivos não encontrados no servidor)
 * ainda enviem um header 404.
 *
 * A lógica da SPA (em 'template_include') roda *depois* de 'template_redirect'
 * e sobrescreve o status para 200, o que é o comportamento correto para a SPA.
 */
add_action('template_redirect', function() {
    if (is_404()) {
        status_header(404);
        nocache_headers();
    }
}, 999); // Roda tarde, mas 'template_include' roda mais tarde ainda

/**
 * Desativa o sitemap padrão do WordPress (sitemaps.xml),
 * pois já temos um customizado em /sitemap.xml.
 */
add_filter('wp_sitemaps_enabled', '__return_false');
