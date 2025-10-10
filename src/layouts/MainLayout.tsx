// src/layouts/MainLayout.tsx - VERSÃO CORRIGIDA

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal'; // <-- GARANTE A IMPORTAÇÃO PADRÃO
import { siteConfig } from '../config/siteConfig';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openModal = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeModal = () => setIsAuthModalOpen(false);
  const toggleAuthMode = () => setAuthMode(prev => (prev === 'login' ? 'register' : 'login'));

  // ... (o resto do seu código JSX e Helmet continua o mesmo)
  const canonicalUrl = `${siteConfig.siteUrl}${location.pathname}`.replace(/\/$/, '');
  const title = siteConfig.defaultTitle;
  const description = siteConfig.defaultDescription;
  return (
    <>
      <Helmet>{/* ... */}</Helmet>
      <div className="flex flex-col min-h-screen bg-background text-white">
        <Navbar onLoginClick={() => openModal('login')} />
        <main className="flex-grow pt-20">
          <Outlet />
        </main>
        <Footer />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeModal}
          mode={authMode}
          onToggleMode={toggleAuthMode}
        />
      </div>
    </>
  );
};

export default MainLayout;