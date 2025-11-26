<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Optimized for React SPA + SEO + AI Crawlers + Performance LCP
 * @package DJZenEyer
 */

if (!defined('ABSPATH')) exit;

// ============================================================================
// 1. LÓGICA DE ARQUIVOS ESTÁTICOS (SSG) - O "TURBO" PARA SEO
// ============================================================================
// Verifica se existe um arquivo HTML pronto para esta URL.
// Se existir, entrega ele direto (Google ama isso: H1 e Texto prontos).
// ============================================================================

$request_uri = strtok($_SERVER['REQUEST_URI'], '?');
$dist_path = get_template_directory() . '/dist';

// Mapeia a URL para o arquivo físico
$static_file = ($request_uri === '/' || $request_uri === '') 
    ? $dist_path . '/index.html' 
    : $dist_path . untrailingslashit($request_uri) . '/index.html';

// Se o arquivo estático existe, serve ele e encerra o PHP.
if (file_exists($static_file)) {
    // Define o Content-Type correto
    header('Content-Type: text/html; charset=UTF-8');
    readfile($static_file);
    exit;
}

// ============================================================================
// 2. FALLBACK (SEU CÓDIGO ORIGINAL) - O "ESQUELETO" BONITO
// ============================================================================
// Se não houver arquivo estático, carrega o shell padrão para o React assumir.
// Mantivemos seus ícones, fontes e estilos críticos aqui.
// ============================================================================
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">

    <style>
        body { background-color: #0A0E27; margin: 0; font-family: 'Inter', sans-serif; }
        h1, .font-display { font-family: 'Orbitron', sans-serif; }
    </style>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="root"></div>
    
    <?php wp_footer(); ?>
</body>
</html>