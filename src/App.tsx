import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import MainLayout from './layouts/MainLayout';
import LanguageWrapper from './components/common/LanguageWrapper';
import { queryClient } from './config/queryClient';
import './i18n';

// Importamos a configuração e os helpers
import { 
  ROUTES_CONFIG, 
  NOT_FOUND_COMPONENT, 
  getLocalizedPaths,
  type Language 
} from './config/routes';

// Helper function para gerar as rotas internas (filhas do Layout)
// Isso mantém o App.tsx limpo, mas retorna elementos <Route> válidos
const renderPageRoutes = (language: Language) => {
  return ROUTES_CONFIG.flatMap((routeConfig, index) => {
    const Component = routeConfig.component;
    const paths = getLocalizedPaths(routeConfig, language);

    return paths.flatMap((path, pathIndex) => {
      const key = `${language}-${index}-${pathIndex}`;

      // Rota Index (Home)
      if (routeConfig.isIndex) {
        return <Route key={key} index element={<Component />} />;
      }

      // Rotas com sub-rotas (Wildcard ex: Shop/*)
      if (routeConfig.hasWildcard) {
        return [
          <Route key={`${key}-main`} path={path} element={<Component />} />,
          <Route key={`${key}-wildcard`} path={`${path}/*`} element={<Component />} />
        ];
      }

      // Rota Padrão
      return <Route key={key} path={path} element={<Component />} />;
    });
  });
};

function App() {
  const NotFound = NOT_FOUND_COMPONENT;

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
                    <Routes>
                      {/* =========================================
                          ROTAS EM INGLÊS (Raiz /)
                         ========================================= */}
                      <Route path="/" element={<MainLayout />}>
                        {renderPageRoutes('en')}
                      </Route>

                      {/* =========================================
                          ROTAS EM PORTUGUÊS (/pt)
                         ========================================= */}
                      <Route path="/pt" element={<MainLayout />}>
                        {renderPageRoutes('pt')}
                      </Route>

                      {/* =========================================
                          FALLBACK 404
                         ========================================= */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
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