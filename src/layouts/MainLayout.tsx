// src/layouts/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
// ...

const MainLayout: React.FC = () => {
  // ...
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar onLoginClick={...} />

      <main className="flex-grow pt-20">

        {/* ADICIONE ESTA LINHA PARA O TESTE */}
        <h1 style={{ color: 'lime', backgroundColor: 'black', padding: '20px', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
          TESTE DE DEPLOY - VERSÃO ATUALIZADA
        </h1>

        <Outlet /> 
      </main>

      <Footer />
      {/* ... */}
    </div>
  );
};

export default MainLayout;