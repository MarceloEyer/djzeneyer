// src/pages/ShopPage.tsx
// Visual inspirado em Netflix para venda de ingressos de eventos

import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { Link, generatePath } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { stripHtml } from '../utils/text';
import { useShopPageQuery, useAddToCartMutation, WCProduct } from '../hooks/useQueries';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { Breadcrumb } from '../components/Breadcrumb';
import { Toast } from '../components/common/Toast';
import { getCurrencyFormatter } from '../utils/currency';
import { logger } from '../lib/logger';
import { ARTIST } from '../data/artistData';
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

// ⚡ Bolt: Define static empty array to prevent unnecessary reallocation and preserve reference equality on empty states
const EMPTY_PRODUCT_ARRAY: WCProduct[] = [];
const BUY_BUTTON_HOVER = { scale: 1.05 };
const BUY_BUTTON_TAP = { scale: 0.95 };

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
        className={`h-full w-4 rounded-full transition-all duration-300 ${i === active ? 'bg-primary w-8' : 'bg-text/20'}`}
      />
    ))}
  </div>
);

// --- ShopHero (Cinematic Billboard) ---
interface ShopHeroProps {
  product: Product;
  onAddToCart: (id: number) => void;
  isAddingToCart: boolean; // OPTIMIZATION: Use boolean instead of ID
  getProductPath: (slug: string) => string;
}

const ShopHero = memo(({ product, onAddToCart, isAddingToCart, getProductPath }: ShopHeroProps) => {
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
          width="1200"
          height="675"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background to-transparent" />
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
            <span className="text-text font-black text-xs md:text-sm uppercase flex items-center gap-2 bg-background/35 border border-border/20 rounded-full px-3 py-1 backdrop-blur-sm">
              {t('shop.artist_badge')} <span className="text-text/60">{t('badge_featured')}</span>
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-display text-text leading-[0.92] drop-shadow-2xl max-w-4xl text-balance">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-base">
            <span className="text-primary font-bold">{t('shop.match_score')}</span>
            <span className="text-text/60">2024</span>
            <span className="border border-border/40 px-2 py-1 text-[11px] md:text-xs text-text/85 rounded-full bg-background/35">
              {t('shop.cremosidade_level')}
            </span>
            <span className="text-text/60">HD</span>
          </div>

          {product.short_description && (
            <div
              className="text-lg md:text-xl text-text/80 line-clamp-3 md:line-clamp-2 drop-shadow-lg max-w-2xl font-light leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.short_description) }}
            />
          )}

          <div className="flex items-center gap-3 md:gap-4 pt-4">
            <motion.button
              whileHover={BUY_BUTTON_HOVER}
              whileTap={BUY_BUTTON_TAP}
              onClick={() => onAddToCart(product.id)}
              className="flex items-center gap-2 bg-text text-background px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg hover:bg-text/90 transition-colors shadow-xl"
              disabled={isAddingToCart}
            >
              {isAddingToCart ? <Loader2 className="animate-spin" /> : <Play className="fill-background" size={24} />}
              {t('shop.buy_now')}
            </motion.button>

            <Link
              to={getProductPath(product.slug)}
              className="flex items-center gap-2 bg-text/20 text-text px-6 md:px-10 py-3 md:py-4 rounded-md font-bold text-lg backdrop-blur-md hover:bg-text/30 transition-colors border border-border/10"
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

// --- ProductCard ---
interface ProductCardProps {
  product: Product;
  formatPrice: (price: string) => string;
  onAddToCart: (id: number) => void;
  isAddingToCart: boolean;
  getProductPath: (slug: string) => string;
}

const ProductCard = memo(({ product, formatPrice, onAddToCart, isAddingToCart, getProductPath }: ProductCardProps) => {
  const { t } = useTranslation();
  const productPath = getProductPath(product.slug);
  const productDescription = product.short_description || product.description || '';
  const isInStock = product.stock_status === 'instock';

  return (
    <motion.article
      className="flex-shrink-0 w-[260px] md:w-[320px] lg:w-[360px] relative z-10"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="card-outer flex h-full flex-col bg-surface border border-border/10 rounded-md overflow-hidden shadow-2xl transition-colors hover:border-primary/40">
        <Link to={productPath} className="block relative aspect-[16/9] overflow-hidden">
          <img
            src={safeUrl(product.images[0]?.sizes?.medium || product.images[0]?.sizes?.medium_large || product.images[0]?.src, 'https://placehold.co/640x360/0D96FF/FFFFFF')}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            width="640"
            height="360"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
          {product.on_sale && (
            <div className="absolute top-2 right-2 bg-error text-text px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter">
              {t('badge_sale')}
            </div>
          )}
        </Link>

        <div className="p-4 bg-surface/95 border-t border-border/5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (!isAddingToCart) onAddToCart(product.id);
                }}
                disabled={isAddingToCart || !isInStock}
                aria-busy={isAddingToCart}
                aria-label={t('shop.add_to_cart')}
                className={`w-8 h-8 rounded-full bg-text text-background flex items-center justify-center transition-all ${(isAddingToCart || !isInStock) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-text/80'
                  }`}
                title={t('shop.add_to_cart')}
              >
                {isAddingToCart ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} className="fill-black" />}
              </button>
              <Link
                to={productPath}
                className="h-8 rounded-full bg-text/10 text-text flex items-center justify-center gap-1.5 px-3 hover:bg-text/20 transition-colors border border-border/20 text-[10px] font-bold uppercase tracking-widest"
                title={t('shop.product_details')}
              >
                <Plus size={16} />
                <span>{t('shop.product_details')}</span>
              </Link>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-primary">
              {formatPrice(product.price)}
            </div>
          </div>

          <h3 className="text-sm md:text-base font-bold text-text mb-2 line-clamp-2">
            {product.name}
          </h3>

          {productDescription && (
            <div
              className="text-xs md:text-sm leading-relaxed text-text/70 line-clamp-3 mb-3"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(productDescription) }}
            />
          )}

          <div className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs text-text/60">
            <span className={isInStock ? 'text-green-400 font-bold' : 'text-error font-bold'}>
              {isInStock ? t('shop.in_stock') : t('shop.out_of_stock')}
            </span>
            <span className="border border-border/30 px-1.5 rounded-sm uppercase tracking-tighter">
              {t('shop.cremosidade_level')}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {product.categories?.slice(0, 2).map((cat, idx) => (
              <span key={idx} className="text-[9px] text-text/40 after:content-['•'] after:ml-1 last:after:content-none whitespace-nowrap">
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
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
  getProductPath: (slug: string) => string;
}

const ProductRow = memo(({ title, products, onAddToCart, isAdding, activeProductId, formatPrice, getProductPath }: ProductRowProps) => {
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
    // Initial sync
    checkScroll();
  }, [products, checkScroll]);

  useEffect(() => {
    // Resync on window resize (passive for performance)
    window.addEventListener('resize', checkScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

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
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-display text-text group-hover:text-primary transition-colors cursor-default">
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
              className="absolute left-0 top-0 bottom-0 z-40 bg-background/40 hover:bg-background/60 w-12 md:w-16 flex items-center justify-center group/btn"
            >
              <ChevronLeft size={48} className="text-text group-hover/btn:scale-125 transition-transform" />
            </motion.button>
          )}

          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="absolute right-0 top-0 bottom-0 z-40 bg-background/40 hover:bg-background/60 w-12 md:w-16 flex items-center justify-center group/btn"
            >
              <ChevronRight size={48} className="text-text group-hover/btn:scale-125 transition-transform" />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6 md:px-12 lg:px-20 py-4 scroll-smooth items-stretch"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              formatPrice={formatPrice}
              onAddToCart={onAddToCart}
              isAddingToCart={isAdding && activeProductId === product.id} // OPTIMIZATION: Only compute if row is loading
              getProductPath={getProductPath}
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
    () => `${ARTIST.site.baseUrl}${getLocalizedRoute('shop', currentLang)}`,
    [currentLang]
  );
  const productDetailRoute = useMemo(() => getLocalizedRoute('product-detail', currentLang), [currentLang]);
  const getProductPath = useCallback(
    (slug: string) => generatePath(productDetailRoute, { slug }),
    [productDetailRoute]
  );

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
      logger.error('SHOP_PAGE', 'Error adding to cart', { error: String(err) });
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
      : getCurrencyFormatter(locale, currency).format(numPrice);
  }, [isPortuguese]);

  const featuredProduct = Array.isArray(shopData?.featured)
    ? shopData.featured[0]
    : (shopData?.featured || null);
  const newReleases = shopData?.new_releases || EMPTY_PRODUCT_ARRAY;
  const bestSellers = shopData?.best_sellers || EMPTY_PRODUCT_ARRAY;
  const curatedSelection = shopData?.curated || EMPTY_PRODUCT_ARRAY;

  const newReleasesIds = useMemo(() => new Set(newReleases.map(p => p.id)), [newReleases]);
  const bestSellersIds = useMemo(() => new Set(bestSellers.map(p => p.id)), [bestSellers]);
  const curatedSelectionIds = useMemo(() => new Set(curatedSelection.map(p => p.id)), [curatedSelection]);
  const visibleProducts = useMemo(() => {
    const productsById = new Map<number, Product>();

    // ⚡ Bolt: Replaced spread operator array creation with direct iteration to avoid O(N) memory allocation per render
    if (featuredProduct) productsById.set(featuredProduct.id, featuredProduct);

    for (let i = 0; i < newReleases.length; i++) {
      const p = newReleases[i];
      if (p) productsById.set(p.id, p);
    }

    for (let i = 0; i < bestSellers.length; i++) {
      const p = bestSellers[i];
      if (p) productsById.set(p.id, p);
    }

    for (let i = 0; i < curatedSelection.length; i++) {
      const p = curatedSelection[i];
      if (p) productsById.set(p.id, p);
    }

    return Array.from(productsById.values());
  }, [bestSellers, curatedSelection, featuredProduct, newReleases]);
  const shopSchema = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: t('shop.page_title'),
        description: t('shop.page_meta_desc'),
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        about: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
      },
      {
        '@type': 'ItemList',
        '@id': `${canonicalUrl}#products`,
        name: t('shop.page_title'),
        itemListElement: visibleProducts.map((product, index) => {
          const productUrl = `${ARTIST.site.baseUrl}${getProductPath(product.slug)}`;
          const imageUrl = safeUrl(product.images?.[0]?.sizes?.large || product.images?.[0]?.src, '');
          const price = product.price || product.regular_price;

          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              '@id': `${productUrl}#product`,
              name: product.name,
              url: productUrl,
              sku: String(product.id),
              ...(imageUrl ? { image: imageUrl } : {}),
              ...(product.short_description ? { description: stripHtml(product.short_description) } : {}),
              ...(product.categories?.length ? { category: product.categories.map((category) => category.name).join(', ') } : {}),
              brand: { '@id': `${ARTIST.site.baseUrl}/#musicgroup` },
              offers: {
                '@type': 'Offer',
                url: productUrl,
                priceCurrency: 'BRL',
                ...(price ? { price } : {}),
                availability: product.stock_status === 'instock'
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              },
            },
          };
        }),
      },
    ],
  }), [canonicalUrl, getProductPath, t, visibleProducts]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background text-text">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  // Removed the `if (error)` block as error handling is now per-query and not aggregated in a single `error` state.

  return (
    <div className="min-h-screen bg-background text-text relative overflow-x-clip">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 left-[-15%] h-[460px] w-[460px] rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-[28%] right-[-12%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>
      <HeadlessSEO
        title={`${t('shop.page_title')} | ${t('common.artist_name')}`}
        description={t('shop.page_meta_desc')}
        url={canonicalUrl}
        image={featuredProduct?.images?.[0]?.sizes?.large || featuredProduct?.images?.[0]?.src || '/images/og/zen-eyer-shop-og.jpg'}
        imageAlt={featuredProduct ? t('og.image_alt.product', { name: featuredProduct.name }) : t('og.image_alt.shop')}
        schema={shopSchema}
      />

      <Toast
        message={t('shop.product_added')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="absolute left-0 right-0 top-24 z-30 px-6 md:px-12 lg:px-20">
        <Breadcrumb
          items={[{ label: t('nav.shop') }]}
          className="mx-auto max-w-7xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]"
        />
      </div>

      {/* --- Billboard (Netflix Hero) --- */}
      {featuredProduct ? (
        <ShopHero
          product={featuredProduct}
          onAddToCart={handleAddToCart}
          isAddingToCart={addingToCart === featuredProduct.id}
          getProductPath={getProductPath}
        />
      ) : (
        <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-dark from-primary/10 to-background" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl md:text-8xl font-black font-display mb-6 tracking-tighter uppercase leading-[0.8] opacity-40 hover:opacity-100 transition-opacity duration-700 select-none">
                Zen <span className="text-primary italic">Store</span>
              </h1>
              <p className="text-xl text-text/40 font-bold uppercase tracking-widest">
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
              isAdding={addingToCart !== null && newReleasesIds.has(addingToCart)}
              activeProductId={addingToCart}
              formatPrice={formatPrice}
              getProductPath={getProductPath}
            />

            <ProductRow
              title={t('badge_sale')}
              products={bestSellers}
              onAddToCart={handleAddToCart}
              isAdding={addingToCart !== null && bestSellersIds.has(addingToCart)}
              activeProductId={addingToCart}
              formatPrice={formatPrice}
              getProductPath={getProductPath}
            />

            <ProductRow
              title={t('shop.top_picks')}
              products={curatedSelection}
              onAddToCart={handleAddToCart}
              isAdding={addingToCart !== null && curatedSelectionIds.has(addingToCart)}
              activeProductId={addingToCart}
              formatPrice={formatPrice}
              getProductPath={getProductPath}
            />
          </>
        ) : (
          <div className="container mx-auto px-6 py-20 text-center">
            <div className="p-16 rounded-[3rem] bg-text/[0.02] border border-dashed border-border/10 backdrop-blur-sm max-w-4xl mx-auto">
              <Loader2 className="w-12 h-12 text-primary/30 mx-auto mb-6 animate-spin" />
              <h3 className="text-3xl font-display font-bold mb-4 opacity-70">
                {t('shop.empty_title', 'O Baú está Sendo Preparado')}
              </h3>
              <p className="text-text/30 text-lg max-w-lg mx-auto leading-relaxed mb-8">
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
      <section className="px-6 md:px-12 lg:px-20 py-20 bg-background border-t border-border/5">
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
              <h3 className="font-bold text-lg md:text-xl text-text group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-text/40 leading-relaxed">{item.desc}</p>
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
