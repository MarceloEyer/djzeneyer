// src/layouts/MainLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';

// Importe os componentes que o layout utiliza
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';

const MainLayout: React.FC = () => {
  // Estado para controlar a visibilidade do modal de autenticação
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Estado para controlar se o modal está em modo 'login' ou 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Função para abrir o modal, que será passada para o Navbar
  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  // Função para alternar entre os modos de login e registro dentro do modal
  const handleToggleAuthMode = () => {
    setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      {/* Passamos a função para abrir o modal para o Navbar. 
        O Navbar não precisa saber os detalhes, apenas como pedir para abrir.
      */}
      <Navbar onLoginClick={() => handleOpenAuthModal('login')} />

      <main className="flex-grow pt-20"> {/* pt-20 para dar espaço para o Navbar fixo */}
        {/* O <Outlet /> renderiza a página da rota atual (Home, Shop, etc.) aqui */}
        <Outlet />
      </main>

      <Footer />

      {/* O AuthModal é renderizado aqui e sua visibilidade e modo 
        são controlados pelo estado do MainLayout.
      */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        mode={authMode}
        onToggleMode={handleToggleAuthMode}
      />
    </div>
  );
};

export default MainLayout;