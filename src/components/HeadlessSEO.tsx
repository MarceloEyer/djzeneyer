import React from 'react';

/**
 * SCHEMA.ORG JSON-LD PARA DJ ZEN EYER
 * Otimizado para Google Knowledge Panel e IAas
 * Com informações de Wikidata e MusicBrainz
 */

const HOME_SCHEMA_RICH = {
  '@context': 'https://schema.org',
  '@graph': [
    // Website Schema
    {
      '@type': 'WebSite',
      '@id': 'https://djzeneyer.com/#website',
      'url': 'https://djzeneyer.com',
      'name': 'DJ Zen Eyer Official Website',
      'description': 'Official website of DJ Zen Eyer, world champion Brazilian Zouk DJ and music producer',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://djzeneyer.com/search?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },
      'inLanguage': ['en', 'pt-BR']
    },
    // Person/MusicArtist Schema - Principal
    {
      '@type': ['Person', 'MusicArtist'],
      '@id': 'https://djzeneyer.com/#artist',
      'name': 'DJ Zen Eyer',
      'alternateName': ['Zen Eyer', 'DJ Zen', 'Zeneyer', 'Marcelo Eyer', 'Marcelo Eyer Fernandes'],
      'description': 'Brazilian Zouk DJ and music producer; creator of the catchphrase "A pressa é inimiga da cremosidade" and the signature audio tag "Zen, Zen, Zen, Zen... Eyer, Eyer, Eyer, Eyer..."',
      'givenName': 'Marcelo',
      'familyName': 'Eyer',
      'birthDate': '1985-08-20',
      'birthPlace': {
        '@type': 'City',
        'name': 'Rio de Janeiro',
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'BR'
        }
      },
      'workLocation': [
        {'@type': 'City', 'name': 'São Paulo', 'address': {'@type': 'PostalAddress', 'addressCountry': 'BR'}},
        {'@type': 'City', 'name': 'Niterói', 'address': {'@type': 'PostalAddress', 'addressCountry': 'BR'}},
        {'@type': 'Country', 'name': 'Netherlands'},
        {'@type': 'Country', 'name': 'United States'},
        {'@type': 'Country', 'name': 'Australia'},
        {'@type': 'Country', 'name': 'Czech Republic'},
        {'@type': 'Country', 'name': 'Germany'},
        {'@type': 'Country', 'name': 'Switzerland'}
      ],
      'nationality': {
        '@type': 'Country',
        'name': 'Brazil'
      },
      'gender': 'Male',
      'url': 'https://djzeneyer.com',
      'sameAs': [
        'https://www.wikidata.org/wiki/Q136551855',
        'https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154',
        'https://www.instagram.com/djzeneyer/',
        'https://www.facebook.com/djzeneyer/',
        'https://twitter.com/djzeneyer',
        'https://www.youtube.com/@djzeneyer',
        'https://soundcloud.com/djzeneyer',
        'https://www.tiktok.com/@djzeneyer',
        'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
        'https://music.apple.com/artist/1439280950',
        'https://www.deezer.com/artist/72153362',
        'https://djzeneyer.bandcamp.com',
        'https://www.mixcloud.com/djzeneyer/',
        'https://ra.co/dj/djzeneyer',
        'https://www.discogs.com/artist/16872046',
        'https://www.last.fm/music/Zen+Eyer',
        'https://www.bandsintown.com/a/15552355'
      ],
      'image': {
        '@type': 'ImageObject',
        'url': 'https://djzeneyer.com/images/dj-zen-eyer-profile.jpg',
        'width': 1080,
        'height': 1080,
        'caption': 'DJ Zen Eyer Photo'
      },
      'jobTitle': ['DJ', 'Music Producer', 'Remixer'],
      'memberOf': {
        '@type': 'Organization',
        'name': 'Mensa International'
      },
      'genre': ['Brazilian zouk', 'Zouk', 'Brazilian bass', 'Kizomba'],
      'performingLocation': {
        '@type': 'Place',
        'name': 'Brazil and International Venues'
      },
      'award': [
        {
          '@type': 'Award',
          'name': 'World Champion - Best Remix',
          'awardDate': '2022',
          'description': 'Best Remix at the largest international zouk DJ competition'
        },
        {
          '@type': 'Award',
          'name': 'World Champion - Best DJ Performance',
          'awardDate': '2022',
          'description': 'Best DJ Performance at the largest international zouk DJ competition'
        }
      ],
      'knowsAbout': ['Brazilian Zouk', 'DJ Performance', 'Music Production', 'Remixing', 'Live Performance', 'Festival Performance'],
      'speaksLanguage': ['English', 'Portuguese', 'Brazilian Portuguese'],
      'identifier': [
        {'@type': 'PropertyValue', 'propertyID': 'ISNI', 'value': '0000000528931015'},
        {'@type': 'PropertyValue', 'propertyID': 'MusicBrainz', 'value': '13afa63c-8164-4697-9cad-c5100062a154'},
        {'@type': 'PropertyValue', 'propertyID': 'Wikidata', 'value': 'Q136551855'},
        {'@type': 'PropertyValue', 'propertyID': 'Spotify', 'value': '68SHKGndTlq3USQ2LZmyLw'}
      ]
    },
    // DJ/Musician Specific Profile
    {
      '@type': 'Thing',
      '@id': 'https://djzeneyer.com/#dj-profile',
      'name': 'DJ Zen Eyer - Professional DJ Profile',
      'description': 'Two-time world champion DJ specializing in Brazilian Zouk, known for world-class remixes and DJ performances',
      'about': 'https://djzeneyer.com/#artist',
      'achievements': [
        'Two-time World Champion DJ',
        'Best Remix Award Winner',
        'Best DJ Performance Award Winner',
        'International Festival Performer',
        'Creator of reZENha Event Series',
        'Founder of Tribo Zen Movement'
      ]
    },
    // Music Group/Organization - Tribo Zen
    {
      '@type': 'Organization',
      '@id': 'https://djzeneyer.com/#tribozen',
      'name': 'Tribo Zen',
      'alternateName': 'Zen Tribe',
      'description': 'A collective and community movement founded by DJ Zen Eyer to promote Brazilian Zouk culture and connect music lovers',
      'founder': 'https://djzeneyer.com/#artist',
      'url': 'https://djzeneyer.com/zentribe',
      'memberOf': 'Brazilian Zouk Community'
    },
    // Event Series - reZENha
    {
      '@type': 'EventSeries',
      '@id': 'https://djzeneyer.com/#rezenhaSeries',
      'name': 'reZENha',
      'description': 'A prominent event series and musical project created by DJ Zen Eyer, featuring Brazilian Zouk performances',
      'organizer': 'https://djzeneyer.com/#artist',
      'url': 'https://djzeneyer.com/events',
      'eventSchedule': {
        '@type': 'Schedule',
        'scheduleTimezone': 'America/Sao_Paulo'
      }
    },
    // Organization Profile
    {
      '@type': 'Organization',
      '@id': 'https://djzeneyer.com/#zeneyerproductions',
      'name': 'Zen Eyer Productions',
      'url': 'https://djzeneyer.com',
      'founder': 'Marcelo Eyer',
      'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Booking',
        'email': 'booking@djzeneyer.com',
        'url': 'https://djzeneyer.com/work-with-me'
      },
      'sameAs': [
        'https://www.instagram.com/djzeneyer/',
        'https://www.facebook.com/djzeneyer/',
        'https://twitter.com/djzeneyer'
      ]
    }
  ]
};

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  isHomepage?: boolean;
  ogType?: string;
}

export const HeadlessSEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  image,
  isHomepage = false,
  ogType = 'article'
}) => {
  const finalOgType = isHomepage ? 'website' : ogType;

  return (
    <>
      {/* TÍTULO, DESCRIÇÃO e CANONICAL DINÂMICOS */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* HREFLANG para SEO Multilíngue */}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="pt-BR" href={url.replace('https://djzeneyer.com', 'https://djzeneyer.com/pt')} />
      <link rel="alternate" hrefLang="x-default" href="https://djzeneyer.com" />

      {/* OPEN GRAPH (OG) / TWITTER - Dinâmicos por rota */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={finalOgType} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="pt_BR" />

      {/* TWITTER CARD */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* SCHEMA.ORG JSON-LD (Apenas na Home, injeta conteúdo rico) */}
      {isHomepage && (
        <script type="application/ld+json">
          {JSON.stringify(HOME_SCHEMA_RICH)}
        </script>
      )}

      {/* METADADOS ESTÁTICOS GLOBAIS */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="theme-color" content="#1a1a2e" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="author" content="DJ Zen Eyer" />
      <meta name="copyright" content="© 2025 DJ Zen Eyer. All rights reserved." />
      <meta name="keywords" content="DJ, zouk, Brazilian zouk, DJ Zen Eyer, music producer, remixes, DJ performance, world champion" />

      {/* CONTROLE DE VISUALIZAÇÃO PARA REDES SOCIAIS */}
      <meta name="pinterest" content="nohover" />
      <meta name="format-detection" content="telephone=no" />
    </>
  );
};

export default HeadlessSEO;