// src/utils/date.ts

// Module-level cache to store instantiated Intl.DateTimeFormat objects
const formatterCache = new Map<string, Intl.DateTimeFormat>();

/**
 * Returns a cached instance of Intl.DateTimeFormat or creates a new one if it doesn't exist.
 * Instantiating Intl.DateTimeFormat (or calling toLocaleDateString) is computationally expensive.
 * Caching them prevents unnecessary CPU overhead during frequent React re-renders or iterations.
 */
export const getDateTimeFormatter = (locale: string, options: Intl.DateTimeFormatOptions = {}): Intl.DateTimeFormat => {
  // We stringify the options object for the cache key
  const cacheKey = `${locale}-${JSON.stringify(options)}`;

  if (!formatterCache.has(cacheKey)) {
    formatterCache.set(cacheKey, new Intl.DateTimeFormat(locale, options));
  }

  return formatterCache.get(cacheKey)!;
};

/**
 * Convenience utility to format a date string or Date object using the cached formatter.
 */
export const formatDateVal = (dateValue: string | Date, locale: string, options: Intl.DateTimeFormatOptions = {}): string => {
  try {
    const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

    if (isNaN(date.getTime())) {
      return typeof dateValue === 'string' ? dateValue : '';
    }

    return getDateTimeFormatter(locale, options).format(date);
  } catch (error) {
    console.error('[date] Error formatting date:', error, dateValue);
    return typeof dateValue === 'string' ? dateValue : '';
  }
};
