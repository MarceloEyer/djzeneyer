import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { usePrefetchOnHover } from '../../hooks/usePrefetchOnHover';
import { queryClient } from '../../config/queryClient';

vi.mock('../../config/queryClient', () => ({
  queryClient: {
    prefetchQuery: vi.fn(),
  },
  QUERY_KEYS: {
    events: { list: (params: any) => ['events', params] },
    posts: { list: (lang: string) => ['posts', lang] },
    products: { list: (lang: string) => ['products', lang] },
  },
}));

vi.mock('../../hooks/useQueries', () => ({
  fetchEventsFn: vi.fn(),
  fetchNewsFn: vi.fn(),
  fetchProductsFn: vi.fn(),
}));

describe('usePrefetchOnHover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a prefetch function', () => {
    const { result } = renderHook(() => usePrefetchOnHover());
    expect(typeof result.current).toBe('function');
  });

  it('prefetches events when url contains event', () => {
    const { result } = renderHook(() => usePrefetchOnHover());
    result.current('/en/events');
    expect(queryClient.prefetchQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['events', { limit: 10, lang: 'en', upcomingOnly: true }],
      })
    );
  });

  it('prefetches news when url contains news or noticias', () => {
    const { result } = renderHook(() => usePrefetchOnHover());
    result.current('/pt/noticias');
    expect(queryClient.prefetchQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['posts', 'pt'],
      })
    );
  });

  it('prefetches shop when url contains shop or loja', () => {
    const { result } = renderHook(() => usePrefetchOnHover());
    result.current('/en/shop');
    expect(queryClient.prefetchQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['products', 'en'],
      })
    );
  });

  it('does nothing for unknown urls', () => {
    const { result } = renderHook(() => usePrefetchOnHover());
    result.current('/about');
    expect(queryClient.prefetchQuery).not.toHaveBeenCalled();
  });

  it('does nothing for empty urls', () => {
    const { result } = renderHook(() => usePrefetchOnHover());
    result.current('');
    expect(queryClient.prefetchQuery).not.toHaveBeenCalled();
  });
});
