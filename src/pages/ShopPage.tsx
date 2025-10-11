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
  Flame
} from 'lucide-react';

// Declaração global para dados do WordPress
declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

// Interface para produtos WooCommerce com suporte Polylang
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
  lang?: string;
  translations?: { [key: string]: number };
}

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0]; // 'pt' ou 'en'
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  console.log('[ShopPage] 🎮 Renderizando - Idioma:', currentLang);

  // Normaliza dados do produto vindos da API WooCommerce
  const normalizeProduct = useCallback((productData: any): Product => {
    let imageUrl = 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer';
    let imageAlt = productData.name || 'Imagem do produto';

    if (productData.images && productData.images.length > 0) {
      const firstImage = productData.images[0];
      imageUrl = firstImage.src || firstImage.url || firstImage.full_src || imageUrl;
      imageAlt = firstImage.alt || imageAlt;
    }

    const regularPrice = parseFloat(productData.regular_price || '0');
    const salePrice = parseFloat(productData.sale_price || '0');

    // FIX: Tenta pegar idioma de múltiplas fontes do Polylang
    let productLang = currentLang; // fallback
    
    if (productData.lang) {
      productLang = productData.lang;
    } else if (productData.language) {
      productLang = productData.language;
    } else if (productData.polylang_current_lang) {
      productLang = productData.polylang_current_lang;
    }

    console.log(`[ShopPage] 📦 Normalizando "${productData.name}" - Lang detectado: ${productLang}`);

    return {
      id: productData.id || 0,
      name: productData.name || 'Produto sem nome',
      slug: productData.slug || `product-${productData.id}`,
      price: salePrice > 0 && salePrice < regularPrice ? productData.sale_price : productData.regular_price,
      on_sale: salePrice > 0 && salePrice < regularPrice,
      regular_price: productData.regular_price,
      sale_price: productData.sale_price,
      images: [{ src: imageUrl, alt: imageAlt }],
      stock_status: productData.stock_status || 'outofstock',
      lang: productLang,
      translations: productData.translations || {},
    };
  }, [currentLang]);

  // Busca produtos com filtro Polylang melhorado
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log('[ShopPage] 🔄 Iniciando fetchProducts - Idioma alvo:', currentLang);

    const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      console.error('[ShopPage] ❌ Credenciais WooCommerce ausentes');
      setError(t('shop_error_credentials'));
      setLoading(false);
      return;
    }

    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    
    // MÉTODO 1: Tenta usar o endpoint do Polylang diretamente
    const polylangUrl = `${baseUrl}wc/v3/products?status=publish&per_page=100&lang=${currentLang}&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    
    console.log('[ShopPage] 📡 Tentando endpoint Polylang:', polylangUrl.replace(consumerKey, 'ck_***').replace(consumerSecret, 'cs_***'));

    try {
      const response = await fetch(polylangUrl);
      console.log('[ShopPage] 📥 Status:', response.status);

      if (!response.ok) {
        throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      }

      const data = await response.json();
      console.log('[ShopPage] ✅ Produtos recebidos:', data.length);
      console.log('[ShopPage] 📊 Dados completos:', data);

      const normalizedProducts = data.map(normalizeProduct);
      
      // MÉTODO 2: Se o Polylang não filtrar na API, filtra no frontend
      const filteredProducts = normalizedProducts.filter((product: Product) => {
        const productLang = product.lang || 'en';
        const isMatch = productLang === currentLang;
        
        console.log(`[ShopPage] 🔍 Produto: "${product.name}" | Lang: ${productLang} | Match: ${isMatch}`);
        
        return isMatch;
      });

      console.log('[ShopPage] ✅ Produtos após filtro:', filteredProducts.length);
      
      setProducts(filteredProducts);
    } catch (err: any) {
      console.error('[ShopPage] ❌ Erro:', err);
      setError(err.message || t('shop_error_unknown'));
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct, currentLang, t]);

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
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  // Estados de carregamento e erro
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white pt-24">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="text-primary" size={64} />
      </motion.div>
      <motion.p 
        className="mt-6 text-2xl font-bold font-display"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {t('loading')}
      </motion.p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex justify-center items-center pt-24">
      <motion.div 
        className="bg-red-500/10 border-2 border-red-500 rounded-xl p-8 flex items-center gap-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <AlertCircle className="text-red-500" size={32} />
        <span className="text-red-400 text-lg font-semibold">{error}</span>
      </motion.div>
    </div>
  );

  // Renderização principal - Visual moderno e gamificado
  return (
    <>
      <Helmet>
        <title>{t('shop_page_title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_meta_desc')} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
        {/* Background animado com gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Header épico com partículas */}
        <div className="relative mb-16">
          <motion.div 
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            {/* Título com efeito neon */}
            <div className="relative inline-block mb-6">
              <motion.h1 
                className="text-5xl md:text-7xl font-extrabold font-display relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 50%, #10B981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))'
                }}
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))',
                    'drop-shadow(0 0 30px rgba(236, 72, 153, 0.6))',
                    'drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))',
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="inline-block mr-3 text-primary" size={48} />
                {t('shop_title')}
                <Flame className="inline-block ml-3 text-accent" size={48} />
              </motion.h1>
              
              {/* Efeito de brilho atrás do título */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 blur-2xl -z-10" />
            </div>

            {/* Subtítulo */}
            <motion.p 
              className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {t('shop_subtitle')}
            </motion.p>

            {/* Barra de status decorativa */}
            <motion.div 
              className="mt-8 mx-auto max-w-md h-2 bg-surface rounded-full overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-accent to-success"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Empty state */}
          {products.length === 0 ? (
            <motion.div 
              className="text-center py-20 bg-surface/30 backdrop-blur-sm rounded-3xl border border-white/10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Gift className="mx-auto text-primary mb-6" size={80} />
              <p className="text-2xl text-white/70 font-semibold">{t('shop_empty_cta')}</p>
            </motion.div>
          ) : (
            /* Grid de produtos - Visual RPG */
            <motion.div 
              className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="group relative"
                  variants={cardVariants}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Card principal com bordas neon */}
                  <div className="relative h-full bg-gradient-to-br from-surface/90 to-surface/50 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-primary/50 transition-all duration-500 flex flex-col">
                    
                    {/* Brilho animado nas bordas */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0 animate-pulse" />
                    </div>

                    {/* Badges superiores */}
                    <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
                      {/* Badge "NOVO" / "LIMITED" */}
                      <motion.div 
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase shadow-lg flex items-center gap-1"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Star size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
                        {t('shop_vibe_tag')}
                      </motion.div>

                      {/* Badge de promoção */}
                      {product.on_sale && (
                        <motion.div 
                          className="bg-gradient-to-r from-accent to-yellow-500 text-white px-4 py-2 rounded-full text-xs font-black uppercase shadow-lg flex items-center gap-1"
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                          whileHover={{ scale: 1.1, rotate: -5 }}
                        >
                          <Zap size={14} className="animate-pulse" />
                          {t('badge_featured')}
                        </motion.div>
                      )}
                    </div>

                    {/* Imagem do produto */}
                    <Link to={`/product/${product.slug}`} className="block relative overflow-hidden group">
                      {/* Overlay gradiente no hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 flex items-center justify-center">
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileHover={{ scale: 1, rotate: 0 }}
                          className="bg-primary text-white p-4 rounded-full"
                        >
                          <TrendingUp size={32} />
                        </motion.div>
                      </div>

                      {/* Imagem */}
                      <img 
                        src={product.images[0].src} 
                        alt={product.images[0].alt} 
                        className="w-full h-72 object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2" 
                      />

                      {/* Efeito de scan horizontal */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent"
                          animate={{ y: ['-100%', '200%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                      </div>
                    </Link>
                    
                    {/* Conteúdo do card */}
                    <div className="p-6 flex flex-col flex-grow relative z-10">
                      {/* Nome do produto */}
                      <h2 className="text-2xl font-bold mb-4 flex-grow group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
                        {product.name}
                      </h2>
                      
                      {/* Preço com animação */}
                      <div className="mb-6 min-h-[4rem] flex flex-col justify-center">
                        {product.on_sale ? (
                          <motion.div 
                            className="space-y-1"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            {/* Preço original riscado */}
                            <div className="flex items-center gap-2">
                              <span className="text-lg text-white/40 line-through font-medium">
                                {formatPrice(product.regular_price)}
                              </span>
                              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold">
                                -{Math.round((1 - parseFloat(product.price) / parseFloat(product.regular_price)) * 100)}%
                              </span>
                            </div>
                            {/* Preço promocional */}
                            <div className="flex items-center gap-2">
                              <Flame className="text-accent animate-pulse" size={24} />
                              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-400">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Sparkles className="text-primary" size={20} />
                            <span className="text-3xl font-black text-primary">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Badge de estoque */}
                      {product.stock_status === 'instock' && (
                        <div className="mb-4 flex items-center gap-2 text-success text-sm font-semibold">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span>{t('shop_in_stock') || 'Em Estoque'}</span>
                        </div>
                      )}
                      
                      {/* Botão de compra */}
                      {product.stock_status === 'outofstock' ? (
                        <button 
                          disabled 
                          className="w-full py-4 px-6 bg-surface/50 text-white/30 rounded-2xl font-bold text-lg cursor-not-allowed border border-white/5"
                        >
                          {t('shop_out_of_stock')}
                        </button>
                      ) : (
                        <motion.button
                          onClick={() => addToCart(product.id)}
                          disabled={!!addingToCart}
                          className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-accent text-white rounded-2xl font-black text-lg uppercase tracking-wide shadow-lg hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Efeito de brilho no botão */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                          
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

                    {/* Partículas decorativas nos cantos */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-accent/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShopPage;
