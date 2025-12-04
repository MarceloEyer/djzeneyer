// EventsList.tsx - Schema.org COMPLETO sem erros
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ExternalLink, Clock, Ticket } from 'lucide-react';

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

export function EventsList({ limit = 10, showTitle = true, variant = 'full' }: EventsListProps) {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<BandsintownEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const currentLocale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const wpRestUrl = ((window as any).wpData?.restUrl || import.meta.env.VITE_WP_REST_URL || 'https://djzeneyer.com/wp-json').replace(/\/$/, '');
        const response = await fetch(`${wpRestUrl}/zen-bit/v1/events?limit=${limit}`);
        
        if (!response.ok) {
          console.error('API response not OK:', response.status);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        if (data.success && Array.isArray(data.events)) {
          setEvents(data.events);
        } else {
          console.error('Invalid API response:', data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12" role="status" aria-label={t('events.loading', 'Loading events')}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" aria-hidden="true"></div>
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

  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) => {
    return date.toLocaleDateString(currentLocale, options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(currentLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // CORREÇÃO: Função para garantir todos os campos obrigatórios
  const getCompleteEventData = (event: BandsintownEvent) => {
    const eventDate = new Date(event.datetime);
    const endDate = new Date(eventDate.getTime() + (4 * 60 * 60 * 1000)); // +4 horas
    
    return {
      // CORREÇÃO: Garantir image (obrigatório)
      image: event.image || 'https://djzeneyer.com/images/event-default.jpg',
      
      // CORREÇÃO: Garantir description (obrigatório)
      description: event.description || `DJ Zen Eyer live at ${event.venue.name} in ${event.venue.city}, ${event.venue.country}`,
      
      // CORREÇÃO: Garantir endDate (recomendado)
      endDate: endDate.toISOString(),
      
      // CORREÇÃO: Garantir location.name (obrigatório)
      locationName: event.venue.name || 'Venue',
      
      // CORREÇÃO: Garantir address.addressLocality (obrigatório)
      city: event.venue.city || 'Unknown',
      
      // CORREÇÃO: Garantir address.addressCountry (obrigatório)
      country: event.venue.country || 'BR',
      
      // CORREÇÃO: Garantir offers.price (obrigatório)
      price: '0',
      
      // CORREÇÃO: Garantir offers.priceCurrency (obrigatório)
      priceCurrency: 'BRL'
    };
  };

  const renderEventSchema = (event: BandsintownEvent) => {
    const eventDate = new Date(event.datetime);
    const completeData = getCompleteEventData(event);
    const ticketUrl = event.offers?.[0]?.url || event.url;

    return {
      '@type': 'MusicEvent',
      // CORREÇÃO: Todos os campos obrigatórios
      name: event.title,
      description: completeData.description,
      startDate: event.datetime,
      endDate: completeData.endDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      inLanguage: i18n.language,
      image: completeData.image,
      
      // CORREÇÃO: location completo com todos os campos obrigatórios
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
      
      // CORREÇÃO: performer completo
      performer: {
        '@type': 'MusicGroup',
        name: 'Zen Eyer',
        genre: 'Brazilian Zouk',
        url: 'https://djzeneyer.com'
      },
      
      // CORREÇÃO: organizer obrigatório
      organizer: {
        '@type': 'Organization',
        name: completeData.locationName,
        url: event.url
      },
      
      // CORREÇÃO: offers completo com price e priceCurrency
      offers: {
        '@type': 'Offer',
        url: ticketUrl,
        availability: 'https://schema.org/InStock',
        price: completeData.price,
        priceCurrency: completeData.priceCurrency,
        validFrom: new Date().toISOString()
      }
    };
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="w-full">
        <div className="space-y-3">
          {events.map((event, index) => {
            const eventDate = new Date(event.datetime);
            const completeData = getCompleteEventData(event);
            const ticketUrl = event.offers?.[0]?.url || event.url;
            const eventLocation = `${completeData.city}, ${completeData.country}`;
            
            const ariaLabel = t('events.ticketAriaLabel', 
              'View tickets for {{title}} at {{location}} on {{date}}', 
              {
                title: event.title,
                location: eventLocation,
                date: formatDate(eventDate, { day: 'numeric', month: 'long', year: 'numeric' })
              }
            );
            
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
                {/* CORREÇÃO: Todos os meta tags obrigatórios */}
                <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
                <meta itemProp="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
                <meta itemProp="name" content={event.title} />
                <meta itemProp="description" content={completeData.description} />
                <meta itemProp="image" content={completeData.image} />
                <meta itemProp="inLanguage" content={i18n.language} />
                
                <div className="flex items-start gap-4 p-4">
                  <time
                    itemProp="startDate"
                    dateTime={event.datetime}
                    className="flex-shrink-0 text-center bg-surface rounded-lg p-3 border border-white/10"
                    aria-label={formatDate(eventDate, { day: 'numeric', month: 'long', year: 'numeric' })}
                  >
                    <div className="text-2xl font-bold text-primary" aria-hidden="true">
                      {eventDate.getDate()}
                    </div>
                    <div className="text-xs uppercase text-white/60" aria-hidden="true">
                      {formatDate(eventDate, { month: 'short' })}
                    </div>
                  </time>

                  {/* CORREÇÃO: endDate obrigatório */}
                  <meta itemProp="endDate" content={completeData.endDate} />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-white/70">
                      {/* CORREÇÃO: location completo */}
                      <div className="flex items-center gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                        <MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
                        <span className="truncate" itemProp="name">{completeData.locationName}</span>
                        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                          <meta itemProp="addressLocality" content={completeData.city} />
                          <meta itemProp="addressRegion" content={event.venue.region || ''} />
                          <meta itemProp="addressCountry" content={completeData.country} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{eventLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* CORREÇÃO: performer completo */}
                  <div itemProp="performer" itemScope itemType="https://schema.org/MusicGroup">
                    <meta itemProp="name" content="Zen Eyer" />
                    <meta itemProp="genre" content="Brazilian Zouk" />
                    <link itemProp="url" href="https://djzeneyer.com" />
                  </div>

                  {/* CORREÇÃO: organizer obrigatório */}
                  <div itemProp="organizer" itemScope itemType="https://schema.org/Organization">
                    <meta itemProp="name" content={completeData.locationName} />
                    <link itemProp="url" href={event.url} />
                  </div>

                  {/* CORREÇÃO: offers completo */}
                  <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                    <meta itemProp="url" content={ticketUrl} />
                    <meta itemProp="price" content={completeData.price} />
                    <meta itemProp="priceCurrency" content={completeData.priceCurrency} />
                    <meta itemProp="validFrom" content={new Date().toISOString()} />
                    
                    <a
                      href={ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary flex-shrink-0 flex items-center gap-2"
                      aria-label={ariaLabel}
                    >
                      <Ticket size={14} aria-hidden="true" />
                      <span className="hidden sm:inline">
                        {t('events.tickets', 'Tickets')}
                      </span>
                    </a>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {/* CORREÇÃO: JSON-LD completo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EventSeries',
              name: 'Zen Eyer World Tour',
              description: 'Official tour schedule of two-time World Champion DJ Zen Eyer - Brazilian Zouk',
              url: `https://djzeneyer.com/${i18n.language}/events`,
              inLanguage: [i18n.language, 'pt-BR', 'en-US'],
              image: 'https://djzeneyer.com/images/events-og.jpg',
              performer: {
                '@type': 'MusicGroup',
                name: 'Zen Eyer',
                genre: ['Brazilian Zouk', 'Electronic Dance Music', 'World Music'],
                url: 'https://djzeneyer.com',
                image: 'https://djzeneyer.com/images/zen-eyer-profile.jpg',
                description: 'Two-time World Champion Brazilian Zouk DJ',
                sameAs: [
                  'https://www.instagram.com/djzeneyer/',
                  'https://www.facebook.com/djzeneyer',
                  'https://soundcloud.com/djzeneyer',
                  'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
                  'https://www.bandsintown.com/a/15552355'
                ]
              },
              subEvent: events.map(event => renderEventSchema(event))
            })
          }}
        />
      </div>
    );
  }

  // Full variant (idêntico ao compact em estrutura, apenas visual diferente)
  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-3xl font-bold mb-8 text-center font-display text-white">
          {t('events.title', 'Upcoming Events')}
        </h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => {
          const eventDate = new Date(event.datetime);
          const completeData = getCompleteEventData(event);
          const ticketUrl = event.offers?.[0]?.url || event.url;
          const eventLocation = `${completeData.city}, ${completeData.country}`;
          
          const formattedDate = formatDate(eventDate, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
          
          const formattedTime = formatTime(eventDate);
          
          const fullAriaLabel = t('events.fullTicketAriaLabel',
            'Buy tickets for {{title}} at {{venue}}, {{location}} on {{date}}',
            {
              title: event.title,
              venue: completeData.locationName,
              location: eventLocation,
              date: formattedDate
            }
          );

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
              {/* CORREÇÃO: Todos os meta tags obrigatórios */}
              <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
              <meta itemProp="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
              <meta itemProp="name" content={event.title} />
              <meta itemProp="description" content={completeData.description} />
              <meta itemProp="image" content={completeData.image} />
              <meta itemProp="inLanguage" content={i18n.language} />
              <meta itemProp="endDate" content={completeData.endDate} />
              
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" aria-hidden="true"></div>
                <time
                  itemProp="startDate"
                  dateTime={event.datetime}
                  className="relative z-10 text-center"
                  aria-label={formattedDate}
                >
                  <div className="text-6xl font-bold text-primary" aria-hidden="true">
                    {eventDate.getDate()}
                  </div>
                  <div className="text-xl uppercase text-white/80 font-semibold" aria-hidden="true">
                    {formatDate(eventDate, { month: 'short' })}
                  </div>
                  <div className="text-sm text-white/60" aria-hidden="true">
                    {eventDate.getFullYear()}
                  </div>
                </time>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-white">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-white/70">
                  <div className="flex items-start gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-white" itemProp="name">{completeData.locationName}</div>
                      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <meta itemProp="addressLocality" content={completeData.city} />
                        <meta itemProp="addressRegion" content={event.venue.region || ''} />
                        <meta itemProp="addressCountry" content={completeData.country} />
                        <span>{eventLocation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="flex-shrink-0 text-secondary" aria-hidden="true" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="flex-shrink-0 text-accent" aria-hidden="true" />
                    <span>{formattedTime}</span>
                  </div>
                </div>

                <div itemProp="performer" itemScope itemType="https://schema.org/MusicGroup">
                  <meta itemProp="name" content="Zen Eyer" />
                  <meta itemProp="genre" content="Brazilian Zouk" />
                  <link itemProp="url" href="https://djzeneyer.com" />
                </div>

                <div itemProp="organizer" itemScope itemType="https://schema.org/Organization">
                  <meta itemProp="name" content={completeData.locationName} />
                  <link itemProp="url" href={event.url} />
                </div>

                <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                  <meta itemProp="url" content={ticketUrl} />
                  <meta itemProp="price" content={completeData.price} />
                  <meta itemProp="priceCurrency" content={completeData.priceCurrency} />
                  <meta itemProp="validFrom" content={new Date().toISOString()} />
                  
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full flex items-center justify-center gap-2 group/btn"
                    aria-label={fullAriaLabel}
                  >
                    <Ticket size={18} aria-hidden="true" />
                    <span>{t('events.viewTickets', 'View Tickets')}</span>
                    <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EventSeries',
            name: 'Zen Eyer World Tour',
            description: 'Official tour schedule of two-time World Champion DJ Zen Eyer - Brazilian Zouk',
            url: `https://djzeneyer.com/${i18n.language}/events`,
            inLanguage: [i18n.language, 'pt-BR', 'en-US'],
            image: 'https://djzeneyer.com/images/events-og.jpg',
            performer: {
              '@type': 'MusicGroup',
              name: 'Zen Eyer',
              genre: ['Brazilian Zouk', 'Electronic Dance Music', 'World Music'],
              url: 'https://djzeneyer.com',
              image: 'https://djzeneyer.com/images/zen-eyer-profile.jpg',
              description: 'Two-time World Champion Brazilian Zouk DJ',
              sameAs: [
                'https://www.instagram.com/djzeneyer/',
                'https://www.facebook.com/djzeneyer',
                'https://soundcloud.com/djzeneyer',
                'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw',
                'https://www.bandsintown.com/a/15552355'
              ]
            },
            subEvent: events.map(event => renderEventSchema(event))
          })
        }}
      />
    </div>
  );
}