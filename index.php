<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Optimized for React SPA + SEO Authority + LCP Performance
 * @package DJZenEyer
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer">

    <link rel="me" href="https://www.wikidata.org/wiki/Q136551855">
    <link rel="me" href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154">
    <link rel="me" href="https://isni.org/isni/0000000528931015">
    <link rel="me" href="https://artists.bandsintown.com/artists/15619775">
    <link rel="me" href="https://www.instagram.com/djzeneyer/">
    <link rel="me" href="https://facebook.com/djzeneyer">
    <link rel="me" href="https://youtube.com/@djzeneyer">
    <link rel="me" href="https://soundcloud.com/djzeneyer">
    <link rel="me" href="https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw">
    
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="geo.region" content="BR-RJ">
    <meta name="geo.placename" content="Niterói">
    <meta name="geo.position" content="-22.8833;-43.1036">
    
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