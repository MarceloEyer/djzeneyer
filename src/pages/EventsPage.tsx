// src/pages/EventsPage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket,
  ExternalLink,
  Bell,
  Share2,
  Download,
  Filter,
  Grid,
  List,
  Plus,
  Music2,
  Star
} from 'lucide-react';

// Mock upcoming events data
const upcomingEvents = [
  {
    id: 1,
    title: 'Summer Vibes Festival',
    date: '2025-11-15',
    time: '20:00',
    location: 'Copacabana Beach, Rio de Janeiro',
    type: 'Festival',
    image: 'https://placehold.co/600x400/0D96FF/FFFFFF?text=Summer+Vibes&font=orbitron',
    price: 'R$ 150',
    attendees: 1250,
    status: 'Available'
  },
  {
    id: 2,
    title: 'Zouk Nights - São Paulo',
    date: '2025-10-25',
    time: '22:00',
    location: 'Club Aurora, São Paulo',
    type: 'Workshop',
    image: 'https://placehold.co/600x400/9D4EDD/FFFFFF?text=Zouk+Nights&font=orbitron',
    price: 'R$ 80',
    attendees: 320,
    status: 'Available'
  },
  {
    id: 3,
    title: 'Private Livestream Set',
    date: '2025-10-30',
    time: '19:00',
    location: 'Online - Exclusive for Zen Tribe',
    type: 'Livestream',
    image: 'https://placehold.co/600x400/EC4899/FFFFFF?text=Livestream&font=orbitron',
    price: 'Free',
    attendees: 850,
    status: 'Members Only'
  },
  {
    id: 4,
    title: 'Sunset Rooftop Session',
    date: '2025-11-20',
    time: '18:00',
    location: 'Skybar, Brasília',
    type: 'Show',
    image: 'https://placehold.co/600x400/10B981/FFFFFF?text=Sunset+Session&font=orbitron',
    price: 'R$ 120',
    attendees: 180,
    status: 'Limited'
  }
];

const EventsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');

  const eventTypes = ['all', 'Festival', 'Workshop', 'Livestream', 'Show'];

  const filteredEvents = filterType === 'all' 
    ? upcomingEvents 
    : upcomingEvents.filter(e => e.type === filterType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-success';
      case 'Limited': return 'text-warning';
      case 'Members Only': return 'text-accent';
      default: return 'text-white/60';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Festival': return 'bg-primary/20 text-primary border-primary/30';
      case 'Workshop': return 'bg-secondary/20 text-secondary border-secondary/30';
      case 'Livestream': return 'bg-accent/20 text-accent border-accent/30';
      case 'Show': return 'bg-success/20 text-success border-success/30';
      default: return 'bg-white/20 text-white border-white/30';
    }
  };

  const EventCard = ({ event, index }: { event: typeof upcomingEvents[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card overflow-hidden group cursor-pointer"
    >
      {/* Event Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Event Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(event.type)}`}>
            {event.type}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-bold ${getStatusColor(event.status)}`}>
            {event.status}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors">
            <Share2 size={16} className="text-white" />
          </button>
          <button className="p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-colors">
            <Bell size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Event Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 line-clamp-1">{event.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/70">
            <Calendar size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm">
              {new Date(event.date).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <Clock size={16} className="text-secondary flex-shrink-0" />
            <span className="text-sm">{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <MapPin size={16} className="text-accent flex-shrink-0" />
            <span className="text-sm line-clamp-1">{event.location}</span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <Users size={16} className="text-success flex-shrink-0" />
            <span className="text-sm">{event.attendees} attending</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div>
            <span className="text-2xl font-black text-primary">{event.price}</span>
          </div>
          <button className="btn btn-primary btn-sm flex items-center gap-2">
            <Ticket size={16} />
            Get Ticket
          </button>
        </div>
      </div>
    </motion.div>
  );

  const EventListItem = ({ event, index }: { event: typeof upcomingEvents[0]; index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-6 hover:scale-[1.01] transition-transform"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-2 ${getTypeColor(event.type)}`}>
                {event.type}
              </span>
              <h3 className="text-xl font-bold">{event.title}</h3>
            </div>
            <span className={`text-sm font-bold ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Calendar size={14} className="text-primary" />
              {new Date(event.date).toLocaleDateString('pt-BR')}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Clock size={14} className="text-secondary" />
              {event.time}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <MapPin size={14} className="text-accent" />
              {event.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <Users size={14} className="text-success" />
              {event.attendees} attending
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-primary">{event.price}</span>
            <div className="flex gap-2">
              <button className="btn btn-outline btn-sm">
                <Share2 size={16} />
              </button>
              <button className="btn btn-primary btn-sm flex items-center gap-2">
                <Ticket size={16} />
                Get Ticket
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Events | DJ Zen Eyer</title>
        <meta name="description" content="Join DJ Zen Eyer at upcoming events, festivals, and exclusive shows" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                <Music2 className="inline-block mr-2" size={16} />
                Live Events & Shows
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
              Upcoming <span className="text-primary">Events</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              Experience the energy of DJ Zen Eyer live. From intimate club nights to massive festivals.
            </p>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8"
          >
            {/* Filter */}
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    filterType === type
                      ? 'bg-primary text-white'
                      : 'bg-surface/50 text-white/70 hover:text-white hover:bg-surface/80'
                  }`}
                >
                  {type === 'all' ? 'All Events' : type}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'bg-surface/50 text-white/70 hover:text-white'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface/50 text-white/70 hover:text-white'
                }`}
              >
                <List size={20} />
              </button>

              <button className="btn btn-primary btn-sm ml-4 flex items-center gap-2">
                <Plus size={16} />
                Subscribe to Calendar
              </button>
            </div>
          </motion.div>

          {/* Events Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} />
              ))}
            </div>
          ) : (
            <div className="space-y-6 mb-16">
              {filteredEvents.map((event, index) => (
                <EventListItem key={event.id} event={event} index={index} />
              ))}
            </div>
          )}

          {/* Google Calendar Embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-black font-display flex items-center gap-3">
                <Calendar className="text-primary" size={32} />
                Full Calendar
              </h2>
              
              <div className="flex gap-3">
                <button className="btn btn-outline btn-sm flex items-center gap-2">
                  <Download size={16} />
                  Export (.ics)
                </button>
                <button className="btn btn-primary btn-sm flex items-center gap-2">
                  <Plus size={16} />
                  Add to Your Calendar
                </button>
              </div>
            </div>

            <div className="relative w-full" style={{ paddingBottom: '75%', minHeight: '500px' }}>
              <iframe
                src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FSao_Paulo&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=0&mode=MONTH&src=ZGp6ZW5leWVyQGdtYWlsLmNvbQ&color=%230D96FF"
                className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                title="DJ Zen Eyer Events Calendar"
              />
            </div>

            <div className="mt-6 text-center text-sm text-white/60">
              <p>All times shown in your local timezone • Updated in real-time</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;
