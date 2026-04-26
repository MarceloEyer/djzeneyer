// src/pages/ProductPage.tsx
// Product detail page for WooCommerce products

import React, { useCallback, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { useTranslation } from 'react-i18next';
import { Loader2, ShoppingCart, AlertCircle, ArrowLeft } from 'lucide-react';
import { getCurrencyFormatter } from '../utils/currency';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { useAddToCartMutation, useProductQuery, type WCProductDetail } from '../hooks/useQueries';

interface ProductGalleryProps {
  product: WCProductDetail;
  placeholderImage: string;
}

const ProductGallery = React.memo(({ product, placeholderImage }: ProductGalleryProps) => {
  const [activeImage, setActiveImage] = useState<string | null>(product.images?.[0]?.src || null);

  const gallery = useMemo(() => {
    if (!product.images?.length) return [];
    return product.images.filter((img) => img?.src);
  }, [product.images]);

  const mainImageObject = product.images?.[0];
  const optimizedMainImage = mainImageObject?.sizes?.large || mainImageObject?.sizes?.medium_large || mainImageObject?.src;
  const mainImage = activeImage || optimizedMainImage || placeholderImage;

  return (
    <div>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-surface">
        <img
          src={safeUrl(mainImage)}
          alt={product.name || ''}
          className="w-full h-full object-cover"
          loading="eager"
          width="800"
          height="800"
        />
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {gallery.map((img, index) => (
            <button
              key={`${img.src}-${index}`}
              type="button"
              onClick={() => setActiveImage(img.src)}
              className={`rounded-lg overflow-hidden border transition-all ${
                activeImage === img.src ? 'border-primary ring-2 ring-primary/40' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img src={safeUrl(img.sizes?.thumbnail || img.src)} alt={img.alt || product.name} className="w-full h-full object-cover" loading="lazy" width="150" height="150" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

const ProductPage: React.FC = () => {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();

  const isPortuguese = i18n.language.startsWith('pt');
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const shopPath = getLocalizedRoute('shop', currentLang);
  const canonicalUrl = useMemo(
    () => slug ? `https://djzeneyer.com/${getLocalizedRoute('shop', currentLang).replace(/^\//, '')}/${slug}` : undefined,
    [currentLang, slug]
  );
  const placeholderImage = 'https://placehold.co/1200x675/0D96FF/FFFFFF?text=DJ+Zen+Eyer';

  const { data: product, isLoading, error } = useProductQuery(currentLang, slug);
  const addToCartMutation = useAddToCartMutation();

  const formatPrice = useCallback((price: string) => {
    if (!price) return 'R$ 0,00';
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? 'pt-BR' : 'en-US';
    return Number.isNaN(numPrice)
      ? price
      : getCurrencyFormatter(locale, 'BRL').format(numPrice);
  }, [isPortuguese]);

  const handleAddToCart = useCallback(async () => {
    if (!product) return;

    try {
      await addToCartMutation.mutateAsync({ productId: product.id, quantity: 1 });
    } catch (err) {
      console.error('Error adding to cart:', err);
    }
  }, [addToCartMutation, product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !product) {
    const errorMessage = error instanceof Error ? error.message : t('shop.product_not_found');

    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto mb-4 text-error" size={48} />
          <h2 className="text-2xl font-bold mb-2">{t('shop.product_not_found')}</h2>
          <p className="opacity-70">{errorMessage}</p>
          <Link to={shopPath} className="mt-6 btn btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={18} />
            {t('common.checkout.back_shop')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeadlessSEO
        title={`${product.name} | ${t('common.artist_name')}`}
        description={product.short_description || product.description || product.name}
        url={canonicalUrl}
        image={product.images?.[0]?.src}
        type="product"
      />

      <div className="min-h-screen bg-background text-white pb-20">
        <div className="container mx-auto px-4 py-10">
          <Link to={shopPath} className="inline-flex items-center gap-2 text-white/70 hover:text-primary mb-6">
            <ArrowLeft size={18} />
            {t('common.checkout.back_shop')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ProductGallery key={product.slug} product={product} placeholderImage={placeholderImage} />

            <div className="space-y-6">
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
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.short_description) }}
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
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="btn btn-primary btn-lg flex items-center gap-2 mb-6"
                >
                  {addToCartMutation.isPending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
                  {t('shop.buy_now')}
                </button>
              ) : (
                <span className="text-xs text-white/40 uppercase font-bold border border-white/10 px-3 py-2 rounded">
                  {t('shop.out_of_stock')}
                </span>
              )}

              {product.description && (
                <div className="prose prose-invert max-w-none mt-8">
                  <h2 className="text-2xl font-bold mb-4">{t('shop.product_details')}</h2>
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
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

export default React.memo(ProductPage);
