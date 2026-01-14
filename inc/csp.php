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
        
        "script-src 'self' 'nonce-{$nonce}' blob: https://accounts.google.com https://apis.google.com https://gsi.gstatic.com https://gsi.client-url.com https://www.googletagmanager.com https://widget.bandsintown.com https://cdn.bandsintown.com https://rest.bandsintown.com https://static.cloudflareinsights.com https://fonts.googleapis.com https://challenges.cloudflare.com",
        
        "style-src 'self' 'nonce-{$nonce}' https://fonts.googleapis.com https://accounts.google.com https://widget.bandsintown.com https://cdn.bandsintown.com",
        
        "font-src 'self' https://fonts.gstatic.com https://r2cdn.perplexity.ai data:",
        
        "img-src 'self' https: data: blob: filesystem:",
        
        "connect-src 'self' https://djzeneyer.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://api.bandsintown.com https://rest.bandsintown.com https://widget.bandsintown.com https://cdn.bandsintown.com https://photos.bandsintown.com https://www.googletagmanager.com https://cloudflareinsights.com https://static.cloudflareinsights.com https://challenges.cloudflare.com",
        
        "frame-src 'self' https://accounts.google.com https://widget.bandsintown.com https://challenges.cloudflare.com",
        
        "object-src 'none'",
        
        "base-uri 'self'",
    ]) . ';';

    header('Content-Security-Policy: ' . $policy);
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