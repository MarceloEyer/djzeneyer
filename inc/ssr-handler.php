<?php
/**
 * DJ Zen Eyer - SSR Prerender Handler
 * 
 * Serve arquivos *_ssr.html para bots de busca e IA
 * enquanto mantém React SPA para usuários reais
 */

// Detectar se é um bot
function djz_is_bot()
{
    if (!isset($_SERVER['HTTP_USER_AGENT'])) {
        return false;
    }

    static $pattern = null;

    if ($pattern === null) {
        /**
         * Static regex for bot detection.
         * 
         * MANUTENÇÃO: Se você adicionar novos bots ao sistema, NÃO edite esta string manualmente.
         * 1. Edite a lista de bots em `verification/generate_regex.php` (no seu ambiente local).
         * 2. Execute `php verification/generate_regex.php` ou use uma ferramenta de regex.
         * 3. Copie o output e cole aqui.
         * 4. Execute `php verification/test_ssr_bot_detection.php` para validar.
         */
        $pattern = '/(googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|claudebot|claude-web|anthropic-ai|gptbot|oai-searchbot|chatgpt-user|google-extended|perplexitybot|youbot|ahrefsbot|semrushbot|mj12bot|dotbot)/i';
    }

    return (bool)preg_match($pattern, $_SERVER['HTTP_USER_AGENT']);
}

// Servir arquivo SSR se existir
function djz_serve_ssr()
{
    // Só ativar para bots
    if (!djz_is_bot()) {
        return;
    }

    // Pegar caminho da requisição
    $request_uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($request_uri, PHP_URL_PATH);

    // Normalizar o path para encontrar o arquivo gerado pelo prerender.js
    // O prerender.js cria pastas para cada rota e um index.html dentro.
    // Ex: /about -> /dist/about/index.html
    // Ex: /      -> /dist/index.html
    $clean_path = trim($path, '/');

    $theme_path = get_stylesheet_directory();
    if (empty($clean_path)) {
        $ssr_file = $theme_path . '/dist/index.html';
        $display_filename = 'index.html';
    }
    else {
        $ssr_file = $theme_path . '/dist/' . $clean_path . '/index.html';
        $display_filename = $clean_path . '/index.html';
    }

    // Se arquivo SSR existe, servir
    if (file_exists($ssr_file)) {
        // Headers SEO-friendly
        header('Content-Type: text/html; charset=UTF-8');
        header('X-Prerendered: true');
        header('X-Prerender-File: ' . $display_filename);

        // Ler e servir arquivo
        readfile($ssr_file);
        exit;
    }
}

// Hook no WordPress antes de qualquer output
add_action('template_redirect', 'djz_serve_ssr', 1);

/**
 * DEBUGGING: Adicione ao final da URL: ?debug_ssr=1
 */
if (isset($_GET['debug_ssr'])) {
    add_action('wp_footer', function () {
        echo "\n<!-- SSR Debug Info:\n";
        echo "Is Bot: " . (djz_is_bot() ? 'YES' : 'NO') . "\n";
        echo "User Agent: " . esc_html($_SERVER['HTTP_USER_AGENT'] ?? 'None') . "\n";
        echo "Request URI: " . esc_html($_SERVER['REQUEST_URI'] ?? 'None') . "\n";
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $clean_path = trim($path, '/');
        echo "Path: " . esc_html($path) . "\n";

        $theme_path = get_stylesheet_directory();
        if (empty($clean_path)) {
            $ssr_file = $theme_path . '/dist/index.html';
        } else {
            $ssr_file = $theme_path . '/dist/' . $clean_path . '/index.html';
        }
        echo "SSR File: " . esc_html($ssr_file) . "\n";
        echo "SSR Exists: " . (file_exists($ssr_file) ? 'YES' : 'NO') . "\n";
        echo "-->\n";
    });
}