import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
