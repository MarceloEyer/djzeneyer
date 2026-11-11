import { describe, it, expect } from 'vitest';
import { waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { renderHookWithProviders } from '../../test/utils';
import {
  fetchAuthSessionFn,
  useProfileQuery,
  useUserOrdersQuery,
  useNewsletterStatusQuery,
  useCartQuery,
} from '../../hooks/useAuthenticatedQueries';
import { mockAuthSession, mockUserProfile, mockOrders, TEST_TOKEN, REST_BASE } from '../../test/mocks/fixtures';

// ── fetchAuthSessionFn ────────────────────────────────────────────────────────

describe('fetchAuthSessionFn', () => {
  it('returns parsed AuthSessionResponse on success', async () => {
    const result = await fetchAuthSessionFn(TEST_TOKEN);
    expect(result.authenticated).toBe(true);
    expect(result.user).toMatchObject({ id: mockAuthSession.user!.id });
  });

  it('throws when response is an HTML page (WP debug output)', async () => {
    server.use(
      http.get(`${REST_BASE}/zeneyer-auth/v1/session`, () =>
        new HttpResponse('<!DOCTYPE html><html><body>Debug</body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        })
      )
    );
    await expect(fetchAuthSessionFn(TEST_TOKEN)).rejects.toThrow('Invalid session response');
  });

  it('throws when response status is non-ok', async () => {
    server.use(
      http.get(`${REST_BASE}/zeneyer-auth/v1/session`, () =>
        new HttpResponse('{"authenticated":false}', { status: 401 })
      )
    );
    await expect(fetchAuthSessionFn(TEST_TOKEN)).rejects.toThrow('Invalid session response');
  });
});

// ── useProfileQuery ───────────────────────────────────────────────────────────

describe('useProfileQuery', () => {
  it('is idle (not fetching) when no token provided', () => {
    const { result } = renderHookWithProviders(() => useProfileQuery(undefined));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches profile data when token is provided', async () => {
    const { result } = renderHookWithProviders(() => useProfileQuery(TEST_TOKEN));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({
      id: mockUserProfile.id,
      email: mockUserProfile.email,
    });
  });

  it('returns null when API returns success:false', async () => {
    server.use(
      http.get(`${REST_BASE}/zeneyer-auth/v1/profile`, () =>
        HttpResponse.json({ success: false })
      )
    );
    const { result } = renderHookWithProviders(() => useProfileQuery(TEST_TOKEN));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('returns null on schema validation failure', async () => {
    server.use(
      http.get(`${REST_BASE}/zeneyer-auth/v1/profile`, () =>
        // id is missing — schema mismatch
        HttpResponse.json({ success: true, data: { email: 'bad@example.com' } })
      )
    );
    const { result } = renderHookWithProviders(() => useProfileQuery(TEST_TOKEN));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it('respects enabled:false option', () => {
    const { result } = renderHookWithProviders(() =>
      useProfileQuery(TEST_TOKEN, { enabled: false })
    );
    expect(result.current.fetchStatus).toBe('idle');
  });
});

// ── useUserOrdersQuery ────────────────────────────────────────────────────────

describe('useUserOrdersQuery', () => {
  it('returns [] when token or userId is missing', async () => {
    const { result } = renderHookWithProviders(() =>
      useUserOrdersQuery(undefined, undefined)
    );
    // enabled=false when both are missing
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('fetches orders when userId and token are provided', async () => {
    const { result } = renderHookWithProviders(() =>
      useUserOrdersQuery(42, TEST_TOKEN)
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockOrders);
  });
});

// ── useNewsletterStatusQuery ──────────────────────────────────────────────────

describe('useNewsletterStatusQuery', () => {
  it('is idle without token', () => {
    const { result } = renderHookWithProviders(() =>
      useNewsletterStatusQuery(undefined)
    );
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('returns subscription status when token provided', async () => {
    const { result } = renderHookWithProviders(() =>
      useNewsletterStatusQuery(TEST_TOKEN)
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBe(true);
  });
});

// ── useCartQuery ──────────────────────────────────────────────────────────────

describe('useCartQuery', () => {
  it('fetches cart data', async () => {
    const { result } = renderHookWithProviders(() => useCartQuery());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveProperty('items_count', 0);
  });

  it('fails when cart API returns error', async () => {
    server.use(
      http.get(`${REST_BASE}/wc/store/v1/cart`, () =>
        HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
      )
    );
    const { result } = renderHookWithProviders(() => useCartQuery());
    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
