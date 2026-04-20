// src/utils/number.ts

// Module-level cache to store instantiated Intl.NumberFormat objects
const numberFormatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Returns a cached instance of Intl.NumberFormat or creates a new one if it doesn't exist.
 * Instantiating Intl.NumberFormat is computationally expensive, so caching them
 * prevents unnecessary CPU overhead during frequent React re-renders.
 */
export const getNumberFormatter = (locale: string): Intl.NumberFormat => {
  if (!numberFormatterCache.has(locale)) {
    numberFormatterCache.set(locale, new Intl.NumberFormat(locale));
  }

  return numberFormatterCache.get(locale)!;
};
