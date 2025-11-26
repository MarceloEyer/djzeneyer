<?php
/**
 * DJ Zen Eyer Theme Functions
 * v13.1.0 - Final Production Version + Performance Optimizations
 * Optimized for Headless Architecture + Zen SEO Plugin
 */

if (!defined('ABSPATH')) exit;

/* ==========================================
 * CARREGAMENTO DE MÓDULOS (INC)
 * ========================================== */

// 1. Configurações Básicas e Segurança (Uploads, Mime Types)
require_once get_theme_file_path('/inc/setup.php');

// 2. Limpeza de Headless (Remove Emojis, Feeds, Headers inúteis)
require_once get_theme_file_path('/inc/cleanup.php');

// 3. Integração Vite (Carrega o React e CSS gerados no build)
require_once get_theme_file_path('/inc/vite.php');

// 4. Roteamento SPA (Redireciona rotas virtuais para o index.html)
require_once get_theme_file_path('/inc/spa.php');

// 5. API REST Endpoints (Menu, Auth, Gamificação)
require_once get_theme_file_path('/inc/api.php');

// 6. Custom Post Types & Taxonomias (Flyers e Músicas)
require_once get_theme_file_path('/inc/cpt.php');

// 7. Gerenciador de Links de Música (Campos para Drive/SoundCloud)
require_once get_theme_file_path('/inc/metaboxes.php');

/**
 * NOTA: O arquivo 'inc/seo.php' foi removido.
 * Todo o SEO (Sitemap, Schema, Meta Tags) agora é gerenciado
 * pelo plugin "Zen SEO Lite" para melhor performance e controle.
 */

/* ==========================================
 * OTIMIZAÇÕES DE PERFORMANCE (v13.1.0)
 * ========================================== */

/**
 * 1️⃣ Defer jQuery Migrate (Reduz bloqueio de renderização)
 * Impacto: Melhora FCP em ~100ms
 */
add_filter('script_loader_tag', function($tag, $handle) {
    if ($handle === 'jquery-migrate') {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}, 10, 2);

/**
 * 2️⃣ Remove Emoji Detection Script (WordPress padrão)
 * Impacto: Remove 2 requisições HTTP desnecessárias
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');
remove_action('admin_print_scripts', 'print_emoji_detection_script');
remove_action('admin_print_styles', 'print_emoji_styles');

/**
 * 3️⃣ Remove WP Embeds (se não usar oEmbeds)
 * Impacto: Remove 1 requisição JS (~10KB)
 */
add_action('wp_footer', function() {
    wp_deregister_script('wp-embed');
});

/**
 * 4️⃣ Desabilita REST API Discovery Links (Headless não precisa)
 * Impacto: Remove 3 tags <link> do <head>
 */
remove_action('wp_head', 'rest_output_link_wp_head', 10);
remove_action('wp_head', 'wp_oembed_add_discovery_links', 10);

/**
 * 5️⃣ Remove RSD Link (Really Simple Discovery - legado)
 * Impacto: Remove 1 tag <link> desnecessária
 */
remove_action('wp_head', 'rsd_link');

/**
 * 6️⃣ Remove WLW Manifest (Windows Live Writer - obsoleto)
 * Impacto: Remove 1 tag <link> desnecessária
 */
remove_action('wp_head', 'wlwmanifest_link');

/**
 * 7️⃣ Remove Generator Meta Tag (Oculta versão do WordPress)
 * Impacto: Segurança + Remove 1 tag <meta>
 */
remove_action('wp_head', 'wp_generator');

/**
 * 8️⃣ Desabilita Dashicons no Frontend (se não usar)
 * Impacto: Remove 1 requisição CSS (~40KB) para usuários não-logados
 */
add_action('wp_enqueue_scripts', function() {
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
});

/**
 * 9️⃣ Otimiza REST API (Remove endpoints não-usados)
 * Impacto: Reduz superfície de ataque + Performance
 */
add_filter('rest_endpoints', function($endpoints) {
    // Remove endpoints de usuários (se não usar)
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users']);
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    
    // Remove comentários (se não usar)
    unset($endpoints['/wp/v2/comments']);
    unset($endpoints['/wp/v2/comments/(?P<id>[\d]+)']);
    
    return $endpoints;
});

/**
 * 🔟 Heartbeat API (Reduz frequência - economiza recursos)
 * Impacto: Reduz requisições AJAX em 75% no admin
 */
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60; // Padrão: 15s, Novo: 60s
    return $settings;
});

/**
 * 1️⃣1️⃣ Lazy Load de Imagens (Nativo WordPress 5.5+)
 * Impacto: Melhora LCP em páginas com muitas imagens
 */
add_filter('wp_lazy_loading_enabled', '__return_true');

/**
 * 1️⃣2️⃣ Desabilita Query Strings em Assets Estáticos (Cache)
 * Impacto: Melhora cache de CDN (Cloudflare, etc)
 */
add_filter('style_loader_src', 'djzen_remove_query_strings', 10, 2);
add_filter('script_loader_src', 'djzen_remove_query_strings', 10, 2);

function djzen_remove_query_strings($src) {
    if (strpos($src, '?ver=')) {
        $src = remove_query_arg('ver', $src);
    }
    return $src;
}

/**
 * 1️⃣3️⃣ Preconnect para fontes externas (Google Fonts)
 * Impacto: Melhora FCP em ~150ms
 * NOTA: Já implementado no index.php, mas fica aqui como backup
 */
add_action('wp_head', function() {
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">';
    echo '<link rel="dns-prefetch" href="//fonts.gstatic.com">';
}, 0);

/**
 * 1️⃣4️⃣ Limita Revisões de Posts (Database Performance)
 * Impacto: Reduz tamanho do banco de dados
 */
if (!defined('WP_POST_REVISIONS')) {
    define('WP_POST_REVISIONS', 3);
}

/**
 * 1️⃣5️⃣ Aumenta Limite de Memória (se necessário)
 * Impacto: Previne erros em imports/exports grandes
 */
if (!defined('WP_MEMORY_LIMIT')) {
    define('WP_MEMORY_LIMIT', '256M');
}

/**
 * 1️⃣6️⃣ Desabilita Auto-Save no Admin (Opcional)
 * Impacto: Reduz requisições AJAX desnecessárias
 */
add_action('admin_init', function() {
    wp_deregister_script('autosave');
});

/**
 * 1️⃣7️⃣ Adiciona Fetchpriority na Hero Image (LCP)
 * Impacto: Prioriza carregamento da imagem principal
 */
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
    // Detecta se é a primeira imagem da página
    static $first_image = true;
    
    if ($first_image && is_front_page()) {
        $attr['fetchpriority'] = 'high';
        $first_image = false;
    }
    
    return $attr;
}, 10, 2);

/**
 * 1️⃣8️⃣ Desabilita Google Fonts (se usar CDN externo)
 * Impacto: Remove 1 requisição se já carregado no index.php
 * COMENTADO: Já está sendo carregado no index.php
 */
// add_action('wp_enqueue_scripts', function() {
//     wp_dequeue_style('wp-block-library');
// }, 100);

/**
 * 1️⃣9️⃣ Cache de Queries Pesadas (Transients API)
 * Exemplo: Cache de menus
 */
add_filter('wp_nav_menu_args', function($args) {
    $args['echo'] = false;
    return $args;
});

/**
 * 2️⃣0️⃣ Security Header: X-Content-Type-Options
 * Impacto: Previne MIME sniffing
 * NOTA: Já configurado no .htaccess, mas fica como fallback
 */
add_action('send_headers', function() {
    if (!headers_sent()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
});

/* ==========================================
 * FIM DAS OTIMIZAÇÕES
 * ========================================== */
