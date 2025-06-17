// src/contexts/CartContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useUser } from './UserContext'; // Usaremos para saber se o usuário está logado

interface CartContextType {
  cartKey: string | null;
  addToCart: (productId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Garantir que window.wpData esteja disponível
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
  const [cartKey, setCartKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ao iniciar a aplicação, tenta carregar uma cart_key já salva no localStorage.
  useEffect(() => {
    const savedCartKey = localStorage.getItem('cocart_cart_key');
    if (savedCartKey) {
      console.log('[CartContext] Chave do carrinho encontrada no localStorage:', savedCartKey);
      setCartKey(savedCartKey);
    }
  }, []);

  const addToCart = useCallback(async (productId: number) => {
    setLoading(true);
    setError(null);
    console.log(`[CartContext] Adicionando produto ${productId} ao carrinho...`);

    // Usaremos o endpoint do CoCart que espera "id" como parâmetro
    let apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}cocart/v2/cart/add-item`;

    // Se já temos uma chave de carrinho, a enviamos na URL para manter a sessão
    if (cartKey) {
      apiUrl += `?cart_key=${cartKey}`;
      console.log('[CartContext] Enviando com a cart_key existente.');
    }

    const body = { id: String(productId), quantity: 1 };
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    // Se o usuário estiver logado, envia o token JWT para associar o carrinho a ele
    if (user?.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const responseData = await response.json();
      console.log('[CartContext] Resposta do CoCart:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || `Erro do servidor: ${response.status}`);
      }
      
      // Captura e salva a cart_key retornada pela API
      if (responseData.cart_key && responseData.cart_key !== cartKey) {
        console.log('[CartContext] Nova chave do carrinho recebida e salva:', responseData.cart_key);
        setCartKey(responseData.cart_key);
        localStorage.setItem('cocart_cart_key', responseData.cart_key);
      }
      
    } catch (err: any) {
      console.error("[CartContext] FALHA ao adicionar ao carrinho:", err);
      setError(err.message);
      throw err; // Lança o erro para o componente que chamou
    } finally {
      setLoading(false);
    }
  }, [cartKey, user]);

  const value = { cartKey, addToCart, loading, error };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Hook customizado para usar o contexto do carrinho facilmente em outros componentes
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};