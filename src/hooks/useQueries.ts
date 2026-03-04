// src/hooks/useQueries.ts
// v5.0 - Query Hub Aligned with Headless Facade Architecture

/**
 * Central de React Query hooks
 * - Queries públicas (cache longo, sem auth)
 * - Queries privadas reais (Woo Cart)
 * - Queries de dashboard via API façade (sem nonce)
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { buildApiUrl } from '../config/api';
import { QUERY_KEYS, STALE_TIME, invalidateQueries } from '../config/queryClient';
import type { ZenGameUserData, ZenGameLeaderboard } from '../types/gamification';

// ============================================================================
// TYPES
// ============================================================================

interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

import type { BandsintownEvent, FetchEventsParams, EventsApiResponse } from '../types/events';

export interface MusicTrack {
  id: number;
  title: { rendered: string };
  category_name: string;
  tag_names: string[];
  links: {
    download: string;
    soundcloud: string;
    youtube: string;
  };
  featured_image_src?: string | null;
  featured_image_src_full?: string | null;
  slug: string;
  content?: { rendered: string };
  excerpt?: { rendered: string };
}

export interface WPPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  featured_image_src?: string | null;
  featured_image_src_full?: string | null;
  author_name?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    author?: Array<{ name: string }>;
  };
}

// ============================================================================
// EXPORTED FETCH FUNCTIONS (PREFETCH READY)
// ============================================================================

export const fetchMenuFn = async (lang: string): Promise<MenuItem[]> => {
  const apiUrl = buildApiUrl('djzeneyer/v1/menu', { lang });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch menu');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const fetchEventsFn = async ({ limit = 10, lang, upcomingOnly = true, search }: FetchEventsParams = {}): Promise<BandsintownEvent[]> => {
  const apiUrl = buildApiUrl('zen-bit/v1/events', {
    limit: String(limit),
    ...(lang ? { lang } : {}),
    ...(upcomingOnly ? { upcoming_only: '1' } : {}),
    ...(search ? { search } : {}),
  });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data: EventsApiResponse | BandsintownEvent[] = await res.json();

  // Handle both direct array and { success, events } wrapper
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.events)) return data.events;
  return [];
};

export const fetchTracksFn = async (): Promise<MusicTrack[]> => {
  const apiUrl = buildApiUrl('wp/v2/remixes', {
    per_page: '100',
    // OPTIMIZATION: Limit fields to reduce payload size
    _fields: 'id,title,category_name,tag_names,links,featured_image_src,slug',
  });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch tracks');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const fetchNewsFn = async (lang?: string): Promise<WPPost[]> => {
  const apiUrl = buildApiUrl('wp/v2/posts', {
    per_page: '10',
    ...(lang ? { lang } : {}),
    // OPTIMIZATION: Replaced _embed=true with targeted fields
    _fields: 'id,date,slug,title,excerpt,featured_image_src,featured_image_src_full,author_name',
  });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch news posts');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const fetchProductsFn = async (lang?: string, filters: Record<string, string> = {}) => {
  const params: Record<string, string> = { per_page: '100', ...filters };
  if (lang) params.lang = lang;
  const apiUrl = buildApiUrl('djzeneyer/v1/products', params);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchProductCollectionsFn = async (lang?: string, limit = 10) => {
  const params: Record<string, string> = { limit: String(limit) };
  if (lang) params.lang = lang;

  const apiUrl = buildApiUrl('djzeneyer/v1/products/collections', params);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch product collections');
  return res.json();
};

// ============================================================================
// MENU QUERY (PÚBLICO)
// ============================================================================

export const useMenuQuery = (lang: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.menu.list(lang),
    queryFn: () => fetchMenuFn(lang),
    staleTime: STALE_TIME.MENU,
    retry: 1,
  });
};

// ============================================================================
// EVENTS QUERY (PÚBLICO)
// ============================================================================

export const useEventsQuery = (params: FetchEventsParams = {}, options = {}) => {
  const normalizedParams: FetchEventsParams = {
    limit: params.limit ?? 10,
    lang: params.lang,
    upcomingOnly: params.upcomingOnly ?? true,
    search: params.search,
  };

  return useQuery({
    queryKey: QUERY_KEYS.events.list(normalizedParams),
    queryFn: () => fetchEventsFn(normalizedParams),
    staleTime: STALE_TIME.EVENTS,
    retry: 2,
    ...options
  });
};

// ============================================================================
// TRACKS QUERY (PÚBLICO)
// ============================================================================

export const useTracksQuery = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.tracks.list(),
    queryFn: fetchTracksFn,
    staleTime: STALE_TIME.TRACKS,
    gcTime: 15 * 60 * 1000,
    ...options,
  });
};

export const useTrackBySlug = (slug?: string) => {
  return useQuery({
    queryKey: ['tracks', 'detail', slug],
    queryFn: async (): Promise<MusicTrack | null> => {
      if (!slug) return null;
      const apiUrl = buildApiUrl('wp/v2/remixes', {
        slug,
        _fields: 'id,title,content,excerpt,links,featured_image_src_full,slug',
      });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch track');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    },
    enabled: !!slug,
    staleTime: STALE_TIME.TRACKS,
  });
};

// ============================================================================
// NEWS QUERY (PÚBLICO)
// ============================================================================

export const useNewsQuery = (lang?: string, options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.posts.list(lang),
    queryFn: () => fetchNewsFn(lang),
    staleTime: STALE_TIME.POSTS,
    ...options,
  });
};

export const useNewsBySlug = (slug?: string, lang?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.posts.detail(slug || ''), lang],
    queryFn: async (): Promise<WPPost | null> => {
      if (!slug) return null;
      const apiUrl = buildApiUrl('wp/v2/posts', {
        slug,
        ...(lang ? { lang } : {}),
        // OPTIMIZATION: Replaced _embed=true with targeted fields
        _fields: 'id,date,slug,title,content,excerpt,featured_image_src_full,author_name',
      });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch individual news post');
      const data = await res.json();
      return Array.isArray(data) && data.length > 0 ? data[0] : null;
    },
    enabled: !!slug,
    staleTime: STALE_TIME.POSTS,
  });
};

// ============================================================================
// EVENT DETAIL QUERY (PÚBLICO)
// ============================================================================

export const useEventById = (id?: string, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.detail(id || ''),
    queryFn: async (): Promise<BandsintownEvent | null> => {
      if (!id) return null;
      const apiUrl = buildApiUrl(`zen-bit/v1/events/${id}`);
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Event API ${res.status}`);
      const data = await res.json();
      return data?.event || null;
    },
    enabled: !!id,
    staleTime: STALE_TIME.EVENTS,
    ...options
  });
};

// ============================================================================
// PRODUCTS QUERY (PÚBLICO)
// ============================================================================

<<<<<<< HEAD

export const useShopPageQuery = (lang?: string) => {
  return useQuery({
    queryKey: ['shop_page', lang],
    queryFn: async () => {
      const apiUrl = buildApiUrl('djzeneyer/v1/shop/page', { lang: lang || 'en' });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch shop page view-model');
      return res.json();
    },
    staleTime: STALE_TIME.PRODUCTS,
  });
};

export const useProductsQuery = (lang?: string) => {
=======
export const useProductsQuery = (lang?: string, filters: Record<string, string> = {}) => {
>>>>>>> origin/main
  return useQuery({
    queryKey: [...QUERY_KEYS.products.list(lang), filters],
    queryFn: () => fetchProductsFn(lang, filters),
    staleTime: STALE_TIME.PRODUCTS,
  });
};

export const useProductCollectionsQuery = (lang?: string, limit = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.products.collections(lang, limit),
    queryFn: () => fetchProductCollectionsFn(lang, limit),
    staleTime: STALE_TIME.PRODUCTS,
  });
};

// ============================================================================
// CART QUERY (PRIVADO REAL - WC STORE API)
// ============================================================================

export const useCartQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.cart.current,
    queryFn: async () => {
      const apiUrl = buildApiUrl('wc/store/v1/cart');
      const nonce = (window as any).wpData?.nonce || '';

      const res = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce,
        },
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to fetch cart');
      return res.json();
    },
    staleTime: STALE_TIME.CART,
    refetchOnWindowFocus: true,
  });
};

export const useAddToCartMutation = () => {
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const apiUrl = buildApiUrl('wc/store/v1/cart/add-item');
      const nonce = (window as any).wpData?.nonce || '';

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': nonce,
        },
        credentials: 'include',
        body: JSON.stringify({ id: productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add item to cart');
      return data;
    },
    onSuccess: () => {
      invalidateQueries.cart();
    },
  });
};

// ============================================================================
// USER GAMIPRESS QUERY (DASHBOARD - AUTHENTICATED)
// ============================================================================

export const useGamipressQuery = (userId?: number, token?: string) => {
  return useQuery({
    // Use 0 or -1 as a placeholder for "self" in the query key if userId is not provided
    queryKey: [...QUERY_KEYS.user.gamipress(userId || 0), token],
    queryFn: async (): Promise<ZenGameUserData | null> => {
      if (!token && !userId) return null;

      const params: Record<string, string> = {};
      if (userId) params.user_id = String(userId);

      params.limit_logs = '5'; // Dashboard typically only needs 5
      const apiUrl = buildApiUrl('djzeneyer/v1/gamipress/user-data', params);
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const wpData = (window as any).wpData || {};
      if (wpData.nonce) headers['X-WP-Nonce'] = wpData.nonce;

      const res = await fetch(apiUrl, { headers, credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to fetch gamipress: ${res.status}`);
      return res.json();
    },
    staleTime: STALE_TIME.GAMIPRESS,
    refetchInterval: 60_000,
    enabled: Boolean(token) || Boolean(userId),
    retry: false,
  });
};

/**
 * Hook alias for ZenGame v1.1.0 logic
 * Optimized for self-profile fetching with JWT
 */
export const useZenGameUserData = (token?: string) => {
  return useGamipressQuery(undefined, token);
};

// ============================================================================
// LEADERBOARD QUERY (PÚBLICO)
// ============================================================================

export const useLeaderboardQuery = (limit = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.user.leaderboard(limit),
    queryFn: async (): Promise<ZenGameLeaderboard> => {
      const apiUrl = buildApiUrl('djzeneyer/v1/gamipress/leaderboard', { limit: String(limit) });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Leaderboard API Error: ${res.status}`);
      return res.json();
    },
    staleTime: STALE_TIME.GAMIPRESS, // Reuse gamipress stale time
  });
};

/**
 * Hook alias for ZenGame v1.1.0 logic (Leaderboard)
 */
export const useZenGameLeaderboard = (limit = 10) => {
  return useLeaderboardQuery(limit);
};

// ============================================================================
// USER PROFILE & NEWSLETTER (AUTHENTICATED)
// ============================================================================

export const useProfileQuery = (token?: string) => {
  return useQuery({
    queryKey: ['user', 'profile', token],
    queryFn: async () => {
      if (!token) return null;
      const apiUrl = buildApiUrl('zeneyer-auth/v1/profile');
      const res = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      return data.success ? data.data : null;
    },
    enabled: !!token,
    staleTime: STALE_TIME.USER_PROFILE,
  });
};

export const useUpdateProfileMutation = (token?: string) => {
  return useMutation({
    mutationFn: async (profileData: any) => {
      if (!token) throw new Error('No token provided');
      const apiUrl = buildApiUrl('zeneyer-auth/v1/profile');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      return data;
    },
  });
};

export const useNewsletterStatusQuery = (token?: string) => {
  return useQuery({
    queryKey: ['user', 'newsletter', token],
    queryFn: async () => {
      if (!token) return null;
      const apiUrl = buildApiUrl('zeneyer-auth/v1/newsletter');
      const res = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch newsletter status');
      const data = await res.json();
      return data.success ? data.subscribed : false;
    },
    enabled: !!token,
    staleTime: STALE_TIME.USER_PROFILE,
  });
};

export const useUpdateNewsletterMutation = (token?: string) => {
  return useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!token) throw new Error('No token provided');
      const apiUrl = buildApiUrl('zeneyer-auth/v1/newsletter');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      return data;
    },
  });
};
// ============================================================================
// SUBSCRIPTION MUTATION
// ============================================================================

export const useSubscriptionMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const apiUrl = buildApiUrl('djzeneyer/v1/subscribe');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Subscription failed');
      return data;
    },
  });
};
