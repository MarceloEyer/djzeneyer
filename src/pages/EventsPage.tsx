import React, { memo, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { useParams, Link } from 'react-router-dom';
import { normalizeLanguage, getLocalizedRoute } from '../config/routes';
import { useEventsQuery, useEventById } from '../hooks/useQueries';
import { sanitizeHtml, safeUrl } from '../utils/sanitize';
import { MapPin, Share2, ArrowLeft, Music, Calendar } from 'lucide-react';
import AddCalendarMenu from '../components/Events/AddCalendarMenu';
import { EventMedia } from '../components/Events/EventMedia';
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
          <div className="h-6 w-1/2 bg-white/5 rounded" />
          <div className="h-6 w-1/2 bg-white/5 rounded" />
        </div>
        <div className="h-32 w-full bg-white/5 rounded-2xl" />
        <div className="h-14 w-full bg-white/5 rounded-xl" />
      </div>
    </div>
  </div>
);

interface EventDetailProps {
  id: string;
  lang: string;
}

const EventDetailContent = ({ id, lang }: EventDetailProps) => {
  const { t } = useTranslation();
  const { data: e } = useEventById(id, { suspense: true });
  const [showToast, setShowToast] = useState(false);

  if (!e) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary">
          <Calendar size={40} />
        </div>
        <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">{t('events_not_found')}</h2>
        <p className="text-white/40 mb-8 max-w-md mx-auto">{t('events_not_found_desc')}</p>
        <Link to={getLocalizedRoute('events', lang)} className="btn btn-outline border-white/10 px-8 py-3 rounded-xl font-bold uppercase transition-all hover:bg-white/5 inline-flex items-center gap-2">
          <ArrowLeft size={18} /> {t('events_back')}
        </Link>
      </div>
    );
  }

  const share = () => {
    // canonical_url do detalhe já contém o origin; fallback via event_id
    const canonical = e.canonical_url ||
      `${window.location.origin}${getLocalizedRoute('events', lang)}/${e.event_id || ''}`;
    if (navigator.share) {
      navigator.share({ title: e.title, url: canonical });
    } else {
      navigator.clipboard.writeText(canonical);
      setShowToast(true);
    }
  };

  // Suporte dual: v2 usa starts_at, fallback para datetime (v1 local)
  const rawDate = e.starts_at || (e as Record<string, string>).datetime || '';
  const eventDate = new Date(rawDate);
  const isValidDate = !isNaN(eventDate.getTime());

  // Suporte dual: v2 usa location.venue, fallback para venue.name
  const loc = e.location ?? {
    venue: (e as ZenBitEventDetail & { venue?: { name: string; city: string } }).venue?.name ?? '',
    city: (e as ZenBitEventDetail & { venue?: { name: string; city: string } }).venue?.city ?? '',
    region: '',
    country: '',
  };

  return (
    <div className="max-w-4xl mx-auto">
      <HeadlessSEO
        title={`${e.title} | DJ Zen Eyer`}
        description={e.description || t('events_page_meta_desc')}
        events={[e]}
      />
      <Link to={getLocalizedRoute('events', lang)} className="flex items-center gap-2 text-primary mb-8 font-extrabold uppercase tracking-widest text-sm hover:text-white transition-colors">
        <ArrowLeft size={18} /> {t('events_back')}
      </Link>
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="relative group">
          <EventMedia
            image={e.image}
            title={e.title}
            date={rawDate}
            venue={loc.venue}
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-xs mb-6">
            <div className="w-8 h-px bg-primary/30" />
            {isValidDate ? eventDate.toLocaleDateString(lang, { month: 'long', year: 'numeric' }) : t('tba')}
          </div>

          <h1 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter text-white leading-[0.9]" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.title) }} />

          <div className="space-y-5 mb-10">
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <Calendar size={20} />
              </div>
              <span className="font-bold">
                {isValidDate ? eventDate.toLocaleDateString(lang, { day: 'numeric', month: 'long', year: 'numeric' }) : t('tba')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                <MapPin size={20} />
              </div>
              <span className="font-bold">{loc.venue}{loc.city ? `, ${loc.city}` : ''}</span>
            </div>

            <div className="prose prose-invert mb-10 text-white/60 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.description || e.content || '') }} />

            <div className="space-y-4">
              {/* Tickets button removed by user request */}
              <AddCalendarMenu event={e} variant="primary" />

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
  const { data: events = [] } = useEventsQuery({
    mode: 'upcoming',
    days: 365,
    limit: 50,
    lang,
  }, { suspense: true });

  const groupedEvents = useMemo<[string, ZenBitEventListItem[]][]>(() => {
    const groups: Record<string, ZenBitEventListItem[]> = {};
    events.forEach((e) => {
      const date = new Date(e.starts_at);
      if (isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [events]);

  const [showToast, setShowToast] = React.useState(false);

  const share = (e: ZenBitEventListItem) => {
    const canonical = e.canonical_url || `${window.location.origin}${getLocalizedRoute('events', lang)}/${e.event_id}`;
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
        events={events}
      />
      {groupedEvents.map(([key, monthEvents]: [string, ZenBitEventListItem[]]) => {
        const [y, m] = key.split('-');
        const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        const monthShort = MONTH_NAMES[Number(m) - 1];
        const name = t(`events_month_${monthShort}`);
        return (
          <section key={key}>
            <h2 className="text-2xl font-black text-primary uppercase tracking-widest mb-6 flex items-center gap-4">
              {name} <span className="text-white/10">{y}</span>
              <div className="h-px flex-1 bg-white/5" />
            </h2>
            <div className="space-y-3">
              {monthEvents.map((e) => {
                const eventDay = new Date(e.starts_at);
                // canonical_path sempre presente na v2
                const detailHref = e.canonical_path
                  ? (lang === 'pt'
                    ? `/pt/eventos${e.canonical_path.replace('/events', '')}`
                    : e.canonical_path)
                  : `${getLocalizedRoute('events', lang)}/${e.event_id}`;

                // v2: location sempre presente
                const loc = e.location;

                return (
                  <div key={e.event_id} className="flex flex-col md:flex-row md:items-center gap-4 p-6 bg-surface/30 border border-white/5 rounded-2xl hover:border-primary/20 transition-all group">
                    <div className="text-3xl font-black min-w-[50px]">{String(eventDay.getDate()).padStart(2, '0')}</div>
                    <div className="flex-1">
                      <div className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={10} /> {loc.city}{loc.country ? `, ${loc.country}` : ''}</div>
                      <Link to={detailHref}>
                        <h3 className="text-xl font-bold uppercase group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: sanitizeHtml(e.title) }} />
                      </Link>
                    </div>
                    <div className="flex gap-2">
                      <AddCalendarMenu event={e as unknown as import('../types/events').ZenBitEventDetail} variant="ghost" />
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
      })}

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
          <h1 className="text-5xl md:text-8xl font-black mb-6 uppercase tracking-tighter">{t('events_page_title')}</h1>
        </header>

        <React.Suspense fallback={<EventSkeleton />}>
          <EventListContent lang={lang} />
        </React.Suspense>

        <section className="mt-40 p-12 md:p-24 text-center bg-surface border border-white/5 rounded-[3rem] relative overflow-hidden group">
          <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
            <img
              src="/images/artist/dj-zen-eyer-club-performance.jpg"
              alt=""
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <Music className="absolute -right-16 -bottom-16 text-white/5 w-96 h-96 rotate-12 relative z-10" />
          <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">{t('home_press_title')}</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to={getLocalizedRoute('work-with-me', lang)} className="btn btn-primary px-10 py-4 rounded-xl font-bold uppercase">{t('contact')}</Link>
            <Link to={getLocalizedRoute('press-kit', lang)} className="btn btn-outline border-white/10 px-10 py-4 rounded-xl font-bold uppercase">{t('press_kit')}</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default memo(EventsPage);
