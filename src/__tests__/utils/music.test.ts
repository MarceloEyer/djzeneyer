import { describe, it, expect } from 'vitest';
import { buildReleaseCards, buildDiscographyListItems } from '../../utils/music';
import type { Release } from '../../data/artist.schema';

const BASE_URL = 'https://www.djzeneyer.com';

const makeRelease = (overrides: Partial<Release> = {}): Release => ({
  id: 'test-id',
  name: 'Test Release',
  type: 'single',
  image: `${BASE_URL}/images/test.png`,
  tracks: [{ name: 'Test Track', duration: 'PT3M30S' }],
  ...overrides,
});

const opts = {
  baseUrl: BASE_URL,
  getNewsDetailPath: (slug: string) => `/news/${slug}`,
  lang: 'en',
  artistSocialUrls: new Set<string>([`${BASE_URL}/spotify`]),
};

// ── buildReleaseCards ──────────────────────────────────────────────────────────

describe('buildReleaseCards', () => {
  it('returns empty array for empty discography', () => {
    expect(buildReleaseCards([], 'en', () => '/news/x')).toEqual([]);
  });

  it('adds path from newsSlugs[lang] when available', () => {
    const release = makeRelease({ newsSlugs: { en: 'my-en-slug', pt: 'my-pt-slug' } });
    const [card] = buildReleaseCards([release], 'en', (slug) => `/news/${slug}`);
    expect(card.path).toBe('/news/my-en-slug');
  });

  it('falls back to release id when no slug for lang', () => {
    const release = makeRelease({ id: 'fallback-id', newsSlugs: { pt: 'pt-slug' } });
    const [card] = buildReleaseCards([release], 'en', (slug) => `/news/${slug}`);
    expect(card.path).toBe('/news/fallback-id');
  });

  it('uses pt slug when lang is pt', () => {
    const release = makeRelease({ newsSlugs: { en: 'en-slug', pt: 'pt-slug' } });
    const [card] = buildReleaseCards([release], 'pt', (slug) => `/pt/noticias/${slug}`);
    expect(card.path).toBe('/pt/noticias/pt-slug');
  });

  it('preserves all original release fields', () => {
    const release = makeRelease({ name: 'My Track', type: 'remix' });
    const [card] = buildReleaseCards([release], 'en', () => '/x');
    expect(card.name).toBe('My Track');
    expect(card.type).toBe('remix');
  });

  it('does not mutate the input array', () => {
    const releases = [makeRelease()];
    const copy = [...releases];
    buildReleaseCards(releases, 'en', () => '/x');
    expect(releases).toEqual(copy);
  });
});

// ── buildDiscographyListItems ──────────────────────────────────────────────────

describe('buildDiscographyListItems', () => {
  it('returns empty array for empty discography', () => {
    expect(buildDiscographyListItems([], opts)).toEqual([]);
  });

  it('wraps each release in a ListItem with correct position', () => {
    const releases = [makeRelease({ id: 'a' }), makeRelease({ id: 'b' })];
    const items = buildDiscographyListItems(releases, opts);
    expect(items[0]['@type']).toBe('ListItem');
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
  });

  it('maps single → MusicRecording schema type', () => {
    const items = buildDiscographyListItems([makeRelease({ type: 'single' })], opts);
    expect((items[0].item as Record<string, unknown>)['@type']).toBe('MusicRecording');
  });

  it('maps album → MusicAlbum schema type', () => {
    const items = buildDiscographyListItems([makeRelease({ type: 'album' })], opts);
    expect((items[0].item as Record<string, unknown>)['@type']).toBe('MusicAlbum');
  });

  it('maps ep → MusicAlbum schema type', () => {
    const items = buildDiscographyListItems([makeRelease({ type: 'ep' })], opts);
    expect((items[0].item as Record<string, unknown>)['@type']).toBe('MusicAlbum');
  });

  it('@id ends with #recording', () => {
    const items = buildDiscographyListItems([makeRelease({ id: 'my-release' })], opts);
    const node = items[0].item as Record<string, unknown>;
    expect(String(node['@id'])).toMatch(/#recording$/);
  });

  it('emits datePublished when releaseDate is real (not placeholder)', () => {
    const items = buildDiscographyListItems(
      [makeRelease({ releaseDate: '2025-06-01' })],
      opts,
    );
    const node = items[0].item as Record<string, unknown>;
    expect(node.datePublished).toBe('2025-06-01');
  });

  it('skips datePublished for the 2024-01-01 placeholder date', () => {
    const items = buildDiscographyListItems(
      [makeRelease({ releaseDate: '2024-01-01' })],
      opts,
    );
    const node = items[0].item as Record<string, unknown>;
    expect(node.datePublished).toBeUndefined();
  });

  it('excludes artist profile URLs from sameAs', () => {
    const items = buildDiscographyListItems(
      [makeRelease({ spotifyUrl: `${BASE_URL}/spotify` })],
      opts,
    );
    const node = items[0].item as Record<string, unknown>;
    // spotifyUrl is in the artistSocialUrls set → must not appear in sameAs
    expect(node.sameAs).toBeUndefined();
  });

  it('includes release-specific URLs in sameAs', () => {
    const items = buildDiscographyListItems(
      [makeRelease({ appleMusicUrl: 'https://music.apple.com/track/123' })],
      opts,
    );
    const node = items[0].item as Record<string, unknown>;
    expect((node.sameAs as string[]).includes('https://music.apple.com/track/123')).toBe(true);
  });

  it('single: pulls duration from tracks[0]', () => {
    const items = buildDiscographyListItems(
      [makeRelease({ type: 'single', tracks: [{ name: 'T', duration: 'PT4M00S' }] })],
      opts,
    );
    const node = items[0].item as Record<string, unknown>;
    expect(node.duration).toBe('PT4M00S');
  });
});
