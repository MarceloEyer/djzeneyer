import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  ogType?: 'website' | 'profile' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  schema?: any; // Permite schema personalizado por página
  hrefLang?: { lang: string; href: string }[];
  keywords?: string;
  noindex?: boolean;
}

export const HeadlessSEO: React.FC<SEOProps> = ({
  title,
  description,
  url,
  image,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schema,
  hrefLang = [],
  keywords,
  noindex = false,
}) => {
  // Schema global (sempre incluído)
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://djzeneyer.com/#website",
        "url": "https://djzeneyer.com",
        "name": "DJ Zen Eyer | World Champion Brazilian Zouk DJ",
        "description": "Official website of DJ Zen Eyer, two-time world champion Brazilian Zouk DJ and music producer",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://djzeneyer.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": ["Person", "MusicArtist"],
        "@id": "https://djzeneyer.com/#artist",
        "name": "DJ Zen Eyer",
        "alternateName": ["Zen Eyer", "DJ Zen Eyer", "Marcelo Eyer Fernandes"],
        "description": "Brazilian Zouk DJ and music producer. Two-time world champion (2022). Creator of the 'cremoso' audio tag signature.",
        "url": "https://djzeneyer.com",
        "image": "https://djzeneyer.com/images/zen-eyer-og.jpg",
        "sameAs": [
          "https://www.wikidata.org/wiki/Q136551855",
          "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
          "https://www.instagram.com/djzeneyer/",
          "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
          "https://www.youtube.com/@djzeneyer",
          "https://soundcloud.com/djzeneyer"
        ],
        "genre": "Brazilian Zouk",
        "givenName": "Marcelo",
        "familyName": "Eyer",
        "birthDate": "1985-08-28",
        "birthPlace": { "@type": "City", "name": "Rio de Janeiro", "addressCountry": "BR" },
        "nationality": { "@type": "Country", "name": "Brazil" }
      }
    ]
  };

  // Schema específico da página (se fornecido, mescla com o global)
  const finalSchema = schema ? { ...globalSchema, ...schema } : globalSchema;

  // URLs alternativas (hreflang)
  const defaultHrefLang: { lang: string; href: string }[] = [
    { lang: 'en', href: url },
    { lang: 'pt-BR', href: url.replace(/\/$/, '/pt') || url.replace(/\/pt\/$/, '/pt/') },
    { lang: 'x-default', href: url }
  ];

  const finalHrefLang = hrefLang.length > 0 ? hrefLang : defaultHrefLang;

  return (
    <Helmet>
      {/* Título e Meta Tags Básicas */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow" />}
      <link rel="canonical" href={url} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:locale:alternate" content="en_US" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:creator" content="@djzeneyer" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* Hreflang Tags (Multilíngue) */}
      {finalHrefLang.map((h) => (
        <link key={`hreflang-${h.lang}`} rel="alternate" hrefLang={h.lang} href={h.href} />
      ))}

      {/* JSON-LD Schema */}
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>
    </Helmet>
  );
};