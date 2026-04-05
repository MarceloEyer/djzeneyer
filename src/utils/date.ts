// src/utils/date.ts

// Module-level cache to store instantiated Intl.DateTimeFormat objects
const dateTimeFormatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Returns a cached instance of Intl.DateTimeFormat or creates a new one if it doesn't exist.
 * Instantiating Intl.DateTimeFormat is computationally expensive, so caching them
 * prevents unnecessary CPU overhead during frequent React re-renders or map loops.
 */
export const getDateTimeFormatter = (
  locale: string,
  options?: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat => {
  // Serialize options to create a unique cache key
  const optionsKey = options ? JSON.stringify(options) : 'default';
  const cacheKey = `${locale}-${optionsKey}`;

  if (!dateTimeFormatterCache.has(cacheKey)) {
    dateTimeFormatterCache.set(cacheKey, new Intl.DateTimeFormat(locale, options));
  }

  return dateTimeFormatterCache.get(cacheKey)!;
};
