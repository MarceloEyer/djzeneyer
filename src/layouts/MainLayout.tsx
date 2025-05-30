// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar'; // Ajuste o caminho se for diferente
import Footer from '../components/common/Footer';   // Ajuste o caminho se for diferente
import MusicPlayer from '../components/music/MusicPlayer'; // Ajuste o caminho se for diferente
import AuthModal from '../components/auth/AuthModal';     // Ajuste o caminho se for diferente
import { useMusicPlayer } from '../contexts/MusicPlayerContext'; // Ajuste o caminho se for diferente

const MainLayout: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { currentTrack } = useMusicPlayer();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // console.log('[MainLayout] Estado showAuthModal mudou para:', showAuthModal);
  }, [showAuthModal]);

  const openLoginModal = () => {
    // console.log('[MainLayout] openLoginModal chamada!');
    setAuthMode('login');
    setShowAuthModal(true);
  };

  // Mantida caso haja necessidade futura de abrir modal diretamente em modo registro de outro local
  // const openRegisterModal = () => {
  //   console.log('[MainLayout] openRegisterModal chamada!');
  //   setAuthMode('register');
  //   setShowAuthModal(true);
  // };

  const closeAuthModal = () => {
    // console.log('[MainLayout] closeAuthModal chamada!');
    setShowAuthModal(false);
  };

  const toggleAuthMode = () => {
    // console.log('[MainLayout] toggleAuthMode chamada! Modo anterior:', authMode);
    setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onLoginClick={openLoginModal} 
        // onRegisterClick não é mais passada, pois Navbar foi simplificado
      />
      
      <main className="flex-grow">
        <Outlet /> {/* É aqui que seus componentes de página como HomePage são renderizados */}
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