// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';

const MainLayout: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Funções para controlar o AuthModal a partir do MainLayout
  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      {/* O Navbar agora recebe a função para abrir o modal */}
      <Navbar onLoginClick={() => openAuthModal('login')} />

      <main className="flex-grow pt-20"> {/* pt-20 para dar espaço para o Navbar fixo */}
        
        {/* --- TESTE DA IMPRESSÃO DIGITAL --- */}
        <h2 style={{ 
          color: 'yellow', 
          backgroundColor: 'red', 
          padding: '15px', 
          textAlign: 'center', 
          fontSize: '22px', 
          fontWeight: 'bold',
          position: 'sticky', // Garante que ele fique visível mesmo com scroll
          top: '80px',      // Abaixo do navbar
          zIndex: 9999
        }}>
          BUILD ATUALIZADO - TESTE DE DEPLOY
        </h2>
        {/* --- FIM DO TESTE --- */}

        {/* O Outlet renderiza a página da rota atual (Home, Work With Me, etc.) aqui */}
        <Outlet />
      </main>

      <Footer />

      {/* O AuthModal é controlado pelo estado deste layout */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        mode={authMode}
        onToggleMode={toggleAuthMode}
      />
    </div>
  );
};

export default MainLayout;