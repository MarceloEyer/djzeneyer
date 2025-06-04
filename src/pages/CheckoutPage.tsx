// src/pages/CheckoutPage.tsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

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

const CheckoutPage: React.FC = () => {
  useEffect(() => {
    // A página de checkout do WordPress é renderizada pelo seu page-react-app.php (agora woocommerce.php)
    // O JavaScript do WooCommerce vai procurar por um div com id="woocommerce" ou classes específicas
    // e injetar o formulário de checkout lá.
    // Não precisamos de um redirecionamento complexo aqui, apenas garantimos que o React renderize
    // um container onde o WP/WooCommerce pode atuar.

    // Se a página for acessada diretamente, pode levar um tempo para o WooCommerce carregar.
    // Você pode adicionar um loader ou uma mensagem.
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 text-white min-h-[60vh] flex flex-col items-center justify-center"
    >
      <h1 className="text-4xl font-bold font-display mb-8 text-center">Finalizar Compra</h1>
      <p className="text-white/70 text-lg text-center mb-4">Carregando seu formulário de checkout...</p>
      <p className="text-white/70 text-sm text-center">Isso pode levar alguns instantes enquanto os scripts do WooCommerce são carregados.</p>
      {/* O formulário de checkout do WooCommerce será injetado pelo WordPress/WooCommerce aqui */}
      {/* Você pode adicionar um div com um ID ou classe específica se o tema WooCommerce precisar,
          mas geralmente ele se injeta no conteúdo principal. */}
      {/* Ex: <div id="woocommerce-checkout-form-wrapper"></div> */}
    </motion.div>
  );
};

export default CheckoutPage;