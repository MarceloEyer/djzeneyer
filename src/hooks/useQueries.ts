// src/hooks/useQueries.ts
// v5.0 - Query Hub Aligned with Headless Facade Architecture

/**
 * Central de React Query hooks
 * - Queries públicas (cache longo, sem auth)
 * - Queries privadas reais (Woo Cart)
 * - Queries de dashboard via API façade (sem nonce)
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { buildApiUrl } from '../config/api';
import { QUERY_KEYS, STALE_TIME, invalidateQueries } from '../config/queryClient';
import type { ZenGameUserData, ZenGameLeaderboard } from '../types/gamification';


// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

export interface ProfileUpdatePayload {
  display_name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  type: string;
  status: string;
  short_description: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  stock_status: 'instock' | 'outofstock';
  purchasable: boolean;
  permalink: string;
}

export interface ShopPageViewModel {
  products: WCProduct[];
  featured?: WCProduct[];
  collections?: Array<{ id: number; name: string; products: WCProduct[] }>;
}

import type {
  ZenBitEventListItem,
  ZenBitEventDetail,
  FetchEventsParams,
  EventsApiResponse,
} from '../types/events';

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

export const fetchEventsFn = async ({
  mode = 'upcoming',
  days,
  date,
  limit = 10,
  lang,
}: FetchEventsParams = {}): Promise<ZenBitEventListItem[]> => {
  try {
    const params: Record<string, string> = {
      mode: mode,
      limit: String(limit),
    };
    if (days !== undefined) params.days = String(days);
    if (date) params.date = date;
    if (lang) params.lang = lang;

    const apiUrl = buildApiUrl('zen-bit/v2/events', params);
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error(`Events API Error: ${res.status}`);
      return [];
    }
    const data: EventsApiResponse | ZenBitEventListItem[] = await res.json();

    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray((data as EventsApiResponse).events))
      return (data as EventsApiResponse).events;
    return [];
  } catch (err) {
    console.error('Fetch Events failed:', err);
    return [];
  }
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

export const fetchProductsFn = async (
  lang?: string,
  filters: Record<string, string> = {}
): Promise<WCProduct[]> => {
  const params: Record<string, string> = { per_page: '100', ...filters };
  if (lang) params.lang = lang;
  const apiUrl = buildApiUrl('djzeneyer/v1/products', params);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const fetchProductCollectionsFn = async (
  lang?: string,
  limit = 10
): Promise<ShopPageViewModel['collections']> => {
  const params: Record<string, string> = { limit: String(limit) };
  if (lang) params.lang = lang;

  const apiUrl = buildApiUrl('djzeneyer/v1/products/collections', params);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch product collections');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
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

export const useEventsQuery = (
  params: FetchEventsParams = {},
  options?: Partial<UseQueryOptions<ZenBitEventListItem[]>>
) => {
  const normalizedParams: FetchEventsParams = {
    mode: params.mode ?? (params.upcomingOnly === false ? 'all' : 'upcoming'),
    days: params.days,
    date: params.date,
    limit: params.limit ?? 10,
    lang: params.lang,
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

/**
 * Extrai o ID real do evento a partir de um `routeParam` que pode ser:
 *   - ID puro:      "12345678"
 *   - Canonical:    "2025-06-20-dj-zen-eyer-at-club-x-12345678"
 *   - Alfanumérico: "2025-06-20-...-abc123" → retorna "abc123" (conservador)
 *
 * Regra: pega o último segmento após split("-").
 *   - Se for puramente numérico → é o ID Bandsintown confirma.
 *   - Senão → usa o segmento inteiro (pode ser ID alfanumérico real).
 *
 * Em ambos os casos retorna o mesmo valor para IDs sem hífen.
 */
export function extractZenBitEventId(routeParam: string): string {
  if (!routeParam) return routeParam;
  // Sem hífen → já é um ID puro (numérico ou string)
  if (!routeParam.includes('-')) return routeParam;

  // Último segmento após split por hífen
  const last = routeParam.split('-').pop() ?? routeParam;

  // Conservador: se puramente numérico retorna ele; senão retorna o segmento inteiro
  if (/^\d+$/.test(last)) return last;
  return last;
}

export const useEventById = (
  routeParam?: string,
  options?: Partial<UseQueryOptions<ZenBitEventDetail | null>>
) => {
  // Normaliza: aceita ID puro ("12345678") ou canonical slug ("2025-06-20-...-12345678")
  const eventId = routeParam ? extractZenBitEventId(routeParam) : undefined;

  return useQuery({
    // queryKey usa routeParam original para diferenciar entradas de cache distintas
    queryKey: QUERY_KEYS.events.detail(routeParam || ''),
    queryFn: async (): Promise<ZenBitEventDetail | null> => {
      if (!eventId) return null;
      try {
        const apiUrl = buildApiUrl(`zen-bit/v2/events/${eventId}`);
        const res = await fetch(apiUrl);
        if (!res.ok) {
          console.error(`Event Detail API ${res.status}`);
          return null;
        }
        const data = await res.json();
        return (data?.event as ZenBitEventDetail) || null;
      } catch (err) {
        console.error('Zen BIT Event detail fetch failed:', err);
        return null;
      }
    },
    enabled: !!eventId,
    // Detalhe tem TTL maior (24h no backend)
    staleTime: 24 * 60 * 60 * 1000,
    ...options
  });
};

// ============================================================================
// PRODUCTS QUERY (PÚBLICO)
// ============================================================================

export const useShopPageQuery = (lang?: string) => {
  return useQuery<ShopPageViewModel>({
    queryKey: ['shop_page', lang],
    queryFn: async (): Promise<ShopPageViewModel> => {
      const apiUrl = buildApiUrl('djzeneyer/v1/shop/page', { lang: lang || 'en' });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch shop page view-model');
      return res.json();
    },
    staleTime: STALE_TIME.PRODUCTS,
  });
};

export const useProductsQuery = (lang?: string, filters: Record<string, string> = {}) => {

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
      const nonce = window.wpData?.nonce ?? '';

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
      const nonce = window.wpData?.nonce ?? '';

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
    // Usa boolean do token na queryKey — evita colocar JWT longo no cache
    queryKey: [...QUERY_KEYS.user.gamipress(userId || 0), !!token],
    queryFn: async (): Promise<ZenGameUserData | null> => {
      const apiUrl = buildApiUrl('zengame/v1/me');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const nonce = window.wpData?.nonce;
      if (nonce) headers['X-WP-Nonce'] = nonce;

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
      const apiUrl = buildApiUrl('zengame/v1/leaderboard', { limit: String(limit) });
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
  return useQuery<UserProfile | null>({
    queryKey: ['user', 'profile', !!token],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!token) return null;
      const apiUrl = buildApiUrl('zeneyer-auth/v1/profile');
      const res = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      return data.success ? (data.data as UserProfile) : null;
    },
    enabled: !!token,
    staleTime: STALE_TIME.USER_PROFILE,
  });
};

export const useUpdateProfileMutation = (token?: string) => {
  return useMutation({
    mutationFn: async (profileData: ProfileUpdatePayload) => {
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
  return useQuery<boolean | null>({
    queryKey: ['user', 'newsletter', !!token],
    queryFn: async (): Promise<boolean | null> => {
      if (!token) return null;
      const apiUrl = buildApiUrl('zeneyer-auth/v1/newsletter');
      const res = await fetch(apiUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch newsletter status');
      const data = await res.json();
      return data.success ? (data.subscribed as boolean) : false;
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
