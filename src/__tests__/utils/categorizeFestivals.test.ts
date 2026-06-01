import { describe, it, expect } from 'vitest';
import { categorizeFestivals } from '../../utils/festivals';
import type { Festival } from '../../types';

const TODAY = new Date('2025-06-15T00:00:00.000Z');

const f = (name: string, date?: string): Festival => ({
  name,
  country: 'Test',
  flag: '🏳',
  url: 'https://example.com',
  date,
});

describe('categorizeFestivals', () => {
  it('puts future festivals in upcoming', () => {
    const festivals = [f('Future', '2025-12-01')];
    const { upcoming, past } = categorizeFestivals(festivals, TODAY);
    expect(upcoming.map((x) => x.name)).toEqual(['Future']);
    expect(past).toHaveLength(0);
  });

  it('puts past festivals in past', () => {
    const festivals = [f('Past', '2025-01-01')];
    const { upcoming, past } = categorizeFestivals(festivals, TODAY);
    expect(upcoming).toHaveLength(0);
    expect(past.map((x) => x.name)).toEqual(['Past']);
  });

  it('treats today as upcoming (date >= today)', () => {
    const festivals = [f('Today', '2025-06-15')];
    const { upcoming, past } = categorizeFestivals(festivals, TODAY);
    expect(upcoming.map((x) => x.name)).toEqual(['Today']);
    expect(past).toHaveLength(0);
  });

  it('sorts upcoming ascending (nearest first)', () => {
    const festivals = [
      f('Far', '2025-12-01'),
      f('Near', '2025-07-01'),
      f('Medium', '2025-09-01'),
    ];
    const { upcoming } = categorizeFestivals(festivals, TODAY);
    expect(upcoming.map((x) => x.name)).toEqual(['Near', 'Medium', 'Far']);
  });

  it('sorts past descending (most recent first)', () => {
    const festivals = [
      f('Oldest', '2023-01-01'),
      f('Newer', '2025-03-01'),
      f('Middle', '2024-06-01'),
    ];
    const { past } = categorizeFestivals(festivals, TODAY);
    expect(past.map((x) => x.name)).toEqual(['Newer', 'Middle', 'Oldest']);
  });

  it('puts festivals without date at the end of past', () => {
    const festivals = [f('NoDate'), f('Recent', '2025-05-01'), f('AlsoNoDate')];
    const { past } = categorizeFestivals(festivals, TODAY);
    const names = past.map((x) => x.name);
    expect(names[0]).toBe('Recent');
    expect(names).toContain('NoDate');
    expect(names).toContain('AlsoNoDate');
  });

  it('handles empty input', () => {
    const { upcoming, past } = categorizeFestivals([], TODAY);
    expect(upcoming).toHaveLength(0);
    expect(past).toHaveLength(0);
  });

  it('does not mutate the input array', () => {
    const festivals = [f('B', '2025-12-01'), f('A', '2025-07-01')];
    const original = [...festivals];
    categorizeFestivals(festivals, TODAY);
    expect(festivals.map((x) => x.name)).toEqual(original.map((x) => x.name));
  });
});
