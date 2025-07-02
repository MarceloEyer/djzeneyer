// src/App.tsx - VERSÃO DE TESTE
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Helmet, HelmetProvider } from 'react-helmet-async';

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
// import { LanguageProvider } from './contexts/LanguageContext'; // TEMPORARIAMENTE DESATIVADO
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';

function App() {
  return (
    <HelmetProvider>
      {/* <LanguageProvider> */} {/* TEMPORARIAMENTE DESATIVADO */}
        <UserProvider>
          <CartProvider>
            <MusicPlayerProvider>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="music" element={<MusicPage />} />
                    <Route path="tribe" element={<ZenTribePage />} />
                    <Route path="work-with-me" element={<PressKitPage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="product/:slug" element={<ProductPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="my-account" element={<MyAccountPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Routes>
              </AnimatePresence>
            </MusicPlayerProvider>
          </CartProvider>
        </UserProvider>
      {/* </LanguageProvider> */} {/* TEMPORARIAMENTE DESATIVADO */}
    </HelmetProvider>
  );
}

export default App;