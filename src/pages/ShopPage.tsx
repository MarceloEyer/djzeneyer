// src/pages/ShopPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Garante que window.wpData esteja acessível globalmente
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

// Interface simplificada do produto para o WooCommerce
interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string | boolean;
  on_sale: boolean;
  images: { src: string; alt: string }[];
  short_description: string;
}

// Traduções de fallback
const fallbackTexts = {
  shop_page_title: 'Loja de Ingressos',
  shop_loading_text: 'Carregando produtos...',
  shop_error_loading_products: 'Erro ao carregar produtos',
  shop_no_products_found: 'Nenhum produto encontrado',
  shop_add_to_cart_button: 'Adicionar ao Carrinho',
  shop_adding_text: 'Adicionando...',
  shop_added_text: 'Adicionado!',
  shop_error_text: 'Erro',
  shop_product_added_alert: 'Produto adicionado ao carrinho!',
  shop_add_to_cart_error_generic: 'Erro ao adicionar produto ao carrinho',
  shop_add_to_cart_error_prefix: 'Erro:',
  shop_try_again_suffix: 'Tente novamente'
};

const ShopPage: React.FC = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para controlar o feedback visual de cada botão
  const [cartStatus, setCartStatus] = useState<Record<number, 'idle' | 'adding' | 'added' | 'error'>>({});

  // Função de tradução segura com fallback
  const safeT = (key: keyof typeof fallbackTexts): string => {
    try {
      const translation = t(key);
      return translation === key ? fallbackTexts[key] : translation;
    } catch {
      return fallbackTexts[key];
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!window.wpData || !window.wpData.restUrl) {
          throw new Error('WordPress data not available');
        }
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/products-public?per_page=12`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(safeT('shop_error_loading_products'));
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Função de adicionar ao carrinho melhorada
  const addToCart = async (productId: number) => {
    setCartStatus(prev => ({ ...prev, [productId]: 'adding' }));
    
    try {
      if (!window.wpData || !window.wpData.restUrl) {
        throw new Error('WordPress configuration not available');
      }

      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCartStatus(prev => ({ ...prev, [productId]: 'added' }));
        // Remove a mensagem de sucesso após 2 segundos
        setTimeout(() => setCartStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
      } else {
        throw new Error(data.message || safeT('shop_add_to_cart_error_generic'));
      }
    } catch (err: any) {
      console.error("Add to Cart Error:", err);
      setCartStatus(prev => ({ ...prev, [productId]: 'error' }));
      // Opcional: mostrar um alerta de erro ou apenas mudar o estado do botão
      alert(`${safeT('shop_add_to_cart_error_prefix')} ${err.message}`);
      setTimeout(() => setCartStatus(prev => ({ ...prev, [productId]: 'idle' })), 2000);
    }
  };

  // Função de formatação de preço segura
  const formatPrice = (price: string | number): string => {
    if (!price) return 'R$ 0,00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    // ... (código de loading sem alterações) ...
  }

  if (error) {
    // ... (código de erro sem alterações) ...
  }

  return (
    <motion.div
      className="container mx-auto px-4 pt-24 pb-10 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Título da Página */}
      <motion.div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display ...">
            {safeT('shop_page_title')}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
      </motion.div>

      {/* Grid de Produtos */}
      <motion.div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p>{safeT('shop_no_products_found')}</p>
          </div>
        ) : (
          products.map((product, index) => (
            <motion.div
              key={product.id}
              // ... (código de animação e card do produto sem alterações) ...
            >
              {/* Imagem do Produto */}
              <Link to={`/product/${product.slug}`}>
                  {/* ... (código da imagem sem alterações) ... */}
              </Link>

              {/* Informações do Produto */}
              <div className="p-6">
                <h2 className="text-xl font-semibold ...">
                  <Link to={`/product/${product.slug}`}>{product.name}</Link>
                </h2>
                
                {product.short_description && (
                  <div className="text-sm ..." dangerouslySetInnerHTML={{ __html: product.short_description }} />
                )}

                {/* Preço */}
                <div className="text-lg font-bold mb-6">
                  {/* ... (lógica de preço de promoção sem alterações) ... */}
                </div>

                {/* Botão Adicionar ao Carrinho (MODIFICADO) */}
                <button
                  onClick={() => addToCart(product.id)}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    cartStatus[product.id] === 'added' ? 'bg-green-500 hover:bg-green-600' :
                    cartStatus[product.id] === 'error' ? 'bg-red-500 hover:bg-red-600' :
                    'bg-primary hover:bg-primary/90'
                  }`}
                  disabled={cartStatus[product.id] === 'adding'}
                >
                  {cartStatus[product.id] === 'adding' ? (
                    <><Loader2 size={18} className="animate-spin" /><span>{safeT('shop_adding_text')}</span></>
                  ) : cartStatus[product.id] === 'added' ? (
                    <><CheckCircle size={18} /><span>{safeT('shop_added_text')}</span></>
                  ) : cartStatus[product.id] === 'error' ? (
                    <><AlertTriangle size={18} /><span>{safeT('shop_error_text')}</span></>
                  ) : (
                    <><ShoppingCart size={18} /><span>{safeT('shop_add_to_cart_button')}</span></>
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default ShopPage;