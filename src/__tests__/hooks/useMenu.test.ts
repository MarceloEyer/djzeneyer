import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMenu } from '../../hooks/useMenu';
import * as useQueries from '../../hooks/useQueries';
import * as apiConfig from '../../config/api';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'pt-BR' },
  }),
}));

describe('useMenu hook', () => {
  beforeEach(() => {
    vi.spyOn(apiConfig, 'getSiteUrl').mockReturnValue('https://djzeneyer.com');
  });

  it('formats menu URLs correctly by removing the siteUrl', () => {
    vi.spyOn(useQueries, 'useMenuQuery').mockReturnValue({
      data: [
        { ID: 1, title: 'Home', url: 'https://djzeneyer.com/', target: '' },
        { ID: 2, title: 'Music', url: 'https://djzeneyer.com/music', target: '' },
        { ID: 3, title: 'External', url: 'https://other.com/link', target: '_blank' },
      ],
      isLoading: false,
      isError: false,
    } as any);

    const { result } = renderHook(() => useMenu());
    
    expect(result.current).toEqual([
      { ID: 1, title: 'Home', url: '/', target: '' },
      { ID: 2, title: 'Music', url: '/music', target: '' },
      { ID: 3, title: 'External', url: 'https://other.com/link', target: '_blank' },
    ]);
  });

  it('returns empty array if data is undefined', () => {
    vi.spyOn(useQueries, 'useMenuQuery').mockReturnValue({
      data: undefined,
    } as any);

    const { result } = renderHook(() => useMenu());
    
    expect(result.current).toEqual([]);
  });

  it('handles empty URLs robustly', () => {
    vi.spyOn(useQueries, 'useMenuQuery').mockReturnValue({
      data: [
        { ID: 1, title: 'No URL', url: '', target: '' },
      ],
    } as any);

    const { result } = renderHook(() => useMenu());
    
    expect(result.current[0].url).toBe('/');
  });
});
