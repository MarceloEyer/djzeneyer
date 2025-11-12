<?php
/**
 * Main template file - DJ Zen Eyer Theme
 * Optimized for React SPA + SEO + AI Crawlers
 * @package DJZenEyer
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <meta name="description" content="Experience exclusive Brazilian Zouk remixes, live shows and premium music experiences by DJ Zen Eyer. Join the Zen Tribe worldwide.">
    <meta name="author" content="DJ Zen Eyer">
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <link rel="canonical" href="https://djzeneyer.com/">

    <meta name="ai-content" content="DJ Zen Eyer is a world-class Brazilian Zouk DJ and music producer delivering exclusive remixes, live events, and dance experiences.">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta name="bingbot" content="index, follow">
    <meta name="yandex-verification" content="1b652f4d3070aedf">
    <meta name="google-site-verification" content="YOUR_GOOGLE_CODE">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="DJ Zen Eyer">
    <meta property="og:url" content="https://djzeneyer.com/">
    <meta property="og:title" content="DJ Zen Eyer | Brazilian Zouk Music Producer & Live DJ Events">
    <meta property="og:description" content="Experience exclusive Brazilian Zouk remixes and join live events with DJ Zen Eyer.">
    <meta property="og:image" content="https://djzeneyer.com/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="en_US">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="DJ Zen Eyer | Brazilian Zouk Music Producer & Live DJ Events">
    <meta name="twitter:description" content="Exclusive Brazilian Zouk remixes and live performances by DJ Zen Eyer.">
    <meta name="twitter:image" content="https://djzeneyer.com/images/twitter-image.jpg">

    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <meta name="theme-color" content="#0A0E27">
    <meta name="apple-mobile-web-app-title" content="DJ Zen Eyer">

    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet">

    <meta http-equiv="Cache-Control" content="max-age=31536000, must-revalidate">
    <meta http-equiv="Permissions-Policy" content="interest-cohort=()">
    <meta name="referrer" content="strict-origin-when-cross-origin">
    <meta name="generator" content="WordPress + React + WooCommerce Headless">

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    <div id="root"></div>
    <?php wp_footer(); ?>
</body>
</html>