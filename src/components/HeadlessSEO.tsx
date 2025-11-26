// src/components/HeadlessSEO.tsx
// ============================================================================
// COMPONENTE SEO INTELIGENTE (Recebe dados prontos do Plugin Zen SEO)
// ============================================================================

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';

// Tipagem dos dados que vêm da API do WordPress (Plugin Zen SEO)
interface ZenSeoData {
  title: string;
  meta: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  schema: object; // O JSON-LD pronto
}

interface HrefLang {
  lang: string;
  url: string;
}

interface HeadlessSEOProps {
  // 1. Dados Automáticos (Vindos da API)
  data?: ZenSeoData; 
  
  // 2. Dados Manuais (Fallbacks para páginas estáticas como Home/Music)
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string; 
  hrefLang?: HrefLang[];
  schema?: object;
  noindex?: boolean;
  keywords?: string;
}

// Helper para gerar URLs hrefLang (Internacionalização)
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
  image = `${ARTIST.site.baseUrl}/images/zen-eyer-og-image.jpg`,
  type = 'website',
  hrefLang = [],
  schema,
  noindex = false,
  keywords
}) => {
  // LÓGICA HÍBRIDA:
  // Se a API mandou dados (data), usamos eles (Prioridade Total).
  // Se não (página estática), usamos os props manuais ou padrões.

  const finalTitle = data?.title || title || 'DJ Zen Eyer | World Champion Brazilian Zouk DJ';
  
  // Busca descrição na API ou usa manual
  const metaDescPlugin = data?.meta.find(m => m.name === 'description')?.content;
  const finalDescription = metaDescPlugin || description || '';
  
  // Trunca descrição para não estourar no Google
  const truncatedDesc = finalDescription.length > 160 
    ? finalDescription.substring(0, 157) + '...' 
    : finalDescription;

  const finalUrl = data?.meta.find(m => m.property === 'og:url')?.content || url || 'https://djzeneyer.com';
  const finalImage = data?.meta.find(m => m.property === 'og:image')?.content || image;
  
  // O PULO DO GATO: O Schema já vem montado do servidor ou usa o padrão
  const finalSchema = data?.schema || schema || {
    "@context": "https://schema.org",
    "@type": "Person",
    ...ARTIST_SCHEMA_BASE,
    "url": finalUrl
  };

  return (
    <Helmet>
      {/* --- Tags Básicas --- */}
      <title>{finalTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={finalUrl} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      {/* --- Open Graph (Facebook/WhatsApp/LinkedIn) --- */}
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

      {/* --- Twitter Cards (X) --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@djzeneyer" />

      {/* --- Identidade & Autoridade (IAs) --- */}
      <meta name="author" content={ARTIST.identity.stageName} />
      <link rel="author" href={ARTIST.identifiers.wikidataUrl} />

      {/* --- Internacionalização --- */}
      {hrefLang.map(({ lang, url: hrefUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={hrefUrl} />
      ))}

      {/* --- JSON-LD (Schema.org) --- */}
      <script type="application/ld+json">
        {JSON.stringify(finalSchema)}
      </script>
    </Helmet>
  );
};

export default HeadlessSEO;