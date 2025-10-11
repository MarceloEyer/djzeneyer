// src/pages/ShopPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Loader2, ShoppingCart, AlertCircle, Sparkles, Zap, Gift } from 'lucide-react';

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
  lang?: string; // Idioma do produto (Polylang)
  translations?: { [key: string]: number }; // IDs das traduções
}

const ShopPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  // Extrai idioma base (pt ou en) do i18n
  const currentLang = i18n.language.split('-')[0];
  const navigate = useNavigate();
  
  // Estados do componente
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  console.log('[ShopPage] Renderizando componente');
  console.log('[ShopPage] Idioma atual:', currentLang);

  // Normaliza dados do produto vindos da API WooCommerce
  const normalizeProduct = useCallback((productData: any): Product => {
    // Define imagem padrão caso produto não tenha imagem
    let imageUrl = 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer';
    let imageAlt = productData.name || 'Imagem do produto';

    // Extrai imagem do produto se disponível
    if (productData.images && productData.images.length > 0) {
      const firstImage = productData.images[0];
      imageUrl = firstImage.src || firstImage.url || firstImage.full_src || imageUrl;
      imageAlt = firstImage.alt || imageAlt;
    }

    // Calcula preços e verifica se está em promoção
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
      lang: productData.lang || productData.language || currentLang, // Campo do Polylang
      translations: productData.translations || {},
    };
  }, [currentLang]);

  // Busca produtos da API WooCommerce filtrando por idioma
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log('[ShopPage] 🔄 Iniciando fetchProducts');
    console.log('[ShopPage] Idioma para filtro:', currentLang);

    // Pega credenciais WooCommerce do .env
    const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;

    // Valida se credenciais existem
    if (!consumerKey || !consumerSecret) {
      console.error('[ShopPage] ❌ Credenciais WooCommerce ausentes no .env');
      setError(t('shop_error_credentials'));
      setLoading(false);
      return;
    }

    // Monta URL da API WooCommerce
    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    // Busca TODOS os produtos publicados (filtraremos no frontend)
    const apiUrl = `${baseUrl}wc/v3/products?status=publish&per_page=100&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    console.log('[ShopPage] 📡 URL da API:', apiUrl.replace(consumerKey, 'ck_***').replace(consumerSecret, 'cs_***'));

    try {
      const response = await fetch(apiUrl);
      console.log('[ShopPage] 📥 Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ShopPage] ❌ Erro na API:', errorText);
        throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      }

      const data = await response.json();
      console.log('[ShopPage] ✅ Produtos recebidos:', data.length);

      // Normaliza todos os produtos recebidos
      const normalizedProducts = data.map(normalizeProduct);
      
      // FIX: Filtra produtos pelo idioma atual (Polylang)
      const filteredProducts = normalizedProducts.filter((product: Product) => {
        const productLang = product.lang || 'en';
        const matches = productLang === currentLang;
        console.log(`[ShopPage] Produto "${product.name}" - Lang: ${productLang}, Match: ${matches}`);
        return matches;
      });

      setProducts(filteredProducts);
      console.log('[ShopPage] ✅ Produtos filtrados por idioma:', filteredProducts.length);
    } catch (err: any) {
      console.error('[ShopPage] ❌ Erro ao buscar produtos:', err);
      setError(err.message || t('shop_error_unknown'));
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct, currentLang, t]);

  // Busca produtos quando componente monta ou idioma muda
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Adiciona produto ao carrinho via API customizada
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
      // Redireciona para checkout após adicionar ao carrinho
      navigate('/checkout');
    } catch (err: any) {
      alert(`${t('error')}: ${err.message}`);
      setAddingToCart(null);
    }
  };

  // Formata preço para padrão brasileiro (R$ 00,00)
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return currentLang === 'pt' 
      ? `R$ ${numPrice.toFixed(2).replace('.', ',')}` 
      : `$ ${numPrice.toFixed(2)}`;
  };

  // Animações para os cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Estado de carregamento
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white pt-24">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="mt-6 text-xl font-medium">{t('loading')}</p>
    </div>
  );

  // Estado de erro
  if (error) return (
    <div className="min-h-screen flex justify-center items-center text-red-500 pt-24">
      <AlertCircle className="mr-2" size={24} />
      <span>{error}</span>
    </div>
  );

  // Renderização principal da loja
  return (
    <>
      <Helmet>
        <title>{t('shop_page_title')} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_meta_desc')} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-b from-primary/20 to-transparent py-16 mb-12">
          <motion.div 
            className="container mx-auto px-4 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4 flex items-center justify-center gap-3">
              <Sparkles className="text-primary" size={40} />
              {t('shop_title')}
              <Sparkles className="text-primary" size={40} />
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              {t('shop_subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4">
          {/* Mensagem se não houver produtos */}
          {products.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Gift className="mx-auto text-white/30 mb-4" size={64} />
              <p className="text-xl text-white/70">{t('shop_empty_cta')}</p>
            </motion.div>
          ) : (
            /* Grid de produtos com animações */
            <motion.div 
              className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {products.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="group relative bg-surface/50 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
                  variants={cardVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  {/* Badge de promoção */}
                  {product.on_sale && (
                    <div className="absolute top-4 right-4 z-10 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                      <Zap size={14} />
                      {t('badge_featured')}
                    </div>
                  )}

                  {/* Badge novo (opcional - pode adicionar lógica de data) */}
                  <div className="absolute top-4 left-4 z-10 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {t('shop_vibe_tag')}
                  </div>

                  {/* Imagem do produto - clicável para página de detalhes */}
                  <Link to={`/product/${product.slug}`} className="block relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img 
                      src={product.images[0].src} 
                      alt={product.images[0].alt} 
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </Link>
                  
                  {/* Informações do produto */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold mb-3 flex-grow group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    
                    {/* Preço com destaque para promoção */}
                    <div className="text-xl font-bold mb-4 min-h-[3.5rem] flex items-center">
                      {product.on_sale ? (
                        <div className="flex flex-col">
                          <span className="text-base text-white/50 line-through">
                            {formatPrice(product.regular_price)}
                          </span>
                          <span className="text-2xl text-accent flex items-center gap-1">
                            <Zap size={18} className="text-accent" />
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-primary">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    
                    {/* Botão de adicionar ao carrinho ou fora de estoque */}
                    {product.stock_status === 'outofstock' ? (
                      <button 
                        disabled 
                        className="w-full btn bg-surface text-white/40 cursor-not-allowed border border-white/10"
                      >
                        {t('shop_out_of_stock')}
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={!!addingToCart}
                        className="w-full btn bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/50 flex items-center justify-center gap-2 disabled:opacity-50 mt-auto transition-all duration-300 group-hover:scale-105"
                      >
                        {addingToCart === product.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <ShoppingCart size={18} />
                        )}
                        <span className="font-semibold">
                          {addingToCart === product.id ? t('shop_adding_text') : t('add_to_cart')}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Efeito de brilho no hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
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
