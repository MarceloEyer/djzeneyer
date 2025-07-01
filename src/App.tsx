// src/App.tsx (VERSÃO DE TESTE)

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import MusicPage from './pages/MusicPage';
import ZenTribePage from './pages/ZenTribePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import PressKitPage from './pages/PressKitPage';

// Pages (Loja)
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyAccountPage from './pages/MyAccountPage';

// Context Providers
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';

function App() {
  return (
    <LanguageProvider>
      <UserProvider>
        <CartProvider>
          <MusicPlayerProvider>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  {/* ... outras rotas ... */}
                  <Route path="tribe" element={<ZenTribePage />} />
                  
                  {/* ALTERAÇÃO DE TESTE ABAIXO */}
                  <Route path="work-with-me" element={<HomePage />} /> 
                  
                  <Route path="dashboard" element={<DashboardPage />} /> 
                  {/* ... outras rotas ... */}
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </MusicPlayerProvider>
        </CartProvider>
      </UserProvider>
    </LanguageProvider>
  );
}

export default App;