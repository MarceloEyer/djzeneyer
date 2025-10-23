<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * WordPress + React SPA Integration
 */
if (!defined('ABSPATH')) exit;

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0A0E27" />

  <?php 
  $theme_uri = get_template_directory_uri();
  $dist_path = get_template_directory() . '/dist/';
  
  // Lê o index.html gerado pelo Vite
  $index_html = file_get_contents($dist_path . 'index.html');
  
  // Extrai os links de CSS e JS
  preg_match_all('/<link[^>]*href="([^"]+)"[^>]*>/', $index_html, $css_matches);
  preg_match_all('/<script[^>]*src="([^"]+)"[^>]*>/', $index_html, $js_matches);
  ?>

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="<?php echo $theme_uri; ?>/dist/favicon.svg" />
  <link rel="icon" type="image/png" sizes="96x96" href="<?php echo $theme_uri; ?>/dist/favicon-96x96.png" />
  <link rel="shortcut icon" href="<?php echo $theme_uri; ?>/dist/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $theme_uri; ?>/dist/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer" />
  <link rel="manifest" href="<?php echo $theme_uri; ?>/dist/site.webmanifest" />
  
  <!-- SEO Meta Tags -->
  <title>DJ Zen Eyer | Brazilian Zouk Music Producer & Live DJ Events</title>
  <meta name="description" content="Experience exclusive Brazilian Zouk remixes by DJ Zen Eyer. Join the Zen Tribe for live events, private mixes, and connect with fellow Zouk enthusiasts worldwide." />
  <meta name="keywords" content="DJ Zen Eyer, Brazilian Zouk, Zouk music, DJ events, music producer, Zen Tribe, dance music, Latin music" />
  <meta name="author" content="DJ Zen Eyer" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="https://djzeneyer.com" />

  <!-- Search Engine Verification -->
  <meta name="yandex-verification" content="1b652f4d3070aedf" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://djzeneyer.com/" />
  <meta property="og:title" content="DJ Zen Eyer | Brazilian Zouk Music Producer & Live DJ Events" />
  <meta property="og:description" content="Experience exclusive Brazilian Zouk remixes and join live events with DJ Zen Eyer." />
  <meta property="og:image" content="https://djzeneyer.com/images/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:site_name" content="DJ Zen Eyer" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://djzeneyer.com/" />
  <meta name="twitter:title" content="DJ Zen Eyer | Brazilian Zouk Music Producer & Live DJ Events" />
  <meta name="twitter:description" content="Experience exclusive Brazilian Zouk remixes and join live events with DJ Zen Eyer." />
  <meta name="twitter:image" content="https://djzeneyer.com/images/twitter-image.jpg" />

  <!-- Performance Optimization -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com" />
  <link rel="dns-prefetch" href="//fonts.gstatic.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet" />

  <!-- CSS gerado pelo Vite -->
  <?php
  foreach ($css_matches[1] as $css_file) {
    if (strpos($css_file, '.css') !== false) {
      echo '<link rel="stylesheet" crossorigin href="' . $theme_uri . '/dist' . $css_file . '" />' . "\n";
    }
  }
  ?>

  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <?php wp_body_open(); ?>
  
  <div id="root"></div>
  
  <!-- JS gerado pelo Vite -->
  <?php
  foreach ($js_matches[1] as $js_file) {
    echo '<script type="module" crossorigin src="' . $theme_uri . '/dist' . $js_file . '"></script>' . "\n";
  }
  ?>
  
  <?php wp_footer(); ?>
</body>
</html>
