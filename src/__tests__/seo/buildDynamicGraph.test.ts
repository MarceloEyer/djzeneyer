import { describe, it, expect } from 'vitest';
import { buildDynamicGraph } from '../../seo/buildDynamicGraph';

const BASE = 'https://www.djzeneyer.com';
const ARTIST_IDENTITY = { stageName: 'Zen Eyer', fullName: 'Marcelo Eyer' };
const ARTIST_SITE = { baseUrl: BASE };

const baseOpts = {
  baseUrl: BASE,
  pathname: '/events',
  finalUrl: `${BASE}/events/`,
  artistIdentity: ARTIST_IDENTITY,
  artistSite: ARTIST_SITE,
  finalImage: `${BASE}/images/og.jpg`,
};

// ── BreadcrumbList ─────────────────────────────────────────────────────────────

describe('buildDynamicGraph — BreadcrumbList', () => {
  it('returns empty array for root pathname', () => {
    const graph = buildDynamicGraph({ ...baseOpts, pathname: '/' });
    expect(graph.find((n) => n['@type'] === 'BreadcrumbList')).toBeUndefined();
  });

  it('emits BreadcrumbList for non-root path', () => {
    const graph = buildDynamicGraph(baseOpts);
    expect(graph.find((n) => n['@type'] === 'BreadcrumbList')).toBeDefined();
  });

  it('BreadcrumbList @id anchored to finalUrl', () => {
    const graph = buildDynamicGraph(baseOpts);
    const bc = graph.find((n) => n['@type'] === 'BreadcrumbList')!;
    expect(bc['@id']).toBe(`${BASE}/events/#breadcrumb`);
  });

  it('produces one ListItem per path segment', () => {
    const graph = buildDynamicGraph({ ...baseOpts, pathname: '/encyclopedia/cambre' });
    const bc = graph.find((n) => n['@type'] === 'BreadcrumbList')!;
    const items = bc.itemListElement as unknown[];
    expect(items).toHaveLength(2);
  });

  it('segment @id ends with trailing slash', () => {
    const graph = buildDynamicGraph(baseOpts);
    const bc = graph.find((n) => n['@type'] === 'BreadcrumbList')!;
    const items = bc.itemListElement as Record<string, unknown>[];
    const item = items[0].item as Record<string, unknown>;
    expect(String(item['@id'])).toMatch(/\/$/);
  });
});

// ── FAQPage ────────────────────────────────────────────────────────────────────

describe('buildDynamicGraph — FAQPage', () => {
  it('does not emit FAQPage when faqs is empty', () => {
    const graph = buildDynamicGraph({ ...baseOpts, faqs: [] });
    expect(graph.find((n) => n['@type'] === 'FAQPage')).toBeUndefined();
  });

  it('emits FAQPage when faqs are provided', () => {
    const graph = buildDynamicGraph({
      ...baseOpts,
      faqs: [{ q: 'What is zouk?', a: 'A dance.' }],
    });
    expect(graph.find((n) => n['@type'] === 'FAQPage')).toBeDefined();
  });

  it('FAQPage mainEntity has correct Question structure', () => {
    const graph = buildDynamicGraph({
      ...baseOpts,
      faqs: [{ q: 'Q1', a: 'A1' }],
    });
    const faqPage = graph.find((n) => n['@type'] === 'FAQPage')!;
    const mainEntity = faqPage.mainEntity as Record<string, unknown>[];
    expect(mainEntity[0]['@type']).toBe('Question');
    expect(mainEntity[0].name).toBe('Q1');
    const answer = mainEntity[0].acceptedAnswer as Record<string, unknown>;
    expect(answer['@type']).toBe('Answer');
    expect(answer.text).toBe('A1');
  });
});

// ── MusicEvent / EventSeries ───────────────────────────────────────────────────

describe('buildDynamicGraph — MusicEvent', () => {
  const futureEvent = {
    event_id: '1',
    title: 'Zen Eyer at Rio',
    starts_at: '2099-12-01T20:00:00Z',
    location: { venue: 'Arena Rio', city: 'Rio de Janeiro', country: 'BR' },
  };

  it('emits MusicEvent for a single event', () => {
    const graph = buildDynamicGraph({ ...baseOpts, events: [futureEvent] });
    expect(graph.find((n) => n['@type'] === 'MusicEvent')).toBeDefined();
  });

  it('emits EventSeries for multiple events', () => {
    const event2 = { ...futureEvent, event_id: '2', title: 'Zen Eyer at SP' };
    const graph = buildDynamicGraph({ ...baseOpts, events: [futureEvent, event2] });
    expect(graph.find((n) => n['@type'] === 'EventSeries')).toBeDefined();
    expect(graph.find((n) => n['@type'] === 'MusicEvent')).toBeUndefined();
  });

  it('skips events without startDate', () => {
    const noDate = { event_id: '3', title: 'No date event' };
    const graph = buildDynamicGraph({ ...baseOpts, events: [noDate] });
    expect(graph.find((n) => n['@type'] === 'MusicEvent')).toBeUndefined();
  });

  it('MusicEvent has eventStatus EventScheduled', () => {
    const graph = buildDynamicGraph({ ...baseOpts, events: [futureEvent] });
    const ev = graph.find((n) => n['@type'] === 'MusicEvent')!;
    expect(ev.eventStatus).toBe('https://schema.org/EventScheduled');
  });

  it('performer @id points to musicgroup', () => {
    const graph = buildDynamicGraph({ ...baseOpts, events: [futureEvent] });
    const ev = graph.find((n) => n['@type'] === 'MusicEvent')!;
    const performer = ev.performer as Record<string, unknown>;
    expect(performer['@id']).toBe(`${BASE}/#musicgroup`);
  });

  it('online event gets OnlineEventAttendanceMode', () => {
    const online = { ...futureEvent, location: { venue: 'Online Stream', city: '', country: '' } };
    const graph = buildDynamicGraph({ ...baseOpts, events: [online] });
    const ev = graph.find((n) => n['@type'] === 'MusicEvent')!;
    expect(ev.eventAttendanceMode).toBe('https://schema.org/OnlineEventAttendanceMode');
  });

  it('uses a stripped plain-text title for MusicEvent name', () => {
    const graph = buildDynamicGraph({
      ...baseOpts,
      events: [
        {
          ...futureEvent,
          title: { rendered: '<strong>Zen Eyer</strong> &amp; Friends' },
        },
      ],
    });
    const ev = graph.find((n) => n['@type'] === 'MusicEvent')!;
    expect(ev.name).toBe('Zen Eyer & Friends');
  });

  it('does not stringify non-string rendered titles in MusicEvent name', () => {
    const graph = buildDynamicGraph({
      ...baseOpts,
      events: [
        {
          ...futureEvent,
          title: { rendered: { value: 'Bad title' } },
          name: 'Fallback Event Name',
        },
      ],
    });
    const ev = graph.find((n) => n['@type'] === 'MusicEvent')!;
    expect(ev.name).toBe('Fallback Event Name');
  });

  it('omits stale past events from EventSeries on list pages', () => {
    const pastEvent = {
      ...futureEvent,
      event_id: 'past',
      title: 'Old Event',
      starts_at: '2020-01-01T20:00:00Z',
    };
    const graph = buildDynamicGraph({ ...baseOpts, events: [pastEvent, futureEvent] });
    const names = graph.flatMap((node) => {
      if (node['@type'] === 'MusicEvent') return [node.name];
      if (node['@type'] === 'EventSeries') {
        return (node.subEvent as Record<string, unknown>[]).map((event) => event.name);
      }
      return [];
    });
    expect(names).toEqual(['Zen Eyer at Rio']);
  });
});

// ── VideoObject ────────────────────────────────────────────────────────────────

describe('buildDynamicGraph — VideoObject', () => {
  const video = {
    name: 'Zen Eyer Live Mix',
    description: 'A live mix video.',
    thumbnailUrl: `${BASE}/images/thumb.jpg`,
    uploadDate: '2025-01-01',
    embedUrl: 'https://www.youtube.com/embed/abc123',
    duration: 'PT1H',
  };

  it('emits VideoObject when video is provided', () => {
    const graph = buildDynamicGraph({ ...baseOpts, video });
    expect(graph.find((n) => n['@type'] === 'VideoObject')).toBeDefined();
  });

  it('VideoObject @id ends with #video', () => {
    const graph = buildDynamicGraph({ ...baseOpts, video });
    const node = graph.find((n) => n['@type'] === 'VideoObject')!;
    expect(String(node['@id'])).toMatch(/#video$/);
  });

  it('VideoObject embedUrl matches youtube.com/embed', () => {
    const graph = buildDynamicGraph({ ...baseOpts, video });
    const node = graph.find((n) => n['@type'] === 'VideoObject')!;
    expect(String(node.embedUrl)).toMatch(/youtube\.com\/embed/);
  });

  it('VideoObject duration starts with PT', () => {
    const graph = buildDynamicGraph({ ...baseOpts, video });
    const node = graph.find((n) => n['@type'] === 'VideoObject')!;
    expect(String(node.duration)).toMatch(/^PT/);
  });

  it('does not emit VideoObject when video is undefined', () => {
    const graph = buildDynamicGraph(baseOpts);
    expect(graph.find((n) => n['@type'] === 'VideoObject')).toBeUndefined();
  });
});
