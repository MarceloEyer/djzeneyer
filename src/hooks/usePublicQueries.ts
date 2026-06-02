// src/hooks/usePublicQueries.ts
// Public queries — no auth required, long cache TTLs.

import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';
import { generatePath } from 'react-router-dom';
import { z } from 'zod';
import { buildApiUrl } from '../config/api';
import { QUERY_KEYS, STALE_TIME } from '../config/queryClient';
import { getLocalizedRoute, type Language } from '../config/routes';
import type { ZenGameLeaderboard } from '../types/gamification';
import {
  ZenGameLeaderboardSchema,
  EventsApiResponseSchema,
  ZenBitEventListItemSchema,
  EventDetailApiResponseSchema,
} from '../schemas';
import type { ZenBitEventListItem, ZenBitEventDetail, FetchEventsParams } from '../types/events';
import { ProductImage, ProductCategory } from '../types/product';
import { logger } from '../lib/logger';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

export interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

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

export interface WPPost {
  id: number;
  date: string;
  modified?: string;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content?: { rendered: string };
  categories?: number[];
  tags?: number[];
  featured_image_src?: string | null;
  featured_image_src_full?: string | null;
  author_name?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    author?: Array<{ name: string }>;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
  taxonomy: 'category' | 'post_tag';
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

export interface NewsFilters {
  category?: string;
  tag?: string;
  search?: string;
}

// ----------------------------------------------------------------------------
// PRERENDER DATA HELPERS
// ----------------------------------------------------------------------------

declare global {
  interface Window {
    __PRERENDER_DATA__?: {
      events?: { en?: ZenBitEventListItem[]; pt?: ZenBitEventListItem[] };
      menu?: { en?: MenuItem[]; pt?: MenuItem[] };
      news?: { en?: WPPost[]; pt?: WPPost[] };
      eventsLimit?: number;
      eventsMode?: FetchEventsParams['mode'];
      eventsDays?: number;
      fetchedAt?: string;
    };
  }
}

const getPrerenderPayload = (): Window['__PRERENDER_DATA__'] | undefined =>
  typeof window === 'undefined' ? undefined : window.__PRERENDER_DATA__;

const getPrerenderData = <T>(
  lang: string | undefined,
  field: keyof NonNullable<Window['__PRERENDER_DATA__']>
): T | null => {
  const data = getPrerenderPayload();
  if (!data || !data[field]) return null;
  const bucket = data[field];
  if (Array.isArray(bucket)) return bucket as T;
  const keyedBucket = bucket as Record<string, T>;
  if (lang?.toLowerCase().startsWith('pt')) return (keyedBucket.pt || keyedBucket.en || null) as T;
  return (keyedBucket.en || keyedBucket.pt || null) as T;
};

const getPrerenderUpdatedAt = (): number => {
  const fetchedAt = getPrerenderPayload()?.fetchedAt;
  if (!fetchedAt) return 0;
  const timestamp = Date.parse(fetchedAt);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const getPrerenderEvents = (lang?: string) => getPrerenderData<ZenBitEventListItem[]>(lang, 'events');
const getPrerenderMenu = (lang?: string) => getPrerenderData<MenuItem[]>(lang, 'menu');
const getPrerenderNews = (lang?: string) => getPrerenderData<WPPost[]>(lang, 'news');

const withProcessedEvents = (events: ZenBitEventListItem[], lang?: string): ZenBitEventListItem[] => {
  const eventsDetailRoute = getLocalizedRoute('events-detail', (lang || 'en') as Language);
  return events
    .map(event => {
      const eventDate = new Date(event.starts_at);
      if (!Number.isFinite(eventDate.getTime())) return null;
      const identifier = event.canonical_path
        ? event.canonical_path.split('/').pop() || event.event_id
        : event.event_id;
      return {
        ...event,
        _processed: {
          eventDate,
          day: eventDate.getDate(),
          detailHref: generatePath(eventsDetailRoute, { id: identifier }),
        },
      };
    })
    .filter((event): event is ZenBitEventListItem => event !== null);
};

const getPrerenderEventsForParams = ({
  mode,
  days,
  date,
  limit = 10,
  lang,
  upcomingOnly,
}: FetchEventsParams = {}): ZenBitEventListItem[] | undefined => {
  const payload = getPrerenderPayload();
  const prerenderEvents = getPrerenderEvents(lang);
  const requestedMode = mode ?? (upcomingOnly === false ? 'all' : 'upcoming');
  const requestedDays = date === undefined ? (days ?? 365) : undefined;
  const canUsePrerenderEvents =
    requestedMode === payload?.eventsMode &&
    date === undefined &&
    requestedDays === payload?.eventsDays &&
    payload?.eventsLimit !== undefined &&
    limit <= payload.eventsLimit;

  if (!canUsePrerenderEvents || !prerenderEvents || prerenderEvents.length === 0) return undefined;
  return withProcessedEvents(prerenderEvents.slice(0, limit), lang);
};

// ----------------------------------------------------------------------------
// FETCH FUNCTIONS (exportadas para prefetch/SSG)
// ----------------------------------------------------------------------------

export const fetchMenuFn = async (lang: string): Promise<MenuItem[]> => {
  const apiUrl = buildApiUrl('djzeneyer/v1/menu', { lang });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch menu');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('Menu API returned unexpected format');
  return data;
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
  try {
    const params: Record<string, string> = {};
    if (limit) params.limit = String(limit);
    if (mode) params.mode = String(mode);
    if (days !== undefined) params.days = String(days);
    if (date) params.date = String(date);
    if (lang) params.lang = String(lang);
    if (upcomingOnly !== undefined && !mode) params.mode = upcomingOnly ? 'upcoming' : 'all';

    const apiUrl = buildApiUrl('zen-bit/v2/events', params);
    const res = await fetch(apiUrl);
    if (!res.ok) {
      logger.error('EVENTS_API_ERROR', `Events API responded with ${res.status}`, { status: res.status });
      throw new Error(`Events API responded with ${res.status}`);
    }
    const rawData = await res.json();

    let events: ZenBitEventListItem[];
    if (Array.isArray(rawData)) {
      events = z.array(ZenBitEventListItemSchema).parse(rawData);
    } else if (rawData && typeof rawData === 'object' && 'events' in rawData) {
      events = EventsApiResponseSchema.parse(rawData).events;
    } else {
      throw new Error('Events API returned unexpected format');
    }

    return withProcessedEvents(events, lang);
  } catch (err) {
    logger.error('EVENTS_FETCH_FAILED', 'Failed to fetch events', { error: String(err) });
    throw err;
  }
};

export const fetchNewsFn = async (lang?: string, filters: NewsFilters = {}): Promise<WPPost[]> => {
  const apiUrl = buildApiUrl('wp/v2/posts', {
    per_page: '10',
    ...(lang ? { lang } : {}),
    ...(filters.category ? { categories: filters.category } : {}),
    ...(filters.tag ? { tags: filters.tag } : {}),
    ...(filters.search ? { search: filters.search } : {}),
    _fields: 'id,date,slug,title,excerpt,categories,tags,featured_image_src,featured_image_src_full,author_name',
  });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error('Failed to fetch news posts');
  const data = await res.json();
  if (!Array.isArray(data)) throw new Error('News API returned unexpected format');
  return data;
};

const fetchWpTermsFn = async (taxonomy: 'categories' | 'tags', lang?: string): Promise<WPTerm[]> => {
  const apiUrl = buildApiUrl(`wp/v2/${taxonomy}`, {
    per_page: '100',
    hide_empty: 'true',
    orderby: 'count',
    order: 'desc',
    ...(lang ? { lang } : {}),
    _fields: 'id,name,slug,count,taxonomy',
  });
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${taxonomy}`);
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

export const fetchProductFn = async (lang?: string, slug?: string): Promise<WCProductDetail | null> => {
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

// ----------------------------------------------------------------------------
// HOOKS
// ----------------------------------------------------------------------------

export const useMenuQuery = (lang: string) =>
  useQuery({
    queryKey: QUERY_KEYS.menu.list(lang),
    queryFn: () => fetchMenuFn(lang),
    initialData: () => { const d = getPrerenderMenu(lang); return d !== null && d.length > 0 ? d : undefined; },
    initialDataUpdatedAt: getPrerenderUpdatedAt,
    staleTime: STALE_TIME.MENU,
    retry: 1,
  });

export const useZenSeoSettings = () =>
  useQuery({
    queryKey: ['zen-seo', 'settings'],
    queryFn: async (): Promise<ZenGlobalSettings> => {
      const apiUrl = buildApiUrl('zen-seo/v1/settings');
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch Zen SEO settings');
      const response = await res.json();
      return response.success ? response.data : {};
    },
    staleTime: STALE_TIME.POSTS,
  });

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
    initialData: () => getPrerenderEventsForParams(normalizedParams),
    initialDataUpdatedAt: getPrerenderUpdatedAt,
    staleTime: STALE_TIME.EVENTS,
    retry: 2,
    ...options,
  });
};

export const useNewsQuery = (
  lang?: string,
  options: { enabled?: boolean; filters?: NewsFilters } = {}
) => {
  const filters = options.filters || {};
  const hasFilters = Boolean(filters.category || filters.tag || filters.search);
  return useQuery({
    queryKey: QUERY_KEYS.posts.list(lang, filters),
    queryFn: () => fetchNewsFn(lang, filters),
    initialData: () => { if (hasFilters) return undefined; const d = getPrerenderNews(lang); return d !== null && d.length > 0 ? d : undefined; },
    initialDataUpdatedAt: getPrerenderUpdatedAt,
    staleTime: STALE_TIME.POSTS,
    enabled: options.enabled,
  });
};

export const useNewsTaxonomiesQuery = (lang?: string, options: { enabled?: boolean } = {}) =>
  useQuery({
    queryKey: QUERY_KEYS.posts.taxonomies(lang),
    queryFn: async () => {
      const [categories, tags] = await Promise.all([
        fetchWpTermsFn('categories', lang),
        fetchWpTermsFn('tags', lang),
      ]);
      return { categories, tags };
    },
    staleTime: STALE_TIME.EVENTS,
    enabled: options.enabled,
  });

export const useNewsBySlug = (slug?: string, lang?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.posts.detail(slug || ''), lang],
    queryFn: async (): Promise<WPPost | null> => {
      if (!slug) return null;
      const apiUrl = buildApiUrl('wp/v2/posts', {
        slug,
        ...(lang ? { lang } : {}),
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

export function extractZenBitEventId(routeParam: string): string {
  if (!routeParam) return routeParam;
  if (!routeParam.includes('-')) return routeParam;
  return routeParam.split('-').pop() ?? routeParam;
}

export const useEventById = (
  routeParam?: string,
  lang?: Language,
  options?: Partial<UseQueryOptions<ZenBitEventDetail | null>>
) => {
  const eventId = routeParam ? extractZenBitEventId(routeParam) : undefined;
  return useQuery({
    queryKey: [...QUERY_KEYS.events.detail(routeParam || ''), lang],
    queryFn: async (): Promise<ZenBitEventDetail | null> => {
      if (!eventId) return null;
      try {
        const queryParams: Record<string, string> = {};
        if (lang) queryParams.lang = String(lang);
        const apiUrl = buildApiUrl(`zen-bit/v2/events/${String(eventId)}`, queryParams);
        const res = await fetch(apiUrl);
        if (!res.ok) {
          logger.error('EVENT_DETAIL_API_ERROR', `Event detail API responded with ${res.status}`, {
            eventId,
            status: res.status,
          });
          return null;
        }
        const json = await res.json();
        const parsed = EventDetailApiResponseSchema.safeParse(json);
        if (!parsed.success) {
          logger.error('EVENT_DETAIL_SCHEMA_MISMATCH', 'Event detail schema validation failed', {
            issues: parsed.error.issues,
          });
          return null;
        }
        return parsed.data.event;
      } catch (err) {
        logger.error('EVENT_DETAIL_FETCH_FAILED', 'Failed to fetch event detail', { error: String(err) });
        return null;
      }
    },
    enabled: !!eventId,
    staleTime: STALE_TIME.EVENTS,
    ...options,
  });
};

export const useShopPageQuery = (lang?: string) =>
  useQuery<ShopPageViewModel>({
    queryKey: QUERY_KEYS.shop.page(lang),
    queryFn: async (): Promise<ShopPageViewModel> => {
      const apiUrl = buildApiUrl('djzeneyer/v1/shop/page', { lang: lang || 'en' });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch shop page view-model');
      return res.json();
    },
    staleTime: STALE_TIME.PRODUCTS,
  });

export const useProductsQuery = (lang?: string, filters: Record<string, string> = {}) =>
  useQuery({
    queryKey: [...QUERY_KEYS.products.list(lang), filters],
    queryFn: () => fetchProductsFn(lang, filters),
    staleTime: STALE_TIME.PRODUCTS,
  });

export const useProductQuery = (lang?: string, slug?: string) =>
  useQuery({
    queryKey: [...QUERY_KEYS.products.detail(slug || ''), lang],
    queryFn: () => fetchProductFn(lang, slug),
    staleTime: STALE_TIME.PRODUCTS,
    enabled: Boolean(slug),
  });

export const useProductCollectionsQuery = (lang?: string, limit = 10) =>
  useQuery({
    queryKey: QUERY_KEYS.products.collections(lang, limit),
    queryFn: () => fetchProductCollectionsFn(lang, limit),
    staleTime: STALE_TIME.PRODUCTS,
  });

export const useLeaderboardQuery = (limit = 10) =>
  useQuery({
    queryKey: QUERY_KEYS.user.leaderboard(limit),
    queryFn: async (): Promise<ZenGameLeaderboard> => {
      const apiUrl = buildApiUrl('zengame/v1/leaderboard', { limit: String(limit) });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`Leaderboard API Error: ${res.status}`);
      const data = await res.json();
      return ZenGameLeaderboardSchema.parse(data);
    },
    staleTime: STALE_TIME.GAMIPRESS,
  });

export const useZenGameLeaderboard = (limit = 10) => useLeaderboardQuery(limit);

export const useTrackBySlug = (slug?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.tracks.detail(slug ?? ''),
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
