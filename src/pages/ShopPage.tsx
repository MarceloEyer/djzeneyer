// src/pages/ShopPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Award
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

// Interface para produtos WooCommerce
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
}

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0]; // 'pt' ou 'en'
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  console.log('[ShopPage] 🎮 Iniciando - Idioma atual:', currentLang);

  // Normaliza dados do produto
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
    };
  }, []);

  // Busca produtos e filtra por idioma
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log('[ShopPage] 🔄 Buscando produtos para idioma:', currentLang);

    const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;

    if (!consumerKey || !consumerSecret) {
      console.error('[ShopPage] ❌ Credenciais ausentes');
      setError(t('shop_error_credentials'));
      setLoading(false);
      return;
    }

    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    
    // SOLUÇÃO: Buscar produtos de AMBOS os idiomas e filtrar por nome
    // Produtos em PT têm nomes em português
    // Produtos em EN têm nomes em inglês
    const apiUrl = `${baseUrl}wc/v3/products?status=publish&per_page=100&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;
    
    console.log('[ShopPage] 📡 Buscando da API...');

    try {
      const response = await fetch(apiUrl);
      console.log('[ShopPage] 📥 Status:', response.status);

      if (!response.ok) {
        throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      }

      const allProducts = await response.json();
      console.log('[ShopPage] ✅ Total de produtos recebidos:', allProducts.length);

      // FIX: Filtra produtos baseado no NOME do produto
      // Se o idioma for PT, mostra apenas produtos com nomes em português
      // Se o idioma for EN, mostra apenas produtos com nomes em inglês
      const filteredProducts = allProducts.filter((product: any) => {
        const productName = product.name.toLowerCase();
        
        // Lista de palavras-chave em português para identificar produtos PT
        const ptKeywords = ['ingresso', 'entrada', 'bilhete', 'convite'];
        const hasPtKeyword = ptKeywords.some(keyword => productName.includes(keyword));
        
        // Se o idioma atual é PT, mostra produtos com palavras em português
        if (currentLang === 'pt') {
          const shouldShow = hasPtKeyword || !productName.includes('ticket');
          console.log(`[ShopPage] PT - "${product.name}" (ID: ${product.id}) - Mostrar: ${shouldShow}`);
          return shouldShow;
        } else {
          // Se o idioma atual é EN, mostra produtos com "ticket" ou sem palavras em PT
          const shouldShow = !hasPtKeyword || productName.includes('ticket');
          console.log(`[ShopPage] EN - "${product.name}" (ID: ${product.id}) - Mostrar: ${shouldShow}`);
          return shouldShow;
        }
      });

      console.log('[ShopPage] ✅ Produtos após filtro:', filteredProducts.length);
      
      const normalizedProducts = filteredProducts.map(normalizeProduct);
      setProducts(normalizedProducts);
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

  // Animações - Mesmo estilo do Zen Tribe
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
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

  // Loading state - Estilo Zen Tribe
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

  // Error state
  if (error) return (
    <div className="min-h-screen flex justify-center items-center pt-24">
      <div className="card p-8 flex items-center gap-4 max-w-md">
        <AlertCircle className="text-red-500 flex-shrink-0" size={32} />
        <span className="text-red-400 text-lg">{error}</span>
      </div>
    </div>
  );

  // Main render - Visual inspirado no Zen Tribe
  return (
    <>
      <Helmet>
        <title>{t('shop_page_title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_meta_desc')} />
      </Helmet>

      <div className="pt-24 min-h-screen">
        {/* Page Header - Estilo Zen Tribe */}
        <div className="bg-surface py-12 md:py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
                <Sparkles className="inline-block text-primary mr-2" size={40} />
                {t('shop_title')}
                <Flame className="inline-block text-accent ml-2" size={40} />
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                {t('shop_subtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Products Grid - Estilo Zen Tribe */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {products.length === 0 ? (
              <motion.div 
                className="text-center py-20 card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Gift className="mx-auto text-primary mb-6" size={64} />
                <p className="text-xl text-white/70">{t('shop_empty_cta')}</p>
              </motion.div>
            ) : (
              <motion.div 
                className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {products.map((product) => (
                  <motion.div 
                    key={product.id} 
                    className="card overflow-hidden relative transition-all duration-300 hover:shadow-lg flex flex-col group"
                    variants={cardVariants}
                    whileHover={{ y: -4 }}
                  >
                    {/* Badge superior */}
                    {product.on_sale && (
                      <div className="absolute top-4 right-4 z-10 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Zap size={14} />
                        {t('badge_featured')}
                      </div>
                    )}

                    <div className="absolute top-4 left-4 z-10 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      {t('shop_vibe_tag')}
                    </div>

                    {/* Imagem */}
                    <Link to={`/product/${product.slug}`} className="block relative overflow-hidden bg-surface/50">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                      <img 
                        src={product.images[0].src} 
                        alt={product.images[0].alt} 
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </Link>
                    
                    {/* Conteúdo */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h2 className="text-xl font-semibold mb-3 flex-grow group-hover:text-primary transition-colors">
                        {product.name}
                      </h2>
                      
                      {/* Preço */}
                      <div className="mb-4 min-h-[3.5rem] flex items-center">
                        {product.on_sale ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-base text-white/50 line-through">
                              {formatPrice(product.regular_price)}
                            </span>
                            <div className="flex items-center gap-2">
                              <Zap className="text-accent" size={18} />
                              <span className="text-2xl font-bold text-accent">
                                {formatPrice(product.price)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Star className="text-primary" size={18} />
                            <span className="text-2xl font-bold text-primary">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Status de estoque */}
                      {product.stock_status === 'instock' && (
                        <div className="mb-4 flex items-center gap-2 text-success text-sm">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span>{t('shop_in_stock') || 'Em Estoque'}</span>
                        </div>
                      )}
                      
                      {/* Botão */}
                      {product.stock_status === 'outofstock' ? (
                        <button 
                          disabled 
                          className="w-full btn bg-surface/50 text-white/30 cursor-not-allowed"
                        >
                          {t('shop_out_of_stock')}
                        </button>
                      ) : (
                        <motion.button
                          onClick={() => addToCart(product.id)}
                          disabled={!!addingToCart}
                          className={`w-full btn ${product.on_sale ? 'btn-secondary' : 'btn-primary'} flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {addingToCart === product.id ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />
                              <span>{t('shop_adding_text')}</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={20} />
                              <span>{t('add_to_cart')}</span>
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopPage;
