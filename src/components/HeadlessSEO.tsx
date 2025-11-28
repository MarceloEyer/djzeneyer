// src/components/HeadlessSEO.tsx - VERSÃO OTIMIZADA SEM REDUNDÂNCIA
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';

interface ZenSeoData {
  title: string;
  meta: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  jsonld: object;
}

interface HrefLang {
  lang: string;
  url: string;
}

interface HeadlessSEOProps {
  data?: ZenSeoData;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  hrefLang?: HrefLang[];
  schema?: object;
  noindex?: boolean;
  keywords?: string;
  isHomepage?: boolean; // NOVO: Flag para homepage
}

export const getHrefLangUrls = (path: string, baseUrl: string): HrefLang[] => {
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '') || '/';
  return [
    { lang: 'en', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'pt-BR', url: `${baseUrl}/pt${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'x-default', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
  ];
};

export const HeadlessSEO: React.FC<HeadlessSEOProps> = ({
  data,
  title,
  description,
  url,
  image,
  type = 'website',
  hrefLang = [],
  schema,
  noindex = false,
  keywords,
  isHomepage = false,
}) => {
  // Prioridade: API > Props > Padrão
  const finalTitle = data?.title || title || 'DJ Zen Eyer | World Champion Brazilian Zouk DJ';
  const metaDescPlugin = data?.meta.find(m => m.name === 'description')?.content;
  const finalDescription = metaDescPlugin || description || '';
  const truncatedDesc = finalDescription.length > 160 
    ? finalDescription.substring(0, 157) + '...' 
    : finalDescription;

  const finalUrl = data?.meta.find(m => m.property === 'og:url')?.content || url || ARTIST.site.baseUrl;
  const finalImage = data?.meta.find(m => m.property === 'og:image')?.content || image || `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`;

  // Schema: Se for homepage, usa o schema completo de artistData.ts
  // Se for outra página, usa o schema fornecido ou cria um básico
  let finalSchema: any;

  if (isHomepage) {
    // Homepage: Schema @graph completo (WebSite + Person + WebPage)
    finalSchema = data?.jsonld || schema || {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${ARTIST.site.baseUrl}/#website`,
          "url": ARTIST.site.baseUrl,
          "name": "DJ Zen Eyer - Official Website",
          "description": "Official website of DJ Zen Eyer, 2× World Champion Brazilian Zouk DJ & Producer",
          "publisher": { "@id": `${ARTIST.site.baseUrl}/#artist` },
          "inLanguage": ["en", "pt-BR"],
        },
        {
          ...ARTIST_SCHEMA_BASE,
          "nationality": { "@type": "Country", "name": "Brazil" },
          "birthDate": ARTIST.identity.birthDate,
          "knowsAbout": ["Brazilian Zouk", "Music Production", "DJing", "Remixing", "Kizomba"],
        },
        {
          "@type": "WebPage",
          "@id": `${ARTIST.site.baseUrl}/#webpage`,
          "url": ARTIST.site.baseUrl,
          "name": finalTitle,
          "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
          "about": { "@id": `${ARTIST.site.baseUrl}/#artist` },
          "description": truncatedDesc,
          "inLanguage": "en",
        },
      ],
    };
  } else {
    // Outras páginas: Schema simples (Person + WebPage)
    finalSchema = data?.jsonld || schema || {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "url": finalUrl,
      "name": finalTitle,
      "description": truncatedDesc,
      "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
      "about": { "@id": `${ARTIST.site.baseUrl}/#artist` },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": ARTIST.site.baseUrl },
          { "@type": "ListItem", "position": 2, "name": finalTitle, "item": finalUrl },
        ],
      },
    };
  }

  return (
    <Helmet>
      {/* Tags Básicas */}
      <title>{finalTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={finalUrl} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      {/* Open Graph */}
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="pt_BR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />

      {/* HrefLang */}
      {hrefLang.map(({ lang, url: hrefUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={hrefUrl} />
      ))}

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema, null, 0)}
      </script>
    </Helmet>
  );
};