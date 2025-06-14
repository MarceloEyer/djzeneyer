// src/pages/ShopPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

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
  on_sale: boolean;
  regular_price: string;
  images: { src: string; alt: string }[];
  stock_status: string;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartStatus, setCartStatus] = useState<Record<number, 'idle' | 'adding' | 'added' | 'error'>>({});
  const { user } = useUser();

  // CORRIGIDO: Esta função agora inclui autenticação para a API do WooCommerce.
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Pega as chaves de API das variáveis de ambiente que o Vite fornece
    const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;

    // Validação: Verifica se as chaves foram carregadas do arquivo .env.local
    if (!consumerKey || !consumerSecret) {
      setError("Erro de Configuração: As chaves da API do WooCommerce não foram encontradas. Verifique seu arquivo .env.local e reinicie o servidor.");
      setLoading(false);
      return;
    }

    if (!window.wpData?.restUrl) {
      setError("Erro de Configuração: Não foi possível conectar ao WordPress.");
      setLoading(false);
      return;
    }

    // Monta a URL completa COM as chaves de autenticação como parâmetros
    const apiUrl = `${window.wpData.restUrl}wc/v3/products?per_page=12&status=publish&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API do WooCommerce: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = async (productId: number) => {
    if (!window.wpData?.restUrl) {
      alert("Ação indisponível. Por favor, recarregue a página.");
      return;
    }
    
    setCartStatus(prev => ({ ...prev, [productId]: 'adding' }));

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    
    if (user && user.token) {
      headers['Authorization'] = `Bearer ${user.token}`;
    } else if (window.wpData.nonce) {
      headers['X-WP-Nonce'] = window.wpData.nonce;
    }

    try {
      const response = await fetch(`${window.wpData.restUrl}wc/store/v1/cart/add-item`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ id: productId, quantity: 1 }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Não foi possível adicionar o item.');
      }
      
      setCartStatus(prev => ({ ...prev, [productId]: 'added' }));
      setTimeout(() => setCartStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setCartStatus(prev => ({ ...prev, [productId]: 'idle' }));
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="mt-6 text-xl font-medium">A carregar a Zen Shop...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 text-center">
        <AlertTriangle size={56} className="text-yellow-400 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Ocorreu um Problema</h2>
        <p className="text-center max-w-md mb-6 text-gray-300">{error}</p>
        <button onClick={fetchProducts} className="btn bg-primary hover:bg-primary/90 flex items-center gap-2">
          <RefreshCw size={18} />
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 py-16 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-4xl md:text-6xl font-extrabold font-display text-center mb-12 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
        Zen Shop
      </h1>
      <motion.div
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-surface/50 border border-white/10 rounded-2xl shadow-xl flex flex-col"
          >
            <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-t-2xl">
              <motion.img
                src={product.images[0]?.src || 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer'}
                alt={product.images[0]?.alt || product.name}
                className="w-full h-64 object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-3 flex-grow line-clamp-2">{product.name}</h2>
              <p className="text-xl font-bold mb-4">R$ {product.price}</p>
              {product.stock_status === 'outofstock' ? (
                <button disabled className="w-full py-3 px-4 bg-gray-600 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  Fora de Estoque
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product.id)}
                  className={`w-full btn py-3 transition-all duration-300 flex items-center justify-center gap-2 ${
                    cartStatus[product.id] === 'added' ? 'bg-green-500 hover:bg-green-600' : 'bg-primary hover:bg-primary/90'
                  }`}
                  disabled={cartStatus[product.id] === 'adding'}
                >
                  {cartStatus[product.id] === 'adding' && <><Loader2 className="animate-spin" size={18} /><span>A adicionar...</span></>}
                  {cartStatus[product.id] === 'added' && <><CheckCircle size={18} /><span>Adicionado!</span></>}
                  {(!cartStatus[product.id] || cartStatus[product.id] === 'idle' || cartStatus[product.id] === 'error') && <><ShoppingCart size={18} /><span>Adicionar</span></>}
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ShopPage;