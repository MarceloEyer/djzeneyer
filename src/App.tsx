// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout'; // Seu layout principal

// Pages (Páginas existentes)
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import MusicPage from './pages/MusicPage';
import ZenTribePage from './pages/ZenTribePage'; // Página informativa pública sobre a tribo
import DashboardPage from './pages/DashboardPage'; // Página para usuários logados
import NotFoundPage from './pages/NotFoundPage';

// Pages (NOVAS Páginas da Loja - você precisará criar esses arquivos)
import ShopPage from './pages/ShopPage'; // Página principal da loja
import ProductPage from './pages/ProductPage'; // Página de produto individual
import CartPage from './pages/CartPage'; // Página do carrinho
import CheckoutPage from './pages/CheckoutPage'; // Página de finalizar compra
import MyAccountPage from './pages/MyAccountPage'; // Página da minha conta do usuário

// Context Providers
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <MusicPlayerProvider>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              {/* Rotas Principais */}
              <Route index element={<HomePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="music" element={<MusicPage />} />
              <Route path="tribe" element={<ZenTribePage />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* NOVAS ROTAS DA LOJA */}
              {/* shop (ou o slug da sua página de loja no WP) */}
              <Route path="shop" element={<ShopPage />} />
              {/* product/:slug (ou /product/:id se preferir IDs) */}
              <Route path="product/:slug" element={<ProductPage />} />
              {/* cart */}
              <Route path="cart" element={<CartPage />} />
              {/* checkout */}
              <Route path="checkout" element={<CheckoutPage />} />
              {/* my-account */}
              <Route path="my-account" element={<MyAccountPage />} />

              {/* Rota 404 (sempre por último) */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </MusicPlayerProvider>
    </UserProvider>
  );
}

export default App;