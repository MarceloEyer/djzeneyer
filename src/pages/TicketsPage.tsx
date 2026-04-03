import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { safeUrl } from '../utils/sanitize';
import { stripHtml } from '../utils/text';
import { useProductsQuery } from '../hooks/useQueries';

const TicketsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const isPortuguese = i18n.language.startsWith('pt');

  // ⚡ Bolt: Use `useProductsQuery` to leverage React Query caching. This prevents redundant network
  // requests and loading spinners when navigating back to the tickets page.
  const { data: ticketsData, isLoading: loading } = useProductsQuery(currentLang);

  // ⚡ Bolt: Memoize the fallback array to maintain a stable reference and prevent unnecessary re-renders.
  const tickets = useMemo(() => ticketsData || [], [ticketsData]);

  const formatPrice = (price: string) => {
    if (!price) return t('price_free');
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? 'pt-BR' : 'en-US';
    return isNaN(numPrice)
      ? price
      : new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(numPrice);
  };

  return (
    <>
      <HeadlessSEO
        title={t('common.checkout.tickets_title')}
        description={t('common.checkout.description')}
        url={`https://djzeneyer.com/${getLocalizedRoute('tickets', currentLang).replace(/^\//, '')}`}
        isHomepage={false}
      />

      <div className="min-h-screen pt-24 pb-12 bg-background text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-display">
              {t('events_title')}
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {t('events_subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface rounded-xl overflow-hidden border border-white/10 group hover:border-primary/50 transition-colors"
                >
                  <Link to={getLocalizedRoute(`/shop/product/${ticket.slug}`, i18n.language)} className="block relative aspect-video overflow-hidden">
                    <img
                      src={safeUrl(ticket.images[0]?.src, 'https://placehold.co/600x400/1a1a1a/ffffff?text=Event')}
                      alt={ticket.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold font-display leading-tight mb-2">{ticket.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/80">
                        <span className="flex items-center gap-1"><Calendar size={14} /> TBD</span>
                        <span className="flex items-center gap-1"><MapPin size={14} /> Online/TBD</span>
                      </div>
                    </div>
                  </Link>

                  <div className="p-6">
                    <p className="text-white/60 line-clamp-2 mb-6 text-sm">
                      {stripHtml(ticket.short_description || '') || t('event_desc_fallback')}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-white/40 uppercase tracking-wider">{t('shop.starting_at')}</span>
                        <span className="text-xl font-bold text-primary">{formatPrice(ticket.price)}</span>
                      </div>

                      <Link
                        to={getLocalizedRoute(`/shop/product/${ticket.slug}`, i18n.language)}
                        className="btn btn-outline btn-sm rounded-full flex items-center gap-2"
                      >
                        {t('nav.about')} <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(TicketsPage);
