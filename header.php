<?php
/**
 * Header Template - DJ Zen Eyer Theme
 * Configura o cabeçalho HTML, preloads e estilos críticos.
 * @version 3.1.0 (Clean & Final)
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
        /* CSS Crítico */
        #wpadminbar { display: none !important; }
        html { margin-top: 0 !important; }
        
        body {
            background-color: #0A0E27;
            margin: 0; padding: 0;
            font-family: 'Inter', sans-serif;
            color: white;
            overflow-x: hidden;
        }

        #root {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* Estilos do Fallback SSR */
        .ssr-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 20px;
            text-align: center;
        }
        
        .ssr-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2.5rem;
            margin-bottom: 1rem;
            line-height: 1.2;
        }

        .ssr-links {
            display: flex; gap: 15px;
            justify-content: center; flex-wrap: wrap;
            margin-top: 30px;
        }

        .ssr-links a {
            color: rgba(255,255,255,0.8);
            text-decoration: none;
            border: 1px solid rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 30px;
            transition: all 0.2s;
        }

        /* Esconde elementos nativos do WP */
        .wp-block-post-title, .wp-block-post-content, .entry-content, .entry-title {
            display: none !important;
        }
    </style>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    ```