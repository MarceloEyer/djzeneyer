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

    $user_agent = strtolower($_SERVER['HTTP_USER_AGENT']);

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
        'gptbot',       // OpenAI
        'claudebot',    // Anthropic
        'claude-web',
        'anthropic-ai',
        'google-extended', // Google Bard
        'perplexitybot',
        'youbot',
        // SEO tools
        'ahrefsbot',
        'semrushbot',
        'mj12bot',
        'dotbot',
    ];

    foreach ($bots as $bot) {
        if (strpos($user_agent, $bot) !== false) {
            return true;
        }
    }

    return false;
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
    
    // Remover trailing slash
    $path = rtrim($path, '/');
    if (empty($path)) {
        $path = '/';
    }

    // Converter path para filename
    $filename = djz_path_to_filename($path);
    
    // Caminho do arquivo SSR
    $theme_path = get_stylesheet_directory();
    $ssr_file = $theme_path . '/dist/' . $filename . '_ssr.html';

    // Se arquivo SSR existe, servir
    if (file_exists($ssr_file)) {
        // Headers SEO-friendly
        header('Content-Type: text/html; charset=UTF-8');
        header('X-Prerendered: true');
        header('X-Prerender-File: ' . $filename . '_ssr.html');
        
        // Ler e servir arquivo
        readfile($ssr_file);
        exit;
    }
}

// Converter path para filename (mesma lógica do prerender.js)
function djz_path_to_filename($path) {
    if ($path === '/' || $path === '') {
        return 'index';
    }
    
    // Remove leading/trailing slashes
    $clean = trim($path, '/');
    
    // Substitui / por _
    $filename = str_replace('/', '_', $clean);
    
    // Remove caracteres especiais
    $filename = preg_replace('/[^a-z0-9_-]/i', '_', $filename);
    
    return $filename;
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
        echo "Path: " . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) . "\n";
        echo "Filename: " . djz_path_to_filename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)) . "\n";
        
        $theme_path = get_stylesheet_directory();
        $filename = djz_path_to_filename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
        $ssr_file = $theme_path . '/dist/' . $filename . '_ssr.html';
        echo "SSR File: " . $ssr_file . "\n";
        echo "SSR Exists: " . (file_exists($ssr_file) ? 'YES' : 'NO') . "\n";
        echo "-->\n";
    });
}