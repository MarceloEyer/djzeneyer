import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link } from 'react-router-dom';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import {
  Calendar as CalendarIcon,
  MapPin,
  Ticket,
  Plus,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Briefcase,
  Send
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
      <div className="min-h-screen bg-background text-white pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col gap-16">
              {/* Event Header & List Container */}
              <div className="space-y-12">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h2 className="text-3xl font-display font-black flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <CalendarIcon className="text-primary" size={24} />
                    </div>
                    {t('events_title')}
                  </h2>
                  <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
                    <span className="text-primary font-mono font-bold">
                      {!loading && !error ? `${events.length}` : '...'}
                    </span>
                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest ml-2">
                      {t('events_found')}
                    </span>
                  </div>
                </div>

                {loading ? (
                  <div className="space-y-8">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-64 bg-white/5 rounded-[2rem] w-full animate-pulse" />
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-16 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 text-center backdrop-blur-xl">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-50" />
                    <h3 className="text-2xl font-black mb-3">{t('error_loading')}</h3>
                    <p className="text-white/40 max-w-md mx-auto">{error.toString()}</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="p-20 rounded-[2.5rem] bg-white/5 border border-white/10 text-center backdrop-blur-xl">
                    <CalendarIcon className="w-16 h-16 text-white/10 mx-auto mb-6" />
                    <p className="text-white/40 text-xl font-medium">{t('events_none')}</p>
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
                    className="space-y-8"
                  >
                    {events.map((event, index) => {
                      const title = event.title?.rendered || (typeof event.title === 'string' ? event.title : 'Evento sem título');
                      const image = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || event.featured_image_url || event.image || '/images/hero-background.webp';
                      const date = event.date || event.datetime || new Date().toISOString();
                      const location = event.venue ? `${event.venue.city}, ${event.venue.region || event.venue.country}` : 'Local a definir';

                      return (
                        <motion.div
                          key={event.id}
                          variants={{
                            hidden: { opacity: 0, y: 30 },
                            show: { opacity: 1, y: 0 }
                          }}
                          className="group relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem] blur-2xl" />
                          <div className="relative bg-[#1A1A1A]/40 backdrop-blur-xl border border-white/5 group-hover:border-primary/30 rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-2xl">
                            <div className="flex flex-col lg:flex-row h-full">
                              <div className="lg:w-1/3 aspect-[16/10] lg:aspect-square overflow-hidden relative">
                                <img
                                  src={image}
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                                  alt={title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                              </div>

                              <div className="flex-1 p-8 md:p-12 flex flex-col justify-between space-y-8">
                                <div>
                                  <div className="flex flex-wrap gap-6 text-primary text-xs font-black uppercase tracking-[0.2em] mb-6">
                                    <span className="flex items-center gap-2.5 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                      <CalendarIcon size={16} />
                                      {new Date(date).toLocaleDateString(i18n.language, { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </span>
                                    <span className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                      <MapPin size={16} /> {location}
                                    </span>
                                  </div>
                                  <Link to={`${getRouteForKey('events')}/${event.id}`}>
                                    <h3 className="text-3xl md:text-5xl font-black font-display leading-[1.1] group-hover:text-primary transition-colors text-white" dangerouslySetInnerHTML={{ __html: title }} />
                                  </Link>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                                  <Link
                                    to={`${getRouteForKey('events')}/${event.id}`}
                                    className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-white/60 hover:text-white transition-all group/link"
                                  >
                                    {t('events_details')}
                                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover/link:border-primary group-hover/link:bg-primary/10 transition-all">
                                      <ArrowRight size={16} />
                                    </div>
                                  </Link>
                                  <a
                                    href={event.url || event.offers?.[0]?.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-10 py-4 bg-primary hover:bg-white text-black font-black rounded-2xl transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]"
                                  >
                                    <Ticket size={20} />
                                    {t('events_tickets', 'GET TICKETS')}
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

              {/* Booking Section CTA - Full Width Premium */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative mt-12 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary opacity-10 blur-[100px] group-hover:opacity-20 transition-opacity rounded-[3rem]" />
                <div className="relative bg-[#1A1A1A]/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 md:p-20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
                    <Briefcase size={400} className="text-white transform translate-x-1/2 -translate-y-1/4" />
                  </div>

                  <div className="max-w-2xl relative z-10">
                    <div className="inline-flex items-center gap-3 bg-primary/20 text-primary px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8">
                      <Send size={16} /> {t('footer_contact_text', 'CONTACT')}
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black font-display mb-8 leading-tight">
                      {t('home_press_title', 'Bring the Zen Energy to Your City')}
                    </h3>
                    <p className="text-lg md:text-xl text-white/50 mb-12 leading-relaxed">
                      {t('support.business.description')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <Link
                        to={getRouteForKey('work-with-me')}
                        className="btn btn-primary px-12 py-5 rounded-2xl text-lg font-black group/cta flex items-center justify-center gap-3"
                      >
                        {t('contact').toUpperCase()}
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
