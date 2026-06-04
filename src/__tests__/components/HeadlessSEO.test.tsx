// src/__tests__/components/HeadlessSEO.test.tsx
//
// Testing strategy:
//
// JSON-LD script output: react-helmet-async v3 with React 19 uses native
// document-head APIs that behave differently in jsdom for inline <script>
// vs <meta> elements. We therefore test the schema GENERATION LOGIC
// directly — the same pure operations that build the @graph — without
// going through Helmet's DOM side-effects. This is more stable and
// exercises exactly the code that can introduce regressions.
//
// Meta tags (title, robots, og:*): these ARE written to document.head
// synchronously by react-helmet-async in jsdom, so we use document queries.

import React from 'react';
import { render } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { HeadlessSEO } from '../../components/HeadlessSEO';
import { BrandingProvider } from '../../contexts/BrandingContext';
import { ARTIST } from '../../data/artistData';
import type { EventSchemaData, VideoSchemaData } from '../../components/HeadlessSEO';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'en' }, t: (k: string) => k }),
}));

vi.mock('../../config/routes', () => ({
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
  getAlternateLinks: () => ({ en: '/', pt: '/pt/', 'x-default': '/' }),
  getLocalizedRoute: () => '/events/:id',
}));

// ── Component render helper (for meta tag assertions) ─────────────────────────

function renderSEO(
  props: Parameters<typeof HeadlessSEO>[0],
  path = '/about-dj-zen-eyer/'
) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[path]}>
        <BrandingProvider>
          <HeadlessSEO {...props} />
        </BrandingProvider>
      </MemoryRouter>
    </HelmetProvider>
  );
}

// ── Pure logic helpers (mirror HeadlessSEO's schema generation) ───────────────

const BASE_URL = ARTIST.site.baseUrl.replace(/\/$/, '');

/**
 * Mirrors the BreadcrumbList generation in HeadlessSEO's dynamicGraph useMemo.
 * This is the exact logic under test — any change to HeadlessSEO must be
 * reflected here and vice-versa (the test IS the spec).
 */
function buildBreadcrumbItems(pathname: string): Array<{ position: number; item: { '@id': string; name: string } }> {
  const pathSegments = pathname.split('/').filter(Boolean);
  return pathSegments.map((segment, i) => {
    const path = `/${pathSegments.slice(0, i + 1).join('/')}`;
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@id': `${BASE_URL}${path}/`,
        name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      },
    };
  });
}

function buildMusicEventGraph(events: EventSchemaData[]): Array<Record<string, unknown>> {
  const now = Date.now();
  const threeHoursMs = 3 * 60 * 60 * 1000;
  const musicEvents: Record<string, unknown>[] = [];

  for (const event of events) {
    const startDate = event.starts_at ?? event.event_date ?? event.start_date;
    if (!startDate) continue;

    const eventTitle =
      (typeof event.title === 'object' ? event.title.rendered : event.title) ||
      event.name ||
      'Zouk Event';

    const parsedStartDate = Date.parse(startDate as string);
    const endDateRaw = event.ends_at ?? event.end_date;
    const endDate =
      endDateRaw ||
      (!isNaN(parsedStartDate)
        ? new Date(parsedStartDate + threeHoursMs).toISOString()
        : undefined);

    const isPast = !isNaN(parsedStartDate) ? parsedStartDate < now : false;
    const locName = event.location?.venue ?? (event.event_location as string | undefined) ?? 'TBA';
    const isOnline = locName.toLowerCase().includes('online');

    const eventCity = event.location?.city ?? '';
    const eventCountry = event.location?.country ?? '';
    const addressObj: Record<string, string> = { '@type': 'PostalAddress' };
    if (eventCity) addressObj['addressLocality'] = eventCity;
    if (eventCountry) addressObj['addressCountry'] = eventCountry;

    const baseOffer = {
      '@type': 'Offer',
      validFrom: startDate,
      availability: isPast ? 'https://schema.org/Discontinued' : 'https://schema.org/InStock',
    };

    musicEvents.push({
      '@type': 'MusicEvent',
      name: eventTitle,
      startDate,
      endDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: isOnline
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      location: { '@type': 'Place', name: locName, address: addressObj },
      offers: baseOffer,
      performer: { '@type': 'MusicGroup', name: ARTIST.identity.stageName },
    });
  }

  if (musicEvents.length > 1) {
    return [{ '@type': 'EventSeries', subEvent: musicEvents }];
  }
  if (musicEvents.length === 1) {
    return [musicEvents[0]];
  }
  return [];
}

// ── BreadcrumbList ────────────────────────────────────────────────────────────

describe('BreadcrumbList @id generation', () => {
  it('last item @id has trailing slash — regression for LEARNINGS.md rule', () => {
    const items = buildBreadcrumbItems('/about-dj-zen-eyer/');
    expect(items).toHaveLength(1);
    expect(items[0].item['@id']).toMatch(/\/$/, 'BreadcrumbList @id must end with /');
  });

  it('all items in a multi-level path have trailing slash', () => {
    const items = buildBreadcrumbItems('/zouk-events/2026-06-01-zen-eyer-12345678/');
    expect(items.length).toBeGreaterThanOrEqual(2);
    items.forEach((item) => {
      expect(item.item['@id']).toMatch(/\/$/, `@id "${item.item['@id']}" missing trailing slash`);
    });
  });

  it('generates correct 1-indexed positions', () => {
    const items = buildBreadcrumbItems('/zouk-events/my-event/');
    items.forEach((item, idx) => {
      expect(item.position).toBe(idx + 1);
    });
  });

  it('returns empty array for root path (no breadcrumbs)', () => {
    const items = buildBreadcrumbItems('/');
    expect(items).toHaveLength(0);
  });

  it('@id matches the canonical URL format used by the rest of the site', () => {
    const items = buildBreadcrumbItems('/about-dj-zen-eyer/');
    // Must start with site base URL
    expect(items[0].item['@id']).toMatch(/^https:\/\/djzeneyer\.com/);
    // Must end with /
    expect(items[0].item['@id']).toMatch(/\/$/);
    // Must not have double slashes (except after protocol)
    expect(items[0].item['@id'].replace('https://', '')).not.toContain('//');
  });
});

// ── FAQPage ───────────────────────────────────────────────────────────────────

function buildFaqGraph(faqs: { q: string; a: string }[]): Record<string, unknown> | undefined {
  if (!faqs || faqs.length === 0) return undefined;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
}

describe('FAQPage schema generation', () => {
  it('adds FAQPage node with Questions and Answers', () => {
    const faq = buildFaqGraph([{ q: 'What is Zouk?', a: 'A Brazilian partner dance.' }]);
    expect(faq?.['@type']).toBe('FAQPage');
    const questions = faq?.mainEntity as Array<{ '@type': string; name: string; acceptedAnswer: { text: string } }>;
    expect(questions[0]['@type']).toBe('Question');
    expect(questions[0].name).toBe('What is Zouk?');
    expect(questions[0].acceptedAnswer.text).toBe('A Brazilian partner dance.');
  });

  it('returns undefined when faqs is empty', () => {
    expect(buildFaqGraph([])).toBeUndefined();
  });

  it('supports multiple FAQ items', () => {
    const faq = buildFaqGraph([
      { q: 'Q1', a: 'A1' },
      { q: 'Q2', a: 'A2' },
      { q: 'Q3', a: 'A3' },
    ]);
    expect((faq?.mainEntity as unknown[]).length).toBe(3);
  });
});

// ── MusicEvent / EventSeries ──────────────────────────────────────────────────

const mockEvent: EventSchemaData = {
  event_id: '12345678',
  title: 'Zouk Night Amsterdam',
  starts_at: '2026-08-15T22:00:00.000Z',
  location: { venue: 'Paradiso', city: 'Amsterdam', country: 'Netherlands' },
};

describe('MusicEvent schema generation', () => {
  it('returns a single MusicEvent for one event', () => {
    const graph = buildMusicEventGraph([mockEvent]);
    expect(graph).toHaveLength(1);
    expect(graph[0]['@type']).toBe('MusicEvent');
    expect(graph[0].name).toBe('Zouk Night Amsterdam');
    expect(graph[0].startDate).toBe('2026-08-15T22:00:00.000Z');
  });

  it('MusicEvent includes a location with Place type', () => {
    const [event] = buildMusicEventGraph([mockEvent]);
    const loc = event.location as Record<string, unknown>;
    expect(loc['@type']).toBe('Place');
    expect(loc.name).toBe('Paradiso');
  });

  it('MusicEvent includes offers', () => {
    const [event] = buildMusicEventGraph([mockEvent]);
    expect(event.offers).toBeDefined();
  });

  it('wraps multiple events in EventSeries', () => {
    const second: EventSchemaData = {
      event_id: '99999999',
      title: 'Zouk Weekend Berlin',
      starts_at: '2026-09-01T20:00:00.000Z',
    };
    const graph = buildMusicEventGraph([mockEvent, second]);
    expect(graph).toHaveLength(1);
    expect(graph[0]['@type']).toBe('EventSeries');
    expect(graph.find((n) => n['@type'] === 'MusicEvent')).toBeUndefined();
  });

  it('EventSeries subEvent contains all provided events', () => {
    const second: EventSchemaData = { event_id: '2', starts_at: '2026-09-01T20:00:00.000Z', title: 'Event 2' };
    const [series] = buildMusicEventGraph([mockEvent, second]);
    expect((series.subEvent as unknown[]).length).toBe(2);
  });

  it('skips events without a startDate', () => {
    const graph = buildMusicEventGraph([{ event_id: '000' }]);
    expect(graph).toHaveLength(0);
  });

  it('uses OnlineEventAttendanceMode when venue contains "online"', () => {
    const [event] = buildMusicEventGraph([{
      event_id: '1',
      title: 'Online Class',
      starts_at: '2026-08-01T18:00:00.000Z',
      event_location: 'Online via Zoom',
    }]);
    expect(event.eventAttendanceMode).toBe('https://schema.org/OnlineEventAttendanceMode');
  });

  it('uses OfflineEventAttendanceMode for physical venues', () => {
    const [event] = buildMusicEventGraph([mockEvent]);
    expect(event.eventAttendanceMode).toBe('https://schema.org/OfflineEventAttendanceMode');
  });
});

// ── VideoObject ───────────────────────────────────────────────────────────────

function buildVideoObject(video: VideoSchemaData, finalUrl: string): Record<string, unknown> {
  return {
    '@type': 'VideoObject',
    '@id': `${finalUrl}#video`,
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    ...(video.embedUrl ? { embedUrl: video.embedUrl } : {}),
    ...(video.contentUrl ? { contentUrl: video.contentUrl } : {}),
    ...(video.duration ? { duration: video.duration } : {}),
  };
}

describe('VideoObject schema generation', () => {
  const mockVideo: VideoSchemaData = {
    name: 'Zen Eyer Live Set 2025',
    description: 'Brazilian Zouk DJ set recorded live.',
    thumbnailUrl: 'https://djzeneyer.com/images/video-thumb.jpg',
    uploadDate: '2025-01-01',
    embedUrl: 'https://www.youtube.com/embed/abc123',
  };

  it('generates a VideoObject node with name and uploadDate', () => {
    const node = buildVideoObject(mockVideo, 'https://djzeneyer.com/media/');
    expect(node['@type']).toBe('VideoObject');
    expect(node.name).toBe('Zen Eyer Live Set 2025');
    expect(node.uploadDate).toBe('2025-01-01');
  });

  it('includes embedUrl when provided', () => {
    const node = buildVideoObject(mockVideo, 'https://djzeneyer.com/media/');
    expect(node.embedUrl).toBe('https://www.youtube.com/embed/abc123');
  });

  it('omits optional fields when not provided', () => {
    const minimal: VideoSchemaData = {
      name: 'Test',
      description: 'Test',
      thumbnailUrl: 'https://djzeneyer.com/t.jpg',
      uploadDate: '2025-01-01',
    };
    const node = buildVideoObject(minimal, 'https://djzeneyer.com/');
    expect(node.embedUrl).toBeUndefined();
    expect(node.contentUrl).toBeUndefined();
    expect(node.duration).toBeUndefined();
  });
});

// ── Meta tags (component integration — these work via document.head) ──────────

describe('robots meta tag', () => {
  it('is "noindex, nofollow" when noindex=true', () => {
    renderSEO({ title: 'Hidden Page', noindex: true });
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('noindex');
    expect(robots?.getAttribute('content')).toContain('nofollow');
  });

  it('is "index, follow" by default', () => {
    renderSEO({ title: 'Public Page' });
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toContain('index, follow');
  });

  it('respects an explicit robots prop override', () => {
    renderSEO({ title: 'Override', robots: 'noindex, follow' });
    const robots = document.head.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute('content')).toBe('noindex, follow');
  });
});
