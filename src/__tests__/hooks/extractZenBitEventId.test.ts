import { describe, it, expect } from 'vitest';
import { extractZenBitEventId } from '../../hooks/usePublicQueries';

describe('extractZenBitEventId', () => {
  it('returns pure numeric ID unchanged', () => {
    expect(extractZenBitEventId('12345678')).toBe('12345678');
  });

  it('extracts numeric ID from canonical slug', () => {
    expect(
      extractZenBitEventId('2025-06-20-dj-zen-eyer-at-club-x-12345678')
    ).toBe('12345678');
  });

  it('returns last segment when ID is alphanumeric', () => {
    expect(extractZenBitEventId('2025-06-20-dj-zen-eyer-abc123')).toBe('abc123');
  });

  it('returns empty string for empty input', () => {
    expect(extractZenBitEventId('')).toBe('');
  });

  it('returns the full string when there is no hyphen', () => {
    expect(extractZenBitEventId('nohyphen')).toBe('nohyphen');
  });

  it('handles canonical slug with short venue segment', () => {
    // Last segment "99" is numeric — returned as-is
    expect(extractZenBitEventId('2025-01-01-venue-99')).toBe('99');
  });

  it('returns last segment when slug has only two parts', () => {
    expect(extractZenBitEventId('prefix-suffix')).toBe('suffix');
  });
});
