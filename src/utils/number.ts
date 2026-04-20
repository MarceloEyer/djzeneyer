// src/utils/number.ts

// Module-level cache to store instantiated Intl.NumberFormat objects for general numbers
const numberFormatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Returns a cached instance of Intl.NumberFormat or creates a new one if it doesn't exist.
 * Instantiating Intl.NumberFormat is computationally expensive, so caching them
 * prevents unnecessary CPU overhead during frequent React re-renders.
 */
export const getNumberFormatter = (locale: string, options: Intl.NumberFormatOptions = {}): Intl.NumberFormat => {
  const cacheKey = `${locale}-${JSON.stringify(options)}`;

  if (!numberFormatterCache.has(cacheKey)) {
    numberFormatterCache.set(cacheKey, new Intl.NumberFormat(locale, options));
  }

  return numberFormatterCache.get(cacheKey)!;
};
