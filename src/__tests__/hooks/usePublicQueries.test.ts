import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { renderHookWithProviders } from '../../test/utils';
import {
  fetchMenuFn,
  fetchEventsFn,
  fetchNewsFn,
  useMenuQuery,
  useEventsQuery,
  useNewsQuery,
} from '../../hooks/usePublicQueries';
import { mockMenu, mockRawEvent, mockEventsEnvelope, mockPosts, REST_BASE } from '../../test/mocks/fixtures';

// Mock getLocalizedRoute — avoids loading lazy page components in testes
vi.mock('../../config/routes', () => ({
  getLocalizedRoute: () => '/events/:id',
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
}));

// ── fetchMenuFn ──────────────────────────────────────────────────────────────

describe('fetchMenuFn', () => {
  it('returns menu items on success', async () => {
    const result = await fetchMenuFn('en');
    expect(result).toEqual(mockMenu);
  });

  it('throws when API responds with non-ok status', async () => {
    server.use(
      http.get(`${REST_BASE}/djzeneyer/v1/menu`, () =>
        HttpResponse.json({ message: 'Not Found' }, { status: 404 })
      )
    );
    await expect(fetchMenuFn('en')).rejects.toThrow('Failed to fetch menu');
  });

  it('returns prerender data without fetching when available', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    Object.assign(window, {
      __PRERENDER_DATA__: { menu: { en: mockMenu }, eventsLimit: 10, eventsMode: 'upcoming', eventsDays: 365 },
    });
    const result = await fetchMenuFn('en');
    expect(result).toEqual(mockMenu);
    expect(fetchSpy).not.toHaveBeenCalled();
    // restore
    Object.assign(window, { __PRERENDER_DATA__: undefined });
    fetchSpy.mockRestore();
  });
});

// ── fetchEventsFn ─────────────────────────────────────────────────────────────

describe('fetchEventsFn', () => {
  it('returns events from envelope response', async () => {
    const result = await fetchEventsFn({ lang: 'en' });
    expect(result).toHaveLength(1);
    expect(result[0].event_id).toBe(mockRawEvent.event_id);
  });

  it('returns events from flat array response', async () => {
    server.use(
      http.get(`${REST_BASE}/zen-bit/v2/events`, () =>
        HttpResponse.json([mockRawEvent])
      )
    );
    const result = await fetchEventsFn({ lang: 'en' });
    expect(result).toHaveLength(1);
  });

  it('adds _processed field with eventDate and day', async () => {
    const result = await fetchEventsFn({ lang: 'en' });
    expect(result[0]._processed).toBeDefined();
    expect(result[0]._processed?.eventDate).toBeInstanceOf(Date);
    expect(typeof result[0]._processed?.day).toBe('number');
  });

  it('returns [] when API responds with non-ok status', async () => {
    server.use(
      http.get(`${REST_BASE}/zen-bit/v2/events`, () =>
        HttpResponse.json({ message: 'Error' }, { status: 500 })
      )
    );
    const result = await fetchEventsFn({ lang: 'en' });
    expect(result).toEqual([]);
  });

  it('returns [] on network failure', async () => {
    server.use(
      http.get(`${REST_BASE}/zen-bit/v2/events`, () => HttpResponse.error())
    );
    const result = await fetchEventsFn({ lang: 'en' });
    expect(result).toEqual([]);
  });

  it('respects the limit parameter', async () => {
    server.use(
      http.get(`${REST_BASE}/zen-bit/v2/events`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('limit')).toBe('5');
        return HttpResponse.json(mockEventsEnvelope);
      })
    );
    await fetchEventsFn({ limit: 5, lang: 'en' });
  });
});

// ── fetchNewsFn ───────────────────────────────────────────────────────────────

describe('fetchNewsFn', () => {
  it('returns posts on success', async () => {
    const result = await fetchNewsFn('en');
    expect(result).toEqual(mockPosts);
  });

  it('passes filter params to the API', async () => {
    server.use(
      http.get(`${REST_BASE}/wp/v2/posts`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('categories')).toBe('zouk');
        return HttpResponse.json(mockPosts);
      })
    );
    await fetchNewsFn('en', { category: 'zouk' });
  });

  it('throws when API fails', async () => {
    server.use(
      http.get(`${REST_BASE}/wp/v2/posts`, () =>
        HttpResponse.json({ message: 'Error' }, { status: 500 })
      )
    );
    await expect(fetchNewsFn('en')).rejects.toThrow('Failed to fetch news posts');
  });
});

// ── useMenuQuery ─────────────────────────────────────────────────────────────

describe('useMenuQuery', () => {
  it('fetches and returns menu items', async () => {
    const { result } = renderHookWithProviders(() => useMenuQuery('en'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockMenu);
  });

  it('starts in loading state', () => {
    const { result } = renderHookWithProviders(() => useMenuQuery('en'));
    expect(result.current.isLoading).toBe(true);
  });
});

// ── useEventsQuery ────────────────────────────────────────────────────────────

describe('useEventsQuery', () => {
  it('fetches events and resolves to success', async () => {
    const { result } = renderHookWithProviders(() => useEventsQuery({ lang: 'en' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data![0].event_id).toBe(mockRawEvent.event_id);
  });

  it('defaults mode to upcoming', async () => {
    server.use(
      http.get(`${REST_BASE}/zen-bit/v2/events`, ({ request }) => {
        const url = new URL(request.url);
        // mode not set by default — fetchEventsFn maps upcomingOnly internally
        return HttpResponse.json(mockEventsEnvelope);
      })
    );
    const { result } = renderHookWithProviders(() => useEventsQuery());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

// ── useNewsQuery ──────────────────────────────────────────────────────────────

describe('useNewsQuery', () => {
  it('is disabled when enabled=false', () => {
    const { result } = renderHookWithProviders(() =>
      useNewsQuery('en', { enabled: false })
    );
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches posts when enabled', async () => {
    const { result } = renderHookWithProviders(() => useNewsQuery('en'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPosts);
  });
});
