// src/hooks/useQueries.ts
// v5.0 - Query Hub Aligned with Headless Facade Architecture

/**
 * Central de React Query hooks
 * - Queries públicas (cache longo, sem auth)
 * - Queries privadas reais (Woo Cart)
 * - Queries de dashboard via API façade (sem nonce)
 */

import { useQuery } from '@tanstack/react-query';
import { buildApiUrl } from '../config/api';
import { QUERY_KEYS, STALE_TIME } from '../config/queryClient';

// ============================================================================
// TYPES
// ============================================================================

interface MenuItem {
  ID: number;
  title: string;
  url: string;
  target: string;
}

interface BandsintownEvent {
  id: string;
  title: string;
  datetime: string;
  description?: string;
  image?: string;
  venue: {
    name: string;
    city: string;
    region: string;
    country: string;
  };
  url: string;
  offers?: Array<{ url: string }>;
}

interface EventsResponse {
  success: boolean;
  events: BandsintownEvent[];
}

interface MusicTrack {
  id: number;
  title: { rendered: string };
  category_name: string;
  tag_names: string[];
  links: {
    download: string;
    soundcloud: string;
    youtube: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
}

// ============================================================================
// MENU QUERY (PÚBLICO)
// ============================================================================

export const useMenuQuery = (lang: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.menu.list(lang),
    queryFn: async (): Promise<MenuItem[]> => {
      const apiUrl = buildApiUrl('djzeneyer/v1/menu', { lang });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch menu');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: STALE_TIME.MENU,
    retry: 1,
  });
};

// ============================================================================
// EVENTS QUERY (PÚBLICO)
// ============================================================================

export const useEventsQuery = (limit = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(limit),
    queryFn: async (): Promise<BandsintownEvent[]> => {
      const apiUrl = buildApiUrl('zen-bit/v1/events', { limit: String(limit) });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data: EventsResponse = await res.json();
      return data.success && Array.isArray(data.events) ? data.events : [];
    },
    staleTime: STALE_TIME.EVENTS,
    retry: 2,
  });
};

// ============================================================================
// TRACKS QUERY (PÚBLICO)
// ============================================================================

export const useTracksQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tracks.list(),
    queryFn: async (): Promise<MusicTrack[]> => {
      const apiUrl = buildApiUrl('wp/v2/remixes', {
        _embed: 'true',
        per_page: '100',
      });
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch tracks');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: STALE_TIME.TRACKS,
    gcTime: 15 * 60 * 1000,
  });
};

// ============================================================================
// PRODUCTS QUERY (PÚBLICO)
// ============================================================================

export const useProductsQuery = (lang?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(lang),
    queryFn: async () => {
      const params: Record<string, string> = { per_page: '100' };
      if (lang) params.lang = lang;
      const apiUrl = buildApiUrl('djzeneyer/v1/products', params);
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
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

// ============================================================================
// USER GAMIPRESS QUERY (DASHBOARD - API FACADE, SEM AUTH)
// ============================================================================

export const useGamipressQuery = (userId?: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.user.gamipress(userId!),
    queryFn: async () => {
      if (!userId) return null;
      const apiUrl = buildApiUrl(`djzeneyer/v1/gamipress/${userId}`);
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error('Failed to fetch gamipress');
      return res.json();
    },
    staleTime: STALE_TIME.GAMIPRESS,
    enabled: Boolean(userId),
  });
};
