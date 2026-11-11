import React, { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '../contexts/UserContext';
import { BrandingProvider } from '../contexts/BrandingContext';

import LanguageWrapper from '../components/common/LanguageWrapper';
import { queryClient } from '../config/queryClient';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <UserProvider>
          <BrandingProvider>
            <LanguageWrapper>
              {children}
            </LanguageWrapper>
          </BrandingProvider>
        </UserProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
