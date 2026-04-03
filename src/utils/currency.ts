// src/utils/currency.ts

// Module-level cache to store instantiated Intl.NumberFormat objects
const formatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Returns a cached instance of Intl.NumberFormat or creates a new one if it doesn't exist.
 * Instantiating Intl.NumberFormat is computationally expensive, so caching them
 * prevents unnecessary CPU overhead during frequent React re-renders.
 */
export const getCurrencyFormatter = (locale: string, currency: string = 'BRL', isPoints: boolean = false): Intl.NumberFormat => {
  const cacheKey = `${locale}-${currency}-${isPoints}`;

  if (!formatterCache.has(cacheKey)) {
    const options: Intl.NumberFormatOptions = isPoints
      ? {} // For points, just format the number according to locale
      : { style: 'currency', currency };

    formatterCache.set(cacheKey, new Intl.NumberFormat(locale, options));
  }

  return formatterCache.get(cacheKey)!;
};

/**
 * Convenience utility to format a raw price string/number using the cached formatter.
 */
export const formatPriceVal = (price: string | number, locale: string, currency: string = 'BRL'): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return locale.startsWith('pt') ? 'R$ 0,00' : '$ 0.00';
  }

  return getCurrencyFormatter(locale, currency).format(numPrice);
};
