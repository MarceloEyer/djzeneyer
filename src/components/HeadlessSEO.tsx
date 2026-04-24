// src/components/HeadlessSEO.tsx
// VERSÃO 8.3.0 - FIX: HTML LANG DYNAMIC & SOCIAL FALLBACK

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ARTIST_SCHEMA_BASE } from '../data/artistData';
import { useBranding } from '../contexts/BrandingContext';
import { getAlternateLinks, normalizeLanguage } from '../config/routes';
import { safeUrl } from '../utils/sanitize';
import { ensureTrailingSlash } from '../utils/seo';
import { stripHtml } from '../utils/text';

// ============================================================================
// 1. INTERFACES
// ============================================================================

export interface HrefLang {
  lang: string;
  url: string;
}

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
  tickets?: string[];
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
  const { artist } = useBranding();
  const baseUrl = artist.site.baseUrl;
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
  const rawDescription = data?.desc || description || artist.site.defaultDescription;
  const finalTitle = data?.title || title || 'DJ Zen Eyer | World Champion Brazilian Zouk DJ';

  // AIO Enhancement: Lead Answer logic
  const finalDescription = leadAnswer
    ? `${leadAnswer.trim()}${leadAnswer.endsWith('.') ? '' : '.'} ${rawDescription}`
    : rawDescription;

  const truncatedDesc = finalDescription.length > 160
    ? `${finalDescription.substring(0, 157)}...`
    : finalDescription;

  // Fallback: usa a URL atual da página (pathname + baseUrl) em vez da homepage.
  // Evita canonical incorreto quando url prop não é passado — corrige
  // "Duplicate without user-selected canonical" no Search Console.
  const currentPageUrl = `${baseUrl.replace(/\/$/, '')}${location.pathname}`;
  const finalUrlRaw = data?.canonical || url || currentPageUrl;
  const absoluteUrl = ensureAbsoluteUrl(finalUrlRaw, baseUrl);
  const finalUrl = safeUrl(ensureTrailingSlash(absoluteUrl));

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
  const { authorFirstName, authorLastName } = React.useMemo(() => {
    const nameParts = artist.identity.fullName.split(' ').filter(Boolean);
    return {
      authorFirstName: nameParts[0] || artist.identity.stageName,
      authorLastName: nameParts.slice(1).join(' ') || artist.identity.stageName
    };
  }, [artist.identity.fullName, artist.identity.stageName]);
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
          description: artist.site.defaultDescription,
          publisher: { '@id': `${baseUrl}/#artist` },
          inLanguage: ['en', 'pt-BR'],
        },
        ARTIST_SCHEMA_BASE,
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
  // ⚡ Bolt: Wrapped dynamic graph generation (Breadcrumbs, FAQs, Events schema) in useMemo.
  // This prevents costly array mappings (split, filter, map) and string manipulations on every render,
  // particularly for the complex MusicEvent mapping logic which includes Date instantiations.
  const dynamicGraph = React.useMemo(() => {
    if (schema) return null;

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
      // eslint-disable-next-line react-hooks/purity
      const now = Date.now();
      const threeHoursMs = 3 * 60 * 60 * 1000;
      const musicEvents = events.map((event) => {
        const eventTitle = (typeof event.title === 'object' ? event.title.rendered : event.title) || event.name || 'Zouk Event';
        const canonicalUrl = event.canonical_url || event.url || undefined;
        const startDate = event.starts_at || event.event_date || event.start_date;
        const endDateRaw = event.ends_at || event.end_date;

        let parsedStartDate = 0;
        if (startDate) {
          parsedStartDate = Date.parse(startDate);
        }

        // Google requer endDate — estima +3h quando a API não fornece
        const endDate = endDateRaw || (startDate && !isNaN(parsedStartDate)
          ? new Date(parsedStartDate + threeHoursMs).toISOString()
          : undefined);

        // Check if event is in the past
        const isPast = startDate && !isNaN(parsedStartDate) ? parsedStartDate < now : false;

        // Location mapping
        const locName = event.location?.venue || event.event_location || 'TBA';

        // Offers — Google requer este campo mesmo para eventos passados
        // Mapeia todas as opções de tickets disponíveis
        let eventOffers: Record<string, unknown> | Record<string, unknown>[];
        const baseOffer = {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          validFrom: startDate,
        };

        if (Array.isArray(event.tickets) && event.tickets.length > 0) {
          eventOffers = event.tickets.filter((t: unknown) => typeof t === 'string').map((ticketUrl: string) => ({
            ...baseOffer,
            url: ticketUrl,
            availability: isPast ? 'https://schema.org/Discontinued' : 'https://schema.org/InStock',
          }));
        } else if (Array.isArray(event.offers) && event.offers.length > 0) {
          eventOffers = event.offers.filter((o: unknown) => (o as { url?: string })?.url).map((offer: unknown) => ({
            ...baseOffer,
            url: (offer as { url: string }).url,
            availability: isPast ? 'https://schema.org/Discontinued' : 'https://schema.org/InStock',
          }));
        } else {
          const ticketUrl = event.event_ticket || undefined;
          eventOffers = {
            ...baseOffer,
            url: ticketUrl || canonicalUrl || finalUrl,
            availability: isPast
              ? 'https://schema.org/Discontinued'
              : ticketUrl
                ? 'https://schema.org/InStock'
                : 'https://schema.org/LimitedAvailability',
          };
        }

        // Se eventOffers for um array vazio (fallback de safety), converte para fallback unitário
        if (Array.isArray(eventOffers) && eventOffers.length === 0) {
          eventOffers = {
            ...baseOffer,
            url: canonicalUrl || finalUrl,
            availability: isPast ? 'https://schema.org/Discontinued' : 'https://schema.org/LimitedAvailability',
          };
        }

        // description — Google exige campo não-vazio
        const eventDesc = stripHtml(event.description || event.desc || '').substring(0, 300)
          || `Live Brazilian Zouk DJ set by ${artist.identity.stageName} at ${locName}.`;

        return {
          '@type': 'MusicEvent',
          name: eventTitle,
          ...(canonicalUrl ? { url: canonicalUrl } : {}),
          startDate: startDate,
          endDate,
          // REMOVE eventStatus for past events as per technical review
          ...(!isPast ? { eventStatus: 'https://schema.org/EventScheduled' } : {}),
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
          description: eventDesc,
          performer: {
            '@type': 'MusicGroup',
            name: artist.identity.stageName,
            sameAs: Array.isArray(ARTIST_SCHEMA_BASE.sameAs) ? ARTIST_SCHEMA_BASE.sameAs[0] : ARTIST_SCHEMA_BASE.sameAs
          },
          offers: eventOffers,
          organizer: {
            '@type': 'Person',
            name: artist.identity.stageName,
            url: artist.site.baseUrl,
          },
        };
      }).filter(e => !!e.startDate); // Ensure required startDate

      if (musicEvents.length > 1) {
        graph.push({
          '@type': 'EventSeries',
          name: `${artist.identity.stageName} World Tour`,
          url: finalUrl,
          description: `Official tour dates and upcoming performances for ${artist.identity.stageName}.`,
          performer: {
            '@type': 'MusicGroup',
            name: artist.identity.stageName,
            url: artist.site.baseUrl,
            sameAs: artist.social.instagram?.url || (artist.social.instagram as unknown as string)
          },
          subEvent: musicEvents
        });
      } else if (musicEvents.length === 1) {
        graph.push(musicEvents[0]);
      }
    }

    return graph;
  }, [schema, baseUrl, location.pathname, finalUrl, faqs, events, artist, finalImage]);

  if (!schema) {
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

    if (dynamicGraph && dynamicGraph.length > 0) {
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
            ARTIST_SCHEMA_BASE
          ] : []),
          webPageSchema,
          ...dynamicGraph
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
            description: artist.site.defaultDescription,
            publisher: { '@id': `${baseUrl}/#artist` },
            inLanguage: ['en', 'pt-BR'],
          },
          ARTIST_SCHEMA_BASE,
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
      <meta name="theme-color" content="#0A0E27" />

      {/* Preloads */}
      {preload.map((item, index) => (
        <link key={`preload-${index}`} rel="preload" {...item} crossOrigin={item.crossOrigin} href={safeUrl(item.href)} />
      ))}

      {/* Basic SEO */}
      <title>{finalTitle}</title>
      <meta name="description" content={truncatedDesc} />
      <link rel="canonical" href={finalUrl} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={artist.identity.stageName} />
      <meta name="creator" content={artist.identity.fullName} />
      <meta name="publisher" content={artist.identity.stageName} />
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

      {/* Garante que as imagens sempre apareçam */}
      {finalImage && (
        <>
          <meta property="og:image" content={finalImage} />
          {finalImage.startsWith('https://') && <meta property="og:image:secure_url" content={finalImage} />}
          <meta property="og:image:alt" content={finalTitle} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}

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
