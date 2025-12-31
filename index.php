<?php
/**
 * Front to the WordPress application.
 *
 * @package zentheme
 */

// 1. Descobrir qual rota o usuário está acessando
$request_uri = strtok($_SERVER['REQUEST_URI'], '?');

// 2. Definir onde os arquivos estáticos vivem
$dist_path = get_template_directory() . '/dist';
$static_file = null;

// 3. Mapear a rota para o arquivo físico
if ($request_uri === '/' || $request_uri === '') {
    $static_file = $dist_path . '/index.html';
} else {
    // Remove barra final se tiver, para evitar /events//index.html
    $clean_uri = rtrim($request_uri, '/');
    $static_file = $dist_path . $clean_uri . '/index.html';
}

// 4. O PULO DO GATO: Se o arquivo estático existe, entregue ELE!
if ($static_file && file_exists($static_file)) {
    // Mantém os headers de cache corretos
    header('Content-Type: text/html; charset=UTF-8');
    readfile($static_file);
    exit; // Encerra o PHP aqui. Não carrega mais nada.
}

// 5. Fallback: Se não achou estático, carrega o index.html padrão (React Shell)
// Isso acontece em páginas que não pré-renderizamos (ex: /shop, admin, etc)
$fallback_file = $dist_path . '/index.html';
if (file_exists($fallback_file)) {
    readfile($fallback_file);
} else {
    echo "Erro crítico: O Frontend não foi compilado. Verifique a pasta dist.";
}
?>