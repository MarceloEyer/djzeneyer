import React, { Suspense, lazy, useState, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/ScrollToTop';
import { findKeyByPath } from '../config/routes';

const AuthModal = lazy(() => import('../components/auth/AuthModal'));

const MainLayout: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();

  const routeKey = findKeyByPath(location.pathname);
  const isZenLink = routeKey === 'zenlink';

  // ⚡ Bolt: Wrapped with useCallback to preserve function reference and prevent unnecessary re-renders in Navbar (which is wrapped in React.memo)
  const openModal = useCallback(() => {
    setIsAuthModalOpen(true);
  }, []);

  // ⚡ Bolt: Wrapped with useCallback to preserve function reference
  const closeModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return (
    <>
      <ScrollToTop />

      <div className={`flex flex-col min-h-screen bg-background text-white ${isZenLink ? 'pt-0' : ''}`}>
        {!isZenLink && <Navbar onLoginClick={openModal} />}

        <main className={`flex-grow ${!isZenLink ? 'pt-20' : ''}`}>
          <Outlet />
        </main>

        {!isZenLink && <Footer />}

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
