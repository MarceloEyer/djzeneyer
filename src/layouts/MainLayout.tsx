// src/layouts/MainLayout.tsx

import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';
import { siteConfig } from '../config/siteConfig'; // Importa nossa configuração

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

  // Construção de metas dinâmicas
  const canonicalUrl = `${siteConfig.siteUrl}${location.pathname}`;
  const title = siteConfig.defaultTitle;
  const description = siteConfig.defaultDescription;

  return (
    <>
      <Helmet>
        {/* SEO Básico */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={siteConfig.ogImage} />
        <meta property="og:site_name" content="DJ Zen Eyer" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={siteConfig.twitterHandle} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={siteConfig.twitterImage} />

        {/* Preload de fontes (os bundles de JS/CSS são gerenciados pelo WordPress) */}
        {siteConfig.fontPreloads.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
        
        {/* JSON-LD para AI crawlers e Google (agora dentro do Helmet) */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'MusicGroup', // Mais específico para um artista
                'name': 'DJ Zen Eyer',
                'url': siteConfig.siteUrl,
                'logo': siteConfig.logo,
                'sameAs': siteConfig.socialProfiles,
              },
              {
                '@type': 'WebSite',
                'url': siteConfig.siteUrl,
                'name': 'DJ Zen Eyer',
                'publisher': {
                  '@type': 'MusicGroup',
                  'name': 'DJ Zen Eyer'
                }
              }
            ],
          })}
        </script>
      </Helmet>

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