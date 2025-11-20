// src/pages/EventsPage.tsx - VERSÃO "WORLD FAMOUS" (AGENDA 2026 + FLYERS AUTOMÁTICOS)

import React, { useEffect, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; 
import { 
  Calendar as CalendarIcon, MapPin, Ticket, Music2, Star, 
  GlassWater, Heart, Percent, Plus, Globe, Download, 
  Briefcase, Lock, Plane, ArrowRight
} from 'lucide-react';

// ============================================================================
// DADOS ESTRATÉGICOS (ATUALIZADOS COM DADOS REAIS)
// ============================================================================

// Destaque para Mentoria (Já que você quer falar de aulas)
const WOO_EVENTS = [
  {
    id: 'mentoria-dj',
    title: 'Mentoria DJ Zen Eyer: Do Zero ao Palco Mundial',
    date: '2025-11-20', // Data próxima fictícia ou real
    time: 'Online',
    location: 'Zoom / Hotmart',
    type: 'Aulas de DJ',
    image: 'https://placehold.co/600x400/0D96FF/FFFFFF?text=Mentoria+DJ+Pro&font=orbitron',
    price: 'Lista de Espera',
    link: '/work-with-me', // Ou link direto para o produto
    isExternal: false,
    status: 'Vagas Limitadas'
  },
  {
    id: 'prague-2026',
    title: 'Prague Zouk Congress 2026',
    date: '2026-03-20', // Data estimada
    time: 'TBA',
    location: 'Praga, República Checa',
    type: 'Festival Internacional',
    image: 'https://placehold.co/600x400/9D4EDD/FFFFFF?text=Prague+2026&font=orbitron',
    price: 'Ingressos à Venda',
    link: 'https://praguezoukcongress.com', // Link externo real seria ideal
    isExternal: true,
    status: 'Confirmado'
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

// LISTA DE AUTORIDADE REAL (Seus palcos passados e fechados)
// A estratégia aqui é misturar grandes nomes globais com locais exóticos
const PAST_FESTIVALS = [
  { name: 'One Zouk Congress', location: 'Austrália 🇦🇺' },
  { name: 'LA Zouk Marathon', location: 'EUA 🇺🇸' },
  { name: 'Dutch Zouk', location: 'Holanda 🇳🇱' },
  { name: 'Prague Zouk Congress', location: 'Rep. Checa 🇨🇿' },
  { name: 'Zurich Zouk Congress', location: 'Suíça 🇨🇭' },
  { name: 'Rio Zouk Congress', location: 'Brasil 🇧🇷' },
  { name: 'IZC (International Zouk Congress)', location: 'Brasil 🇧🇷' },
  { name: 'Polish Zouk', location: 'Polônia 🇵🇱 (2026)' },
  { name: 'Slovenia Zouk', location: 'Eslovênia 🇸🇮 (2026)' },
];

// ============================================================================
// COMPONENTE: GALERIA DE FLYERS AUTOMÁTICA
// Este componente tenta buscar imagens da pasta /images/flyers
// ============================================================================
const FlyerGallery: React.FC = () => {
  const [flyers, setFlyers] = useState<string[]>([]);

  useEffect(() => {
    // Tenta buscar a lista do script PHP (que você vai criar)
    // Se não conseguir, usa uma lista manual de fallback ou fica vazio
    fetch('/flyers-api.php')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setFlyers(data);
      })
      .catch(() => {
        // Fallback silencioso ou lista manual se o PHP não existir ainda
        console.log('Modo manual de flyers ativo');
      });
  }, []);

  if (flyers.length === 0) return null;

  return (
    <section className="py-16 bg-black/40 border-t border-white/5">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-8 text-center text-white/80">Memórias & Flyers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {flyers.slice(0, 8).map((flyer, index) => (
             <motion.img 
               key={index}
               src={`/images/flyers/${flyer}`}
               alt={`DJ Zen Eyer Event Flyer ${index}`}
               className="rounded-lg border border-white/10 hover:scale-105 transition-transform cursor-pointer"
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
             />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================================================
// COMPONENTE: WIDGET BANDSINTOWN
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
    <div className="w-full min-h-[400px]">
      <a 
        className="bit-widget-initializer"
        data-artist-name="DJ Zen Eyer"
        data-app-id="a6f8468a12e86539eff769aec002f836"
        data-language="en"
        data-font="Arial"
        data-display-local-dates="false"
        data-display-past-dates="true"
        data-auto-style="false"
        data-text-color="#FFFFFF"
        data-link-color="#9D4EDD" 
        data-background-color="rgba(0,0,0,0)"
        data-display-limit="15"
        data-link-text-color="#FFFFFF"
        data-popup-background-color="#1a1a1a"
        data-header-background-color="rgba(0,0,0,0)"
        data-desktop-list-view="true" 
      >
        DJ Zen Eyer Tour Dates
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
        keywords="DJ Zen Eyer Agenda, Zouk Brasileiro Europa 2026, Prague Zouk Congress, Aulas de DJ Zouk, Booking DJ Internacional"
      />

      <div className="min-h-screen pt-24 pb-16 bg-background">
        
        {/* HEADER ESTRATÉGICO: ESCASSEZ + DISPONIBILIDADE */}
        <div className="bg-surface/50 py-16 border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-3xl -z-10" />
          
          <div className="container mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                {/* BADGE 1: Escassez Real */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 font-bold text-xs tracking-widest uppercase border border-red-500/20">
                  <Lock size={12} />
                  Agenda 2025: FECHADA (Sold Out)
                </div>
                {/* BADGE 2: Oportunidade Futura */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-bold text-xs tracking-widest uppercase border border-green-500/20">
                  <Plane size={12} />
                  Booking 2026: ABERTO (Europa Priority)
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black font-display mb-6 text-white">
                World Tour <span className="text-primary">&</span> Education
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Acompanhe o bicampeão mundial nos maiores palcos ou aprenda a arte da discotecagem.
              </p>
            </motion.div>
          </div>
        </div>

        {/* SEÇÃO 1: DESTAQUES (AULAS & PRÓXIMOS GRANDES) */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Star className="text-yellow-500" /> Destaques & Mentoria
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WOO_EVENTS.map(event => (
              <motion.div
                key={event.id}
                whileHover={{ y: -5 }}
                className="card group overflow-hidden border border-primary/20 hover:border-primary/50 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-background">{event.type}</span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/80 text-white border border-white/20">{event.status}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 line-clamp-1 text-white group-hover:text-primary transition-colors">{event.title}</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-white/70 text-sm"><CalendarIcon size={16} className="text-primary" /> <span>{event.date}</span></div>
                    <div className="flex items-center gap-2 text-white/70 text-sm"><MapPin size={16} className="text-secondary" /> <span>{event.location}</span></div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <a href={event.link} className="btn btn-primary btn-sm flex items-center gap-2 w-full justify-center">
                      {event.isExternal ? <Globe size={16} /> : <Ticket size={16} />}
                      {event.isExternal ? 'Site Oficial' : 'Saiba Mais'}
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* CTA Tribo */}
            <div className="card p-8 flex flex-col justify-center items-center text-center border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent">
              <h3 className="text-2xl font-black font-display mb-4 text-white">Lista de Espera 2026</h3>
              <p className="text-white/70 mb-8">Organizadores: entrem em contato agora para garantir datas na turnê europeia.</p>
              <a href="/work-with-me" className="btn btn-outline btn-lg w-full">Falar com Booking</a>
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: AGENDA GLOBAL (BANDSINTOWN) */}
        <section className="py-16 bg-surface/30 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-black font-display mb-2 text-white">Agenda Global</h2>
                <p className="text-white/60">Datas confirmadas via Bandsintown.</p>
              </div>
              <div className="flex gap-3">
                <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline flex items-center gap-2 text-sm">
                  <Plus size={16} /> Sync Agenda
                </a>
                <a href="https://djzeneyer.com/work-with-me" className="btn btn-outline border-white/20 flex items-center gap-2 text-sm hover:bg-white hover:text-black">
                  <Download size={16} /> Press Kit (EPK)
                </a>
              </div>
            </div>
            <BandsInTownWidget />
            <div className="text-center mt-8">
               <p className="text-sm text-white/40">Powered by <a href="https://www.bandsintown.com/a/15552355-dj-zen-eyer" className="hover:text-primary">Bandsintown</a></p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: FLYERS (AUTOMÁTICO) */}
        <FlyerGallery />

        {/* SEÇÃO 4: AUTORIDADE & HISTÓRICO */}
        <section className="py-20 border-t border-white/5">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-10 opacity-60">
               <Briefcase size={16} className="text-primary" />
               <span className="text-sm font-bold uppercase tracking-widest text-white">Histórico de Palcos Internacionais</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {PAST_FESTIVALS.map((festival, index) => (
                <div key={index} className="px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-primary/20 hover:border-primary/50 transition-all cursor-default group">
                  <span className="text-lg font-display font-bold text-white/70 group-hover:text-white transition-colors">
                    {festival.name}
                  </span>
                  <span className="block text-xs text-primary/70 uppercase tracking-wider mt-1">
                    {festival.location}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-12 text-white/30 text-sm max-w-md mx-auto">
              +10 anos de carreira. Presença confirmada nos maiores congressos do mundo.
            </p>
          </div>
        </section>

      </div>
    </>
  );
};

export default EventsPage;