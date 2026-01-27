// src/pages/EventsPage.tsx
// VERSÃO FINAL: SEGURA (XSS FIX) + SEO OTIMIZADO + HREF SANITIZE + i18n Routes + Dynamic Content

import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getHreflangUrls } from '../utils/seo';
import { ARTIST, getWhatsAppUrl } from '../data/artistData';
import { Event, Testimonial, FlyerData } from '../types';
import { EventsList } from '../components/EventsList';
import { useParams, Link } from 'react-router-dom';
import { buildFullPath, ROUTES_CONFIG, getLocalizedPaths, normalizeLanguage } from '../config/routes';
import {
  Calendar as CalendarIcon,
  MapPin,
  Ticket,
  Star,
  Plus,
  Globe,
  Download,
  Briefcase,
  Lock,
  Plane,
  ExternalLink,
  Trophy,
  Users,
  Music2,
  ArrowRight,
  ArrowLeft,
  Info
} from 'lucide-react';

const EventsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [singleEvent, setSingleEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper para rotas localizadas
  const getRouteForKey = (key: string): string => {
    const route = ROUTES_CONFIG.find(r => getLocalizedPaths(r, 'en')[0] === key);
    if (!route) return `/${key}`;
    const normalizedLanguage = normalizeLanguage(i18n.language);
    return buildFullPath(getLocalizedPaths(route, normalizedLanguage)[0], normalizedLanguage);
  };

  useEffect(() => {
    const abortController = new AbortController();
    setLoading(true);

<<<<<<< HEAD
    const fetchEvents = async () => {
      try {
        const response = await fetch(`https://djzeneyer.com/wp-json/wp/v2/events${id ? `/${id}` : ''}?_embed`, {
          signal: abortController.signal
        });
        const data = await response.json();

        if (id) {
          setSingleEvent(data);
        } else {
          setEvents(data);
        }
        setLoading(false);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Failed to fetch events:', err);
          setLoading(false);
        }
      }
    };
=======
    const wpData = (window as any).wpData || {};
    const restUrl = (wpData.restUrl || `${ARTIST.site.baseUrl}/wp-json`).replace(/\/$/, '');
    const endpoint = `${restUrl}/wp/v2/flyers?per_page=8`;
>>>>>>> d52c9d9 (⚡ Bolt: Remove _embed from REST API calls)

    fetchEvents();
    return () => abortController.abort();
  }, [id]);

  // --- RENDERIZAÇÃO DE EVENTO ÚNICO ---
  if (!loading && id && singleEvent) {
    return (
      <>
        <HeadlessSEO
          title={`${singleEvent.title?.rendered || 'Evento'} | Zen Events`}
          description={singleEvent.excerpt?.rendered || ""}
          url={`https://djzeneyer.com/events/${id}`}
        />
        <div className="min-h-screen bg-background text-white pt-24 pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <Link to={getRouteForKey('events')} className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors mb-10 font-bold">
              <ArrowLeft size={20} /> {t('events_back_to_list', 'Voltar para Eventos')}
            </Link>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={singleEvent._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero-background.webp'}
                    className="w-full aspect-[4/5] object-cover"
                    alt={singleEvent.title?.rendered}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="bg-primary/10 border border-primary/20 self-start px-4 py-1.5 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6">
                  {t('events_status_upcoming', 'Próximo Evento')}
                </div>

                <h1 className="text-4xl md:text-5xl font-black font-display mb-6" dangerouslySetInnerHTML={{ __html: singleEvent.title?.rendered || "" }} />

                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-4 text-white/80">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-tighter">Data</p>
                      <p className="font-bold">{new Date(singleEvent.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-white/80">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase font-bold tracking-tighter">Local</p>
                      <p className="font-bold">São Paulo, Brasil</p>
                    </div>
                  </div>
                </div>

                <div
                  className="prose prose-invert max-w-none mb-10 text-white/70"
                  dangerouslySetInnerHTML={{ __html: singleEvent.content?.rendered || "" }}
                />

                <div className="mt-auto flex flex-col sm:flex-row gap-4">
                  <a href="#" className="btn btn-primary flex-1 flex items-center justify-center gap-2 py-4 text-lg">
                    <Ticket size={22} /> GARANTIR INGRESSO
                  </a>
                  <Link to={getRouteForKey('shop')} className="btn btn-outline flex-1 flex items-center justify-center gap-2 py-4 text-lg">
                    <Plus size={22} /> {t('footer_shop', 'Shop')}
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
        title="Zen Events | Zouk Brasileiro Worldwide"
        description="Confira a agenda de eventos, workshops e congressos com DJ Zen Eyer."
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
              ZEN <span className="text-primary italic">EXPERIENCE</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-white/60 font-medium"
            >
              Acompanhe minha agenda mundial. De workshops intensivos a congressos internacionais.
            </motion.p>
          </div>

<<<<<<< HEAD
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                  <CalendarIcon className="text-primary" /> {t('events_upcoming', 'Próximos Eventos')}
                </h2>
                <span className="text-white/40 text-sm font-mono">{events.length} EVENTOS ENCONTRADOS</span>
              </div>
=======
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flyers.map((flyer, index) => {
              const fullImageUrl = flyer.featured_image_src_full;
              const thumbUrl = flyer.featured_image_src || fullImageUrl;
>>>>>>> d52c9d9 (⚡ Bolt: Remove _embed from REST API calls)

              {loading ? (
                <div className="space-y-6 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-48 bg-white/5 rounded-3xl w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {events.map((event, index) => (
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
                            src={event._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/images/hero-background.webp'}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            alt={event.title?.rendered}
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-4 text-primary text-xs font-bold uppercase mb-3">
                              <span className="flex items-center gap-1.5"><CalendarIcon size={14} /> {new Date(event.date).toLocaleDateString()}</span>
                              <span className="flex items-center gap-1.5"><MapPin size={14} /> São Paulo, SP</span>
                            </div>
                            <h3 className="text-2xl md:text-3xl font-black font-display mb-4 group-hover:text-primary transition-colors" dangerouslySetInnerHTML={{ __html: event.title?.rendered || "" }} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Link to={`${getRouteForKey('events')}/${event.id}`} className="text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all">
                              DETALHES DO EVENTO <ArrowRight size={16} />
                            </Link>
                            <a href="#" className="btn btn-primary px-6 py-2 rounded-full text-xs font-bold">
                              TICKETS
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            <aside className="lg:col-span-4 space-y-12">
              <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8">
                <h3 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="text-primary" /> {t('footer_work_with_me', 'Work With Me')}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  Interessado em levar a experiência Zen Eyer para o seu evento? Solicite um orçamento para bookings internacionais.
                </p>
                <Link to={getRouteForKey('work-with-me')} className="w-full btn btn-primary flex items-center justify-center gap-2 py-3">
                  CONTATO <Send size={16} />
                </Link>
              </div>

              <div className="border border-white/10 rounded-3xl p-8">
                <h3 className="text-xl font-display font-bold mb-6">{t('events_categories', 'Categorias')}</h3>
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

export default memo(EventsPage);
