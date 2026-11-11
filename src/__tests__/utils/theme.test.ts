import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { applySiteTheme, initSiteTheme, resolveSiteTheme, SITE_THEMES, THEME_CONFIGS } from '../../utils/theme';

const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(window, 'localStorage');
const themesCss = readFileSync(resolve(process.cwd(), 'src/styles/themes.css'), 'utf8');
const requiredThemeTokens = [
  '--color-primary:',
  '--color-secondary:',
  '--color-accent:',
  '--color-background:',
  '--color-surface:',
  '--color-surface-elevated:',
  '--color-text:',
  '--color-border:',
  '--theme-page-background:',
  '--theme-color-scheme:',
];

const getThemeCssBlock = (theme: string): string => {
  if (theme === 'mediterranean-dusk') {
    const zenNightBlockStart = themesCss.indexOf(":root[data-theme='zen-night']");
    if (zenNightBlockStart === -1) return '';
    return themesCss.slice(0, zenNightBlockStart);
  }

  const blockStart = themesCss.indexOf(`:root[data-theme='${theme}']`);
  if (blockStart === -1) return '';

  const nextBlockStart = themesCss.indexOf(':root[data-theme=', blockStart + 1);
  return nextBlockStart === -1 ? themesCss.slice(blockStart) : themesCss.slice(blockStart, nextBlockStart);
};

afterEach(() => {
  if (originalLocalStorageDescriptor) {
    Object.defineProperty(window, 'localStorage', originalLocalStorageDescriptor);
  }
  window.history.replaceState({}, '', '/');
  delete document.documentElement.dataset.theme;
  document.documentElement.style.colorScheme = '';
});

describe('theme utilities', () => {
  it('keeps the theme list derived from the theme registry', () => {
    expect(SITE_THEMES).toEqual(Object.keys(THEME_CONFIGS));
  });

  it('defines required CSS tokens for every registered theme', () => {
    for (const theme of SITE_THEMES) {
      const themeCssBlock = getThemeCssBlock(theme);

      expect(themeCssBlock, `${theme} CSS block`).toBeTruthy();
      for (const token of requiredThemeTokens) {
        expect(themeCssBlock, `${theme} ${token}`).toContain(token);
      }
    }
  });

  it('keeps mediterranean-dusk as the default theme', () => {
    expect(resolveSiteTheme('', null)).toBe('mediterranean-dusk');
  });

  it('resolves mediterranean-dusk from query string before stored theme', () => {
    expect(resolveSiteTheme('?theme=mediterranean-dusk', 'zen-night')).toBe('mediterranean-dusk');
  });

  it('falls back to a valid stored theme when the query string is absent', () => {
    expect(resolveSiteTheme('', 'mediterranean-dusk')).toBe('mediterranean-dusk');
  });

  it('ignores unknown theme values', () => {
    expect(resolveSiteTheme('?theme=solarized', 'unknown')).toBe('mediterranean-dusk');
  });

  it('applies the data-theme attribute and color scheme', () => {
    const root = document.createElement('html');

    applySiteTheme('mediterranean-dusk', root);

    expect(root.dataset.theme).toBe('mediterranean-dusk');
    expect(root.style.colorScheme).toBe('light');
  });

  it('applies dark color scheme from theme config', () => {
    const root = document.createElement('html');

    applySiteTheme('zen-night', root);

    expect(root.dataset.theme).toBe('zen-night');
    expect(root.style.colorScheme).toBe('dark');
  });

  it('continues bootstrapping when localStorage access is blocked', () => {
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: () => {
          throw new DOMException('Blocked', 'SecurityError');
        },
        setItem: () => {
          throw new DOMException('Blocked', 'SecurityError');
        },
      },
    });
    window.history.replaceState({}, '', '/?theme=mediterranean-dusk');

    expect(initSiteTheme()).toBe('mediterranean-dusk');
    expect(document.documentElement.dataset.theme).toBe('mediterranean-dusk');
  });
});
