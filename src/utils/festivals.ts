import type { Festival } from '../types';

export interface CategorizedFestivals {
  upcoming: Festival[];
  past: Festival[];
}

/**
 * Categorizes festivals into upcoming (date >= today, ascending) and
 * past (date < today or no date, descending). "today" is midnight-normalized
 * so a festival happening today is still upcoming.
 */
export function categorizeFestivals(festivals: Festival[], today: Date): CategorizedFestivals {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const dateKey = (date?: string) => date?.slice(0, 10) || '';

  // ⚡ Bolt: Use string comparison for YYYY-MM-DD dates to avoid O(N) Date allocations
  const upcoming = [...festivals]
    .filter((f) => f.date && dateKey(f.date) >= todayStr)
    .sort((a, b) => dateKey(a.date).localeCompare(dateKey(b.date)));

  const past = [...festivals]
    .filter((f) => !f.date || dateKey(f.date) < todayStr)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return dateKey(b.date).localeCompare(dateKey(a.date));
    });

  return { upcoming, past };
}
