// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

// Layouts e Páginas
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
// ... importe todas as suas outras páginas aqui

// Context Providers
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';

function App() {
  return (
    <HelmetProvider>
      <LanguageProvider>
        <UserProvider>
          <CartProvider>
            <MusicPlayerProvider>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    {/* ... cole todas as suas rotas <Route ... /> aqui ... */}
                  </Route>
                </Routes>
              </AnimatePresence>
            </MusicPlayerProvider>
          </CartProvider>
        </UserProvider>
      </LanguageProvider>
    </HelmetProvider>
  );
}

export default App;