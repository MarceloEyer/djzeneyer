<?php
/**
 * Main template file - DJ Zen Eyer Theme v12.3.0
 * WordPress Headless Theme with React 18 + Vite + TypeScript
 * Enterprise-Grade | AI-Friendly | Production Ready
 */

if (!defined('ABSPATH')) exit;

// ============================================================
// 1. VITE MANIFEST LOADING (Cache Busting)
// ============================================================
$theme_uri = get_template_directory_uri();
$manifest_path = get_template_directory() . '/dist/.vite/manifest.json';
$main_css = $main_js = '';

if (file_exists($manifest_path)) {
    try {
        $manifest = json_decode(file_get_contents($manifest_path), true);
        if ($manifest && isset($manifest['src/main.tsx'])) {
            $entry = $manifest['src/main.tsx'];
            if (!empty($entry['file'])) {
                $main_js = $theme_uri . '/dist/' . esc_url($entry['file']);
            }
            if (!empty($entry['css'][0])) {
                $main_css = $theme_uri . '/dist/' . esc_url($entry['css'][0]);
            }
        }
    } catch (Exception $e) {
        trigger_error('Asset Loading Error: ' . $e->getMessage(), E_USER_WARNING);
    }
}

// SEO Variables
$site_name = get_bloginfo('name');
$site_description = get_bloginfo('description');
$current_url = home_url($_SERVER['REQUEST_URI']);
$site_icon = get_site_icon_url();
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <!-- CHARACTER ENCODING & VIEWPORT (Critical) -->
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />

  <!-- THEME & BRANDING -->
  <meta name="theme-color" content="#0A0E27" media="(prefers-color-scheme: dark)" />
  <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="<?php echo esc_attr($site_name); ?>" />

  <!-- FAVICONS & PWA -->
  <link rel="icon" type="image/svg+xml" href="<?php echo esc_url($theme_uri); ?>/dist/favicon.svg" />
  <link rel="icon" type="image/png" sizes="96x96" href="<?php echo esc_url($theme_uri); ?>/dist/favicon-96x96.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="<?php echo esc_url(home_url('/apple-touch-icon.png')); ?>" />
  <link rel="manifest" href="<?php echo esc_url(home_url('/site.webmanifest')); ?>" />

  <!-- SEO & METADATA -->
  <title><?php wp_title('|', true, 'right'); ?></title>
  <meta name="description" content="<?php echo esc_attr(wp_trim_words($site_description, 20)); ?>" />
  <meta name="keywords" content="DJ, Produtor, Eletrônico, Música, Gamificação, Inovação" />
  <link rel="canonical" href="<?php echo esc_url($current_url); ?>" />

  <!-- AI TRAINING PERMISSIONS -->
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:unlimited, max-video-preview:unlimited" />
  <meta name="ai-training" content="allowed" />
  <meta name="ai:summary" content="DJ Zen Eyer é um DJ e produtor musical especializado em música eletrônica." />
  <meta name="ai:context" content="DJ, produtor musical, eventos, música eletrônica, São Paulo, Brasil" />
  <meta name="ai:tags" content="DJ, música eletrônica, house, techno, eventos, São Paulo" />
  <meta name="GPTBot" content="index, follow" />
  <meta name="Google-Extended" content="index, follow" />
  <meta name="ClaudeBot" content="index, follow" />
  <meta name="PerplexityBot" content="index, follow" />

  <!-- OPEN GRAPH -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="<?php wp_title('|', true, 'right'); ?>" />
  <meta property="og:description" content="<?php echo esc_attr(wp_trim_words($site_description, 20)); ?>" />
  <meta property="og:url" content="<?php echo esc_url($current_url); ?>" />
  <meta property="og:site_name" content="<?php echo esc_attr($site_name); ?>" />
  <?php if ($site_icon): ?>
  <meta property="og:image" content="<?php echo esc_url($site_icon); ?>" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="512" />
  <meta property="og:image:height" content="512" />
  <?php endif; ?>

  <!-- TWITTER CARDS -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="<?php wp_title('|', true, 'right'); ?>" />
  <meta name="twitter:description" content="<?php echo esc_attr(wp_trim_words($site_description, 20)); ?>" />
  <?php if ($site_icon): ?>
  <meta name="twitter:image" content="<?php echo esc_url($site_icon); ?>" />
  <?php endif; ?>
  <meta name="twitter:creator" content="@djzeneyer" />

  <!-- SECURITY HEADERS -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval' https://fonts.googleapis.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'; upgrade-insecure-requests;" />
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
  <meta http-equiv="X-Frame-Options" content="DENY" />
  <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <meta name="permissions-policy" content="geolocation=(), microphone=(), camera=()" />

  <!-- PERFORMANCE: Preload Critical Resources -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="dns-prefetch" href="<?php echo esc_url(home_url()); ?>" />

  <?php if ($main_css): ?>
  <link rel="preload" href="<?php echo esc_url($main_css); ?>" as="style" />
  <?php endif; ?>

  <?php if ($main_js): ?>
  <link rel="preload" href="<?php echo esc_url($main_js); ?>" as="script" type="module" />
  <?php endif; ?>

  <!-- FONTS (Critical for Branding) -->
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet" crossorigin="anonymous" />

  <!-- MAIN CSS (Generated by Vite) -->
  <?php if ($main_css): ?>
  <link rel="stylesheet" href="<?php echo esc_url($main_css); ?>" type="text/css" media="screen" crossorigin="anonymous" />
  <?php endif; ?>

  <!-- STRUCTURED DATA (Schema.org - JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "<?php echo esc_js($site_name); ?>",
    "description": "<?php echo esc_js($site_description); ?>",
    "url": "<?php echo esc_js(home_url()); ?>",
    "image": "<?php echo esc_js($site_icon); ?>",
    "sameAs": [
      "https://instagram.com/djzeneyer",
      "https://spotify.com/artist/...",
      "https://soundcloud.com/djzeneyer"
    ],
    "givenName": "DJ",
    "familyName": "Zen Eyer",
    "jobTitle": "DJ & Music Producer",
    "knowsLanguage": ["pt-BR", "en"],
    "hasOccupation": {
      "@type": "Occupation",
      "name": "DJ",
      "description": "DJ e produtor musical especializado em música eletrônica."
    }
  }
  </script>

  <!-- WORDPRESS HOOKS -->
  <?php wp_head(); ?>
</head>

<body <?php body_class('dj-zen-eyer-app'); ?>>
  <?php wp_body_open(); ?>

  <!-- REACT ROOT MOUNT POINT -->
  <div id="root" role="application" aria-label="DJ Zen Eyer Application"></div>

  <!-- NOSCRIPT FALLBACK -->
  <noscript>
    <div style="padding: 20px; background: #0A0E27; color: #fff; font-family: system-ui; text-align: center;">
      <h1>JavaScript Requerido</h1>
      <p>Esta aplicação requer JavaScript ativado no seu navegador.</p>
      <p><a href="https://www.enable-javascript.com/" style="color: #3B82F6; text-decoration: underline;">Saiba como ativar</a></p>
    </div>
  </noscript>

  <!-- MAIN APPLICATION SCRIPT (Generated by Vite) -->
  <?php if ($main_js): ?>
  <script type="module" src="<?php echo esc_url($main_js); ?>" crossorigin="anonymous" defer></script>
  <?php endif; ?>

  <!-- WORDPRESS HOOKS -->
  <?php wp_footer(); ?>
</body>
</html>