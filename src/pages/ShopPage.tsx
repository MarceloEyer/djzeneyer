// src/pages/ShopPage.tsx
// Visual inspirado em Netflix para venda de ingressos de eventos

import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { useShopPageQuery, useAddToCartMutation, WCProduct } from '../hooks/useQueries';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Toast } from '../components/common/Toast';
import {
  Loader2,
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


// --- Interfaces (Idealmente em src/types/index.ts) ---
type Product = WCProduct;

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
  isAddingToCart: boolean; // OPTIMIZATION: Use boolean instead of ID
  productBasePath: string;
}

const ShopHero = memo(({ product, onAddToCart, isAddingToCart, productBasePath }: ShopHeroProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative h-[80vh] w-full group overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={safeUrl(product.images[0]?.sizes?.large || product.images[0]?.sizes?.medium_large || product.images[0]?.src, 'https://placehold.co/1200x675/0D96FF/FFFFFF')}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
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
            <span className="text-white font-black tracking-tighter text-xs md:text-sm uppercase flex items-center gap-2 bg-black/35 border border-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
              DJ ZEN EYER <span className="text-white/60">{t('badge_featured')}</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-display text-white leading-[0.92] drop-shadow-2xl max-w-4xl text-balance">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-base">
            <span className="text-primary font-bold">{t('shop.match_score')}</span>
            <span className="text-white/60">2024</span>
            <span className="border border-white/40 px-2 py-1 text-[11px] md:text-xs text-white/85 rounded-full bg-black/35">
              {t('shop.cremosidade_level')}
            </span>
            <span className="text-white/60">HD</span>
          </div>

          {product.short_description && (
            <div
              className="text-lg md:text-xl text-white/80 line-clamp-3 md:line-clamp-2 drop-shadow-lg max-w-2xl font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.short_description) }}
            />
          )}

          <div className="flex items-center gap-3 md:gap-4 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onAddToCart(product.id)}
              className="flex items-center gap-2 bg-white text-black px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg hover:bg-white/90 transition-colors shadow-xl"
              disabled={isAddingToCart}
            >
              {isAddingToCart ? <Loader2 className="animate-spin" /> : <Play className="fill-black" size={24} />}
              {t('shop.buy_now')}
            </motion.button>

            <Link
              to={`${productBasePath}/${product.slug}`}
              className="flex items-center gap-2 bg-white/20 text-white px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg backdrop-blur-md hover:bg-white/30 transition-colors border border-white/10"
            >
              <Info size={24} />
              {t('shop.product_details')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
});

// --- ProductCard (Expandable on Hover) ---
interface ProductCardProps {
  product: Product;
  formatPrice: (price: string) => string;
  onAddToCart: (id: number) => void;
  isAddingToCart: boolean;
  productBasePath: string;
}

const ProductCard = memo(({ product, formatPrice, onAddToCart, isAddingToCart, productBasePath }: ProductCardProps) => {
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
            src={safeUrl(product.images[0]?.sizes?.medium || product.images[0]?.sizes?.medium_large || product.images[0]?.src, 'https://placehold.co/640x360/0D96FF/FFFFFF')}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover/card:from-black/35 transition-colors" />
          {product.on_sale && (
            <div className="absolute top-2 right-2 bg-error text-white px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
              {t('badge_sale')}
            </div>
          )}
        </Link>

        <div className="p-4 bg-surface/95 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 delay-100 border-t border-white/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isAddingToCart) onAddToCart(product.id);
                }}
                disabled={isAddingToCart}
                aria-busy={isAddingToCart}
                aria-label={t('shop.add_to_cart')}
                className={`w-8 h-8 rounded-full bg-white text-black flex items-center justify-center transition-all ${isAddingToCart ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/80'
                  }`}
                title={t('shop.add_to_cart')}
              >
                {isAddingToCart ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-black" />}
              </button>
              <Link
                to={`${productBasePath}/${product.slug}`}
                className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20"
                title={t('shop.product_details')}
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

          <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-white/60">
            <span className="text-green-500 font-bold">{t('shop.match_score')}</span>
            <span className="border border-white/30 px-1.5 rounded-sm uppercase tracking-tighter">
              {t('shop.cremosidade_level')}
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
});

// --- ProductRow (Netflix-style Carousel) ---
interface ProductRowProps {
  title: string;
  products: Product[];
  onAddToCart: (id: number) => void;
  isAdding: boolean; // OPTIMIZATION: Use boolean to prevent all rows re-rendering
  activeProductId: number | null;
  formatPrice: (price: string) => string;
  productBasePath: string;
}

const ProductRow = memo(({ title, products, onAddToCart, isAdding, activeProductId, formatPrice, productBasePath }: ProductRowProps) => {
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
      window.addEventListener('resize', checkScroll); // OPTIMIZATION: Resync on resize
      return () => {
        carousel.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
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
              isAddingToCart={isAdding && activeProductId === product.id} // OPTIMIZATION: Only compute if row is loading
              productBasePath={productBasePath}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// --- Componente Principal da Página ---
const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const isPortuguese = i18n.language.startsWith('pt');
  const canonicalUrl = useMemo(
    () => `https://djzeneyer.com/${getLocalizedRoute('shop', currentLang).replace(/^\//, '')}`,
    [currentLang]
  );
  const productBasePath = isPortuguese ? '/pt/loja/produto' : '/shop/product';

  const { data: shopData, isLoading: loading } = useShopPageQuery(currentLang);
  const addToCartMutation = useAddToCartMutation();
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Função para adicionar ao carrinho (OPTIMIZATION: useCallback)
  const handleAddToCart = useCallback(async (productId: number) => {
    setAddingToCart(productId);
    try {
      await addToCartMutation.mutateAsync({ productId, quantity: 1 });
      setShowToast(true);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(null);
    }
  }, [addToCartMutation]);

  // Utilitário de formatação de preço (OPTIMIZATION: useCallback)
  const formatPrice = useCallback((price: string) => {
    if (!price) return isPortuguese ? 'R$ 0,00' : '$ 0.00';
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? 'pt-BR' : 'en-US';
    const currency = isPortuguese ? 'BRL' : 'USD'; // OPTIMIZATION: Dynamic currency symbol
    return isNaN(numPrice)
      ? price
      : new Intl.NumberFormat(locale, { style: 'currency', currency }).format(numPrice);
  }, [isPortuguese]);

  const featuredProduct = Array.isArray(shopData?.featured) 
    ? shopData.featured[0] 
    : (shopData?.featured || null);
  const newReleases = shopData?.new_releases || [];
  const bestSellers = shopData?.best_sellers || [];
  const curatedSelection = shopData?.curated || [];
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#141414] text-white">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  // Removed the `if (error)` block as error handling is now per-query and not aggregated in a single `error` state.

  return (
    <div className="min-h-screen bg-[#141414] text-white relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 left-[-15%] h-[460px] w-[460px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-[28%] right-[-12%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <HeadlessSEO
        title={`${t('shop.page_title')} | ${t('common.artist_name')}`}
        description={t('shop.page_meta_desc')}
        url={canonicalUrl}
      />

      <Toast
        message={t('shop.product_added')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* --- Billboard (Netflix Hero) --- */}
      {featuredProduct ? (
        <ShopHero
          product={featuredProduct}
          onAddToCart={handleAddToCart}
          isAddingToCart={addingToCart === featuredProduct.id}
          productBasePath={productBasePath}
        />
      ) : (
        <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-dark from-primary/10 to-[#141414]" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-8xl font-black font-display mb-6 tracking-tighter uppercase leading-[0.8] opacity-40 hover:opacity-100 transition-opacity duration-700 select-none">
                Zen <span className="text-primary italic">Store</span>
              </h1>
              <p className="text-xl text-white/40 font-bold uppercase tracking-widest">
                {t('shop.coming_soon_msg', 'Exclusividade em cada batida.')}
              </p>
            </motion.div>
          </div>
        </div>
      )}

      {/* --- Netflix-style Lists (Rows) --- */}
      <div className="relative z-20 pb-20 -mt-8 md:-mt-12 lg:-mt-16 space-y-12 md:space-y-16">
        {newReleases.length > 0 || bestSellers.length > 0 || curatedSelection.length > 0 ? (
          <>
            <ProductRow
              title={t('shop.new_releases')}
              products={newReleases}
              onAddToCart={handleAddToCart}
              isAdding={newReleases.some(p => p.id === addingToCart)}
              activeProductId={addingToCart}
              formatPrice={formatPrice}
              productBasePath={productBasePath}
            />

            <ProductRow
              title={t('badge_sale')}
              products={bestSellers}
              onAddToCart={handleAddToCart}
              isAdding={bestSellers.some(p => p.id === addingToCart)}
              activeProductId={addingToCart}
              formatPrice={formatPrice}
              productBasePath={productBasePath}
            />

            <ProductRow
              title={t('shop.top_picks')}
              products={curatedSelection}
              onAddToCart={handleAddToCart}
              isAdding={curatedSelection.some(p => p.id === addingToCart)}
              activeProductId={addingToCart}
              formatPrice={formatPrice}
              productBasePath={productBasePath}
            />
          </>
        ) : (
          <div className="container mx-auto px-6 py-20 text-center">
            <div className="p-16 rounded-[3rem] bg-white/[0.02] border border-dashed border-white/10 backdrop-blur-sm max-w-4xl mx-auto">
              <Loader2 className="w-12 h-12 text-primary/30 mx-auto mb-6 animate-spin" />
              <h3 className="text-3xl font-display font-bold mb-4 opacity-70">
                {t('shop.empty_title', 'O Baú está Sendo Preparado')}
              </h3>
              <p className="text-white/30 text-lg max-w-lg mx-auto leading-relaxed mb-8">
                Estamos organizando os novos lançamentos e produtos exclusivos da Zen Tribe. Fique de olho no seu e-mail para o drop!
              </p>
              <Link to={getLocalizedRoute('zentribe', currentLang)} className="btn btn-primary px-10 py-4 uppercase font-black tracking-widest">
                {t('shop.join_tribe_waitlist', 'Entrar na Lista VIP')}
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* --- Netflix-style Footer Section (Benefits) --- */}
      <section className="px-6 md:px-12 lg:px-20 py-20 bg-background border-t border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {[
            { icon: Truck, title: t('shop.benefits.instant_delivery'), desc: t('shop.benefits.instant_delivery_desc') },
            { icon: Shield, title: t('shop.benefits.secure_payment'), desc: t('shop.benefits.secure_payment_desc') },
            { icon: Gift, title: t('shop.benefits.tribe_perks'), desc: t('shop.benefits.tribe_perks_desc') },
            { icon: Zap, title: t('shop.benefits.vip_support'), desc: t('shop.benefits.vip_support_desc') },
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

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary React reconciliation loops when parent layout components (like routers) trigger render cycles.
export default React.memo(ShopPage);
