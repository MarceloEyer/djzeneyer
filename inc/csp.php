<?php
/**
 * CSP Nonce + Strict Content-Security-Policy
 *
 * Objetivo:
 * - Remover 'unsafe-inline' e 'unsafe-eval' (que permitem XSS).
 * - Adicionar um 'nonce' (número único) para scripts/estilos legítimos.
 * - Manter a lista de domínios permitidos (Google, GTM, Bandsintown, etc).
 */

if (!defined('ABSPATH')) exit;

/**
 * 1. Gera ou retorna o Nonce da requisição atual.
 * Ele precisa ser o mesmo para o cabeçalho e para as tags HTML.
 */
function djz_csp_nonce(): string {
    if (!empty($GLOBALS['DJZ_CSP_NONCE'])) {
        return (string) $GLOBALS['DJZ_CSP_NONCE'];
    }

    try {
        // Tenta gerar criptografia forte
        $bytes = random_bytes(16);
        $nonce = rtrim(strtr(base64_encode($bytes), '+/', '-_'), '=');
    } catch (Exception $e) {
        // Fallback seguro caso random_bytes falhe no servidor
        $nonce = wp_generate_password(22, false, false);
    }

    $GLOBALS['DJZ_CSP_NONCE'] = $nonce;
    return $nonce;
}

/**
 * 2. Envia o cabeçalho Content-Security-Policy (Apenas Frontend)
 */
add_action('send_headers', function() {
    // Não aplica no painel admin, requisições REST, AJAX ou Feeds para evitar quebras
    if (is_admin() || headers_sent()) return;
    if (defined('REST_REQUEST') && REST_REQUEST) return;
    if (wp_doing_ajax()) return;
    if (is_feed()) return;

    $nonce = djz_csp_nonce();

    // Definição da Política de Segurança (Baseada no seu antigo .htaccess)
    // Note o uso de 'nonce-{$nonce}' em script-src e style-src
    $policy = implode('; ', [
        "default-src 'self' https: data:",
        
        "script-src 'self' 'nonce-{$nonce}' 'strict-dynamic' https: http: blob: https://accounts.google.com https://apis.google.com https://gsi.gstatic.com https://gsi.client-url.com https://www.googletagmanager.com https://widget.bandsintown.com https://cdn.bandsintown.com https://rest.bandsintown.com https://static.cloudflareinsights.com https://fonts.googleapis.com https://challenges.cloudflare.com",
        
        "style-src 'self' 'nonce-{$nonce}' https://fonts.googleapis.com https://accounts.google.com https://widget.bandsintown.com https://cdn.bandsintown.com",
        
        // Inline style="" attributes in the prerendered shell/React markup (the meta CSP already allows them).
        "style-src-attr 'unsafe-inline'",

        "font-src 'self' https://fonts.gstatic.com https://r2cdn.perplexity.ai data:",
        
        "img-src 'self' https: data: blob: filesystem:",
        
        "connect-src 'self' https://djzeneyer.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://api.bandsintown.com https://rest.bandsintown.com https://widget.bandsintown.com https://cdn.bandsintown.com https://photos.bandsintown.com https://www.googletagmanager.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com https://googleads.g.doubleclick.net https://www.gstatic.com",
        
        "frame-src 'self' https://accounts.google.com https://widget.bandsintown.com https://challenges.cloudflare.com https://www.youtube.com https://www.youtube-nocookie.com",
        
        "object-src 'none'",
        
        "base-uri 'self'",
    ]) . ';';

    header('Content-Security-Policy: ' . $policy);

    $permissions_policy = implode(', ', [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'display-capture=()',
        'accelerometer=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
        'gyroscope=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
        'compute-pressure=(self "https://www.youtube.com" "https://www.youtube-nocookie.com")',
    ]);

    header('Permissions-Policy: ' . $permissions_policy);
    header('Cross-Origin-Opener-Policy: same-origin-allow-popups');
}, 20);

/**
 * 3. Injeta o atributo 'nonce' nos Scripts enfileirados pelo WordPress
 */
add_filter('script_loader_tag', function($tag, $handle, $src) {
    if (is_admin()) return $tag;
    if (defined('REST_REQUEST') && REST_REQUEST) return $tag;

    $nonce = djz_csp_nonce();
    
    // Se já tiver nonce, não faz nada
    if (stripos($tag, ' nonce=') !== false) return $tag;

    // Injeta nonce após <script
    return preg_replace('/<script\b/i', '<script nonce="' . esc_attr($nonce) . '"', $tag, 1);
}, 20, 3);

/**
 * 4. Injeta o atributo 'nonce' nos Estilos (CSS) enfileirados
 */
add_filter('style_loader_tag', function($html, $handle, $href, $media) {
    if (is_admin()) return $html;
    if (defined('REST_REQUEST') && REST_REQUEST) return $html;

    $nonce = djz_csp_nonce();
    
    if (stripos($html, ' nonce=') !== false) return $html;

    return preg_replace('/<link\b/i', '<link nonce="' . esc_attr($nonce) . '"', $html, 1);
}, 20, 4);

/**
 * 5. Nonce nos <script> inline gerados pelo core/plugins.
 *
 * Só scripts emitidos por wp_get_inline_script_tag()/wp_print_inline_script_tag()
 * (speculation rules, wp_add_inline_script, etc.) recebem o nonce, na origem.
 * Nenhum HTML final é reescrito: um <script> injetado por conteúdo comprometido
 * não passa por esses hooks e continua bloqueado pela CSP.
 */
function djz_csp_should_add_nonce(): bool {
    if (is_admin() || (defined('REST_REQUEST') && REST_REQUEST) || wp_doing_ajax()) return false;
    return !is_feed();
}

add_filter('wp_inline_script_attributes', function ($attributes) {
    if (!is_array($attributes) || !djz_csp_should_add_nonce()) return $attributes;
    if (empty($attributes['nonce'])) {
        $attributes['nonce'] = djz_csp_nonce();
    }
    // Evita que o LiteSpeed converta o script inline em data: URI (bloqueado pela CSP).
    $attributes['data-no-optimize'] = '1';
    return $attributes;
}, 20);

/**
 * 6. Nonce em <style> inline de core/plugins que não oferecem hook de atributos.
 *
 * wp_add_inline_style() imprime <style id="{handle}-inline-css"> sem filtro. Em vez
 * de reescrever todo o HTML, só os ids conhecidos abaixo recebem o nonce. Para
 * incluir outro, adicione o id via filtro 'djz_csp_inline_style_ids'.
 * Estilos do próprio tema recebem o nonce direto no template.
 */
function djz_csp_inline_style_ids(): array {
    return (array) apply_filters('djz_csp_inline_style_ids', [
        'wp-img-auto-sizes-contain-inline-css',
        'woocommerce-inline-inline-css',
        'ai_summarization-inline-css',
        'ai_content_translation-inline-css',
    ]);
}

add_action('template_redirect', function () {
    if (!djz_csp_should_add_nonce() || !class_exists('WP_HTML_Tag_Processor')) return;
    ob_start('djz_csp_nonce_known_inline_styles');
}, 1);

function djz_csp_nonce_known_inline_styles($html) {
    if (!is_string($html) || stripos($html, '<style') === false) return $html;

    $allowed = array_flip(djz_csp_inline_style_ids());
    $nonce = djz_csp_nonce();
    $p = new WP_HTML_Tag_Processor($html);

    while ($p->next_tag('STYLE')) {
        $id = $p->get_attribute('id');
        if (is_string($id) && isset($allowed[$id]) && $p->get_attribute('nonce') === null) {
            $p->set_attribute('nonce', $nonce);
        }
    }

    return $p->get_updated_html();
}
