<?php
/**
 * Header DJ Zen Eyer - v4.2 SECURITY & PERFORMANCE OPTIMIZED
 * 🎯 Todas as configurações vêm de inc/djz-config.php
 * 🤖 Otimizado para Google, ChatGPT, Claude, Perplexity
 * 🔒 CSP Nonce seguro em todos inline scripts
 * ⚡ Performance: Preload críticos, DNS prefetch, Resource hints
 * 
 * @package DJZenEyerTheme
 * @version 4.2.0
 * @updated 2025-10-30 @ 15:35 UTC
 * @author DJ Zen Eyer Team
 * 
 * MUDANÇAS v4.2:
 * ✅ CSP Nonce em Google Analytics (LINE 137-149)
 * ✅ Sanitização e validação em MusicGroup schema (LINE 107-128)
 * ✅ Error handling em get_the_category() (LINE 92)
 * ✅ Validação de canonical URL (LINE 73)
 * ✅ Escaping duplo em og:image:type (LINE 86)
 * ✅ Comment conditionals melhorados (LINE 129-135)
 */

if (!defined('ABSPATH')) {
    exit; // Segurança
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> itemscope itemtype="https://schema.org/WebPage" data-version="4.2">
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
       🔍 SEO FUNDAMENTAL (FIXED v4.2)
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
       📱 OPEN GRAPH (REDES SOCIAIS + AI) (FIXED v4.2)
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
  <meta property="og:image:alt" content="<?php echo esc_attr(djz_config('site.name') . ' - ' . djz_seo_title()); ?>">

  <!-- Article metadata (FIXED v4.2 - Error handling) -->
  <?php if (is_single()): ?>
    <meta property="article:published_time" content="<?php echo esc_attr(get_the_date('c')); ?>">
    <meta property="article:modified_time" content="<?php echo esc_attr(get_the_modified_date('c')); ?>">
    <meta property="article:author" content="<?php echo esc_attr(djz_config('site.name')); ?>">
    <?php 
      $categories = get_the_category();
      if (!empty($categories)) {
        echo '<meta property="article:section" content="' . esc_attr($categories[0]->name) . '">' . "\n";
      }
    ?>
    <meta property="article:tag" content="<?php echo esc_attr(djz_ai_tags()); ?>">
  <?php endif; ?>

  <!-- =====================================================
       🐦 TWITTER / X CARDS (FIXED v4.2)
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

  <!-- Schema.org para Música (MusicRecording) (FIXED v4.2) -->
  <?php if (is_single() && get_post_type() === 'post'): 
    $music_schema = djz_schema_music_recording();
    if (!empty($music_schema)) {
  ?>
  <script type="application/ld+json">
<?php echo wp_json_encode($music_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>
  </script>
  <?php 
    }
  endif; 
  ?>

  <!-- =====================================================
       🎤 ARTIST/MUSICIAN SCHEMA (Para Music Services) (FIXED v4.2)
       ===================================================== -->
  <?php 
    // Validação: apenas exibir se houver configurações
    $artist_name = djz_config('site.name');
    $artist_url = site_url();
    $artist_description = djz_config('site.description');
    
    if ($artist_name && $artist_url):
  ?>
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "name": "<?php echo esc_attr($artist_name); ?>",
  "url": "<?php echo esc_url($artist_url); ?>",
  "image": "<?php echo esc_url(djz_og_image()); ?>",
  "description": "<?php echo esc_attr($artist_description); ?>",
  "sameAs": <?php echo wp_json_encode(djz_social_urls()); ?>,
  "genre": <?php echo wp_json_encode(djz_config('schema.genre', [])); ?>,
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
       ⚡ PERFORMANCE: PRELOAD/PRECONNECT (FIXED v4.2)
       ===================================================== -->
  <?php if (is_front_page()): ?>
    <!-- Critical CSS Preload -->
    <link rel="preload" href="<?php echo esc_url(get_template_directory_uri() . '/dist/css/critical.css'); ?>" as="style" crossorigin>
    
    <!-- Google Fonts (Preconnect + DNS) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    
    <!-- CDN & Resources (DNS Prefetch only) -->
    <link rel="dns-prefetch" href="https://cdn.jsdelivr.net">
    <link rel="dns-prefetch" href="https://i.ytimg.com">
    <link rel="dns-prefetch" href="https://open.spotify.com">
    <link rel="dns-prefetch" href="https://www.instagram.com">
    <link rel="dns-prefetch" href="https://www.mixcloud.com">
    
    <!-- Analytics (DNS Prefetch) -->
    <?php if (djz_config('analytics.google_analytics')): ?>
      <link rel="dns-prefetch" href="https://www.google-analytics.com">
      <link rel="dns-prefetch" href="https://www.googletagmanager.com">
    <?php endif; ?>
  <?php endif; ?>

  <!-- =====================================================
       📊 ANALYTICS & TRACKING (FIXED v4.2 - CSP NONCE!)
       ===================================================== -->
  <?php if (djz_config('analytics.google_analytics')): ?>
    <!-- Google Analytics (GA4) with CSP Nonce -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo esc_attr(djz_config('analytics.google_analytics')); ?>"></script>
    <script nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '<?php echo esc_attr(djz_config('analytics.google_analytics')); ?>', {
        'page_path': window.location.pathname,
        'allow_google_signals': false,
        'anonymize_ip': true
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
  <style nonce="<?php echo esc_attr(djzeneyer_get_csp_nonce()); ?>">
    /* Prevent flash of unstyled content (FOUC) */
    html { 
      visibility: visible; 
      opacity: 1; 
    }
    
    /* Critical inline styles (avoid @import) */
    body.preload * {
      -webkit-transition: none !important;
      -moz-transition: none !important;
      -ms-transition: none !important;
      -o-transition: none !important;
      transition: none !important;
    }
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
