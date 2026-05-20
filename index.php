<?php
/**
 * Front to the WordPress application.
 * @package zentheme
 */

// 1. Define a base segura e garante a barra final para evitar colisão de prefixo
$dist_path = get_template_directory() . '/dist';
$real_dist_path = realpath($dist_path);

if (!$real_dist_path) {
    // Se a pasta dist não existir, falha silenciosa
    return;
}

// Garante que o caminho base termine com barra (ex: /var/www/dist/)
// Isso impede acesso a pastas irmãs como /var/www/dist_backup
$real_dist_path = rtrim($real_dist_path, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

// 2. Sanitização da URI (Remove query string, NUL bytes e decodifica)
$request_uri_raw = $_SERVER['REQUEST_URI'];
$request_uri = strtok($request_uri_raw, '?');
$request_uri = str_replace("\0", '', rawurldecode($request_uri));

// 3. Atalho: Se for um arquivo físico que NÃO está na dist (ex: wp-admin, wp-includes, uploads)
// Deixa o WordPress ou o servidor tratar diretamente.
if (preg_match('/^\/(wp-admin|wp-includes|wp-json|wp-content|wp-login)/', $request_uri)) {
    return;
}

// Se for um arquivo .php, nunca deve ser interceptado pelo SPA loader aqui.
if (str_ends_with($request_uri, '.php')) {
    return;
}

// 4. Mapeamento Inteligente (Corrige URLs completas do tema solicitadas por scripts)
// Se o URI contém o caminho do tema, removemos o prefixo para buscar na dist local.
$theme_slug = 'zentheme';
$dist_marker = '/wp-content/themes/' . $theme_slug . '/dist/';
$clean_mapped_path = $request_uri;

if (strpos($request_uri, $dist_marker) !== false) {
    $parts = explode($dist_marker, $request_uri);
    $clean_mapped_path = '/' . end($parts);
}

// 5. Definição dos candidatos (Arquivo direto ou Rota Prerender)
// Caso especial: Raiz serve o index.html da dist
if ($clean_mapped_path === '/' || $clean_mapped_path === '') {
    $clean_mapped_path = '/index.html';
}

$possible_file = $real_dist_path . ltrim($clean_mapped_path, '/');
// Rota prerender: /contato -> /contato/index.html
$possible_route = $real_dist_path . rtrim(ltrim($request_uri, '/'), '/') . '/index.html';

$serve_file = null;

// 6. Verificação de Segurança (Path Traversal Robusto)
if (file_exists($possible_file) && is_file($possible_file)) {
    $real_file_path = realpath($possible_file);
    if ($real_file_path && strpos($real_file_path, $real_dist_path) === 0) {
        $serve_file = $real_file_path;
    }
} elseif (file_exists($possible_route) && is_file($possible_route)) {
    $real_route_path = realpath($possible_route);
    if ($real_route_path && strpos($real_route_path, $real_dist_path) === 0) {
        $serve_file = $real_route_path;
    }
}

// Rotas SPA válidas sem prerender próprio (ex: dashboard) recebem o shell base.
if (!$serve_file && !empty($GLOBALS['DJZ_SPA_ROUTED'])) {
    $spa_shell = $real_dist_path . 'index.html';
    if (file_exists($spa_shell) && is_file($spa_shell)) {
        $real_spa_shell = realpath($spa_shell);
        if ($real_spa_shell && strpos($real_spa_shell, $real_dist_path) === 0) {
            $serve_file = $real_spa_shell;
        }
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

    // Caso especial: HTML (SPA Shell ou Prerenderizado)
    if ($extension === 'html') {
        $html_content = file_get_contents($serve_file);
        if ($html_content === false) {
            status_header(500);
            nocache_headers();
            exit('Failed to read SPA shell file.');
        }

        // Do not call wp_head()/wp_footer() here: prerendered Vite HTML already
        // contains the canonical SEO tags and app assets. Inject only the WP data bridge.
        $wp_data = [
            'rootUrl'  => home_url('/'),
            'siteUrl'  => site_url('/'),
            'restUrl'  => rest_url(),
            'nonce'    => wp_create_nonce('wp_rest'),
            'userId'   => get_current_user_id(),
            'themeUrl' => get_template_directory_uri(),
        ];
        $wp_data_script = '<script>window.wpData=' . wp_json_encode($wp_data, JSON_UNESCAPED_SLASHES) . ';</script>';

        if (strpos($html_content, 'window.wpData') === false) {
            $html_content = str_replace('</body>', $wp_data_script . "\n</body>", $html_content);
        }

        header('Content-Type: text/html; charset=UTF-8');
        echo $html_content;
        exit;
    }

    $mime_types = [
        'xml' => 'application/xml; charset=UTF-8',
        'txt' => 'text/plain; charset=UTF-8',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'webmanifest' => 'application/manifest+json'
    ];

    $content_type = isset($mime_types[$extension]) ? $mime_types[$extension] : 'text/html; charset=UTF-8';

    header('Content-Type: ' . $content_type);

    // Entrega o arquivo CANÔNICO (resolvido pelo realpath)
    readfile($serve_file);
    exit;
}

// 6. Fallback: se a rota não foi reconhecida como SPA válida, preserve o 404 real.
status_header(404);
nocache_headers();
get_header();
echo '<main id="content" class="container mx-auto px-4 py-24"><h1>' . esc_html__('Page not found', 'zentheme') . '</h1></main>';
get_footer();
exit;
