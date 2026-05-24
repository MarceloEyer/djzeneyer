import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { ARTIST } from '../data/artistData';

interface BrandingContextType {
  artist: typeof ARTIST;
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
  const value = useMemo(() => ({
    artist: ARTIST,
    isLoading: false,
    error: null,
  }), []);

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
