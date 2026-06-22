import { describe, expect, it } from 'vitest';
import { applySiteTheme, resolveSiteTheme } from '../../utils/theme';

describe('theme utilities', () => {
  it('keeps zen-night as the default theme', () => {
    expect(resolveSiteTheme('', null)).toBe('zen-night');
  });

  it('resolves mediterranean-dusk from query string before stored theme', () => {
    expect(resolveSiteTheme('?theme=mediterranean-dusk', 'zen-night')).toBe('mediterranean-dusk');
  });

  it('falls back to a valid stored theme when the query string is absent', () => {
    expect(resolveSiteTheme('', 'mediterranean-dusk')).toBe('mediterranean-dusk');
  });

  it('ignores unknown theme values', () => {
    expect(resolveSiteTheme('?theme=solarized', 'unknown')).toBe('zen-night');
  });

  it('applies the data-theme attribute and color scheme', () => {
    const root = document.createElement('html');

    applySiteTheme('mediterranean-dusk', root);

    expect(root.dataset.theme).toBe('mediterranean-dusk');
    expect(root.style.colorScheme).toBe('light');
  });
});
