<?php
/**
 * Front to the WordPress application.
 * @package zentheme
 */

// 1. Define onde vivem os arquivos do build
$dist_path = get_template_directory() . '/dist';

// 2. Limpa a URL para saber qual arquivo buscar
$request_uri = strtok($_SERVER['REQUEST_URI'], '?');

// 3. Define o caminho do arquivo estático correspondente
if ($request_uri === '/' || $request_uri === '') {
    $static_file = $dist_path . '/index.html';
} else {
    // Remove barra final para padronizar (ex: /events/ vira /events)
    $static_file = $dist_path . rtrim($request_uri, '/') . '/index.html';
}

// 4. A Lógica de Ouro: Se o arquivo estático existe, entrega ele (Rápido + SEO)
if (file_exists($static_file) && !is_dir($static_file)) {
    header('Content-Type: text/html; charset=UTF-8');
    readfile($static_file);
    exit;
}

// 5. Fallback: Se não existe estático (ex: /admin, 404, rotas dinâmicas), entrega o React puro
require($dist_path . '/index.html');