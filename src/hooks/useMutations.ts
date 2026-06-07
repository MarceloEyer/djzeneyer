// src/hooks/useMutations.ts
// All write operations — cart, profile, newsletter, subscription, interaction tracking.

import { useMutation } from '@tanstack/react-query';
import { buildApiUrl, getAuthHeaders } from '../config/api';
import { invalidateQueries } from '../config/queryClient';
import type { ProfileUpdatePayload } from './useAuthenticatedQueries';

export const useAddToCartMutation = () =>
  useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number; quantity: number }) => {
      const apiUrl = buildApiUrl('wc/store/v1/cart/add-item');
      const nonce = window.wpData?.nonce ?? '';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
        credentials: 'include',
        body: JSON.stringify({ id: productId, quantity }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || 'Failed to add item to cart');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidateQueries.cart();
    },
  });

export const useUpdateProfileMutation = (token?: string) =>
  useMutation({
    mutationFn: async (profileData: ProfileUpdatePayload) => {
      if (!token) throw new Error('No token provided');
      const apiUrl = buildApiUrl('zeneyer-auth/v1/profile');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || 'Update failed');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidateQueries.user();
    },
  });

export const useUpdateNewsletterMutation = (token?: string) =>
  useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!token) throw new Error('No token provided');
      const apiUrl = buildApiUrl('zeneyer-auth/v1/newsletter');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || 'Update failed');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidateQueries.user();
    },
  });

export const useSubscriptionMutation = () =>
  useMutation({
    mutationFn: async (email: string) => {
      const apiUrl = buildApiUrl('djzeneyer/v1/subscribe');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || 'Subscription failed');
      return data;
    },
  });

export const useRemoveCartItemMutation = () =>
  useMutation({
    mutationFn: async (key: string) => {
      const apiUrl = buildApiUrl(`wc/store/v1/cart/items/${key}`);
      const nonce = window.wpData?.nonce ?? '';
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || 'Failed to remove item');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidateQueries.cart();
    },
  });

export const useClearCartMutation = () =>
  useMutation({
    mutationFn: async () => {
      const apiUrl = buildApiUrl('wc/store/v1/cart/items');
      const nonce = window.wpData?.nonce ?? '';
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce },
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { message?: string }).message || 'Failed to clear cart');
      }
      return res.json();
    },
    onSuccess: () => {
      invalidateQueries.cart();
    },
  });

interface CheckoutPayload {
  billing_address: Record<string, string>;
  shipping_address: Record<string, string>;
  payment_method: string;
}

export const useSubmitOrderMutation = () =>
  useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      const apiUrl = buildApiUrl('wc/store/v1/checkout');
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: getAuthHeaders() as HeadersInit,
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message || 'Checkout failed');
      return data as { payment_result?: { redirect_url?: string } };
    },
    onSuccess: () => {
      invalidateQueries.cart();
    },
  });

export const useTrackInteraction = (token?: string) =>
  useMutation({
    mutationFn: async ({ action, objectId }: { action: string; objectId?: number }) => {
      const apiUrl = buildApiUrl('zengame/v1/track');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({ action, object_id: objectId }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Tracking failed');
      }
      return res.json();
    },
  });
