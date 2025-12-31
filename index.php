<?php
/**
 * DJ Zen Eyer - Hybrid Router (Static First, React Fallback)
 * @package zentheme
 */

// 1. Define a pasta onde está o build do Vite
$dist_path = get_template_directory() . '/dist';

// 2. Limpa a URL (remove ?query=params) para achar o arquivo
$request_uri = strtok($_SERVER['REQUEST_URI'], '?');

// 3. Monta o caminho do arquivo estático esperado
if ($request_uri === '/' || $request_uri === '') {
    // Home
    $static_file = $dist_path . '/index.html';
} else {
    // Rotas internas (ex: /events -> dist/events/index.html)
    $static_file = $dist_path . rtrim($request_uri, '/') . '/index.html';
}

// 4. ESTRATÉGIA DE OURO: Se o arquivo estático existe, entrega ele.
if (file_exists($static_file) && !is_dir($static_file)) {
    header('Content-Type: text/html; charset=UTF-8');
    // Cache headers opcionais podem ser adicionados aqui se necessário
    readfile($static_file);
    exit;
}

// 5. FALLBACK: Se não tem estático, carrega o App React padrão (Client-Side Rendering)
// Isso garante que páginas como /admin, /shop (se não gerada) ou 404 funcionem.
require($dist_path . '/index.html');