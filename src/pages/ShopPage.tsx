// src/pages/ShopPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';

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
  // Extrai idioma base (pt ou en) do i18n
  const currentLang = i18n.language.split('-')[0];
  const navigate = useNavigate();
  
  // Estados do componente
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  console.log('[ShopPage] Renderizando componente');
  console.log('[ShopPage] Idioma i18n completo:', i18n.language);
  console.log('[ShopPage] Idioma extraído:', currentLang);

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
    };
  }, []);

  // Busca produtos da API WooCommerce filtrando por idioma
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    console.log('[ShopPage] 🔄 Iniciando fetchProducts');
    console.log('[ShopPage] Idioma para filtro de produtos:', currentLang);

    // Pega credenciais WooCommerce do .env
    const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
    const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;

    // Valida se credenciais existem
    if (!consumerKey || !consumerSecret) {
      console.error('[ShopPage] ❌ Credenciais WooCommerce ausentes no .env');
      console.error('[ShopPage] VITE_WC_CONSUMER_KEY:', consumerKey ? 'definida' : 'AUSENTE');
      console.error('[ShopPage] VITE_WC_CONSUMER_SECRET:', consumerSecret ? 'definida' : 'AUSENTE');
      setError("Erro de configuração: Credenciais da API ausentes.");
      setLoading(false);
      return;
    }

    // Monta URL da API com filtro de idioma para Polylang/WPML
    const baseUrl = window.wpData?.restUrl || `${window.location.origin}/wp-json/`;
    const apiUrl = `${baseUrl}wc/v3/products?lang=${currentLang}&status=publish&per_page=100&consumer_key=${consumerKey}&consumer_secret=${consumerSecret}`;

    console.log('[ShopPage] 📡 URL da API:', apiUrl.replace(consumerKey, 'ck_***').replace(consumerSecret, 'cs_***'));

    try {
      const response = await fetch(apiUrl);
      console.log('[ShopPage] 📥 Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[ShopPage] ❌ Erro na API:', errorText);
        throw new Error(`Falha ao buscar produtos: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('[ShopPage] ✅ Produtos recebidos:', data.length);
      console.log('[ShopPage] Dados brutos dos produtos:', data);

      // Normaliza todos os produtos recebidos
      const normalizedProducts = data.map(normalizeProduct);
      setProducts(normalizedProducts);

      console.log('[ShopPage] ✅ Produtos normalizados e salvos:', normalizedProducts.length);
    } catch (err: any) {
      console.error('[ShopPage] ❌ Erro ao buscar produtos:', err);
      console.error('[ShopPage] Stack trace:', err.stack);
      setError(err.message || "Erro desconhecido ao buscar produtos.");
    } finally {
      setLoading(false);
      console.log('[ShopPage] 🏁 fetchProducts finalizado');
    }
  }, [normalizeProduct, currentLang]);

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
        throw new Error(data.message || 'Não foi possível adicionar ao carrinho.');
      }
      // Redireciona para checkout após adicionar ao carrinho
      navigate('/checkout');
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setAddingToCart(null);
    }
  };

  // Formata preço para padrão brasileiro (R$ 00,00)
  const formatPrice = (price: string) => `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;

  // Estado de carregamento
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="mt-6 text-xl font-medium">{t('shop_loading_text')}</p>
    </div>
  );

  // Estado de erro
  if (error) return (
    <div className="min-h-screen flex justify-center items-center text-red-500">
      <AlertCircle className="mr-2" /> {error}
    </div>
  );

  // Renderização principal da loja
  return (
    <motion.div className="container mx-auto px-4 py-24 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl md:text-4xl font-extrabold font-display text-center mb-16">
        {t('shop_page_title')}
      </h1>
      
      {/* Grid de produtos */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <motion.div key={product.id} className="bg-surface/50 border border-white/10 rounded-2xl flex flex-col">
            {/* Imagem do produto - clicável para página de detalhes */}
            <Link to={`/product/${product.slug}`} className="block">
              <img src={product.images[0].src} alt={product.images[0].alt} className="w-full h-64 object-cover rounded-t-2xl" />
            </Link>
            
            {/* Informações do produto */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-3 flex-grow">{product.name}</h2>
              
              {/* Preço com destaque para promoção */}
              <div className="text-xl font-bold mb-4 h-14 flex items-center">
                {product.on_sale ? (
                  <div>
                    <span className="text-lg text-gray-400 line-through mr-2">{formatPrice(product.regular_price)}</span>
                    <span className="text-primary">{formatPrice(product.price)}</span>
                  </div>
                ) : (
                  <span>{formatPrice(product.price)}</span>
                )}
              </div>
              
              {/* Botão de adicionar ao carrinho ou fora de estoque */}
              {product.stock_status === 'outofstock' ? (
                <button disabled className="w-full btn bg-gray-600 text-gray-400 cursor-not-allowed">
                  {t('shop_out_of_stock')}
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={!!addingToCart}
                  className="w-full btn bg-primary hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-50 mt-auto"
                >
                  {addingToCart === product.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <ShoppingCart size={18} />
                  )}
                  <span>{addingToCart === product.id ? t('shop_adding_text') : t('shop_add_to_cart_button')}</span>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ShopPage;
