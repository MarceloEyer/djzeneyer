<?php
/**
 * Header DJ Zen Eyer - v4.0 FINAL (CENTRALIZADO)
 * 🎯 Todas as configurações vêm de inc/djz-config.php
 * 
 * @package DJZenEyerTheme
 * @version 4.0.0
 * @updated 2025-10-30 10:18
 * @author DJ Zen Eyer Team
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> itemscope itemtype="https://schema.org/WebPage">
<head>
  <!-- =====================================================
       META TAGS BÁSICOS (SEO + Performance)
       ===================================================== -->
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="google" content="notranslate">

  <!-- =====================================================
       🔒 CSP NONCE (DO PLUGIN PHP - CRÍTICO!)
       ===================================================== -->
  <meta name="csp-nonce" content="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
  <meta name="csp-source" content="djzeneyer-csp-plugin">

  <!-- =====================================================
       SEO AVANÇADO (CENTRALIZADO)
       ===================================================== -->
  <title><?php echo esc_html(djz_seo_title()); ?></title>
  <meta name="description" content="<?php echo djz_meta_description(get_the_ID()); ?>">
  <link rel="canonical" href="<?php echo djz_canonical_url(); ?>">

  <!-- =====================================================
       OPEN GRAPH (CENTRALIZADO)
       ===================================================== -->
  <meta property="og:site_name" content="<?php echo esc_attr(djz_config('site.name')); ?>">
  <meta property="og:type" content="<?php echo is_single() ? 'article' : 'website'; ?>">
  <meta property="og:url" content="<?php echo djz_canonical_url(); ?>">
  <meta property="og:locale" content="<?php echo esc_attr(djz_config('site.locale')); ?>">
  <meta property="og:title" content="<?php echo esc_attr(djz_seo_title()); ?>">
  <meta property="og:description" content="<?php echo djz_meta_description(get_the_ID()); ?>">
  <meta property="og:image" content="<?php echo djz_og_image(get_the_ID()); ?>">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  
  <?php if (is_single()): ?>
    <meta property="article:published_time" content="<?php echo get_the_date('c'); ?>">
    <meta property="article:modified_time" content="<?php echo get_the_modified_date('c'); ?>">
    <meta property="article:author" content="<?php echo esc_attr(djz_config('site.name')); ?>">
    <meta name="author" content="<?php echo esc_attr(djz_config('site.name')); ?>">
  <?php endif; ?>

  <!-- =====================================================
       TWITTER CARDS (CENTRALIZADO)
       ===================================================== -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="<?php echo esc_attr(djz_config('social.twitter_handle')); ?>">
  <meta name="twitter:creator" content="<?php echo esc_attr(djz_config('social.twitter_handle')); ?>">
  <meta name="twitter:title" content="<?php echo esc_attr(djz_seo_title()); ?>">
  <meta name="twitter:description" content="<?php echo djz_meta_description(get_the_ID()); ?>">
  <meta name="twitter:image" content="<?php echo djz_og_image(get_the_ID()); ?>">

  <!-- =====================================================
       SCHEMA.ORG (JSON-LD) - CENTRALIZADO
       ===================================================== -->
  <script type="application/ld+json">
<?php echo wp_json_encode(djz_schema_org(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); ?>
  </script>

  <!-- =====================================================
       PWA + MOBILE OPTIMIZATION
       ===================================================== -->
  <link rel="manifest" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/manifest.webmanifest" crossorigin="use-credentials">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="<?php echo esc_attr(djz_config('site.name')); ?>">
  <meta name="mobile-web-app-capable" content="yes">

  <!-- =====================================================
       FAVICONS (CENTRALIZADO)
       ===================================================== -->
  <link rel="icon" type="image/svg+xml" href="<?php echo djz_image('favicon'); ?>">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo djz_image('favicon_png'); ?>">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo djz_image('apple_touch'); ?>">
  <link rel="mask-icon" href="<?php echo djz_image('favicon'); ?>" color="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="msapplication-TileColor" content="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="msapplication-TileImage" content="<?php echo djz_image('mstile'); ?>">

  <!-- =====================================================
       PRELOAD/PRECONNECT (Performance Critical)
       ===================================================== -->
  <?php if (is_front_page()): ?>
    <link rel="preload" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/css/main.css" as="style">
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://i.ytimg.com">
    <?php if (djz_config('analytics.google_analytics')): ?>
      <link rel="dns-prefetch" href="https://www.google-analytics.com">
    <?php endif; ?>
  <?php endif; ?>

  <!-- =====================================================
       OTIMIZAÇÃO PARA IA/BOTS (CENTRALIZADO)
       ===================================================== -->
  <meta name="ai:context" content="<?php echo djz_ai_context(); ?>">
  <meta name="ai:tag" content="<?php echo djz_ai_tags(); ?>">
  <meta name="ai:bot" content="<?php echo esc_attr(djz_config('ai.bot_policy')); ?>">

  <!-- =====================================================
       WORDPRESS HEAD (plugins, styles, scripts)
       ===================================================== -->
  <?php wp_head(); ?>
</head>

<body <?php body_class('bg-dark text-light'); ?> data-csp-nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
  <?php wp_body_open(); ?>

  <!-- =====================================================
       A11Y: Skip Link (Acessibilidade)
       ===================================================== -->
  <a class="skip-link screen-reader-text" href="#main-content">
    <?php esc_html_e('Pular para o conteúdo', 'djzeneyer'); ?>
  </a>

  <!-- =====================================================
       HEADER SEMÂNTICO (Landmark ARIA)
       ===================================================== -->
  <header id="masthead" class="site-header" role="banner" itemscope itemtype="https://schema.org/WPHeader">
    <div class="container">
      <?php get_template_part('template-parts/header/site', 'branding'); ?>
      <?php get_template_part('template-parts/header/site', 'nav'); ?>
    </div>
  </header>

  <!-- =====================================================
       MAIN CONTENT (Landmark ARIA)
       ===================================================== -->
  <div id="page" class="site">
    <main id="main-content" class="site-content" role="main" aria-label="<?php esc_attr_e('Conteúdo principal', 'djzeneyer'); ?>">
