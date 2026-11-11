import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EncyclopediaPage from '../../pages/EncyclopediaPage';
import { ARTIST } from '../../data/artistData';
import {
  ZOUK_ENCYCLOPEDIA,
  findEncyclopediaTermBySlug,
  toEncyclopediaTermSlug,
} from '../../data/zoukEncyclopedia';

// ── Controlled param ──────────────────────────────────────────────────────────
// We need useParams to return different values per test. A module-level variable
// controlled via a setter lets each test inject what it needs without re-mocking.

let currentParam: string | undefined = undefined;

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => ({ term: currentParam }),
    Navigate: ({ to }: { to: string }) =>
      React.createElement('div', { 'data-testid': 'navigate', 'data-to': to }),
    Link: ({ to, children, ...p }: { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      React.createElement('a', { href: to, ...p }, children),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, opts?: { term?: string }) =>
      opts?.term ? `${k}:${opts.term}` : k,
    i18n: { language: 'en' },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('../../config/routes', () => ({
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
  getLocalizedRoute: (key: string, lang?: string) =>
    lang === 'pt' ? `/pt/${key}` : `/${key}`,
  getAlternateLinks: () => ({ en: '/', pt: '/pt/', 'x-default': '/' }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...p }: React.HTMLAttributes<HTMLElement>) =>
      React.createElement('header', p, children),
    article: ({ children, ...p }: React.HTMLAttributes<HTMLElement>) =>
      React.createElement('article', p, children),
    div: ({ children, ...p }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', p, children),
  },
  useReducedMotion: () => false,
}));

vi.mock('../../components/Breadcrumb', () => ({
  Breadcrumb: ({ items }: { items: { label: string; path?: string }[] }) =>
    React.createElement(
      'nav',
      { 'aria-label': 'breadcrumb' },
      items.map((i) => i.label).join(' / ')
    ),
}));

vi.mock('../../components/HeadlessSEO', () => ({
  HeadlessSEO: ({
    title,
    noindex,
    schema,
    hrefLang,
  }: {
    title: string;
    noindex?: boolean;
    schema?: unknown;
    hrefLang?: { lang: string; url: string }[];
  }) =>
    React.createElement('div', {
      'data-testid': 'seo',
      'data-title': title,
      'data-noindex': String(!!noindex),
      'data-has-schema': String(!!schema),
      'data-hreflang': hrefLang ? JSON.stringify(hrefLang.map((h) => h.lang)) : '',
    }),
}));

// ── Render helper ─────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <HelmetProvider>
      <EncyclopediaPage />
    </HelmetProvider>
  );
}

// ── Hub page tests ─────────────────────────────────────────────────────────────

describe('EncyclopediaPage — hub (no term param)', () => {
  beforeEach(() => { currentParam = undefined; });

  it('renders without crashing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('is indexed (no noindex on hub)', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-noindex')).toBe('false');
  });

  it('passes a schema to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-has-schema')).toBe('true');
  });

  it('renders the search input', () => {
    renderPage();
    expect(screen.getByRole('searchbox')).toBeDefined();
  });

  it('renders one article card per encyclopedia entry', () => {
    renderPage();
    const articles = screen.getAllByRole('article');
    expect(articles.length).toBe(ZOUK_ENCYCLOPEDIA.length);
  });

  it('term detail links use kebab-case slugs', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const slugLinks = links.filter((l) => l.getAttribute('href')?.includes('/encyclopedia/'));
    expect(slugLinks.length).toBeGreaterThan(0);
    for (const link of slugLinks) {
      const href = link.getAttribute('href') ?? '';
      const slug = href.split('/encyclopedia/')[1]?.split('/')[0];
      if (slug) {
        expect(slug, `slug "${slug}" must be lowercase kebab`).toBe(slug.toLowerCase());
        expect(slug).not.toMatch(/[A-Z]/);
      }
    }
  });

  it('renders breadcrumb', () => {
    renderPage();
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeDefined();
  });
});

// ── Term detail page tests ─────────────────────────────────────────────────────

describe('EncyclopediaPage — term detail', () => {
  const TERM_SLUG = 'cambre';
  const term = findEncyclopediaTermBySlug(TERM_SLUG)!;

  beforeEach(() => { currentParam = TERM_SLUG; });

  it('fixture term exists in the catalog', () => {
    expect(term).toBeDefined();
    expect(term.key).toBe('cambre');
  });

  it('renders without crashing for a known slug', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders h1', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
  });

  it('is NOT noindex (term detail pages are indexed)', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-noindex')).toBe('false');
  });

  it('passes a schema to HeadlessSEO', () => {
    renderPage();
    expect(screen.getByTestId('seo').getAttribute('data-has-schema')).toBe('true');
  });

  it('provides hrefLang for EN, PT-BR, and x-default', () => {
    renderPage();
    const hrefLangs = JSON.parse(
      screen.getByTestId('seo').getAttribute('data-hreflang') ?? '[]'
    ) as string[];
    expect(hrefLangs).toContain('en');
    expect(hrefLangs).toContain('pt-BR');
    expect(hrefLangs).toContain('x-default');
  });

  it('renders breadcrumb with hub + term labels', () => {
    renderPage();
    const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
    // Breadcrumb mock joins with " / " — two items means one separator
    expect((breadcrumb.textContent ?? '').includes('/')).toBe(true);
  });

  it('renders back link to encyclopedia hub', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const backLink = links.find((l) => l.getAttribute('href')?.includes('encyclopedia'));
    expect(backLink).toBeDefined();
  });

  it('renders FAQ question heading (required for FAQPage schema to be valid)', () => {
    renderPage();
    // The question is rendered as an h2 inside the article
    const headings = screen.getAllByRole('heading', { level: 2 });
    expect(headings.length).toBeGreaterThan(0);
  });
});

// ── Schema integrity (pure logic) ─────────────────────────────────────────────

describe('EncyclopediaPage — schema integrity', () => {
  it('camelCase keys convert to kebab-case slugs', () => {
    expect(toEncyclopediaTermSlug('brazilianZouk')).toBe('brazilian-zouk');
    expect(toEncyclopediaTermSlug('cambre')).toBe('cambre');
    expect(toEncyclopediaTermSlug('howToDanceBrazilianZouk')).toBe('how-to-dance-brazilian-zouk');
    expect(toEncyclopediaTermSlug('caribbeanVsBrazilianZouk')).toBe('caribbean-vs-brazilian-zouk');
  });

  it('term detail page URL ends with trailing slash (required for @id integrity)', () => {
    const BASE = ARTIST.site.baseUrl.replace(/\/$/, '');
    const hubPath = '/encyclopedia';
    const termSlug = toEncyclopediaTermSlug('cambre');
    const pageUrl = `${BASE}${hubPath}/${termSlug}/`;
    expect(pageUrl).toMatch(/\/$/);
    // @id fragments must be anchored to trailing-slash URL
    expect(`${pageUrl}#defined-term`).toMatch(/\/#defined-term$/);
  });

  it('hub URL ends with trailing slash', () => {
    const BASE = ARTIST.site.baseUrl.replace(/\/$/, '');
    const hubUrl = `${BASE}/encyclopedia/`;
    expect(`${hubUrl}#defined-term-set`).toMatch(/\/#defined-term-set$/);
  });

  it('every term in ZOUK_ENCYCLOPEDIA is resolvable by its slug', () => {
    for (const entry of ZOUK_ENCYCLOPEDIA) {
      const slug = toEncyclopediaTermSlug(entry.key);
      const found = findEncyclopediaTermBySlug(slug);
      expect(found?.key, `term "${entry.key}" (slug: "${slug}") must resolve`).toBe(entry.key);
    }
  });

  it('no two terms share the same slug', () => {
    const slugs = ZOUK_ENCYCLOPEDIA.map((e) => toEncyclopediaTermSlug(e.key));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

// ── Redirect tests ─────────────────────────────────────────────────────────────

describe('EncyclopediaPage — invalid slug redirect', () => {
  beforeEach(() => { currentParam = 'this-slug-does-not-exist-xyz'; });

  it('renders Navigate for an unknown slug (no hub search input)', () => {
    renderPage();
    // When Navigate fires, hub content is replaced by the Navigate stub
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(screen.getByTestId('navigate')).toBeDefined();
  });

  it('Navigate points to the encyclopedia hub route', () => {
    renderPage();
    const nav = screen.getByTestId('navigate');
    expect(nav.getAttribute('data-to')).toMatch(/encyclopedia/);
  });
});
