// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, CheckCircle } from 'lucide-react';
// import { useUser } from '../contexts/UserContext'; // Descomente se precisar de lógica de utilizador aqui

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  on_sale: boolean;
  images: { src: string; alt: string }[];
  short_description: string;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estado para controlar o feedback de CADA botão individualmente
  const [cartStatus, setCartStatus] = useState<Record<number, 'idle' | 'adding' | 'added'>>({});
  
  // const { user } = useUser(); // Opcional: para lógicas futuras

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${window.wpData.restUrl}wc/v3/products?per_page=12&status=publish`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos da loja.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- FUNÇÃO addToCart MELHORADA ---
  // Agora é assíncrona, não recarrega a página e dá feedback visual.
  const addToCart = async (productId: number) => {
    // 1. Dar feedback imediato que a ação começou
    setCartStatus(prev => ({ ...prev, [productId]: 'adding' }));

    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          id: productId,
          quantity: 1,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível adicionar o item.');
      }

      // 2. Sucesso! Dar feedback visual.
      setCartStatus(prev => ({ ...prev, [productId]: 'added' }));
      
      // 3. A GAMIFICAÇÃO ACONTECE NO BACKEND
      // O GamiPress irá "ouvir" esta ação no WordPress e atribuir os pontos.
      // O frontend fez a sua parte.

      // Reverte o botão para o estado normal após alguns segundos
      setTimeout(() => {
        setCartStatus(prev => ({ ...prev, [productId]: 'idle' }));
      }, 2000);

    } catch (err: any) {
      console.error('Erro ao adicionar ao carrinho:', err);
      alert(`Erro: ${err.message}`);
      setCartStatus(prev => ({ ...prev, [productId]: 'idle' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="mt-4 text-lg font-display">A carregar a Zen Shop...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-16 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold font-display text-center mb-12 tracking-tight">
        Zen Shop
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length === 0 ? (
          <p className="col-span-full text-center text-white/70">Nenhum produto disponível no momento.</p>
        ) : (
          products.map((product) => (
            <motion.div
              key={product.id}
              className="bg-surface border border-white/10 rounded-xl shadow-lg overflow-hidden flex flex-col"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link to={`/product/${product.slug}`} className="block">
                <img
                  src={product.images[0]?.src || 'https://placehold.co/600x600/101418/6366F1?text=DJ+Zen+Eyer'}
                  alt={product.images[0]?.alt || product.name}
                  className="w-full h-56 object-cover"
                />
              </Link>

              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold mb-2 flex-grow">{product.name}</h2>
                
                <p className="text-lg font-bold mb-4">
                  R$ {product.price}
                </p>

                <button
                  onClick={() => addToCart(product.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md text-white font-medium transition-all duration-300 ${
                    cartStatus[product.id] === 'added' 
                      ? 'bg-green-500 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90'
                  } ${
                    cartStatus[product.id] === 'adding' && 'opacity-50 cursor-not-allowed'
                  }`}
                  disabled={cartStatus[product.id] === 'adding' || cartStatus[product.id] === 'added'}
                >
                  {cartStatus[product.id] === 'adding' ? (
                    <><Loader2 className="animate-spin" size={18} /><span>A adicionar...</span></>
                  ) : cartStatus[product.id] === 'added' ? (
                    <><CheckCircle size={18} /><span>Adicionado!</span></>
                  ) : (
                    <><ShoppingCart size={18} /><span>Adicionar ao Carrinho</span></>
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ShopPage;
