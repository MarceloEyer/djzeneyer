// src/components/HeadlessSEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';

// Nova interface para itens de preload
export interface PreloadItem {
  href: string;
  as: 'image' | 'script' | 'style' | 'font' | 'fetch';
  media?: string;
  type?: string;
  crossOrigin?: string;
}

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
  isHomepage?: boolean;
  preload?: PreloadItem[]; // ✅ Nova Prop
}

const ensureAbsoluteUrl = (u: string, baseUrl: string): string => {
  if (!u) return baseUrl;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = u.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
};

export const getHrefLangUrls = (path: string, baseUrl: string): HrefLang[] => {
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '') || '/';
  const suffix = cleanPath === '/' ? '' : `/${cleanPath}`;
  return [
    { lang: 'en', url: `${baseUrl}${suffix}` },
    { lang: 'pt-BR', url: `${baseUrl}/pt${suffix}` },
    { lang: 'x-default', url: `${baseUrl}${suffix}` },
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
  preload = [], // ✅ Default vazio
}) => {
  const baseUrl = ARTIST.site.baseUrl;

  // Título
  const finalTitle =
    data?.title ||
    title ||
    'DJ Zen Eyer | World Champion Brazilian Zouk DJ';

  // Descrição
  const metaDescPlugin = data?.meta.find(m => m.name === 'description')?.content;
  const finalDescription =
    metaDescPlugin || description || ARTIST.site.defaultDescription;

  const truncatedDesc =
    finalDescription.length > 160
      ? `${finalDescription.substring(0, 157)}...`
      : finalDescription;

  // URL e imagem absolutas
  const ogUrlMeta = data?.meta.find(m => m.property === 'og:url')?.content;
  const finalUrlRaw = ogUrlMeta || url || baseUrl;
  const finalUrl = ensureAbsoluteUrl(finalUrlRaw, baseUrl);

  const ogImageMeta = data?.meta.find(m => m.property === 'og:image')?.content;
  const finalImage = ensureAbsoluteUrl(
    ogImageMeta || image || `${baseUrl}/images/zen-eyer-og-image.jpg`,
    baseUrl
  );

  // Schema Logic (Simplificado para o exemplo, mantendo sua lógica original)
  let finalSchema: any = data?.jsonld || schema;

  if (!finalSchema && isHomepage) {
     finalSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          url: baseUrl,
          name: 'DJ Zen Eyer - Official Website',
          description: ARTIST.site.defaultDescription,
          publisher: { '@id': `${baseUrl}/#artist` },
          inLanguage: ['en', 'pt-BR'],
        },
        {
          ...ARTIST_SCHEMA_BASE,
          '@id': `${baseUrl}/#artist`,
          // ... resto do seu schema base
        },
        {
          '@type': 'WebPage',
          '@id': `${baseUrl}/#webpage`,
          url: baseUrl,
          name: finalTitle,
          isPartOf: { '@id': `${baseUrl}/#website` },
          about: { '@id': `${baseUrl}/#artist` },
          description: truncatedDesc,
          inLanguage: 'en',
        },
      ],
    };
  } else if (!finalSchema) {
    // Fallback genérico para páginas internas
    finalSchema = {
       '@context': 'https://schema.org',
       '@type': 'WebPage',
       name: finalTitle,
       description: truncatedDesc
    }
  }

  return (
    <Helmet>
      {/* 1. Preload Links (Prioridade Alta) */}
      {preload.map((item, index) => (
        <link 
          key={`preload-${index}`} 
          rel="preload" 
          href={item.href} 
          as={item.as} 
          media={item.media} 
          type={item.type}
          crossOrigin={item.crossOrigin}
        />
      ))}

      {/* 2. Meta Tags Básicas */}
      <title>{finalTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={finalUrl} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots */}
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow, max-image-preview:large'
            : 'index, follow, max-image-preview:large'
        }
      />

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

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />

      {/* Hreflang */}
      {hrefLang.map(({ lang, url: hrefUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={hrefUrl} />
      ))}

      {/* JSON-LD */}
      {finalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(finalSchema)}
        </script>
      )}
    </Helmet>
  );
};