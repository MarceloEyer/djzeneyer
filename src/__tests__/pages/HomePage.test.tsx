import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import HomePage from '../../pages/HomePage';
import { ARTIST } from '../../data/artistData';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../config/routes', () => ({
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
  getLocalizedRoute: (key: string) => `/${key}`,
}));

vi.mock('framer-motion', () => {
  const makeEl = (tag: string) =>
    ({ children, initial: _i, animate: _a, variants: _v, transition: _t,
       whileHover: _wh, whileTap: _wt, viewport: _vp, whileInView: _wiv, ...p }: Record<string, unknown>) =>
      React.createElement(tag, p as Record<string, unknown>, children as React.ReactNode);
  return {
    motion: {
      div: makeEl('div'),
      p: makeEl('p'),
      li: makeEl('li'),
      ul: makeEl('ul'),
      article: makeEl('article'),
      section: makeEl('section'),
      button: makeEl('button'),
      h2: makeEl('h2'),
    },
    useReducedMotion: () => false,
  };
});

vi.mock('../../contexts/BrandingContext', () => ({
  useBranding: () => ({ artist: ARTIST }),
}));

vi.mock('../../data/artist.schema', async (importOriginal) => {
  return await importOriginal();
});

vi.mock('../../hooks/usePublicQueries', () => ({
  useZenSeoSettings: () => ({ data: undefined }),
}));

vi.mock('../../components/EventsList', () => ({
  EventsList: () => React.createElement('div', { 'data-testid': 'events-list' }),
}));

vi.mock('../../components/HeadlessSEO', () => ({
  HeadlessSEO: ({
    title,
    isHomepage,
    schema,
    image,
  }: {
    title: string;
    isHomepage?: boolean;
    schema?: Record<string, unknown>;
    image?: string;
  }) =>
    React.createElement('div', {
      'data-testid': 'seo',
      'data-title': title,
      'data-is-homepage': String(!!isHomepage),
      'data-has-schema': String(!!schema),
      'data-schema': schema ? JSON.stringify(schema) : '',
      'data-image': image ?? '',
    }),
}));

// ── Render helper ─────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/']}>
        <React.Suspense fallback={null}>
          <HomePage />
        </React.Suspense>
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

describe('HomePage — render', () => {
  it('renders without crashing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders the h1 with stage name', () => {
    renderPage();
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain('Zen');
    expect(h1.textContent).toContain('Eyer');
  });

  it('renders festival badges from ARTIST.festivals', () => {
    renderPage();
    const firstFestival = ARTIST.festivals[0];
    expect(screen.getByText(firstFestival.name)).toBeDefined();
  });

  it('renders authority links (Wikidata, MusicBrainz, Spotify)', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href') ?? '');
    const matchesDomain = (href: string, domain: string) => {
      try { const h = new URL(href, 'http://localhost').hostname; return h === domain || h.endsWith(`.${domain}`); } catch { return false; }
    };
    expect(hrefs.some((h) => matchesDomain(h, 'wikidata.org'))).toBe(true);
    expect(hrefs.some((h) => matchesDomain(h, 'musicbrainz.org'))).toBe(true);
    expect(hrefs.some((h) => matchesDomain(h, 'spotify.com'))).toBe(true);
  });

  it('renders SoundCloud listen link', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href') ?? '');
    const matchesDomain = (href: string, domain: string) => {
      try { const h = new URL(href, 'http://localhost').hostname; return h === domain || h.endsWith(`.${domain}`); } catch { return false; }
    };
    expect(hrefs.some((h) => matchesDomain(h, 'soundcloud.com'))).toBe(true);
  });

  it('renders stats section with champion value', () => {
    renderPage();
    expect(screen.getByText('2×')).toBeDefined();
  });

  it('uses portrait and landscape hero sources for responsive windows', () => {
    const { container } = renderPage();
    const sources = container.querySelectorAll('picture source');
    const image = container.querySelector('picture img');

    expect(sources).toHaveLength(2);
    expect(sources[0].getAttribute('media')).toBe('(max-width: 768px), (orientation: portrait)');
    expect(sources[0].getAttribute('srcset')).toBe('/images/hero-background-mediterranean-mobile.webp');
    expect(sources[1].getAttribute('media')).toBe('(min-width: 769px) and (orientation: landscape)');
    expect(sources[1].getAttribute('srcset')).toContain('/images/hero-background-mediterranean-1440.webp 1440w');
    expect(sources[1].getAttribute('srcset')).toContain('/images/hero-background-mediterranean.webp?v=2 1920w');
    expect(image?.getAttribute('src')).toBe('/images/hero-background-mediterranean-1440.webp');
  });
});

// ── SEO / schema tests ────────────────────────────────────────────────────────

describe('HomePage — SEO & schema', () => {
  it('passes isHomepage=true to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-is-homepage')).toBe('true');
  });

  it('passes a schema to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-has-schema')).toBe('true');
  });

  it('passes OG image to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-image')).toBeTruthy();
  });

  it('schema @graph contains WebSite node', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    expect(graph.find((n) => n['@type'] === 'WebSite')).toBeDefined();
  });

  it('WebSite @id uses trailing slash before fragment', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const node = graph.find((n) => n['@type'] === 'WebSite')!;
    expect(node['@id']).toMatch(/\/#website$/);
  });

  it('schema @graph contains WebPage node', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    expect(graph.find((n) => n['@type'] === 'WebPage')).toBeDefined();
  });

  it('WebPage @id uses trailing slash before fragment', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const node = graph.find((n) => n['@type'] === 'WebPage')!;
    expect(node['@id']).toMatch(/\/#webpage$/);
  });

  it('schema @graph contains Person node from ARTIST_SCHEMA_BASE', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    expect(graph.find((n) => n['@type'] === 'Person')).toBeDefined();
  });

  it('schema @graph contains MusicGroup node from MUSICGROUP_SCHEMA', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    expect(graph.find((n) => n['@type'] === 'MusicGroup')).toBeDefined();
  });

  it('WebSite node has SearchAction with urlTemplate', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const website = graph.find((n) => n['@type'] === 'WebSite')!;
    const action = website.potentialAction as Record<string, unknown>;
    expect(action['@type']).toBe('SearchAction');
    const target = action.target as Record<string, unknown>;
    expect(target.urlTemplate).toContain('{search_term_string}');
  });
});
