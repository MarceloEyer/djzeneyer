// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout'; // Seu layout principal

// Pages (Páginas existentes)
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage'; // Corrigido o caminho './ ./pages/EventsPage'
import MusicPage from './pages/MusicPage';
import ZenTribePage from './pages/ZenTribePage'; // Página informativa pública sobre a tribo
import DashboardPage from './pages/DashboardPage'; // Página para usuários logados
import NotFoundPage from './pages/NotFoundPage';

// Pages (Páginas da Loja)
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
              {/* ROTA DA DASHBOARD (se você tiver uma página de dashboard separada para usuários) */}
              {/* Se DashboardPage for a área restrita para assinantes, mantenha esta rota */}
              <Route path="dashboard" element={<DashboardPage />} /> 

              {/* ROTAS DA LOJA */}
              <Route path="shop" element={<ShopPage />} />
              <Route path="product/:slug" element={<ProductPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="my-account" element={<MyAccountPage />} /> {/* Rota para a área do usuário */}

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