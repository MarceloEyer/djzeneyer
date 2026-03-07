// src/components/HeadlessSEO.tsx
// VERSÃO 8.3.0 - FIX: HTML LANG DYNAMIC & SOCIAL FALLBACK

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { getAlternateLinks, normalizeLanguage } from '../config/routes';
import { safeUrl } from '../utils/sanitize';

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

export interface EventSchemaData {
  title?: string | { rendered?: string };
  name?: string;
  starts_at?: string;
  event_date?: string;
  start_date?: string;
  ends_at?: string;
  end_date?: string;
  location?: { venue?: string; city?: string; country?: string };
  event_location?: string;
  event_ticket?: string;
  tickets?: { url?: string }[];
  offers?: { url?: string }[];
  image?: string;
  description?: string;
  desc?: string;
  [key: string]: unknown;
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
  locale?: 'en_US' | 'pt_BR';
  leadAnswer?: string;
  faqs?: { q: string; a: string }[]; // NOVO: Suporte a FAQ Schema
  events?: EventSchemaData[]; // NOVO: Suporte a Event Schema (passado via data do GamiPress/API)
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

// ⚡ Bolt: Wrapped HeadlessSEO with React.memo to prevent unnecessary re-renders.
// This component is used on almost every page and its props (like title, description)
// rarely change during a single page view, making it a prime candidate for memoization.
// Impact: Reduces React render cycle overhead for this component when parent components update.
export const HeadlessSEO = React.memo<HeadlessSEOProps>(({
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
  leadAnswer,
  faqs,
  events,
}) => {
  const baseUrl = ARTIST.site.baseUrl;
  const { i18n } = useTranslation();
  const location = useLocation();
  const currentLang = normalizeLanguage(i18n.language || 'en');

  // 1. Automatic Hreflang Generation
  const computedHrefLang = React.useMemo(() => {
    // If explicitly provided, use it (backward compatibility)
    if (hrefLang && hrefLang.length > 0) return hrefLang;

    const links: HrefLang[] = [];
    const siteUrlClean = baseUrl.replace(/\/$/, '');

    // Add alternates (which include current and x-default)
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
  const rawDescription = data?.desc || description || ARTIST.site.defaultDescription;
  const finalTitle = data?.title || title || 'DJ Zen Eyer | World Champion Brazilian Zouk DJ';

  // AIO Enhancement: Lead Answer logic
  const finalDescription = leadAnswer
    ? `${leadAnswer.trim()}${leadAnswer.endsWith('.') ? '' : '.'} ${rawDescription}`
    : rawDescription;

  const truncatedDesc = finalDescription.length > 160
    ? `${finalDescription.substring(0, 157)}...`
    : finalDescription;

  const finalUrlRaw = data?.canonical || url || baseUrl;
  const absoluteUrl = ensureAbsoluteUrl(finalUrlRaw, baseUrl);
  const finalUrl = safeUrl(ensureTrailingSlash(absoluteUrl));

  // FIX: Imagem padrão robusta se nada for passado
  const defaultImage = `${baseUrl}/images/zen-eyer-og-image.png`;
  const finalImage = safeUrl(ensureAbsoluteUrl(data?.image || image || defaultImage, baseUrl), defaultImage);

  const shouldNoIndex = data?.noindex || noindex;

  // Determinação inteligente do idioma para a tag <html lang="">
  // Se não foi passado via prop, usa o idioma atual do i18n (SSOT)
  let currentLocale = locale;
  if (!currentLocale) {
    currentLocale = currentLang === 'pt' ? 'pt_BR' : 'en_US';
  }
  const htmlLangAttribute = currentLocale === 'pt_BR' ? 'pt-BR' : 'en';
  const nameParts = ARTIST.identity.fullName.split(' ').filter(Boolean);
  const authorFirstName = nameParts[0] || ARTIST.identity.stageName;
  const authorLastName = nameParts.slice(1).join(' ') || ARTIST.identity.stageName;
  const isProfileType = type === 'profile';

  // Schema Generation (Mantido igual)
  let finalSchema: Record<string, unknown> | undefined = schema as Record<string, unknown> | undefined;
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
          mainEntityOfPage: { '@id': `${baseUrl}/#artist` },
          description: truncatedDesc,
          inLanguage: htmlLangAttribute,
        },
      ],
    };
  }

  // 4. Advanced Schema Logic (Breadcrumbs, FAQ, Events)
  if (!schema) {
    const graph: Record<string, unknown>[] = [];
    const siteUrlClean = baseUrl.replace(/\/$/, '');

    // 4.1 BreadcrumbList (Automatic)
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const breadcrumbList = {
        '@type': 'BreadcrumbList',
        '@id': `${finalUrl}#breadcrumb`,
        itemListElement: pathSegments.map((segment, index) => {
          const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@id': `${siteUrlClean}${path}${isLast ? '' : '/'}`,
              name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
            },
          };
        }),
      };
      graph.push(breadcrumbList);
    }

    // 4.2 FAQPage Schema
    if (faqs && faqs.length > 0) {
      graph.push({
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      });
    }

    // 4.3 Event Schema (If on events page or specific event)
    if (events && events.length > 0) {
      events.forEach((event) => {
        const eventTitle = event.title?.rendered || event.title || event.name || 'Zouk Event';
        const startDate = event.starts_at || event.event_date || event.start_date;
        const endDate = event.ends_at || event.end_date;

        // Location mapping
        const locName = event.location?.venue || event.event_location || 'TBA';

        // Offers mapping
        let eventOffers: Record<string, unknown> | undefined = undefined;
        const ticketUrl = event.event_ticket || (event.tickets && event.tickets[0]?.url) || (event.offers && event.offers[0]?.url);

        if (ticketUrl) {
          eventOffers = {
            '@type': 'Offer',
            url: ticketUrl,
            availability: 'https://schema.org/InStock',
            validFrom: startDate,
          };
        }

        graph.push({
          '@type': 'Event',
          name: eventTitle,
          startDate: startDate,
          ...(endDate ? { endDate } : {}),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: locName.toLowerCase().includes('online')
            ? 'https://schema.org/OnlineEventAttendanceMode'
            : 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: locName,
            address: {
              '@type': 'PostalAddress',
              streetAddress: locName,
              addressLocality: event.location?.city || '',
              addressCountry: event.location?.country || '',
            }
          },
          image: event.image || finalImage,
          description: (event.description || event.desc || '').replace(/<[^>]*>?/gm, '').substring(0, 300),
          performer: {
            '@type': 'Person',
            name: ARTIST.identity.stageName,
            sameAs: ARTIST.social.instagram
          },
          ...(eventOffers ? { offers: eventOffers } : {}),
        });
      });
    }

    // Combine with WebPage base
    const webPageSchema = {
      '@type': 'WebPage',
      '@id': `${finalUrl}#webpage`,
      url: finalUrl,
      name: finalTitle,
      isPartOf: { '@id': `${baseUrl}/#website` },
      about: { '@id': `${baseUrl}/#artist` },
      description: truncatedDesc,
      inLanguage: htmlLangAttribute,
    };

    if (graph.length > 0) {
      finalSchema = {
        '@context': 'https://schema.org',
        '@graph': [
          ...(isHomepage ? [
            {
              '@type': 'WebSite',
              '@id': `${baseUrl}/#website`,
              url: baseUrl,
              name: 'DJ Zen Eyer',
              publisher: { '@id': `${baseUrl}/#artist` },
            },
            { ...ARTIST_SCHEMA_BASE, '@id': `${baseUrl}/#artist` }
          ] : []),
          webPageSchema,
          ...graph
        ],
      };
    } else if (isHomepage) {
      // Re-use original homepage schema if no dynamic graph items
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
          webPageSchema,
        ],
      };
    } else {
      finalSchema = webPageSchema; // Fallback to basic WebPage if no graph
    }
  }

  // Identificador para o script do schema para evitar duplicidade
  // react-helmet-async não remove scripts duplicados se não tiverem uma chave única
  const schemaId = isHomepage ? 'homepage-schema' : `schema-${location.pathname.replace(/\//g, '-')}`;

  return (
    <Helmet>
      {/* 1. CRUCIAL: Define o lang na tag HTML raiz */}
      <html lang={htmlLangAttribute} />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />

      {/* Preloads */}
      {preload.map((item, index) => (
        <link key={`preload-${index}`} rel="preload" {...item} href={safeUrl(item.href)} />
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
        <link key={lang} rel="alternate" hrefLang={lang} href={safeUrl(hrefUrl)} />
      ))}

      {/* Schema JSON-LD */}
      {finalSchema && (
        <script key={schemaId} type="application/ld+json">
          {JSON.stringify(finalSchema).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  );
});
