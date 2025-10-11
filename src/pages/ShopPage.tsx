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
  TrendingUp
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
  lang: string;
}

// Componente de Carrossel Horizontal (estilo Netflix)
const ProductCarousel: React.FC<{
  title: string;
  products: Product[];
  onAddToCart: (id: number) => void;
  addingToCart: number | null;
  formatPrice: (price: string) => string;
}> = ({ title, products, onAddToCart, addingToCart, formatPrice }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Verifica se pode rolar
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

  // Função para rolar
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
      {/* Título da seção */}
      <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4 md:px-8">
        {title}
      </h2>

      {/* Botões de navegação */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/90 hover:bg-background p-3 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Scroll left"
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
            aria-label="Scroll right"
          >
            <ChevronRight size={32} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Carrossel de produtos */}
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
            {/* Card do produto estilo Netflix */}
            <div className="relative rounded-lg overflow-hidden bg-surface shadow-xl">
              {/* Imagem/Capa do evento */}
              <Link to={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img 
                    src={product.images[0]?.src || 'https://placehold.co/640x360/101418/6366F1?text=Event'} 
                    alt={product.images[0]?.alt || product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                  />
                  
                  {/* Overlay escuro */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60" />
                  
                  {/* Badge de promoção */}
                  {product.on_sale && (
                    <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-md text-xs font-bold uppercase">
                      Promo
                    </div>
                  )}

                  {/* Badge NEW */}
                  <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-md text-xs font-bold uppercase">
                    New
                    </div>
                </div>
              </Link>

              {/* Informações do evento */}
              <div className="p-4">
                {/* Título */}
                <Link to={`/product/${product.slug}`}>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Metadados do evento */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>15 Nov, 2024</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>18:00</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span>4.8</span>
                  </div>
                </div>

                {/* Localização */}
                <div className="flex items-start gap-2 text-sm text-white/60 mb-4">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">São Paulo, SP - Brasil</span>
                </div>

                {/* Preço e botão */}
                <div className="flex items-center justify-between gap-3">
                  {/* Preço */}
                  <div className="flex-1">
                    {product.on_sale ? (
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

                  {/* Botão de compra */}
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
                      <span>Comprar</span>
                    </motion.button>
                  ) : (
                    <button disabled className="btn bg-surface text-white/30 px-4 py-2 text-sm font-bold cursor-not-allowed">
                      Esgotado
                    </button>
                  )}
                </div>
              </div>

              {/* Hover overlay com mais ações */}
              <div className="absolute inset-0 bg-background/95 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <Link 
                  to={`/product/${product.slug}`}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Ver detalhes"
                >
                  <Info size={24} />
                </Link>
                <button 
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  aria-label="Adicionar aos favoritos"
                >
                  <Heart size={24} />
                </button>
                <Link
                  to={`/product/${product.slug}`}
                  className="p-3 bg-primary hover:bg-primary/80 rounded-full transition-colors"
                  aria-label="Ver trailer"
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

  // Busca produtos
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    const apiUrl = `${baseUrl}djzeneyer/v1/products?lang=${currentLang}`;

    try {
      const response = await fetch(apiUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err: any) {
      console.error('[ShopPage] Erro:', err);
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

  // Categoriza produtos (exemplo simplificado)
  const featuredProducts = products.slice(0, 5);
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
        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
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
        {/* Hero Section - Featured Event */}
        {featuredProducts.length > 0 && (
          <div className="relative h-[70vh] md:h-[80vh] mb-8">
            {/* Background image */}
            <div className="absolute inset-0">
              <img 
                src={featuredProducts[0].images[0]?.src || ''} 
                alt={featuredProducts[0].name}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
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
                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold uppercase">
                      Featured
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} className="fill-yellow-500" />
                      <span className="text-white font-semibold">4.9</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 drop-shadow-lg">
                    {featuredProducts[0].name}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-lg mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} />
                      <span>15 Nov, 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} />
                      <span>400+ confirmados</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-lg text-white/80 mb-8 line-clamp-3">
                    Uma noite inesquecível de Brazilian Zouk com os melhores DJs e dançarinos. 
                    Venha viver essa experiência única e conectar-se com a comunidade Zen Tribe.
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-4">
                    <Link
                      to={`/product/${featuredProducts[0].slug}`}
                      className="btn btn-primary px-8 py-4 text-lg font-bold flex items-center gap-3"
                    >
                      <ShoppingCart size={24} />
                      <span>Comprar Ingresso</span>
                    </Link>
                    <Link
                      to={`/product/${featuredProducts[0].slug}`}
                      className="btn btn-outline px-8 py-4 text-lg font-bold flex items-center gap-3"
                    >
                      <Info size={24} />
                      <span>Mais Info</span>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Carrosséis de produtos */}
        <div className="pb-16">
          <ProductCarousel 
            title="🔥 Bombando Perto de Você"
            products={upcomingProducts}
            onAddToCart={addToCart}
            addingToCart={addingToCart}
            formatPrice={formatPrice}
          />

          <ProductCarousel 
            title="⭐ Sua Próxima Festa Perfeita"
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
