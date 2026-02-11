// src/pages/EventsPage.tsx
import type { FC } from 'react';
import { useEffect, useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST, getWhatsAppUrl } from '../data/artistData';
import { getHrefLangUrls } from '../utils/seo';
import type { Event, Testimonial, FlyerData } from '../types';
import { EventsList } from '../components/EventsList';
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
  Quote,
  ChevronRight,
  Sparkles,
  Phone,
  X
} from 'lucide-react';

// --- SEGURANÇA: Função para higienizar URLs (Corrige Snyk XSS Score 617) ---
const sanitizeUrl = (url: string | undefined): string => {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    // Só aceita imagens servidas via HTTP ou HTTPS (bloqueia javascript: etc)
    return ['http:', 'https:'].includes(parsed.protocol) ? url : '';
  } catch (e) {
    // Se for um caminho relativo (ex: /images/...), permite
    if (url.startsWith('/')) return url;
    return '';
  }
};

const FEATURED_EVENTS: Event[] = [
  {
    id: 'mentoria-dj',
    title: 'Mentoria DJ: Musicalidade & Carreira',
    date: '2025-11-20',
    time: 'Online',
    location: 'Zoom (Ao Vivo)',
    type: 'Education',
    image: '/images/events/mentoria-dj.jpg',
    price: 'Lista de Espera',
    link: '/work-with-me',
    isExternal: false,
    status: 'Vagas Limitadas',
    description: 'Aprenda os segredos da cremosidade diretamente com o bicampeão mundial.'
  },
  {
    id: 'zouk-experience',
    title: 'Zouk Experience Rio',
    date: '2025-12-10',
    time: '22:00',
    location: 'Rio de Janeiro, Brasil',
    type: 'Festa Exclusiva',
    image: '/images/events/zouk-experience.jpg',
    price: 'R$ 80,00',
    link: '/shop/zouk-experience-rj',
    isExternal: false,
    status: 'Últimos Ingressos',
    description: 'Uma noite de Zouk Brasileiro com sets exclusivos e a energia única do Rio.'
  }
];

const ORGANIZER_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Maria Silva',
    role: 'Organizadora',
    event: 'Rio Zouk Congress',
    country: '🇧🇷',
    quote: 'Zen Eyer entende a pista como ninguém. Seus sets cremosos mantêm os dançarinos conectados por horas.',
    avatar: ''
  },
  {
    name: 'Thomas van der Berg',
    role: 'Founder',
    event: 'Dutch Zouk',
    country: '🇳🇱',
    quote: 'Professional, punctual, and his music selection is always perfect for our European audience.',
    avatar: ''
  },
  {
    name: 'Anna Kowalska',
    role: 'Event Director',
    event: 'Prague Zouk Congress',
    country: '🇨🇿',
    quote: 'We rebook Zen every year. The energy he brings to our main party is unmatched.',
    avatar: ''
  }
];

const HeroStats = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="flex flex-wrap justify-center gap-6 md:gap-10 mt-10"
  >
    {[
      { icon: <Globe size={20} />, value: ARTIST.stats.countriesPlayed, label: 'Países' },
      { icon: <Music2 size={20} />, value: `${ARTIST.stats.eventsPlayed}+`, label: 'Eventos' },
      { icon: <Trophy size={20} />, value: ARTIST.titles.year, label: 'Bicampeão' },
      { icon: <Users size={20} />, value: ARTIST.stats.yearsActive, label: 'Anos de Carreira' }
    ].map((stat, i) => (
      <div key={i} className="text-center">
        <div className="flex items-center justify-center gap-2 text-primary mb-1">
          {stat.icon}
          <span className="text-2xl md:text-3xl font-black">{stat.value}</span>
        </div>
        <span className="text-xs text-white/50 uppercase tracking-wider">{stat.label}</span>
      </div>
    ))}
  </motion.div>
));
HeroStats.displayName = 'HeroStats';

const FeaturedEventCard = memo<{ event: Event }>(({ event }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="card group overflow-hidden border border-white/10 hover:border-primary/50 transition-all bg-surface/30"
  >
    <div className="relative h-48 overflow-hidden">
      <img
        src={sanitizeUrl(event.image)}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/600x400/0D96FF/FFFFFF?text=${encodeURIComponent(event.title)}`;
        }}
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 backdrop-blur-md text-white border border-white/10">{event.type}</span>
      </div>
      <div className="absolute bottom-4 right-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-background font-display">{event.status}</span>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">{event.title}</h3>
      <p className="text-sm text-white/60 mb-4 line-clamp-2">{event.description}</p>
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-3 text-white/60 text-sm">
          <CalendarIcon size={16} className="text-primary" />
          <span>{new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
          {event.time !== 'Online' && <span>• {event.time}</span>}
        </div>
        <div className="flex items-center gap-3 text-white/60 text-sm">
          <MapPin size={16} className="text-secondary" />
          <span>{event.location}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span className="text-lg font-bold text-primary">{event.price}</span>
        <a href={event.link} className="btn btn-primary btn-sm flex items-center gap-2"><Ticket size={16} /> Saiba Mais</a>
      </div>
    </div>
  </motion.div>
));
FeaturedEventCard.displayName = 'FeaturedEventCard';

const FestivalBadge = memo<{ festival: typeof ARTIST.festivals[0]; index: number }>(({ festival, index }) => (
  <motion.a
    href={festival.url}
    target="_blank"
    rel="noopener noreferrer"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05 }}
    whileHover={{ scale: 1.05, y: -3 }}
    className="group relative px-6 py-4 rounded-2xl border border-white/10 bg-surface/30 hover:bg-surface/60 hover:border-primary/30 transition-all"
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{festival.flag}</span>
      <div>
        <div className="font-bold text-white group-hover:text-primary transition-colors">{festival.name}</div>
        <div className="text-xs text-white/50">{festival.country}{festival.upcoming && <span className="ml-2 text-green-400">• 2026</span>}</div>
      </div>
      <ExternalLink size={14} className="ml-auto text-white/20 group-hover:text-primary/60 transition-colors" />
    </div>
  </motion.a>
));
FestivalBadge.displayName = 'FestivalBadge';

const TestimonialCard = memo<{ testimonial: Testimonial; index: number }>(({ testimonial, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="card p-6 bg-surface/50 border border-white/10 hover:border-primary/30 transition-all"
  >
    <Quote size={24} className="text-primary/30 mb-4" />
    <p className="text-white/80 italic mb-6 leading-relaxed">"{testimonial.quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
        {testimonial.avatar ? <img src={sanitizeUrl(testimonial.avatar)} alt={testimonial.name} className="w-full h-full object-cover" /> : <span className="text-lg font-bold text-primary">{testimonial.name.charAt(0)}</span>}
      </div>
      <div>
        <div className="font-bold text-white">{testimonial.name} {testimonial.country}</div>
        <div className="text-sm text-white/50">{testimonial.role}, {testimonial.event}</div>
      </div>
    </div>
  </motion.div>
));
TestimonialCard.displayName = 'TestimonialCard';

const FlyerGallery: React.FC = () => {
  const [flyers, setFlyers] = useState<FlyerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFlyer, setSelectedFlyer] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${ARTIST.site.baseUrl}/wp-json/wp/v2/flyers?_embed&per_page=8`)
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível carregar os flyers.');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFlyers(data);
        }
      })
      .catch((err) => {
        console.error('Erro ao carregar flyers:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-black/40 border-t border-white/5">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </section>
    );
  }
  
  if (error || flyers.length === 0) return null;

  return (
    <>
      <section className="py-20 bg-black/40 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black font-display text-white mb-2">Memórias & Flyers</h2>
            <p className="text-white/40 text-sm">Histórico visual de {ARTIST.stats.countriesPlayed} países</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flyers.map((flyer, index) => {
              const media = flyer._embedded?.['wp:featuredmedia']?.[0];
              const fullImageUrl = media?.source_url;
              const thumbUrl = media?.media_details?.sizes?.medium_large?.source_url || fullImageUrl;
              
              if (!thumbUrl) {
                return (
                  <div
                    key={flyer.id}
                    className="aspect-[3/4] rounded-xl bg-surface/20 border border-white/5 flex items-center justify-center"
                  >
                    <Music2 size={32} className="text-white/10" />
                  </div>
                );
              }

              return (
                <motion.div
                  key={flyer.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedFlyer(fullImageUrl || thumbUrl)}
                  className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 cursor-pointer"
                >
                  <img
                    src={sanitizeUrl(thumbUrl)}
                    alt={`${flyer.title.rendered} - ${ARTIST.identity.stageName}`}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-sm font-bold text-white line-clamp-2">{flyer.title.rendered}</span>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/50 p-1 rounded-full text-white/80"><Plus size={16} /></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedFlyer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFlyer(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={sanitizeUrl(selectedFlyer)}
                alt="Flyer Full View"
                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl border border-white/10"
              />
              <button
                onClick={() => setSelectedFlyer(null)}
                className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white transition-colors p-2"
                aria-label="Fechar visualização"
              >
                <X size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const EventsPage: React.FC = () => {
  const { t } = useTranslation();
  const currentPath = '/events';
  
  return (
    <>
      <HeadlessSEO 
        title={`Agenda & Tour - ${ARTIST.identity.stageName} | ${ARTIST.titles.primary}`}
        description={`Agenda oficial de ${ARTIST.identity.stageName}. ${ARTIST.stats.eventsPlayed}+ eventos em ${ARTIST.stats.countriesPlayed} países. Booking para 2026 aberto.`}
        url={`${ARTIST.site.baseUrl}${currentPath}`}
        image={`${ARTIST.site.baseUrl}/images/events-og.jpg`}
        hrefLang={getHrefLangUrls(currentPath, ARTIST.site.baseUrl)}
      />

      <div className="min-h-screen pt-24 pb-16 bg-background">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 font-bold text-xs tracking-wider uppercase border border-red-500/20"><Lock size={12} /> 2025 Sold Out</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-bold text-xs tracking-wider uppercase border border-green-500/20"><Plane size={12} /> Booking 2026 Open</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 font-bold text-xs tracking-wider uppercase border border-yellow-500/20"><Trophy size={12} /> {ARTIST.titles.primary}</span>
              </div>
              
              {/* O H1 já estava aqui! Com o Puppeteer rodando, o Google agora vai ver ele. */}
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6 text-white">World Tour <span className="text-primary">&</span> Events</h1>
              
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-4">{ARTIST.stats.yearsActive} anos levando a <span className="text-primary font-semibold">{ARTIST.philosophy.style}</span> para os maiores palcos do mundo</p>
              <HeroStats />
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <a href={getWhatsAppUrl("Olá! Gostaria de contratar DJ Zen Eyer para meu evento.")} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg flex items-center gap-2"><Phone size={20} /> Contratar para Evento</a>
                <a href="/work-with-me" className="btn btn-outline btn-lg flex items-center gap-2"><Briefcase size={20} /> Press Kit & Rider</a>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white"><Star className="text-yellow-500 fill-yellow-500" size={24} /> Eventos em Destaque</h2>
              <p className="text-white/50 text-sm mt-1">Experiências exclusivas com {ARTIST.identity.shortName}</p>
            </div>
            <a href="/shop" className="text-primary text-sm hover:underline flex items-center gap-1">Ver todos <ChevronRight size={16} /></a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_EVENTS.map((event) => (<FeaturedEventCard key={event.id} event={event} />))}
            <motion.div whileHover={{ scale: 1.02 }} className="card p-8 flex flex-col justify-center items-center text-center border border-dashed border-white/20 bg-gradient-to-b from-surface/50 to-transparent">
              <Sparkles size={48} className="text-primary/40 mb-6" />
              <h3 className="text-2xl font-black font-display mb-4 text-white">Seu Evento Aqui</h3>
              <p className="text-white/60 mb-6 text-sm leading-relaxed">Organizadores de festivais: garanta a {ARTIST.philosophy.style} no seu próximo evento.</p>
              <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg w-full">Solicitar Orçamento</a>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-surface/30 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black font-display mb-2 text-white">Agenda Global</h2>
                <p className="text-white/50 max-w-md">Datas confirmadas oficialmente via Bandsintown. Atualizado em tempo real.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.bandsintown.com/a/15552355" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm flex items-center gap-2"><ExternalLink size={14} /> Bandsintown</a>
                <a href="/work-with-me" className="btn btn-outline btn-sm flex items-center gap-2"><Download size={14} /> Press Kit</a>
              </div>
            </div>
            
            <EventsList limit={15} showTitle={false} variant="compact" />
          </div>
        </section>

        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black font-display mb-4 text-white">O Que Dizem os Organizadores</h2>
            <p className="text-white/50 max-w-xl mx-auto">Feedback de quem já contratou {ARTIST.identity.shortName} para seus eventos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ORGANIZER_TESTIMONIALS.map((testimonial, index) => (<TestimonialCard key={index} testimonial={testimonial} index={index} />))}
          </div>
        </section>

        <FlyerGallery />

        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4"><Globe size={20} className="text-primary" /><span className="text-sm font-bold uppercase tracking-wider text-white/60">Palcos Internacionais</span></div>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {ARTIST.festivals.map((festival, index) => (<FestivalBadge key={index} festival={festival} index={index} />))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EventsPage;
