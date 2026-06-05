/**
 * Contract test: validates that the mock fixtures used in MSW handlers conform
 * to the same Zod schemas that the production code uses to parse the API.
 *
 * This runs without network access. It answers: "if production returns this
 * shape, would the frontend parse it correctly?"
 *
 * The complementary smoke test (scripts/test-contracts.ts) checks the live
 * endpoint — it runs in CI with continue-on-error so it never blocks deploys
 * but surfaces drift between production and the expected schema.
 */

import { describe, it, expect } from 'vitest';
import {
  EventsApiResponseSchema,
  EventDetailApiResponseSchema,
  ZenBitEventListItemSchema,
} from '../../schemas/events';
import {
  mockRawEvent,
  mockEventsEnvelope,
} from '../../test/mocks/fixtures';

describe('Events API contract', () => {
  it('mockEventsEnvelope matches EventsApiResponseSchema', () => {
    const result = EventsApiResponseSchema.safeParse(mockEventsEnvelope);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.format())).toBe(true);
  });

  it('mockRawEvent matches ZenBitEventListItemSchema', () => {
    const result = ZenBitEventListItemSchema.safeParse(mockRawEvent);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.format())).toBe(true);
  });

  it('event detail envelope matches EventDetailApiResponseSchema', () => {
    const detailEnvelope = { success: true, event: mockRawEvent };
    const result = EventDetailApiResponseSchema.safeParse(detailEnvelope);
    expect(result.success, result.success ? '' : JSON.stringify(result.error.format())).toBe(true);
  });

  it('rejects envelope missing required fields', () => {
    const broken = { success: true, events: [] }; // missing count and mode
    const result = EventsApiResponseSchema.safeParse(broken);
    expect(result.success).toBe(false);
  });

  it('rejects event missing canonical_url', () => {
    const { canonical_url: _canonicalUrl, ...withoutUrl } = mockRawEvent;
    const result = ZenBitEventListItemSchema.safeParse(withoutUrl);
    expect(result.success).toBe(false);
  });
});
