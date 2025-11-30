import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

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
}

export function EventsList({ limit = 10, showTitle = true }: EventsListProps) {
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No upcoming events at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showTitle && (
        <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Events</h2>
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
            className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            itemScope
            itemType="https://schema.org/MusicEvent"
          >
            <meta itemProp="eventStatus" content="https://schema.org/EventScheduled" />
            <meta itemProp="eventAttendanceMode" content="https://schema.org/OfflineEventAttendanceMode" />
            
            <div className="p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <time
                  itemProp="startDate"
                  dateTime={event.datetime}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-center"
                >
                  <div className="text-2xl font-bold">
                    {new Date(event.datetime).getDate()}
                  </div>
                  <div className="text-sm uppercase">
                    {new Date(event.datetime).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </time>
              </div>

              <h3 className="text-xl font-bold mb-3 line-clamp-2" itemProp="name">
                {event.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm" itemProp="location" itemScope itemType="https://schema.org/Place">
                  <MapPin size={16} />
                  <span itemProp="name">{event.venue.name}</span>
                  <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                    <meta itemProp="addressLocality" content={event.venue.city} />
                    <meta itemProp="addressRegion" content={event.venue.region} />
                    <meta itemProp="addressCountry" content={event.venue.country} />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} />
                  <span>
                    {new Date(event.datetime).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
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
                  className="inline-flex items-center gap-2 bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
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
