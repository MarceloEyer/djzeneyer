export const THEME_STORAGE_KEY = 'zen_theme';

export const SITE_THEMES = ['zen-night', 'mediterranean-dusk'] as const;

export type SiteTheme = (typeof SITE_THEMES)[number];

const DEFAULT_THEME: SiteTheme = 'mediterranean-dusk';

export const isSiteTheme = (value: string | null | undefined): value is SiteTheme =>
  SITE_THEMES.includes(value as SiteTheme);

export const resolveSiteTheme = (search: string, storedTheme?: string | null): SiteTheme => {
  const params = new URLSearchParams(search);
  const requestedTheme = params.get('theme');

  if (isSiteTheme(requestedTheme)) return requestedTheme;
  if (isSiteTheme(storedTheme)) return storedTheme;

  return DEFAULT_THEME;
};

export const applySiteTheme = (theme: SiteTheme, root: HTMLElement = document.documentElement): void => {
  root.dataset.theme = theme;
  root.style.colorScheme = theme === 'mediterranean-dusk' ? 'light' : 'dark';
};

export const initSiteTheme = (): SiteTheme => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return DEFAULT_THEME;
  }

  const requestedTheme = new URLSearchParams(window.location.search).get('theme');
  let storedTheme: string | null;
  try {
    storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    storedTheme = null;
  }

  const theme = resolveSiteTheme(window.location.search, storedTheme);

  if (isSiteTheme(requestedTheme)) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage can be blocked; the data-theme attribute still applies for this page load.
    }
  }

  applySiteTheme(theme);
  return theme;
};
