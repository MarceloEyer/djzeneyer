import { describe, it, expect } from 'vitest';
import { waitFor, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { renderHookWithProviders } from '../../test/utils';
import {
  useSubscriptionMutation,
  useUpdateProfileMutation,
  useAddToCartMutation,
  useUpdateNewsletterMutation,
  useTrackInteraction,
} from '../../hooks/useMutations';
import { TEST_TOKEN, REST_BASE } from '../../test/mocks/fixtures';

// ── useSubscriptionMutation ───────────────────────────────────────────────────

describe('useSubscriptionMutation', () => {
  it('resolves with success response on valid email', async () => {
    const { result } = renderHookWithProviders(() => useSubscriptionMutation());
    act(() => { result.current.mutate('dancer@example.com'); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ success: true });
  });

  it('rejects with API error message', async () => {
    server.use(
      http.post(`${REST_BASE}/djzeneyer/v1/subscribe`, () =>
        HttpResponse.json({ message: 'Email already subscribed' }, { status: 422 })
      )
    );
    const { result } = renderHookWithProviders(() => useSubscriptionMutation());
    act(() => { result.current.mutate('existing@example.com'); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Email already subscribed');
  });
});

// ── useUpdateProfileMutation ──────────────────────────────────────────────────

describe('useUpdateProfileMutation', () => {
  it('throws immediately when no token is provided', async () => {
    const { result } = renderHookWithProviders(() =>
      useUpdateProfileMutation(undefined)
    );
    act(() => { result.current.mutate({ display_name: 'New Name' }); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('No token provided');
  });

  it('sends profile data and resolves on success', async () => {
    const { result } = renderHookWithProviders(() =>
      useUpdateProfileMutation(TEST_TOKEN)
    );
    act(() => { result.current.mutate({ display_name: 'Zen Dancer' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toMatchObject({ success: true });
  });

  it('rejects when API returns error', async () => {
    server.use(
      http.post(`${REST_BASE}/zeneyer-auth/v1/profile`, () =>
        HttpResponse.json({ message: 'Validation failed' }, { status: 400 })
      )
    );
    const { result } = renderHookWithProviders(() =>
      useUpdateProfileMutation(TEST_TOKEN)
    );
    act(() => { result.current.mutate({ email: 'invalid' }); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Validation failed');
  });
});

// ── useAddToCartMutation ──────────────────────────────────────────────────────

describe('useAddToCartMutation', () => {
  it('adds item and returns updated cart', async () => {
    const { result } = renderHookWithProviders(() => useAddToCartMutation());
    act(() => { result.current.mutate({ productId: 10, quantity: 1 }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveProperty('items_count', 1);
  });

  it('rejects when product is unavailable', async () => {
    server.use(
      http.post(`${REST_BASE}/wc/store/v1/cart/add-item`, () =>
        HttpResponse.json({ message: 'Product out of stock' }, { status: 400 })
      )
    );
    const { result } = renderHookWithProviders(() => useAddToCartMutation());
    act(() => { result.current.mutate({ productId: 99, quantity: 1 }); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Product out of stock');
  });
});

// ── useUpdateNewsletterMutation ───────────────────────────────────────────────

describe('useUpdateNewsletterMutation', () => {
  it('throws without token', async () => {
    const { result } = renderHookWithProviders(() =>
      useUpdateNewsletterMutation(undefined)
    );
    act(() => { result.current.mutate(true); });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('No token provided');
  });

  it('sends subscribe=true and resolves', async () => {
    const { result } = renderHookWithProviders(() =>
      useUpdateNewsletterMutation(TEST_TOKEN)
    );
    act(() => { result.current.mutate(true); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});

// ── useTrackInteraction ───────────────────────────────────────────────────────

describe('useTrackInteraction', () => {
  it('sends tracking event and resolves', async () => {
    const { result } = renderHookWithProviders(() =>
      useTrackInteraction(TEST_TOKEN)
    );
    act(() => { result.current.mutate({ action: 'view_event', objectId: 42 }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('works without token (anonymous tracking)', async () => {
    const { result } = renderHookWithProviders(() =>
      useTrackInteraction(undefined)
    );
    act(() => { result.current.mutate({ action: 'page_view' }); });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
