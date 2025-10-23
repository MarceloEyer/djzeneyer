// src/App.tsx - VERSÃO OTIMIZADA COM LAZY LOADING

import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

// ✅ Componentes que SEMPRE precisam estar carregados
import MainLayout from './layouts/MainLayout';
import LanguageWrapper from './components/common/LanguageWrapper';

// ✅ Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-white/70">Loading...</p>
    </div>
  </div>
);

// ✅ LAZY LOAD - Páginas carregam só quando necessário
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const MusicPage = lazy(() => import('./pages/MusicPage'));
const ZenTribePage = lazy(() => import('./pages/ZenTribePage'));
const PressKitPage = lazy(() => import('./pages/PressKitPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MyAccountPage = lazy(() => import('./pages/MyAccountPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// ✅ Contexts que precisam ficar no topo
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import './i18n';

function App() {
  return (
    <HelmetProvider>
      <UserProvider>
        <CartProvider>
          <MusicPlayerProvider>
            <AnimatePresence mode="wait">
              <LanguageWrapper>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* English routes (root) */}
                    <Route path="/" element={<MainLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="events" element={<EventsPage />} />
                      <Route path="events/:id" element={<EventsPage />} />
                      <Route path="music" element={<MusicPage />} />
                      <Route path="music/:slug" element={<MusicPage />} />
                      <Route path="tribe" element={<ZenTribePage />} />
                      <Route path="zen-tribe" element={<ZenTribePage />} />
                      <Route path="zentribe" element={<ZenTribePage />} />
                      <Route path="work-with-me" element={<PressKitPage />} />
                      <Route path="shop" element={<ShopPage />} />
                      <Route path="shop/*" element={<ShopPage />} />
                      <Route path="dashboard" element={<DashboardPage />} />
                      <Route path="my-account" element={<MyAccountPage />} />
                      <Route path="faq" element={<FAQPage />} />
                    </Route>

                    {/* Portuguese routes under /pt */}
                    <Route path="/pt" element={<MainLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="sobre" element={<AboutPage />} />
                      <Route path="eventos" element={<EventsPage />} />
                      <Route path="eventos/:id" element={<EventsPage />} />
                      <Route path="musica" element={<MusicPage />} />
                      <Route path="musica/:slug" element={<MusicPage />} />
                      <Route path="tribo" element={<ZenTribePage />} />
                      <Route path="tribo-zen" element={<ZenTribePage />} />
                      <Route path="contrate" element={<PressKitPage />} />
                      <Route path="loja" element={<ShopPage />} />
                      <Route path="loja/*" element={<ShopPage />} />
                      <Route path="painel" element={<DashboardPage />} />
                      <Route path="minha-conta" element={<MyAccountPage />} />
                      <Route path="faq" element={<FAQPage />} />
                    </Route>

                    {/* Fallback 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </LanguageWrapper>
            </AnimatePresence>
          </MusicPlayerProvider>
        </CartProvider>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
