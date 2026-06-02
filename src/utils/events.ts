import type { ZenBitEventListItem } from '../types/events';

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
