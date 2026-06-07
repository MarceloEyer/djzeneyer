import { describe, expect, it } from 'vitest';
import encyclopediaTermSlugs from '../../config/encyclopedia-term-slugs.json';
import enEncyclopedia from '../../locales/en/encyclopedia.json';
import ptEncyclopedia from '../../locales/pt/encyclopedia.json';
import {
  findEncyclopediaTermBySlug,
  toEncyclopediaTermSlug,
  ZOUK_ENCYCLOPEDIA,
} from '../../data/zoukEncyclopedia';

type EncyclopediaMessages = {
  terms: Record<string, { term?: string; short?: string; body?: string }>;
  sources: Record<string, string>;
};

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

  it.each([
    ['EN', enEncyclopedia as EncyclopediaMessages],
    ['PT', ptEncyclopedia as EncyclopediaMessages],
  ])('has complete %s translation content for every public term and source', (_lang, messages) => {
    for (const entry of ZOUK_ENCYCLOPEDIA) {
      const term = messages.terms[entry.key];

      expect(term?.term, `${entry.key}.term`).toBeTruthy();
      expect(term?.short, `${entry.key}.short`).toBeTruthy();
      expect(term?.body, `${entry.key}.body`).toBeTruthy();

      for (const source of entry.sources ?? []) {
        expect(messages.sources[source.labelKey], `sources.${source.labelKey}`).toBeTruthy();
      }
    }
  });
});
