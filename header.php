<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <?php
    // Carrega React App dinamicamente
    $dist_path = get_template_directory() . '/dist';
    $dist_url = get_template_directory_uri() . '/dist';
    
    // Verifica se existe manifest.json (melhor prática)
    $manifest_file = $dist_path . '/manifest.json';
    if (file_exists($manifest_file)) {
        $manifest = json_decode(file_get_contents($manifest_file), true);
        $main_js = $manifest['src/main.jsx']['file'] ?? 'assets/index.js';
    } else {
        // Fallback: procura por index-*.js
        $js_files = glob($dist_path . '/assets/index-*.js');
        $main_js = !empty($js_files) ? 'assets/' . basename($js_files[0]) : 'assets/index.js';
    }
    ?>
    
    <script type="module" crossorigin src="<?php echo $dist_url . '/' . $main_js; ?>"></script>
    
    <?php wp_head(); ?>
    
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" sizes="120x120" href="/favicon-120.png">
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="root"></div>
