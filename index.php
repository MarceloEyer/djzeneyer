<?php
/**
 * Smart Router para React + WordPress (SEO Optimized)
 * * Lógica:
 * 1. Verifica se existe um HTML pré-renderizado (com H1 e conteúdo) na pasta /dist.
 * 2. Se existir, entrega ele direto (Google fica feliz).
 * 3. Se não existir, entrega o App React normal.
 */

if (!defined('ABSPATH')) exit;

// 1. Descobrir qual página o usuário está pedindo
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$template_dir = get_template_directory();

// 2. Definir o caminho do arquivo estático correspondente
if ($request_uri === '/' || $request_uri === '/index.php') {
    // Se for a Home
    $static_file_relative = '/dist/index.html';
} else {
    // Se for uma página interna (ex: /events -> /dist/events/index.html)
    // Removemos a barra final para padronizar
    $clean_uri = rtrim($request_uri, '/');
    $static_file_relative = '/dist' . $clean_uri . '/index.html';
}

$full_path = $template_dir . $static_file_relative;

// 3. O PULO DO GATO: Verificar se o arquivo estático existe
if (file_exists($full_path)) {
    // SUCESSO! O Puppeteer gerou essa página no build.
    // Entregamos o HTML completo (com H1, textos e imagens).
    // O navegador nem percebe que é PHP, ele recebe HTML puro e rápido.
    readfile($full_path);
    exit;
}

// 4. FALLBACK: Se não tiver HTML estático (ex: 404 ou rota protegida)
// Mantemos o comportamento original para o React assumir.

// Tenta carregar o index.html principal do React (App Shell)
$app_shell = $template_dir . '/dist/index.html';

if (file_exists($app_shell)) {
    readfile($app_shell);
    exit;
}

// 5. Último recurso (segurança): Se a pasta dist sumiu
get_header(); 
?>
<div id="root"></div>
<noscript>
    <div style="padding: 2rem; text-align: center; color: white; background: #000;">
        <h1>DJ Zen Eyer</h1>
        <p>JavaScript is required.</p>
    </div>
</noscript>
<?php 
get_footer(); 
?>