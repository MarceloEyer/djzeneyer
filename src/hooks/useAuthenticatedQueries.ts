// src/hooks/useAuthenticatedQueries.ts
// Authenticated queries — require JWT token or WP nonce. Short-to-medium TTLs.

import { useQuery } from '@tanstack/react-query';

/** Extracts a stable user ID from a ZenEyer JWT without verifying the signature.
 *  ZenEyer tokens store the user ID at `data.user_id` (not the standard `sub`).
 *  Falls back to `sub` for forward-compatibility. Base64URL → Base64 conversion
 *  handles the `-` / `_` characters that would cause atob() to throw.
 *  Used only as a React Query cache-key discriminator — never for auth decisions. */
const jwtSub = (token: string | undefined): string => {
  if (!token) return '';
  try {
    const parts = token.split('.');
    if (parts.length < 3) return 'unknown';
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return String(payload?.data?.user_id ?? payload?.sub ?? 'unknown');
  } catch {
    return 'unknown';
  }
};
import { z } from 'zod';
import { buildApiUrl, getAuthHeaders } from '../config/api';
import { QUERY_KEYS, STALE_TIME } from '../config/queryClient';
import type { ZenGameUserData } from '../types/gamification';
import { ZenGameUserDataSchema } from '../schemas';
import { logger } from '../lib/logger';

// ----------------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------------

export interface ProfileUpdatePayload {
  display_name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
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
  real_name?: string;
  preferred_name?: string;
  facebook_url?: string;
  instagram_url?: string;
  dance_role?: string[];
  gender?: '' | 'male' | 'female' | 'non-binary';
}

export interface AuthSessionResponse {
  authenticated: boolean;
  user: UserProfile | null;
  roles?: string[];
  exp?: number;
  message?: string;
  code?: string;
}

export interface WCOrder {
  id: number;
  status: string;
  date_created: string;
  total: string;
  line_items: Array<{ name: string; quantity: number; total: string }>;
}

// ----------------------------------------------------------------------------
// SCHEMAS
// ----------------------------------------------------------------------------

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

const AuthSessionResponseSchema = z.object({
  authenticated: z.boolean(),
  user: UserProfileSchema.nullable().catch(null),
  roles: z.array(z.string()).optional(),
  exp: z.number().optional(),
  message: z.string().optional(),
  code: z.string().optional(),
}).catchall(z.unknown());

// ----------------------------------------------------------------------------
// FETCH FUNCTIONS (exportadas para prefetch/SSG)
// ----------------------------------------------------------------------------

export const fetchAuthSessionFn = async (token: string): Promise<AuthSessionResponse> => {
  const apiUrl = buildApiUrl('zeneyer-auth/v1/session');
  const res = await fetch(apiUrl, { headers: getAuthHeaders(token) });
  const text = await res.text();
  if (!res.ok || text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
    throw new Error('Invalid session response');
  }
  return AuthSessionResponseSchema.parse(JSON.parse(text));
};

// ----------------------------------------------------------------------------
// HOOKS
// ----------------------------------------------------------------------------

export const useCartQuery = () =>
  useQuery({
    queryKey: QUERY_KEYS.cart.current,
    queryFn: async () => {
      const apiUrl = buildApiUrl('wc/store/v1/cart');
      const nonce = window.wpData?.nonce ?? '';
      const res = await fetch(apiUrl, {
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch cart');
      return res.json();
    },
    staleTime: STALE_TIME.CART,
    refetchOnWindowFocus: true,
  });

export const useGamipressQuery = (userId?: number, token?: string) =>
  useQuery({
    queryKey: QUERY_KEYS.user.gamipress(userId || 0),
    queryFn: async (): Promise<ZenGameUserData | null> => {
      const apiUrl = buildApiUrl('zengame/v1/me');
      const headers: HeadersInit = getAuthHeaders(token);
      const res = await fetch(apiUrl, { headers });

      const text = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch (e) {
        const hint = text.slice(0, 120).replace(/\s+/g, ' ');
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
        logger.debug('GAMIPRESS_SYNC', 'User data synced', {
          mainPointsSlug: d.main_points_slug,
          pointKeys: Object.keys(d.points as object),
        });
      }

      return ZenGameUserDataSchema.parse(data);
    },
    staleTime: STALE_TIME.GAMIPRESS,
    refetchInterval: 60_000,
    enabled: Boolean(token),
    retry: 1,
  });

export const useZenGameUserData = (token?: string) => useGamipressQuery(undefined, token);

export const useProfileQuery = (token?: string, options: { enabled?: boolean } = {}) =>
  useQuery<UserProfile | null>({
    queryKey: [...QUERY_KEYS.user.profile(), jwtSub(token)],
    queryFn: async (): Promise<UserProfile | null> => {
      if (!token) return null;
      const apiUrl = buildApiUrl('zeneyer-auth/v1/profile');
      const res = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch profile');
      const json = await res.json();
      if (!json.success) return null;
      const parsed = UserProfileSchema.safeParse(json.data);
      if (!parsed.success) {
        logger.error('PROFILE_SCHEMA_MISMATCH', 'User profile schema validation failed', {
          issues: parsed.error.issues,
        });
        return null;
      }
      return parsed.data as UserProfile;
    },
    enabled: Boolean(token) && (options.enabled ?? true),
    staleTime: STALE_TIME.USER_PROFILE,
  });

export const useUserOrdersQuery = (
  userId?: number,
  token?: string,
  limit = 5,
  options: { enabled?: boolean } = {}
) =>
  useQuery<WCOrder[]>({
    queryKey: [...QUERY_KEYS.user.orders(userId, limit), jwtSub(token)],
    queryFn: async (): Promise<WCOrder[]> => {
      if (!token || !userId) return [];
      const apiUrl = buildApiUrl('zeneyer-auth/v1/orders', { limit: String(limit) });
      const res = await fetch(apiUrl, { headers: getAuthHeaders(token) });
      if (!res.ok) throw new Error('Failed to fetch user orders');
      const data = await res.json();
      if (data?.success && Array.isArray(data.data)) return data.data as WCOrder[];
      return [];
    },
    enabled: Boolean(token && userId) && (options.enabled ?? true),
    staleTime: STALE_TIME.USER_PROFILE,
    retry: false,
  });

interface CheckoutData {
  payment_methods: Array<{ id: string; title: string; description: string }>;
  billing_address: {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export const useCheckoutQuery = () =>
  useQuery<CheckoutData | null>({
    queryKey: QUERY_KEYS.checkout.current,
    queryFn: async (): Promise<CheckoutData | null> => {
      const apiUrl = buildApiUrl('wc/store/v1/checkout');
      const res = await fetch(apiUrl, {
        headers: getAuthHeaders() as HeadersInit,
        credentials: 'include',
      });
      if (!res.ok) return null;
      return res.json() as Promise<CheckoutData>;
    },
    staleTime: 60 * 1000,
  });

export const useNewsletterStatusQuery = (token?: string, options: { enabled?: boolean } = {}) =>
  useQuery<boolean | null>({
    queryKey: [...QUERY_KEYS.user.newsletter(), jwtSub(token)],
    queryFn: async (): Promise<boolean | null> => {
      if (!token) return null;
      const apiUrl = buildApiUrl('zeneyer-auth/v1/newsletter');
      const res = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to fetch newsletter status');
      const data = await res.json();
      return data?.success ? (data.subscribed as boolean) : false;
    },
    enabled: Boolean(token) && (options.enabled ?? true),
    staleTime: STALE_TIME.USER_PROFILE,
  });
