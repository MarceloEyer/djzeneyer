// src/App.tsx
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

// Pages (Loja)
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import MyAccountPage from './pages/MyAccountPage';

// Context Providers - TODOS JUNTOS AQUI
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';

function App() {
  return (
    // A ordem dos providers é importante. Envolvemos o app com tudo o que é global.
    <LanguageProvider>
      <UserProvider>
        <CartProvider>
          <MusicPlayerProvider>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  {/* Rotas Principais */}
                  <Route index element={<HomePage />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="music" element={<MusicPage />} />
                  <Route path="tribe" element={<ZenTribePage />} />
                  
                  {/* Rota do Dashboard (protegida pelo AdminRoute que configuramos) */}
                  <Route path="dashboard" element={<DashboardPage />} /> 

                  {/* Rotas da Loja */}
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="product/:slug" element={<ProductPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="my-account" element={<MyAccountPage />} />

                  {/* Rota 404 (sempre por último) */}
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