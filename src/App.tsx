// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <-- MUDANÇA: Importamos o Navigate
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

// Layouts e Wrappers
import MainLayout from './layouts/MainLayout';
import LanguageWrapper from './components/common/LanguageWrapper';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import MusicPage from './pages/MusicPage';
import ZenTribePage from './pages/ZenTribePage';
import PressKitPage from './pages/PressKitPage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyAccountPage from './pages/MyAccountPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

// Context Providers
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
              <Routes>
                {/* <-- MUDANÇA: Redireciona a raiz para o idioma padrão (inglês) --> */}
                <Route path="/" element={<Navigate to="/en" replace />} />

                {/* <-- MUDANÇA: A rota agora captura 'en' ou 'pt' --> */}
                <Route path="/:lang(en|pt)" element={<LanguageWrapper />}>
                  <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    
                    {/* Suas rotas duplicadas para tradução funcionarão aqui dentro */}
                    <Route path="events" element={<EventsPage />} />
                    <Route path="eventos" element={<EventsPage />} />
                    
                    <Route path="music" element={<MusicPage />} />
                    <Route path="musica" element={<MusicPage />} />
                    
                    <Route path="tribe" element={<ZenTribePage />} />
                    <Route path="tribo" element={<ZenTribePage />} />
                    
                    <Route path="work-with-me" element={<PressKitPage />} />
                    <Route path="contrate" element={<PressKitPage />} />
                    
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="loja" element={<ShopPage />} />

                    <Route path="my-account" element={<MyAccountPage />} />
                    <Route path="minha-conta" element={<MyAccountPage />} />
                    
                    <Route path="cart" element={<CartPage />} />
                    <Route path="carrinho" element={<CartPage />} />

                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="finalizar-compra" element={<CheckoutPage />} />
                    
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="product/:slug" element={<ProductPage />} />
                    
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>

                {/* Rota final de fallback para qualquer URL que não combine com o padrão de idioma */}
                <Route path="*" element={<NotFoundPage />} />

              </Routes>
            </AnimatePresence>
          </MusicPlayerProvider>
        </CartProvider>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;