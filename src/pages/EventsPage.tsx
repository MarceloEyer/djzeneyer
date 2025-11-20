// src/pages/EventsPage.tsx
// ============================================================================
// EVENTS PAGE - VERSÃO "WORLD CLASS AUTHORITY"
// Foco: Design Limpo, Links Reais de Autoridade, SEO para IAs
// ============================================================================

import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; 
import { 
  Calendar as CalendarIcon, MapPin, Ticket, Music2, Star, 
  GlassWater, Heart, Percent, Plus, Globe, Download, 
  Briefcase, Lock, Plane, ExternalLink
} from 'lucide-react';

// ============================================================================
// DADOS ESTRATÉGICOS (EVENTOS PRÓPRIOS)
// ============================================================================

const WOO_EVENTS = [
  {
    id: 'mentoria-dj',
    title: 'Mentoria DJ Zen Eyer: Musicalidade & Carreira',
    date: '2025-11-20',
    time: 'Online',
    location: 'Zoom (Ao Vivo)',
    type: 'Education',
    image: 'https://placehold.co/600x400/0D96FF/FFFFFF?text=Mentoria+DJ+Pro&font=orbitron',
    price: 'Lista de Espera',
    link: '/work-with-me', 
    isExternal: false,
    status: 'Vagas Limitadas'
  },
  {
    id: 'zouk-experience',
    title: 'Zouk Experience Rio c/ Zen Eyer',
    date: '2025-12-10',
    time: '22:00',
    location: 'Rio de Janeiro, Brasil',
    type: 'Festa Exclusiva',
    image: 'https://placehold.co/600x400/9D4EDD/FFFFFF?text=Zouk+Experience&font=orbitron',
    price: 'R$ 80,00',
    link: '/shop/zouk-experience-rj',
    isExternal: false,
    status: 'Últimos Ingressos'
  }
];

const TRIBE_BENEFITS = [
  { 
    id: 'discount', icon: <Percent size={24} />, title: 'Descontos VIP', 
    desc: 'Até 50% OFF na loja e eventos parceiros.', color: 'text-green-400', bg: 'bg-green-400/10'
  },
  { 
    id: 'drink', icon: <GlassWater size={24} />, title: 'Welcome Drink', 
    desc: 'Drink cortesia em eventos da Tribo Zen.', color: 'text-blue-400', bg: 'bg-blue-400/10'
  },
  { 
    id: 'dance', icon: <Heart size={24} />, title: 'Dança Garantida', 
    desc: 'Prioridade para dançar com o Zen nos sociais.', color: 'text-pink-400', bg: 'bg-pink-400/10'
  },
];

// ============================================================================
// LISTA DE AUTORIDADE (FESTIVAIS REAIS COM LINKS REAIS)
// Isso gera backlinks de qualidade e prova social verificável.
// ============================================================================
const PAST_FESTIVALS = [
  { 
    name: 'One Zouk Congress', 
    location: 'Austrália 🇦🇺', 
    url: 'https://www.onezoukcongress.com/',
    logo: '/images/logos/onezouk.png' 
  },
  { 
    name: 'Dutch Zouk', 
    location: 'Holanda 🇳🇱', 
    url: 'https://www.dutchzouk.nl/',
    logo: '/images/logos/dutchzouk.png' 
  },
  { 
    name: 'Prague Zouk Congress', 
    location: 'Rep. Checa 🇨🇿', 
    url: 'https://www.praguezoukcongress.com/',
    logo: '/images/logos/prague.png' 
  },
  { 
    name: 'LA Zouk Marathon', 
    location: 'EUA 🇺🇸', 
    url: 'https://www.lazoukmarathon.com/',
    logo: '/images/logos/lazouk.png' 
  },
  { 
    name: 'Zurich Zouk Congress', 
    location: 'Suíça 🇨🇭', 
    url: 'https://www.zurichzoukcongress.com/', // (Ou link histórico relevante)
    logo: '/images/logos/zurich.png' 
  },
  { 
    name: 'Rio Zouk Congress', 
    location: 'Brasil 🇧🇷', 
    url: 'https://www.riozoukcongress.com/',
    logo: '/images/logos/rzc.png' 
  },
  { 
    name: 'IZC (Intl Zouk Congress)', 
    location: 'Brasil 🇧🇷', 
    url: 'https://www.instagram.com/izcbrazil/',
    logo: '/images/logos/izc.png' 
  },
  { 
    name: 'Polish Zouk Festival', 
    location: 'Polônia 🇵🇱 (2026)', 
    url: 'https://www.polishzoukfestival.pl/', // Previsão
    logo: '/images/logos/polish.png' 
  }
];

// ============================================================================
// COMPONENTE: GALERIA DE FLYERS AUTOMÁTICA
// ============================================================================
const FlyerGallery: React.FC = () => {
  const [flyers, setFlyers] = useState<string[]>([]);

  useEffect(() => {
    // Busca a lista do script PHP na raiz
    fetch('/flyers-api.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setFlyers(data);
      })
      .catch(() => {
        // Falha silenciosa (não mostra nada se der erro, mantendo o design limpo)
      });
  }, []);

  if (flyers.length === 0) return null;

  return (
    <section className="py-20 bg-black/40 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-black font-display text-white">Memórias & Flyers</h3>
          <p className="text-white/40 text-sm mt-2">Histórico visual dos últimos eventos</p>
        </div>
        
        {/* Grid Masonry Simples e Elegante */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {flyers.slice(0, 8).map((flyer, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.1 }}
               className="group relative rounded-xl overflow-hidden border border-white/10 aspect-[3/4]"
             >
               <img 
                 src={`/images/flyers/${flyer}`}
                 alt={`DJ Zen Eyer Event Flyer ${index}`}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                 <span className="text-xs font-bold text-white uppercase tracking-wider">Ver Flyer</span>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENTE: WIDGET BANDSINTOWN (INTEGRADO & LIMPO)
// ============================================================================
const BandsInTownWidget: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://widget.bandsintown.com/main.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); }
  }, []);

  return (
    <div className="w-full min-h-[400px] bg-surface/20 rounded-2xl border border-white/5 p-6 md:p-10">
      <a 
        className="bit-widget-initializer"
        data-artist-name="DJ Zen Eyer"
        data-app-id="a6f8468a12e86539eff769aec002f836" // API KEY REAL
        data-language="en"
        data-font="Arial"
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
  const currentUrl = 'https://djzeneyer.com/events';
  const googleCalendarId = 'eyer.marcelo@gmail.com'; 
  const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(googleCalendarId)}`;

  return (
    <>
      <HeadlessSEO
        title="Agenda & Tour - DJ Zen Eyer | Zouk Brasileiro World Tour"
        description="Agenda oficial do bicampeão mundial DJ Zen Eyer. Datas da turnê Europa 2026, workshops de DJ e ingressos para festivais internacionais."
        url={currentUrl}
        image="https://djzeneyer.com/images/events-og.jpg"
        ogType="website"
        hrefLang={getHrefLangUrls('/events', currentUrl)}
        keywords="DJ Zen Eyer Tour, Zouk Brasileiro Europa 2026, Dutch Zouk, Prague Zouk Congress, Aulas de DJ, Booking Internacional"
      />

      <div className="min-h-screen pt-24 pb-16 bg-background">
        
        {/* HEADER: AUTORIDADE & ESCASSEZ */}
        <div className="bg-surface/50 py-20 border-b border-white/5 relative overflow-hidden">
          {/* Background Glow Sutil */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[100px] -z-10" />
          
          <div className="container mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 font-bold text-[10px] tracking-[0.2em] uppercase border border-red-500/20">
                  <Lock size={10} /> 2025 Sold Out
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 font-bold text-[10px] tracking-[0.2em] uppercase border border-green-500/20">
                  <Plane size={10} /> Booking 2026 Open (Europe Focus)
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black font-display mb-6 text-white leading-tight">
                World Tour <span className="text-primary">&</span><br/>Education
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light">
                Acompanhe a jornada do bicampeão mundial pelos maiores palcos do planeta ou aprenda a arte da discotecagem.
              </p>
            </motion.div>
          </div>
        </div>

        {/* SEÇÃO 1: DESTAQUES (VENDA DE PRODUTOS PRÓPRIOS) */}
        <section className="py-20 container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <Star className="text-yellow-500 fill-yellow-500" size={20} /> 
              <span className="tracking-wide">DESTAQUES & MENTORIA</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WOO_EVENTS.map(event => (
              <motion.div
                key={event.id}
                whileHover={{ y: -5 }}
                className="card group overflow-hidden border border-white/10 hover:border-primary/50 transition-all bg-surface/30"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 text-white group-hover:text-primary transition-colors h-14">
                    {event.title}
                  </h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <CalendarIcon size={16} className="text-primary" /> 
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <MapPin size={16} className="text-secondary" /> 
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <a 
                      href={event.link} 
                      className="btn btn-primary btn-sm w-full flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                    >
                      {event.isExternal ? <Globe size={16} /> : <Ticket size={16} />}
                      {event.isExternal ? 'Site Oficial' : 'Saiba Mais'}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Card CTA "Lista de Espera" - Foco em Contratantes */}
            <div className="card p-8 flex flex-col justify-center items-center text-center border border-white/10 bg-gradient-to-b from-surface to-background">
              <Briefcase size={48} className="text-white/20 mb-6" />
              <h3 className="text-2xl font-black font-display mb-4 text-white">Contratantes 2026</h3>
              <p className="text-white/60 mb-8 text-sm leading-relaxed">
                Organizadores de festivais na Europa: entrem em contato agora para garantir datas na próxima turnê internacional.
              </p>
              <a href="/work-with-me" className="btn btn-outline btn-lg w-full hover:bg-white hover:text-black transition-colors">
                Falar com Booking
              </a>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: AGENDA GLOBAL (BANDSINTOWN INTEGRADO) */}
        <section className="py-20 bg-black/20 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black font-display mb-2 text-white">Agenda Global</h2>
                <p className="text-white/50 max-w-md">
                  Todas as datas confirmadas oficialmente. Sincronizado em tempo real via Bandsintown.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Plus size={14} /> Google Calendar
                </a>
                <a href="/work-with-me" className="btn btn-outline btn-sm border-white/10 text-white/60 hover:text-white hover:border-white/30 flex items-center gap-2 text-xs uppercase tracking-wider">
                  <Download size={14} /> Press Kit
                </a>
              </div>
            </div>

            <BandsInTownWidget />
            
            <div className="text-center mt-8">
               <p className="text-xs text-white/20 uppercase tracking-widest">
                 Powered by <a href="https://www.bandsintown.com/a/15552355-dj-zen-eyer" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Bandsintown</a>
               </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: FLYERS (AUTOMÁTICO) */}
        <FlyerGallery />

        {/* SEÇÃO 4: AUTORIDADE & HISTÓRICO (LINKS REAIS) */}
        <section className="py-24 border-t border-white/5 bg-gradient-to-b from-background to-surface/20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-12 opacity-60">
               <Globe size={16} className="text-primary" />
               <span className="text-sm font-bold uppercase tracking-[0.2em] text-white">Histórico de Palcos Internacionais</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {PAST_FESTIVALS.map((festival, index) => (
                <a 
                  key={index}
                  href={festival.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative px-8 py-4 rounded-full border border-white/5 bg-white/[0.02] hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer overflow-hidden"
                  title={`Visitar site oficial do ${festival.name}`}
                >
                  {/* Efeito de Hover Glow */}
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    {/* Se tiver logo, exibe. Se não, fallback elegante em texto. */}
                    <span className="text-lg font-display font-bold text-white/70 group-hover:text-white transition-colors">
                      {festival.name}
                    </span>
                    <span className="text-[10px] text-primary/60 uppercase tracking-widest mt-1 group-hover:text-primary transition-colors">
                      {festival.location}
                    </span>
                  </div>
                  
                  {/* Ícone de Link Externo sutil */}
                  <ExternalLink size={12} className="absolute top-2 right-3 text-white/10 group-hover:text-white/40 opacity-0 group-hover:opacity-100 transition-all" />
                </a>
              ))}
            </div>
            
            <p className="mt-16 text-white/30 text-sm max-w-md mx-auto leading-relaxed">
              Zen Eyer é presença confirmada e recorrente nos maiores congressos de Zouk do mundo. 
              <br/><span className="text-white/20">+10 anos de carreira profissional.</span>
            </p>
          </div>
        </section>

      </div>
    </>
  );
};

export default EventsPage;