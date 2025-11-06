<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <meta name="description" content="Zen Eyer - Champion Brazilian Zouk DJ and music producer. International performances, award-winning remixes, Zouk authority.">
    <link rel="canonical" href="<?php echo esc_url(home_url('/')); ?>">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="music.musician">
    <meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>">
    <meta property="og:title" content="DJ Zen Eyer - Brazilian Zouk DJ & Producer">
    <meta property="og:description" content="Champion Brazilian Zouk DJ and music producer. International performances, award-winning remixes, Zouk authority.">
    <meta property="og:image" content="<?php echo get_template_directory_uri(); ?>/assets/images/og-image.jpg">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="<?php echo esc_url(home_url('/')); ?>">
    <meta name="twitter:title" content="DJ Zen Eyer - Brazilian Zouk DJ & Producer">
    <meta name="twitter:description" content="Champion Brazilian Zouk DJ and music producer. International performances, award-winning remixes.">
    <meta name="twitter:image" content="<?php echo get_template_directory_uri(); ?>/assets/images/twitter-image.jpg">

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
