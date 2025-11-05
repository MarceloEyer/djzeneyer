<!DOCTYPE html>
<html <?php language_attributes(); ?> prefix="og: https://ogp.me/ns# article: https://ogp.me/ns/article#">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Schema.org JSON-LD for AI & Search Bots -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Marcelo Eyer Fernandes",
      "alternateName": "Zen Eyer",
      "url": "<?php echo esc_url(home_url('/')); ?>",
      "sameAs": [
        "https://www.wikidata.org/wiki/Q136551855",
        "https://www.discogs.com/pt_BR/artist/16872046-Zen-Eyer",
        "https://open.spotify.com/intl-pt/artist/68SHKGndTlq3USQ2LZmyLw",
        "https://ra.co/dj/djzeneyer",
        "https://instagram.com/djzeneyer",
        "https://facebook.com/djzeneyer",
        "https://youtube.com/@djzeneyer",
        "https://soundcloud.com/djzeneyer"
      ],
      "jobTitle": "Brazilian Zouk DJ and Music Producer",
      "description": "World-renowned DJ and producer specializing exclusively in Brazilian Zouk. Performs globally, produces original Zouk music, and teaches masterclasses worldwide.",
      "nationality": "Brazilian",
      "genre": "Brazilian Zouk"
    }
    </script>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
