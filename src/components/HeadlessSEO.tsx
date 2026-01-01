// src/components/HeadlessSEO.tsx
// VERSÃO 8.2.0 - HREFLANG TRAILING SLASH FIX

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';

// ============================================================================
// 1. INTERFACES E TIPOS
// ============================================================================

export interface PreloadItem {
  href: string;
  as: 'script' | 'style' | 'font' | 'fetch';
  media?: string;
  type?: string;
  crossOrigin?: string;
}

interface ZenSeoPluginData {
  title?: string;
  desc?: string;
  image?: string;
  noindex?: boolean;
  canonical?: string;
  event_date?: string;
  event_location?: string;
  event_ticket?: string;
}

interface HrefLang {
  lang: string;
  url: string;
}

interface HeadlessSEOProps {
  data?: ZenSeoPluginData;
  schema?: object;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  hrefLang?: HrefLang[];
  noindex?: boolean;
  keywords?: string;
  isHomepage?: boolean;
  preload?: PreloadItem[];
}

// ============================================================================
// 2. HELPER FUNCTIONS
// ============================================================================

const ensureAbsoluteUrl = (u: string, baseUrl: string): string => {
  if (!u) return baseUrl;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = u.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
};

// 🔥 FIX CRÍTICO: Função atualizada para garantir barra no final nos Hreflangs
export const getHrefLangUrls = (path: string, baseUrl: string): HrefLang[] => {
  // Remove /pt, barras iniciais e barras finais para limpar
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '').replace(/\/$/, '') || '/';
  
  // Se for Home (/), suffix é vazio. Se for interna, adiciona barra antes e DEPOIS.
  const suffix = cleanPath === '/' ? '' : `/${cleanPath}/`; 

  return [
    { lang: 'en', url: `${baseUrl}${suffix}` },
    { lang: 'pt-BR', url: `${baseUrl}/pt${suffix}` },
    { lang: 'x-default', url: `${baseUrl}${suffix}` },
  ];
};

// ============================================================================
// 3. COMPONENTE PRINCIPAL
// ============================================================================

export const HeadlessSEO: React.FC<HeadlessSEOProps> = ({
  data,
  schema,
  title,
  description,
  url,
  image,
  type = 'website',
  hrefLang = [],
  noindex = false,
  keywords,
  isHomepage = false,
  preload = [],
}) => {
  const baseUrl = ARTIST.site.baseUrl;

  // --- Lógica de Fallback de Dados ---
  
  // 1. Título
  const finalTitle =
    data?.title ||
    title ||
    'DJ Zen Eyer | World Champion Brazilian Zouk DJ';

  // 2. Descrição
  const finalDescription =
    data?.desc || 
    description || 
    ARTIST.site.defaultDescription;

  const truncatedDesc =
    finalDescription.length > 160
      ? `${finalDescription.substring(0, 157)}...`
      : finalDescription;

  // 3. URL (Canonical)
  const finalUrlRaw = data?.canonical || url || baseUrl;
  let finalUrl = ensureAbsoluteUrl(finalUrlRaw, baseUrl);

  // 🔥 FIX: FORÇAR BARRA NO FINAL (TRAILING SLASH) NO CANONICAL
  if (!finalUrl.endsWith('/') && !finalUrl.includes('?')) {
    finalUrl = `${finalUrl}/`;
  }

  // 4. Imagem
  const finalImage = ensureAbsoluteUrl(
    data?.image || image || `${baseUrl}/images/zen-eyer-og-image.jpg`,
    baseUrl
  );

  // 5. NoIndex
  const shouldNoIndex = data?.noindex || noindex;

  // --- Schema.org ---
  let finalSchema: any = schema;
  
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
    finalSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: finalTitle,
      description: truncatedDesc,
      url: finalUrl,
    };
  }

  return (
    <Helmet>
      {/* 1. Preload Links */}
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
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />

      {/* 3. SEO Meta Data */}
      <title>{finalTitle}</title>
      <meta name="description" content={truncatedDesc} />
      
      {/* ✅ Canonical URL com barra no final */}
      <link rel="canonical" href={finalUrl} />
      
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots Control */}
      <meta
        name="robots"
        content={
          shouldNoIndex
            ? 'noindex, nofollow'
            : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
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

      {/* Twitter Cards */}
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

      {/* JSON-LD seguro */}
      {finalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(finalSchema).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  );
};