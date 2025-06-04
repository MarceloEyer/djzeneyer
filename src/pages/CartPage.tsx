// src/pages/CartPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

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

interface CartItem {
  key: string;
  id: number;
  name: string;
  quantity: number;
  price: string; // Preço do item
  totals: {
    line_total: string; // Total da linha (preço * quantidade)
  };
  featured_image: string; // URL da imagem
}

interface CartTotals {
  total_items: string;
  total_items_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_price: string; // Total geral do carrinho
  total_tax: string;
  currency_code: string;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<{ items: CartItem[]; totals: CartTotals } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingCart, setUpdatingCart] = useState(false); // Estado para updates de quantidade

  const fetchCart = async () => {
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart`, {
        headers: {
          'X-WP-Nonce': window.wpData.nonce,
          // Cart API pode precisar de autenticação para usuários logados
          // 'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCart(data);
    } catch (err: any) {
      console.error("Erro ao buscar carrinho:", err);
      setError("Não foi possível carregar o carrinho.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCartItemQuantity = async (itemKey: string, newQuantity: number) => {
    setUpdatingCart(true);
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/update-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          key: itemKey,
          quantity: newQuantity,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCart(); // Recarrega o carrinho após a atualização
    } catch (err: any) {
      console.error("Erro ao atualizar quantidade do item:", err);
      alert(`Erro ao atualizar quantidade: ${err.message}`);
    } finally {
      setUpdatingCart(false);
    }
  };

  const removeCartItem = async (itemKey: string) => {
    setUpdatingCart(true);
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/remove-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          key: itemKey,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchCart(); // Recarrega o carrinho após remover o item
    } catch (err: any) {
      console.error("Erro ao remover item do carrinho:", err);
      alert(`Erro ao remover item: ${err.message}`);
    } finally {
      setUpdatingCart(false);
    }
  };


  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background text-white p-4"
      >
        <p>Carregando Carrinho...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center bg-background text-red-500 p-4"
      >
        <p>{error}</p>
      </motion.div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8 text-white min-h-[60vh] text-center"
      >
        <h1 className="text-4xl font-bold font-display mb-8">Seu Carrinho Zen</h1>
        <p className="text-white/70">Seu carrinho está vazio. <Link to="/shop" className="text-primary hover:underline">Explore nossa loja</Link> para encontrar seus ingressos!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8 text-white min-h-[60vh]"
    >
      <h1 className="text-4xl font-bold font-display mb-8 text-center">Seu Carrinho Zen</h1>
      {updatingCart && <p className="text-primary text-center mb-4">Atualizando carrinho...</p>}
      <div className="bg-surface rounded-lg shadow-lg overflow-hidden border border-white/10 p-6">
        <div className="space-y-4">
          {cart.items.map(item => (
            <div key={item.key} className="flex items-center space-x-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
              {item.featured_image && (
                <img src={item.featured_image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
              )}
              <div className="flex-grow">
                <Link to={`/product/${item.id}`} className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</Link>
                <p className="text-white/70 text-sm">Preço Unitário: R$ {item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateCartItemQuantity(item.key, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white text-center"
                  disabled={updatingCart}
                />
                <button
                  onClick={() => removeCartItem(item.key)}
                  className="text-red-500 hover:text-red-400 transition-colors"
                  disabled={updatingCart}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-xl font-bold mb-4">
            <span>Total do Carrinho:</span>
            <span>R$ {cart.totals.total_price}</span>
          </div>
          <Link
            to="/checkout"
            className="w-full btn btn-primary py-3 text-lg font-semibold text-center block"
          >
            Prosseguir para o Checkout
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;