// src/contexts/CartContext.tsx
import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from 'react';
import { buildApiUrl } from '../config/api';

// Interface para os dados do carrinho que virão da API
export interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  price: string | number;
  images?: { src: string }[];
  totals?: { line_total: string | number };
  [key: string]: unknown;
}

export interface CartData {
  items: CartItem[];
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
    } catch (err) {
      const error = err as Error;
      console.error("[CartContext] Erro ao buscar carrinho:", error);
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
          'X-WP-Nonce': ((window as unknown) as { wpData?: { nonce: string } }).wpData?.nonce || ''
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to remove item');
      }

      // Update cart state after removal
      await getCart();

    } catch (err) {
      const error = err as Error;
      console.error("[CartContext] Error removing item:", error);
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
          'X-WP-Nonce': ((window as unknown) as { wpData?: { nonce: string } }).wpData?.nonce || ''
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

    } catch (err) {
      const error = err as Error;
      console.error("[CartContext] Error clearing cart:", error);
    } finally {
      setLoading(false);
    }
  }, [getCart]);

  const value = useMemo<CartContextType>(() => ({
    cart,
    getCart,
    removeItem,
    clearCart,
    loading
  }), [cart, getCart, removeItem, clearCart, loading]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
