// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar'; // Ajuste o caminho se necessário
import Footer from '../components/common/Footer';   // Ajuste o caminho se necessário
import MusicPlayer from '../components/music/MusicPlayer'; // Ajuste o caminho se necessário
import AuthModal from '../components/auth/AuthModal';     // Ajuste o caminho se necessário
import { useMusicPlayer } from '../contexts/MusicPlayerContext'; // Ajuste o caminho se necessário

const MainLayout: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { currentTrack } = useMusicPlayer();

  // Reset scroll position when changing routes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // DEBUG: Log showAuthModal state changes
  useEffect(() => {
    console.log('[MainLayout] Estado showAuthModal mudou para:', showAuthModal);
  }, [showAuthModal]);

  const openLoginModal = () => {
    console.log('[MainLayout] openLoginModal chamada!');
    setAuthMode('login'); // Garante que o modal abra no modo login
    setShowAuthModal(true);
  };

  // A função openRegisterModal é mantida caso você queira um gatilho
  // específico para registro em outro lugar do app, ou para o toggle do modal.
  const openRegisterModal = () => {
    console.log('[MainLayout] openRegisterModal chamada!');
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    console.log('[MainLayout] closeAuthModal chamada!');
    setShowAuthModal(false);
  };

  const toggleAuthMode = () => {
    console.log('[MainLayout] toggleAuthMode chamada! Modo anterior:', authMode);
    setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onLoginClick={openLoginModal} 
        // onRegisterClick={openRegisterModal} // Removido, pois Navbar agora usa onLoginClick para o botão principal
                                            // e o AuthModal tem seu próprio toggle.
                                            // Se você quiser manter um botão "Join Tribe" separado no Navbar
                                            // que abre diretamente em modo register, você pode descomentar
                                            // e ajustar o Navbar para usar onRegisterClick para esse botão específico.
                                            // Por enquanto, o Navbar foi simplificado.
      />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {currentTrack && (
        <div className="sticky bottom-0 z-30">
          <MusicPlayer />
        </div>
      )}
      
      <Footer />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal} 
        mode={authMode} 
        onToggleMode={toggleAuthMode} 
      />
    </div>
  );
};

export default MainLayout;