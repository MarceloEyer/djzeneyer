// src/pages/ShopPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

// Ensure window.wpData is globally accessible (provided by WordPress)
declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

// Simplified product type definition for WooCommerce
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

// Fallback translations
const fallbackTexts = {
  shop_page_title: 'Loja de Ingressos',
  shop_loading_text: 'Carregando produtos...',
  shop_error_loading_products: 'Erro ao carregar produtos',
  shop_no_products_found: 'Nenhum produto encontrado',
  shop_add_to_cart_button: 'Adicionar ao Carrinho',
  shop_adding_text: 'Adicionando...',
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
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Safe translation function with fallback
  const safeT = (key: keyof typeof fallbackTexts): string => {
    try {
      const translation = t(key);
      // If translation returns the key itself (not translated), use fallback
      return translation === key ? fallbackTexts[key] : translation;
    } catch {
      return fallbackTexts[key];
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if wpData is available
        if (!window.wpData || !window.wpData.restUrl) {
          throw new Error('WordPress data not available');
        }

        console.log('Fetching from:', `${window.wpData.restUrl}djzeneyer/v1/products-public`);
        
        const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/products-public?per_page=10`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products fetched:', data);
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

  // Enhanced add to cart function with better error handling
  const addToCart = async (productId: number, quantity: number = 1) => {
    setAddingToCart(productId);
    
    try {
      // Check if wpData is available
      if (!window.wpData || !window.wpData.restUrl) {
        throw new Error('WordPress configuration not available');
      }

      console.log('Adding to cart:', { productId, quantity });
      
      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/add-to-cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: quantity
        }),
        credentials: 'include'
      });

      console.log('Add to cart response status:', response.status);
      
      const data = await response.json();
      console.log('Add to cart response data:', data);

      if (response.ok && data.success) {
        alert(safeT('shop_product_added_alert'));
        // Redirect to checkout
        const checkoutUrl = data.checkout_url || `${window.wpData.siteUrl}/checkout/`;
        window.location.href = checkoutUrl;
      } else {
        throw new Error(data.message || safeT('shop_add_to_cart_error_generic'));
      }
    } catch (err: any) {
      console.error("Add to Cart Error:", err);
      alert(`${safeT('shop_add_to_cart_error_prefix')} ${err.message || safeT('shop_try_again_suffix')}`);
    } finally {
      setAddingToCart(null);
    }
  };

  // Format price safely
  const formatPrice = (price: string | number): string => {
    if (!price) return 'R$ 0,00';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center bg-background text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="mt-4 text-lg">{safeT('shop_loading_text')}</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen flex flex-col items-center justify-center text-red-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <AlertCircle size={48} className="mb-4" />
        <p className="text-lg text-center">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
        >
          Tentar Novamente
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="container mx-auto px-4 pt-24 pb-10 text-white" // Increased top padding
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Title with better positioning */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {safeT('shop_page_title')}
        </h1>
        <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full"></div>
      </motion.div>

      {/* Products Grid */}
      <motion.div 
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {products.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-xl text-white/70 mb-4">{safeT('shop_no_products_found')}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
            >
              Recarregar
            </button>
          </div>
        ) : (
          products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="bg-surface/80 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:border-primary/30"
            >
              {/* Product Image */}
              <Link to={`/product/${product.slug}`} className="block">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].src}
                    alt={product.images[0].alt || product.name}
                    className="w-full h-56 object-cover transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-3 text-white hover:text-primary transition">
                  <Link to={`/product/${product.slug}`}>
                    {product.name}
                  </Link>
                </h2>
                
                {product.short_description && (
                  <div
                    className="text-sm text-white/70 mb-4 line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                )}

                {/* Price */}
                <div className="text-lg font-bold mb-6">
                  {product.on_sale ? (
                    <div className="flex flex-col">
                      <span className="line-through text-white/50 text-sm">
                        {formatPrice(product.regular_price)}
                      </span>
                      <span className="text-primary text-xl">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-white text-xl">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  disabled={addingToCart === product.id}
                >
                  {addingToCart === product.id ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>{safeT('shop_adding_text')}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      <span>{safeT('shop_add_to_cart_button')}</span>
                    </>
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