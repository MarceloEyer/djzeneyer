import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, ExternalLink, Clock, Ticket } from 'lucide-react';

interface BandsintownEvent {
  id: string;
  title: string;
  datetime: string;
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

  // Determina o locale atual para formatação de datas
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

  // Helper para formatar datas no idioma correto
  const formatDate = (date: Date, options: Intl.DateTimeFormatOptions) => {
    return date.toLocaleDateString(currentLocale, options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(currentLocale, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Compact variant for HomePage
  if (variant === 'compact') {
    return (
      <div className="w-full">
        <div className="space-y-3">
          {events.map((event, index) => {
            const eventDate = new Date(event.datetime);
            const ticketUrl = event.offers?.[0]?.url || event.url;
            const eventLocation = `${event.venue.city}, ${event.venue.country}`;
            
            // Aria-label traduzido dinamicamente
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
                {/* Schema.org metadata - sempre em inglês para bots */}
                <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
                <meta itemProp="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
                <meta itemProp="inLanguage" content={i18n.language} />
                
                <div className="flex items-start gap-4 p-4">
                  {/* Date Badge */}
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

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors" itemProp="name">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-1 text-sm text-white/70">
                      <div className="flex items-center gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                        <MapPin size={14} className="flex-shrink-0" aria-hidden="true" />
                        <span className="truncate" itemProp="name">{event.venue.name}</span>
                        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                          <meta itemProp="addressLocality" content={event.venue.city} />
                          <meta itemProp="addressRegion" content={event.venue.region} />
                          <meta itemProp="addressCountry" content={event.venue.country} />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{eventLocation}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performer Metadata - sempre em inglês */}
                  <div itemProp="performer" itemScope itemType="https://schema.org/MusicGroup">
                    <meta itemProp="name" content="Zen Eyer" />
                    <meta itemProp="genre" content="Brazilian Zouk" />
                    <link itemProp="url" href="https://djzeneyer.com" />
                  </div>

                  {/* CTA Button - texto traduzido, aria-label descritivo */}
                  <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <meta itemProp="availability" content="https://schema.org/InStock" />
                    <meta itemProp="url" content={ticketUrl} />
                    <meta itemProp="price" content="0" />
                    <meta itemProp="priceCurrency" content="BRL" />
                    
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

        {/* JSON-LD - sempre em inglês para bots, múltiplos idiomas via inLanguage */}
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
              subEvent: events.map(event => ({
                '@type': 'MusicEvent',
                name: event.title,
                startDate: event.datetime,
                eventStatus: 'https://schema.org/EventScheduled',
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
                inLanguage: i18n.language,
                location: {
                  '@type': 'Place',
                  name: event.venue.name,
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: event.venue.city,
                    addressRegion: event.venue.region,
                    addressCountry: event.venue.country
                  }
                },
                performer: {
                  '@type': 'MusicGroup',
                  name: 'Zen Eyer',
                  url: 'https://djzeneyer.com'
                },
                organizer: {
                  '@type': 'Organization',
                  name: event.venue.name,
                  url: event.url
                },
                offers: {
                  '@type': 'Offer',
                  url: event.offers?.[0]?.url || event.url,
                  availability: 'https://schema.org/InStock',
                  validFrom: new Date().toISOString()
                }
              }))
            })
          }}
        />
      </div>
    );
  }

  // Full variant for EventsPage
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
          const ticketUrl = event.offers?.[0]?.url || event.url;
          const eventLocation = `${event.venue.city}, ${event.venue.country}`;
          
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
              venue: event.venue.name,
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
              <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
              <meta itemProp="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
              <meta itemProp="inLanguage" content={i18n.language} />
              
              {/* Hero Date Section */}
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

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors text-white" itemProp="name">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-white/70">
                  <div className="flex items-start gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                    <div>
                      <div className="font-semibold text-white" itemProp="name">{event.venue.name}</div>
                      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <meta itemProp="addressLocality" content={event.venue.city} />
                        <meta itemProp="addressRegion" content={event.venue.region} />
                        <meta itemProp="addressCountry" content={event.venue.country} />
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

                {/* Performer Metadata */}
                <div itemProp="performer" itemScope itemType="https://schema.org/MusicGroup">
                  <meta itemProp="name" content="Zen Eyer" />
                  <meta itemProp="genre" content="Brazilian Zouk" />
                  <link itemProp="url" href="https://djzeneyer.com" />
                </div>

                {/* Enhanced CTA */}
                <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                  <meta itemProp="url" content={ticketUrl} />
                  <meta itemProp="price" content="0" />
                  <meta itemProp="priceCurrency" content="BRL" />
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

      {/* JSON-LD idêntico à versão compact */}
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
            subEvent: events.map(event => ({
              '@type': 'MusicEvent',
              name: event.title,
              startDate: event.datetime,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              inLanguage: i18n.language,
              image: 'https://djzeneyer.com/images/event-default.jpg',
              description: `DJ Zen Eyer live at ${event.venue.name}, ${event.venue.city}`,
              location: {
                '@type': 'Place',
                name: event.venue.name,
                address: {
                  '@type': 'PostalAddress',
                  addressLocality: event.venue.city,
                  addressRegion: event.venue.region,
                  addressCountry: event.venue.country
                }
              },
              performer: {
                '@type': 'MusicGroup',
                name: 'Zen Eyer',
                url: 'https://djzeneyer.com'
              },
              organizer: {
                '@type': 'Organization',
                name: event.venue.name,
                url: event.url
              },
              offers: {
                '@type': 'Offer',
                url: event.offers?.[0]?.url || event.url,
                availability: 'https://schema.org/InStock',
                price: '0',
                priceCurrency: 'BRL',
                validFrom: new Date().toISOString()
              }
            }))
          })
        }}
      />
    </div>
  );
}
