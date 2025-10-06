import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import LanguageWrapper from './components/common/LanguageWrapper';
import HomePage from './pages/HomePage';
import MusicPage from './pages/MusicPage';
import EventsPage from './pages/EventsPage';
import ShopPage from './pages/ShopPage';
import ZenTribePage from './pages/ZenTribePage';
import DashboardPage from './pages/DashboardPage';
import MyAccountPage from './pages/MyAccountPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductPage from './pages/ProductPage';
import PressKitPage from './pages/PressKitPage';
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
                    <Route path="product/:id" element={<ProductPage />} />
                    <Route path="tribe" element={<ZenTribePage />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="my-account" element={<MyAccountPage />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="press-kit" element={<PressKitPage />} />
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