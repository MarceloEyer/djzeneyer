// src/components/HeadlessSEO.tsx
// VERSÃO 8.3.0 - FIX: HTML LANG DYNAMIC & SOCIAL FALLBACK

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { getAlternateLinks, Language } from '../config/routes';
import { ensureTrailingSlash, HrefLang } from '../utils/seo';

// ============================================================================
// 1. INTERFACES
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
  locale?: 'en_US' | 'pt_BR'; // NOVO: Controle explícito de locale
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
  locale,
}) => {
  const baseUrl = ARTIST.site.baseUrl;
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = (i18n.language || 'en') as Language;

  // 1. Automatic Hreflang Generation
  const computedHrefLang = React.useMemo(() => {
    // If explicitly provided, use it (backward compatibility)
    if (hrefLang && hrefLang.length > 0) return hrefLang;

    const links: HrefLang[] = [];
    const siteUrlClean = baseUrl.replace(/\/$/, '');

    // Add current page
    const currentPathNormalized = location.pathname.startsWith('/') ? location.pathname : `/${location.pathname}`;
    const currentFullUrl = ensureTrailingSlash(`${siteUrlClean}${currentPathNormalized}`);

    links.push({
        lang: currentLang === 'pt' ? 'pt-BR' : 'en',
        url: currentFullUrl
    });

    // Add alternates
    try {
      const alternates = getAlternateLinks(location.pathname, currentLang);
      Object.entries(alternates).forEach(([lang, path]) => {
          // Normalize path to ensure it starts with /
          const safePath = path.startsWith('/') ? path : `/${path}`;
          const url = ensureTrailingSlash(`${siteUrlClean}${safePath}`);

          if (lang === 'x-default') {
               links.push({ lang: 'x-default', url });
          } else {
               links.push({ lang: lang === 'pt' ? 'pt-BR' : 'en', url });
          }
      });
    } catch (err) {
      console.error('Error generating alternate links:', err);
    }

    return links;
  }, [hrefLang, location.pathname, currentLang, baseUrl]);

  // 2. Fallbacks
  const finalTitle = data?.title || title || 'DJ Zen Eyer | World Champion Brazilian Zouk DJ';
  const finalDescription = data?.desc || description || ARTIST.site.defaultDescription;
  
  const truncatedDesc = finalDescription.length > 160
      ? `${finalDescription.substring(0, 157)}...`
      : finalDescription;

  const finalUrlRaw = data?.canonical || url || baseUrl;
  const absoluteUrl = ensureAbsoluteUrl(finalUrlRaw, baseUrl);
  const finalUrl = ensureTrailingSlash(absoluteUrl);

  // FIX: Imagem padrão robusta se nada for passado
  const defaultImage = `${baseUrl}/images/zen-eyer-og-image.svg`; // Certifique-se que essa imagem existe na pasta public/images/
  const finalImage = ensureAbsoluteUrl(data?.image || image || defaultImage, baseUrl);

  const shouldNoIndex = data?.noindex || noindex;

  // FIX: Determinação inteligente do idioma para a tag <html lang="">
  // Se não foi passado via prop, tenta adivinhar pela URL
  let currentLocale = locale;
  if (!currentLocale) {
    currentLocale = finalUrl.includes('/pt/') ? 'pt_BR' : 'en_US';
  }
  const htmlLangAttribute = currentLocale === 'pt_BR' ? 'pt-BR' : 'en';
  const nameParts = ARTIST.identity.fullName.split(' ').filter(Boolean);
  const authorFirstName = nameParts[0] || ARTIST.identity.stageName;
  const authorLastName = nameParts.slice(1).join(' ') || ARTIST.identity.stageName;
  const isProfileType = type === 'profile';

  // Schema Generation (Mantido igual)
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
        { ...ARTIST_SCHEMA_BASE, '@id': `${baseUrl}/#artist` },
        {
          '@type': 'WebPage',
          '@id': `${baseUrl}/#webpage`,
          url: baseUrl,
          name: finalTitle,
          isPartOf: { '@id': `${baseUrl}/#website` },
          about: { '@id': `${baseUrl}/#artist` },
          description: truncatedDesc,
          inLanguage: htmlLangAttribute,
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
      {/* 1. CRUCIAL: Define o lang na tag HTML raiz */}
      <html lang={htmlLangAttribute} />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />

      {/* Preloads */}
      {preload.map((item, index) => (
        <link key={`preload-${index}`} rel="preload" {...item} />
      ))}

      {/* Basic SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={finalUrl} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={ARTIST.identity.stageName} />
      <meta name="creator" content={ARTIST.identity.fullName} />
      <meta name="publisher" content={ARTIST.identity.stageName} />
      <meta name="subject" content="Brazilian Zouk DJ & Music Producer" />

      {/* Robots */}
      <meta
        name="robots"
        content={shouldNoIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* Open Graph (Facebook/LinkedIn) */}
      <meta property="og:site_name" content="DJ Zen Eyer" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={truncatedDesc} />
      <meta property="og:url" content={finalUrl} />
      
      {/* FIX: Garante que as imagens sempre apareçam */}
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      <meta property="og:locale" content={currentLocale} />
      <meta property="og:locale:alternate" content={currentLocale === 'en_US' ? 'pt_BR' : 'en_US'} />
      {isProfileType && (
        <>
          <meta property="profile:first_name" content={authorFirstName} />
          <meta property="profile:last_name" content={authorLastName} />
          <meta property="profile:username" content="djzeneyer" />
        </>
      )}

      {/* Twitter Cards (X) - FIX: Adicionado summary_large_image explicitamente */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={truncatedDesc} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@djzeneyer" />
      <meta name="twitter:creator" content="@djzeneyer" />

      {/* Hreflang Tags */}
      {computedHrefLang.map(({ lang, url: hrefUrl }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={hrefUrl} />
      ))}

      {/* Schema JSON-LD */}
      {finalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(finalSchema).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  );
};
