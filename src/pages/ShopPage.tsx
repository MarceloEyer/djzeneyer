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
  sale_price?: string;
  images: { src: string; alt: string }[];
  stock_status: string;
  type: string;
  status: string;
}

const ShopPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartStatus, setCartStatus] = useState<Record<number, 'idle' | 'adding' | 'added' | 'error'>>({});
  const { user } = useUser();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}wc/store/v1/products`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API da Loja: ${errorData.message || response.statusText}`);
      }
      const data = await response.json();
      const normalizedData = data.map(normalizeProduct);
      setProducts(normalizedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const normalizeProduct = (productData: any): Product => {
    return {
      id: productData.id || 0,
      name: productData.name || 'Produto sem nome',
      slug: productData.slug || `product-${productData.id}`,
      price: String((parseFloat(productData.prices?.price || '0') / 100).toFixed(2)),
      on_sale: productData.on_sale || false,
      regular_price: String((parseFloat(productData.prices?.regular_price || '0') / 100).toFixed(2)),
      sale_price: String((parseFloat(productData.prices?.sale_price || '0') / 100).toFixed(2)),
      images: productData.images || [],
      stock_status: productData.is_in_stock ? 'instock' : 'outofstock',
      type: productData.type || 'simple',
      status: productData.status || 'publish'
    };
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addToCart = async (productId: number) => {
    console.log("--- Iniciando Adicionar ao Carrinho ---");
    setCartStatus(prev => ({ ...prev, [productId]: 'adding' }));

    const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}cocart/v2/cart/add-item`;
    
    // CORREÇÃO APLICADA AQUI: mudamos 'product_id' para 'id' para corresponder à mensagem de erro
    const body = {
        id: String(productId),
        quantity: 1
    };

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    
    if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
    }
    
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body),
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.message || `O servidor respondeu com o status ${response.status}`);
        }

        console.log("SUCESSO: Produto adicionado ao carrinho!", responseData);
        setCartStatus(prev => ({ ...prev, [productId]: 'added' }));
        setTimeout(() => setCartStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);

    } catch (err: any) {
        console.error("FALHA ao adicionar ao carrinho:", err);
        alert(`Erro ao adicionar ao carrinho: ${err.message}`);
        setCartStatus(prev => ({ ...prev, [productId]: 'error' }));
        setTimeout(() => setCartStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
    } finally {
        console.log("--- Fim Adicionar ao Carrinho ---");
    }
  };

  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'Preço sob consulta' : `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="mt-6 text-xl font-medium">Carregando a Zen Shop...</p>
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
              <div className="mb-4">
                {product.on_sale && parseFloat(product.sale_price || '0') > 0 ? (
                  <div>
                    <span className="text-lg text-gray-400 line-through mr-2">
                      {formatPrice(product.regular_price)}
                    </span>
                    <span className="text-xl font-bold text-green-400">
                      {formatPrice(product.sale_price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-xl font-bold">{formatPrice(product.price)}</span>
                )}
              </div>
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
                  {cartStatus[product.id] === 'adding' && <><Loader2 className="animate-spin" size={18} /><span>Adicionando...</span></>}
                  {cartStatus[product.id] === 'added' && <><CheckCircle size={18} /><span>Adicionado!</span></>}
                  {cartStatus[product.id] === 'error' && <><AlertTriangle size={18} /><span>Erro</span></>}
                  {(!cartStatus[product.id] || cartStatus[product.id] === 'idle') && <><ShoppingCart size={18} /><span>Adicionar</span></>}
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