import { Suspense } from 'react';
import { Routes } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { RouteGenerator, NotFoundRoute } from './components/common/RouteGenerator';
import LanguageWrapper from './components/common/LanguageWrapper';
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
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
                    <Routes>
                      {/* English routes (root) */}
                      <RouteGenerator language="en" />

                      {/* Portuguese routes (/pt) */}
                      <RouteGenerator language="pt" />

                      {/* Fallback 404 */}
                      <NotFoundRoute />
                    </Routes>
                  </Suspense>
                </LanguageWrapper>
              </AnimatePresence>
            </MusicPlayerProvider>
          </CartProvider>
        </UserProvider>
      </HelmetProvider>
      
      {/* React Query Devtools (apenas em desenvolvimento) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default App;
