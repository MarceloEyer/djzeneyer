import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import MusicPlayer from '../components/music/MusicPlayer';
import AuthModal from '../components/auth/AuthModal';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

const MainLayout: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const location = useLocation();
  const { currentTrack } = useMusicPlayer();

  // Reset scroll position when changing routes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const openLoginModal = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegisterModal} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Render music player if there's a current track */}
      {currentTrack && (
        <div className="sticky bottom-0 z-30">
          <MusicPlayer />
        </div>
      )}
      
      <Footer />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal} 
        mode={authMode} 
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} 
      />
    </div>
  );
};

export default MainLayout;