import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent, trackGenerateLead, trackSelectContent, trackShare } from '../../lib/analytics';
import { logger } from '../../lib/logger';

vi.mock('../../lib/logger', () => ({
  logger: {
    warn: vi.fn(),
  },
}));

describe('Analytics Library', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.gtag = undefined;
    window.dataLayer = undefined;
  });

  afterEach(() => {
    delete window.gtag;
    delete window.dataLayer;
  });

  describe('trackEvent', () => {
    it('does nothing if window is undefined', () => {
      const originalWindow = global.window;
      // @ts-expect-error Mocking window
      delete global.window;
      
      expect(() => trackEvent('test_event')).not.toThrow();
      
      global.window = originalWindow;
    });

    it('calls gtag if available', () => {
      window.gtag = vi.fn();
      trackEvent('test_event', { prop: 'value', num: 1, bool: true, obj: {} as Record<string, unknown> });
      
      expect(window.gtag).toHaveBeenCalledWith('event', 'test_event', {
        prop: 'value',
        num: 1,
        bool: true
        // complex objects are sanitized out
      });
    });

    it('pushes to dataLayer if gtag is not available', () => {
      window.dataLayer = [];
      trackEvent('test_event', { prop: 'value' });
      
      expect(window.dataLayer).toEqual([
        { event: 'test_event', prop: 'value' }
      ]);
    });

    it('logs warning if tracking throws an error', () => {
      window.gtag = () => { throw new Error('gtag error'); };
      
      trackEvent('error_event');
      
      expect(logger.warn).toHaveBeenCalledWith(
        'ANALYTICS_EVENT_FAILED',
        'Failed to send analytics event',
        expect.objectContaining({
          eventName: 'error_event',
          error: 'Error: gtag error'
        })
      );
    });
  });

  describe('trackGenerateLead', () => {
    it('tracks generate_lead event', () => {
      window.dataLayer = [];
      trackGenerateLead('newsletter', { extra: 'data' });
      
      expect(window.dataLayer).toContainEqual({
        event: 'generate_lead',
        method: 'newsletter',
        extra: 'data'
      });
    });
  });

  describe('trackSelectContent', () => {
    it('tracks select_content event', () => {
      window.dataLayer = [];
      trackSelectContent('article', '123', { category: 'music' });
      
      expect(window.dataLayer).toContainEqual({
        event: 'select_content',
        content_type: 'article',
        item_id: '123',
        category: 'music'
      });
    });
  });

  describe('trackShare', () => {
    it('tracks share event', () => {
      window.dataLayer = [];
      trackShare('post', '456', { method: 'twitter' });
      
      expect(window.dataLayer).toContainEqual({
        event: 'share',
        content_type: 'post',
        item_id: '456',
        method: 'twitter'
      });
    });
  });
});
