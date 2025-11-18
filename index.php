<?php
/**
 * DJ Zen Eyer - WordPress SPA Shell Template
 * Minimal template for React SPA
 * This template serves ONLY as a shell:
 * - Loads Vite build assets (JS/CSS)
 * - Renders React root div
 * - No HTML structure, no SEO tags (handled by React/Helmet)
 * - Static identity tags only (rel="me", bot signals)
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  
  <!-- Static Bot Identity Tags (Critical for Google, IAs, Verification) -->
  <!-- Wikidata Verification -->
  <link rel="me" href="https://www.wikidata.org/wiki/Q136551855">
  <!-- MusicBrainz Verification -->
  <link rel="me" href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154">
  <!-- ISNI Verification -->
  <link rel="me" href="https://isni.org/isni/0000000528931015">
  <!-- Official Website Link -->
  <link rel="me" href="https://djzeneyer.com">
  
  <!-- Social Media Verification -->
  <link rel="me" href="https://www.instagram.com/djzeneyer/">
  <link rel="me" href="https://www.facebook.com/djzeneyer/">
  <link rel="me" href="https://twitter.com/djzeneyer">
  <link rel="me" href="https://www.youtube.com/@djzeneyer">
  <link rel="me" href="https://soundcloud.com/djzeneyer">
  <link rel="me" href="https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw">
  <link rel="me" href="https://music.apple.com/artist/1439280950">
  
  <!-- Geo-Location -->
  <meta name="geo.placename" content="Rio de Janeiro, Brazil">
  <meta name="geo.region" content="BR-RJ">
  <meta name="geo.position" content="-22.9068;-43.1729">
  
  <!-- Apple/iOS Tags -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="icon" type="image/png" href="/favicon.png">
  
  <!-- Theme Color -->
  <meta name="theme-color" content="#1a1a2e">
  <meta name="msapplication-TileColor" content="#1a1a2e">
  
  <!-- Bot Directives -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  
  <!-- Preconnect to Essential Services -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  <link rel="dns-prefetch" href="https://open.spotify.com">
  <link rel="dns-prefetch" href="https://music.apple.com">
  
  <!-- Manifest for PWA -->
  <link rel="manifest" href="/site.webmanifest">
  
  <!-- WordPress Head Hooks (Vite Build + Theme Styles) -->
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <!-- WordPress Body Open Hook -->
  <?php wp_body_open(); ?>
  
  <!-- React Root Element for SPA -->
  <div id="root"></div>
  
  <!-- WordPress Footer Hook (Vite Scripts Injected Here) -->
  <?php wp_footer(); ?>
</body>
</html>