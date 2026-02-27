import React, { memo, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link } from 'react-router-dom';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import { stripHtml } from '../utils/text';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
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

// --- CUSTOM BRAND ICONS ---
const GoogleCalendarLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M45 12V36C45 38.2091 43.2091 40 41 40H7C4.79086 40 3 38.2091 3 36V12C3 9.79086 4.79086 8 7 8H41C43.2091 8 45 9.79086 45 12Z" />
    <path fill="#FBBC05" d="M9 13H15V19H9V13Z" />
    <path fill="#34A853" d="M17 13H23V19H17V13Z" />
    <path fill="#EA4335" d="M25 13H31V19H25V13Z" />
    <path fill="#4285F4" d="M33 13H39V19H33V13Z" />
    <path fill="white" d="M31 24H17V33H31V24Z" />
    <path fill="#4285F4" d="M26 26H22V31H26V26Z" />
  </svg>
);

const AppleLogo = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.05 20.28c-.96.95-2.04 1.72-3.23 1.72-1.16 0-1.54-.71-2.91-.71-1.39 0-1.8.71-2.91.71-1.18 0-2.31-.83-3.29-1.8C2.71 18.23 1.35 15.11 1.35 12.11c0-3.07 1.94-4.7 3.84-4.7 1 0 1.86.64 2.64.64.75 0 1.75-.7 2.89-.7 1.48 0 2.58.74 3.19 1.63-3.07 1.83-2.58 5.76.5 7-.65 1.58-1.5 3.32-2.36 4.3zM12.03 7.25c-.02-2.31 1.83-4.21 4.14-4.25.04 2.29-1.89 4.29-4.14 4.25z" />
  </svg>
);

// --- UTILS ---
const downloadICS = (event: any) => {
  const title = event.title?.rendered || event.title || 'Evento';
  const start = new Date(event.date || event.datetime).toISOString().replace(/-|:|\.\d\d\d/g, "");
  // Padronizar duração para 4 horas caso não venha da API
  const end = new Date(new Date(event.date || event.datetime).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const location = event.venue ? `${event.venue.name}, ${event.venue.city}, ${event.venue.country}` : "TBA";
  const details = stripHtml(event.content?.rendered || "").substring(0, 500);

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//DJ Zen Eyer//Events//PT",
    "BEGIN:VEVENT",
    `UID:${event.id}@djzeneyer.com`,
    `DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, "")}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);

  // Usar dispatch de evento customizado ou um elemento estático oculto
  // Aqui optamos por disparar um evento para um componente pai ou usar um ref
  // Para simplicidade e segurança sem manipulação direta de appendChild no corpo:
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
  link.click();

  // Limpar o objeto URL após o clique
  setTimeout(() => window.URL.revokeObjectURL(url), 100);
};

const getGoogleCalendarUrl = (event: any) => {
  const title = encodeURIComponent(event.title?.rendered || event.title || 'Evento');
  const start = new Date(event.date || event.datetime).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(new Date(event.date || event.datetime).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const location = encodeURIComponent(event.venue ? `${event.venue.name}, ${event.venue.city}, ${event.venue.country}` : "TBA");
  const details = encodeURIComponent(stripHtml(event.content?.rendered || "").substring(0, 500));

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
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
                    src={safeUrl(image)}
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

                <h1 className="text-4xl md:text-6xl font-black font-display mb-8 tracking-tighter leading-none" dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />

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
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
                />

                <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={getGoogleCalendarUrl(singleEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary flex items-center justify-center gap-3 py-5 text-lg rounded-2xl shadow-xl shadow-primary/20"
                  >
                    <GoogleCalendarLogo size={28} /> GOOGLE CALENDAR
                  </a>
                  <button
                    onClick={() => downloadICS(singleEvent)}
                    className="btn btn-outline flex items-center justify-center gap-3 py-5 text-lg rounded-2xl hover:bg-white/5"
                  >
                    <AppleLogo size={28} /> APPLE / iPHONE
                  </button>
                  <button
                    onClick={() => shareEvent(singleEvent)}
                    className="btn btn-outline border-white/10 sm:col-span-2 flex items-center justify-center gap-3 py-5 text-lg rounded-2xl hover:bg-white/5"
                  >
                    <Share2 size={24} /> {t('events_share', 'Share').toUpperCase()}
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
            {/* --- HERO SECTION --- */}
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
              <h1 className="text-4xl md:text-6xl lg:text-8xl font-black mb-6 font-display uppercase tracking-tighter leading-none">
                {t('events_page_title', 'Tour Agenda')}
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
                {t('events_experience_subtitle', 'Join the tribe. From intensive workshops to international congresses.')}
              </p>
            </motion.section>

            {/* --- SEARCH & FILTERS --- */}
            <div className="mb-16">
              <div className="relative max-w-xl mx-auto group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder={t('events_filter_placeholder', 'Search city or country...')}
                  className="w-full bg-surface/50 backdrop-blur-md border border-white/10 rounded-full py-5 pl-14 pr-6 text-base focus:outline-none focus:border-primary/50 transition-all shadow-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-16">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-24 bg-white/5 rounded-2xl w-full animate-pulse border border-white/5" />
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
                  const dateObj = new Date(Number(year), Number(month) - 1);
                  const monthName = t(`events_month_${dateObj.toLocaleString('en', { month: 'short' }).toLowerCase()}`);

                  return (
                    <section key={monthKey} className="relative">
                      {/* Section Header - Sticky-ready */}
                      <div className="sticky top-24 z-20 flex items-center gap-6 mb-8 py-4 bg-background/80 backdrop-blur-sm -mx-4 px-4">
                        <h2 className="text-2xl md:text-3xl font-black font-display uppercase tracking-wider text-primary">
                          {monthName} <span className="text-white/20 ml-2">{year}</span>
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                      </div>

                      <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                          {monthEvents.map((event, idx) => {
                            const title = event.title?.rendered || (typeof event.title === 'string' ? event.title : 'Evento');
                            const date = new Date(event.date || event.datetime || new Date().toISOString());
                            const isBrazil = (event.venue?.country || '').toLowerCase().includes('brazil') || (event.venue?.country || '').toLowerCase().includes('brasil');
                            const locationStr = event.venue
                              ? `${event.venue.city}, ${isBrazil ? (event.venue.region || 'BR') : (event.venue.country || 'INTL')}`
                              : 'TBA';

                            return (
                              <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.03, duration: 0.4 }}
                                className="group relative"
                              >
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 p-6 md:p-8 bg-surface/30 hover:bg-surface/50 backdrop-blur-sm border border-white/5 rounded-2xl md:rounded-[2rem] transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5">

                                  {/* Date Column */}
                                  <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0 min-w-[100px]">
                                    <span className="text-4xl md:text-5xl font-black text-white leading-none font-display">
                                      {String(date.getDate()).padStart(2, '0')}
                                    </span>
                                    <div className="flex flex-col">
                                      <span className="text-primary font-bold uppercase text-xs tracking-[0.2em]">
                                        {date.toLocaleDateString(i18n.language, { weekday: 'short' })}
                                      </span>
                                      <span className="md:hidden text-white/40 text-xs font-bold uppercase tracking-widest">
                                        / {monthName}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Info Column */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-primary font-bold uppercase text-[10px] tracking-widest mb-1 opacity-80">
                                      <MapPin size={12} /> {locationStr}
                                    </div>
                                    <Link
                                      to={`${getLocalizedRoute('events', normalizeLanguage(i18n.language))}/${event.id}`}
                                      className="block"
                                    >
                                      <h3 className="text-xl md:text-2xl font-bold font-display uppercase tracking-tight leading-tight group-hover:text-primary transition-colors truncate" dangerouslySetInnerHTML={{ __html: sanitizeHtml(title) }} />
                                    </Link>
                                  </div>

                                  {/* Actions Column */}
                                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                                    <a
                                      href={getGoogleCalendarUrl(event)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group/btn"
                                      title="Google Calendar"
                                    >
                                      <GoogleCalendarLogo size={18} />
                                    </a>

                                    <button
                                      onClick={() => downloadICS(event)}
                                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group/btn text-white/70"
                                      title="Apple / iPhone"
                                    >
                                      <AppleLogo size={18} />
                                    </button>

                                    <button
                                      onClick={() => shareEvent(event)}
                                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group/btn"
                                      title={t('events_share', 'Share')}
                                    >
                                      <Share2 size={18} className="group-hover/btn:scale-110 transition-transform" />
                                    </button>
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

            {/* --- BOOKING CTA --- */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-40 p-12 md:p-24 text-center bg-gradient-to-br from-primary/10 via-background to-accent/10 border border-white/5 rounded-[3rem] relative overflow-hidden group shadow-3xl"
            >
              <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.03] grayscale invert group-hover:opacity-[0.05] transition-opacity" />
              <Music className="absolute -right-16 -bottom-16 text-white/5 w-96 h-96 rotate-12" />

              <div className="relative z-10 max-w-3xl mx-auto font-display">
                <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">
                  {t('home_press_title', 'Bring the Zen Experience')}
                </h2>
                <p className="text-xl text-white/60 mb-12 font-light leading-relaxed">
                  {t('events_experience_subtitle', 'Follow my agenda and workshops. Available for international bookings and intensive training.')}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    to={getLocalizedRoute('work-with-me', normalizeLanguage(i18n.language))}
                    className="btn btn-primary px-12 py-5 rounded-2xl text-lg font-bold inline-flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    {t('contact', 'Contact for Booking').toUpperCase()}
                    <ArrowRight size={20} />
                  </Link>
                  <Link
                    to={getLocalizedRoute('press-kit', normalizeLanguage(i18n.language))}
                    className="btn btn-outline border-white/10 px-12 py-5 rounded-2xl text-lg font-bold inline-flex items-center gap-3 hover:bg-white/5 transition-all"
                  >
                    {t('press_kit', 'Press Kit').toUpperCase()}
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
