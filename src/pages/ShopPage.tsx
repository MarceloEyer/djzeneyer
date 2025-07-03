// src/pages/ShopPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // 1. Importa o hook correto
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    wpData?: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

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
  const { t } = useTranslation(); // 2. Usa o novo hook
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const normalizeProduct = useCallback((productData: any): Product => {
    let imageUrl = 'https://placehold.co/600x600/101418/6366F1?text=Zen+Eyer';
    let imageAlt = productData.name || 'Imagem do produto';

    if (productData.images && productData.images.length > 0) {
      const firstImage = productData.images[0];
      imageUrl = firstImage.src || firstImage.url || firstImage.full_src || imageUrl;
      imageAlt = firstImage.alt || imageAlt;
    }
    
    return {
      id: productData.id || 0,
      name: productData.name || 'Produto sem nome',
      slug: productData.slug || `product-${productData.id}`,
      price: String((parseFloat(productData.prices?.price || '0') / 100).toFixed(2)),
      on_sale: productData.on_sale || false,
      regular_price: String((parseFloat(productData.prices?.regular_price || '0') / 100).toFixed(2)),
      sale_price: String((parseFloat(productData.prices?.sale_price || '0') / 100).toFixed(2)),
      images: [{ src: imageUrl, alt: imageAlt }],
      stock_status: productData.is_in_stock ? 'instock' : 'outofstock',
    };
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const apiUrl = `${window.wpData?.restUrl || `${window.location.origin}/wp-json/`}wc/store/v1/products`;
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Falha ao buscar produtos.");
      const data = await response.json();
      setProducts(data.map(normalizeProduct));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [normalizeProduct]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
      navigate('/checkout');
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
      setAddingToCart(null);
    }
  };
  
  const formatPrice = (price: string) => `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white">
      <Loader2 className="animate-spin text-primary" size={48} />
      <p className="mt-6 text-xl font-medium">{t('shop_loading_text')}</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex justify-center items-center text-red-500">
      <AlertCircle className="mr-2" /> {error}
    </div>
  );

  return (
    <motion.div className="container mx-auto px-4 py-24 text-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-3xl md:text-4xl font-extrabold font-display text-center mb-16">
        {t('shop_page_title')}
      </h1>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <motion.div key={product.id} className="bg-surface/50 border border-white/10 rounded-2xl flex flex-col">
            <Link to={`/product/${product.slug}`} className="block">
              <img src={product.images[0].src} alt={product.images[0].alt} className="w-full h-64 object-cover rounded-t-2xl" />
            </Link>
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-3 flex-grow">{product.name}</h2>
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
                  {addingToCart === product.id ? ( <Loader2 size={18} className="animate-spin" /> ) : ( <ShoppingCart size={18} /> )}
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