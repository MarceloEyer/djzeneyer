import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cart, loading, removeItem } = useCart();
  const isPortuguese = i18n.language.startsWith('pt');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  // Improved price formatting
  const formatPrice = (price: string | number) => {
    if (price === undefined || price === null) return 'R$ 0,00';
    // If it's already formatted (contains currency symbol), return as is
    if (typeof price === 'string' && (price.includes('R$') || price.includes('$'))) return price;

    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const locale = isPortuguese ? 'pt-BR' : 'en-US';

    return isNaN(numPrice)
      ? price.toString()
      : new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(numPrice);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="animate-spin rounded-full size-12 border-y-2 border-primary"></div>
      </div>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <>
      <HeadlessSEO
        title={t('cart_title', 'Shopping Cart')}
        description={t('cart_desc', 'Review your selected items.')}
        isHomepage={false}
      />

      <div className="min-h-screen pt-24 pb-12 bg-background text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-8 font-display flex items-center gap-3"
          >
            <ShoppingCart className="text-primary" />
            {t('cart_title', 'Shopping Cart')}
          </motion.h1>

          {isEmpty ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-surface rounded-xl border border-white/10"
            >
              <ShoppingCart size={64} className="mx-auto mb-4 text-white/20" />
              <h2 className="text-xl font-semibold mb-2">{t('cart_empty', 'Your cart is empty')}</h2>
              <p className="text-white/60 mb-8">{t('cart_empty_desc', 'Looks like you haven\'t added any items yet.')}</p>
              <Link to="/shop" className="btn btn-primary">
                {t('cart_continue_shopping', 'Continue Shopping')}
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="lg:col-span-2 space-y-4"
              >
                {cart.items.map((item: any) => (
                  <motion.div
                    key={item.key || item.id}
                    variants={itemVariants}
                    className="flex gap-4 p-4 bg-surface rounded-lg border border-white/10"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-md overflow-hidden shrink-0">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0].src} alt={item.name} className="size-full object-cover" />
                      ) : (
                         <div className="size-full flex items-center justify-center text-white/20">
                           <ShoppingCart size={24} />
                         </div>
                      )}
                    </div>

                    <div className="grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                        <button
                          onClick={() => removeItem(item.key)}
                          className="text-white/40 hover:text-error transition-colors p-1"
                          aria-label={t('cart_remove_item', 'Remove item')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <div className="text-sm text-white/60">
                          {t('cart_qty', 'Qty')}: {item.quantity}
                        </div>
                        <div className="font-bold text-primary">
                          {formatPrice(item.totals?.line_total || item.price)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-surface p-6 rounded-xl border border-white/10 sticky top-24">
                  <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">
                    {t('cart_summary', 'Order Summary')}
                  </h2>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>{t('cart_subtotal', 'Subtotal')}</span>
                      <span>{formatPrice(cart.totals?.total_price || '0')}</span>
                    </div>
                    <div className="flex justify-between text-white/70">
                      <span>{t('cart_shipping', 'Shipping')}</span>
                      <span>{t('cart_shipping_calc', 'Calculated at checkout')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold border-t border-white/10 pt-4 mb-6">
                    <span>{t('cart_total', 'Total')}</span>
                    <span className="text-primary">{formatPrice(cart.totals?.total_price || '0')}</span>
                  </div>

                  <Link
                    to="/checkout"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
                  >
                    {t('cart_checkout', 'Proceed to Checkout')}
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
