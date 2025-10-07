<?php
/**
 * O cabeçalho para o nosso tema.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="preload" href="<?php echo get_template_directory_uri(); ?>/dist/assets/index.js" as="script">
    
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>