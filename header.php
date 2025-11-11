<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article# music: https://ogp.me/ns/music#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Primary Meta Tags -->
    <meta name="description" content="DJ Zen Eyer - Two-time world champion Brazilian Zouk DJ and music producer. International performances, award-winning remixes, Zouk authority.">
    <link rel="canonical" href="<?php echo esc_url(home_url('/')); ?>">
    <meta name="author" content="DJ Zen Eyer">
    <meta name="creator" content="Marcelo Eyer Fernandes">

    <!-- Identity Linking (CRÍTICO para IAs) -->
    <link rel="me" href="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154">
    <meta property="music:musician" content="https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154">
    <link rel="me" href="https://www.wikidata.org/wiki/Q136551855">
    <link rel="me" href="https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw">
    <meta property="music:song" content="https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw">
    <link rel="me" href="https://instagram.com/djzeneyer">
    <link rel="me" href="https://facebook.com/djzeneyer">
    <link rel="me" href="https://youtube.com/@djzeneyer">
    <link rel="me" href="https://soundcloud.com/djzeneyer">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="music.musician">
    <meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>">
    <meta property="og:site_name" content="DJ Zen Eyer">
    <meta property="og:title" content="DJ Zen Eyer - Brazilian Zouk DJ & Producer">
    <meta property="og:description" content="Two-time world champion Brazilian Zouk DJ. International performances, award-winning remixes, Zouk authority.">
    <meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/assets/images/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="DJ Zen Eyer performing at a Brazilian Zouk event">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="pt_BR">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@djzeneyer">
    <meta name="twitter:creator" content="@djzeneyer">
    <meta name="twitter:url" content="<?php echo esc_url(home_url('/')); ?>">
    <meta name="twitter:title" content="DJ Zen Eyer - Brazilian Zouk DJ & Producer">
    <meta name="twitter:description" content="Two-time world champion Brazilian Zouk DJ. International performances, award-winning remixes.">
    <meta name="twitter:image" content="<?php echo get_template_directory_uri(); ?>/assets/images/twitter-image.jpg">
    <meta name="twitter:image:alt" content="DJ Zen Eyer logo">

    <!-- Music-Specific Meta -->
    <meta property="music:musician" content="https://djzeneyer.com">
    <meta property="music:release_date" content="2014">
    <meta name="music:genre" content="Brazilian Zouk">
    <meta name="music:genre" content="Electronic Music">
    <meta name="music:genre" content="Dance Music">

    <!-- Indexação e Crawlers -->
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="GPTBot" content="index, follow">
    <meta name="ChatGPT-User" content="index, follow">
    <meta name="Claude-Web" content="index, follow">
    <meta name="PerplexityBot" content="index, follow">

    <!-- Geo Location -->
    <meta name="geo.region" content="BR-RJ">
    <meta name="geo.placename" content="Niterói">
    <meta name="geo.position" content="-22.8833;-43.1036">
    <meta name="ICBM" content="-22.8833, -43.1036">

    <!-- Schema.org JSON-LD for AI & Search Bots -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": ["Person", "MusicGroup"],
      "name": "Zen Eyer",
      "alternateName": "Marcelo Eyer Fernandes",
      "url": "<?php echo esc_url(home_url('/')); ?>",
      "sameAs": [
        "https://www.wikidata.org/wiki/Q136551855",
        "https://www.discogs.com/pt_BR/artist/16872046-Zen-Eyer",
        "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
        "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
        "https://www.instagram.com/djzeneyer/",
        "https://soundcloud.com/djzeneyer",
        "https://youtube.com/@DJZenEyer",
        "https://ra.co/dj/djzeneyer",
        "https://facebook.com/djzeneyer"
      ],
      "jobTitle": "Brazilian Zouk DJ and Music Producer",
      "description": "World-renowned DJ and producer specializing exclusively in Brazilian Zouk. Performs globally, produces original Zouk music, and teaches masterclasses worldwide.",
      "nationality": "Brazilian",
      "genre": "Brazilian Zouk",
      "birthPlace": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "São Paulo",
          "addressCountry": "Brazil"
        }
      }
    }
    </script>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
