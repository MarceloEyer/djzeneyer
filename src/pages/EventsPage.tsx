import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
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

                <h1 className="text-4xl md:text-5xl font-black font-display mb-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }} />

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
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
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
          <div className="max-w-4xl mb-20">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black font-display tracking-tighter mb-6"
            >
              {t('events_experience_title').split(' ')[0]} <span className="text-primary italic">{t('events_experience_title').split(' ').slice(1).join(' ')}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-white/60 font-medium"
            >
              {t('events_experience_subtitle')}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                  <CalendarIcon className="text-primary" /> {t('events_title')}
                </h2>
                <span className="text-white/40 text-sm font-mono">
                  {!loading && !error ? `${events.length} ${t('events_found')}` : '...'}
                </span>
              </div>

              {loading ? (
                <div className="space-y-6 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-white/5 rounded-3xl w-full" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">{t('error_loading', 'Não foi possível carregar a agenda')}</h3>
                  <p className="text-white/60">{error.toString()}</p>
                </div>
              ) : events.length === 0 ? (
                <div className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center">
                  <p className="text-white/60">{t('events_none')}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {events.map((event, index) => {
                    const title = event.title?.rendered || (typeof event.title === 'string' ? event.title : 'Evento sem título');
                    const image = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || event.featured_image_url || event.image || '/images/hero-background.webp';
                    const date = event.date || event.datetime || new Date().toISOString();
                    const location = event.venue ? `${event.venue.city}, ${event.venue.region || event.venue.country}` : 'Local a definir';

                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-surface/30 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/40 transition-all duration-500"
                      >
                        <div className="flex flex-col md:flex-row p-6 gap-8">
                          <div className="md:w-48 h-48 rounded-2xl overflow-hidden shrink-0">
                            <img
                              src={image}
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                              alt={title}
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-4 text-primary text-xs font-bold uppercase mb-3">
                                <span className="flex items-center gap-1.5"><CalendarIcon size={14} /> {new Date(date).toLocaleDateString(i18n.language)}</span>
                                <span className="flex items-center gap-1.5"><MapPin size={14} /> {location}</span>
                              </div>
                              <Link to={`${getRouteForKey('events')}/${event.id}`}>
                                <h3 className="text-2xl md:text-3xl font-black font-display mb-4 group-hover:text-primary transition-colors text-white" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }} />
                              </Link>
                            </div>
                            <div className="flex items-center justify-between">
                              <Link to={`${getRouteForKey('events')}/${event.id}`} className="text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all">
                                {t('events_details')} <ArrowRight size={16} />
                              </Link>
                              <a
                                href={event.url || event.offers?.[0]?.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary px-6 py-2 rounded-full text-xs font-bold"
                              >
                                {t('events_tickets', 'TICKETS')}
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="text-primary" /> {t('footer_work_with_me')}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {t('home_work_with_me_desc', 'Interessado em levar a experiência Zen Eyer para o seu evento? Solicite um orçamento para bookings internacionais.')}
                </p>
                <Link to={getRouteForKey('work-with-me')} className="w-full btn btn-primary flex items-center justify-center gap-2 py-3">
                  {t('contact').toUpperCase()} <Send size={16} />
                </Link>
              </div>

              <div className="border border-white/10 rounded-3xl p-8 text-left">
                <h3 className="text-xl font-display font-bold mb-6">{t('events_categories')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['Congressos', 'Workshops', 'Social', 'Online', 'Festivais'].map(cat => (
                    <span key={cat} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-primary/20 hover:border-primary/40 cursor-pointer transition-colors">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
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
