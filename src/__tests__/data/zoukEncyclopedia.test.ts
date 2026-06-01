import { describe, expect, it } from 'vitest';
import encyclopediaTermSlugs from '../../config/encyclopedia-term-slugs.json';
import {
  findEncyclopediaTermBySlug,
  toEncyclopediaTermSlug,
  ZOUK_ENCYCLOPEDIA,
} from '../../data/zoukEncyclopedia';

describe('zouk encyclopedia detail routes', () => {
  it('keeps sitemap and prerender slugs aligned with the public term catalog', () => {
    const catalogSlugs = ZOUK_ENCYCLOPEDIA.map((term) => toEncyclopediaTermSlug(term.key));

    expect(encyclopediaTermSlugs.terms).toEqual(catalogSlugs);
    expect(new Set(catalogSlugs).size).toBe(catalogSlugs.length);
  });

  it.each(['cambre', 'boneca', 'chicote'])('exposes the priority movement term %s', (slug) => {
    expect(findEncyclopediaTermBySlug(slug)?.key).toBe(slug);
  });

  it('resolves camel-case keys as stable kebab-case URLs', () => {
    expect(toEncyclopediaTermSlug('brazilianZoukVsLambada')).toBe('brazilian-zouk-vs-lambada');
    expect(findEncyclopediaTermBySlug('body-wave')?.key).toBe('bodyWave');
  });
});
