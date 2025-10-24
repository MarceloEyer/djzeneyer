<?php
/**
 * Main template file - DJ Zen Eyer Theme
 */
if (!defined('ABSPATH')) {
    exit;
}

$theme_uri = get_template_directory_uri();
$manifest_path = get_template_directory() . '/dist/.vite/manifest.json';

$main_css = '';
$main_js = '';

// Carrega assets usando o manifest.json do Vite (recomendado)
if (file_exists($manifest_path)) {
    $manifest = json_decode(file_get_contents($manifest_path), true);
    if (isset($manifest['src/main.tsx'])) {
        $entry = $manifest['src/main.tsx'];
        if (!empty($entry['file'])) {
            $main_js = '/dist/' . $entry['file'];
        }
        if (!empty($entry['css']) && is_array($entry['css'])) {
            $main_css = '/dist/' . $entry['css'][0];
        }
    }
}
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#0A0E27" />

  <!-- Favicons: os universais vão na RAIZ do site -->
  <link rel="icon" type="image/svg+xml" href="<?php echo $theme_uri; ?>/dist/favicon.svg" />
  <link rel="icon" type="image/png" sizes="96x96" href="<?php echo $theme_uri; ?>/dist/favicon-96x96.png" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />
  
  <title>DJ Zen Eyer</title>

  <!-- Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet" />

  <!-- CSS gerado pelo Vite -->
  <?php if ($main_css): ?>
  <link rel="stylesheet" crossorigin href="<?php echo $theme_uri . $main_css; ?>" />
  <?php endif; ?>

  <link rel="manifest" href="/manifest.webmanifest">

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