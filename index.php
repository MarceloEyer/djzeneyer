<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Optimized for React SPA + SEO
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- DNS Prefetch & Preconnect -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Preload Critical Assets -->
    <?php 
    $js_file = get_template_directory_uri() . '/dist/assets/index.js';
    $css_file = get_template_directory_uri() . '/dist/assets/index.css';
    ?>
    <link rel="modulepreload" href="<?php echo esc_url($js_file); ?>">
    <link rel="preload" href="<?php echo esc_url($css_file); ?>" as="style">
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <div id="root"></div>
    <?php wp_footer(); ?>
</body>
</html>
