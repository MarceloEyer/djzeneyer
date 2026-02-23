import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link } from 'react-router-dom';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import { stripHtml } from '../utils/text';
import {
  Calendar as CalendarIcon,
  MapPin,
  Ticket,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Music,
  Search,
  Share2,
  CalendarPlus,
  Filter
} from 'lucide-react';

// --- UTILS ---
const formatGoogleCalendarUrl = (event: any) => {
  const title = encodeURIComponent(event.title?.rendered || event.title);
  const start = new Date(event.date || event.datetime).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(new Date(event.date || event.datetime).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const location = encodeURIComponent(event.venue ? `${event.venue.name}, ${event.venue.city}, ${event.venue.country}` : "TBA");
  const details = encodeURIComponent(stripHtml(event.content?.rendered || "").substring(0, 500));
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
};

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  // Queries
  const { data: eventsData, isLoading: loadingList, error: listError } = useEventsQuery();
  const { data: singleEvent, isLoading: loadingDetail, error: detailError } = useEventById(id);

  const events = eventsData || [];
  const loading = id ? loadingDetail : loadingList;
  const error = id ? detailError : listError;

  // Filter & Grouping Logic
  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const query = searchQuery.toLowerCase();
    return events.filter((e: any) => {
      const title = (e.title?.rendered || e.title || '').toLowerCase();
      const city = (e.venue?.city || '').toLowerCase();
      const country = (e.venue?.country || '').toLowerCase();
      const venue = (e.venue?.name || '').toLowerCase();
      return title.includes(query) || city.includes(query) || country.includes(query) || venue.includes(query);
    });
  }, [events, searchQuery]);

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    filteredEvents.forEach((event: any) => {
      const date = new Date(event.date || event.datetime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[monthKey]) groups[monthKey] = [];
      groups[monthKey].push(event);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredEvents]);

  // Helper para rotas localizadas
  const getRouteForKey = (key: string): string => {
    const route = ROUTES_CONFIG.find(r => getLocalizedPaths(r, 'en')[0] === key);
    if (!route) return `/${key}`;
    const normalizedLanguage = normalizeLanguage(i18n.language);
    return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
  };

  const shareEvent = async (event: any) => {
    const title = event.title?.rendered || event.title;
    const url = `${window.location.origin}${getLocalizedRoute('events', normalizeLanguage(i18n.language))}/${event.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert(t('link_copied', 'Link copied to clipboard!'));
    }
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
            <Link to={getRouteForKey('events')} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold group">
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {t('events_back_to_list')}
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
                  <img
                    src={image}
                    className="w-full aspect-[4/5] object-cover"
                    alt={title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <div className="bg-primary/10 border border-primary/20 self-start px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  {t('events_status_upcoming')}
                </div>

                <h1 className="text-4xl md:text-6xl font-black font-display mb-8 tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: title }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] hover:border-primary/30 transition-colors group">
                    <CalendarIcon className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest">{t('events_date')}</p>
                    <p className="font-bold text-lg">{new Date(date).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-5 rounded-[1.5rem] hover:border-primary/30 transition-colors group">
                    <MapPin className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <p className="text-xs text-white/40 uppercase font-bold tracking-widest">{t('events_location')}</p>
                    <p className="font-bold text-lg">{location}</p>
                  </div>
                </div>

                <div
                  className="prose prose-invert max-w-none mb-12 text-white/70 leading-relaxed text-lg"
                  dangerouslySetInnerHTML={{ __html: content }}
                />

                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={singleEvent.url || singleEvent.offers?.[0]?.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center justify-center gap-3 py-5 text-lg rounded-2xl shadow-xl shadow-primary/20"
                  >
                    <Ticket size={24} /> {t('events_view_tickets').toUpperCase()}
                  </a>
                  <button
                    onClick={() => window.open(formatGoogleCalendarUrl(singleEvent), '_blank')}
                    className="btn btn-outline flex items-center justify-center gap-3 py-5 text-lg rounded-2xl hover:bg-white/5"
                  >
                    <CalendarPlus size={24} /> {t('events_add_to_calendar').toUpperCase()}
                  </button>
                </div>
              </motion.div>
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
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* --- HERO SECTION --- (Refined) */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16 md:py-24"
            >
              <div className="inline-block mb-4">
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-1.5 text-primary font-bold uppercase tracking-wider text-xs">
                  {t('events_hero_badge', 'Live Experiences')}
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 font-display uppercase tracking-tighter">
                {t('events_page_title', 'Next Events')}
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                {t('events_experience_subtitle', 'Follow my world sheep. From intensive workshops to international congresses.')}
              </p>
            </motion.section>

            {/* --- SEARCH & FILTERS --- (Refined) */}
            <div className="mb-16">
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                <input
                  type="text"
                  placeholder={t('events_filter_placeholder', 'Search city or country...')}
                  className="w-full bg-surface/50 backdrop-blur-md border border-white/10 rounded-full py-4 pl-14 pr-6 text-base focus:outline-none focus:border-primary/50 transition-all shadow-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-24">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-[450px] bg-white/5 rounded-3xl w-full animate-pulse border border-white/5" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-16 rounded-3xl bg-red-500/5 border border-red-500/10 text-center">
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold mb-3">{t('error_loading')}</h3>
                  <p className="text-white/40 max-w-md mx-auto">{error.toString()}</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="p-20 rounded-3xl bg-surface/30 border border-white/5 text-center backdrop-blur-sm">
                  <Filter className="w-12 h-12 text-white/20 mx-auto mb-6" />
                  <p className="text-white/40 text-xl font-display uppercase tracking-widest">
                    {searchQuery ? t('events_no_results') : t('events_none')}
                  </p>
                </div>
              ) : (
                groupedEvents.map(([monthKey, monthEvents]) => {
                  const [year, month] = monthKey.split('-');
                  const monthName = t(`events_month_${new Date(Number(year), Number(month) - 1).toLocaleString('en', { month: 'short' }).toLowerCase()}`);

                  return (
                    <section key={monthKey}>
                      {/* Section Header */}
                      <div className="flex items-center gap-6 mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold font-display uppercase tracking-wider text-primary">
                          {monthName} <span className="text-white/20 ml-2">{year}</span>
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                          {monthEvents.map((event, idx) => {
                            const title = event.title?.rendered || (typeof event.title === 'string' ? event.title : 'Evento');
                            const image = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || event.featured_image_url || event.image || '/images/hero-background.webp';
                            const date = new Date(event.date || event.datetime || new Date().toISOString());
                            const location = event.venue ? `${event.venue.city}, ${event.venue.country}` : 'TBA';

                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05, duration: 0.5 }}
                                className="group"
                              >
                                <div className="card h-full bg-surface/50 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden flex flex-col glow transition-all duration-300 hover:scale-[1.02] hover:border-primary/20">
                                  {/* Poster */}
                                  <div className="aspect-[4/5] relative overflow-hidden">
                                    <img
                                      src={image}
                                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                      alt={title}
                                    />
                                    {/* Subtle Date Overlay */}
                                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-center min-w-[50px]">
                                      <div className="text-xl font-bold text-primary leading-none">{date.getDate()}</div>
                                      <div className="text-[10px] uppercase font-bold text-white/60 tracking-widest mt-0.5">{monthName}</div>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                  </div>

                                  {/* Content */}
                                  <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-3">
                                      <MapPin size={12} /> {location}
                                    </div>

                                    <Link
                                      to={`${getLocalizedRoute('events', normalizeLanguage(i18n.language))}/${event.id}`}
                                      className="block mb-6"
                                    >
                                      <h3 className="text-xl font-bold font-display uppercase tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2" dangerouslySetInnerHTML={{ __html: title }} />
                                    </Link>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => shareEvent(event)}
                                          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors"
                                          title={t('events_share', 'Share')}
                                        >
                                          <Share2 size={16} />
                                        </button>
                                        <button
                                          onClick={() => window.open(formatGoogleCalendarUrl(event), '_blank')}
                                          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-colors"
                                          title={t('events_add_to_calendar', 'Add to Calendar')}
                                        >
                                          <CalendarPlus size={16} />
                                        </button>
                                      </div>

                                      <a
                                        href={event.url || event.offers?.[0]?.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                                      >
                                        <Ticket size={16} /> {t('events_tickets', 'Tickets').toUpperCase()}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </section>
                  );
                })
              )}
            </div>

            {/* --- BOOKING CTA (Refined) --- */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 card p-12 md:p-20 text-center bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 rounded-[3rem] relative overflow-hidden"
            >
              <Music className="absolute -right-16 -bottom-16 text-white/5 w-64 h-64 rotate-12" />
              <div className="relative z-10 max-w-2xl mx-auto font-display">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
                  {t('home_press_title', 'Bring the Zen Experience')}
                </h2>
                <p className="text-lg text-white/60 mb-10 font-light leading-relaxed">
                  {t('events_experience_subtitle', 'Follow my agenda and workshops. Available for international bookings.')}
                </p>
                <Link
                  to={getLocalizedRoute('work-with-me', normalizeLanguage(i18n.language))}
                  className="btn btn-primary px-10 py-4 rounded-2xl text-lg font-bold inline-flex items-center gap-3 hover:scale-105 transition-transform"
                >
                  {t('contact', 'Contact for Booking').toUpperCase()}
                  <ArrowRight size={20} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(EventsPage);
