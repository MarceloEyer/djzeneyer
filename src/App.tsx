import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import LanguageWrapper from './components/common/LanguageWrapper';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import MusicPage from './pages/MusicPage';
import ZenTribePage from './pages/ZenTribePage';
import PressKitPage from './pages/PressKitPage';
import ShopPage from './pages/ShopPage';
// ... outras páginas ...
import NotFoundPage from './pages/NotFoundPage';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';

function App() {
  return (
    <HelmetProvider>
      <UserProvider>
        <CartProvider>
          <MusicPlayerProvider>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/:lang(pt)?" element={<LanguageWrapper />}>
                  <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="music" element={<MusicPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="tribe" element={<ZenTribePage />} />
                    <Route path="work-with-me" element={<PressKitPage />} />
                    {/* Outras rotas */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </AnimatePresence>
          </MusicPlayerProvider>
        </CartProvider>
      </UserProvider>
    </HelmetProvider>
  );
}
export default App;
