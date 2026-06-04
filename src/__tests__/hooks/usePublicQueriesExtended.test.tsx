import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { server } from '../../test/mocks/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fetchArtistProfileFn,
  fetchNewsFn,
  fetchProductsFn,
  fetchProductFn,
  fetchProductCollectionsFn,
  useZenSeoSettings,
  useNewsBySlug,
  useEventById,
  useShopPageQuery,
  useLeaderboardQuery,
  useTrackBySlug
} from '../../hooks/usePublicQueries';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('usePublicQueries extended fetchers', () => {
  it('fetchArtistProfileFn', async () => {
    server.use(
      http.get('*/zen-seo/v1/profile', () => {
        return HttpResponse.json({ data: { identity: { stageName: 'Zen' } } });
      })
    );
    const data = await fetchArtistProfileFn();
    expect(data.identity.stageName).toBe('Zen');
  });

  it('fetchNewsFn with filters', async () => {
    server.use(
      http.get('*/wp/v2/posts', ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get('lang')).toBe('pt');
        expect(url.searchParams.get('categories')).toBe('1');
        return HttpResponse.json([{ id: 1 }]);
      })
    );
    const data = await fetchNewsFn('pt', { category: '1' });
    expect(data).toHaveLength(1);
  });

  it('fetchProductsFn', async () => {
    server.use(
      http.get('*/djzeneyer/v1/products', () => HttpResponse.json([{ id: 100 }]))
    );
    const data = await fetchProductsFn('en');
    expect(data[0].id).toBe(100);
  });

  it('fetchProductFn', async () => {
    server.use(
      http.get('*/djzeneyer/v1/products', () => HttpResponse.json([{ id: 101 }]))
    );
    const data = await fetchProductFn('en', 'test-product');
    expect(data?.id).toBe(101);
  });

  it('fetchProductCollectionsFn', async () => {
    server.use(
      http.get('*/djzeneyer/v1/products/collections', () => HttpResponse.json([{ id: 1 }]))
    );
    const data = await fetchProductCollectionsFn('en');
    expect(data).toHaveLength(1);
  });
});

describe('usePublicQueries extended hooks', () => {
  it('useZenSeoSettings', async () => {
    server.use(
      http.get('*/zen-seo/v1/settings', () => HttpResponse.json({ success: true, data: { real_name: 'Test' } }))
    );
    const { result } = renderHook(() => useZenSeoSettings(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.real_name).toBe('Test');
  });

  it('useNewsBySlug', async () => {
    server.use(
      http.get('*/wp/v2/posts', () => HttpResponse.json([{ id: 2 }]))
    );
    const { result } = renderHook(() => useNewsBySlug('my-news'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe(2);
  });



  it('useShopPageQuery', async () => {
    server.use(
      http.get('*/djzeneyer/v1/shop/page', () => HttpResponse.json({ products: [] }))
    );
    const { result } = renderHook(() => useShopPageQuery(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.products).toEqual([]);
  });



  it('useTrackBySlug', async () => {
    server.use(
      http.get('*/wp/v2/remixes', () => HttpResponse.json([{ id: 5 }]))
    );
    const { result } = renderHook(() => useTrackBySlug('track-slug'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.id).toBe(5);
  });
});
