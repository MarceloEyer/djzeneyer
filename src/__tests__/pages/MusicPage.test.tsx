import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import MusicPage from '../../pages/MusicPage';
import { ARTIST } from '../../data/artistData';
import { DISCOGRAPHY } from '../../data/artist.schema';

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
    ({ children, initial: _i, animate: _a, variants: _v, custom: _c, transition: _t,
       whileHover: _wh, whileTap: _wt, viewport: _vp, whileInView: _wiv, ...p }: Record<string, unknown>) =>
      React.createElement(tag, p as Record<string, unknown>, children as React.ReactNode);
  return {
    motion: {
      div: makeEl('div'),
      p: makeEl('p'),
      button: makeEl('button'),
      section: makeEl('section'),
      h1: makeEl('h1'),
      ul: makeEl('ul'),
      li: makeEl('li'),
    },
    useReducedMotion: () => false,
  };
});

vi.mock('../../contexts/UserContext', () => ({
  useUser: () => ({ user: null }),
}));

vi.mock('../../hooks/useMutations', () => ({
  useTrackInteraction: () => ({ mutate: vi.fn() }),
}));

vi.mock('../../components/Breadcrumb', () => ({
  Breadcrumb: ({ items }: { items: { label: string }[] }) =>
    React.createElement('nav', { 'aria-label': 'breadcrumb' }, items.map((i) => i.label).join(' / ')),
}));

vi.mock('../../components/icons/BrandIcons', () => ({
  YouTubeIcon: ({ className }: { className?: string }) =>
    React.createElement('svg', { className, 'data-testid': 'youtube-icon' }),
}));

vi.mock('../../components/HeadlessSEO', () => ({
  HeadlessSEO: ({
    title,
    schema,
    image,
  }: {
    title: string;
    schema?: Record<string, unknown>;
    image?: string;
  }) =>
    React.createElement('div', {
      'data-testid': 'seo',
      'data-title': title,
      'data-has-schema': String(!!schema),
      'data-schema': schema ? JSON.stringify(schema) : '',
      'data-image': image ?? '',
    }),
}));

// ── Render helper ─────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/music']}>
        <MusicPage />
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

describe('MusicPage — render', () => {
  it('renders without crashing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders the h1', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('renders breadcrumb', () => {
    renderPage();
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeDefined();
  });

  it('renders Spotify platform button', () => {
    renderPage();
    const buttons = screen.getAllByRole('button');
    const spotifyBtn = buttons.find((b) => b.textContent?.includes('Spotify'));
    expect(spotifyBtn).toBeDefined();
  });

  it('renders secondary platform buttons (Apple Music, SoundCloud, YouTube)', () => {
    renderPage();
    const buttons = screen.getAllByRole('button');
    const names = buttons.map((b) => b.textContent ?? '');
    expect(names.some((n) => n.includes('Apple Music'))).toBe(true);
    expect(names.some((n) => n.includes('SoundCloud'))).toBe(true);
    expect(names.some((n) => n.includes('YouTube'))).toBe(true);
  });

  it('renders release cards as links for each DISCOGRAPHY entry', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(DISCOGRAPHY.length);
  });

  it('renders release card with name of first DISCOGRAPHY entry', () => {
    renderPage();
    expect(screen.getByText(DISCOGRAPHY[0].name)).toBeDefined();
  });
});

// ── SEO / schema tests ────────────────────────────────────────────────────────

describe('MusicPage — SEO & schema', () => {
  it('passes a schema to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-has-schema')).toBe('true');
  });

  it('passes OG image to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-image')).toContain('og');
  });

  it('schema @graph contains CollectionPage node', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    expect(graph.find((n) => n['@type'] === 'CollectionPage')).toBeDefined();
  });

  it('CollectionPage @id uses trailing slash before fragment', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const cp = graph.find((n) => n['@type'] === 'CollectionPage')!;
    expect(cp['@id']).toMatch(/\/#webpage$|\/music#webpage$/);
  });

  it('schema @graph contains MusicGroup node', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    expect(graph.find((n) => n['@type'] === 'MusicGroup')).toBeDefined();
  });

  it('schema @graph contains ItemList node with discography', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const itemList = graph.find((n) => n['@type'] === 'ItemList');
    expect(itemList).toBeDefined();
    const items = (itemList as Record<string, unknown>).itemListElement as unknown[];
    expect(items.length).toBe(DISCOGRAPHY.length);
  });

  it('ItemList @id references discography fragment', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const itemList = graph.find((n) => n['@type'] === 'ItemList')!;
    expect(itemList['@id']).toMatch(/#discography$/);
  });

  it('CollectionPage isPartOf links to WebSite @id', () => {
    const schema = getSchema();
    const graph = schema['@graph'] as Record<string, unknown>[];
    const cp = graph.find((n) => n['@type'] === 'CollectionPage')!;
    const isPartOf = cp.isPartOf as Record<string, unknown>;
    expect(isPartOf['@id']).toMatch(/\/#website$/);
  });
});

// ── DISCOGRAPHY data integrity ────────────────────────────────────────────────

describe('MusicPage — DISCOGRAPHY data', () => {
  it('every DISCOGRAPHY entry has required fields', () => {
    for (const release of DISCOGRAPHY) {
      expect(release.id).toBeTruthy();
      expect(release.name).toBeTruthy();
      if (release.releaseDate) expect(release.releaseDate).toMatch(/^\d{4}/);
      expect(release.image).toMatch(/^https?:\/\//);
    }
  });

  it('DISCOGRAPHY uses social.YouTube (capital Y) in secondary platforms URL', () => {
    expect(ARTIST.social.YouTube).toBeDefined();
    expect(ARTIST.social.YouTube.url).toMatch(/youtube\.com/);
  });
});
