<?php
/**
 * Front to the WordPress application.
 * @package zentheme
 */

// --- INÍCIO DO DEBUG ---
$debug_output = [];
$debug_output[] = "";

// 1. Limpar a URL
$request_uri = strtok($_SERVER['REQUEST_URI'], '?');
$debug_output[] = "";
$debug_output[] = "";

// 2. Definir caminhos
$theme_dir = get_template_directory();
$dist_path = $theme_dir . '/dist';

// 3. Montar caminho do arquivo esperado
$target_file = '';
if ($request_uri === '/' || $request_uri === '') {
    $target_file = $dist_path . '/index.html';
} else {
    // Garante que não duplica barras e remove barra final
    $clean_path = rtrim($request_uri, '/');
    $target_file = $dist_path . $clean_path . '/index.html';
}

$debug_output[] = "";

// 4. Verificar existência
if (file_exists($target_file)) {
    $debug_output[] = "";
    
    // Imprime o debug antes do conteúdo (vai aparecer no topo do código fonte)
    foreach ($debug_output as $line) { echo $line . "\n"; }
    
    header('Content-Type: text/html; charset=UTF-8');
    readfile($target_file);
    exit;
} else {
    $debug_output[] = "";
    $debug_output[] = "";
}

// 5. Fallback para React Padrão
$fallback_file = $dist_path . '/index.html';
$debug_output[] = "";

foreach ($debug_output as $line) { echo $line . "\n"; }

if (file_exists($fallback_file)) {
    readfile($fallback_file);
} else {
    echo "<h1>CRITICAL ERROR: dist/index.html not found.</h1>";
    echo "<p>Path tried: " . $fallback_file . "</p>";
}
?>