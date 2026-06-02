import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ZoukFestivalsPage from '../../pages/ZoukFestivalsPage';
import { ARTIST } from '../../data/artistData';
import { categorizeFestivals } from '../../utils/festivals';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => k,
    i18n: { language: 'en' },
  }),
}));

vi.mock('../../config/routes', () => ({
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
  getLocalizedRoute: (_key: string, _lang: string) => '/zouk-festivals',
  getAlternateLinks: () => ({ en: '/zouk-festivals', pt: '/pt/festivais-zouk', 'x-default': '/zouk-festivals' }),
}));

vi.mock('framer-motion', () => ({
  motion: {
    header: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) =>
      React.createElement('header', props, children),
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) =>
      React.createElement('div', props, children),
  },
  useReducedMotion: () => false,
}));

vi.mock('../../components/Breadcrumb', () => ({
  Breadcrumb: ({ items }: { items: { label: string }[] }) =>
    React.createElement('nav', { 'aria-label': 'breadcrumb' }, items.map((i) => i.label).join(' / ')),
}));

vi.mock('../../components/HeadlessSEO', () => ({
  HeadlessSEO: ({ title, noindex }: { title: string; noindex?: boolean }) =>
    React.createElement('div', { 'data-testid': 'seo', 'data-title': title, 'data-noindex': String(!!noindex) }),
}));

// ── Helper ───────────────────────────────────────────────────────────────────

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={['/zouk-festivals']}>
        <ZoukFestivalsPage />
      </MemoryRouter>
    </HelmetProvider>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('ZoukFestivalsPage', () => {
  it('renders without crashing', () => {
    expect(() => renderPage()).not.toThrow();
  });

  it('passes noindex to HeadlessSEO (page is not yet indexed)', () => {
    renderPage();
    const seo = screen.getByTestId('seo');
    expect(seo.getAttribute('data-noindex')).toBe('true');
  });

  it('passes seo_title i18n key to HeadlessSEO', () => {
    renderPage();
    const seo = screen.getByTestId('seo');
    expect(seo.getAttribute('data-title')).toBe('hub_pages.zouk_festivals.seo_title');
  });

  it('renders breadcrumb with festivals label', () => {
    renderPage();
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeDefined();
  });

  it('renders the h1 via i18n key', () => {
    renderPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'hub_pages.zouk_festivals.h1'
    );
  });

  it('renders past-festivals section heading', () => {
    renderPage();
    const pastHeading = screen.getByText('hub_pages.zouk_festivals.past_editions');
    expect(pastHeading).toBeDefined();
  });

  it('renders at least one festival card from ARTIST.festivals', () => {
    renderPage();
    const firstFestival = ARTIST.festivals[0];
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
    const links = screen.getAllByRole('link');
    const hasKnownFestival = links.some((l) =>
      l.textContent?.includes(firstFestival.country) ||
      l.getAttribute('href') === firstFestival.url
    );
    expect(hasKnownFestival).toBe(true);
  });

  it('renders all ARTIST.festivals as cards (upcoming + past combined)', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    // Each festival produces one <a> card
    expect(links.length).toBe(ARTIST.festivals.length);
  });

  it('categorizes ARTIST.festivals correctly — past and upcoming add up to total', () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { upcoming, past } = categorizeFestivals(ARTIST.festivals as Festival[], today);
    expect(upcoming.length + past.length).toBe(ARTIST.festivals.length);
  });

  it('festival card links open in new tab with rel="noopener noreferrer"', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  it('each festival card has an accessible aria-label', () => {
    renderPage();
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link.getAttribute('aria-label')).toBeTruthy();
    }
  });
});

// ── Type import (local, avoids top-level import breaking tree shaking) ────────
import type { Festival } from '../../types';
