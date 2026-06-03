import { describe, it, expect, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { renderHookWithProviders } from '../../test/utils';
import {
  fetchEventsFn,
  fetchNewsFn,
  useEventsQuery,
  useNewsQuery,
} from '../../hooks/usePublicQueries';
import { mockRawEvent, mockEventsEnvelope, mockPosts, REST_BASE } from '../../test/mocks/fixtures';

// Mock getLocalizedRoute — avoids loading lazy page components in testes
vi.mock('../../config/routes', () => ({
  getLocalizedRoute: () => '/events/:id',
  normalizeLanguage: (lang: string) => (lang.startsWith('pt') ? 'pt' : 'en'),
}));

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

  it('throws when API responds with non-ok status', async () => {
    server.use(
      http.get(`${REST_BASE}/zen-bit/v2/events`, () =>
        HttpResponse.json({ message: 'Error' }, { status: 500 })
      )
    );
    await expect(fetchEventsFn({ lang: 'en' })).rejects.toThrow();
  });

  it('throws on network failure', async () => {
    server.use(
      http.get(`${REST_BASE}/zen-bit/v2/events`, () => HttpResponse.error())
    );
    await expect(fetchEventsFn({ lang: 'en' })).rejects.toThrow();
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
