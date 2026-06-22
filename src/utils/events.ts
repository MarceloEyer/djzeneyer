import type { ZenBitEventListItem } from '../types/events';
import { stripHtml } from './text';

export type EventTemporalMode = 'upcoming' | 'past' | 'all';

/**
 * Extracts a plain-text title from a WordPress-style title field.
 * Handles both raw strings and `{ rendered: string }` objects, then strips HTML.
 */
export function getPlainTitle(title: unknown): string {
  if (typeof title === 'string') {
    return stripHtml(title);
  }
  if (typeof title === 'object' && title !== null && 'rendered' in title) {
    const rendered = (title as { rendered?: unknown }).rendered;
    if (typeof rendered === 'string') {
      return stripHtml(rendered);
    }
  }
  return '';
}

/**
 * Returns unique region names from the event list, sorted alphabetically.
 * Events without a region are silently skipped.
 */
export function extractRegions(events: ZenBitEventListItem[]): string[] {
  const seen = new Set<string>();
  for (const e of events) {
    if (e.location?.region) seen.add(e.location.region);
  }
  return Array.from(seen).sort();
}

/**
 * Filters events by region. Passing 'all' returns the full list unchanged.
 */
export function filterEventsByRegion(
  events: ZenBitEventListItem[],
  region: string,
): ZenBitEventListItem[] {
  if (region === 'all') return events;
  return events.filter((e) => e.location?.region === region);
}

const getStartOfLocalDay = (now: Date | number = Date.now()): number => {
  const current = typeof now === 'number' ? new Date(now) : now;
  return new Date(current.getFullYear(), current.getMonth(), current.getDate()).getTime();
};

const parseEventTime = (value?: string): number | null => {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export function isEventUpcoming(
  event: Pick<ZenBitEventListItem, 'starts_at'> & { ends_at?: string },
  now: Date | number = Date.now(),
): boolean {
  const comparableTime = parseEventTime(event.ends_at) ?? parseEventTime(event.starts_at);
  if (comparableTime === null) return true;
  return comparableTime >= getStartOfLocalDay(now);
}

export function filterEventsByTemporalMode<T extends Pick<ZenBitEventListItem, 'starts_at'> & { ends_at?: string }>(
  events: T[],
  mode: EventTemporalMode = 'upcoming',
  now: Date | number = Date.now(),
): T[] {
  if (mode === 'all') return events;
  return events.filter((event) => {
    const upcoming = isEventUpcoming(event, now);
    return mode === 'upcoming' ? upcoming : !upcoming;
  });
}

/**
 * Groups events by YYYY-MM key derived from `starts_at`, sorted ascending.
 * Events without a valid `starts_at` (< 7 chars) are dropped.
 */
export function groupEventsByMonth(
  events: ZenBitEventListItem[],
): [string, ZenBitEventListItem[]][] {
  const groups: Record<string, ZenBitEventListItem[]> = {};
  for (const e of events) {
    if (!e.starts_at || e.starts_at.length < 7) continue;
    const key = e.starts_at.substring(0, 7);
    (groups[key] ??= []).push(e);
  }
  return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
}
