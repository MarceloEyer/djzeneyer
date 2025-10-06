import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import LanguageWrapper from './components/common/LanguageWrapper';
import HomePage from './pages/HomePage';
// ... importe todas as suas outras páginas
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
                    {/* ... cole aqui todas as suas outras rotas ... */}
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