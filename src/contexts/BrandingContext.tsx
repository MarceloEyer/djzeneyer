import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchArtistProfileFn, ArtistProfile } from '../hooks/useQueries';
import { ARTIST as FALLBACK_ARTIST } from '../data/artistData';

interface BrandingContextType {
  artist: ArtistProfile;
  isLoading: boolean;
  error: Error | null;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

/**
 * BrandingProvider manages the "Source of Truth" for the artist identity.
 * It fetches the latest data from WordPress (Zen SEO Identity settings)
 * and falls back to the static artistData.ts if necessary.
 */
export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['artist-profile'],
    queryFn: fetchArtistProfileFn,
    staleTime: 1000 * 60 * 60, // 1 hour - branding data is stable
  });

  // Merge dynamic data with static fallback to ensure no breaks
  const artist = useMemo(() => {
    if (!data) return FALLBACK_ARTIST as unknown as ArtistProfile;
    
    return {
      ...data,
      // Ensure we have at least the critical site fields from fallback if missing
      site: (FALLBACK_ARTIST as any).site, 
    };
  }, [data]);

  const value = useMemo(() => ({
    artist,
    isLoading,
    error: error as Error | null,
  }), [artist, isLoading, error]);

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

// Also export a direct artist hook for convenience
export const useArtist = () => useBranding().artist;
