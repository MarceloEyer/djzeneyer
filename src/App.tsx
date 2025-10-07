// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// ... (todos os seus outros imports)
import LanguageWrapper from './components/common/LanguageWrapper';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';

function App() {
  return (
    // ... (seus Providers: Helmet, User, Cart, MusicPlayer)
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/:lang(pt)?" element={<LanguageWrapper />}>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            {/* Adicione todas as suas outras rotas aqui */}
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
    // ... (fechamento dos seus Providers)
  );
}
export default App;