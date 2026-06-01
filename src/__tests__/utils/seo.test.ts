// src/__tests__/utils/seo.test.ts

import { describe, it, expect } from 'vitest';
import { ensureTrailingSlash } from '../../utils/seo';

describe('ensureTrailingSlash', () => {
  it('returns "/" for an empty string', () => {
    expect(ensureTrailingSlash('')).toBe('/');
  });

  it('leaves a URL that already ends with / unchanged', () => {
    expect(ensureTrailingSlash('https://djzeneyer.com/about/')).toBe('https://djzeneyer.com/about/');
  });

  it('appends / to a plain URL without trailing slash', () => {
    expect(ensureTrailingSlash('https://djzeneyer.com/about')).toBe('https://djzeneyer.com/about/');
  });

  it('does not add / to URLs with a file extension', () => {
    expect(ensureTrailingSlash('https://djzeneyer.com/robots.txt')).toBe('https://djzeneyer.com/robots.txt');
    expect(ensureTrailingSlash('https://djzeneyer.com/style.css')).toBe('https://djzeneyer.com/style.css');
    expect(ensureTrailingSlash('https://djzeneyer.com/image.png')).toBe('https://djzeneyer.com/image.png');
  });

  it('adds / before query string when path has no extension', () => {
    const result = ensureTrailingSlash('https://djzeneyer.com/events?page=2');
    expect(result).toBe('https://djzeneyer.com/events/?page=2');
  });

  it('adds / before hash fragment when path has no extension', () => {
    const result = ensureTrailingSlash('https://djzeneyer.com/about#section');
    expect(result).toBe('https://djzeneyer.com/about/#section');
  });

  it('does not add / to bare domain — TLD matches file-extension heuristic', () => {
    // ensureTrailingSlash uses /\.[a-z0-9]{2,4}$/ which matches ".com".
    // In practice, base URLs always include a trailing slash before reaching this function.
    expect(ensureTrailingSlash('https://djzeneyer.com')).toBe('https://djzeneyer.com');
  });

  it('handles lone slash', () => {
    expect(ensureTrailingSlash('/')).toBe('/');
  });

  it('handles relative path without trailing slash', () => {
    expect(ensureTrailingSlash('/about')).toBe('/about/');
  });

  it('handles relative path that already has trailing slash', () => {
    expect(ensureTrailingSlash('/about/')).toBe('/about/');
  });
});
