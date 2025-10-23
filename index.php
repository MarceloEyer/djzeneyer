<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Optimized for React SPA + SEO
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

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
    
    <?php 
    // Get theme directory URI
    $theme_uri = get_template_directory_uri();
    
    // Dynamically find the hashed JS files
    $dist_path = get_template_directory() . '/dist/assets/';
    $dist_uri = $theme_uri . '/dist/assets/';
    
    // Scan for main JS file
    $js_files = glob($dist_path . 'index-*.js');
    $css_files = glob($dist_path . 'index-*.css');
    
    $main_js = !empty($js_files) ? $dist_uri . basename($js_files[0]) : $dist_uri . 'index.js';
    $main_css = !empty($css_files) ? $dist_uri . basename($css_files[0]) : $dist_uri . 'index.css';
    ?>
    
    <!-- Preload Critical Assets -->
    <link rel="modulepreload" href="<?php echo esc_url($main_js); ?>">
    <link rel="preload" href="<?php echo esc_url($main_css); ?>" as="style">
    <link rel="stylesheet" href="<?php echo esc_url($main_css); ?>">
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <!-- React Root -->
    <div id="root"></div>
    
    <!-- Load React App -->
    <script type="module" src="<?php echo esc_url($main_js); ?>"></script>
    
    <?php wp_footer(); ?>
</body>
</html>
