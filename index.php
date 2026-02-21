<?php
/**
 * Front to the WordPress application.
 * @package zentheme
 */

// 1. Define a base segura e garante a barra final para evitar colisão de prefixo
$dist_path = get_theme_file_path('/dist');
$real_dist_path = realpath($dist_path);

if (!$real_dist_path) {
    // Se a pasta dist não existir, falha silenciosa
    return;
}

// Garante que o caminho base termine com barra (ex: /var/www/dist/)
// Isso impede acesso a pastas irmãs como /var/www/dist_backup
$real_dist_path = rtrim($real_dist_path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

// 2. Sanitização da URI (Remove query string, NUL bytes e decodifica)
$request_uri = strtok($_SERVER['REQUEST_URI'], '?');
$request_uri = str_replace("\0", '', rawurldecode($request_uri));

// 3. Definição dos candidatos (Arquivo direto ou Rota Prerender)
// ltrim remove barras iniciais extras para evitar caminhos absolutos acidentais
$possible_file = $real_dist_path . ltrim($request_uri, '/');
$possible_route = $real_dist_path . rtrim(ltrim($request_uri, '/'), '/') . '/index.html';

$serve_file = null;

// 4. Verificação de Segurança (Path Traversal Robusto)
if (file_exists($possible_file) && is_file($possible_file)) {
    $real_file_path = realpath($possible_file);
    // Verifica se o caminho real começa EXATAMENTE com a pasta dist/
    if ($real_file_path && strpos($real_file_path, $real_dist_path) === 0) {
        $serve_file = $real_file_path; // Usa o caminho resolvido
    }
} elseif (file_exists($possible_route) && is_file($possible_route)) {
    $real_route_path = realpath($possible_route);
    if ($real_route_path && strpos($real_route_path, $real_dist_path) === 0) {
        $serve_file = $real_route_path; // Usa o caminho resolvido
    }
}

// 5. Entrega o arquivo (Se validado e seguro)
if ($serve_file) {
    // Whitelist de extensões permitidas (Camada extra de segurança)
    $allowed_ext = ['html', 'xml', 'txt', 'css', 'js', 'json', 'png', 'jpg', 'jpeg', 'svg', 'ico', 'webmanifest'];
    $extension = strtolower(pathinfo($serve_file, PATHINFO_EXTENSION));

    if (!in_array($extension, $allowed_ext, true)) {
        // Bloqueia tentativas de ler .php, .env, etc dentro da dist
        http_response_code(403);
        exit;
    }

    $mime_types = [
        'html' => 'text/html; charset=UTF-8',
        'xml'  => 'application/xml; charset=UTF-8',
        'txt'  => 'text/plain; charset=UTF-8',
        'css'  => 'text/css',
        'js'   => 'application/javascript',
        'json' => 'application/json',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'webmanifest' => 'application/manifest+json'
    ];
    
    $content_type = isset($mime_types[$extension]) ? $mime_types[$extension] : 'text/html; charset=UTF-8';
    
    header('Content-Type: ' . $content_type);
    
    // Entrega o arquivo CANÔNICO (resolvido pelo realpath)
    readfile($serve_file);
    exit;
}

// 6. Fallback: Se não é estático, entrega o App React (index.html raiz)
// Como o $real_dist_path agora tem barra no final, concatenamos direto
require(get_theme_file_path('/dist/index.html'));