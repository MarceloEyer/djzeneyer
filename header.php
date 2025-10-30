<?php
/**
 * Header DJ Zen Eyer - v4.1 FINAL (AI & SEO OPTIMIZED)
 * 🎯 Todas as configurações vêm de inc/djz-config.php
 * 🤖 Otimizado para Google, ChatGPT, Claude, Perplexity
 * 
 * @package DJZenEyerTheme
 * @version 4.1.0
 * @updated 2025-10-30 13:16:00
 * @author DJ Zen Eyer Team
 */

if (!defined('ABSPATH')) {
    exit; // Segurança
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> itemscope itemtype="https://schema.org/WebPage" data-version="4.1">
<head>
  <!-- =====================================================
       🔐 CHARSET & SECURITY (CRÍTICO)
       ===================================================== -->
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="google" content="notranslate">
  <meta name="format-detection" content="telephone=no">

  <!-- =====================================================
       📱 VIEWPORT & THEME COLOR
       ===================================================== -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="msapplication-navbutton-color" content="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

  <!-- =====================================================
       🔒 CSP NONCE (DO PLUGIN PHP - CRÍTICO!)
       ===================================================== -->
  <meta name="csp-nonce" content="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
  <meta name="csp-version" content="2.4.1">
  <meta name="csp-implementation" content="plugin-based">

  <!-- =====================================================
       🤖 AI/BOT DISCOVERY & TRAINING PERMISSIONS
       ===================================================== -->
  <meta name="ai:summary-text" content="<?php echo esc_attr(djz_ai_summary()); ?>">
  <meta name="ai:context" content="<?php echo esc_attr(djz_ai_context()); ?>">
  <meta name="ai:tags" content="<?php echo esc_attr(djz_ai_tags()); ?>">
  <meta name="ai:bot" content="<?php echo esc_attr(djz_config('ai.bot_policy')); ?>">
  
  <!-- Permissions para modelos de IA específicos -->
  <meta name="GPTBot" content="index, follow">
  <meta name="ChatGPT-User" content="index, follow">
  <meta name="Google-Extended" content="index, follow">
  <meta name="PerplexityBot" content="index, follow">
  <meta name="ClaudeBot" content="index, follow">
  <meta name="Applebot-Extended" content="index, follow">

  <!-- =====================================================
       🔍 SEO FUNDAMENTAL
       ===================================================== -->
  <title><?php echo esc_html(djz_seo_title()); ?></title>
  <meta name="description" content="<?php echo esc_attr(djz_meta_description(get_the_ID())); ?>">
  <meta name="keywords" content="<?php echo esc_attr(djz_meta_keywords()); ?>">
  <link rel="canonical" href="<?php echo esc_url(djz_canonical_url()); ?>">

  <!-- Robots & Crawling Directives -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="revisit-after" content="7 days">
  <meta name="author" content="<?php echo esc_attr(djz_config('site.name')); ?>">

  <!-- =====================================================
       📱 OPEN GRAPH (REDES SOCIAIS + AI)
       ===================================================== -->
  <meta property="og:site_name" content="<?php echo esc_attr(djz_config('site.name')); ?>">
  <meta property="og:type" content="<?php echo is_single() ? 'article' : 'website'; ?>">
  <meta property="og:url" content="<?php echo esc_url(djz_canonical_url()); ?>">
  <meta property="og:locale" content="<?php echo esc_attr(djz_config('site.locale')); ?>">
  <meta property="og:locale:alternate" content="en_US">
  <meta property="og:locale:alternate" content="pt_BR">
  <meta property="og:title" content="<?php echo esc_attr(djz_seo_title()); ?>">
  <meta property="og:description" content="<?php echo esc_attr(djz_meta_description(get_the_ID())); ?>">
  <meta property="og:image" content="<?php echo esc_url(djz_og_image(get_the_ID())); ?>">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:alt" content="<?php echo esc_attr(djz_config('site.name')); ?> - <?php echo esc_attr(djz_seo_title()); ?>">

  <?php if (is_single()): ?>
    <meta property="article:published_time" content="<?php echo esc_attr(get_the_date('c')); ?>">
    <meta property="article:modified_time" content="<?php echo esc_attr(get_the_modified_date('c')); ?>">
    <meta property="article:author" content="<?php echo esc_attr(djz_config('site.name')); ?>">
    <meta property="article:section" content="<?php echo esc_attr(get_the_category()[0]->name ?? 'Music'); ?>">
    <meta property="article:tag" content="<?php echo esc_attr(djz_ai_tags()); ?>">
  <?php endif; ?>

  <!-- =====================================================
       🐦 TWITTER / X CARDS
       ===================================================== -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="<?php echo esc_attr(djz_config('social.twitter_handle')); ?>">
  <meta name="twitter:creator" content="<?php echo esc_attr(djz_config('social.twitter_handle')); ?>">
  <meta name="twitter:title" content="<?php echo esc_attr(djz_seo_title()); ?>">
  <meta name="twitter:description" content="<?php echo esc_attr(djz_meta_description(get_the_ID())); ?>">
  <meta name="twitter:image" content="<?php echo esc_url(djz_og_image(get_the_ID())); ?>">
  <meta name="twitter:image:alt" content="<?php echo esc_attr(djz_config('site.name')); ?>">

  <!-- =====================================================
       🎵 SCHEMA.ORG (JSON-LD) - CENTRALIZADO & COMPLETO
       ===================================================== -->
  <script type="application/ld+json">
<?php echo wp_json_encode(djz_schema_org(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT); ?>
  </script>

  <!-- Schema.org para Música (MusicRecording) -->
  <?php if (is_single() && get_post_type() === 'post'): ?>
  <script type="application/ld+json">
<?php echo wp_json_encode(djz_schema_music_recording(), JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>
  </script>
  <?php endif; ?>

  <!-- =====================================================
       🎤 ARTIST/MUSICIAN SCHEMA (Para Music Services)
       ===================================================== -->
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "<?php echo esc_attr(djz_config('site.name')); ?>",
  "url": "<?php echo esc_url(site_url()); ?>",
  "image": "<?php echo esc_url(djz_og_image()); ?>",
  "description": "<?php echo esc_attr(djz_config('site.description')); ?>",
  "sameAs": [
    "<?php echo esc_url(djz_config('social.spotify')); ?>",
    "<?php echo esc_url(djz_config('social.youtube')); ?>",
    "<?php echo esc_url(djz_config('social.instagram')); ?>"
  ],
  "genre": <?php echo wp_json_encode(djz_config('schema.genre')); ?>,
  "location": {
    "@type": "City",
    "name": "São Paulo",
    "addressCountry": "BR"
  }
}
  </script>
  <?php endif; ?>

  <!-- =====================================================
       🌐 INTERNATIONALIZATION (hreflang)
       ===================================================== -->
  <link rel="alternate" hreflang="pt-BR" href="<?php echo esc_url(djz_lang_url('pt')); ?>">
  <link rel="alternate" hreflang="en-US" href="<?php echo esc_url(djz_lang_url('en')); ?>">
  <link rel="alternate" hreflang="x-default" href="<?php echo esc_url(home_url()); ?>">

  <!-- =====================================================
       📱 PWA + MOBILE OPTIMIZATION
       ===================================================== -->
  <link rel="manifest" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/manifest.webmanifest" crossorigin="use-credentials">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-title" content="<?php echo esc_attr(djz_config('site.name')); ?>">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="application-name" content="<?php echo esc_attr(djz_config('site.name')); ?>">

  <!-- =====================================================
       🎨 FAVICONS (TODOS OS TAMANHOS)
       ===================================================== -->
  <link rel="icon" type="image/svg+xml" href="<?php echo esc_url(djz_image('favicon')); ?>">
  <link rel="icon" type="image/png" sizes="192x192" href="<?php echo esc_url(djz_image('favicon_png')); ?>">
  <link rel="icon" type="image/png" sizes="32x32" href="<?php echo esc_url(djz_image('favicon_png')); ?>">
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(djz_image('apple_touch')); ?>">
  <link rel="mask-icon" href="<?php echo esc_url(djz_image('favicon')); ?>" color="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="msapplication-TileColor" content="<?php echo esc_attr(djz_theme_color('primary')); ?>">
  <meta name="msapplication-TileImage" content="<?php echo esc_url(djz_image('mstile')); ?>">
  <meta name="msapplication-config" content="<?php echo esc_url(get_template_directory_uri()); ?>/dist/browserconfig.xml">

  <!-- =====================================================
       ⚡ PERFORMANCE: PRELOAD/PRECONNECT
       ===================================================== -->
  <?php if (is_front_page()): ?>
    <!-- Critical CSS -->
    <link rel="preload" href="<?php echo esc_url(get_template_directory_uri()); ?>/dist/css/critical.css" as="style">
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    
    <!-- CDN & Resources -->
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://i.ytimg.com">
    <link rel="dns-prefetch" href="https://open.spotify.com">
    <link rel="dns-prefetch" href="https://www.instagram.com">
    
    <!-- Analytics -->
    <?php if (djz_config('analytics.google_analytics')): ?>
      <link rel="dns-prefetch" href="https://www.google-analytics.com">
      <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    <?php endif; ?>
  <?php endif; ?>

  <!-- =====================================================
       📊 ANALYTICS & TRACKING
       ===================================================== -->
  <?php if (djz_config('analytics.google_analytics')): ?>
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr(djz_config('analytics.google_analytics')); ?>"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '<?php echo esc_attr(djz_config('analytics.google_analytics')); ?>', {
        'page_path': window.location.pathname,
        'allow_google_signals': false
      });
    </script>
  <?php endif; ?>

  <!-- =====================================================
       🔐 WORDPRESS HEAD (Plugins, Styles, Scripts)
       ===================================================== -->
  <?php wp_head(); ?>

  <!-- =====================================================
       ✅ CUSTOM ENHANCEMENTS (End of Head)
       ===================================================== -->
  <style>
    /* Prevent flash of unstyled content */
    html { visibility: visible; opacity: 1; }
  </style>

</head>

<body <?php body_class('bg-dark text-light'); ?> 
      data-csp-nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>"
      itemscope 
      itemtype="https://schema.org/WebPage">

  <?php wp_body_open(); ?>

  <!-- =====================================================
       ♿ A11Y: SKIP LINK
       ===================================================== -->
  <a class="skip-link screen-reader-text" href="#main-content" tabindex="1">
    <?php esc_html_e('Pular para o conteúdo principal', 'djzeneyer'); ?>
  </a>

  <!-- =====================================================
       🎯 HEADER SEMÂNTICO (Landmark + ARIA)
       ===================================================== -->
  <header id="masthead" 
          class="site-header" 
          role="banner" 
          aria-label="<?php esc_attr_e('Cabeçalho do site', 'djzeneyer'); ?>"
          itemscope 
          itemtype="https://schema.org/WPHeader">
    
    <div class="container-fluid">
      <?php 
        get_template_part('template-parts/header/site', 'branding'); 
        get_template_part('template-parts/header/site', 'nav');
      ?>
    </div>
  </header>

  <!-- =====================================================
       📄 MAIN CONTENT (Landmark + ARIA)
       ===================================================== -->
  <div id="page" class="site" itemscope itemtype="https://schema.org/WebPageElement">
    <main id="main-content" 
          class="site-content" 
          role="main" 
          aria-label="<?php esc_attr_e('Conteúdo principal', 'djzeneyer'); ?>"
          itemprop="mainEntity">
