// src/pages/MyAccountPage.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext'; // Para verificar se o usuário está logado

// Certifique-se de que window.wpData está acessível
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

const MyAccountPage: React.FC = () => {
  const { user, loading } = useUser();

  useEffect(() => {
    // Se o usuário não estiver logado no nosso contexto React, e o WordPress não redirecionar automaticamente,
    // podemos forçar um redirecionamento para a página de login do WordPress (ou nosso modal).
    // O ideal é que o próprio WordPress (com WooCommerce) gerencie o acesso a /my-account
    // se o usuário não estiver logado. A página default de My Account do WooCommerce faria isso.
    // Aqui, apenas carregamos a estrutura base para o WP injetar seu conteúdo.
  }, [user, loading]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background text-white p-4"
      >
        <p>Carregando Minha Conta...</p>
      </motion.div>
    );
  }

  // Se o usuário estiver logado no WordPress (e o WP Mail SMTP ajuda a manter a sessão),
  // o WooCommerce injetará o conteúdo aqui.
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 text-white min-h-[60vh] flex flex-col items-center justify-center"
    >
      <h1 className="text-4xl font-bold font-display mb-8 text-center">Minha Conta Zen</h1>
      <p className="text-white/70 text-lg text-center mb-4">Bem-vindo(a) à sua área de cliente.</p>
      {/* O conteúdo da Minha Conta do WooCommerce será injetado pelo WordPress/WooCommerce aqui */}
      {/* O próprio WooCommerce cuida de mostrar login se o usuário não estiver autenticado */}
    </motion.div>
  );
};

export default MyAccountPage;