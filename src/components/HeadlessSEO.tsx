// src/components/HeadlessSEO.tsx
// ============================================================================
// COMPONENTE SEO HÍBRIDO (Zen SEO Plugin + Dados Locais)
// ============================================================================

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';

// 1. Tipagem dos dados que vêm do Plugin WordPress
interface ZenSeoData {
  title: string;
  meta: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  schema: object;
}

interface HrefLang {
  lang: string;
  url: string;
}

interface HeadlessSEOProps {
  // Dados automáticos (Vêm da API do WordPress)
  data?: ZenSeoData; 
  
  // Dados manuais (Fallbacks para páginas estáticas do React)
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string; // 'website', 'article', etc.
  isHomepage?: boolean;
  hrefLang?: HrefLang[];
  schema?: object;
  noindex?: boolean;
  keywords?: string;
}

// Helper para gerar URLs hrefLang (Mantido da sua versão)
export const getHrefLangUrls = (path: string, baseUrl: string): HrefLang[] => {
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '') || '/';
  return [
    { lang: 'en', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'pt-BR', url: `${baseUrl}/pt${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'x-default', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
  ];
};

// Schema padrão (Fallback)
const getDefaultArtistSchema = (url: string) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  ...ARTIST_SCHEMA_BASE,
  "url": url,
});

export const HeadlessSEO: React.FC<HeadlessSEOProps> = ({
  data, // Dados vindos do Zen SEO Plugin
  title,
  description,
  url,
  image = `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`,
  type = 'website',
  hrefLang = [],
  schema,
  noindex = false,
  keywords
}) => {
  // 1. Lógica de Prioridade: Se tem dados do Plugin, usa eles. Senão, usa os props manuais.
  const finalTitle = data?.title || title || 'DJ Zen Eyer | World Champion Brazilian Zouk DJ';
  
  // Procura a descrição nos metadados do plugin ou usa o prop
  const metaDescPlugin = data?.meta.find(m => m.name === 'description')?.content;
  const finalDescription = metaDescPlugin || description || '';
  
  // Trunca descrição se for muito longa (Segurança)
  const truncatedDesc = finalDescription.length > 160 
    ? finalDescription.substring(0, 157) + '...' 
    : finalDescription;

  const finalUrl = data?.meta.find(m => m.property === 'og:url')?.content || url || 'https://djzeneyer.com';
  const finalImage = data?.meta.find(m => m.property === 'og:image')?.content || image;
  
  // Schema: Se vier do plugin, é o 'schema'. Se não, usa o manual ou o padrão.
  const finalSchema = data?.schema || schema || getDefaultArtistSchema(finalUrl);

  return (
    <Helmet>
      {/* --- Tags Básicas --- */}
      <title>{finalTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={finalUrl} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      {/* --- Open Graph (Facebook/WhatsApp) --- */}
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="pt_BR" />

      {/* --- Twitter Cards --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@djzeneyer" />

      {/* --- Identidade & Autoridade --- */}
      <meta name="author" content={ARTIST.identity.stageName} />
      <link rel="author" href={ARTIST.identifiers.wikidataUrl} />

      {/* --- HrefLang (Internacionalização) --- */}
      {hrefLang.map(({ lang, url: hrefUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={hrefUrl} />
      ))}

      {/* --- Performance --- */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

      {/* --- Schema.org JSON-LD --- */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};