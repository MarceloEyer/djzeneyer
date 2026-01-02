<?php
/**
 * Front to the WordPress application.
 * @package zentheme
 */

// 1. Define a base segura (evita Path Traversal)
$dist_path = get_template_directory() . '/dist';
$real_dist_path = realpath($dist_path);

if (!$real_dist_path) {
    // Se a pasta dist não existir, falha silenciosa para o WP padrão ou erro
    return;
}

// 2. Limpa a URL
$request_uri = strtok($_SERVER['REQUEST_URI'], '?');

// 3. LÓGICA HÍBRIDA (Arquivos Soltos vs. Rotas de Pasta)

// Tentativa A: É um arquivo estático direto? (Ex: robots.txt, sitemap.xml, favicon.ico)
$possible_file = $real_dist_path . $request_uri;

// Tentativa B: É uma rota prerenderizada? (Ex: /events -> /events/index.html)
// Removemos a barra final para padronizar
$possible_route = $real_dist_path . rtrim($request_uri, '/') . '/index.html';

$serve_file = null;

// Verificação de Segurança (Path Traversal)
// Só servimos se o arquivo existir E estiver DENTRO da pasta dist
if (file_exists($possible_file) && is_file($possible_file)) {
    $real_file_path = realpath($possible_file);
    if ($real_file_path && strpos($real_file_path, $real_dist_path) === 0) {
        $serve_file = $possible_file;
    }
} elseif (file_exists($possible_route) && is_file($possible_route)) {
    $real_route_path = realpath($possible_route);
    if ($real_route_path && strpos($real_route_path, $real_dist_path) === 0) {
        $serve_file = $possible_route;
    }
}

// 4. Entrega o arquivo estático (Se encontrado e seguro)
if ($serve_file) {
    // Detectar Content-Type corretamente para robots.txt e sitemaps
    $extension = pathinfo($serve_file, PATHINFO_EXTENSION);
    $mime_types = [
        'html' => 'text/html; charset=UTF-8',
        'xml'  => 'application/xml; charset=UTF-8',
        'txt'  => 'text/plain; charset=UTF-8',
        'css'  => 'text/css',
        'js'   => 'application/javascript',
        'json' => 'application/json',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon'
    ];
    
    $content_type = isset($mime_types[$extension]) ? $mime_types[$extension] : 'text/html; charset=UTF-8';
    
    header('Content-Type: ' . $content_type);
    readfile($serve_file);
    exit;
}

// 5. Fallback: Se não achou estático, entrega o App React (index.html raiz)
// Isso cuida do Admin, 404s e rotas dinâmicas
require($dist_path . '/index.html');