<?php
/**
 * Header DJ Zen Eyer - v4.3.2 LEAN
 * 🎯 Font Preload + AVIF + Client Hints + Dynamic Schema
 * 🤖 AI Tags APENAS onde relevante (sem dupes com SEO.tsx)
 * ♿ Full A11y + Performance
 */
if (!defined('ABSPATH')) exit;
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> itemscope itemtype="https://schema.org/WebPage">
<head>
  <!-- CHARSET & SECURITY -->
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="google" content="notranslate">
  <meta name="format-detection" content="telephone=no">

  <!-- VIEWPORT -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <!-- 🖼️ IMAGE SUPPORT -->
  <meta name="supported-image-formats" content="AVIF, WebP, PNG, JPEG, SVG">

  <!-- 📱 CLIENT HINTS -->
  <meta http-equiv="Accept-CH" content="DPR, Viewport-Width, Width">

  <!-- CSP NONCE -->
  <meta name="csp-nonce" content="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">

  <!-- 🤖 AI METADATA - APENAS TAGS GLOBAIS -->
  <meta name="ai:context" content="<?php echo esc_attr(djz_ai_context()); ?>">
  <meta name="ai:tags" content="<?php echo esc_attr(djz_ai_tags()); ?>">
  <meta name="ai:summary" content="<?php echo esc_attr(djz_config('site.description')); ?>"> <!-- NOVO -->

  <!-- AI Content Type (CONTEXT-SPECIFIC) -->
  <?php if (is_singular('event')): ?>
    <meta name="ai:content-type" content="event">
  <?php elseif (is_singular('post') && has_tag('musica')): ?>
    <meta name="ai:content-type" content="music">
  <?php elseif (function_exists('is_product') && is_product()): ?>
    <meta name="ai:content-type" content="product">
  <?php else: ?>
    <meta name="ai:content-type" content="page">
  <?php endif; ?>

  <!-- All bots: index, follow (uniform) -->
  <meta name="GPTBot" content="index, follow">
  <meta name="Google-Extended" content="index, follow">
  <meta name="PerplexityBot" content="index, follow">
  <meta name="ClaudeBot" content="index, follow">

  <!-- 🔍 SEO (delegated to SEO.tsx) -->
  <link rel="canonical" href="<?php echo esc_url(djz_canonical_url()); ?>">

  <!-- hreflang -->
  <?php $is_portuguese = strpos($_SERVER['REQUEST_URI'], '/pt') === 0; ?>
  <?php if ($is_portuguese): ?>
    <link rel="alternate" hreflang="pt-BR" href="<?php echo esc_url(home_url('/pt/')); ?>">
    <link rel="alternate" hreflang="en" href="<?php echo esc_url(home_url('/')); ?>">
  <?php else: ?>
    <link rel="alternate" hreflang="en" href="<?php echo esc_url(home_url('/')); ?>">
    <link rel="alternate" hreflang="pt-BR" href="<?php echo esc_url(home_url('/pt/')); ?>">
  <?php endif; ?>

  <!-- 🎵 DYNAMIC SCHEMA.ORG -->
  <script type="application/ld+json">
    <?php echo wp_json_encode(djz_schema_org(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>
  </script>

  <!-- Schema: EVENT -->
  <?php if (is_singular('event') || (is_singular('post') && has_term('events', 'category'))):
    $event_schema = djz_schema_event();
    if (!empty($event_schema)):
  ?>
  <script type="application/ld+json">
    <?php echo wp_json_encode($event_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>
  </script>
  <?php endif; endif; ?>

  <!-- Schema: MUSIC -->
  <?php if (is_singular('post') && has_tag('musica')):
    $music_schema = djz_schema_music_recording();
    if (!empty($music_schema)):
  ?>
  <script type="application/ld+json">
    <?php echo wp_json_encode($music_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>
  </script>
  <?php endif; endif; ?>

  <!-- Schema: PRODUCT (WooCommerce) -->
  <?php if (function_exists('is_product') && is_product()):
    $product_schema = djz_schema_woocommerce_product();
    if (!empty($product_schema)):
  ?>
  <script type="application/ld+json">
    <?php echo wp_json_encode($product_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>
  </script>
  <?php endif; endif; ?>

  <!-- PWA -->
  <link rel="manifest"
        href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/manifest.webmanifest"
        crossorigin="anonymous"> <!-- Ajustado: crossorigin="anonymous" -->

  <!-- FAVICONS (com sizes) -->
  <link rel="icon" type="image/svg+xml" href="<?php echo esc_url(djz_image('favicon')); ?>">
  <link rel="icon" type="image/png" sizes="192x192" href="<?php echo esc_url(djz_image('favicon_png')); ?>">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url(djz_image('favicon_png')); ?>">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(djz_image('apple_touch')); ?>">

  <!-- ⚡ PERFORMANCE: FONTS PRELOAD (com variáveis) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload"
        href="<?php echo esc_url(djz_config('fonts.orbitron')); ?>"
        as="font" type="font/woff2" crossorigin>
  <link rel="preload"
        href="<?php echo esc_url(djz_config('fonts.inter')); ?>"
        as="font" type="font/woff2" crossorigin>

  <!-- Critical CSS -->
  <link rel="preload"
        href="<?php echo esc_url(get_template_directory_uri() . '/dist/css/critical.css'); ?>"
        as="style" crossorigin>

  <!-- Modulepreload para Vite (NOVO) -->
  <?php if ($main_js): ?>
    <link rel="modulepreload" href="<?php echo esc_url($main_js); ?>" as="script" crossorigin>
  <?php endif; ?>

  <!-- 🔗 RESOURCE HINTS (LEAN) -->
  <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
  <link rel="dns-prefetch" href="https://i.ytimg.com">
  <link rel="dns-prefetch" href="https://open.spotify.com">
  <link rel="dns-prefetch" href="https://www.instagram.com">

  <!-- Preconnect only critical -->
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>

  <!-- Analytics DNS -->
  <?php if (djz_config('analytics.google_analytics')): ?>
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <?php endif; ?>

  <!-- 📊 ANALYTICS (com async defer) -->
  <?php if (djz_config('analytics.google_analytics')): ?>
    <script async defer src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr(djz_config('analytics.google_analytics')); ?>"></script>
    <script nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '<?php echo esc_attr(djz_config('analytics.google_analytics')); ?>', {
        'anonymize_ip': true
      });
    </script>
  <?php endif; ?>

  <!-- WP Head -->
  <?php wp_head(); ?>

  <!-- CRITICAL STYLES -->
  <style nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
    html { visibility: visible; opacity: 1; }
    /* Skip Link A11y */
    .skip-link {
      position: absolute; left: -999999px; top: -999999px; z-index: -1;
      background: <?php echo esc_attr(djz_theme_color('primary')); ?>; color: #fff;
      padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 4px;
      font-weight: 600; font-size: 14px;
    }
    .skip-link:focus, .skip-link:focus-visible {
      left: 10px; top: 10px; z-index: 999999;
    }
    .screen-reader-text {
      clip: rect(1px, 1px, 1px, 1px); position: absolute !important;
      height: 1px; width: 1px; overflow: hidden;
    }
  </style>
</head>
<body <?php body_class('bg-dark text-light'); ?>>
  <?php wp_body_open(); ?>
  <!-- Skip Link (A11y) -->
  <a class="skip-link" href="#main-content" tabindex="1" role="navigation">
    <?php esc_html_e('Pular para conteúdo', 'djzeneyer'); ?>
  </a>
  <!-- HEADER -->
  <header id="masthead" class="site-header" role="banner">
    <div class="container-fluid">
      <?php if (locate_template('template-parts/header/site-branding.php')): ?>
        <?php get_template_part('template-parts/header/site', 'branding'); ?>
      <?php endif; ?>
      <?php if (locate_template('template-parts/header/site-nav.php')): ?>
        <?php get_template_part('template-parts/header/site', 'nav'); ?>
      <?php endif; ?>
    </div>
  </header>
  <!-- MAIN -->
  <div id="page" class="site">
    <main id="main-content" class="site-content" role="main">
