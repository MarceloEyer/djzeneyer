import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useCart } from '../contexts/CartContext';
import { buildApiUrl, getAuthHeaders } from '../config/api';
import { sanitizeHtml, safeUrl, safeRedirect } from '../utils/sanitize';

interface PaymentMethod {
  id: string;
  title: string;
  description: string;
}

const CheckoutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { cart, loading, getCart, clearCart } = useCart();
  const currentLang = React.useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const isPortuguese = i18n.language.startsWith('pt');

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  React.useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const url = buildApiUrl('wc/store/v1/checkout');
        const headers = getAuthHeaders();
        const response = await fetch(url, {
          method: 'GET',
          headers: headers as HeadersInit,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.payment_methods) {
            setPaymentMethods(data.payment_methods);
            // Select the first one by default if available
            if (data.payment_methods.length > 0) {
              setSelectedPaymentMethod(data.payment_methods[0].id);
            }
          }
          if (data.billing_address) {
            setFormData(prev => ({
              ...prev,
              firstName: data.billing_address.first_name || '',
              lastName: data.billing_address.last_name || '',
              email: data.billing_address.email || '',
              phone: data.billing_address.phone || '',
              address: data.billing_address.address_1 || '',
              city: data.billing_address.city || '',
              state: data.billing_address.state || '',
              zip: data.billing_address.postcode || '',
              country: data.billing_address.country || '',
            }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch checkout data', error);
      }
    };

    fetchCheckoutData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPaymentMethod) {
      alert(t('checkout.select_payment'));
      return;
    }

    setIsProcessing(true);

    try {
      const url = buildApiUrl('wc/store/v1/checkout');
      const headers = getAuthHeaders();

      const payload = {
        billing_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: formData.country,
        },
        shipping_address: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          state: formData.state,
          postcode: formData.zip,
          country: formData.country,
        },
        payment_method: selectedPaymentMethod,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: headers as HeadersInit,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t('common.checkout.error_failed'));
      }

      // Refresh cart state after checkout
      await getCart();

      // Handle redirect or success
      if (data.payment_result?.redirect_url) {
        // Garantimos que o redirecionamento seja seguro
        window.location.href = safeRedirect(data.payment_result.redirect_url, getLocalizedRoute('shop', currentLang));
      } else {
        // Defensive clear to guarantee local cart consistency in non-redirect payments
        await clearCart();
        setOrderSuccess(true);
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || t('checkout.generic_error'));
    } finally {
      setIsProcessing(false);
    }
  };

  // Improved price formatting
  const formatPrice = (price: string | number) => {
    if (price === undefined || price === null) return 'R$ 0,00';
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background text-white flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface p-8 rounded-2xl border border-primary/20 max-w-md w-full"
        >
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-display">{t('checkout.success_title')}</h1>
          <p className="text-white/70 mb-8">
            {t('checkout.success_desc')}
          </p>
          <Link to={getLocalizedRoute('shop', currentLang)} className="btn btn-primary w-full">
            {t('checkout.back_shop')}
          </Link>        </motion.div>
      </div>
    );
  }

  return (
    <>
      <HeadlessSEO
        title={t('checkout.title')}
        description={t('checkout.description')}
        isHomepage={false}
      />

      <div className="min-h-screen pt-24 pb-12 bg-background text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-bold mb-8 font-display">{t('checkout.title')}</h1>

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
                  {t('checkout.billing')}
                </h2>

                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-first-name" className="block text-sm text-white/60 mb-1">{t('form.first_name')}</label>
                      <input
                        type="text"
                        id="checkout-first-name"
                        name="firstName"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        autoComplete="given-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-last-name" className="block text-sm text-white/60 mb-1">{t('form.last_name')}</label>
                      <input
                        type="text"
                        id="checkout-last-name"
                        name="lastName"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-email" className="block text-sm text-white/60 mb-1">{t('form.email')}</label>
                      <input
                        type="email"
                        id="checkout-email"
                        name="email"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.email}
                        onChange={handleInputChange}
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-phone" className="block text-sm text-white/60 mb-1">{t('form.phone')}</label>
                      <input
                        type="tel"
                        id="checkout-phone"
                        name="phone"
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.phone}
                        onChange={handleInputChange}
                        autoComplete="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="checkout-address" className="block text-sm text-white/60 mb-1">{t('form.address')}</label>
                    <input
                      type="text"
                      id="checkout-address"
                      name="address"
                      required
                      className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                      value={formData.address}
                      onChange={handleInputChange}
                      autoComplete="street-address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-city" className="block text-sm text-white/60 mb-1">{t('form.city')}</label>
                      <input
                        type="text"
                        id="checkout-city"
                        name="city"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.city}
                        onChange={handleInputChange}
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-state" className="block text-sm text-white/60 mb-1">{t('form.state')}</label>
                      <input
                        type="text"
                        id="checkout-state"
                        name="state"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.state}
                        onChange={handleInputChange}
                        autoComplete="address-level1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="checkout-zip" className="block text-sm text-white/60 mb-1">{t('form.zip')}</label>
                      <input
                        type="text"
                        id="checkout-zip"
                        name="zip"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.zip}
                        onChange={handleInputChange}
                        autoComplete="postal-code"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-country" className="block text-sm text-white/60 mb-1">{t('form.country')}</label>
                      <input
                        type="text"
                        id="checkout-country"
                        name="country"
                        required
                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary focus:outline-none transition-colors"
                        value={formData.country}
                        onChange={handleInputChange}
                        autoComplete="country"
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
                  {t('checkout.payment')}
                </h2>

                <div className="space-y-4">
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`p-4 rounded-lg border flex items-start gap-4 cursor-pointer transition-colors ${selectedPaymentMethod === method.id
                          ? 'border-primary bg-primary/10'
                          : 'border-white/10 hover:border-white/30 bg-black/20'
                          }`}
                      >
                        <input
                          type="radio"
                          id={`payment-method-${method.id}`}
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-semibold">{method.title}</div>
                          <div className="text-xs text-white/60 mt-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(method.description) }} />
                        </div>
                      </label>
                    ))
                  ) : (
                    <div className="text-white/60 italic">{t('checkout.no_payments')}</div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                  <Lock size={14} />
                  {t('checkout.secure_msg')}
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
                  {t('checkout.summary')}
                </h2>

                {cart?.items && cart.items.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    {cart.items.map((item: any) => (
                      <div key={item.key || item.id} className="flex justify-between items-start text-sm">
                        <span className="text-white/80 line-clamp-2 pr-4">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-mono text-white/60">
                          {formatPrice(item.totals?.line_total || item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 mb-4 text-white/40">
                    <AlertCircle className="mx-auto mb-2" />
                    {t('cart.empty')}
                  </div>
                )}

                <div className="space-y-2 mb-6 text-sm border-t border-white/10 pt-4">
                  <div className="flex justify-between text-white/70">
                    <span>{t('cart.subtotal')}</span>
                    <span>{formatPrice(cart?.totals?.total_price || '0')}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>{t('cart.total')}</span>
                    <span className="text-primary font-bold text-lg">{formatPrice(cart?.totals?.total_price || '0')}</span>
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
                    t('checkout.place_order')
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
