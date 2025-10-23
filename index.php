<?php
/**
 * Main template file - DJ Zen Eyer Theme
 */
if (!defined('ABSPATH')) exit;

$theme_uri = get_template_directory_uri();
$dist_path = get_template_directory() . '/dist';

// Procura arquivos CSS e JS gerados pelo Vite
$css_files = glob($dist_path . '/assets/*.css');
$js_files = glob($dist_path . '/assets/index-*.js');

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
  <link rel="manifest" href="<?php echo $theme_uri; ?>/dist/site.webmanifest" />
  
  <title>DJ Zen Eyer</title>

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
