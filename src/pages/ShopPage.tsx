// src/pages/ShopPage.tsx
// Visual inspirado em Netflix para venda de ingressos de eventos

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { useProductsQuery, useAddToCartMutation } from '../hooks/useQueries';
import {
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
  Truck,
  Shield,
  Gift,
  Zap,
  Plus
} from 'lucide-react';

import { ProductImage, ProductCategory } from '../types/product';

// --- Interfaces (Idealmente em src/types/index.ts) ---
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
// --- Netflix-style Paging Indicator ---
interface PagingIndicatorProps {
  count: number;
  active: number;
}

const PagingIndicator = ({ count, active }: PagingIndicatorProps) => (
  <div className="flex gap-1 ml-4 self-center h-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`h-full w-4 rounded-full transition-all duration-300 ${i === active ? 'bg-primary w-8' : 'bg-white/20'}`}
      />
    ))}
  </div>
);

// --- ShopHero (Cinematic Billboard) ---
interface ShopHeroProps {
  product: Product;
  onAddToCart: (id: number) => void;
  addingToCart: number | null;
  formatPrice: (price: string) => string;
  productBasePath: string;
}

const ShopHero = ({ product, onAddToCart, addingToCart, formatPrice, productBasePath }: ShopHeroProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative h-[80vh] w-full group overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={product.images[0]?.src || 'https://placehold.co/1200x675/0D96FF/FFFFFF'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#141414] to-transparent" />
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 lg:p-20 pb-32 md:pb-48">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-4 md:space-y-6"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(13,150,255,0.5)]" />
            <span className="text-white font-black tracking-tighter text-sm md:text-base uppercase flex items-center gap-2">
              DJ ZEN EYER <span className="text-white/40">ORIGINAL</span>
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display text-white leading-[0.9] drop-shadow-2xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 text-sm md:text-lg">
            <span className="text-primary font-bold">{t('shop_match_score')}</span>
            <span className="text-white/60">2024</span>
            <span className="border border-white/40 px-1.5 py-0.5 text-xs text-white/80 rounded">
              {t('shop_cremosidade_level')}
            </span>
            <span className="text-white/60">HD</span>
          </div>

          {product.short_description && (
            <div
              className="text-lg md:text-xl text-white/80 line-clamp-3 md:line-clamp-2 drop-shadow-lg max-w-2xl font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.short_description) }}
            />
          )}

          <div className="flex items-center gap-3 md:gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart(product.id)}
              className="flex items-center gap-2 bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg hover:bg-white/90 transition-colors shadow-xl"
              disabled={addingToCart === product.id}
            >
              {addingToCart === product.id ? <Loader2 className="animate-spin" /> : <Play className="fill-black" size={24} />}
              {t('shop_buy_now')}
            </motion.button>

            <Link
              to={`${productBasePath}/${product.slug}`}
              className="flex items-center gap-2 bg-white/20 text-white px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg backdrop-blur-md hover:bg-white/30 transition-colors border border-white/10"
            >
              <Info size={24} />
              {t('events_more_info')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- ProductCard (Expandable on Hover) ---
interface ProductCardProps {
  key?: number | string;
  product: Product;
  formatPrice: (price: string) => string;
  onAddToCart: (id: number) => void;
  addingToCart: number | null;
  productBasePath: string;
}

const ProductCard = ({ product, formatPrice, onAddToCart, addingToCart, productBasePath }: ProductCardProps) => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="flex-shrink-0 w-[240px] md:w-[300px] lg:w-[350px] relative z-10 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        scale: 1.15,
        zIndex: 50,
        y: -10,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      }}
    >
      <div className="card-outer bg-surface border border-white/5 rounded-md overflow-hidden shadow-2xl group/card h-full">
        <Link to={`${productBasePath}/${product.slug}`} className="block relative aspect-[16/9] overflow-hidden">
          <img
            src={product.images[0]?.src || 'https://placehold.co/640x360/0D96FF/FFFFFF'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover/card:bg-transparent transition-colors" />
          {product.on_sale && (
            <div className="absolute top-2 right-2 bg-error text-white px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
              {t('badge_sale')}
            </div>
          )}
        </Link>

        <div className="p-4 bg-surface opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={(e) => { e.preventDefault(); onAddToCart(product.id); }}
                className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/80 transition-colors"
                title={t('shop_add_to_cart')}
              >
                {addingToCart === product.id ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-black" />}
              </button>
              <Link
                to={`${productBasePath}/${product.slug}`}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                title={t('events_more_info')}
              >
                <Plus size={16} />
              </Link>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-primary">
              {formatPrice(product.price)}
            </div>
          </div>

          <h3 className="text-sm md:text-base font-bold text-white mb-2 line-clamp-1">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 text-[10px] md:text-xs text-white/60">
            <span className="text-green-500 font-bold">{t('shop_match_score')}</span>
            <span className="border border-white/30 px-1 rounded-sm uppercase tracking-tighter scale-90 origin-left">
              {t('shop_cremosidade_level')}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {product.categories?.slice(0, 2).map((cat, idx) => (
              <span key={idx} className="text-[9px] text-white/40 after:content-['•'] after:ml-1 last:after:content-none whitespace-nowrap">
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- ProductRow (Netflix-style Carousel) ---
interface ProductRowProps {
  title: string;
  products: Product[];
  onAddToCart: (id: number) => void;
  addingToCart: number | null;
  formatPrice: (price: string) => string;
  productBasePath: string;
}

const ProductRow = ({ title, products, onAddToCart, addingToCart, formatPrice, productBasePath }: ProductRowProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activePageIndex, setActivePageIndex] = useState(0);

  const checkScroll = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      setActivePageIndex(Math.round(scrollLeft / clientWidth));
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
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -carouselRef.current.clientWidth : carouselRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="mb-12 relative group z-20">
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-20 mb-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-white group-hover:text-primary transition-colors cursor-default">
          {title}
          <ChevronRight className="inline-block ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" size={24} />
        </h2>
        <PagingIndicator count={Math.ceil(products.length / 4)} active={activePageIndex} />
      </div>

      <div className="relative overflow-visible">
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="absolute left-0 top-0 bottom-0 z-40 bg-black/40 hover:bg-black/60 w-12 md:w-16 flex items-center justify-center group/btn"
            >
              <ChevronLeft size={48} className="text-white group-hover/btn:scale-125 transition-transform" />
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 z-40 bg-black/40 hover:bg-black/60 w-12 md:w-16 flex items-center justify-center group/btn"
            >
              <ChevronRight size={48} className="text-white group-hover/btn:scale-125 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={carouselRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-20 py-10 -my-10 scroll-smooth items-stretch"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              formatPrice={formatPrice}
              onAddToCart={onAddToCart}
              addingToCart={addingToCart}
              productBasePath={productBasePath}
            />
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

  const { data: products = [], isLoading: loading, error, refetch } = useProductsQuery(currentLang);
  const addToCartMutation = useAddToCartMutation();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Função para adicionar ao carrinho
  const addToCart = async (productId: number) => {
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      setToast({ message: t('shop_added_to_cart') || 'Added to cart!', type: 'success' });
      console.log('Product added to cart');
    } catch (error) {
      setToast({ message: 'Error adding to cart', type: 'error' });
      console.error('Error adding to cart:', error);
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

  // Filtros de categorias para as seções (Estilo Netflix)
  const featuredProduct = products.find((p: Product) => p.categories?.some((c: { name: string }) => c.name.toLowerCase() === 'featured')) || products[0];
  const newReleases = products.filter((p: Product) => !p.categories?.some((c: { name: string }) => c.name.toLowerCase() === 'featured')).slice(0, 10);
  const bestSellers = products.filter((p: Product) => p.on_sale).slice(0, 10);
  const curatedSelection = [...products].reverse().slice(0, 10);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white p-4">
      <div className="text-center max-w-md">
        <AlertCircle className="mx-auto mb-4 text-error" size={48} />
        <h2 className="text-2xl font-bold mb-2">Error loading shop</h2>
        <p className="opacity-70">{error instanceof Error ? error.message : String(error)}</p>
        <button onClick={() => refetch()} className="mt-4 btn btn-primary">Try Again</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Helmet>
        <title>{t('shop_page_title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_meta_desc')} />
      </Helmet>

      {/* --- Toast Notification --- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-10 left-1/2 z-[100] px-6 py-3 rounded-full font-bold shadow-2xl backdrop-blur-md border ${toast.type === 'success'
                ? 'bg-primary/90 text-white border-primary/20'
                : 'bg-error/90 text-white border-error/20'
              }`}
          >
            <div className="flex items-center gap-2">
              <Zap size={18} className={toast.type === 'success' ? 'fill-white' : ''} />
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Billboard (Netflix Hero) --- */}
      {featuredProduct && (
        <ShopHero
          product={featuredProduct}
          onAddToCart={addToCart}
          addingToCart={addToCartMutation.isPending ? Number((addToCartMutation.variables as any)?.productId) : null}
          formatPrice={formatPrice}
          productBasePath={productBasePath}
        />
      )}

      {/* --- Netflix-style Lists (Rows) --- */}
      <div className="relative z-20 pb-20 -mt-8 md:-mt-12 lg:-mt-16 space-y-12 md:space-y-16">
        <ProductRow
          title={t('shop_new_releases')}
          products={newReleases}
          onAddToCart={addToCart}
          addingToCart={addToCartMutation.isPending ? Number((addToCartMutation.variables as any)?.productId) : null}
          formatPrice={formatPrice}
          productBasePath={productBasePath}
        />

        <ProductRow
          title={t('badge_sale')}
          products={bestSellers}
          onAddToCart={addToCart}
          addingToCart={addToCartMutation.isPending ? Number((addToCartMutation.variables as any)?.productId) : null}
          formatPrice={formatPrice}
          productBasePath={productBasePath}
        />

        <ProductRow
          title={t('shop_top_picks')}
          products={curatedSelection}
          onAddToCart={addToCart}
          addingToCart={addToCartMutation.isPending ? Number((addToCartMutation.variables as any)?.productId) : null}
          formatPrice={formatPrice}
          productBasePath={productBasePath}
        />
      </div>

      {/* --- Netflix-style Footer Section (Benefits) --- */}
      <section className="px-6 md:px-12 lg:px-20 py-20 bg-background border-t border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[
            { icon: Truck, title: "Entrega Instantânea", desc: "Tickets e acessos digitais enviados na hora" },
            { icon: Shield, title: "Pagamento Blindado", desc: "Segurança total no processamento" },
            { icon: Gift, title: "Vantagens Tribe", desc: "Descontos exclusivos para membros" },
            { icon: Zap, title: "Suporte VIP", desc: "Atendimento direto via WhatsApp 24/7" },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col space-y-3 group cursor-default">
              <div className="text-primary group-hover:scale-110 transition-transform duration-300 w-fit">
                <item.icon size={32} />
              </div>
              <h3 className="font-bold text-lg md:text-xl text-white group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ShopPage;
