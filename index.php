<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Mode: React Single Page Application (CSR)
 * @package DJZenEyer
 */

if (!defined('ABSPATH')) exit;
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

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">

    <style>
        body { background-color: #0A0E27; margin: 0; font-family: 'Inter', sans-serif; }
        #root { min-height: 100vh; display: flex; flex-direction: column; }
    </style>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <div id="root"></div>
    
    <noscript>
        <div style="padding: 20px; text-align: center; color: white;">
            Você precisa habilitar o JavaScript para ver este site.
        </div>
    </noscript>

    <?php wp_footer(); ?>
</body>
</html>