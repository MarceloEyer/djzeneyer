import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../utils/currency';

const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cart, loading, clearCart } = useCart();
  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    // TODO: Integrate with real Payment Gateway (Stripe/PagSeguro/WooCommerce)
    // This is a mock implementation for the frontend prototype.
    setTimeout(async () => {
      // Clear cart on successful "mock" payment
      await clearCart();
      setIsProcessing(false);
      setOrderSuccess(true);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background text-white flex flex-col items-center justify-center text-center px-4">
        <motion.div
          role="alert"
          aria-live="polite"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface p-8 rounded-2xl border border-primary/20 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-display">{t('checkout_success_title', 'Order Confirmed!')}</h1>
          <p className="text-white/70 mb-8">
            {t('checkout_success_desc', 'Thank you for your purchase. You will receive an email confirmation shortly.')}
          </p>
          <a href="/shop" className="btn btn-primary w-full">
            {t('checkout_back_shop', 'Return to Shop')}
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <HeadlessSEO
        title={t('checkout_title', 'Checkout')}
        description={t('checkout_desc', 'Securely complete your purchase.')}
        isHomepage={false}
      />

      <div className="min-h-screen pt-24 pb-12 bg-background text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 font-display">{t('checkout_title', 'Checkout')}</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface p-6 md:p-8 rounded-xl border border-white/10 mb-8"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">1</span>
                  {t('checkout_billing', 'Billing Details')}
                </h2>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">{t('form_first_name', 'First Name')}</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">{t('form_last_name', 'Last Name')}</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1">{t('form_email', 'Email Address')}</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-white/60 mb-1">{t('form_address', 'Address')}</label>
                    <input
                      type="text"
                      name="address"
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/60 mb-1">{t('form_city', 'City')}</label>
                      <input
                        type="text"
                        name="city"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-white/60 mb-1">{t('form_zip', 'ZIP Code')}</label>
                      <input
                        type="text"
                        name="zip"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.zip}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </form>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface p-6 md:p-8 rounded-xl border border-white/10"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm">2</span>
                  {t('checkout_payment', 'Payment Method')}
                </h2>

                <div className="p-4 bg-black/20 rounded-lg border border-white/10 flex items-center gap-4 opacity-50 cursor-not-allowed">
                  <CreditCard className="text-white/60" />
                  <div>
                    <div className="font-semibold">{t('payment_credit_card', 'Credit Card')}</div>
                    <div className="text-xs text-white/40">{t('payment_secure_mock', 'Secure payment via Stripe (Mock)')}</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                  <Lock size={14} />
                  {t('checkout_secure_msg', 'Your payment information is encrypted and secure.')}
                </div>
              </motion.div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface p-6 rounded-xl border border-white/10 sticky top-24"
              >
                <h2 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">
                  {t('checkout_summary', 'Your Order')}
                </h2>

                {cart?.items && cart.items.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item: any) => (
                      <div key={item.key || item.id} className="flex justify-between items-start text-sm">
                        <span className="text-white/80 line-clamp-2 pr-4">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-mono text-white/60">
                          {formatPrice(item.totals?.line_total || item.price, locale)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 mb-4 text-white/40">
                    <AlertCircle className="mx-auto mb-2" />
                    {t('cart_empty', 'Cart is empty')}
                  </div>
                )}

                <div className="space-y-2 mb-6 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white/70">
                    <span>{t('cart_subtotal', 'Subtotal')}</span>
                    <span>{formatPrice(cart?.totals?.total_price || '0', locale)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>{t('cart_total', 'Total')}</span>
                    <span className="text-primary font-bold text-lg">{formatPrice(cart?.totals?.total_price || '0', locale)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  form="checkout-form"
                  disabled={isProcessing || !cart?.items?.length}
                  className="btn btn-primary w-full py-3 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    t('checkout_place_order', 'Place Order')
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
