import { describe, it, expect } from 'vitest';
import { extractYouTubeId } from './youtube';

describe('extractYouTubeId', () => {
  it('extracts ID from iframe embed url', () => {
    const html = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" />';
    expect(extractYouTubeId(html)).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from watch url', () => {
    const html = 'Check this out: https://youtube.com/watch?v=dQw4w9WgXcQ&t=5';
    expect(extractYouTubeId(html)).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from youtu.be url', () => {
    const html = 'https://youtu.be/dQw4w9WgXcQ';
    expect(extractYouTubeId(html)).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from shorts url', () => {
    const html = 'https://www.youtube.com/shorts/dQw4w9WgXcQ?feature=share';
    expect(extractYouTubeId(html)).toBe('dQw4w9WgXcQ');
  });

  it('handles repeated watch parameters without catastrophic backtracking', () => {
    const repeated = `https://youtube.com/watch?${'&v=youtube.com/watch?'.repeat(500)}&v=dQw4w9WgXcQ`;
    expect(extractYouTubeId(repeated)).toBe('dQw4w9WgXcQ');
  });

  it('returns null when no youtube url is present', () => {
    const html = '<p>Just some text</p>';
    expect(extractYouTubeId(html)).toBeNull();
  });
});
