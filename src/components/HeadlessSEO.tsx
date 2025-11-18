// src/components/HeadlessSEO.tsx
// ============================================================================
// HEADLESS SEO COMPONENT - VERSÃO REFATORADA
// ============================================================================
// OTIMIZAÇÕES:
// ✅ Schema.org separado (WebSite + Person/MusicGroup)
// ✅ ISNI adicionado (congruência Wikidata)
// ✅ Hreflang mapping explícito
// ✅ Performance otimizada (constantes estáticas)
// ============================================================================

import React from 'react';
import { Helmet } from 'react-helmet-async';

// ============================================================================
// HREFLANG MAPPING (SSOT - Single Source of Truth)
// ============================================================================
export const HREFLANG_MAP: Record<string, { en: string; 'pt-BR': string }> = {
  '/': { en: '/', 'pt-BR': '/pt' },
  '/about': { en: '/about', 'pt-BR': '/pt/sobre' },
  '/events': { en: '/events', 'pt-BR': '/pt/eventos' },
  '/music': { en: '/music', 'pt-BR': '/pt/musica' },
  '/shop': { en: '/shop', 'pt-BR': '/pt/loja' },
  '/zentribe': { en: '/zentribe', 'pt-BR': '/pt/tribo-zen' },
  '/faq': { en: '/faq', 'pt-BR': '/pt/faq' },
  '/press-kit': { en: '/press-kit', 'pt-BR': '/pt/imprensa' },
  '/work-with-me': { en: '/work-with-me', 'pt-BR': '/pt/trabalhe-comigo' },
  '/cart': { en: '/cart', 'pt-BR': '/pt/carrinho' },
  '/checkout': { en: '/checkout', 'pt-BR': '/pt/finalizar' },
  '/my-account': { en: '/my-account', 'pt-BR': '/pt/minha-conta' },
  '/dashboard': { en: '/dashboard', 'pt-BR': '/pt/painel' }
};

/**
 * Gera URLs hreflang corretas baseadas no pathname
 */
export const getHrefLangUrls = (pathname: string, baseUrl = 'https://djzeneyer.com'): Array<{ lang: string; href: string }> => {
  const paths = HREFLANG_MAP[pathname] || { en: pathname, 'pt-BR': `/pt${pathname}` };
  
  return [
    { lang: 'en', href: `${baseUrl}${paths.en}` },
    { lang: 'pt-BR', href: `${baseUrl}${paths['pt-BR']}` },
    { lang: 'x-default', href: `${baseUrl}${paths.en}` }
  ];
};

// ============================================================================
// SCHEMAS GLOBAIS (OTIMIZADOS)
// ============================================================================

/**
 * Schema WebSite (raiz do site)
 */
const WEBSITE_SCHEMA = {
  "@type": "WebSite",
  "@id": "https://djzeneyer.com/#website",
  "url": "https://djzeneyer.com",
  "name": "DJ Zen Eyer | World Champion Brazilian Zouk DJ",
  "description": "Official website of DJ Zen Eyer, two-time world champion Brazilian Zouk DJ and music producer",
  "publisher": { "@id": "https://djzeneyer.com/#artist" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://djzeneyer.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": ["en", "pt-BR"]
};

/**
 * Schema Person/MusicGroup (DJ Zen Eyer como entidade)
 * ✅ Congruência com Wikidata Q136551855 e MusicBrainz
 */
const ARTIST_SCHEMA = {
  "@type": ["Person", "MusicGroup"],
  "@id": "https://djzeneyer.com/#artist",
  "name": "DJ Zen Eyer",
  "alternateName": ["Zen Eyer", "Marcelo Eyer Fernandes"],
  "description": "Brazilian Zouk DJ and music producer. Two-time world champion (2022). Creator of the 'cremoso' audio signature. Member of Mensa International.",
  "url": "https://djzeneyer.com",
  "image": "https://djzeneyer.com/images/zen-eyer-og.jpg",
  
  // ✅ IDENTIFIERS (Congruência Wikidata/MusicBrainz/ISNI)
  "sameAs": [
    "https://www.wikidata.org/wiki/Q136551855",
    "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
    "https://isni.org/isni/0000000528931015", // ✅ CRÍTICO para Entity Authority
    "https://www.instagram.com/djzeneyer/",
    "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
    "https://www.youtube.com/@djzeneyer",
    "https://soundcloud.com/djzeneyer",
    "https://music.apple.com/us/artist/zen-eyer/1439280950",
    "https://www.discogs.com/artist/16872046"
  ],
  
  // ✅ GENRE (Alinhado com Wikidata)
  "genre": ["Brazilian Zouk", "Zouk", "Kizomba", "Lambada"],
  
  // ✅ AWARD (Bicampeão Mundial)
  "award": [
    {
      "@type": "Award",
      "name": "World Champion Brazilian Zouk DJ - Best Performance",
      "datePublished": "2022"
    },
    {
      "@type": "Award",
      "name": "World Champion Brazilian Zouk DJ - Best Remix",
      "datePublished": "2022"
    }
  ],
  
  // ✅ BIOGRAPHICAL INFO
  "givenName": "Marcelo",
  "familyName": "Eyer Fernandes",
  "birthDate": "1985-08-28",
  "birthPlace": {
    "@type": "City",
    "name": "Rio de Janeiro",
    "addressCountry": "BR"
  },
  "nationality": {
    "@type": "Country",
    "name": "Brazil"
  },
  
  // ✅ AFFILIATIONS
  "memberOf": [
    {
      "@type": "Organization",
      "name": "Mensa International",
      "url": "https://www.mensa.org"
    }
  ],
  
  // ✅ OCCUPATION
  "jobTitle": "DJ and Music Producer",
  "hasOccupation": [
    {
      "@type": "Occupation",
      "name": "DJ",
      "occupationalCategory": "Music"
    },
    {
      "@type": "Occupation",
      "name": "Music Producer",
      "occupationalCategory": "Music"
    }
  ]
};

// ============================================================================
// INTERFACE
// ============================================================================
interface HeadlessSEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  ogType?: 'website' | 'profile' | 'article' | 'music.album' | 'music.playlist';
  twitterCard?: 'summary' | 'summary_large_image';
  schema?: any;
  hrefLang?: Array<{ lang: string; href: string }>;
  keywords?: string;
  noindex?: boolean;
  isHomepage?: boolean;
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
export const HeadlessSEO: React.FC<HeadlessSEOProps> = ({
  title,
  description,
  url,
  image = 'https://djzeneyer.com/images/zen-eyer-og.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  schema,
  hrefLang,
  keywords,
  noindex = false,
  isHomepage = false
}) => {
  
  // ============================================================================
  // SCHEMA GLOBAL (WebSite + Artist)
  // ============================================================================
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [WEBSITE_SCHEMA, ARTIST_SCHEMA]
  };

  // ============================================================================
  // SCHEMA FINAL (Global + Específico da Página)
  // ============================================================================
  const finalSchema = schema 
    ? { "@context": "https://schema.org", "@graph": [...globalSchema["@graph"], schema] }
    : globalSchema;

  // ============================================================================
  // HREFLANG (Auto-gerar se não fornecido)
  // ============================================================================
  const pathname = new URL(url).pathname;
  const finalHrefLang = hrefLang && hrefLang.length > 0 
    ? hrefLang 
    : getHrefLangUrls(pathname);

  return (
    <Helmet>
      {/* ====================================================================== */}
      {/* BASIC META TAGS */}
      {/* ====================================================================== */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      <link rel="canonical" href={url} />

      {/* ====================================================================== */}
      {/* OPEN GRAPH (Facebook, LinkedIn, WhatsApp) */}
      {/* ====================================================================== */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="pt_BR" />

      {/* ====================================================================== */}
      {/* TWITTER CARD */}
      {/* ====================================================================== */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* ====================================================================== */}
      {/* HREFLANG (Multilingual) */}
      {/* ====================================================================== */}
      {finalHrefLang.map((h) => (
        <link 
          key={`hreflang-${h.lang}`} 
          rel="alternate" 
          hrefLang={h.lang} 
          href={h.href} 
        />
      ))}

      {/* ====================================================================== */}
      {/* JSON-LD SCHEMA */}
      {/* ====================================================================== */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema, null, isHomepage ? 2 : 0)}
      </script>
    </Helmet>
  );
};

export default HeadlessSEO;