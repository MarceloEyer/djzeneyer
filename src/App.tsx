// src/App.tsx - VERSÃO LIMPA (SEM GoogleOAuthCallback)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

import FAQPage from './pages/FAQPage';
import MainLayout from './layouts/MainLayout';
import LanguageWrapper from './components/common/LanguageWrapper';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import MusicPage from './pages/MusicPage';
import ZenTribePage from './pages/ZenTribePage';
import PressKitPage from './pages/PressKitPage';
import ShopPage from './pages/ShopPage';
import DashboardPage from './pages/DashboardPage';
import MyAccountPage from './pages/MyAccountPage';
import NotFoundPage from './pages/NotFoundPage';

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
                <Routes>
                  {/* English routes (root) */}
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
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
                  </Route>

                  {/* Portuguese routes under /pt */}
                  <Route path="/pt" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
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
                  </Route>

                  {/* Fallback 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </LanguageWrapper>
            </AnimatePresence>
          </MusicPlayerProvider>
        </CartProvider>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
