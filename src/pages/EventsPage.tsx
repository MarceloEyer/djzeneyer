import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link } from 'react-router-dom';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import {
  Calendar as CalendarIcon,
  MapPin,
  Ticket,
  Plus,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Send,
  Sparkles,
  Music
} from 'lucide-react';

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { t, i18n } = useTranslation();

  // Queries centralizadas
  const { data: eventsData, isLoading: loadingList, error: listError } = useEventsQuery();
  const { data: singleEvent, isLoading: loadingDetail, error: detailError } = useEventById(id);

  const events = eventsData || [];
  const loading = id ? loadingDetail : loadingList;
  const error = id ? detailError : listError;

  // Helper para rotas localizadas
  const getRouteForKey = (key: string): string => {
    const route = ROUTES_CONFIG.find(r => getLocalizedPaths(r, 'en')[0] === key);
    if (!route) return `/${key}`;
    const normalizedLanguage = normalizeLanguage(i18n.language);
    return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
  };

  // --- RENDERIZAÇÃO DE EVENTO ÚNICO ---
  if (!loading && id && singleEvent) {
    const title = singleEvent.title?.rendered || (typeof singleEvent.title === 'string' ? singleEvent.title : 'Evento');
    const content = singleEvent.content?.rendered || (typeof singleEvent.content === 'string' ? singleEvent.content : '');
    const date = singleEvent.date || singleEvent.datetime || new Date().toISOString();
    const image = singleEvent._embedded?.['wp:featuredmedia']?.[0]?.source_url || singleEvent.featured_image_url || singleEvent.image || '/images/hero-background.webp';
    const location = singleEvent.venue ? `${singleEvent.venue.name}, ${singleEvent.venue.city}` : 'Local a definir';

    return (
      <>
        <HeadlessSEO
          title={`${title} | Zen Events`}
          description={singleEvent.excerpt?.rendered || stripHtml(content).substring(0, 160)}
          url={`https://djzeneyer.com/events/${id}`}
        />
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link to={getRouteForKey('events')} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold">
              <ArrowLeft size={20} /> {t('events_back_to_list')}
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={image}
                    className="w-full aspect-[4/5] object-cover"
                    alt={title}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="bg-primary/10 border border-primary/20 self-start px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
                  {t('events_status_upcoming')}
                </div>

                <h1 className="text-4xl md:text-5xl font-black font-display mb-6" dangerouslySetInnerHTML={{ __html: title }} />

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-tighter">{t('events_date')}</p>
                      <p className="font-bold">{new Date(date).toLocaleDateString(i18n.language)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-white/80">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-tighter">{t('events_location')}</p>
                      <p className="font-bold">{location}</p>
                    </div>
                  </div>
                </div>

                <div
                  className="prose prose-invert max-w-none mb-10 text-white/70"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                  <a
                    href={singleEvent.url || singleEvent.offers?.[0]?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-lg"
                  >
                    <Ticket size={22} /> {t('events_view_tickets').toUpperCase()}
                  </a>
                  <Link to={getRouteForKey('shop')} className="btn btn-outline flex-1 flex items-center justify-center gap-2 py-4 text-lg">
                    <Plus size={22} /> {t('footer_shop')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- RENDERIZAÇÃO DA LISTA ---
  return (
    <>
      <HeadlessSEO
        title={t('events_page_title')}
        description={t('events_page_meta_desc')}
        url="https://djzeneyer.com/events"
      />
      <div className="min-h-screen bg-background text-white pt-24 pb-20 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden py-24">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* --- HERO SECTION --- */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16 md:py-24"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-widest mb-8">
                <Sparkles size={14} />
                {t('events_hero_badge', 'WORLD TOUR')}
              </div>
              <h1 className="text-5xl md:text-8xl font-black font-display mb-6 tracking-tight leading-none uppercase">
                <Trans i18nKey="events_title_rich">
                  Next <span className="text-gradient">Events</span>
                </Trans>
              </h1>
              <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                {t('events_page_meta_desc')}
              </p>
            </motion.section>

            <div className="flex flex-col gap-12">
              {/* Event Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <h2 className="text-xl font-display font-bold uppercase tracking-widest">
                    {t('events_upcoming_list', 'Upcoming Tour Dates')}
                  </h2>
                </div>
                <div className="text-white/40 text-sm font-bold uppercase tracking-widest">
                  Found: <span className="text-primary">{!loading && !error ? events.length : '...'}</span>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-72 bg-white/5 rounded-[2.5rem] w-full animate-pulse border border-white/5" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-16 rounded-[3rem] bg-red-500/5 border border-red-500/10 text-center backdrop-blur-xl">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-black mb-3">{t('error_loading')}</h3>
                  <p className="text-white/40 max-w-md mx-auto">{error.toString()}</p>
                </div>
              ) : events.length === 0 ? (
                <div className="p-24 rounded-[3rem] bg-white/5 border border-white/10 text-center backdrop-blur-xl">
                  <Plus className="w-16 h-16 text-white/5 mx-auto mb-6 opacity-20" />
                  <p className="text-white/20 text-2xl font-display uppercase tracking-widest">{t('events_none')}</p>
                </div>
              ) : (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: { staggerChildren: 0.15 }
                    }
                  }}
                  className="grid gap-8"
                >
                  {events.map((event) => {
                    const title = event.title?.rendered || (typeof event.title === 'string' ? event.title : 'Evento');
                    const image = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || event.featured_image_url || event.image || '/images/hero-background.webp';
                    const date = event.date || event.datetime || new Date().toISOString();
                    const location = event.venue ? `${event.venue.city}, ${event.venue.country}` : 'Local a definir';

                    return (
                      <motion.div
                        key={event.id}
                        variants={{
                          hidden: { opacity: 0, y: 40 },
                          show: { opacity: 1, y: 0 }
                        }}
                        className="group"
                      >
                        <div className="relative bg-[#1A1A1A]/30 backdrop-blur-2xl border border-white/5 group-hover:border-primary/40 rounded-[2.5rem] overflow-hidden transition-all duration-700 shadow-2xl group-hover:shadow-primary/10">
                          {/* Hover Glow Effect */}
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                          <div className="flex flex-col lg:flex-row min-h-[320px]">
                            {/* Poster Section */}
                            <div className="lg:w-[35%] overflow-hidden relative">
                              <img
                                src={image}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                alt={title}
                              />
                              <div className="absolute inset-x-0 bottom-0 lg:inset-y-0 lg:right-0 lg:w-32 bg-gradient-to-t lg:bg-gradient-to-l from-black/80 to-transparent pointer-events-none" />
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-between">
                              <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-4 text-xs font-black uppercase tracking-[0.25em]">
                                  <span className="flex items-center gap-2 text-primary bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                    <CalendarIcon size={14} />
                                    {new Date(date).toLocaleDateString(i18n.language, { day: '2-digit', month: 'short' }).toUpperCase()}
                                  </span>
                                  <span className="flex items-center gap-2 text-white/50 px-4 py-2 rounded-full border border-white/10">
                                    <MapPin size={14} /> {location}
                                  </span>
                                </div>

                                <Link to={`${getLocalizedRoute('events', normalizeLanguage(i18n.language))}/${event.id}`}>
                                  <h3 className="text-4xl md:text-5xl font-black font-display leading-[1] text-white group-hover:text-primary transition-colors duration-300" dangerouslySetInnerHTML={{ __html: title }} />
                                </Link>
                              </div>

                              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-10 mt-8 border-t border-white/5">
                                <Link
                                  to={`${getLocalizedRoute('events', normalizeLanguage(i18n.language))}/${event.id}`}
                                  className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-white/30 hover:text-white transition-all group/link"
                                >
                                  {t('events_details').toUpperCase()}
                                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover/link:border-primary group-hover/link:bg-primary/10 transition-all duration-500">
                                    <ArrowRight size={18} />
                                  </div>
                                </Link>

                                <a
                                  href={event.url || event.offers?.[0]?.url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="w-full sm:w-auto btn btn-primary px-12 py-5 rounded-2xl flex items-center justify-center gap-4 shadow-xl transition-all duration-300 transform active:scale-95"
                                >
                                  <Ticket size={24} />
                                  <span className="text-base font-black uppercase tracking-widest">{t('events_tickets', 'GET TICKETS')}</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* --- BOOKING SECTION --- */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent blur-[80px] rounded-[4rem]" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 md:p-24 overflow-hidden text-center md:text-left">
                {/* Decorative Icon */}
                <div className="absolute -right-20 -bottom-20 opacity-5 pointer-events-none hidden lg:block">
                  <Music size={500} />
                </div>

                <div className="max-w-3xl relative z-10">
                  <div className="inline-block px-5 py-2 bg-accent/20 border border-accent/20 rounded-full text-accent text-xs font-black uppercase tracking-widest mb-10">
                    <Send size={16} className="inline mr-2" />
                    {t('footer_contact_text')}
                  </div>
                  <h2 className="text-4xl md:text-7xl font-black font-display mb-8 leading-[1.05] uppercase text-white">
                    {t('home_press_title', 'Bring the Zen Energy to Your City')}
                  </h2>
                  <p className="text-xl md:text-2xl text-white/40 mb-12 leading-relaxed">
                    {t('support.business.description')}
                  </p>
                  <div className="flex justify-center md:justify-start">
                    <Link
                      to={getLocalizedRoute('work-with-me', normalizeLanguage(i18n.language))}
                      className="btn btn-outline px-12 py-6 rounded-2xl text-lg font-black group/cta flex items-center gap-4 border-primary/30 text-primary hover:bg-primary hover:text-black transition-all duration-500"
                    >
                      {t('contact').toUpperCase()}
                      <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

export default memo(EventsPage);
