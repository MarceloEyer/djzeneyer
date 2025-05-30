// Caminho: src/layouts/MainLayout.tsx
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
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegisterModal = () => {
    // Esta função ainda existe aqui caso você queira um link direto para registro em outro lugar,
    // mas o Navbar agora usará principalmente openLoginModal para o botão unificado.
    console.log('[MainLayout] openRegisterModal chamada!');
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    console.log('[MainLayout] closeAuthModal chamada!');
    setShowAuthModal(false);
  };

  const toggleAuthMode = () => {
    console.log('[MainLayout] toggleAuthMode chamada!');
    setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Passando openLoginModal para ambos os clicks no Navbar, 
        já que o modal tem um toggle interno.
        Ou você pode criar uma função unificada como handleOpenAuth('login') aqui.
        Para manter a lógica de um único botão no Navbar simples, ele pode
        apenas chamar openLoginModal, e o usuário alterna no modal se necessário.
      */}
      <Navbar 
        onLoginClick={openLoginModal} 
        onRegisterClick={openRegisterModal} // Mantido caso Navbar ainda o use, mas focaremos em um botão
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