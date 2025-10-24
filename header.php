<?php
/**
 * Header do Tema DJ Zen Eyer
 * Inclui meta tags, favicons, manifest PWA e compatibilidade com SEO/IA
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#0A0E27">
  <meta name="robots" content="index, follow">

  <!-- Essential SEO Meta Tags -->
  <?php wp_head(); ?>

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="<?php echo get_template_directory_uri(); ?>/dist/favicon.svg">
  <link rel="icon" type="image/png" sizes="96x96" href="<?php echo get_template_directory_uri(); ?>/dist/favicon-96x96.png">
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.webmanifest">

  <!-- iOS Safari -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer">
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>