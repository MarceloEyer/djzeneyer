import { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import LanguageWrapper from './components/common/LanguageWrapper';
import AppRoutes from './components/AppRoutes'; // Importamos a lógica isolada
import { queryClient } from './config/queryClient';
import './i18n';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <UserProvider>
          <CartProvider>
            <MusicPlayerProvider>
              <AnimatePresence mode="wait">
                <LanguageWrapper>
                  <Suspense fallback={
                    <div className="min-h-screen flex items-center justify-center bg-background">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                  }>
                    {/* Toda a lógica de rotas está encapsulada aqui */}
                    <AppRoutes />
                  </Suspense>
                </LanguageWrapper>
              </AnimatePresence>
            </MusicPlayerProvider>
          </CartProvider>
        </UserProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;