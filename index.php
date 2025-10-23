<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * WordPress + React SPA Integration
 */
if (!defined('ABSPATH')) exit;

$theme_uri = get_template_directory_uri();
$dist_path = get_template_directory() . '/dist';

// Procura arquivos CSS e JS gerados pelo Vite
$css_files = glob($dist_path . '/assets/*.css');
$js_files = glob($dist_path . '/assets/index-*.js');

// Pega o primeiro arquivo encontrado
$main_css = !empty($css_files) ? '/dist/assets/' . basename($css_files[0]) : '';
$main_js = !empty($js_files) ? '/dist/assets/' . basename($js_files[0]) : '';

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0A0E27" />

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
  <?php if ($main_css): ?>
  <link rel="stylesheet" crossorigin href="<?php echo $theme_uri . $main_css; ?>" />
  <?php endif; ?>

  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
  <?php wp_body_open(); ?>
  
  <div id="root"></div>
  
  <!-- JS gerado pelo Vite -->
  <?php if ($main_js): ?>
  <script type="module" crossorigin src="<?php echo $theme_uri . $main_js; ?>"></script>
  <?php endif; ?>
  
  <?php wp_footer(); ?>
</body>
</html>
