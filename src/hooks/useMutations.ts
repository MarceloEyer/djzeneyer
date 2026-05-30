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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add item to cart');
      return data;
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      return data;
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      return data;
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
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Subscription failed');
      return data;
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
