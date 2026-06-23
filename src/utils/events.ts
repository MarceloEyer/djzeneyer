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

export const getLocalISODate = (now: Date | number = Date.now()): string => {
  const current = typeof now === 'number' ? new Date(now) : now;
  const offsetMs = current.getTimezoneOffset() * 60 * 1000;
  const localDate = new Date(current.getTime() - offsetMs);
  return localDate.toISOString().split('T')[0];
};

export function isEventUpcoming(
  event: Pick<ZenBitEventListItem, 'starts_at'> & { ends_at?: string; event_date?: string; start_date?: string },
  now: Date | number = Date.now(),
): boolean {
  // Use ends_at if available, else starts_at, else fallbacks (for schema)
  const comparableString = event.ends_at ?? event.starts_at ?? (event as any).event_date ?? (event as any).start_date;
  if (!comparableString) return true; // Safety fallback
  
  const dateOnly = comparableString.split('T')[0];
  return dateOnly >= getLocalISODate(now);
}

export function filterEventsByTemporalMode<T extends Pick<ZenBitEventListItem, 'starts_at'> & { ends_at?: string; event_date?: string; start_date?: string }>(
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
