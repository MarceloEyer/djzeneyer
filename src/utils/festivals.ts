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
  const upcoming = [...festivals]
    .filter((f) => f.date && new Date(f.date) >= today)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const past = [...festivals]
    .filter((f) => !f.date || new Date(f.date) < today)
    .sort((a, b) => {
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return { upcoming, past };
}
