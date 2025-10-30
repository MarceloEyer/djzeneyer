<?php
/**
 * Header DJ Zen Eyer - v3.1 (CORRIGIDO)
 * @package DJZenEyerTheme
 * @version 3.1
 * @author DJ Zen Eyer Team
 * @updated 2025-10-30 10:04
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> itemscope itemtype="https://schema.org/WebPage">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0A0E27">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="google" content="notranslate">

  <!-- CSP NONCE -->
  <meta name="csp-nonce" content="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
  <meta name="csp-source" content="djzeneyer-csp-plugin">

  <!-- SEO BÁSICO -->
  <title itemprop="name"><?php wp_title('|', true, 'right'); bloginfo('name'); ?></title>
  <meta name="description" content="<?php echo is_single() || is_page() ? esc_attr(wp_strip_all_tags(get_the_excerpt())) : bloginfo('description'); ?>">
  
  <!-- CANONICAL (CORRIGIDO) -->
  <link rel="canonical" href="<?php echo esc_url(is_front_page() ? home_url('/') : (is_singular() ? get_permalink() : home_url('/'))); ?>">

  <!-- OPEN GRAPH (OTIMIZADO) -->
  <meta property="og:site_name" content="<?php bloginfo('name'); ?>">
  <meta property="og:type" content="<?php echo is_single() ? 'article' : 'website'; ?>">
  <meta property="og:url" content="<?php echo esc_url(is_front_page() ? home_url('/') : get_permalink()); ?>">
  <meta property="og:locale" content="<?php echo (get_locale() === 'pt_BR') ? 'pt_BR' : 'en_US'; ?>">
  <meta property="og:title" content="<?php echo is_single() || is_page() ? get_the_title() . ' | ' . get_bloginfo('name') : get_bloginfo('name'); ?>">
  <meta property="og:description" content="<?php echo is_single() || is_page() ? esc_attr(wp_strip_all_tags(get_the_excerpt())) : get_bloginfo('description'); ?>">
  
  <?php 
  $og_image = (is_single() || is_page()) && has_post_thumbnail() 
    ? get_the_post_thumbnail_url(get_the_ID(), 'large') 
    : get_template_directory_uri() . '/dist/images/dj-zen-eyer-og.jpg';
  ?>
  <meta property="og:image" content="<?php echo esc_url($og_image); ?>">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  
  <?php if (is_single()): ?>
    <meta property="article:published_time" content="<?php echo get_the_date('c'); ?>">
    <meta property="article:modified_time" content="<?php echo get_the_modified_date('c'); ?>">
    <meta property="article:author" content="DJ Zen Eyer">
    <meta name="author" content="DJ Zen Eyer">
  <?php endif; ?>

  <!-- TWITTER CARDS -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@djzeneyer">
  <meta name="twitter:creator" content="@djzeneyer">
  <meta name="twitter:title" content="<?php echo is_single() || is_page() ? get_the_title() : get_bloginfo('name'); ?>">
  <meta name="twitter:description" content="<?php echo is_single() || is_page() ? esc_attr(wp_strip_all_tags(get_the_excerpt())) : get_bloginfo('description'); ?>">
  <meta name="twitter:image" content="<?php echo esc_url($og_image); ?>">

  <!-- SCHEMA.ORG JSON-LD (CORRIGIDO) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "<?php echo esc_url(home_url()); ?>#person",
        "name": "DJ Zen Eyer",
        "url": "<?php echo esc_url(home_url()); ?>",
        "sameAs": [
          "https://www.instagram.com/djzeneyer",
          "https://www.facebook.com/djzeneyer",
          "https://www.youtube.com/@djzeneyer",
          "https://open.spotify.com/artist/<?php echo esc_attr(get_theme_mod('djzeneyer_spotify_id', 'SEU_ID_AQUI')); ?>",
          "https://www.mixcloud.com/djzeneyer",
          "https://www.tiktok.com/@djzeneyer"
        ],
        "jobTitle": "DJ e Produtor Musical",
        "description": "<?php echo esc_attr(wp_strip_all_tags(get_bloginfo('description'))); ?>",
        "image": {
          "@type": "ImageObject",
          "url": "<?php echo esc_url(get_template_directory_uri()); ?>/dist/images/dj-zen-eyer-og.jpg",
          "width": 1200,
          "height": 630
        }
      },
      {
        "@type": "WebSite",
        "@id": "<?php echo esc_url(home_url()); ?>#website",
        "url": "<?php echo esc_url(home_url()); ?>",
        "name": "<?php bloginfo('name'); ?>",
        "description": "<?php bloginfo('description'); ?>",
        "inLanguage": "<?php echo (get_locale() === 'pt_BR') ? 'pt-BR' : 'en-US'; ?>",
        "publisher": { "@id": "<?php echo esc_url(home_url()); ?>#person" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "<?php echo esc_url(home_url()); ?>?s={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "<?php echo esc_url(is_front_page() ? home_url('/') : get_permalink()); ?>#webpage",
        "url": "<?php echo esc_url(is_front_page() ? home_url('/') : get_permalink()); ?>",
        "name": "<?php echo is_single() || is_page() ? get_the_title() : get_bloginfo('name'); ?>",
        "description": "<?php echo is_single() || is_page() ? esc_attr(wp_strip_all_tags(get_the_excerpt())) : get_bloginfo('description'); ?>",
        "datePublished": "<?php echo is_single() ? get_the_date('c') : get_bloginfo('start_date', 'c'); ?>",
        "dateModified": "<?php echo is_single() ? get_the_modified_date('c') : current_time('c'); ?>",
        "isPartOf": { "@id": "<?php echo esc_url(home_url()); ?>#website" },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "<?php echo esc_url($og_image); ?>",
          "width": 1200,
          "height": 630
        }
      }
    ]
  }
  </script>

  <!-- PWA -->
  <link rel="manifest" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/manifest.webmanifest" crossorigin="use-credentials">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer">
  <meta name="mobile-web-app-capable" content="yes">

  <!-- FAVICONS -->
  <link rel="icon" type="image/svg+xml" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/favicon.svg">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/apple-touch-icon.png">

  <!-- PRELOAD/PRECONNECT -->
  <?php if (is_front_page()): ?>
    <link rel="preload" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/css/main.css" as="style">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  <?php endif; ?>

  <!-- IA OPTIMIZATION -->
  <meta name="ai:context" content="DJ Zen Eyer é um DJ e produtor musical brasileiro especializado em Brazilian Zouk, conhecido por performances gamificadas e uso inovador de tecnologia em shows ao vivo.">
  <meta name="ai:tag" content="DJ, Música Eletrônica, Brazilian Zouk, Gamificação, WordPress Headless, React">
  <meta name="ai:bot" content="all">

  <?php wp_head(); ?>
</head>

<body <?php body_class('bg-dark text-light'); ?> data-csp-nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
  <?php wp_body_open(); ?>

  <a class="skip-link" href="#main-content"><?php esc_html_e('Pular para o conteúdo', 'djzeneyer'); ?></a>

  <header id="masthead" class="site-header" role="banner" itemscope itemtype="https://schema.org/WPHeader">
    <div class="container">
      <?php get_template_part('template-parts/header/site', 'branding'); ?>
      <?php get_template_part('template-parts/header/site', 'nav'); ?>
    </div>
  </header>

  <div id="page" class="site">
    <div id="content" class="site-content" role="main">
