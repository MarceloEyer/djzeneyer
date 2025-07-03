// src/layouts/MainLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';

const MainLayout: React.FC = () => {
  // O "interruptor" que controla se o modal está aberto ou fechado
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // O estado que controla se o modal mostra a tela de login ou de registro
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Função para abrir o modal. É esta que passaremos para o Navbar.
  const openModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsAuthModalOpen(false);
  };

  // Função para alternar entre os modos de login e registro dentro do modal
  const toggleAuthMode = () => {
    setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      {/* 1. Passamos a função `openModal` para o Navbar através da prop `onLoginClick` */}
      <Navbar onLoginClick={() => openModal('login')} />

      <main className="flex-grow pt-20">
        {/* O <Outlet /> renderiza a página da rota atual (HomePage, ShopPage, etc.) aqui */}
        <Outlet />
      </main>

      <Footer />

      {/* 2. O AuthModal é renderizado aqui e sua visibilidade é controlada pelo nosso "interruptor" */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeModal}
        mode={authMode}
        onToggleMode={toggleAuthMode}
      />
    </div>
  );
};

export default MainLayout;