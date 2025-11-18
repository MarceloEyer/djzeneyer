// src/pages/EventsPage.tsx - VERSÃO FINAL HEADLESS

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// Importação CRÍTICA: HeadlessSEO e a função de mapeamento
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; 
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket,
  Bell,
  Download,
  Plus,
  Music2,
  Award,
  TrendingUp,
  Gift,
  Heart
} from 'lucide-react';

// ============================================================================
// CONSTANTES (FORA DO COMPONENTE - OTIMIZAÇÃO)
// ============================================================================

/**
 * Mock de eventos em destaque
 */
const FEATURED_EVENTS = [
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
  }
];

/**
 * Schema.org EventSeries (agregação de eventos)
 */
const EVENT_SERIES_SCHEMA = {
  "@type": "EventSeries",
  "@id": "https://djzeneyer.com/events#series",
  "name": "DJ Zen Eyer Events - Brazilian Zouk Festivals & Workshops",
  "description": "International Brazilian Zouk events, festivals, and workshops featuring DJ Zen Eyer, two-time world champion.",
  "url": "https://djzeneyer.com/events",
  "organizer": {
    "@id": "https://djzeneyer.com/#artist"
  },
  "performer": {
    "@id": "https://djzeneyer.com/#artist"
  },
  "eventSchedule": {
    "@type": "Schedule",
    "byMonth": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    "repeatFrequency": "P1M",
    "scheduleTimezone": "America/Sao_Paulo"
  }
};

/**
 * Achievements do sistema de gamificação
 */
const ACHIEVEMENTS_DATA = [
  { 
    id: 'xp', 
    icon: <TrendingUp size={24} />, 
    bgColor: 'bg-primary/20',
    iconColor: 'text-primary',
    titleKey: 'events_achievement_xp_title', 
    descKey: 'events_achievement_xp_desc' 
  },
  { 
    id: 'badges', 
    icon: <Award size={24} />, 
    bgColor: 'bg-secondary/20',
    iconColor: 'text-secondary',
    titleKey: 'events_achievement_badges_title', 
    descKey: 'events_achievement_badges_desc' 
  },
  { 
    id: 'rewards', 
    icon: <Gift size={24} />, 
    bgColor: 'bg-accent/20',
    iconColor: 'text-accent',
    titleKey: 'events_achievement_rewards_title', 
    descKey: 'events_achievement_rewards_desc' 
  },
  { 
    id: 'streaks', 
    icon: <Clock size={24} />, 
    bgColor: 'bg-success/20',
    iconColor: 'text-success',
    titleKey: 'events_achievement_streaks_title', 
    descKey: 'events_achievement_streaks_desc' 
  },
];

// ============================================================================
// COMPONENTES AUXILIARES (MEMOIZADOS)
// ============================================================================

/**
 * Card de Achievement
 */
const AchievementItem: React.FC<{ 
  icon: React.ReactNode; 
  bgColor: string;
  iconColor: string;
  title: string; 
  description: string;
}> = memo(({ icon, bgColor, iconColor, title, description }) => (
  <div className="flex items-start group transition-all duration-300 hover:bg-white/5 p-4 rounded-lg">
    <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mr-4 flex-shrink-0`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-1">{title}</h3>
      <p className="text-white/70">{description}</p>
    </div>
  </div>
));
AchievementItem.displayName = 'AchievementItem';

/**
 * Card de Evento em Destaque
 */
const FeaturedEventCard: React.FC<{ 
  event: typeof FEATURED_EVENTS[0]; 
  index: number;
  t: any;
}> = memo(({ event, index, t }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'text-success';
      case 'Limited': return 'text-warning';
      case 'Members Only': return 'text-accent';
      default: return 'text-white/60';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Available': return t('event_badge_available');
      case 'Members Only': return t('event_badge_members_only');
      default: return status;
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="card overflow-hidden group cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTypeColor(event.type)}`}>
            {event.type}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs font-bold ${getStatusColor(event.status)}`}>
            {getStatusLabel(event.status)}
          </span>
        </div>
      </div>

      {/* Event Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 line-clamp-1">{event.title}</h3>

        {/* Metadata */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-white/70">
            <Calendar size={16} className="text-primary" />
            <span className="text-sm">
              {new Date(event.date).toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <Clock size={16} className="text-secondary" />
            <span className="text-sm">{event.time}</span>
          </div>

          <div className="flex items-center gap-2 text-white/70">
            <MapPin size={16} className="text-accent" />
            <span className="text-sm line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-2xl font-black text-primary">{event.price}</span>
          <button className="btn btn-primary btn-sm flex items-center gap-2">
            <Ticket size={16} />
            {t('event_get_ticket')}
          </button>
        </div>
      </div>
    </motion.div>
  );
});
FeaturedEventCard.displayName = 'FeaturedEventCard';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const EventsPage: React.FC = () => {
  const { t } = useTranslation();
  // URL base para o canonical tag
  const currentUrl = 'https://djzeneyer.com/events';
  
  // 💡 HREFLANG CORRIGIDO: Usa a função centralizada para evitar hardcoding
  const hrefLangUrls = getHrefLangUrls('/events', currentUrl);

  return (
    <>
      {/* ====================================================================== */}
      {/* HEADLESS SEO (CENTRALIZADO) */}
      {/* ====================================================================== */}
      <HeadlessSEO
        title={t('events_page_title')}
        description={t('events_page_meta_desc')}
        url={currentUrl}
        image="https://djzeneyer.com/images/events-og.jpg"
        ogType="website"
        schema={EVENT_SERIES_SCHEMA}
        hrefLang={hrefLangUrls}
        keywords="DJ Zen Eyer events, Brazilian Zouk festivals, Zouk workshops, international Zouk events, dance events Brazil"
      />

      {/* ====================================================================== */}
      {/* CONTEÚDO DA PÁGINA */}
      {/* ====================================================================== */}
      <div className="min-h-screen pt-24 pb-16">
        
        {/* Header */}
        <div className="bg-surface py-16">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block mb-4">
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Music2 className="inline-block mr-2" size={16} />
                  {t('events_header_badge')}
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                {t('events_header_title')}
              </h1>
              
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                {t('events_header_subtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Featured Events */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-3xl font-black font-display mb-8 text-center">
                {t('events_featured_title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {FEATURED_EVENTS.map((event, index) => (
                  <FeaturedEventCard 
                    key={event.id} 
                    event={event} 
                    index={index}
                    t={t}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Google Calendar Section */}
        <section className="py-16 bg-surface">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="card p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black font-display flex items-center gap-3">
                  <Calendar className="text-primary" size={32} />
                  {t('events_calendar_title')}
                </h2>
                
                <div className="flex gap-3">
                  <button className="btn btn-outline btn-sm flex items-center gap-2">
                    <Download size={16} />
                    {t('events_calendar_export')}
                  </button>
                  <button className="btn btn-primary btn-sm flex items-center gap-2">
                    <Plus size={16} />
                    {t('events_calendar_add')}
                  </button>
                </div>
              </div>

              <div className="relative w-full rounded-lg overflow-hidden shadow-lg bg-white/5">
                <div className="relative pb-[75%] md:pb-[56.25%] h-0">
                  <iframe 
                    src="https://calendar.google.com/calendar/embed?src=eyer.marcelo%40gmail.com&ctz=America%2FSao_Paulo" 
                    className="absolute top-0 left-0 w-full h-full"
                    style={{ border: 0 }}
                    frameBorder="0" 
                    scrolling="no"
                    title={t('events_calendar_iframe_title')}
                  />
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-white/60">
                <p>{t('events_calendar_note')}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Achievement System */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div 
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-black font-display mb-6">
                  {t('events_achievement_section_title')}
                </h2>
                <p className="text-xl text-white/70 mb-8">
                  {t('events_achievement_section_subtitle')}
                </p>
                
                <div className="space-y-4">
                  {ACHIEVEMENTS_DATA.map(achievement => (
                    <AchievementItem
                      key={achievement.id}
                      icon={achievement.icon}
                      bgColor={achievement.bgColor}
                      iconColor={achievement.iconColor}
                      title={t(achievement.titleKey as any)}
                      description={t(achievement.descKey as any)}
                    />
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 border border-primary/30">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🎉</div>
                    <h3 className="text-2xl font-black mb-4">
                      {t('events_cta_title')}
                    </h3>
                    <p className="text-white/70 mb-6">
                      {t('events_cta_subtitle')}
                    </p>
                    <button className="btn btn-primary btn-lg flex items-center gap-2 mx-auto">
                      <Bell size={20} />
                      {t('events_cta_button')}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EventsPage;