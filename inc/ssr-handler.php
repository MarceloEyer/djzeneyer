<?php
/**
 * DJ Zen Eyer - SSR Prerender Handler
 * 
 * Serve arquivos *_ssr.html para bots de busca e IA
 * enquanto mantém React SPA para usuários reais
 */

// Detectar se é um bot
function djz_is_bot() {
    if (!isset($_SERVER['HTTP_USER_AGENT'])) {
        return false;
    }

    static $pattern = null;

    if ($pattern === null) {
        $bots = [
            'googlebot',
            'bingbot',
            'slurp',        // Yahoo
            'duckduckbot',
            'baiduspider',
            'yandexbot',
            'facebookexternalhit',
            'twitterbot',
            'linkedinbot',
            'whatsapp',
            'telegrambot',
            // AI Bots
            'claudebot',    // Anthropic (atual 2026)
            'claude-web',   // Anthropic (legado, manter para compatibilidade)
            'anthropic-ai', // Anthropic (legado, manter para compatibilidade)
            'gptbot',       // OpenAI (crawler de treinamento)
            'oai-searchbot', // OpenAI (indexação ChatGPT search)
            'chatgpt-user',  // OpenAI (visitas do ChatGPT)
            'google-extended', // Google Bard
            'perplexitybot',
            'youbot',
            // SEO tools
            'ahrefsbot',
            'semrushbot',
            'mj12bot',
            'dotbot',
        ];
        $pattern = '/' . implode('|', array_map(function($bot) { return preg_quote($bot, '/'); }, $bots)) . '/i';
    }

    return (bool) preg_match($pattern, $_SERVER['HTTP_USER_AGENT']);
}

// Servir arquivo SSR se existir
function djz_serve_ssr() {
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
    } else {
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
    add_action('wp_footer', function() {
        echo "\n<!-- SSR Debug Info:\n";
        echo "Is Bot: " . (djz_is_bot() ? 'YES' : 'NO') . "\n";
        echo "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'None') . "\n";
        echo "Request URI: " . ($_SERVER['REQUEST_URI'] ?? 'None') . "\n";
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $clean_path = trim($path, '/');
        echo "Path: " . $path . "\n";
        
        $theme_path = get_stylesheet_directory();
        if (empty($clean_path)) {
            $ssr_file = $theme_path . '/dist/index.html';
        } else {
            $ssr_file = $theme_path . '/dist/' . $clean_path . '/index.html';
        }
        echo "SSR File: " . $ssr_file . "\n";
        echo "SSR Exists: " . (file_exists($ssr_file) ? 'YES' : 'NO') . "\n";
        echo "-->\n";
    });
}