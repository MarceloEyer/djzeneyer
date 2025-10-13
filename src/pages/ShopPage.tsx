// src/pages/ShopPage.tsx
// Visual inspirado em Netflix para venda de ingressos de eventos

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Loader2, 
  ShoppingCart, 
  AlertCircle, 
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Calendar,
  Clock,
  Users,
  Heart,
  Play,
  Info,
  Truck,
  Shield,
  Gift,
  Zap
} from 'lucide-react';

// Interface para produtos
interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: { src: string; alt: string }[];
  stock_status: string;
  lang: string;
  short_description?: string;
  categories?: { name: string }[];
}

// Componente de Carrossel Horizontal (estilo Netflix)
const ProductCarousel: React.FC<{
  title: string;
  products: Product[];
  onAddToCart: (id: number) => void;
  addingToCart: number | null;
  formatPrice: (price: string) => string;
}> = ({ title, products, onAddToCart, addingToCart, formatPrice }) => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      return () => carousel.removeEventListener('scroll', checkScroll);
    }
  }, [products]);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-12 relative group">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4 md:px-8 font-display">
        {title}
      </h2>

      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={32} />
          </motion.button>
        )}
        
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background p-3 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={32} />
          </motion.button>
        )}
      </AnimatePresence>

      <div 
        ref={carouselRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="flex-shrink-0 w-72 md:w-80 group/card cursor-pointer"
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card overflow-hidden shadow-xl">
              <Link to={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img 
                    src={product.images[0]?.src || 'https://placehold.co/640x360/0D96FF/FFFFFF?text=Event'}
                    alt={product.images[0]?.alt || product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {product.on_sale && (
                    <div className="absolute top-3 right-3 bg-error/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-bold uppercase">
                      {t('badge_sale')}
                    </div>
                  )}

                  <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-xs font-bold uppercase flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    {t('badge_new')}
                  </div>
                </div>
              </Link>

              <div className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-primary" />
                    <span>15 Nov, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-secondary" />
                    <span>18:00</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-warning fill-warning" />
                    <span>4.8</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-white/60 mb-4">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0 text-accent" />
                  <span className="line-clamp-1">São Paulo, SP - Brasil</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    {product.on_sale && product.regular_price ? (
                      <div className="flex flex-col">
                        <span className="text-sm text-white/50 line-through">
                          {formatPrice(product.regular_price)}
                        </span>
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-white">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>

                  {product.stock_status === 'instock' ? (
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        onAddToCart(product.id);
                      }}
                      disabled={addingToCart === product.id}
                      className="btn btn-primary px-4 py-2 text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {addingToCart === product.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={16} />
                      )}
                      <span>{t('shop_buy_button')}</span>
                    </motion.button>
                  ) : (
                    <button disabled className="btn bg-surface text-white/30 px-4 py-2 text-sm font-bold cursor-not-allowed">
                      {t('shop_out_of_stock')}
                    </button>
                  )}
                </div>
              </div>

              <div className="absolute inset-0 bg-background/95 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 pointer-events-none group-hover/card:pointer-events-auto">
                <Link 
                  to={`/product/${product.slug}`}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Info size={24} />
                </Link>
                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                  <Heart size={24} />
                </button>
                <Link
                  to={`/product/${product.slug}`}
                  className="p-3 bg-primary hover:bg-primary/80 rounded-full transition-colors"
                >
                  <Play size={24} />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Componente principal da ShopPage
const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  console.log('[ShopPage] 🎮 Idioma atual:', currentLang);

  // Busca produtos com filtro de idioma
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    const apiUrl = `${baseUrl}djzeneyer/v1/products?lang=${currentLang}`;
    
    console.log('[ShopPage] 📡 Buscando produtos:', apiUrl);

    try {
      const response = await fetch(apiUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      }

      const data = await response.json();
      console.log('[ShopPage] ✅ Produtos recebidos:', data.length);
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

  // Adicionar ao carrinho
  const addToCart = async (productId: number) => {
    setAddingToCart(productId);
    
    try {
      const response = await fetch('/wp-json/wc/store/cart/add-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId, quantity: 1 })
      });

      if (response.ok) {
        console.log('[ShopPage] ✅ Produto adicionado ao carrinho');
      }
    } catch (error) {
      console.error('[ShopPage] ❌ Erro ao adicionar:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  // Formatar preço
  const formatPrice = (price: string) => {
    if (!price) return 'R$ 0,00';
    const numPrice = parseFloat(price);
    return isNaN(numPrice) 
      ? price 
      : `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  // Categoriza produtos - APENAS 1 FEATURED!
  const featuredProducts = products.filter(p => p.categories?.some(c => c.name === 'Featured')).slice(0, 1);
  const upcomingProducts = products.slice(0, 8);
  const popularProducts = products.slice(0, 8);

  // Loading
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <div className="text-center">
        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={64} />
        <p className="text-2xl font-bold">{t('loading')}</p>
      </div>
    </div>
  );

  // Error
  if (error) return (
    <div className="min-h-screen flex items-center justify-center pt-24 px-4">
      <div className="card p-8 max-w-md text-center">
        <AlertCircle className="text-error mx-auto mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">Oops!</h2>
        <p className="text-white/70">{error}</p>
      </div>
    </div>
  );

  // Render principal - Estilo Netflix
  return (
    <>
      <Helmet>
        <title>{t('shop_page_title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_meta_desc')} />
      </Helmet>

      <div className="min-h-screen pt-16 bg-background">
        {/* Hero Section - Featured Event (NETFLIX STYLE) */}
        {featuredProducts.length > 0 && (
          <div className="relative h-[70vh] md:h-[85vh] mb-12">
            {/* Background image */}
            <div className="absolute inset-0">
              <img 
                src={featuredProducts[0].images[0]?.src || 'https://placehold.co/1920x1080/0D96FF/FFFFFF?text=Featured+Event'}
                alt={featuredProducts[0].name}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient overlays para melhor leitura */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/50 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-end pb-20 md:pb-32">
              <div className="container mx-auto px-4 md:px-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-2xl"
                >
                  {/* Badges */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-error/90 backdrop-blur-sm text-white px-4 py-2 rounded-md text-sm font-bold uppercase shadow-xl">
                      <Star size={16} className="inline-block mr-1 fill-white" />
                      {t('badge_featured')}
                    </div>
                    {featuredProducts[0].on_sale && (
                      <div className="bg-warning/90 backdrop-blur-sm text-black px-4 py-2 rounded-md text-sm font-bold uppercase shadow-xl">
                        {t('badge_sale')}
                      </div>
                    )}
                  </div>

                  {/* Title com text shadow forte */}
                  <h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                    style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.9), 4px 4px 30px rgba(0,0,0,0.7)' }}
                  >
                    {featuredProducts[0].name}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-lg mb-6 bg-black/60 backdrop-blur-md rounded-lg p-4 inline-flex">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-primary" />
                      <span>15 Nov, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-success" />
                      <span>400+ confirmados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-warning fill-warning" />
                      <span>4.9</span>
                    </div>
                  </div>

                  {/* Description */}
                  {featuredProducts[0].short_description && (
                    <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 mb-8 border border-white/10">
                      <p 
                        className="text-lg text-white/90 line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: featuredProducts[0].short_description }}
                      />
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="bg-black/70 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/30">
                      {featuredProducts[0].on_sale && featuredProducts[0].regular_price ? (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl text-white/40 line-through">
                            {formatPrice(featuredProducts[0].regular_price)}
                          </span>
                          <span className="text-4xl font-black text-primary">
                            {formatPrice(featuredProducts[0].price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-4xl font-black text-primary">
                          {formatPrice(featuredProducts[0].price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      onClick={() => addToCart(featuredProducts[0].id)}
                      disabled={addingToCart === featuredProducts[0].id}
                      className="btn btn-primary btn-lg px-8 py-4 text-lg font-bold flex items-center gap-3 shadow-2xl"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {addingToCart === featuredProducts[0].id ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <ShoppingCart size={24} />
                      )}
                      <span>{t('shop_buy_now')}</span>
                    </motion.button>
                    
                    <Link
                      to={`/product/${featuredProducts[0].slug}`}
                      className="btn btn-outline btn-lg px-8 py-4 text-lg font-bold flex items-center gap-3 shadow-xl hover:scale-105 transition-transform"
                    >
                      <Info size={24} />
                      <span>{t('events_more_info')}</span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Shop Benefits (Estilo Events) */}
        <section className="py-12 bg-surface">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Truck className="text-primary" size={32} />, title: t('shop_free_shipping'), desc: t('shop_free_shipping_desc') },
                { icon: <Shield className="text-success" size={32} />, title: t('shop_secure_payment'), desc: t('shop_secure_payment_desc') },
                { icon: <Gift className="text-accent" size={32} />, title: t('shop_exclusive_items'), desc: t('shop_exclusive_items_desc') },
                { icon: <Zap className="text-warning" size={32} />, title: t('shop_fast_delivery'), desc: t('shop_fast_delivery_desc') },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="mb-3 flex justify-center">{benefit.icon}</div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-white/60">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Carrosséis de produtos */}
        <div className="pb-16">
          <ProductCarousel 
            title={`🔥 ${t('shop_hot_near_you')}`}
            products={upcomingProducts}
            onAddToCart={addToCart}
            addingToCart={addingToCart}
            formatPrice={formatPrice}
          />

          <ProductCarousel 
            title={`⭐ ${t('shop_featured_title')}`}
            products={popularProducts}
            onAddToCart={addToCart}
            addingToCart={addingToCart}
            formatPrice={formatPrice}
          />

          <ProductCarousel 
            title="🎉 Lançamentos da Semana"
            products={products}
            onAddToCart={addToCart}
            addingToCart={addingToCart}
            formatPrice={formatPrice}
          />
        </div>
      </div>

      {/* CSS custom para esconder scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default ShopPage;
