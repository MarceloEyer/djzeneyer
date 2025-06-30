// src/contexts/CartContext.tsx

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { useUser } from './UserContext';

// A interface do contexto fica mais simples
interface CartContextType {
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Declaração global para o objeto wpData
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Não precisamos mais do state e do useEffect para a cart_key

  const addToCart = useCallback(async (productId: number, quantity: number = 1) => {
    setLoading(true);
    setError(null);
    console.log(`[CartContext] Adicionando produto ${productId} ao carrinho...`);

    // ALTERADO: Apontando para o nosso endpoint customizado no functions.php
    const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}djzeneyer/v1/add-to-cart`;

    const body = { 
      product_id: productId, // Nosso endpoint espera 'product_id'
      quantity: quantity 
    };
    
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    // Se o usuário estiver logado, envia o token JWT
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: 'include' // Importante para enviar os cookies de sessão do WordPress
      });

      const responseData = await response.json();
      console.log('[CartContext] Resposta do nosso endpoint:', responseData);

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.message || `O servidor respondeu com o status ${response.status}`);
      }
      
      // SUCESSO! Não precisamos mais salvar a cart_key. O WooCommerce cuida de tudo.
      console.log('[CartContext] Produto adicionado com sucesso!');

    } catch (err: any) {
      console.error("[CartContext] FALHA ao adicionar ao carrinho:", err);
      setError(err.message);
      throw err; // Lança o erro para o componente que chamou (ShopPage) poder reagir
    } finally {
      setLoading(false);
    }
  }, [user]);

  // O valor do contexto agora é mais simples
  const value = { addToCart, loading, error };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook customizado para usar o contexto do carrinho
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};