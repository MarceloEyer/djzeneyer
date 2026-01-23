import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ProductImage, ProductCategory } from '../types/product';
import { buildApiUrl } from '../config/api';

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
  lang: string;
  short_description?: string;
  categories?: ProductCategory[];
}

const TicketsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language.split('-')[0];
  const isPortuguese = i18n.language.startsWith('pt');

  const [tickets, setTickets] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      // Use centralized API builder for consistency and better dev/prod handling
      const apiUrl = buildApiUrl('djzeneyer/v1/products', { lang: currentLang });

      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          // Filter for tickets/events if possible, for now just show all
          setTickets(data);
        }
      } catch (error) {
        console.error('Failed to fetch tickets', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentLang]);

  const formatPrice = (price: string) => {
    if (!price) return t('price_free', 'Free');
    const numPrice = parseFloat(price);
    const locale = isPortuguese ? 'pt-BR' : 'en-US';
    return isNaN(numPrice)
      ? price
      : new Intl.NumberFormat(locale, { style: 'currency', currency: 'BRL' }).format(numPrice);
  };

  return (
    <>
      <HeadlessSEO
        title={t('tickets_title', 'Tickets & Events')}
        description={t('tickets_desc', 'Book your spot for the next Zen Experience.')}
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
              {t('tickets_hero_title', 'Upcoming Events')}
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              {t('tickets_hero_subtitle', 'Secure your access to exclusive workshops, parties and festivals.')}
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
                  <Link to={isPortuguese ? `/loja/produto/${ticket.slug}` : `/shop/product/${ticket.slug}`} className="block relative aspect-video overflow-hidden">
                    <img
                      src={ticket.images[0]?.src || 'https://placehold.co/600x400/1a1a1a/ffffff?text=Event'}
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
                      {ticket.short_description?.replace(/<[^>]*>/g, '') || t('event_desc_fallback', 'Join us for an unforgettable experience.')}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-white/40 uppercase tracking-wider">{t('ticket_starting_at', 'Starting at')}</span>
                        <span className="text-xl font-bold text-primary">{formatPrice(ticket.price)}</span>
                      </div>

                      <Link
                        to={isPortuguese ? `/loja/produto/${ticket.slug}` : `/shop/product/${ticket.slug}`}
                        className="btn btn-outline btn-sm rounded-full flex items-center gap-2"
                      >
                        {t('tickets_details', 'Details')} <ArrowRight size={16} />
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

export default TicketsPage;
