<?php
/**
 * Smart Router v2 (Pathfix - Direct Access)
 * Versão enxuta e robusta usando __DIR__
 */

if (!defined('ABSPATH')) exit;

// 1. Pega a URL (ex: /events)
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 2. Define a raiz usando a localização real deste arquivo
$theme_root = __DIR__; 

// 3. Monta o caminho do arquivo estático
if ($request_uri === '/' || $request_uri === '/index.php') {
    $path_to_check = $theme_root . '/dist/index.html';
} else {
    $clean_uri = rtrim($request_uri, '/');
    $path_to_check = $theme_root . '/dist' . $clean_uri . '/index.html';
}

// 4. VERIFICAÇÃO E ENTREGA
if (file_exists($path_to_check)) {
    // ACHO! Entrega o arquivo pronto com H1 e SEO.
    header('Content-Type: text/html; charset=utf-8');
    readfile($path_to_check);
    exit;
}

// 5. Fallback (Se não achou, entrega o app React vazio)
$app_shell = $theme_root . '/dist/index.html';

if (file_exists($app_shell)) {
    readfile($app_shell);
} else {
    // Último recurso se tudo falhar
    get_header();
    echo '<div id="root"></div>'; 
    get_footer();
}
?>