import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  const [events, setEvents] = useState<BandsintownEvent[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return null;
  }

  // Compact variant for HomePage
  if (variant === 'compact') {
    return (
      <div className="w-full" itemScope itemType="https://schema.org/EventSeries">
        <meta itemProp="name" content="Zen Eyer Events" />
        <meta itemProp="description" content="Upcoming events and performances by DJ Zen Eyer" />
        
        <div className="space-y-3">
          {events.map((event, index) => (
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
              <meta itemProp="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
              
              <div className="flex items-start gap-4 p-4">
                <time
                  itemProp="startDate"
                  dateTime={event.datetime}
                  className="flex-shrink-0 text-center bg-surface rounded-lg p-3 border border-white/10"
                >
                  <div className="text-2xl font-bold text-primary">
                    {new Date(event.datetime).getDate()}
                  </div>
                  <div className="text-xs uppercase text-white/60">
                    {new Date(event.datetime).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </time>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors" itemProp="name">
                    {event.title}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-white/70">
                    <div className="flex items-center gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                      <MapPin size={14} className="flex-shrink-0" />
                      <span className="truncate" itemProp="name">{event.venue.name}</span>
                      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                        <meta itemProp="addressLocality" content={event.venue.city} />
                        <meta itemProp="addressRegion" content={event.venue.region} />
                        <meta itemProp="addressCountry" content={event.venue.country} />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="flex-shrink-0" />
                      <span className="truncate">
                        {event.venue.city}, {event.venue.country}
                      </span>
                    </div>
                  </div>
                </div>

                <div itemProp="performer" itemScope itemType="https://schema.org/MusicGroup">
                  <meta itemProp="name" content="Zen Eyer" />
                  <meta itemProp="genre" content="Brazilian Zouk" />
                </div>

                <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                  <meta itemProp="availability" content="https://schema.org/InStock" />
                  <meta itemProp="url" content={event.offers?.[0]?.url || event.url} />
                  
                  <a
                    href={event.offers?.[0]?.url || event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary flex-shrink-0"
                  >
                    <Ticket size={14} />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* JSON-LD for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EventSeries',
              name: 'Zen Eyer Events',
              description: 'Upcoming events and performances by DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ',
              performer: {
                '@type': 'MusicGroup',
                name: 'Zen Eyer',
                genre: 'Brazilian Zouk',
                url: 'https://djzeneyer.com',
                sameAs: [
                  'https://www.instagram.com/djzeneyer/',
                  'https://www.facebook.com/djzeneyer',
                  'https://soundcloud.com/djzeneyer',
                  'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw'
                ]
              },
              subEvent: events.map(event => ({
                '@type': 'MusicEvent',
                name: event.title,
                startDate: event.datetime,
                eventStatus: 'https://schema.org/EventScheduled',
                eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
                  name: 'Zen Eyer'
                },
                offers: {
                  '@type': 'Offer',
                  url: event.offers?.[0]?.url || event.url,
                  availability: 'https://schema.org/InStock'
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
        <h2 className="text-3xl font-bold mb-8 text-center font-display">Upcoming Events</h2>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" itemScope itemType="https://schema.org/EventSeries">
        <meta itemProp="name" content="Zen Eyer Events" />
        <meta itemProp="description" content="Upcoming events and performances by DJ Zen Eyer" />
        
        {events.map((event, index) => (
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
            
            <div className="relative h-48 bg-gradient-to-br from-primary/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10"></div>
              <time
                itemProp="startDate"
                dateTime={event.datetime}
                className="relative z-10 text-center"
              >
                <div className="text-6xl font-bold text-primary">
                  {new Date(event.datetime).getDate()}
                </div>
                <div className="text-xl uppercase text-white/80 font-semibold">
                  {new Date(event.datetime).toLocaleDateString('en-US', { month: 'short' })}
                </div>
                <div className="text-sm text-white/60">
                  {new Date(event.datetime).getFullYear()}
                </div>
              </time>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors" itemProp="name">
                {event.title}
              </h3>

              <div className="space-y-2 mb-4 text-sm text-white/70">
                <div className="flex items-start gap-2" itemProp="location" itemScope itemType="https://schema.org/Place">
                  <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white" itemProp="name">{event.venue.name}</div>
                    <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                      <meta itemProp="addressLocality" content={event.venue.city} />
                      <meta itemProp="addressRegion" content={event.venue.region} />
                      <meta itemProp="addressCountry" content={event.venue.country} />
                      <span>{event.venue.city}, {event.venue.country}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="flex-shrink-0" />
                  <span>
                    {new Date(event.datetime).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock size={16} className="flex-shrink-0" />
                  <span>
                    {new Date(event.datetime).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              <div itemProp="performer" itemScope itemType="https://schema.org/MusicGroup">
                <meta itemProp="name" content="Zen Eyer" />
                <meta itemProp="genre" content="Brazilian Zouk" />
              </div>

              <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="availability" content="https://schema.org/InStock" />
                <meta itemProp="url" content={event.offers?.[0]?.url || event.url} />
                
                <a
                  href={event.offers?.[0]?.url || event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Ticket size={18} />
                  Get Tickets
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* JSON-LD for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EventSeries',
            name: 'Zen Eyer Events',
            description: 'Upcoming events and performances by DJ Zen Eyer - Two-time World Champion Brazilian Zouk DJ',
            performer: {
              '@type': 'MusicGroup',
              name: 'Zen Eyer',
              genre: 'Brazilian Zouk',
              url: 'https://djzeneyer.com',
              sameAs: [
                'https://www.instagram.com/djzeneyer/',
                'https://www.facebook.com/djzeneyer',
                'https://soundcloud.com/djzeneyer',
                'https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw'
              ]
            },
            subEvent: events.map(event => ({
              '@type': 'MusicEvent',
              name: event.title,
              startDate: event.datetime,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
                name: 'Zen Eyer'
              },
              offers: {
                '@type': 'Offer',
                url: event.offers?.[0]?.url || event.url,
                availability: 'https://schema.org/InStock'
              }
            }))
          })
        }}
      />
    </div>
  );
}
