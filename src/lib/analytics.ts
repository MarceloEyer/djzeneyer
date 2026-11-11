// Lightweight analytics helpers for public conversion events.
// This file intentionally has no runtime dependency: GA4/GTM can consume window.gtag
// when configured, and local/dev environments safely no-op.

import { logger } from './logger';

type AnalyticsValue = string | number | boolean | undefined | null;

export type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const sanitizeParams = (params: AnalyticsParams = {}): Record<string, string | number | boolean> => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value))
  ) as Record<string, string | number | boolean>;
};

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (typeof window === 'undefined') return;

  const eventParams = sanitizeParams(params);

  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, eventParams);
      return;
    }

    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: eventName, ...eventParams });
    }
  } catch (error) {
    logger.warn('ANALYTICS_EVENT_FAILED', 'Failed to send analytics event', {
      eventName,
      error: String(error),
    });
  }
};

export const trackGenerateLead = (method: string, params: AnalyticsParams = {}) => {
  trackEvent('generate_lead', {
    method,
    ...params,
  });
};

export const trackSelectContent = (contentType: string, itemId: string, params: AnalyticsParams = {}) => {
  trackEvent('select_content', {
    content_type: contentType,
    item_id: itemId,
    ...params,
  });
};

export const trackShare = (contentType: string, itemId: string, params: AnalyticsParams = {}) => {
  trackEvent('share', {
    content_type: contentType,
    item_id: itemId,
    ...params,
  });
};
