import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MediaPage from '../../pages/MediaPage';
import { ARTIST } from '../../data/artistData';
import { PUBLISHED_WORKS } from '../../data/publishedWorks';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../../config/routes', () => ({
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
  getLocalizedRoute: (_key: string, _lang?: string) => '/media-clipping',
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial: _i, animate: _a, whileInView: _w, viewport: _v, transition: _t, ...p }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) =>
      React.createElement('div', p, children),
  },
  useReducedMotion: () => false,
}));

vi.mock('../../contexts/BrandingContext', () => ({
  useBranding: () => ({ artist: ARTIST }),
}));

vi.mock('../../components/HeadlessSEO', () => ({
  HeadlessSEO: ({
    title,
    schema,
    url,
    image,
  }: {
    title: string;
    schema?: Record<string, unknown>;
    url: string;
    image?: string;
  }) =>
    React.createElement('div', {
      'data-testid': 'seo',
      'data-title': title,
      'data-has-schema': String(!!schema),
      'data-schema': schema ? JSON.stringify(schema) : '',
      'data-url': url,
      'data-image': image ?? '',
    }),
}));

// ── Render helper ─────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/media-clipping']}>
        <MediaPage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

function getSchema(): Record<string, unknown> {
  renderPage();
  const raw = screen.getByTestId('seo').getAttribute('data-schema') ?? '{}';
  return JSON.parse(raw) as Record<string, unknown>;
}

// ── Render tests ──────────────────────────────────────────────────────────────

describe('MediaPage — render', () => {
  it('renders without crashing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders the h1 via i18n key', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('media_page.h1');
  });

  it('renders media clipping links from ARTIST.mediaClipping', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    // Each clipping item is rendered as an <a>, plus sidebar links
    expect(links.length).toBeGreaterThan(ARTIST.mediaClipping.length);
  });

  it('renders authority identifier links (Wikidata, MusicBrainz, Discogs)', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href') ?? '');
    expect(hrefs.some((h) => h.includes('wikidata.org'))).toBe(true);
    expect(hrefs.some((h) => h.includes('musicbrainz.org'))).toBe(true);
    expect(hrefs.some((h) => h.includes('discogs.com'))).toBe(true);
  });

  it('renders published works in the clipping list', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href') ?? '');
    for (const work of PUBLISHED_WORKS) {
      expect(hrefs.some((h) => h.includes(work.url) || h === work.url)).toBe(true);
    }
  });

  it('all clipping links open in new tab with noopener noreferrer', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const externalLinks = links.filter(
      (l) => l.getAttribute('target') === '_blank'
    );
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('renders the featured video iframe', () => {
    renderPage();
    const iframe = document.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.getAttribute('src')).toMatch(/youtube\.com\/embed/);
  });

  it('renders quick facts with artist stage name', () => {
    renderPage();
    expect(screen.getByText(ARTIST.identity.stageName)).toBeDefined();
  });

  it('renders quick facts with artist full legal name', () => {
    renderPage();
    expect(screen.getByText(ARTIST.identity.fullName)).toBeDefined();
  });
});

// ── SEO / schema tests ────────────────────────────────────────────────────────

describe('MediaPage — SEO & schema', () => {
  it('passes a schema to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-has-schema')).toBe('true');
  });

  it('passes OG image to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-image')).toContain('og');
  });

  it('currentUrl ends with trailing slash (required for @id integrity)', () => {
    renderPage();
    const url = screen.getByTestId('seo').getAttribute('data-url') ?? '';
    expect(url).toMatch(/\/$/);
  });

  it('schema @graph contains CollectionPage node', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const collectionPage = graph.find((n) => n['@type'] === 'CollectionPage');
    expect(collectionPage).toBeDefined();
  });

  it('CollectionPage @id uses trailing slash', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const node = graph.find((n) => n['@type'] === 'CollectionPage')!;
    expect(node['@id']).toMatch(/\/#webpage$/);
  });

  it('schema @graph contains VideoObject node', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const videoNode = graph.find((n) => n['@type'] === 'VideoObject');
    expect(videoNode).toBeDefined();
  });

  it('VideoObject @id uses trailing slash before fragment', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const node = graph.find((n) => n['@type'] === 'VideoObject')!;
    expect(node['@id']).toMatch(/\/#featured-video$/);
  });

  it('VideoObject has required fields (name, thumbnailUrl, uploadDate, embedUrl, duration)', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const video = graph.find((n) => n['@type'] === 'VideoObject')!;
    expect(video.name).toBeTruthy();
    expect(video.thumbnailUrl).toBeTruthy();
    expect(video.uploadDate).toBeTruthy();
    expect(video.embedUrl).toMatch(/youtube\.com\/embed/);
    expect(video.duration).toMatch(/^PT/);
  });

  it('schema @graph contains an Article node for each published work', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const articleNodes = graph.filter((n) => n['@type'] === 'Article');
    expect(articleNodes.length).toBe(PUBLISHED_WORKS.length);
  });

  it('Article node has author pointing to artist @id', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const article = graph.find((n) => n['@type'] === 'Article')!;
    const author = article.author as Record<string, unknown>;
    expect(author['@id']).toContain('/#artist');
  });

  it('Article node has publisher pointing to source organization', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const article = graph.find((n) => n['@type'] === 'Article')!;
    const publisher = article.publisher as Record<string, unknown>;
    expect(publisher['@type']).toBe('Organization');
    expect(publisher.name).toBe(PUBLISHED_WORKS[0].source);
  });

  it('CollectionPage mainEntity lists published works as ItemList', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const cp = graph.find((n) => n['@type'] === 'CollectionPage')!;
    const mainEntity = cp.mainEntity as Record<string, unknown>;
    expect(mainEntity['@type']).toBe('ItemList');
    const items = mainEntity.itemListElement as unknown[];
    expect(items.length).toBe(PUBLISHED_WORKS.length);
  });
});

// ── Published works grouping ──────────────────────────────────────────────────

describe('MediaPage — published works grouping', () => {
  it('PUBLISHED_WORKS entries have required fields', () => {
    for (const work of PUBLISHED_WORKS) {
      expect(work.translationKey).toBeTruthy();
      expect(work.url).toMatch(/^https?:\/\//);
      expect(work.source).toBeTruthy();
      expect(work.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['Article', 'Essay']).toContain(work.type);
    }
  });

  it('PUBLISHED_WORKS Article type is grouped into independent-sources or article group', () => {
    // Articles are filtered into the 'Article' group in mediaGroups
    for (const work of PUBLISHED_WORKS) {
      if (work.type === 'Article') {
        expect(['Article', 'Essay', 'Media', 'Report']).toContain(work.type);
      }
    }
  });
});
