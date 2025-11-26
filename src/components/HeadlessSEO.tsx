// src/components/HeadlessSEO.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';

// Tipagem dos dados que vêm da API do WordPress (Plugin Zen SEO)
export interface ZenSeoData {
  title: string;
  meta: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  jsonld: object; // O Schema.org completo gerado pelo plugin
}

interface HrefLang {
  lang: string;
  url: string;
}

interface HeadlessSEOProps {
  // 1. Dados Automáticos (Vindos da API)
  data?: ZenSeoData; 
  
  // 2. Dados Manuais (Fallbacks)
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string; 
  hrefLang?: HrefLang[];
  schema?: object;
  noindex?: boolean;
}

// Helper para gerar URLs hrefLang
export const getHrefLangUrls = (path: string, baseUrl: string): HrefLang[] => {
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '') || '/';
  return [
    { lang: 'en', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'pt-BR', url: `${baseUrl}/pt${cleanPath === '/' ? '' : `/${cleanPath}`}` },
    { lang: 'x-default', url: `${baseUrl}${cleanPath === '/' ? '' : `/${cleanPath}`}` },
  ];
};

export const HeadlessSEO: React.FC<HeadlessSEOProps> = ({
  data, title, description, url, image, type = 'website', hrefLang = [], schema, noindex = false
}) => {
  // LÓGICA DE PRIORIDADE: API > Manual > Padrão
  const finalTitle = data?.title || title || 'DJ Zen Eyer | World Champion Brazilian Zouk DJ';
  const finalDesc = data?.meta.find(m => m.name === 'description')?.content || description || '';
  const finalImage = data?.meta.find(m => m.property === 'og:image')?.content || image || `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`;
  const finalUrl = data?.meta.find(m => m.property === 'og:url')?.content || url || 'https://djzeneyer.com';
  
  // Schema: Usa o do Plugin (Rico) ou o Manual
  const finalSchema = data?.jsonld || schema || {
    "@context": "https://schema.org",
    "@type": "Person",
    ...ARTIST_SCHEMA_BASE,
    "url": finalUrl
  };

  return (
    <Helmet>
      {/* Meta Tags Fundamentais */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={finalUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      {/* Open Graph (Facebook/WhatsApp) */}
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* Schema.org (O que conserta o erro de Evento e Breadcrumb) */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default HeadlessSEO;