// src/pages/EventsPage.tsx
// ============================================================================
// EVENTS PAGE - CORRIGIDA (SCHEMA.ORG OFFERS & PRICE FIX)
// ============================================================================

import type { FC } from 'react';
import { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ARTIST, getWhatsAppUrl } from '../data/artistData';
import type { Event, Testimonial, FlyerData } from '../types';
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
  Mail
} from 'lucide-react';

// ============================================================================
// DADOS ESTRATÉGICOS
// ============================================================================

const FEATURED_EVENTS: Event[] = [
  {
    id: 'mentoria-dj',
    title: 'Mentoria DJ: Musicalidade & Carreira',
    date: '2025-11-20',
    time: 'Online',
    location: 'Zoom (Ao Vivo)',
    type: 'Education',
    image: '/images/events/mentoria-dj.jpg',
    price: 'Lista de Espera', // Schema tratará isso como 0.00
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
    price: 'R$ 80,00', // Schema extrairá 80.00
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

// ============================================================================
// SCHEMA.ORG HELPER (CORREÇÃO DO GOOGLE)
// ============================================================================

/**
 * Gera o Schema.org dinâmico para os eventos, garantindo que o campo 'offers'
 * esteja presente e formatado corretamente para evitar erros no Search Console.
 */
const generateEventsSchema = () => {
  const eventItems = FEATURED_EVENTS.map((event) => {
    // 1. Limpeza do Preço (R$ 80,00 -> 80.00)
    let priceValue = "0";
    const numericMatch = event.price.match(/[\d,.]+/);
    
    if (numericMatch && !event.price.toLowerCase().includes('lista')) {
      priceValue = numericMatch[0].replace('.', '').replace(',', '.');
    }

    // 2. Determinar Disponibilidade
    const availability = event.status.toLowerCase().includes('sold out') || event.status.toLowerCase().includes('esgotado')
      ? "https://schema.org/SoldOut"
      : "https://schema.org/InStock";

    // 3. Estrutura do Evento Individual
    return {
      "@type": "Event",
      "name": event.title,
      "description": event.description,
      "startDate": `${event.date}T${event.time === 'Online' ? '00:00' : event.time}`,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": event.time === 'Online' ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
      "image": `${ARTIST.site.baseUrl}${event.image}`,
      "location": {
        "@type": event.time === 'Online' ? "VirtualLocation" : "Place",
        "name": event.location,
        "address": {
          "@type": "PostalAddress",
          "name": event.location
        },
        "url": event.time === 'Online' ? event.link : undefined
      },
      // ✅ CORREÇÃO CRÍTICA: Offers Object
      "offers": {
        "@type": "Offer",
        "url": `${ARTIST.site.baseUrl}${event.link}`,
        "price": priceValue,
        "priceCurrency": "BRL",
        "availability": availability,
        "validFrom": new Date().toISOString().split('T')[0]
      },
      "performer": {
        "@type": "Person",
        "@id": `${ARTIST.site.baseUrl}/#artist`,
        "name": ARTIST.identity.stageName
      }
    };
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${ARTIST.site.baseUrl}/events#webpage`,
        "url": `${ARTIST.site.baseUrl}/events`,
        "name": `Agenda & Tour - ${ARTIST.identity.stageName}`,
        "description": `Agenda oficial do ${ARTIST.titles.primary}. Datas da turnê, workshops e ingressos.`,
        "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
        "about": { "@id": `${ARTIST.site.baseUrl}/#artist` }
      },
      {
        "@type": "ItemList",
        "name": "Próximos Eventos de DJ Zen Eyer",
        "itemListElement": eventItems.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": item
        }))
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": ARTIST.site.baseUrl },
          { "@type": "ListItem", "position": 2, "name": "Events", "item": `${ARTIST.site.baseUrl}/events` }
        ]
      }
    ]
  };
};

// ============================================================================
// COMPONENTES AUXILIARES (MEMOIZADOS)
// ============================================================================

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
        src={event.image}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://placehold.co/600x400/0D96FF/FFFFFF?text=${encodeURIComponent(event.title)}`;
        }}
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 backdrop-blur-md text-white border border-white/10">
          {event.type}
        </span>
      </div>
      <div className="absolute bottom-4 right-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-background font-display">
          {event.status}
        </span>
      </div>
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary transition-colors">
        {event.title}
      </h3>
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
        <a
          href={event.link}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <Ticket size={16} />
          Saiba Mais
        </a>
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
        <div className="font-bold text-white group-hover:text-primary transition-colors">
          {festival.name}
        </div>
        <div className="text-xs text-white/50">
          {festival.country}
          {festival.upcoming && <span className="ml-2 text-green-400">• 2026</span>}
        </div>
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
        {testimonial.avatar ? (
          <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-lg font-bold text-primary">{testimonial.name.charAt(0)}</span>
        )}
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

  useEffect(() => {
    fetch(`${ARTIST.site.baseUrl}/wp-json/wp/v2/flyers?_embed&per_page=8`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Não foi possível carregar os flyers.');
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setFlyers(data);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Erro ao carregar flyers:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  if (flyers.length === 0) return null;

  return (
    <section className="py-20 bg-black/40 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black font-display text-white mb-2">Memórias & Flyers</h2>
          <p className="text-white/40 text-sm">Histórico visual de {ARTIST.stats.countriesPlayed} países</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flyers.map((flyer, index) => {
            const media = flyer._embedded?.['wp:featuredmedia']?.[0];
            const imageUrl = media?.media_details?.sizes?.medium_large?.source_url || media?.source_url;
            if (!imageUrl) return null;

            return (
              <motion.div
                key={flyer.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10"
              >
                <img
                  src={imageUrl}
                  alt={`${flyer.title.rendered} - ${ARTIST.identity.stageName}`}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-sm font-bold text-white">{flyer.title.rendered}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const BandsInTownWidget: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://widget.bandsintown.com/main.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full min-h-[400px] bg-surface/20 rounded-2xl border border-white/5 p-6 md:p-10">
      <a
        className="bit-widget-initializer"
        data-artist-name="DJ Zen Eyer"
        data-app-id="a6f8468a12e86539eff769aec002f836"
        data-language="en"
        data-display-local-dates="false"
        data-display-past-dates="true"
        data-auto-style="false"
        data-text-color="#FFFFFF"
        data-link-color="#9D4EDD"
        data-background-color="rgba(0,0,0,0)"
        data-display-limit="10"
        data-display-start-time="true"
        data-link-text-color="#FFFFFF"
        data-popup-background-color="#1a1a1a"
        data-header-background-color="rgba(0,0,0,0)"
        data-desktop-list-view="true"
      >
        Carregando Agenda Oficial...
      </a>
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const EventsPage: React.FC = () => {
  const { t } = useTranslation();
  const currentPath = '/events';
  const currentUrl = `${ARTIST.site.baseUrl}${currentPath}`;
  const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent('eyer.marcelo@gmail.com')}`;

  // Gera o schema atualizado com Offers
  const schemaData = generateEventsSchema();

  return (
    <>
      {/* SEO */}
      <HeadlessSEO
        title={`Agenda & Tour - ${ARTIST.identity.stageName} | ${ARTIST.titles.primary}`}
        description={`Agenda oficial de ${ARTIST.identity.stageName}. ${ARTIST.stats.eventsPlayed}+ eventos em ${ARTIST.stats.countriesPlayed} países. Booking para 2026 aberto.`}
        url={currentUrl}
        image={`${ARTIST.site.baseUrl}/images/events-og.jpg`}
        ogType="website"
        schema={schemaData}
        hrefLang={getHrefLangUrls(currentPath, ARTIST.site.baseUrl)}
        keywords={`${ARTIST.identity.stageName} Tour, Zouk Brasileiro, ${ARTIST.festivals.map((f) => f.name).join(', ')}`}
      />

      <div className="min-h-screen pt-24 pb-16 bg-background">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Badges de Status */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 font-bold text-xs tracking-wider uppercase border border-red-500/20">
                  <Lock size={12} /> 2025 Sold Out
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-bold text-xs tracking-wider uppercase border border-green-500/20">
                  <Plane size={12} /> Booking 2026 Open
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 font-bold text-xs tracking-wider uppercase border border-yellow-500/20">
                  <Trophy size={12} /> {ARTIST.titles.primary}
                </span>
              </div>

              {/* Título */}
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6 text-white">
                World Tour <span className="text-primary">&</span> Events
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-4">
                {ARTIST.stats.yearsActive} anos levando a <span className="text-primary font-semibold">{ARTIST.philosophy.style}</span> para os maiores palcos do mundo
              </p>

              {/* Estatísticas do SSOT */}
              <HeroStats />

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <a
                  href={getWhatsAppUrl("Olá! Gostaria de contratar DJ Zen Eyer para meu evento.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg flex items-center gap-2"
                >
                  <Phone size={20} />
                  Contratar para Evento
                </a>
                <a href="/work-with-me" className="btn btn-outline btn-lg flex items-center gap-2">
                  <Briefcase size={20} />
                  Press Kit & Rider
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Eventos em Destaque */}
        <section className="py-20 container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                <Star className="text-yellow-500 fill-yellow-500" size={24} />
                Eventos em Destaque
              </h2>
              <p className="text-white/50 text-sm mt-1">Experiências exclusivas com {ARTIST.identity.shortName}</p>
            </div>
            <a href="/shop" className="text-primary text-sm hover:underline flex items-center gap-1">
              Ver todos <ChevronRight size={16} />
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_EVENTS.map((event) => (
              <FeaturedEventCard key={event.id} event={event} />
            ))}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card p-8 flex flex-col justify-center items-center text-center border border-dashed border-white/20 bg-gradient-to-b from-surface/50 to-transparent"
            >
              <Sparkles size={48} className="text-primary/40 mb-6" />
              <h3 className="text-2xl font-black font-display mb-4 text-white">Seu Evento Aqui</h3>
              <p className="text-white/60 mb-6 text-sm leading-relaxed">
                Organizadores de festivais: garanta a {ARTIST.philosophy.style} no seu próximo evento.
              </p>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg w-full"
              >
                Solicitar Orçamento
              </a>
            </motion.div>
          </div>
        </section>

        {/* Agenda Global */}
        <section className="py-20 bg-surface/30 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black font-display mb-2 text-white">Agenda Global</h2>
                <p className="text-white/50 max-w-md">
                  Datas confirmadas oficialmente. Atualizado em tempo real.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a
                  href={googleCalendarLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm flex items-center gap-2"
                >
                  <Plus size={14} /> Google Calendar
                </a>
                <a href="/work-with-me" className="btn btn-outline btn-sm flex items-center gap-2">
                  <Download size={14} /> Press Kit
                </a>
              </div>
            </div>
            <BandsInTownWidget />
            <p className="text-center text-xs text-white/20 mt-6">
              Powered by{' '}
              <a
                href={ARTIST.social.bandsintown.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Bandsintown
              </a>
            </p>
          </div>
        </section>

        {/* Testemunhos */}
        <section className="py-20 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black font-display mb-4 text-white">
              O Que Dizem os Organizadores
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Feedback de quem já contratou {ARTIST.identity.shortName} para seus eventos
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {ORGANIZER_TESTIMONIALS.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </section>

        {/* Galeria de Flyers */}
        <FlyerGallery />

        {/* Histórico de Festivais */}
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe size={20} className="text-primary" />
                <span className="text-sm font-bold uppercase tracking-wider text-white/60">
                  Palcos Internacionais
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {ARTIST.festivals.map((festival, index) => (
                  <FestivalBadge key={index} festival={festival} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default EventsPage;