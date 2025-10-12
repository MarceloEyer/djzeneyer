// src/pages/ShopPage.tsx - RENOVADA COM ESTILO EVENTS

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  ShoppingCart, 
  Star, 
  Filter, 
  Grid, 
  List,
  Tag,
  TrendingUp,
  Zap,
  Gift,
  Package,
  Truck,
  Shield
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  images: { src: string }[];
  categories: { name: string }[];
  featured: boolean;
  stock_status: string;
  on_sale: boolean;
  regular_price?: string;
  short_description?: string;
}

const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${window.wpData?.restUrl || '/wp-json/'}wc/store/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredProduct = products.find(p => p.featured);
  const regularProducts = products.filter(p => !p.featured);

  const categories = ['all', ...new Set(products.flatMap(p => p.categories.map(c => c.name)))];
  const filteredProducts = filterCategory === 'all' 
    ? regularProducts 
    : regularProducts.filter(p => p.categories.some(c => c.name === filterCategory));

  const getStockColor = (status: string) => {
    switch (status) {
      case 'instock': return 'text-success';
      case 'outofstock': return 'text-error';
      case 'onbackorder': return 'text-warning';
      default: return 'text-white/60';
    }
  };

  const getStockText = (status: string) => {
    switch (status) {
      case 'instock': return 'In Stock';
      case 'outofstock': return 'Out of Stock';
      case 'onbackorder': return 'Backorder';
      default: return status;
    }
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card overflow-hidden group cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-surface/50">
        <img 
          src={product.images[0]?.src || 'https://placehold.co/400x400/1a1a1a/0D96FF?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.on_sale && (
            <span className="px-3 py-1 bg-error/90 backdrop-blur-sm text-white rounded-full text-xs font-bold flex items-center gap-1">
              <Tag size={12} />
              SALE
            </span>
          )}
          {product.categories[0] && (
            <span className="px-3 py-1 bg-primary/20 backdrop-blur-sm text-primary border border-primary/30 rounded-full text-xs font-bold">
              {product.categories[0].name}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-bold ${getStockColor(product.stock_status)}`}>
            {getStockText(product.stock_status)}
          </span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button className="btn btn-primary btn-sm">
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </button>
          <button className="btn btn-outline btn-sm">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="text-sm text-white/60 mb-4 line-clamp-2" 
             dangerouslySetInnerHTML={{ __html: product.short_description }} 
          />
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            {product.on_sale && product.regular_price ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-primary">{product.price}</span>
                <span className="text-sm text-white/40 line-through">{product.regular_price}</span>
              </div>
            ) : (
              <span className="text-2xl font-black text-primary">{product.price}</span>
            )}
          </div>
          
          {product.stock_status === 'instock' ? (
            <button className="btn btn-primary btn-sm flex items-center gap-2">
              <ShoppingCart size={16} />
              Buy Now
            </button>
          ) : (
            <button className="btn btn-outline btn-sm" disabled>
              Unavailable
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ProductListItem = ({ product, index }: { product: Product; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-6 hover:scale-[1.01] transition-transform"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={product.images[0]?.src || 'https://placehold.co/400x400/1a1a1a/0D96FF?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.on_sale && (
                  <span className="px-2 py-1 bg-error/20 text-error rounded text-xs font-bold">SALE</span>
                )}
                {product.categories[0] && (
                  <span className="px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded text-xs font-bold">
                    {product.categories[0].name}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold">{product.name}</h3>
            </div>
            <span className={`text-sm font-bold ${getStockColor(product.stock_status)}`}>
              {getStockText(product.stock_status)}
            </span>
          </div>

          {product.short_description && (
            <p className="text-white/70 mb-4 line-clamp-2" 
               dangerouslySetInnerHTML={{ __html: product.short_description }} 
            />
          )}

          <div className="flex items-center justify-between">
            <div>
              {product.on_sale && product.regular_price ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black text-primary">{product.price}</span>
                  <span className="text-lg text-white/40 line-through">{product.regular_price}</span>
                </div>
              ) : (
                <span className="text-3xl font-black text-primary">{product.price}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              {product.stock_status === 'instock' ? (
                <button className="btn btn-primary flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
              ) : (
                <button className="btn btn-outline" disabled>
                  Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>{t('shop_page_title') || 'Shop'} | DJ Zen Eyer</title>
        <meta name="description" content={t('shop_page_desc') || 'Shop exclusive merchandise and music from DJ Zen Eyer'} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        {/* Hero Section - Featured Product */}
        {featuredProduct && (
          <section className="relative h-[70vh] overflow-hidden">
            <div className="absolute inset-0">
              <img 
                src={featuredProduct.images[0]?.src}
                alt={featuredProduct.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay com opacidade maior para melhor leitura */}
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>

            <div className="relative container mx-auto px-4 h-full flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                {/* Badge com fundo escuro */}
                <div className="inline-block mb-6">
                  <span className="px-6 py-2 bg-error/90 backdrop-blur-sm text-white rounded-full text-sm font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl">
                    <Star size={16} fill="currentColor" />
                    FEATURED
                  </span>
                </div>

                {/* Título com sombra forte */}
                <h1 className="text-5xl md:text-7xl font-black mb-6 drop-shadow-2xl" 
                    style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.9), 4px 4px 30px rgba(0,0,0,0.7)' }}>
                  {featuredProduct.name}
                </h1>

                {/* Descrição com background escuro */}
                {featuredProduct.short_description && (
                  <div className="bg-black/70 backdrop-blur-md rounded-lg p-4 mb-8 border border-white/10">
                    <p className="text-xl text-white/90" 
                       dangerouslySetInnerHTML={{ __html: featuredProduct.short_description }} 
                    />
                  </div>
                )}

                {/* Preço e botão */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="bg-black/70 backdrop-blur-md rounded-lg px-6 py-3 border border-primary/30">
                    <span className="text-4xl font-black text-primary drop-shadow-lg">
                      {featuredProduct.price}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button className="btn btn-primary btn-lg flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                    <ShoppingCart size={24} />
                    Add to Cart
                  </button>
                  <button className="btn btn-outline btn-lg shadow-xl hover:scale-105 transition-transform">
                    Learn More
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Shop Benefits */}
        <section className="py-12 bg-surface">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: <Truck className="text-primary" size={32} />, title: 'Free Shipping', desc: 'Orders over $50' },
                { icon: <Shield className="text-success" size={32} />, title: 'Secure Payment', desc: '100% Protected' },
                { icon: <Gift className="text-accent" size={32} />, title: 'Exclusive Items', desc: 'Limited Edition' },
                { icon: <Zap className="text-warning" size={32} />, title: 'Fast Delivery', desc: '2-3 Business Days' },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-lg bg-background/50 hover:bg-background transition-colors"
                >
                  <div className="mb-3 flex justify-center">{benefit.icon}</div>
                  <h3 className="font-bold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-white/60">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
              <div>
                <h2 className="text-4xl font-black font-display mb-2">
                  {t('shop_all_products') || 'All Products'}
                </h2>
                <p className="text-white/60">Exclusive merchandise and limited editions</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        filterCategory === cat
                          ? 'bg-primary text-white'
                          : 'bg-surface/50 text-white/70 hover:text-white hover:bg-surface/80'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat}
                    </button>
                  ))}
                </div>

                {/* View Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-primary text-white' : 'bg-surface/50 text-white/70'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface/50 text-white/70'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
                <p className="text-xl">Loading products...</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredProducts.map((product, index) => (
                  <ProductListItem key={product.id} product={product} index={index} />
                ))}
              </div>
            )}

            {filteredProducts.length === 0 && !loading && (
              <div className="text-center py-20">
                <Package className="mx-auto mb-4 text-white/30" size={64} />
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-white/60">Try selecting a different category</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopPage;
