<?php
/**
 * DJ Zen Eyer Theme Functions
 * v13.2.0 - Production Optimized (Zero Redundancy)
 * Headless Architecture + Zen SEO Plugin
 */

if (!defined('ABSPATH')) exit;

/* ==========================================
 * CARREGAMENTO DE MÓDULOS (INC)
 * ========================================== */

// 1. Configurações Básicas e Segurança (Uploads, Headers, CORS)
require_once get_theme_file_path('/inc/setup.php');

// 2. Limpeza de Headless (Remove Emojis, Feeds, Scripts WP Core)
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
 * NOTA: SEO removido daqui.
 * Todo o SEO (Sitemap, Schema, Meta Tags) é gerenciado
 * pelo plugin "Zen SEO Lite".
 */

/* ==========================================
 * OTIMIZAÇÕES ADICIONAIS (NÃO-REDUNDANTES)
 * ========================================== */

/**
 * 1️⃣ Defer jQuery Migrate
 * Impacto: Melhora FCP em ~100ms
 */
add_filter('script_loader_tag', function($tag, $handle) {
    if ($handle === 'jquery-migrate') {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}, 10, 2);

/**
 * 2️⃣ Desabilita Dashicons no Frontend (não-logados)
 * Impacto: Remove 40KB CSS desnecessário
 */
add_action('wp_enqueue_scripts', function() {
    if (!is_user_logged_in()) {
        wp_dequeue_style('dashicons');
        wp_deregister_style('dashicons');
    }
}, 100);

/**
 * 3️⃣ Otimiza REST API (Remove endpoints não-usados)
 * Impacto: Reduz superfície de ataque
 */
add_filter('rest_endpoints', function($endpoints) {
    // Remove usuários se não logado
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users']);
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    
    // Remove comentários (headless não usa)
    unset($endpoints['/wp/v2/comments']);
    unset($endpoints['/wp/v2/comments/(?P<id>[\d]+)']);
    
    return $endpoints;
});

/**
 * 4️⃣ Heartbeat API (Reduz frequência AJAX)
 * Impacto: -75% requisições no admin
 */
add_filter('heartbeat_settings', function($settings) {
    $settings['interval'] = 60; // Era 15s
    return $settings;
});

/**
 * 5️⃣ Lazy Load Nativo (WordPress 5.5+)
 */
add_filter('wp_lazy_loading_enabled', '__return_true');

/**
 * 6️⃣ Remove Query Strings (?ver=) para melhor cache CDN
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
 * 7️⃣ DNS Prefetch para Google Fonts
 * NOTA: Também está no index.php, mas duplicação aqui é aceitável
 */
add_action('wp_head', function() {
    echo '<link rel="dns-prefetch" href="//fonts.googleapis.com">';
    echo '<link rel="dns-prefetch" href="//fonts.gstatic.com">';
}, 0);

/**
 * 8️⃣ Limita Revisões de Posts (Economia de DB)
 */
if (!defined('WP_POST_REVISIONS')) {
    define('WP_POST_REVISIONS', 3);
}

/**
 * 9️⃣ Aumenta Memória (Se necessário para imports grandes)
 */
if (!defined('WP_MEMORY_LIMIT')) {
    define('WP_MEMORY_LIMIT', '256M');
}

/**
 * 🔟 Desabilita Auto-Save (Opcional)
 */
add_action('admin_init', function() {
    wp_deregister_script('autosave');
});

/**
 * 1️⃣1️⃣ Fetchpriority na Hero Image (Melhora LCP)
 */
add_filter('wp_get_attachment_image_attributes', function($attr, $attachment) {
    static $first_image = true;
    
    if ($first_image && is_front_page()) {
        $attr['fetchpriority'] = 'high';
        $first_image = false;
    }
    
    return $attr;
}, 10, 2);

/* ==========================================
 * FIM DAS OTIMIZAÇÕES
 * ========================================== */
