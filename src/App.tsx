// src/App.tsx

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
                {/* Redireciona a raiz (/) para a página inicial em inglês */}
                <Route path="/" element={<Navigate to="/en" replace />} />

                {/* Rota para idioma inglês (padrão) - sem prefixo na URL real, mas tratado como 'en' */}
                <Route path="/en" element={<LanguageWrapper lang="en" />}>
                  <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="music" element={<MusicPage />} />
                    <Route path="tribe" element={<ZenTribePage />} />
                    <Route path="work-with-me" element={<PressKitPage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="my-account" element={<MyAccountPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="product/:slug" element={<ProductPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>

                {/* Rota para idioma português - com prefixo /pt */}
                <Route path="/pt" element={<LanguageWrapper lang="pt" />}>
                  <Route element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="eventos" element={<EventsPage />} />
                    <Route path="musica" element={<MusicPage />} />
                    <Route path="tribo" element={<ZenTribePage />} />
                    <Route path="contrate" element={<PressKitPage />} />
                    <Route path="loja" element={<ShopPage />} />
                    <Route path="minha-conta" element={<MyAccountPage />} />
                    <Route path="carrinho" element={<CartPage />} />
                    <Route path="finalizar-compra" element={<CheckoutPage />} />
                    {/* Mantém /dashboard e /product/:slug para compatibilidade ou traduz? */}
                    {/* Exemplo de rota traduzida: */}
                    {/* <Route path="painel" element={<DashboardPage />} /> */}
                    <Route path="product/:slug" element={<ProductPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>

                {/* Rota de fallback para qualquer coisa que não comece com /en/ ou /pt/ */}
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