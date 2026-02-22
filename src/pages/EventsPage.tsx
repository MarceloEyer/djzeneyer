import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link } from 'react-router-dom';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import {
  Calendar as CalendarIcon,
  MapPin,
  Ticket,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Music,
  Search,
  Share2,
  CalendarPlus,
  Filter
} from 'lucide-react';

// --- UTILS ---
const stripHtml = (html: string) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};
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
          <div className="max-w-6xl mx-auto">
            {/* --- HERO SECTION --- */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center py-20 md:py-32"
            >
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-[0.3em] mb-10 shadow-lg shadow-black/20">
                <Sparkles size={16} className="animate-pulse" />
                {t('events_hero_badge')}
              </div>
              <h1 className="text-6xl md:text-9xl font-black font-display mb-10 tracking-tighter leading-[0.85] uppercase">
                <Trans i18nKey="events_title_rich">
                  Next <span className="text-gradient">Events</span>
                </Trans>
              </h1>
              <p className="text-xl md:text-3xl text-white/40 max-w-2xl mx-auto leading-relaxed font-light italic">
                {t('home_subheadline')}
              </p>
            </motion.section>

            {/* --- SEARCH & FILTERS --- */}
            <div className="mb-20">
              <div className="relative max-w-2xl mx-auto space-y-4">
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={24} />
                  <input
                    type="text"
                    placeholder={t('events_filter_placeholder')}
                    className="w-full bg-[#1A1A1A]/50 backdrop-blur-3xl border border-white/10 rounded-[2rem] py-6 pl-16 pr-8 text-lg focus:outline-none focus:border-primary/50 transition-all shadow-2xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                    >
                      CLEAR
                    </button>
                  )}
                </div>
                {searchQuery && filteredEvents.length > 0 && (
                  <p className="text-center text-white/40 text-sm font-bold uppercase tracking-widest">
                    {t('events_search_results')} "{searchQuery}": <span className="text-primary">{filteredEvents.length}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-32">
              {loading ? (
                <div className="grid gap-12">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-80 bg-white/5 rounded-[3rem] w-full animate-pulse border border-white/5" />
                  ))}
                </div>
              ) : error ? (
                <div className="p-20 rounded-[4rem] bg-red-500/5 border border-red-500/10 text-center backdrop-blur-3xl">
                  <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-8 opacity-50" />
                  <h3 className="text-3xl font-black mb-4">{t('error_loading')}</h3>
                  <p className="text-white/40 max-w-md mx-auto text-lg">{error.toString()}</p>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="p-32 rounded-[4rem] bg-white/5 border border-white/10 text-center backdrop-blur-3xl">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-10">
                    <Filter className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-white/20 text-3xl font-display uppercase tracking-widest">{searchQuery ? t('events_no_results') : t('events_none')}</p>
                </div>
              ) : (
                groupedEvents.map(([monthKey, monthEvents]) => {
                  const [year, month] = monthKey.split('-');
                  const monthName = t(`events_month_${new Date(Number(year), Number(month) - 1).toLocaleString('en', { month: 'short' }).toLowerCase()}`);

                  return (
                    <section key={monthKey} className="relative">
                      {/* Sticky Month Label */}
                      <div className="flex items-center gap-8 mb-16">
                        <div className="flex flex-col">
                          <span className="text-7xl md:text-8xl font-black font-display leading-none text-white/5 select-none">{year}</span>
                          <span className="text-4xl md:text-5xl font-black font-display -mt-8 text-primary shadow-primary/50 uppercase tracking-tighter">{monthName}</span>
                        </div>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                      </div>

                      <div className="grid gap-12">
                        <AnimatePresence mode="popLayout">
                          {monthEvents.map((event, idx) => {
                            const title = event.title?.rendered || (typeof event.title === 'string' ? event.title : 'Evento');
                            const image = event._embedded?.['wp:featuredmedia']?.[0]?.source_url || event.featured_image_url || event.image || '/images/hero-background.webp';
                            const date = new Date(event.date || event.datetime || new Date().toISOString());
                            const location = event.venue ? `${event.venue.city}, ${event.venue.country}` : 'TBA';
                            const venueName = event.venue?.name || t('events_venue');

                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.8 }}
                                className="group relative"
                              >
                                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                <div className="relative bg-[#0D0D0D] border border-white/5 group-hover:border-primary/40 rounded-[3rem] overflow-hidden transition-all duration-700 shadow-2xl flex flex-col lg:flex-row min-h-[400px]">
                                  {/* Poster Section */}
                                  <div className="lg:w-[40%] overflow-hidden relative">
                                    <img
                                      src={image}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out"
                                      alt={title}
                                    />
                                    {/* Date Badge over image */}
                                    <div className="absolute top-8 left-8 w-20 h-24 bg-black/8 backdrop-blur-3xl border border-white/20 rounded-2xl flex flex-col items-center justify-center shadow-2xl">
                                      <span className="text-3xl font-black text-primary leading-none">{date.getDate()}</span>
                                      <span className="text-xs font-black uppercase tracking-widest text-white/60">{monthName}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                  </div>

                                  {/* Content Section */}
                                  <div className="flex-1 p-10 md:p-16 flex flex-col justify-between relative">
                                    <div className="space-y-8">
                                      <div className="flex flex-wrap items-center gap-4">
                                        <span className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest">
                                          <MapPin size={16} /> {location}
                                        </span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                        <span className="text-white/40 font-bold uppercase text-xs tracking-widest">{venueName}</span>
                                      </div>

                                      <Link to={`${getLocalizedRoute('events', normalizeLanguage(i18n.language))}/${event.id}`}>
                                        <h3 className="text-4xl md:text-6xl font-black font-display leading-[1] text-white group-hover:text-primary transition-colors duration-500 uppercase tracking-tighter" dangerouslySetInnerHTML={{ __html: title }} />
                                      </Link>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-10 pt-16">
                                      <div className="flex items-center gap-4">
                                        <Link
                                          to={`${getLocalizedRoute('events', normalizeLanguage(i18n.language))}/${event.id}`}
                                          className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-500 group/arrow"
                                        >
                                          <ArrowRight size={24} className="group-hover/arrow:translate-x-1 transition-transform" />
                                        </Link>
                                        <button
                                          onClick={() => shareEvent(event)}
                                          className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center hover:border-primary hover:bg-primary/10 transition-all duration-500"
                                        >
                                          <Share2 size={24} />
                                        </button>
                                      </div>

                                      <a
                                        href={event.url || event.offers?.[0]?.url || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto btn btn-primary px-16 py-6 rounded-2xl flex items-center justify-center gap-6 shadow-2xl shadow-primary/20 transition-all duration-500 scale-100 group-hover:scale-105"
                                      >
                                        <Ticket size={28} />
                                        <span className="text-lg font-black uppercase tracking-[0.2em]">{t('events_tickets')}</span>
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

            {/* --- BOOKING CTAs --- */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-48 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent blur-[120px] rounded-[5rem] group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[5rem] p-16 md:p-32 overflow-hidden">
                <Music className="absolute -right-40 -bottom-40 text-white/5 pointer-events-none w-[600px] h-[600px] rotate-12" />

                <div className="max-w-3xl relative z-10">
                  <div className="inline-block px-6 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-[0.4em] mb-12">
                    {t('footer_contact_text')}
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black font-display mb-12 leading-[0.9] uppercase text-white">
                    {t('home_press_title')}
                  </h2>
                  <p className="text-2xl text-white/40 mb-16 leading-relaxed font-light italic">
                    {t('events_experience_subtitle')}
                  </p>
                  <Link
                    to={getLocalizedRoute('work-with-me', normalizeLanguage(i18n.language))}
                    className="btn btn-outline border-primary/30 text-primary px-16 py-8 rounded-3xl text-xl font-black group/cta flex items-center justify-center w-fit gap-6 hover:bg-primary hover:text-black transition-all duration-700"
                  >
                    {t('contact').toUpperCase()}
                    <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform duration-500" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(EventsPage);
