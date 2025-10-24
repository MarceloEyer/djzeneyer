<?php
/**
 * Header DJ Zen Eyer - Otimizado para SEO, IA, PWA e Performance
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> itemscope itemtype="https://schema.org/WebPage">
<head>
  <!-- Meta Básicos -->
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0A0E27">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="google" content="notranslate"> <!-- Evita tradução automática -->

  <!-- SEO Avançado -->
  <title itemprop="name"><?php wp_title('|', true, 'right'); bloginfo('name'); ?></title>
  <meta name="description" content="<?php bloginfo('description'); ?>">
  <meta property="og:site_name" content="<?php bloginfo('name'); ?>">
  <meta property="og:type" content="website">
  <meta property="og:url" content="<?php echo esc_url(home_url()); ?>">
  <meta property="og:locale" content="pt_BR">
  <?php if (is_single()): ?>
    <meta property="og:title" content="<?php the_title(); ?> | <?php bloginfo('name'); ?>">
    <meta property="og:description" content="<?php echo esc_attr(get_the_excerpt()); ?>">
    <meta property="og:image" content="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(), 'large')); ?>">
    <meta property="article:published_time" content="<?php echo get_the_date('c'); ?>">
    <meta property="article:modified_time" content="<?php echo get_the_modified_date('c'); ?>">
    <meta property="article:author" content="DJ Zen Eyer">
  <?php endif; ?>

  <!-- Schema.org (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "DJ Zen Eyer",
    "url": "<?php echo esc_url(home_url()); ?>",
    "sameAs": [
      "https://www.instagram.com/djzeneyer",
      "https://www.facebook.com/djzeneyer",
      "https://www.youtube.com/@djzeneyer",
      "https://open.spotify.com/artist/SEU_ID_SPOTIFY"
    ],
    "jobTitle": "DJ e Produtor Musical",
    "description": "<?php echo esc_attr(get_bloginfo('description')); ?>",
    "image": "<?php echo esc_url(get_template_directory_uri()); ?>/dist/images/dj-zen-eyer-og.jpg",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "<?php echo esc_url(home_url()); ?>"
    }
  }
  </script>

  <!-- PWA & Mobile -->
  <link rel="manifest" href="<?php echo get_template_directory_uri(); ?>/dist/manifest.webmanifest" crossorigin="use-credentials">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer">

  <!-- Favicons -->
  <link rel="icon" type="image/svg+xml" href="<?php echo get_template_directory_uri(); ?>/dist/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo get_template_directory_uri(); ?>/dist/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="<?php echo get_template_directory_uri(); ?>/dist/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo get_template_directory_uri(); ?>/dist/apple-touch-icon.png">

  <!-- Preload/Preconnect -->
  <?php if (is_front_page()): ?>
    <link rel="preload" href="<?php echo get_template_directory_uri(); ?>/dist/css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <?php endif; ?>

  <!-- IA/Bots Optimization -->
  <meta name="ai:context" content="DJ Zen Eyer é um DJ e produtor musical brasileiro, conhecido por seu estilo inovador e performances gamificadas.">
  <meta name="ai:tag" content="DJ, Música Eletrônica, Gamificação, GamiPress, WordPress Headless">

  <!-- WordPress Head -->
  <?php wp_head(); ?>
</head>
<body <?php body_class('bg-dark text-light'); ?>>
  <?php wp_body_open(); ?>
