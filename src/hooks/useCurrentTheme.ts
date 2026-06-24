import { useEffect, useState } from 'react';
import { isSiteTheme, THEME_STORAGE_KEY, resolveSiteTheme, type SiteTheme } from '../utils/theme';

const readCurrentTheme = (): SiteTheme => {
  if (typeof window === 'undefined') {
    return resolveSiteTheme('', null);
  }

  let storedTheme: string | null;
  try {
    storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    storedTheme = null;
  }

  return resolveSiteTheme(window.location.search, storedTheme);
};

export const useCurrentTheme = (): SiteTheme => {
  const [theme, setTheme] = useState<SiteTheme>(readCurrentTheme);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return undefined;
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName !== 'data-theme') return;

        const newTheme = document.documentElement.getAttribute('data-theme');
        if (isSiteTheme(newTheme)) {
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  return theme;
};
