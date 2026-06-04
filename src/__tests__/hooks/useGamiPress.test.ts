import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGamiPress } from '../../hooks/useGamiPress';
import * as UserContext from '../../contexts/UserContext';
import * as useQueries from '../../hooks/useQueries';

describe('useGamiPress hook', () => {
  it('returns fallback data when query has no data', () => {
    vi.spyOn(UserContext, 'useUser').mockReturnValue({ user: null } as any);
    vi.spyOn(useQueries, 'useGamipressQuery').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const { result } = renderHook(() => useGamiPress());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.mainPoints).toBe(0);
    expect(result.current.currentRank).toBe('Zen Novice');
  });

  it('returns valid data when query succeeds', () => {
    vi.spyOn(UserContext, 'useUser').mockReturnValue({ user: { id: 1, token: 'abc' } } as any);
    vi.spyOn(useQueries, 'useGamipressQuery').mockReturnValue({
      data: {
        main_points_slug: 'xp',
        points: { xp: { amount: 100 } },
        rank: {
          current: { id: 2, title: 'Zen Master' },
          progress: 50,
          requirements: [{ required: 200 }],
        },
        achievements_earned: [{ id: 1, title: 'First Login' }],
        achievements_locked: [{ id: 2, title: '100 Days Streak' }],
      },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    } as any);

    const { result } = renderHook(() => useGamiPress());
    
    expect(result.current.mainPoints).toBe(100);
    expect(result.current.currentRank).toBe('Zen Master');
    expect(result.current.level).toBe(2);
    expect(result.current.achievements).toHaveLength(2);
    expect(result.current.progressToNextLevel).toBe(50);
    expect(result.current.nextLevelPoints).toBe(200);
  });

  it('exposes refresh function calling refetch', () => {
    const refetchMock = vi.fn();
    vi.spyOn(useQueries, 'useGamipressQuery').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: refetchMock,
    } as any);

    const { result } = renderHook(() => useGamiPress());
    result.current.refresh();
    expect(refetchMock).toHaveBeenCalled();
  });
});
