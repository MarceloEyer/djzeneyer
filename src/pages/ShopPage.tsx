// src/pages/ShopPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Loader2, 
  ShoppingCart, 
  AlertCircle, 
  Sparkles, 
  Zap, 
  Gift, 
  Star, 
  TrendingUp,
  Flame,
  Award,
  Lock
} from 'lucide-react';

// Interface para produtos
interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  on_sale: boolean;
  regular_price: string;
  sale_price: string;
  images: { src: string; alt: string }[];
  stock_status: string;
  lang: string; // Idioma do produto
}

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  console.log('[ShopPage] 🎮 Idioma atual:', currentLang);

  // Busca produtos do custom endpoint com filtro Polylang
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log('[ShopPage] 🔄 Buscando produtos - Idioma:', currentLang);

    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    
    // USA O CUSTOM ENDPOINT com filtro de idioma
    const apiUrl = `${baseUrl}djzeneyer/v1/products?lang=${currentLang}`;
    
    console.log('[ShopPage] 📡 Custom endpoint:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('[ShopPage] 📥 Status:', response.status);

      if (!response.ok) {
        throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      }

      const data = await response.json();
      console.log('[ShopPage] ✅ Produtos recebidos:', data.length);
      console.log('[ShopPage] 📊 Dados:', data);

      // Produtos já vêm filtrados por idioma do backend
      setProducts(data);
    } catch (err: any) {
      console.error('[ShopPage] ❌ Erro:', err);
      setError(err.message || t('shop_error_unknown'));
    } finally {
      setLoading(false);
    }
  }, [currentLang, t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Adiciona ao carrinho
  const addToCart = async (productId: number) => {
    setAddingToCart(productId);
    try {
      const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}djzeneyer/v1/add-to-cart`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: 1 }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || t('shop_error_add_cart'));
      }
      navigate('/checkout');
    } catch (err: any) {
      alert(`${t('error')}: ${err.message}`);
      setAddingToCart(null);
    }
  };

  // Formata preço
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return currentLang === 'pt' 
      ? `R$ ${numPrice.toFixed(2).replace('.', ',')}` 
      : `$ ${numPrice.toFixed(2)}`;
  };

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // Loading - Neon style
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white pt-24 relative overflow-hidden">
      {/* Background neon particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `linear-gradient(${Math.random() * 360}deg, #6366F1, #EC4899, #10B981)`,
              boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-32 h-32 rounded-full border-4 border-transparent border-t-primary border-r-accent" 
             style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)' }} 
        />
      </motion.div>
      
      <motion.p 
        className="mt-8 text-3xl font-black font-display"
        style={{
          background: 'linear-gradient(90deg, #6366F1, #EC4899, #10B981, #6366F1)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {t('loading')}
      </motion.p>
    </div>
  );

  // Error state
  if (error) return (
    <div className="min-h-screen flex justify-center items-center pt-24 px-4">
      <motion.div 
        className="card p-8 max-w-md border-2 border-red-500/50"
        style={{ boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)' }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <AlertCircle className="text-red-500" size={40} />
          <h3 className="text-2xl font-bold text-red-400">Error</h3>
        </div>
        <p className="text-white/80">{error}</p>
      </motion.div>
    </div>
  );

  // Main render - NEON CYBERPUNK STYLE
  return (
    <>
      <Helmet>
        <title>{t('shop_page_title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_meta_desc')} />
      </Helmet>

      <div className="pt-24 min-h-screen relative overflow-hidden">
        {/* Animated neon background */}
        <div className="fixed inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-success/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Scanlines effect */}
        <div className="fixed inset-0 pointer-events-none opacity-5"
             style={{
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #6366F1 2px, #6366F1 4px)',
             }}
        />

        {/* Header - Cyberpunk style */}
        <div className="relative bg-gradient-to-b from-surface/90 via-surface/50 to-transparent py-16 mb-12">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center relative"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Title with neon glow */}
              <motion.h1 
                className="text-5xl md:text-7xl font-black font-display mb-6 relative inline-block"
                style={{
                  textShadow: '0 0 20px rgba(99, 102, 241, 0.8), 0 0 40px rgba(236, 72, 153, 0.6)',
                }}
              >
                <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-success">
                  <Sparkles className="inline-block text-primary mr-3" size={48} />
                  {t('shop_title')}
                  <Flame className="inline-block text-accent ml-3" size={48} />
                </span>

                {/* Neon border effect */}
                <div className="absolute -inset-4 rounded-2xl opacity-50 blur-xl"
                     style={{
                       background: 'linear-gradient(90deg, #6366F1, #EC4899, #10B981, #6366F1)',
                       backgroundSize: '200% 100%',
                       animation: 'gradient 3s ease infinite',
                     }}
                />
              </motion.h1>

              <motion.p 
                className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('shop_subtitle')}
              </motion.p>

              {/* Animated line */}
              <motion.div 
                className="mt-8 mx-auto max-w-md h-1 rounded-full overflow-hidden"
                style={{
                  background: 'linear-gradient(90deg, transparent, #6366F1, #EC4899, #10B981, transparent)',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              />
            </motion.div>
          </div>
        </div>

        {/* Products Grid - Neon Cards */}
        <section className="pb-20 relative z-10">
          <div className="container mx-auto px-4">
            {products.length === 0 ? (
              <motion.div 
                className="text-center py-20 card border-2 border-primary/30"
                style={{ boxShadow: '0 0 40px rgba(99, 102, 241, 0.2)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Gift className="mx-auto text-primary mb-6" size={80} 
                      style={{ filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.8))' }} 
                />
                <p className="text-2xl text-white/70 font-semibold">{t('shop_empty_cta')}</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product, index) => {
                  // Gradient dinâmico por índice
                  const gradients = [
                    'from-primary/20 to-accent/20',
                    'from-accent/20 to-success/20',
                    'from-success/20 to-primary/20',
                  ];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <motion.div 
                      key={product.id}
                      variants={cardVariants}
                      whileHover={{ scale: 1.03, zIndex: 10 }}
                      className="group relative"
                    >
                      {/* Glowing card */}
                      <div className={`relative h-full bg-gradient-to-br ${gradient} backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-all duration-500 flex flex-col`}
                           style={{
                             boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                           }}
                      >
                        {/* Neon glow on hover */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-success rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                        {/* Top badges */}
                        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
                          {/* Limited badge */}
                          <motion.div 
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-xs font-black uppercase flex items-center gap-1"
                            style={{ boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)' }}
                            whileHover={{ scale: 1.1, rotate: 3 }}
                          >
                            <Lock size={12} />
                            {t('shop_vibe_tag')}
                          </motion.div>

                          {/* Sale badge */}
                          {product.on_sale && (
                            <motion.div 
                              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-2 rounded-full text-xs font-black uppercase flex items-center gap-1"
                              style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)' }}
                              whileHover={{ scale: 1.1, rotate: -3 }}
                            >
                              <Zap size={14} />
                              {t('badge_featured')}
                            </motion.div>
                          )}
                        </div>

                        {/* Product image */}
                        <Link to={`/product/${product.slug}`} className="block relative overflow-hidden">
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                          
                          <img 
                            src={product.images[0]?.src || 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer'} 
                            alt={product.images[0]?.alt || product.name} 
                            className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110" 
                          />

                          {/* Scan effect */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none"
                            animate={{ y: ['-100%', '200%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                          />
                        </Link>
                        
                        {/* Card content */}
                        <div className="p-6 flex flex-col flex-grow relative z-10">
                          {/* Product name */}
                          <h2 className="text-2xl font-bold mb-4 flex-grow transition-all duration-300 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:via-accent group-hover:to-success">
                            {product.name}
                          </h2>
                          
                          {/* Price */}
                          <div className="mb-6 min-h-[4rem] flex flex-col justify-center">
                            {product.on_sale ? (
                              <>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-base text-white/40 line-through">
                                    {formatPrice(product.regular_price)}
                                  </span>
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold">
                                    -{Math.round((1 - parseFloat(product.price) / parseFloat(product.regular_price)) * 100)}%
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Flame className="text-accent" size={24} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
                                  <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                                    {formatPrice(product.price)}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-2">
                                <Star className="text-primary" size={22} style={{ filter: 'drop-shadow(0 0 8px currentColor)' }} />
                                <span className="text-3xl font-black text-primary">
                                  {formatPrice(product.price)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Stock status */}
                          {product.stock_status === 'instock' && (
                            <div className="mb-4 flex items-center gap-2 text-success text-sm font-semibold">
                              <motion.div 
                                className="w-2 h-2 rounded-full bg-success"
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ boxShadow: '0 0 8px currentColor' }}
                              />
                              <span>{t('shop_in_stock') || 'Em Estoque'}</span>
                            </div>
                          )}
                          
                          {/* Add to cart button */}
                          {product.stock_status === 'outofstock' ? (
                            <button 
                              disabled 
                              className="w-full py-4 px-6 bg-surface/30 text-white/30 rounded-2xl font-bold text-lg cursor-not-allowed border border-white/10"
                            >
                              {t('shop_out_of_stock')}
                            </button>
                          ) : (
                            <motion.button
                              onClick={() => addToCart(product.id)}
                              disabled={!!addingToCart}
                              className="relative w-full py-4 px-6 rounded-2xl font-black text-lg uppercase tracking-wide overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border-2 border-transparent"
                              style={{
                                background: product.on_sale 
                                  ? 'linear-gradient(135deg, #F59E0B, #EF4444)' 
                                  : 'linear-gradient(135deg, #6366F1, #EC4899)',
                                boxShadow: product.on_sale 
                                  ? '0 0 30px rgba(245, 158, 11, 0.4)' 
                                  : '0 0 30px rgba(99, 102, 241, 0.4)',
                              }}
                              whileHover={{ 
                                scale: 1.02,
                                boxShadow: product.on_sale 
                                  ? '0 0 40px rgba(245, 158, 11, 0.6)' 
                                  : '0 0 40px rgba(99, 102, 241, 0.6)',
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              {/* Animated shine effect */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                animate={{ x: ['-200%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                              />
                              
                              {addingToCart === product.id ? (
                                <>
                                  <Loader2 size={24} className="animate-spin" />
                                  <span>{t('shop_adding_text')}</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingCart size={24} />
                                  <span>{t('add_to_cart')}</span>
                                </>
                              )}
                            </motion.button>
                          )}
                        </div>

                        {/* Corner decorations */}
                        <div className="absolute top-2 right-2 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-2 left-2 w-16 h-16 border-b-2 border-l-2 border-accent/30 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </section>

        {/* CSS para animação do gradiente */}
        <style>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    </>
  );
};

export default ShopPage;
