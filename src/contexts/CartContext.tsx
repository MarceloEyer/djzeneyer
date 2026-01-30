// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useUser } from './UserContext';
import { buildApiUrl } from '../config/api';

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
  removeItem: (key: string) => Promise<void>;
  clearCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);

  const getCart = useCallback(async () => {
    setLoading(true);
    const apiUrl = buildApiUrl('wc/store/v1/cart');

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

  const removeItem = useCallback(async (key: string) => {
    setLoading(true);
    // Uses the dedicated WooCommerce Store API endpoint for item removal
    const apiUrl = buildApiUrl(`wc/store/v1/cart/items/${key}`);

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': (window as any).wpData?.nonce || ''
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove item');
      }

      // Update cart state after removal
      await getCart();

    } catch (err: any) {
      console.error("[CartContext] Error removing item:", err);
    } finally {
      setLoading(false);
    }
  }, [getCart]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    // Uses the dedicated WooCommerce Store API endpoint to clear the cart
    // Using DELETE on /items clears all items according to documentation
    const apiUrl = buildApiUrl('wc/store/v1/cart/items');

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': (window as any).wpData?.nonce || ''
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to clear cart');
      }

      // Update cart state after clearing
      // We call getCart() to ensure we have the correct empty state structure (totals, etc)
      await getCart();

    } catch (err: any) {
      console.error("[CartContext] Error clearing cart:", err);
    } finally {
      setLoading(false);
    }
  }, [getCart]);

  const value = { cart, getCart, removeItem, clearCart, loading };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
