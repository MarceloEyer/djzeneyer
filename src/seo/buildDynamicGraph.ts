// Pure function extracted from HeadlessSEO's dynamicGraph useMemo.
// No React dependency — fully testable without rendering.
import { ARTIST_SCHEMA_SAME_AS } from '../data/artist.schema';
import { safeUrl } from '../utils/sanitize';
import { getPlainTitle, isEventUpcoming, getLocalISODate } from '../utils/events';
import { stripHtml } from '../utils/text';
import type { EventSchemaData, VideoSchemaData } from '../components/HeadlessSEO';

interface ArtistIdentity {
  stageName: string;
  fullName: string;
}

interface ArtistSite {
  baseUrl: string;
}

interface BuildDynamicGraphOpts {
  baseUrl: string;
  pathname: string;
  finalUrl: string;
  faqs?: { q: string; a: string }[];
  events?: EventSchemaData[];
  artistIdentity: ArtistIdentity;
  artistSite: ArtistSite;
  finalImage: string;
  video?: VideoSchemaData;
}

const ensureAbsoluteUrl = (u: string, baseUrl: string): string => {
  if (!u) return baseUrl;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  const cleanBase = baseUrl.replace(/\/$/, '');
  const cleanPath = u.replace(/^\//, '');
  return `${cleanBase}/${cleanPath}`;
};

export function buildDynamicGraph(opts: BuildDynamicGraphOpts): Record<string, unknown>[] {
  const { baseUrl, pathname, finalUrl, faqs, events, artistIdentity, artistSite, finalImage, video } = opts;
  const graph: Record<string, unknown>[] = [];
  const siteUrlClean = baseUrl.replace(/\/$/, '');

  // 1. BreadcrumbList
  const pathSegments = pathname.split('/').filter(Boolean);
  if (pathSegments.length > 0) {
    const itemListElement: Record<string, unknown>[] = [];
    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const path = `/${pathSegments.slice(0, i + 1).join('/')}`;
      itemListElement.push({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@id': `${siteUrlClean}${path}/`,
          name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        },
      });
    }
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${finalUrl}#breadcrumb`,
      itemListElement,
    });
  }

  // 2. FAQPage
  if (faqs && faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
  }

  // 3. MusicEvent / EventSeries
  if (events && events.length > 0) {
    // ⚡ Bolt: Hoist date generation outside the filter loop to prevent N+1 Date allocations and recalculations
    const currentDate = getLocalISODate(Date.now());
    const schemaEvents = events.length > 1
      ? events.filter((event) => isEventUpcoming({
          starts_at: ((event.starts_at as string) || (event.event_date as string) || (event.start_date as string) || ''),
          ends_at: ((event.ends_at as string) || (event.end_date as string) || undefined),
        }, currentDate))
      : events;
    const now = Date.now();
    const threeHoursMs = 3 * 60 * 60 * 1000;
    const musicEvents: Record<string, unknown>[] = [];

    for (const event of schemaEvents) {
      const startDate =
        (event.starts_at as string) ||
        (event.event_date as string) ||
        (event.start_date as string);
      if (!startDate) continue;

      const eventTitle =
        getPlainTitle(event.title) ||
        (typeof event.name === 'string' ? stripHtml(event.name) : '') ||
        'Zouk Event';
      const canonicalUrl = (event.canonical_url as string) || (event.url as string) || undefined;
      const endDateRaw = (event.ends_at as string) || (event.end_date as string);

      const parsedStartDate = Date.parse(startDate);
      const endDate =
        endDateRaw ||
        (!isNaN(parsedStartDate)
          ? new Date(parsedStartDate + threeHoursMs).toISOString()
          : undefined);

      const isPast = !isNaN(parsedStartDate) ? parsedStartDate < now : false;
      const locName = event.location?.venue || event.event_location || 'TBA';

      const baseOffer = {
        '@type': 'Offer',
        validFrom: startDate,
        availability: isPast
          ? 'https://schema.org/Discontinued'
          : 'https://schema.org/InStock',
      };

      let eventOffers: Record<string, unknown> | Record<string, unknown>[];
      if (Array.isArray(event.tickets) && event.tickets.length > 0) {
        eventOffers = (event.tickets as string[])
          .filter((u) => typeof u === 'string')
          .map((u) => ({ ...baseOffer, url: u }));
      } else if (Array.isArray(event.offers) && event.offers.length > 0) {
        eventOffers = (event.offers as { url?: string }[])
          .filter((o) => o?.url)
          .map((o) => ({ ...baseOffer, url: o.url }));
      } else {
        eventOffers = {
          ...baseOffer,
          url: (event.event_ticket as string) || canonicalUrl || finalUrl,
        };
      }

      if (Array.isArray(eventOffers) && eventOffers.length === 0) {
        eventOffers = { ...baseOffer, url: canonicalUrl || finalUrl };
      }

      const eventCity = event.location?.city || '';
      const eventRegion = event.location?.region || '';
      const eventCountry = event.location?.country || '';
      const isOnline = locName.toLowerCase().includes('online');
      const addressObj: Record<string, string> = { '@type': 'PostalAddress' };
      if (eventCity) addressObj['addressLocality'] = eventCity;
      if (eventRegion) addressObj['addressRegion'] = eventRegion;
      if (eventCountry) addressObj['addressCountry'] = eventCountry;

      const eventDescription =
        stripHtml(event.description || (event.desc as string | undefined) || '').substring(0, 300) ||
        `Live Brazilian Zouk DJ set by ${artistIdentity.stageName} at ${locName}.`;

      musicEvents.push({
        '@type': 'MusicEvent',
        name: eventTitle,
        ...(canonicalUrl ? { url: canonicalUrl } : {}),
        startDate,
        endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: isOnline
          ? 'https://schema.org/OnlineEventAttendanceMode'
          : 'https://schema.org/OfflineEventAttendanceMode',
        location: { '@type': 'Place', name: locName, address: addressObj },
        image: (event.image as string | undefined) || finalImage,
        description: eventDescription,
        performer: {
          '@id': `${baseUrl}/#musicgroup`,
          '@type': 'MusicGroup',
          name: artistIdentity.stageName,
          sameAs: ARTIST_SCHEMA_SAME_AS,
        },
        offers: eventOffers,
        organizer: {
          '@id': `${baseUrl}/#artist`,
          '@type': 'Person',
          name: artistIdentity.stageName,
          url: artistSite.baseUrl,
        },
      });
    }

    if (musicEvents.length > 1) {
      graph.push({
        '@type': 'EventSeries',
        name: `${artistIdentity.stageName} World Tour`,
        url: finalUrl,
        description: `Official tour dates and upcoming performances for ${artistIdentity.stageName}.`,
        performer: {
          '@id': `${baseUrl}/#musicgroup`,
          '@type': 'MusicGroup',
          name: artistIdentity.stageName,
          url: artistSite.baseUrl,
          sameAs: ARTIST_SCHEMA_SAME_AS,
        },
        subEvent: musicEvents,
      });
    } else if (musicEvents.length === 1) {
      graph.push(musicEvents[0]);
    }
  }

  // 4. VideoObject
  if (video) {
    const safeThumbnail = safeUrl(video.thumbnailUrl, '/images/zen-eyer-og-image.png');
    graph.push({
      '@type': 'VideoObject',
      '@id': `${finalUrl}#video`,
      name: video.name,
      description: video.description,
      thumbnailUrl: ensureAbsoluteUrl(safeThumbnail, baseUrl),
      uploadDate: video.uploadDate,
      ...(video.embedUrl ? { embedUrl: safeUrl(video.embedUrl, '/') } : {}),
      ...(video.contentUrl ? { contentUrl: safeUrl(video.contentUrl, '/') } : {}),
      ...(video.duration ? { duration: video.duration } : {}),
    });
  }

  return graph;
}
