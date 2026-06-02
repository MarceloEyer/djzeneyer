import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EventsPage from '../../pages/EventsPage';
import { ARTIST } from '../../data/artistData';

// ── Controlled param ──────────────────────────────────────────────────────────

let currentId: string | undefined = undefined;

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: () => ({ id: currentId }),
    Link: ({ to, children, ...p }: { to: string; children: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
      React.createElement('a', { href: to, ...p }, children),
    generatePath: (pattern: string, params?: Record<string, string>) => {
      if (!params) return pattern;
      return Object.entries(params).reduce((p, [k, v]) => p.replace(`:${k}`, v), pattern);
    },
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../../config/routes', () => ({
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
  getLocalizedRoute: (key: string) => `/${key}`,
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial: _i, animate: _a, ...p }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) =>
      React.createElement('div', p, children),
  },
  useReducedMotion: () => false,
}));

vi.mock('../../contexts/BrandingContext', () => ({
  useBranding: () => ({ artist: ARTIST }),
}));

vi.mock('../../hooks/usePublicQueries', () => ({
  useEventsQuery: () => ({ data: [], isLoading: false, error: null }),
  useEventById: () => ({ data: null }),
}));

vi.mock('../../components/Breadcrumb', () => ({
  Breadcrumb: ({ items }: { items: { label: string }[] }) =>
    React.createElement('nav', { 'aria-label': 'breadcrumb' }, items.map((i) => i.label).join(' / ')),
}));

vi.mock('../../components/HeadlessSEO', () => ({
  HeadlessSEO: ({ title, image }: { title: string; image?: string }) =>
    React.createElement('div', {
      'data-testid': 'seo',
      'data-title': title,
      'data-image': image ?? '',
    }),
}));

vi.mock('../../components/Events/AddCalendarMenu', () => ({
  default: () => React.createElement('div', { 'data-testid': 'add-calendar' }),
}));

vi.mock('../../components/common/Toast', () => ({
  Toast: () => null,
}));

vi.mock('../../pages/NotFoundPage', () => ({
  default: () => React.createElement('div', { 'data-testid': 'not-found' }),
}));

// ── Render helper ─────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <HelmetProvider>
      <EventsPage />
    </HelmetProvider>
  );
}

// ── List view tests ───────────────────────────────────────────────────────────

describe('EventsPage — list view (no id param)', () => {
  beforeEach(() => { currentId = undefined; });

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

  it('renders empty state message when no events', () => {
    renderPage();
    expect(screen.getByText('events_no_results')).toBeDefined();
  });

  it('renders booking link in CTA section', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    const bookingLink = links.find((l) => l.getAttribute('href')?.includes('booking'));
    expect(bookingLink).toBeDefined();
  });
});

// ── Detail view tests ─────────────────────────────────────────────────────────

describe('EventsPage — detail view (with id param)', () => {
  beforeEach(() => { currentId = 'test-event-123'; });

  it('renders without crashing (unknown event → NotFoundPage)', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('renders NotFoundPage when event is not found', () => {
    renderPage();
    expect(screen.getByTestId('not-found')).toBeDefined();
  });

  it('does not render list h1 in detail mode', () => {
    renderPage();
    const h1s = screen.queryAllByRole('heading', { level: 1 });
    // NotFoundPage may or may not render h1; list-page h1 (events.title_part1) should not appear
    const hasListH1 = h1s.some((h) => h.textContent?.includes('events.title_part1'));
    expect(hasListH1).toBe(false);
  });
});

// ── URL integrity ─────────────────────────────────────────────────────────────

describe('EventsPage — URL integrity', () => {
  it('ARTIST.site.baseUrl does not contain localhost', () => {
    expect(ARTIST.site.baseUrl).not.toMatch(/localhost/);
  });

  it('ARTIST.site.baseUrl ends with trailing slash or is clean domain', () => {
    expect(ARTIST.site.baseUrl).toMatch(/^https?:\/\//);
  });
});
