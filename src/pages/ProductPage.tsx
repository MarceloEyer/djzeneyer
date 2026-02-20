// src/pages/ProductPage.tsx
// Product detail page for WooCommerce products

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { Loader2, ShoppingCart, AlertCircle, ArrowLeft } from 'lucide-react';
import { ProductImage, ProductCategory } from '../types/product';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

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
  short_description?: string;
  description?: string;
  categories?: ProductCategory[];
}

const ProductPage: React.FC = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const currentLang = normalizeLanguage(i18n.language);
  const isPortuguese = currentLang === 'pt';
  const shopRoute = getLocalizedRoute('shop', currentLang);
  const placeholderImage = 'https://placehold.co/1200x675/0D96FF/FFFFFF?text=DJ+Zen+Eyer';

  const fetchProduct = useCallback(async () => {
    if (!slug) {
      setError(t('shop_product_not_found'));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const baseUrl = (window as any).wpData?.restUrl || `${window.location.origin}/wp-json/`;
    const apiUrl = `${baseUrl}djzeneyer/v1/products?slug=${encodeURIComponent(slug)}&lang=${currentLang}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`${t('shop_error_fetch')}: ${response.status}`);
      const data = await response.json();
      const nextProduct = Array.isArray(data) ? data[0] : null;
      if (!nextProduct) {
        setError(t('shop_product_not_found'));
      } else {
        setProduct(nextProduct);
        setActiveImage(nextProduct.images?.[0]?.src || null);
      }
    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || t('shop_error_unknown'));
    } finally {
      setLoading(false);
    }
  }, [slug, t]);

  useEffect(() => {
    fetchProduct();
  }, [slug, t, currentLang]);
  const addToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      const response = await fetch('/wp-json/wc/store/cart/add-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': (window as any).wpData?.nonce || '',
        },
        credentials: 'include',
        body: JSON.stringify({ id: product.id, quantity: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = useCallback((price: string) => {
    if (!price) return 'R$ 0,00';
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? 'pt-BR' : 'en-US';
    return isNaN(numPrice)
      ? price
      : new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(numPrice);
  }, [isPortuguese]);

  const gallery = useMemo(() => {
    if (!product?.images?.length) return [];
    return product.images.filter((img) => img?.src);
  }, [product?.images]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-error" size={48} />
          <h2 className="text-2xl font-bold mb-2">{t('shop_product_not_found')}</h2>
          <p className="opacity-70">{error}</p>
          <Link to={shopRoute} className="mt-6 btn btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            {t('shop_back_to_shop')}
          </Link>
        </div>
      </div>
    );
  }

  // Optimization: Use large or medium_large for main image if available, fallback to full src
  const mainImageObject = product.images?.[0];
  const optimizedMainImage = mainImageObject?.sizes?.large || mainImageObject?.sizes?.medium_large || mainImageObject?.src;

  const mainImage = activeImage || optimizedMainImage || placeholderImage;

  return (
    <>
      <Helmet>
        <title>{product.name} | DJ Zen Eyer</title>
        <meta
          name="description"
          content={product.short_description || product.description || product.name}
        />
      </Helmet>

      <div className="min-h-screen bg-background text-white pb-20">
        <div className="container mx-auto px-4 py-10">
          <Link to={shopRoute} className="inline-flex items-center gap-2 text-white/70 hover:text-primary mb-6">
            <ArrowLeft size={18} />
            {t('shop_back_to_shop')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <div className="rounded-xl overflow-hidden border border-white/10 bg-surface">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {gallery.map((img, index) => (
                    <button
                      key={`${img.src}-${index}`}
                      onClick={() => setActiveImage(img.src)}
                      className={`rounded-lg overflow-hidden border ${activeImage === img.src ? 'border-primary' : 'border-white/10'}`}
                    >
                      <img src={img.sizes?.thumbnail || img.src} alt={img.alt || product.name} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.categories?.map((category) => (
                  <span
                    key={category.id}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80"
                  >
                    {category.name}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-4 font-display">
                {product.name}
              </h1>

              {product.short_description && (
                <div
                  className="text-white/80 text-lg mb-6"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.short_description) }}
                />
              )}

              <div className="flex items-center gap-4 mb-6">
                {product.on_sale && product.regular_price && (
                  <span className="text-white/40 line-through text-lg">
                    {formatPrice(product.regular_price)}
                  </span>
                )}
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>

              {product.stock_status === 'instock' ? (
                <button
                  onClick={addToCart}
                  disabled={addingToCart}
                  className="btn btn-primary btn-lg flex items-center gap-2 mb-6"
                >
                  {addingToCart ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
                  {t('shop_buy_now')}
                </button>
              ) : (
                <span className="text-xs text-white/40 uppercase font-bold border border-white/10 px-3 py-2 rounded">
                  {t('shop_out_of_stock')}
                </span>
              )}

              {product.description && (
                <div className="prose prose-invert max-w-none mt-8">
                  <h2 className="text-2xl font-bold mb-4">{t('shop_product_details')}</h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
