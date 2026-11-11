import { describe, expect, it } from 'vitest';
import { getRouteFallbackHeight } from '../../components/AppRoutes';

describe('route fallback height', () => {
  it.each(['/', '/pt', '/pt/'])('reserves the prerendered home height for %s', (pathname) => {
    expect(getRouteFallbackHeight(pathname)).toBe('min-h-[3600px]');
  });

  it('keeps the listing fallback height for event and release routes', () => {
    expect(getRouteFallbackHeight('/pt/eventos-zouk/')).toBe('min-h-[1600px]');
    expect(getRouteFallbackHeight('/releases/')).toBe('min-h-[1600px]');
  });

  it('reserves the music page height on desktop for zouk-music routes', () => {
    expect(getRouteFallbackHeight('/zouk-music/')).toBe('min-h-[60vh] sm:min-h-[1600px]');
    expect(getRouteFallbackHeight('/pt/musica-zouk/')).toBe('min-h-[60vh] sm:min-h-[1600px]');
  });

  it('uses the compact fallback for regular pages', () => {
    expect(getRouteFallbackHeight('/about-dj-zen-eyer/')).toBe('min-h-[60vh]');
  });
});
