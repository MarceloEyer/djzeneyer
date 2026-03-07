import React, { Suspense, lazy, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/common/Footer';
import { HeadlessSEO } from '../components/HeadlessSEO';
import ScrollToTop from '../components/ScrollToTop';

const AuthModal = lazy(() => import('../components/auth/AuthModal'));

const MainLayout: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openModal = () => {
    setIsAuthModalOpen(true);
  };
  const closeModal = () => setIsAuthModalOpen(false);

  return (
    <>
      <ScrollToTop />
      <HeadlessSEO />

      <div className="flex flex-col min-h-screen bg-background text-white">
        <Navbar onLoginClick={openModal} />

        <main className="flex-grow pt-20">
          <Outlet />
        </main>

        <Footer />

        {isAuthModalOpen ? (
          <Suspense fallback={null}>
            <AuthModal isOpen={isAuthModalOpen} onClose={closeModal} />
          </Suspense>
        ) : null}
      </div>
    </>
  );
};

export default MainLayout;
