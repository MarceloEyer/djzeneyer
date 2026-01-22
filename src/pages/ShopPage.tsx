// src/pages/ShopPage.tsx
// Visual inspirado em Netflix para venda de ingressos de eventos

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify'; // Recomendo instalar: npm install dompurify @types/dompurify
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

// --- Interfaces (Idealmente em src/types/index.ts) ---
interface ProductImage {
  src: string;
  alt: string;
  sizes?: {
    thumbnail?: string;
    medium?: string;
    medium_large?: string;
    large?: string;
  };
}

interface ProductCategory {
  name: string;
  slug?: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: ProductImage[];
  stock_status: string;
  lang: string;
  short_description?: string;
  categories?: ProductCategory[];
}

// --- Componente de Carrossel Horizontal ---
const ProductCarousel: React.FC<{
  title: string;
  products: Product[];
  onAddToCart: (id: number) => void;
  addingToCart: number | null;
  formatPrice: (price: string) => string;
  productBasePath: string;
}> = ({ title, products, onAddToCart, addingToCart, formatPrice, productBasePath }) => {
  const { t } = useTranslation();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Debounce para o evento de scroll
  const checkScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Pequena margem de erro (10px) para garantir que o botão desapareça no fim
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      return () => carousel.removeEventListener('scroll', checkScroll);
    }
  }, [products, checkScroll]);

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
    <div className="mb-12 relative group px-4 md:px-8">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 font-display text-white">
        {title}
      </h2>

      <div className="relative">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              aria-label="Scroll left"
              className="absolute left-0 top-0 bottom-0 z-20 bg-black/50 hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-12"
            >
              <ChevronLeft size={40} className="text-white" />
            </motion.button>
          )}
          
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              aria-label="Scroll right"
              className="absolute right-0 top-0 bottom-0 z-20 bg-black/50 hover:bg-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-12"
            >
              <ChevronRight size={40} className="text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        <div 
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide py-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="flex-shrink-0 w-64 md:w-72 lg:w-80 relative group/card"
              whileHover={{ scale: 1.05, zIndex: 10, transition: { duration: 0.3 } }}
            >
              <div className="card overflow-hidden shadow-xl bg-surface border border-white/5 rounded-lg h-full flex flex-col">
                <Link to={`${productBasePath}/${product.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                  <img 
                    src={product.images[0]?.sizes?.medium || product.images[0]?.src || 'https://placehold.co/640x360/0D96FF/FFFFFF?text=Event'}
                    alt={product.images[0]?.alt || product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  
                  {product.on_sale && (
                    <div className="absolute top-2 right-2 bg-error text-white px-2 py-1 rounded text-xs font-bold uppercase shadow-sm">
                      {t('badge_sale')}
                    </div>
                  )}
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`${productBasePath}/${product.slug}`}>
                    <h3 className="text-base font-bold mb-1 text-white line-clamp-1 hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Informações Rápidas */}
                  <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                    <span className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.9
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> 1h 45m
                    </span>
                  </div>

                  {/* Categorias (Exemplo) */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.categories?.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/5">
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  {/* Preço e Ação */}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex flex-col">
                      {product.on_sale && product.regular_price && (
                        <span className="text-xs text-white/40 line-through">
                          {formatPrice(product.regular_price)}
                        </span>
                      )}
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {product.stock_status === 'instock' ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onAddToCart(product.id);
                        }}
                        disabled={addingToCart === product.id}
                        className="p-2 bg-white/10 hover:bg-primary hover:text-white rounded-full transition-colors disabled:opacity-50"
                        aria-label={t('shop_buy_button')}
                      >
                        {addingToCart === product.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={18} />
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-white/30 uppercase font-bold border border-white/10 px-2 py-1 rounded">
                        {t('shop_out_of_stock')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal da Página ---
const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const isPortuguese = i18n.language.startsWith('pt');
  const productBasePath = isPortuguese ? '/pt/loja/produto' : '/shop/product';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Busca produtos (Memoizado)
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Garante URL correta mesmo se wpData falhar
    const baseUrl = (window as any).wpData?.restUrl || `${window.location.origin}/wp-json/`;
    const apiUrl = `${baseUrl}djzeneyer/v1/products?lang=${currentLang}`;
    
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || t('shop_error_unknown'));
    } finally {
      setLoading(false);
    }
  }, [currentLang, t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Função para adicionar ao carrinho
  const addToCart = async (productId: number) => {
    setAddingToCart(productId);
    try {
      const response = await fetch('/wp-json/wc/store/cart/add-item', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-WP-Nonce': (window as any).wpData?.nonce || '' 
        },
        credentials: 'include',
        body: JSON.stringify({ id: productId, quantity: 1 })
      });

      if (response.ok) {
        // Feedback visual ou toast aqui seria ideal
        console.log('Product added to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(null);
    }
  };

  // Utilitário de formatação de preço
  const formatPrice = (price: string) => {
    if (!price) return 'R$ 0,00';
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? 'pt-BR' : 'en-US';
    return isNaN(numPrice) 
      ? price 
      : new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(numPrice);
  };

  // Filtros de categorias para as seções
  const featuredProduct = products.find(p => p.categories?.some(c => c.name.toLowerCase() === 'featured')) || products[0];
  const upcomingProducts = products.filter(p => p.id !== featuredProduct?.id).slice(0, 8);
  const popularProducts = products.slice(8, 16);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="mx-auto mb-4 text-error" size={48} />
        <h2 className="text-2xl font-bold mb-2">Error loading shop</h2>
        <p className="opacity-70">{error}</p>
        <button onClick={fetchProducts} className="mt-4 btn btn-primary">Try Again</button>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{t('shop_page_title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_meta_desc')} />
      </Helmet>

      <div className="min-h-screen pb-20 bg-background text-white">
        {/* --- Hero Section (Destaque Principal) --- */}
        {featuredProduct && (
          <div className="relative h-[60vh] md:h-[80vh] w-full mb-8">
            <div className="absolute inset-0">
              <img 
                src={featuredProduct.images[0]?.src || 'https://placehold.co/1200x675/0D96FF/FFFFFF?text=DJ+Zen+Eyer'} 
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 lg:p-16 flex flex-col justify-end h-full pointer-events-none">
              <div className="max-w-3xl pointer-events-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-primary text-black font-bold px-2 py-1 text-xs uppercase tracking-wide rounded">
                    Featured Event
                  </span>
                  {featuredProduct.on_sale && (
                    <span className="bg-error text-white font-bold px-2 py-1 text-xs uppercase tracking-wide rounded">
                      Sale
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-6xl font-black mb-4 font-display leading-tight drop-shadow-lg">
                  {featuredProduct.name}
                </h1>

                {featuredProduct.short_description && (
                  <div 
                    className="text-lg md:text-xl text-white/90 mb-6 line-clamp-3 drop-shadow-md max-w-2xl"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(featuredProduct.short_description) }} 
                  />
                )}

                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addToCart(featuredProduct.id)}
                    className="btn btn-primary btn-lg px-8 flex items-center gap-2"
                    disabled={addingToCart === featuredProduct.id}
                  >
                    {addingToCart === featuredProduct.id ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
                    {t('shop_buy_now')} - {formatPrice(featuredProduct.price)}
                  </motion.button>
                  
                  <Link 
                    to={`${productBasePath}/${featuredProduct.slug}`}
                    className="btn btn-outline btn-lg px-8 flex items-center gap-2 bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20"
                  >
                    <Info size={20} />
                    {t('events_more_info')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- Seções de Produtos --- */}
        <div className="space-y-4 md:-mt-24 relative z-10">
          <ProductCarousel 
            title={t('shop_hot_near_you')} 
            products={upcomingProducts} 
            onAddToCart={addToCart}
            addingToCart={addingToCart}
            formatPrice={formatPrice}
            productBasePath={productBasePath}
          />

          <ProductCarousel 
            title={t('shop_featured_title')} 
            products={popularProducts} 
            onAddToCart={addToCart}
            addingToCart={addingToCart}
            formatPrice={formatPrice}
            productBasePath={productBasePath}
          />
        </div>

        {/* --- Benefícios (Rodapé da Loja) --- */}
        <section className="container mx-auto px-6 py-16 mt-12 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "Instant Delivery", desc: "Tickets sent to your email immediately" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure payment processing" },
              { icon: Gift, title: "Exclusive Perks", desc: "Bonuses for Zen Tribe members" },
              { icon: Zap, title: "Fast Support", desc: "24/7 customer support via WhatsApp" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="p-3 bg-white/5 rounded-full mb-4 text-primary">
                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
};

export default ShopPage;
