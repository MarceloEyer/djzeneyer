<?php
/**
 * Header Template - DJ Zen Eyer Theme
 * Configura o cabeçalho HTML, preloads e estilos críticos para a transição do React.
 * Versão Definitiva: SEO White Hat + Performance Otimizada
 */
$theme_uri = get_template_directory_uri();
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <link rel="me" href="https://www.wikidata.org/wiki/Q136551855">
    <link rel="me" href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154">
    <link rel="me" href="https://www.instagram.com/djzeneyer/">
    <link rel="me" href="https://soundcloud.com/djzeneyer">
    
    <link rel="icon" type="image/svg+xml" href="<?php echo esc_url($theme_uri); ?>/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="<?php echo esc_url($theme_uri); ?>/favicon-96x96.png">
    
    <link rel="preload" as="image" href="/images/hero-background.webp" fetchpriority="high">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap">

    <style>
        /* 0. ESCONDE ADMIN BAR (aparece sem estilo e quebra o layout) */
        #wpadminbar {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
        }

        html {
            margin-top: 0 !important;
        }

        /* 1. Reset e Fundo Escuro */
        body {
            background-color: #0A0E27;
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            color: white;
            overflow-x: hidden;
        }

        /* 2. Centralizar o conteúdo de fallback */
        #root {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
            z-index: 1;
        }

        .ssr-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            text-align: center;
        }

        .ssr-content h1 {
            font-family: 'Orbitron', sans-serif;
            margin-bottom: 1rem;
        }

        /* Estilo para texto extra de SEO (se usado) */
        .seo-text {
            text-align: left;
            margin-top: 40px;
            opacity: 0.8;
            font-size: 0.9rem;
            line-height: 1.6;
        }

        /* 3. Estilo dos Links (Botões bonitos em vez de texto azul) */
        .ssr-links {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 30px;
            flex-wrap: wrap;
        }

        .ssr-links a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            font-size: 14px;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 30px;
            transition: all 0.2s;
            background: rgba(255,255,255,0.05);
        }

        .ssr-links a:hover {
            background: rgba(255,255,255,0.2);
            border-color: white;
            color: white;
        }

        /* 4. Esconde o PHP assim que o React avisa que carregou */
        body.react-loaded .ssr-content {
            display: none !important;
        }

        /* 5. Esconde elementos do WordPress que aparecem sem estilo */
        .wp-block-post-title,
        .wp-block-post-content,
        .entry-content,
        .entry-title {
            display: none !important;
        }
    </style>

    <?php 
    /* * wp_head() é CRÍTICO. 
     * Ele carrega os estilos, scripts e as meta tags geradas pelo plugin Zen SEO Lite.
     * NÃO REMOVA.
     */
    wp_head(); 
    ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="root">
        <div class="ssr-content">
            <h1>Zen Eyer | 2x World Champion - Brazilian Zouk DJ & Producer</h1>
            
            <p>Official website of DJ Zen Eyer. Experience the "cremosidade" in Brazilian Zouk, check upcoming tour dates, events, and exclusive remixes.</p>
            
            <div class="ssr-links">
                <a href="/events">Events & Tour Dates</a>
                <a href="/music">Music & Remixes</a>
                <a href="/shop">Shop</a>
                <a href="/zentribe">Zen Tribe Community</a>
                <a href="/work-with-me">Bookings</a>
            </div>

            <div class="seo-text">
                <p>Welcome to the official world of DJ Zen Eyer. From Zouk Congresses to intimate marathons, find the best energy for your dance.</p>
            </div>
        </div>
        
        ```