import React, { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from '../contexts/UserContext';
import { CartProvider } from '../contexts/CartContext';
import { BrandingProvider } from '../contexts/BrandingContext';

import LanguageWrapper from '../components/common/LanguageWrapper';
import { queryClient } from '../config/queryClient';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders encapsula todos os provedores globais da aplicação.
 * Isso evita o "Provider Hell" no arquivo App.tsx.
 */
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <UserProvider>
          <CartProvider>
            <BrandingProvider>
              <LanguageWrapper>
                {children}
              </LanguageWrapper>
            </BrandingProvider>
          </CartProvider>
        </UserProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
