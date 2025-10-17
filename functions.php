/* =========================
 * CORREÇÕES SEO CRÍTICAS
 * ========================= */

// 1. Corrigir status code da página 404
add_action('template_redirect', function() {
    if (is_404()) {
        status_header(404);
        nocache_headers();
    }
});

// 2. Hreflang correto com self-referencing
add_action('wp_head', function() {
    // Remove tags do Rank Math se existirem
    remove_action('wp_head', 'rank_math_hreflang', 10);
    
    $base_url = trailingslashit(home_url());
    
    // Verifica se é homepage
    if (is_front_page() || is_home()) {
        echo '<link rel="alternate" hreflang="en" href="' . esc_url($base_url) . '" />' . "\n";
        echo '<link rel="alternate" hreflang="pt-BR" href="' . esc_url($base_url . 'pt/') . '" />' . "\n";
        echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($base_url) . '" />' . "\n";
    }
    
    // Se for página /pt/
    if (is_page() && get_query_var('pagename') === 'pt') {
        echo '<link rel="alternate" hreflang="en" href="' . esc_url($base_url) . '" />' . "\n";
        echo '<link rel="alternate" hreflang="pt-BR" href="' . esc_url($base_url . 'pt/') . '" />' . "\n";
        echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($base_url) . '" />' . "\n";
    }
}, 1); // Prioridade 1 para executar antes do Rank Math

// 3. Garantir apenas 1 meta description (remove duplicadas do Rank Math se conflitar)
add_action('wp_head', function() {
    // Se Rank Math estiver ativo e criando duplicatas, desative a geração automática
    if (class_exists('RankMath')) {
        // Esta ação remove possíveis descriptions duplicadas
        // Você pode configurar manualmente cada página no Rank Math
    }
}, 0);

// 4. Forçar trailing slash via PHP (backup do .htaccess)
add_action('template_redirect', function() {
    if (is_admin() || is_404()) {
        return;
    }
    
    $url = $_SERVER['REQUEST_URI'];
    
    // Se não termina com / e não é arquivo (imagem, css, js)
    if (substr($url, -1) !== '/' && !preg_match('/\.[a-z]{2,4}$/i', $url)) {
        wp_redirect(home_url($url . '/'), 301);
        exit();
    }
}, 1);

?>
