import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { ARTIST } from '../data/artistData';
import type { ArtistProfile } from '../hooks/useQueries';

interface BrandingContextType {
  artist: ArtistProfile;
  isLoading: boolean;
  error: Error | null;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

/**
 * BrandingProvider exposes the static artist identity.
 * This project updates artist identity rarely, so artistData.ts remains the
 * runtime SSOT and avoids a global REST request on every public page view.
 */
export const BrandingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const artist = useMemo(() => ARTIST as unknown as ArtistProfile, []);

  const value = useMemo(() => ({
    artist,
    isLoading: false,
    error: null,
  }), [artist]);

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
