// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useUser } from './UserContext';

// Interface para os dados do carrinho que virão da API
interface CartData {
  items: any[]; // Simplificado, pode ser detalhado depois
  totals: {
    total_price: string;
  };
}

interface CartContextType {
  cart: CartData | null;
  getCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);

  const getCart = useCallback(async () => {
    setLoading(true);
    const wpRestUrl = window.wpData?.restUrl || import.meta.env.VITE_WP_REST_URL || 'https://djzeneyer.com/wp-json/';
    const apiUrl = `${wpRestUrl}wc/store/v1/cart`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || 'Falha ao buscar carrinho');
      setCart(responseData);
    } catch (err: any) {
      console.error("[CartContext] Erro ao buscar carrinho:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = { cart, getCart, loading };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};