// src/components/HeadlessSEO.tsx
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * 🔥 ATUALIZAÇÃO IMPORTANTE:
 * - O plugin WordPress agora renderiza meta tags no servidor
 * - Este componente agora é apenas para ATUALIZAR tags em rotas React
 * - Não duplica tags que já existem no HTML inicial
 */

export interface ZenSeoData {
  title: string;
  meta: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  schema?: object;
}

interface HrefLang {
  lang: string;
  url: string;
}

interface HeadlessSEOProps {
  // Dados manuais (para rotas React puras)
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  hrefLang?: HrefLang[];
  schema?: object;
  noindex?: boolean;
  
  // Dados da API (para posts/páginas WP)
  data?: ZenSeoData;
}

// Helper para gerar URLs hrefLang
export const getHrefLangUrls = (path: string, baseUrl: string = 'https://djzeneyer.com'): HrefLang[] => {
  const cleanPath = path.replace(/^\/pt/, '').replace(/^\//, '') || '/';
  const enPath = cleanPath === '/' ? '' : `/${cleanPath}`;
  const ptPath = cleanPath === '/' ? '/pt/' : `/pt/${cleanPath}`;
  
  return [
    { lang: 'en', url: `${baseUrl}${enPath}` },
    { lang: 'pt-BR', url: `${baseUrl}${ptPath}` },
    { lang: 'x-default', url: `${baseUrl}${enPath}` },
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
  noindex = false
}) => {
  // Prioridade: API > Manual > Padrão
  const finalTitle = data?.title || title || 'DJ Zen Eyer | Brazilian Zouk DJ';
  const finalDesc = data?.meta.find(m => m.name === 'description')?.content 
    || description 
    || 'International Brazilian Zouk DJ, music producer, and Mensa member.';
  const finalImage = data?.meta.find(m => m.property === 'og:image')?.content 
    || image 
    || 'https://djzeneyer.com/images/zen-eyer-og-default.jpg';
  const finalUrl = url || 'https://djzeneyer.com';
  
  useEffect(() => {
    // Atualiza title do documento (mais rápido que Helmet)
    document.title = finalTitle;
  }, [finalTitle]);

  return (
    <Helmet>
      {/* Title & Meta básicas */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <link rel="canonical" href={finalUrl} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />

      {/* Open Graph */}
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

      {/* HrefLang */}
      {hrefLang.map((link) => (
        <link 
          key={link.lang} 
          rel="alternate" 
          hrefLang={link.lang} 
          href={link.url} 
        />
      ))}

      {/* Schema.org (se fornecido via API ou manual) */}
      {(data?.schema || schema) && (
        <script type="application/ld+json">
          {JSON.stringify(data?.schema || schema)}
        </script>
      )}
    </Helmet>
  );
};

export default HeadlessSEO;