import { describe, expect, it } from 'vitest';
import { ARTIST } from '../../data/artistData';
import { ARTIST_SCHEMA_SAME_AS } from '../../data/artist.schema';

describe('artistData canonical keys', () => {
  it('has social.YouTube with capital Y (not social.youtube)', () => {
    expect(ARTIST.social.YouTube).toBeDefined();
    expect(ARTIST.social.YouTube.url).toMatch(/youtube\.com/);
    // @ts-expect-error — intentionally testing the wrong key does not exist
    expect((ARTIST.social as Record<string, unknown>).youtube).toBeUndefined();
  });

  it('has social.YouTubeMusic with capital Y and T (not social.youtubeMusic)', () => {
    expect(ARTIST.social.YouTubeMusic).toBeDefined();
    expect(ARTIST.social.YouTubeMusic.url).toMatch(/youtube\.com|music\.youtube/);
    // @ts-expect-error — intentionally testing the wrong key does not exist
    expect((ARTIST.social as Record<string, unknown>).youtubeMusic).toBeUndefined();
  });

  it('keeps YouTube Music out of artist sameAs', () => {
    expect(ARTIST_SCHEMA_SAME_AS).toContain(ARTIST.social.YouTube.url);
    expect(ARTIST_SCHEMA_SAME_AS).not.toContain(ARTIST.social.YouTubeMusic.url);
  });

  it('keeps non-authority catalog and support URLs out of artist sameAs', () => {
    expect(ARTIST_SCHEMA_SAME_AS).not.toContain(ARTIST.social.lastfm.url);
    expect(ARTIST_SCHEMA_SAME_AS).not.toContain(ARTIST.social.shazam.url);
    expect(ARTIST_SCHEMA_SAME_AS).not.toContain(ARTIST.social.genius.url);
    expect(ARTIST_SCHEMA_SAME_AS).not.toContain(ARTIST.social.patreon.url);
    expect(ARTIST_SCHEMA_SAME_AS).not.toContain(ARTIST.social.medium.url);
  });

  it('has canonical IPA pronunciation', () => {
    expect(ARTIST.identity.pronunciationIPA).toBe('/zɛn ˈaɪər/');
  });

  it('has canonical stage name (not Zen Ayer or other misspellings)', () => {
    expect(ARTIST.identity.stageName).toBe('Zen Eyer');
    expect(ARTIST.identity.stageName).not.toContain('Ayer');
  });

  it('has Wikidata identifier', () => {
    expect(ARTIST.identifiers.wikidata).toBe('Q136551855');
  });

  it('has championship year as a number', () => {
    expect(typeof ARTIST.titles.year).toBe('number');
    expect(ARTIST.titles.year).toBeGreaterThan(2000);
  });

  it('has valid contact email', () => {
    expect(ARTIST.contact.email).toMatch(/@djzeneyer\.com$/);
  });

  it('has countriesPlayed as a positive number', () => {
    expect(typeof ARTIST.stats.countriesPlayed).toBe('number');
    expect(ARTIST.stats.countriesPlayed).toBeGreaterThan(0);
  });
});
