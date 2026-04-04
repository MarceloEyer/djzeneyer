import React, { memo, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link, generatePath } from 'react-router-dom';
import { normalizeLanguage, getLocalizedRoute, type Language } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import { sanitizeHtml } from '../utils/sanitize';
import { ARTIST } from '../data/artistData';
import { MapPin, Share2, ArrowLeft, Music, Calendar } from 'lucide-react';
import AddCalendarMenu from '../components/Events/AddCalendarMenu';
import { getDateTimeFormatter } from '../utils/date';
import { Toast } from '../components/common/Toast';
import type { ZenBitEventListItem, ZenBitEventDetail } from '../types/events';

// ============================================================================
// SUB-COMPONENTS (SUSPENSE READY)
// ============================================================================

const EventSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 bg-surface/50 border border-white/5 rounded-2xl animate-pulse flex items-center gap-6 px-6">
        <div className="w-12 h-12 bg-white/5 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-3 bg-white/5 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const EventDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
    <div className="h-10 w-32 bg-white/5 rounded-lg mb-8" />
    <div className="grid md:grid-cols-2 gap-8">
      <div className="rounded-3xl aspect-[4/5] bg-white/5 border border-white/10" />
      <div className="space-y-6">
        <div className="h-12 w-3/4 bg-white/5 rounded-xl" />
        <div className="space-y-3">
          <div className="h-4 bg-white/5 rounded w-1/2" />
          <div className="h-4 bg-white/5 rounded w-1/3" />
        </div>
      </div>
    </div>
  </div>
);

const EventDetailContent = ({ id, lang }: { id: string; lang: string }) => {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : ARTIST.site.baseUrl;
  const { data: event } = useEventById(id, lang as Language);
  const [showToast, setShowToast] = useState(false);

  if (!event) return <div className="text-center py-20 text-white/40">{t('events_not_found')}</div>;

  const eventDate = new Date(event.starts_at);
  const isValidDate = !isNaN(eventDate.getTime());
  const loc = event.location;

  const share = () => {
    const canonical = event.canonical_url || `${window.location.origin}${getLocalizedRoute('events', lang as Language)}/${event.event_id}`;
    if (navigator.share) {
      navigator.share({ title: event.title, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
      setShowToast(true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <HeadlessSEO
        title={event.title}
        description={event.description?.substring(0, 160) || ''}
        url={`${origin}${getLocalizedRoute('events', lang as Language)}/${id}`}
        image={event.image || undefined}
        events={[event]}
      />

      <Link
        to={getLocalizedRoute('events', lang as Language)}
        className="inline-flex items-center gap-2 text-white/60 hover:text-primary mb-12 transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> {t('common.back_to_list', { defaultValue: 'Back to list' })}
      </Link>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Event Poster/Image */}
        <div className="lg:col-span-5 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
          <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            {event.image ? (
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface flex items-center justify-center text-white/10">
                <Music size={80} />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
              <div className="inline-block px-4 py-1 rounded-full bg-primary text-black font-black text-[10px] uppercase tracking-tighter mb-4 shadow-lg shadow-primary/20">
                {t('events.featured', { defaultValue: 'Featured Event' })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-7 bg-surface/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
            <Music size={120} className="rotate-12" />
          </div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 leading-[0.9] tracking-tighter uppercase whitespace-pre-line" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.title) }} />

            <div className="flex items-center gap-4 text-white/80 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <Calendar size={20} />
              </div>
              <span className="font-bold">
                {isValidDate ? getDateTimeFormatter(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(eventDate) : t('tba')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <span className="font-bold">{loc.venue}{loc.city ? `, ${loc.city}` : ''}</span>
            </div>

            <div className="prose prose-invert mt-10 mb-10 text-white/60 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.description || '') }} />

            <div className="space-y-4">
              <AddCalendarMenu event={event} variant="primary" />

              <button onClick={share} className="btn btn-outline border-white/10 w-full py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-white/5 transition-all text-white/50 hover:text-white font-bold uppercase tracking-widest text-xs">
                <Share2 size={18} /> {t('share')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message={t('link_copied')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

const EventListContent = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const origin = typeof window !== 'undefined' ? window.location.origin : ARTIST.site.baseUrl;
  const { data: events = [] } = useEventsQuery({
    mode: 'upcoming',
    days: 365,
    limit: 50,
    lang: lang as Language,
  });

  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);

  // Extrai regiões únicas (Estados)
  const regions = useMemo(() => {
    const r = new Set<string>();
    events.forEach((e: ZenBitEventListItem) => {
      if (e.location?.region) r.add(e.location.region);
    });
    return Array.from(r).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (selectedRegion === 'all') return events;
    return events.filter((e: ZenBitEventListItem) => e.location?.region === selectedRegion);
  }, [events, selectedRegion]);

  const groupedEvents = useMemo<[string, ZenBitEventListItem[]][]>(() => {
    const groups: Record<string, ZenBitEventListItem[]> = {};
    filteredEvents.forEach((e: ZenBitEventListItem) => {
      const date = new Date(e.starts_at);
      if (isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredEvents]);


  const share = (e: ZenBitEventListItem) => {
    const canonical = e.canonical_url || `${window.location.origin}${getLocalizedRoute('events', lang as Language)}/${e.event_id}`;
    if (navigator.share) {
      navigator.share({ title: e.title, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
      setShowToast(true);
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5 animate-in fade-in duration-500">
        <p className="text-white/40">{t('events_no_results')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <HeadlessSEO
        title={t('events_page_title')}
        description={t('events_page_meta_desc')}
        url={`${origin}${getLocalizedRoute('events', lang as Language)}`}
        events={events as any}
      />
      {/* Filter Bar */}
      {regions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${selectedRegion === 'all' ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}
          >
            {t('common.all')}
          </button>
          {regions.map((region: string) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${selectedRegion === region ? 'bg-primary text-black border-primary shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40 border-white/10 hover:border-white/20'}`}
            >
              {region}
            </button>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-surface/30 rounded-3xl border border-white/5">
          <p className="text-white/40">{t('events_no_results_filter')}</p>
        </div>
      ) : (
        groupedEvents.map(([key, monthEvents]: [string, ZenBitEventListItem[]]) => {
          const [y, m] = key.split('-');
          const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
          const monthShort = MONTH_NAMES[Number(m) - 1];
          const name = t(`events_month_${monthShort}` as any);
          return (
            <section key={key}>
              <h2 className="text-2xl font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-4">
                {name} <span className="text-white/60 drop-shadow-sm">{y}</span>
                <div className="h-px flex-1 bg-white/5" />
              </h2>
              <div className="space-y-3">
                {monthEvents.map((e) => {
                  const eventDay = new Date(e.starts_at);
                  const identifier = e.canonical_path
                    ? e.canonical_path.split('/').pop() || e.event_id
                    : e.event_id;

                  const detailHref = generatePath(getLocalizedRoute('events-detail', lang as Language), { id: identifier });
                  const loc = e.location;

                  return (
                    <div key={e.event_id} className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-surface/30 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group">
                      <div className="text-3xl font-black min-w-[50px]">{String(eventDay.getDate()).padStart(2, '0')}</div>
                      <div className="flex-1">
                        <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} /> {loc.city}{loc.region ? `, ${loc.region}` : ''}{loc.country ? ` (${loc.country})` : ''}</div>
                        <Link to={detailHref}>
                          <h3 className="text-xl font-bold uppercase group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.title) }} />
                        </Link>
                      </div>
                      <div className="flex gap-2">
                        <AddCalendarMenu event={e as unknown as ZenBitEventDetail} variant="ghost" />
                        <button onClick={() => share(e)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary/20 transition-all">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}

      <Toast
        message={t('link_copied')}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

// ============================================================================
// MAIN PAGE
// ============================================================================

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { t, i18n } = useTranslation();
  const lang = normalizeLanguage(i18n.language);

  if (id) {
    return (
      <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4">
        <React.Suspense fallback={<EventDetailSkeleton />}>
          <EventDetailContent id={id} lang={lang} />
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-16 px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 font-display uppercase text-white tracking-tighter">
            {t('events.title_part1')} <span className="text-primary">{t('events.title_part2')}</span>
          </h1>
        </header>

        <React.Suspense fallback={<EventSkeleton />}>
          <EventListContent lang={lang} />
        </React.Suspense>

        <section className="mt-16 p-6 md:p-10 text-center bg-surface border border-white/5 rounded-3xl relative overflow-hidden group max-w-4xl mx-auto">
          <Music className="absolute -right-8 -bottom-8 text-white/5 w-48 h-48 rotate-12 z-10" />
          <h2 className="text-2xl md:text-3xl font-black mb-4 uppercase tracking-tighter relative z-20">{t('home.press_title')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-20">
            <Link to={getLocalizedRoute('booking', lang as Language)} className="btn btn-primary px-10 py-3 rounded-xl font-bold uppercase text-sm">{t('contact')}</Link>
            <Link to={getLocalizedRoute('presskit', lang as Language)} className="btn btn-outline border-white/10 px-10 py-3 rounded-xl font-bold text-sm">Press Kit</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default memo(EventsPage);
