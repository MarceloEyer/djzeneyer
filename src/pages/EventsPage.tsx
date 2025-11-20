// src/pages/EventsPage.tsx - VERSÃO FINAL (COM BANDSINTOWN REAL INTEGRADO)

import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO'; 
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Ticket, 
  Music2, 
  Star, 
  GlassWater, 
  Heart, 
  Percent,
  Plus,
  Globe
} from 'lucide-react';

// ============================================================================
// DADOS ESTRATÉGICOS (MOCKUP PARA WOOCOMMERCE E AUTORIDADE)
// ============================================================================

/**
 * Eventos Próprios (WooCommerce) - Destaque Ouro (Venda Direta)
 */
const WOO_EVENTS = [
  {
    id: 'woo-1',
    title: 'Mentoria DJ Zen Eyer: Turma X',
    date: '2025-11-20',
    time: '19:00',
    location: 'Online (Zoom)',
    type: 'Mentoria',
    image: 'https://placehold.co/600x400/0D96FF/FFFFFF?text=Mentoria+DJ&font=orbitron',
    price: 'R$ 497,00',
    link: '/shop/mentoria-turma-x',
    isExternal: false
  },
  {
    id: 'woo-2',
    title: 'Zouk Experience c/ Zen Eyer',
    date: '2025-12-10',
    time: '22:00',
    location: 'Rio de Janeiro, RJ',
    type: 'Festa Exclusiva',
    image: 'https://placehold.co/600x400/9D4EDD/FFFFFF?text=Zouk+Experience&font=orbitron',
    price: 'R$ 80,00',
    link: '/shop/zouk-experience-rj',
    isExternal: false
  }
];

/**
 * Benefícios da Tribo Zen (Gamificação Real)
 */
const TRIBE_BENEFITS = [
  { 
    id: 'discount', 
    icon: <Percent size={24} />, 
    title: 'Descontos VIP', 
    desc: 'Até 50% OFF em ingressos e produtos da loja oficial.',
    color: 'text-green-400',
    bg: 'bg-green-400/10'
  },
  { 
    id: 'drink', 
    icon: <GlassWater size={24} />, 
    title: 'Welcome Drink', 
    desc: 'Um drink por conta da casa em eventos produzidos por nós.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  { 
    id: 'dance', 
    icon: <Heart size={24} />, 
    title: 'Dança Garantida', 
    desc: 'Prioridade para dançar com o artista durante o social.',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10'
  },
];

/**
 * Logos de Festivais Passados (Prova Social)
 */
const PAST_FESTIVALS = [
  { name: 'Brazilian Dance Festival', location: 'Amsterdam' },
  { name: 'Prague Zouk Congress', location: 'República Checa' },
  { name: 'Dutch Zouk', location: 'Holanda' },
  { name: 'Ilha do Zouk', location: 'Brasil' },
  { name: 'Rio Zouk Congress', location: 'Brasil' },
  { name: 'ZoukFest', location: 'Londres' },
];

// ============================================================================
// COMPONENTE: BANDSINTOWN WIDGET (AUTOMÁTICO)
// ============================================================================

const BandsInTownWidget: React.FC = () => {
  useEffect(() => {
    // Injeta o script oficial do Bandsintown
    const script = document.createElement('script');
    script.src = "https://widget.bandsintown.com/main.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  return (
    <div className="w-full min-h-[400px]">
      {/* Configuração do Widget:
         - Artist Name: "DJ Zen Eyer" (Conforme sua URL no BIT)
         - App ID: Sua API Key fornecida
         - Cores: Configuradas para Transparente/Branco para bater com seu tema
      */}
      <a 
        className="bit-widget-initializer"
        
        data-artist-name="DJ Zen Eyer"
        data-app-id="a6f8468a12e86539eff769aec002f836"
        
        data-language="en"
        data-font="Arial"
        data-display-local-dates="false"
        data-display-past-dates="true"
        data-auto-style="false"
        
        // Estilização Dark/Neon Customizada
        data-text-color="#FFFFFF"
        data-link-color="#9D4EDD" 
        data-background-color="rgba(0,0,0,0)"
        data-display-limit="15"
        data-display-start-time="true"
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
// COMPONENTE: EVENT CARD (WOOCOMMERCE)
// ============================================================================

const EventCard: React.FC<{ event: typeof WOO_EVENTS[0] }> = memo(({ event }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    className="card group overflow-hidden border border-primary/20 hover:border-primary/50 transition-all"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={event.image} 
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary text-background">
          {event.type}
        </span>
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 line-clamp-1 text-white group-hover:text-primary transition-colors">
        {event.title}
      </h3>
      
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <CalendarIcon size={16} className="text-primary" />
          <span>{new Date(event.date).toLocaleDateString('pt-BR')} • {event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70 text-sm">
          <MapPin size={16} className="text-secondary" />
          <span>{event.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <span className="text-2xl font-black text-white">{event.price}</span>
        <a 
          href={event.link}
          className="btn btn-primary btn-sm flex items-center gap-2"
        >
          <Ticket size={16} />
          Comprar
        </a>
      </div>
    </div>
  </motion.div>
));
EventCard.displayName = 'EventCard';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const EventsPage: React.FC = () => {
  const { t } = useTranslation();
  const currentUrl = 'https://djzeneyer.com/events';
  
  // Link para adicionar ao Google Calendar (Pessoal)
  const googleCalendarId = 'eyer.marcelo@gmail.com'; 
  const googleCalendarLink = `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(googleCalendarId)}`;

  return (
    <>
      <HeadlessSEO
        title="Agenda & Tickets - DJ Zen Eyer | Zouk Brasileiro e Festivais"
        description="Confira a agenda completa de DJ Zen Eyer. Ingressos para festas, workshops e mentorias, além das datas da turnê internacional de Zouk."
        url={currentUrl}
        image="https://djzeneyer.com/images/events-og.jpg"
        ogType="website"
        hrefLang={getHrefLangUrls('/events', currentUrl)}
      />

      <div className="min-h-screen pt-24 pb-16 bg-background">
        
        {/* HEADER */}
        <div className="bg-surface/50 py-16 border-b border-white/5">
          <div className="container mx-auto px-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20">
                <Music2 size={16} />
                AGENDA OFICIAL 2025
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6 text-white">
                Tour & <span className="text-primary">Experiências</span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Encontre DJ Zen Eyer nos maiores festivais do mundo ou participe de eventos exclusivos da nossa comunidade.
              </p>
            </motion.div>
          </div>
        </div>

        {/* SEÇÃO 1: DESTAQUES (WOOCOMMERCE / VENDAS) */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="text-yellow-500" /> Destaques & Ingressos
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WOO_EVENTS.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
            
            {/* Card da Tribo (Fixo) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-8 flex flex-col justify-center items-center text-center border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent"
            >
              <h3 className="text-2xl font-black font-display mb-4 text-white">Não achou sua cidade?</h3>
              <p className="text-white/70 mb-8">
                Entre na Tribo Zen para pedir eventos e ser avisado em primeira mão.
              </p>
              <a href="/zentribe" className="btn btn-outline btn-lg w-full">
                Entrar na Tribo
              </a>
            </motion.div>
          </div>
        </section>

        {/* SEÇÃO 2: AGENDA GLOBAL (BANDSINTOWN REAL) */}
        <section className="py-16 bg-surface/30 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-black font-display mb-2 text-white">Agenda Global</h2>
                <p className="text-white/60">Todas as datas confirmadas da turnê.</p>
              </div>
              
              {/* Botão de Exportar Calendário Google */}
              <a 
                href={googleCalendarLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline flex items-center gap-2 group hover:bg-white hover:text-background"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Sincronizar com Google Calendar
              </a>
            </div>

            {/* WIDGET AUTOMÁTICO DO BANDSINTOWN */}
            <div className="w-full">
              <BandsInTownWidget />
            </div>
            
            <div className="text-center mt-8">
               <p className="text-sm text-white/40">
                 Dados fornecidos oficialmente por <a href="https://www.bandsintown.com/a/15552355-dj-zen-eyer" target="_blank" className="hover:text-primary">Bandsintown</a>
               </p>
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: BENEFÍCIOS DA TRIBO (GAMIFICAÇÃO REAL) */}
        <section className="py-20 container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-3xl p-8 md:p-12 border border-white/10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black font-display mb-4">
                Vantagens de ir aos eventos com a <span className="text-primary">Tribo Zen</span>
              </h2>
              <p className="text-xl text-white/60">
                A experiência é outra quando você faz parte.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TRIBE_BENEFITS.map((benefit) => (
                <div key={benefit.id} className="bg-background/50 p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-colors">
                  <div className={`w-14 h-14 rounded-full ${benefit.bg} flex items-center justify-center mb-4 ${benefit.color}`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/60">{benefit.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <a href="/zentribe" className="btn btn-primary btn-lg px-12">
                Quero Esses Benefícios
              </a>
            </div>
          </div>
        </section>

        {/* SEÇÃO 4: PAST EVENTS (PROVA SOCIAL) */}
        <section className="py-16 border-t border-white/5">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-white/30 mb-8 flex items-center justify-center gap-2">
               <Globe size={14} /> Histórico de Palcos & Festivais
            </p>
            
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* DICA: Substitua estas divs por tags <img src="/logos/festival.png" /> 
                 para impacto visual máximo. Use logos brancos com fundo transparente.
              */}
              {PAST_FESTIVALS.map((festival, index) => (
                <div key={index} className="text-xl font-display font-bold text-white/60 hover:text-white hover:scale-105 transition-all cursor-default">
                  {festival.name}
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default EventsPage;