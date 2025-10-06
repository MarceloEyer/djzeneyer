// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';
import MusicPlayer from '../components/music/MusicPlayer';

const MainLayout: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeModal = () => {
    setIsAuthModalOpen(false);
  };

  const toggleAuthMode = () => {
    setAuthMode(prevMode => (prevMode === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-white">
      <Navbar onLoginClick={() => openModal('login')} />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <MusicPlayer />
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