// src/layouts/MainLayout.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/auth/AuthModal';
import { siteConfig } from '../config/siteConfig';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Callbacks otimizados com useCallback
  const openModal = useCallback((mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeModal = useCallback(() => setIsAuthModalOpen(false), []);

  const toggleAuthMode = useCallback(() => {
    setAuthMode(prev => (prev === 'login' ? 'register' : 'login'));
  }, []);

  // Memoização de valores computados
  const canonicalUrl = useMemo(
    () => `${siteConfig.siteUrl}${location.pathname}`.replace(/\/$/, ''),
    [location.pathname]
  );

  const title = siteConfig.defaultTitle;
  const description = siteConfig.defaultDescription;

  // JSON-LD memoizado para performance
  const schemaJson = useMemo(() => JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MusicGroup',
        'name': 'DJ Zen Eyer',
        'alternateName': 'Zen Eyer',
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
  }), []);

  return (
    <>
      <Helmet>
        {/* SEO Básico */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta httpEquiv="Content-Language" content="pt-br, en" />

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

        {/* Multilíngue SEO */}
        <link rel="alternate" href="https://djzeneyer.com/" hrefLang="en" />
        <link rel="alternate" href="https://djzeneyer.com/pt/" hrefLang="pt" />
        <link rel="alternate" href="https://djzeneyer.com/" hrefLang="x-default" />

        {/* JSON-LD para AI e buscadores */}
        <script type="application/ld+json">
          {schemaJson}
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
