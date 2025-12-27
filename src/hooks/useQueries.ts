// src/hooks/useQueries.ts
// v4.0 - FIX: Added X-WP-Nonce for Cart and Gamipress Auth

/**
 * Custom React Query Hooks
 * * Hooks otimizados com cache automático para todas as APIs do projeto.
 * Substitui fetches manuais por queries com cache inteligente.
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
// MENU QUERY (Público)
// ============================================================================

export const useMenuQuery = (lang: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.menu.list(lang),
    queryFn: async (): Promise<MenuItem[]> => {
      const apiUrl = buildApiUrl('djzeneyer/v1/menu', { lang });
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: STALE_TIME.MENU,
    retry: 1,
  });
};

// ============================================================================
// EVENTS QUERY (Público)
// ============================================================================

export const useEventsQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.events.list(limit),
    queryFn: async (): Promise<BandsintownEvent[]> => {
      const apiUrl = buildApiUrl('zen-bit/v1/events', { limit: limit.toString() });
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`API Status: ${response.status}`);
      }
      
      const data: EventsResponse = await response.json();
      
      if (data.success && Array.isArray(data.events)) {
        return data.events;
      }
      
      return [];
    },
    staleTime: STALE_TIME.EVENTS,
    retry: 2,
  });
};

// ============================================================================
// TRACKS/MUSIC QUERY (Público)
// ============================================================================

export const useTracksQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tracks.list(),
    queryFn: async (): Promise<MusicTrack[]> => {
      const apiUrl = buildApiUrl('wp/v2/remixes', { 
        _embed: 'true', 
        per_page: '100' 
      });
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch tracks');
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: STALE_TIME.TRACKS,
    gcTime: 15 * 60 * 1000,
  });
};

// ============================================================================
// PRODUCTS QUERY (Público)
// ============================================================================

export const useProductsQuery = (lang?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.products.list(lang),
    queryFn: async () => {
      const params: Record<string, string> = { per_page: '100' };
      if (lang) params.lang = lang;
      
      const apiUrl = buildApiUrl('djzeneyer/v1/products', params);
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      return response.json();
    },
    staleTime: STALE_TIME.PRODUCTS,
  });
};

// ============================================================================
// CART QUERY (Privado - Requer Auth/Nonce)
// ============================================================================

export const useCartQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.cart.current,
    queryFn: async () => {
      const apiUrl = buildApiUrl('wc/store/v1/cart');
      
      // Pega o Nonce
      const nonce = (window as any).wpData?.nonce || '';

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce // <--- VACINA APLICADA
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      return response.json();
    },
    staleTime: STALE_TIME.CART,
    refetchOnWindowFocus: true,
  });
};

// ============================================================================
// USER GAMIPRESS QUERY (Privado - Requer Auth/Nonce)
// ============================================================================

export const useGamipressQuery = (userId: number | undefined) => {
  return useQuery({
    queryKey: QUERY_KEYS.user.gamipress(userId!),
    queryFn: async () => {
      const apiUrl = buildApiUrl(`djzeneyer/v1/gamipress/${userId}`);
      
      // Pega o Nonce
      const nonce = (window as any).wpData?.nonce || '';

      const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': nonce // <--- VACINA APLICADA
          },
          credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch gamipress data');
      }
      
      return response.json();
    },
    staleTime: STALE_TIME.GAMIPRESS,
    enabled: !!userId,
    refetchOnWindowFocus: true,
  });
};