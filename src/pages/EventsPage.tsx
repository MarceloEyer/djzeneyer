import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, MapPin, Ticket, ArrowRight, Users } from 'lucide-react';

// Mock event data
const events = [
  {
    id: '1',
    title: 'Cosmic Enlightenment Tour',
    date: 'June 15, 2025',
    time: '8:00 PM - 2:00 AM',
    location: 'Zen Nightclub, New York',
    image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Experience the mind-bending sounds of DJ Zen Eyer\'s Cosmic Enlightenment Tour. A night of transcendent zouk music that will take you on a journey through space and time.',
    ticketUrl: '#',
    featured: true,
  },
  {
    id: '2',
    title: 'Echo Festival',
    date: 'July 22-24, 2025',
    time: 'All Day',
    location: 'Sunset Beach, Miami',
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Join DJ Zen Eyer and other top electronic artists for a 3-day beachfront festival experience. Featuring multiple stages, immersive art installations, and sunset performances.',
    ticketUrl: '#',
    featured: true,
  },
  {
    id: '3',
    title: 'Neural Pathways Experience',
    date: 'August 10, 2025',
    time: '9:00 PM - 3:00 AM',
    location: 'Zen Lounge, Los Angeles',
    image: 'https://images.pexels.com/photos/1694900/pexels-photo-1694900.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'An intimate club night featuring DJ Zen Eyer exploring the depths of his Neural Pathways sound. Limited capacity event with exclusive new tracks and special guest appearances.',
    ticketUrl: '#',
    featured: true,
  },
  {
    id: '4',
    title: 'Meditation in Motion Tour',
    date: 'September 5, 2025',
    time: '7:00 PM - 1:00 AM',
    location: 'The Soundscape, Chicago',
    image: 'https://images.pexels.com/photos/2034851/pexels-photo-2034851.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'The Meditation in Motion tour brings DJ Zen Eyer\'s signature ambient-to-energetic progression style to Chicago. A fully immersive audio-visual experience.',
    ticketUrl: '#',
  },
  {
    id: '5',
    title: 'Quantum Field Festival',
    date: 'October 12-13, 2025',
    time: 'All Day',
    location: 'Quantum Fields, Austin',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'A two-day outdoor festival with DJ Zen Eyer headlining alongside a curated lineup of artists pushing the boundaries of electronic music. Camping available on-site.',
    ticketUrl: '#',
  },
  {
    id: '6',
    title: 'Zen State: Album Release Party',
    date: 'November 20, 2025',
    time: '10:00 PM - 4:00 AM',
    location: 'The Underground, Detroit',
    image: 'https://images.pexels.com/photos/2111015/pexels-photo-2111015.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Celebrate the release of DJ Zen Eyer\'s newest album "Zen State" with an exclusive underground warehouse party featuring album listening, live performance, and special merchandise.',
    ticketUrl: '#',
  },
];

const EventsPage: React.FC = () => {
  // Featured events (first 3)
  const featuredEvents = events.filter(event => event.featured);
  // Regular events (rest of them)
  const upcomingEvents = events.filter(event => !event.featured);

  return (
    <div className="pt-24 min-h-screen">
      {/* Page Header */}
      <div className="bg-surface py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              Upcoming Events
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Experience DJ Zen Eyer live at venues and festivals around the world. 
              Join the tribe for unforgettable nights of electronic enlightenment.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Featured Events Slider */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 font-display">
            Featured Events
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <motion.div 
                key={event.id}
                className="card overflow-hidden group"
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * parseInt(event.id) }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-white/70">
                      <Calendar size={16} className="mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-white/70">
                      <Clock size={16} className="mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-white/70">
                      <MapPin size={16} className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <a 
                      href={event.ticketUrl} 
                      className="btn btn-primary py-2 px-4 text-sm flex items-center"
                    >
                      <Ticket size={16} className="mr-1" />
                      Get Tickets
                    </a>
                    <button className="text-primary hover:text-primary-light transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Calendar */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 font-display">
            Event Calendar
          </h2>

          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <motion.div 
                key={event.id}
                className="card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 lg:w-1/5">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover aspect-video md:aspect-square"
                    />
                  </div>
                  <div className="p-5 md:p-6 flex-1 md:flex md:flex-col md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className="text-white/70 mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                        <div className="flex items-center text-white/70">
                          <Calendar size={16} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{event.date}</span>
                        </div>
                        <div className="flex items-center text-white/70">
                          <Clock size={16} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{event.time}</span>
                        </div>
                        <div className="flex items-center text-white/70">
                          <MapPin size={16} className="mr-2 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-xs">
                            <Users size={16} />
                          </div>
                          <div className="w-8 h-8 rounded-full bg-secondary/30 flex items-center justify-center text-xs">
                            128
                          </div>
                        </div>
                        <span className="text-sm text-white/60">People attending</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button className="text-primary hover:text-primary-light transition-colors flex items-center">
                          Details <ArrowRight size={16} className="ml-1" />
                        </button>
                        <a 
                          href={event.ticketUrl} 
                          className="btn btn-primary py-2 px-4 text-sm flex items-center"
                        >
                          <Ticket size={16} className="mr-1" />
                          Get Tickets
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join DJ Zen Eyer at Events CTA */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-8 md:p-12 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
                Want DJ Zen Eyer at Your Event?
              </h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
                Book DJ Zen Eyer for your club night, festival, or private event. 
                Get in touch with our booking team for availability and rates.
              </p>
              <a 
                href="mailto:booking@djzeneyer.com" 
                className="btn btn-primary px-8 py-3 text-lg"
              >
                Contact for Booking
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;