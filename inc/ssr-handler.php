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
    $clean_path = trim($path, '/');

    // SEGURANÇA: Bloquear Path Traversal
    // 1. Limpeza recursiva de tentativas de subida de diretório e caracteres perigosos
    $clean_path = $path;
    $previous = '';
    while ($clean_path !== $previous) {
        $previous = $clean_path;
        $clean_path = str_replace(['..', './', '../'], '', $clean_path);
        $clean_path = preg_replace('/[^a-zA-Z0-9\/\-_]/', '', $clean_path);
    }
    $clean_path = trim($clean_path, '/');

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
        // SEGURANÇA: Verificar via realpath() que o arquivo está dentro de dist/
        // Isso elimina qualquer chance de Path Traversal mesmo após sanitização do path.
        $dist_dir   = realpath($theme_path . '/dist');
        $real_file  = realpath($ssr_file);

        if ($dist_dir === false || $real_file === false) {
            return;
        }

        // O arquivo resolvido deve começar com o diretório dist/ (+ separador)
        if (strpos($real_file, $dist_dir . DIRECTORY_SEPARATOR) !== 0) {
            return;
        }

        // Headers SEO-friendly
        header('Content-Type: text/html; charset=UTF-8');
        header('X-Prerendered: true');
        header('X-Prerender-File: ' . $display_filename);

        // Ler e servir arquivo (caminho já validado por realpath)
        readfile($real_file);
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
        echo "User Agent: " . htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? 'None') . "\n";
        echo "Request URI: " . htmlspecialchars($_SERVER['REQUEST_URI'] ?? 'None') . "\n";
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH);
        $clean_path = trim($path, '/');
        echo "Path: " . htmlspecialchars($path) . "\n";

        $theme_path = get_stylesheet_directory();
        $clean_path_debug = '';
        $previous_debug   = '';
        while ($clean_path_debug !== $previous_debug) {
            $previous_debug   = $clean_path_debug;
            $clean_path_debug = str_replace(['..', './', '../'], '', $path ?? '');
            $clean_path_debug = preg_replace('/[^a-zA-Z0-9\/\-_]/', '', $clean_path_debug);
        }
        $clean_path_debug = trim($clean_path_debug, '/');
        if (empty($clean_path_debug)) {
            $ssr_file = $theme_path . '/dist/index.html';
        } else {
            $ssr_file = $theme_path . '/dist/' . $clean_path_debug . '/index.html';
        }
        $dist_dir_dbg  = realpath($theme_path . '/dist');
        $real_file_dbg = realpath($ssr_file);
        $safe_path     = ($dist_dir_dbg && $real_file_dbg && strpos($real_file_dbg, $dist_dir_dbg . DIRECTORY_SEPARATOR) === 0)
                         ? $real_file_dbg : '(blocked — path outside dist)';
        echo "SSR File: " . htmlspecialchars($safe_path) . "\n";
        echo "SSR Exists: " . ($safe_path !== '(blocked — path outside dist)' && file_exists($safe_path) ? 'YES' : 'NO') . "\n";
        echo "-->\n";
    });
}