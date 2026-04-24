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
import { z } from 'zod';
import { buildApiUrl, getAuthHeaders } from '../config/api';
import { QUERY_KEYS, STALE_TIME, invalidateQueries } from '../config/queryClient';
import { type Language } from '../config/routes';
import type { ZenGameUserData, ZenGameLeaderboard } from '../types/gamification';
import { ZenGameUserDataSchema, ZenGameLeaderboardSchema, EventsApiResponseSchema, ZenBitEventListItemSchema, EventDetailApiResponseSchema } from '../schemas';


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
  // Custom fields from ZenEyer Auth
  real_name?: string;
  preferred_name?: string;
  facebook_url?: string;
  instagram_url?: string;
  dance_role?: string[];
  gender?: '' | 'male' | 'female' | 'non-binary';
}

export interface UserProfile {
  id: number;
  email: string;
  display_name: string;
  first_name?: string;
  last_name?: string;
  /** PHP retorna 'avatar' (get_avatar_url) — nunca 'avatar_url' */
  avatar?: string;
  // Campos customizados do plugin ZenEyer Auth
  real_name?: string;
  preferred_name?: string;
  facebook_url?: string;
  instagram_url?: string;
  dance_role?: string[];
  gender?: '' | 'male' | 'female' | 'non-binary';
}

const UserProfileSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  display_name: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  avatar: z.string().catch(''),
  real_name: z.string().optional(),
  preferred_name: z.string().optional(),
  facebook_url: z.string().optional(),
  instagram_url: z.string().optional(),
  dance_role: z.array(z.string()).optional(),
  gender: z.enum(['', 'male', 'female', 'non-binary']).optional(),
}).catchall(z.unknown());

export interface WCOrder {
  id: number;
  status: string;
  date_created: string;
  total: string;
  line_items: Array<{
    name: string;
    quantity: number;
    total: string;
  }>;
}

import { ProductImage, ProductCategory } from '../types/product';

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price?: string;
  on_sale?: boolean;
  type: string;
  status: string;
  short_description: string;
  images: ProductImage[];
  categories: ProductCategory[];
  stock_status: 'instock' | 'outofstock' | string;
  purchasable: boolean;
  permalink: string;
  lang?: string;
}

export interface WCProductDetail extends WCProduct {
  description?: string;
}

export interface ShopPageViewModel {
  products: WCProduct[];
  featured?: WCProduct[];
  new_releases?: WCProduct[];
  best_sellers?: WCProduct[];
  curated?: WCProduct[];
  collections?: Array<{ id: number; name: string; products: WCProduct[] }>;
}

import type {
  ZenBitEventListItem,
  ZenBitEventDetail,
  FetchEventsParams,

} from '../types/events';

export interface WPPost {
  id: number;
  date: string;
  modified?: string;
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

export interface ArtistProfile {
  identity: {
    stageName: string;
    shortName: string;
    fullName: string;
    birthDate: string;
    cnpj: string;
    city: string;
    state: string;
    country: string;
    whatsapp?: string;
  };
  philosophy: {
    slogan: string;
    style: string;
    styleDefinition: string;
  };
  social: Record<string, { url: string; handle: string }>;
  payment: {
    paypal: { me: string };
    wise: { url: string };
    pix: { key: string };
    inter: {
      iban: string;
      swift: string;
      bankName: string;
    };
  };
  stats: {
    startingYear: number;
    countriesPlayed: number;
    lastUpdated?: string;
  };
  identifiers: {
    isni: string;
    musicbrainz: string;
    wikidata: string;
  };
  site: {
    baseUrl: string;
    defaultDescription: string;
    pages: Record<string, string>;
  };
  awards: string[];
  festivals?: unknown[];
}

export interface ZenGlobalSettings {
  real_name?: string;
  default_og_image?: string;
  [key: string]: unknown;
}

// ============================================================================
// EXPORTED FETCH FUNCTIONS (PREFETCH READY)
// ============================================================================

declare global {
  interface Window {
    __PRERENDER_DATA__?: {
      events?: {
        en?: ZenBitEventListItem[];
        pt?: ZenBitEventListItem[];
      };
      menu?: {
        en?: MenuItem[];
        pt?: MenuItem[];
      };
      news?: {
        en?: WPPost[];
        pt?: WPPost[];
      };
      fetchedAt?: string;
    };
  }
}

const getPrerenderData = <T>(
  lang: string | undefined,
  field: keyof NonNullable<Window['__PRERENDER_DATA__']>
): T | null => {
  const data = window.__PRERENDER_DATA__;
  if (!data || !data[field]) return null;
  
  const bucket = data[field];
  // For data that is not language-specific
  if (Array.isArray(bucket)) return bucket as T;
  
  const keyedBucket = bucket as Record<string, T>;
  if (lang?.toLowerCase().startsWith('pt')) return (keyedBucket.pt || keyedBucket.en || null) as T;
  return (keyedBucket.en || keyedBucket.pt || null) as T;
};

const getPrerenderEvents = (lang?: string) => getPrerenderData<ZenBitEventListItem[]>(lang, 'events');
const getPrerenderMenu = (lang?: string) => getPrerenderData<MenuItem[]>(lang, 'menu');
const getPrerenderNews = (lang?: string) => getPrerenderData<WPPost[]>(lang, 'news');
export const fetchMenuFn = async (lang: string): Promise<MenuItem[]> => {
  const prerenderMenu = getPrerenderMenu(lang);
  if (prerenderMenu && prerenderMenu.length > 0) return prerenderMenu;

  const apiUrl = buildApiUrl('djzeneyer/v1/menu', { lang });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch menu');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

export const fetchArtistProfileFn = async (): Promise<ArtistProfile> => {
  const apiUrl = buildApiUrl('zen-seo/v1/profile');
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch artist profile');
  const json = await res.json();
  return json.data;
};

export const fetchEventsFn = async ({
  mode,
  days,
  date,
  limit = 10,
  lang,
  upcomingOnly,
}: FetchEventsParams = {}): Promise<ZenBitEventListItem[]> => {
  const prerenderEvents = getPrerenderEvents(lang);
  if (prerenderEvents && prerenderEvents.length > 0) {
    return prerenderEvents.slice(0, limit);
  }

  try {
    const params: Record<string, string> = {};
    if (limit) params.limit = String(limit);
    if (mode) params.mode = String(mode);
    if (days !== undefined) params.days = String(days);
    if (date) params.date = String(date);
    if (lang) params.lang = String(lang);
    
    // Fallback deprecated property mapping
    if (upcomingOnly !== undefined && !mode) {
      params.mode = upcomingOnly ? 'upcoming' : 'all';
    }

    const apiUrl = buildApiUrl('zen-bit/v2/events', params);
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error(`Events API Error: ${res.status}`);
      return [];
    }
    const rawData = await res.json();

    if (Array.isArray(rawData)) {
      return z.array(ZenBitEventListItemSchema).parse(rawData);
    }

    if (rawData && typeof rawData === 'object' && 'events' in rawData) {
       const parsedResponse = EventsApiResponseSchema.parse(rawData);
       return parsedResponse.events;
    }

    return [];
  } catch (err) {
    console.error('Fetch Events failed:', err);
    return [];
  }
};

export const fetchNewsFn = async (lang?: string): Promise<WPPost[]> => {
  const prerenderNews = getPrerenderNews(lang);
  if (prerenderNews && prerenderNews.length > 0) return prerenderNews;

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

export const fetchProductFn = async (
  lang?: string,
  slug?: string
): Promise<WCProductDetail | null> => {
  if (!slug) return null;

  const params: Record<string, string> = { slug };
  if (lang) params.lang = lang;

  const apiUrl = buildApiUrl('djzeneyer/v1/products', params);
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch product');

  const data = await res.json();
  return Array.isArray(data) ? (data[0] as WCProductDetail | undefined) ?? null : null;
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
// SEO SETTINGS QUERY (PÚBLICO)
// ============================================================================

export const useZenSeoSettings = () => {
  return useQuery({
    queryKey: ['zen-seo', 'settings'],
    queryFn: async (): Promise<ZenGlobalSettings> => {
      const apiUrl = buildApiUrl('zen-seo/v1/settings');
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch Zen SEO settings');
      const response = await res.json();
      return response.success ? response.data : {};
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (metadata changes rarely)
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
        _fields: 'id,date,modified,slug,title,content,excerpt,featured_image_src,featured_image_src_full,author_name',
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
  lang?: Language,
  options?: Partial<UseQueryOptions<ZenBitEventDetail | null>>
) => {
  // Normaliza: aceita ID puro ("12345678") ou canonical slug ("2025-06-20-...-12345678")
  const eventId = routeParam ? extractZenBitEventId(routeParam) : undefined;

  return useQuery({
    // queryKey usa routeParam original para diferenciar entradas de cache distintas
    queryKey: [...QUERY_KEYS.events.detail(routeParam || ''), lang],
    queryFn: async (): Promise<ZenBitEventDetail | null> => {
      const id = eventId; 
      if (!id) return null;
      try {
        const idStr = String(id);
        const queryParams: Record<string, string> = {};
        if (lang) queryParams.lang = String(lang);
        const apiUrl = buildApiUrl(`zen-bit/v2/events/${idStr}`, queryParams);
        const res = await fetch(apiUrl);
        if (!res.ok) {
          console.error(`Event Detail API ${res.status}`);
          return null;
        }
        const json = await res.json();
        const parsed = EventDetailApiResponseSchema.safeParse(json);
        if (!parsed.success) {
          console.error('[useEventById] Schema mismatch:', parsed.error.issues);
          return null;
        }
        return parsed.data.event;
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

export const useProductQuery = (lang?: string, slug?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.products.detail(slug || ''), lang],
    queryFn: () => fetchProductFn(lang, slug),
    staleTime: STALE_TIME.PRODUCTS,
    enabled: Boolean(slug),
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
      const headers: HeadersInit = getAuthHeaders(token);

      const res = await fetch(apiUrl, { headers });

      // Tenta parsear o JSON. Se falhar (ex: WP_DEBUG emite HTML antes do JSON),
      // lança erro explícito em vez de deixar `data` undefined e quebrar o Zod parse.
      let data: unknown;
      try {
        data = await res.json();
      } catch (e) {
        const bodyPreview = await res.text().catch(() => '');
        const hint = bodyPreview.slice(0, 120).replace(/\s+/g, ' ');
        throw new Error(
          `[GamiPress] Resposta não é JSON válido (HTTP ${res.status}). Verifique WP_DEBUG no wp-config.php. Preview: ${hint}`,
          { cause: e }
        );
      }

      if (!res.ok) {
        const err = data as Record<string, unknown>;
        const errorMsg = (err?.message as string) || (err?.code as string) || `HTTP ${res.status} — ${res.statusText}`;
        throw new Error(errorMsg);
      }

      if (import.meta.env.DEV && (data as Record<string, unknown>)?.points) {
        const d = data as Record<string, unknown>;
        console.groupCollapsed('[GamiPress] User Data Sync');
        console.info('Main Slug:', d.main_points_slug);
        console.info('Point Keys Found:', Object.keys(d.points as object));
        console.groupEnd();
      }

      return ZenGameUserDataSchema.parse(data);
    },
    staleTime: STALE_TIME.GAMIPRESS,
    // refetchInterval só executa quando não há erro — retry: 1 permite recuperar de falhas transitórias
    refetchInterval: 60_000,
    enabled: Boolean(token),
    retry: 1,
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
      const data = await res.json();
      return ZenGameLeaderboardSchema.parse(data);
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
      const json = await res.json();
      if (!json.success) return null;
      const parsed = UserProfileSchema.safeParse(json.data);
      if (!parsed.success) {
        console.error('[useProfileQuery] Schema mismatch:', parsed.error.issues);
        return null;
      }
      return parsed.data as UserProfile;
    },
    enabled: !!token,
    staleTime: STALE_TIME.USER_PROFILE,
  });
};


export const useUserOrdersQuery = (userId?: number, token?: string, limit = 5) => {
  return useQuery<WCOrder[]>({
    queryKey: [...QUERY_KEYS.user.orders(userId, limit), !!token],
    queryFn: async (): Promise<WCOrder[]> => {
      if (!token || !userId) return [];
      const apiUrl = buildApiUrl('zeneyer-auth/v1/orders', {
        limit: String(limit),
      });
      const res = await fetch(apiUrl, {
        headers: getAuthHeaders(token),
      });
      if (!res.ok) throw new Error('Failed to fetch user orders');
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) {
        return data.data as WCOrder[];
      }
      return [];
    },
    enabled: Boolean(token && userId),
    staleTime: STALE_TIME.USER_PROFILE,
    retry: false,
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



