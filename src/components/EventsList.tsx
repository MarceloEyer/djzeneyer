// src/components/EventsList.tsx
// VERSÃO DEFINITIVA: ACESSIBILIDADE + SCHEMA HÍBRIDO + SEGURANÇA

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ExternalLink, Clock, Ticket } from 'lucide-react';

// ============================================================================
// 1. TYPES & INTERFACES
// ============================================================================

interface BandsintownEvent {
  id: string;
  title: string;
  datetime: string;
  description?: string;
  image?: string;
  venue: {
    name: string;
    city: string;
    region: string;
    country: string;
  };
  url: string;
  offers?: Array<{ url: string }>;
}

interface EventsListProps {
  limit?: number;
  showTitle?: boolean;
  variant?: 'compact' | 'full';
}

// ============================================================================
// 2. COMPONENT
// ============================================================================

export function EventsList({ limit = 10, showTitle = true, variant = 'full' }: EventsListProps) {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<BandsintownEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const currentLocale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  // --- Data Fetching ---
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const wpRestUrl = ((window as any).wpData?.restUrl || import.meta.env.VITE_WP_REST_URL || 'https://djzeneyer.com/wp-json').replace(/\/$/, '');
        const response = await fetch(`${wpRestUrl}/zen-bit/v1/events?limit=${limit}`);
        
        if (!response.ok) throw new Error(`API Status: ${response.status}`);
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [limit]);

  // --- Helpers ---
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) => {
    return date.toLocaleDateString(currentLocale, options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(currentLocale, { hour: '2-digit', minute: '2-digit' });
  };

  const getCompleteEventData = (event: BandsintownEvent) => {
    const eventDate = new Date(event.datetime);
    const endDate = new Date(eventDate.getTime() + (4 * 60 * 60 * 1000)); // +4h default
    
    return {
      image: event.image || 'https://djzeneyer.com/images/event-default.jpg',
      description: event.description || `DJ Zen Eyer live at ${event.venue.name} in ${event.venue.city}, ${event.venue.country}`,
      endDate: endDate.toISOString(),
      locationName: event.venue.name || 'Venue',
      city: event.venue.city || 'Unknown',
      country: event.venue.country || 'BR',
      price: '0',
      priceCurrency: 'BRL'
    };
  };

  // --- JSON-LD Generator (Memoized & Secure) ---
  const jsonLdMarkup = useMemo(() => {
    if (events.length === 0) return null;

    const renderEventJsonLd = (event: BandsintownEvent) => {
      const completeData = getCompleteEventData(event);
      return {
        '@type': 'MusicEvent',
        name: event.title,
        description: completeData.description,
        startDate: event.datetime,
        endDate: completeData.endDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        image: completeData.image,
        location: {
          '@type': 'Place',
          name: completeData.locationName,
          address: {
            '@type': 'PostalAddress',
            addressLocality: completeData.city,
            addressRegion: event.venue.region || '',
            addressCountry: completeData.country
          }
        },
        performer: {
          '@type': 'MusicGroup',
          name: 'Zen Eyer',
          genre: 'Brazilian Zouk',
          url: 'https://djzeneyer.com'
        },
        organizer: {
          '@type': 'Organization',
          name: completeData.locationName,
          url: event.url
        },
        offers: {
          '@type': 'Offer',
          url: event.offers?.[0]?.url || event.url,
          availability: 'https://schema.org/InStock',
          price: completeData.price,
          priceCurrency: completeData.priceCurrency,
          validFrom: new Date().toISOString()
        }
      };
    };

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EventSeries',
      name: 'Zen Eyer World Tour',
      url: `https://djzeneyer.com/${i18n.language}/events`,
      performer: {
        '@type': 'MusicGroup',
        name: 'Zen Eyer',
        url: 'https://djzeneyer.com'
      },
      subEvent: events.map(renderEventJsonLd)
    }).replace(/</g, '\\u003c'); // ✅ XSS Protection
  }, [events, i18n.language]);

  // --- Render States ---
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12" role="status">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" aria-hidden="true"></div>
        {/* ✅ A11y Improvement */}
        <span className="sr-only">{t('events.loading', 'Loading events...')}</span>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-white/60">
        <Calendar size={48} className="mx-auto mb-4 text-white/20" aria-hidden="true" />
        <p>{t('events.noEvents', 'No events scheduled at the moment. Check back soon!')}</p>
      </div>
    );
  }

  // --- Main Render ---
  return (
    <div className="w-full">
      {variant === 'full' && showTitle && (
        <h2 className="text-3xl font-bold mb-8 text-center font-display text-white">
          {t('events.title', 'Upcoming Events')}
        </h2>
      )}

      <div className={variant === 'compact' ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {events.map((event, index) => {
          const eventDate = new Date(event.datetime);
          const completeData = getCompleteEventData(event);
          const ticketUrl = event.offers?.[0]?.url || event.url;
          const eventLocation = `${completeData.city}, ${completeData.country}`;
          
          const formattedDate = formatDate(eventDate, { day: 'numeric', month: 'long', year: 'numeric' });
          const formattedTime = formatTime(eventDate);
          
          // ✅ A11y Dynamic Label
          const ariaLabel = t('events.ticketAriaLabel', 
            'View tickets for {{title}} at {{location}}', 
            { title: event.title, location: eventLocation }
          );

          // --- COMPACT CARD ---
          if (variant === 'compact') {
            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:border-primary/50 transition-all duration-300 group"
                itemScope
                itemType="https://schema.org/MusicEvent"
              >
                <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
                <meta itemProp="name" content={event.title} />
                <meta itemProp="startDate" content={event.datetime} />
                <meta itemProp="endDate" content={completeData.endDate} />

                <div className="flex items-start gap-4 p-4">
                  <time dateTime={event.datetime} className="flex-shrink-0 text-center bg-surface rounded-lg p-3 border border-white/10">
                    <div className="text-2xl font-bold text-primary">{eventDate.getDate()}</div>
                    <div className="text-xs uppercase text-white/60">{formatDate(eventDate, { month: 'short' })}</div>
                  </time>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="space-y-1 text-sm text-white/70">
                      <div className="flex items-center gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                         <MapPin size={14} className="flex-shrink-0" />
                         <span className="truncate" itemProp="name">{completeData.locationName}</span>
                         <meta itemProp="address" content={eventLocation} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="flex-shrink-0" />
                        <span className="truncate">{eventLocation}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <a 
                      href={ticketUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-sm btn-primary flex-shrink-0 flex items-center gap-2"
                      aria-label={ariaLabel}
                    >
                      <Ticket size={14} />
                      <span className="hidden sm:inline">{t('events.tickets', 'Tickets')}</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          }

          // --- FULL CARD ---
          return (
            <motion.article
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card group hover:border-primary/50 transition-all duration-300 overflow-hidden"
              itemScope
              itemType="https://schema.org/MusicEvent"
            >
              <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
              <meta itemProp="name" content={event.title} />
              <meta itemProp="endDate" content={completeData.endDate} />

              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
                <time itemProp="startDate" dateTime={event.datetime} className="relative z-10 text-center">
                  <div className="text-6xl font-bold text-primary">{eventDate.getDate()}</div>
                  <div className="text-xl uppercase text-white/80 font-semibold">{formatDate(eventDate, { month: 'short' })}</div>
                  <div className="text-sm text-white/60">{eventDate.getFullYear()}</div>
                </time>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-white">{event.title}</h3>
                <div className="space-y-2 mb-4 text-sm text-white/70">
                  <div className="flex items-start gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary" />
                    <div>
                      <div className="font-semibold text-white" itemProp="name">{completeData.locationName}</div>
                      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <span itemProp="addressLocality">{completeData.city}</span>, <span itemProp="addressCountry">{completeData.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="flex-shrink-0 text-secondary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="flex-shrink-0 text-accent" />
                    <span>{formattedTime}</span>
                  </div>
                </div>

                <div>
                  <a 
                    href={ticketUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary w-full flex items-center justify-center gap-2 group/btn"
                    aria-label={ariaLabel}
                  >
                    <Ticket size={18} />
                    <span>{t('events.viewTickets', 'View Tickets')}</span>
                    <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      {jsonLdMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdMarkup }}
        />
      )}
    </div>
  );
}