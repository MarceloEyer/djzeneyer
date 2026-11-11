import { describe, it, expect } from 'vitest';
import { extractRegions, filterEventsByRegion, filterEventsByTemporalMode, groupEventsByMonth, isEventUpcoming } from '../../utils/events';
import type { ZenBitEventListItem } from '../../types/events';

const e = (id: string, region?: string, starts_at?: string): ZenBitEventListItem =>
  ({
    event_id: id,
    title: id,
    starts_at: starts_at ?? '',
    location: { venue: 'V', city: 'C', country: 'BR', region },
  } as unknown as ZenBitEventListItem);

// ── extractRegions ─────────────────────────────────────────────────────────────

describe('extractRegions', () => {
  it('returns empty array for empty input', () => {
    expect(extractRegions([])).toEqual([]);
  });

  it('returns unique regions sorted alphabetically', () => {
    const events = [e('1', 'SP'), e('2', 'RJ'), e('3', 'SP'), e('4', 'MG')];
    expect(extractRegions(events)).toEqual(['MG', 'RJ', 'SP']);
  });

  it('skips events without a region', () => {
    const events = [e('1', undefined), e('2', 'SP'), e('3', undefined)];
    expect(extractRegions(events)).toEqual(['SP']);
  });

  it('does not mutate the input', () => {
    const events = [e('1', 'RJ'), e('2', 'SP')];
    const copy = [...events];
    extractRegions(events);
    expect(events).toEqual(copy);
  });
});

// ── filterEventsByRegion ───────────────────────────────────────────────────────

describe('filterEventsByRegion', () => {
  const events = [e('1', 'SP'), e('2', 'RJ'), e('3', 'SP')];

  it("returns all events when region is 'all'", () => {
    expect(filterEventsByRegion(events, 'all')).toHaveLength(3);
  });

  it('filters to matching region only', () => {
    const result = filterEventsByRegion(events, 'SP');
    expect(result.map((x) => x.event_id)).toEqual(['1', '3']);
  });

  it('returns empty array when no events match', () => {
    expect(filterEventsByRegion(events, 'MG')).toHaveLength(0);
  });

  it("returns the same reference for 'all' (no copy)", () => {
    expect(filterEventsByRegion(events, 'all')).toBe(events);
  });
});

// ── groupEventsByMonth ─────────────────────────────────────────────────────────

describe('filterEventsByTemporalMode', () => {
  const now = new Date('2026-06-22T12:00:00-03:00');

  it('treats previous local dates as past', () => {
    expect(isEventUpcoming(e('past', undefined, '2026-06-21T23:59:00-03:00'), now)).toBe(false);
  });

  it('keeps current local date as upcoming', () => {
    expect(isEventUpcoming(e('today', undefined, '2026-06-22T00:01:00-03:00'), now)).toBe(true);
  });

  it('filters upcoming mode to today and future dates', () => {
    const events = [
      e('past', undefined, '2026-06-21T20:00:00-03:00'),
      e('today', undefined, '2026-06-22T20:00:00-03:00'),
      e('future', undefined, '2026-06-23T20:00:00-03:00'),
    ];
    expect(filterEventsByTemporalMode(events, 'upcoming', now).map((event) => event.event_id)).toEqual(['today', 'future']);
  });

  it('filters past mode to previous dates', () => {
    const events = [
      e('past', undefined, '2026-06-21T20:00:00-03:00'),
      e('today', undefined, '2026-06-22T20:00:00-03:00'),
    ];
    expect(filterEventsByTemporalMode(events, 'past', now).map((event) => event.event_id)).toEqual(['past']);
  });

  it('returns the same reference for all mode', () => {
    const events = [e('past', undefined, '2026-06-21T20:00:00-03:00')];
    expect(filterEventsByTemporalMode(events, 'all', now)).toBe(events);
  });
});

describe('groupEventsByMonth', () => {
  it('returns empty array for empty input', () => {
    expect(groupEventsByMonth([])).toEqual([]);
  });

  it('groups events by YYYY-MM key', () => {
    const events = [
      e('1', undefined, '2025-07-10T20:00:00'),
      e('2', undefined, '2025-07-25T20:00:00'),
      e('3', undefined, '2025-08-05T20:00:00'),
    ];
    const result = groupEventsByMonth(events);
    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe('2025-07');
    expect(result[1][0]).toBe('2025-08');
  });

  it('sorts months ascending (nearest first)', () => {
    const events = [
      e('a', undefined, '2025-12-01'),
      e('b', undefined, '2025-07-01'),
      e('c', undefined, '2025-09-01'),
    ];
    const keys = groupEventsByMonth(events).map(([k]) => k);
    expect(keys).toEqual(['2025-07', '2025-09', '2025-12']);
  });

  it('drops events with starts_at shorter than 7 chars', () => {
    const events = [e('short', undefined, '2025-0'), e('ok', undefined, '2025-07-01')];
    const result = groupEventsByMonth(events);
    expect(result).toHaveLength(1);
    expect(result[0][1]).toHaveLength(1);
    expect(result[0][1][0].event_id).toBe('ok');
  });

  it('drops events with empty starts_at', () => {
    const events = [e('no-date'), e('ok', undefined, '2025-07-01')];
    const result = groupEventsByMonth(events);
    expect(result).toHaveLength(1);
  });

  it('preserves order of events within same month', () => {
    const events = [
      e('first', undefined, '2025-07-10'),
      e('second', undefined, '2025-07-25'),
    ];
    const result = groupEventsByMonth(events);
    expect(result[0][1].map((x) => x.event_id)).toEqual(['first', 'second']);
  });
});
