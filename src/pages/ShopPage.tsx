// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, CheckCircle, AlertTriangle } from 'lucide-react';

declare global {
  interface Window {
    wpData?: {
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
  images: { src: string; alt: string }[];
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartStatus, setCartStatus] = useState<Record<number, 'idle' | 'adding' | 'added'>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      if (!window.wpData?.restUrl) {
        console.error("Erro de Configuração: o objeto window.wpData não foi encontrado.");
        setError("Não foi possível conectar ao WordPress para carregar os produtos.");
        setLoading(false);
        return;
      }

      try {
        // --- CORREÇÃO APLICADA AQUI ---
        // Adicionámos novamente o `headers` com o nonce de segurança,
        // que é necessário para autenticar o pedido ao seu WordPress.
        const response = await fetch(`${window.wpData.restUrl}wc/v3/products?per_page=12&status=publish`, {
          headers: {
            'X-WP-Nonce': window.wpData.nonce
          }
        });
        
        if (!response.ok) {
          // O erro 401 será capturado aqui
          throw new Error(`Ocorreu um erro na rede: ${response.statusText} (Status: ${response.status})`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Erro ao buscar produtos:", err);
        setError("Não foi possível carregar os produtos da loja. Verifique se está logado no WordPress, se necessário.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (productId: number) => {
    if (!window.wpData?.restUrl || !window.wpData.nonce) {
        alert("Erro de configuração: Não é possível adicionar ao carrinho.");
        return;
    }
      
    setCartStatus(prev => ({ ...prev, [productId]: 'adding' }));
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/add-item`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({ id: productId, quantity: 1 }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível adicionar o item.');
      }
      setCartStatus(prev => ({ ...prev, [productId]: 'added' }));
      setTimeout(() => {
        setCartStatus(prev => ({ ...prev, [productId]: 'idle' }));
      }, 2000);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setCartStatus(prev => ({ ...prev, [productId]: 'idle' }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="mt-4 text-lg">A carregar a Zen Shop...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-yellow-400 p-4">
        <AlertTriangle size={40} className="mb-4" />
        <h2 className="text-2xl font-bold mb-2">Erro de Conexão</h2>
        <p className="text-center max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-16 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold font-display text-center mb-12">
        Zen Shop
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
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
              <p className="text-lg font-bold mb-4">R$ {product.price}</p>
              <button
                onClick={() => addToCart(product.id)}
                className={`w-full btn transition-all duration-300 ${
                  cartStatus[product.id] === 'added' ? 'bg-green-500' : 'bg-primary hover:bg-primary/90'
                }`}
                disabled={cartStatus[product.id] === 'adding' || cartStatus[product.id] === 'added'}
              >
                {cartStatus[product.id] === 'adding' ? <><Loader2 className="animate-spin" size={18} /><span>A adicionar...</span></>
                 : cartStatus[product.id] === 'added' ? <><CheckCircle size={18} /><span>Adicionado!</span></>
                 : <><ShoppingCart size={18} /><span>Adicionar ao Carrinho</span></>}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShopPage;
