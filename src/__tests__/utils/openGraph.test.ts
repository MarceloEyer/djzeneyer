// src/__tests__/utils/openGraph.test.ts

import { describe, it, expect } from 'vitest';
import {
  getMetaDescription,
  getOpenGraphTitle,
  getOpenGraphDescription,
  getOpenGraphImageType,
  getOpenGraphImageForPath,
  getOpenGraphAltForPath,
} from '../../utils/openGraph';

// ── getMetaDescription ────────────────────────────────────────────────────────

describe('getMetaDescription', () => {
  it('returns the string unchanged when below 160 chars', () => {
    const short = 'Zen Eyer is a Brazilian Zouk DJ and music producer.';
    expect(getMetaDescription(short)).toBe(short);
  });

  it('truncates to 160 characters', () => {
    const long = 'a'.repeat(200);
    expect(getMetaDescription(long).length).toBeLessThanOrEqual(160);
  });

  it('appends ellipsis when truncated', () => {
    const long = 'a'.repeat(200);
    expect(getMetaDescription(long)).toMatch(/…$|\.{3}$/);
  });

  it('handles empty string', () => {
    expect(getMetaDescription('')).toBe('');
  });
});

// ── getOpenGraphTitle ─────────────────────────────────────────────────────────

describe('getOpenGraphTitle', () => {
  it('returns short title unchanged', () => {
    const title = 'Zen Eyer | Brazilian Zouk DJ';
    expect(getOpenGraphTitle(title)).toBe(title);
  });

  it('truncates to 90 characters by default', () => {
    const long = 'Title '.repeat(20);
    expect(getOpenGraphTitle(long).length).toBeLessThanOrEqual(90);
  });

  it('respects a custom maxLength', () => {
    const long = 'a'.repeat(200);
    expect(getOpenGraphTitle(long, 60).length).toBeLessThanOrEqual(60);
  });
});

// ── getOpenGraphDescription ───────────────────────────────────────────────────

describe('getOpenGraphDescription', () => {
  it('truncates to 200 characters by default', () => {
    const long = 'x'.repeat(250);
    expect(getOpenGraphDescription(long).length).toBeLessThanOrEqual(200);
  });

  it('leaves short descriptions unchanged', () => {
    const desc = 'Short description.';
    expect(getOpenGraphDescription(desc)).toBe(desc);
  });
});

// ── getOpenGraphImageType ─────────────────────────────────────────────────────

describe('getOpenGraphImageType', () => {
  it('returns image/jpeg for .jpg URLs', () => {
    expect(getOpenGraphImageType('https://djzeneyer.com/og.jpg')).toBe('image/jpeg');
  });

  it('returns image/jpeg for .jpeg URLs', () => {
    expect(getOpenGraphImageType('https://djzeneyer.com/og.jpeg')).toBe('image/jpeg');
  });

  it('returns image/png for .png URLs', () => {
    expect(getOpenGraphImageType('https://djzeneyer.com/og.png')).toBe('image/png');
  });

  it('returns image/webp for .webp URLs', () => {
    expect(getOpenGraphImageType('https://djzeneyer.com/og.webp')).toBe('image/webp');
  });

  it('returns undefined for unknown extensions', () => {
    expect(getOpenGraphImageType('https://djzeneyer.com/og.bmp')).toBeUndefined();
  });

  it('returns undefined for URLs without extension', () => {
    expect(getOpenGraphImageType('https://djzeneyer.com/image')).toBeUndefined();
  });
});

// ── getOpenGraphImageForPath ──────────────────────────────────────────────────

describe('getOpenGraphImageForPath', () => {
  const base = 'https://djzeneyer.com';

  it('returns home OG image for root path', () => {
    const img = getOpenGraphImageForPath('/', base);
    expect(img).toContain('home');
  });

  it('returns about OG image for /about path', () => {
    // Regex in openGraph.ts matches /about or /sobre (without suffix)
    const img = getOpenGraphImageForPath('/about', base);
    expect(img).toContain('about');
  });

  it('returns events OG image for /zouk-events path', () => {
    const img = getOpenGraphImageForPath('/zouk-events', base);
    expect(img).toContain('events');
  });

  it('returns a fallback image for unknown paths', () => {
    const img = getOpenGraphImageForPath('/unknown-route', base);
    expect(img).toBeTruthy();
  });
});

// ── getOpenGraphAltForPath ────────────────────────────────────────────────────

describe('getOpenGraphAltForPath', () => {
  it('returns a non-empty string for any path', () => {
    expect(getOpenGraphAltForPath('/', 'en')).toBeTruthy();
    expect(getOpenGraphAltForPath('/unknown', 'pt')).toBeTruthy();
  });

  it('returns English alt text for en', () => {
    const alt = getOpenGraphAltForPath('/', 'en');
    expect(typeof alt).toBe('string');
    expect(alt.length).toBeGreaterThan(0);
  });

  it('returns Portuguese alt text for pt', () => {
    const altEn = getOpenGraphAltForPath('/', 'en');
    const altPt = getOpenGraphAltForPath('/', 'pt');
    // The two alts should differ (bilingual)
    expect(altPt).not.toBe(altEn);
  });
});
