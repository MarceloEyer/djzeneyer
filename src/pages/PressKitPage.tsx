// src/pages/PressKitPage.tsx
// ============================================================================
// PRESS KIT PAGE - VERSÃO REFATORADA (HEADLESS SEO)
// ============================================================================
// OTIMIZAÇÕES:
// ✅ HeadlessSEO implementado com hrefLang SSOT
// ✅ Constantes movidas para fora do componente
// ✅ StatCard e MediaKitCard memoizados
// ✅ Schema Person + CreativeWork otimizado
// ✅ Congruência total com Wikidata Q136551855
// ============================================================================

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import {
  Download,
  Phone,
  FileText,
  ImageIcon,
  Music2,
  Award,
  Globe,
  Users,
  Star,
  TrendingUp,
  Mail,
  Instagram,
  Calendar,
  MapPin,
  Sparkles,
  PlayCircle,
  Radio,
  Database,
  ExternalLink
} from 'lucide-react';

// ============================================================================
// CONSTANTES DE DADOS (FORA DO COMPONENTE)
// ============================================================================

/**
 * WhatsApp contact info
 */
const WHATSAPP_CONFIG = {
  number: '5521987413091',
  message: "Olá Zen Eyer! Gostaria de conversar sobre uma possível colaboração ou booking. Como podemos prosseguir?"
};

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_CONFIG.number}?text=${encodeURIComponent(WHATSAPP_CONFIG.message)}`;

/**
 * Estatísticas de carreira
 */
const STATS_DATA = [
  {
    icon: <Globe size={32} />,
    number: "11+",
    label: "Países",
    color: "bg-gradient-to-br from-blue-500 to-blue-700"
  },
  {
    icon: <Users size={32} />,
    number: "50K+",
    label: "Pessoas impactadas",
    color: "bg-gradient-to-br from-purple-500 to-purple-700"
  },
  {
    icon: <Music2 size={32} />,
    number: "500K+",
    label: "Streams globais",
    color: "bg-gradient-to-br from-pink-500 to-pink-700"
  },
  {
    icon: <Award size={32} />,
    number: "10+",
    label: "Anos de carreira",
    color: "bg-gradient-to-br from-green-500 to-green-700"
  }
];

/**
 * Itens do Media Kit para download
 */
const MEDIA_KIT_ITEMS = [
  {
    icon: <ImageIcon size={32} />,
    title: "Fotos para Imprensa",
    description: "Fotos em alta resolução (300dpi) para uso promocional",
    path: "/media/dj-zen-eyer-photos.zip"
  },
  {
    icon: <FileText size={32} />,
    title: "Biografia Completa",
    description: "Biografia detalhada, rider técnico e informações para imprensa",
    path: "/media/dj-zen-eyer-epk.pdf"
  },
  {
    icon: <Music2 size={32} />,
    title: "Logos e Branding",
    description: "Logos oficiais em PNG/SVG para uso em materiais promocionais",
    path: "/media/dj-zen-eyer-logos.zip"
  }
];

/**
 * Links relevantes (Redes Sociais e Databases)
 */
const RELEVANT_LINKS = [
  { name: "Instagram", url: "https://instagram.com/djzeneyer", icon: <Instagram size={20} /> },
  { name: "YouTube", url: "https://www.youtube.com/@djzeneyer", icon: <Radio size={20} /> },
  { name: "Spotify", url: "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw", icon: <PlayCircle size={20} /> },
  { name: "Apple Music", url: "https://music.apple.com/us/artist/zen-eyer/1439280950", icon: <PlayCircle size={20} /> },
  { name: "MusicBrainz", url: "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154", icon: <Database size={20} /> },
  { name: "Wikidata", url: "https://www.wikidata.org/wiki/Q136551855", icon: <Globe size={20} /> },
  { name: "Discogs", url: "https://www.discogs.com/artist/16872046", icon: <Database size={20} /> },
  { name: "Resident Advisor", url: "https://pt-br.ra.co/dj/djzeneyer", icon: <ExternalLink size={20} /> }
];

/**
 * Festivais em destaque
 */
const FEATURED_FESTIVALS = [
  { name: "ZoukFest Europe", location: "Amsterdam, NL", emoji: "🇳🇱" },
  { name: "Brazilian Zouk Congress", location: "Barcelona, ES", emoji: "🇪🇸" },
  { name: "Zouk Summer Fest", location: "Berlin, DE", emoji: "🇩🇪" },
  { name: "International Zouk Week", location: "Prague, CZ", emoji: "🇨🇿" },
  { name: "Festival de Zouk", location: "Lisbon, PT", emoji: "🇵🇹" },
  { name: "Zouk Connection", location: "Paris, FR", emoji: "🇫🇷" }
];

/**
 * Schema.org Person (Congruência TOTAL com Wikidata Q136551855)
 */
const PERSON_SCHEMA = {
  "@type": "Person",
  "@id": "https://djzeneyer.com/#artist",
  "name": "DJ Zen Eyer",
  "alternateName": ["Zen Eyer", "Marcelo Eyer Fernandes"],
  "jobTitle": "DJ e Produtor Musical de Zouk Brasileiro",
  "description": "DJ brasileiro bicampeão mundial de Zouk Brasileiro, membro da Mensa International e referência global no gênero. Especializado em criar sets 'cremosos' que unem técnica e emoção para dançarinos.",
  "url": "https://djzeneyer.com",
  "image": "https://djzeneyer.com/images/zen-eyer-presskit-photo.jpg",
  
  // ✅ IDENTIFIERS (Congruência Wikidata)
  "sameAs": [
    "https://www.wikidata.org/wiki/Q136551855",
    "https://musicbrainz.org/artist/13afa63c-8164-4697-9cad-c5100062a154",
    "https://isni.org/isni/0000000528931015",
    "https://instagram.com/djzeneyer",
    "https://open.spotify.com/artist/68SHKGndTlq3USQ2LZmyLw",
    "https://www.youtube.com/@djzeneyer"
  ],
  
  // ✅ AWARDS (Wikidata validated)
  "award": [
    {
      "@type": "Award",
      "name": "Bicampeão Mundial de Zouk Brasileiro - Melhor Performance",
      "datePublished": 
    },
    {
      "@type": "Award",
      "name": "Bicampeão Mundial de Zouk Brasileiro - Melhor Remix",
      "datePublished": 
    }
  ],
  
  // ✅ MEMBERSHIP
  "memberOf": {
    "@type": "Organization",
    "name": "Mensa International",
    "url": "https://www.mensa.org"
  },
  
  // ✅ PERFORMANCE HISTORY
  "performerIn": {
    "@type": "MusicEvent",
    "name": "Festivais Internacionais de Zouk Brasileiro",
    "location": {
      "@type": "Place",
      "name": "11 países (Holanda, Espanha, República Tcheca, etc.)"
    }
  }
};

/**
 * Schema.org CreativeWork (Press Kit como obra criativa)
 */
const CREATIVE_WORK_SCHEMA = {
  "@type": "CreativeWork",
  "@id": "https://djzeneyer.com/press-kit#presskit",
  "name": "DJ Zen Eyer - Press Kit Oficial",
  "description": "Kit de imprensa oficial contendo fotos, biografia, rider técnico e informações para mídia de DJ Zen Eyer, bicampeão mundial de Zouk Brasileiro.",
  "url": "https://djzeneyer.com/press-kit",
  "author": {
    "@id": "https://djzeneyer.com/#artist"
  },
  "publisher": {
    "@id": "https://djzeneyer.com/#artist"
  },
  "datePublished": "2024-01-01",
  "inLanguage": ["en", "pt-BR"]
};

/**
 * Schema.org BreadcrumbList
 */
const BREADCRUMB_SCHEMA = {
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://djzeneyer.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Press Kit",
      "item": "https://djzeneyer.com/press-kit"
    }
  ]
};

/**
 * Schema agregado
 */
const COMBINED_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [PERSON_SCHEMA, CREATIVE_WORK_SCHEMA, BREADCRUMB_SCHEMA]
};

// ============================================================================
// COMPONENTES AUXILIARES (MEMOIZADOS)
// ============================================================================

/**
 * Card de Estatística
 */
const StatCard = memo<{
  icon: React.ReactNode;
  number: string;
  label: string;
  color: string;
}>(({ icon, number, label, color }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className={`${color} p-6 rounded-2xl text-center backdrop-blur-sm border border-white/20 shadow-xl`}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="text-white inline-block p-4 bg-white/10 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="font-black text-4xl text-white mb-2">{number}</h3>
    <p className="text-white/90 font-semibold">{label}</p>
  </motion.div>
));
StatCard.displayName = 'StatCard';

/**
 * Card de Media Kit
 */
const MediaKitCard = memo<{
  icon: React.ReactNode;
  title: string;
  description: string;
  path: string;
}>(({ icon, title, description, path }) => (
  <motion.a
    href={path}
    download
    target="_blank"
    rel="noopener noreferrer"
    className="group bg-surface/50 p-8 rounded-2xl backdrop-blur-sm border border-white/10 transition-all hover:border-primary hover:bg-surface/80"
    whileHover={{ y: -8 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <div className="text-primary mx-auto mb-4 p-4 bg-primary/10 rounded-full inline-block group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
    <p className="text-white/70 mb-4">{description}</p>
    <div className="flex items-center justify-center gap-2 text-primary font-semibold">
      <Download size={20} />
      <span>Download</span>
    </div>
  </motion.a>
));
MediaKitCard.displayName = 'MediaKitCard';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const PressKitPage: React.FC = () => {
  // URLs para hrefLang (SSOT)
  const currentPath = '/press-kit';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  return (
    <>
      {/* ====================================================================== */}
      {/* HEADLESS SEO (PADRÃO SSOT CORRETO) */}
      {/* ====================================================================== */}
      <HeadlessSEO
        title="Press Kit Oficial - Zen Eyer | DJ Brasileiro de Zouk Brasileiro"
        description="Press Kit oficial de Zen Eyer, DJ brasileiro bicampeão mundial de Zouk Brasileiro. Baixe fotos, biografia e informações para imprensa."
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-eyer-presskit-cover.jpg"
        ogType="profile"
        schema={COMBINED_SCHEMA}
        hrefLang={getHrefLangUrls(currentPath, 'https://djzeneyer.com')}
        keywords="Zen Eyer, DJ Zen Eyer, Zouk Brasileiro, Brazilian Zouk, Press Kit, Biografia, Fotos para Imprensa, Booking"
      />

      {/* ====================================================================== */}
      {/* CONTEÚDO DA PÁGINA */}
      {/* ====================================================================== */}
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">
        
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16" 
              initial={{ opacity: 0, y: -30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: 0.2, duration: 0.6 }} 
                className="inline-block mb-4"
              >
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Sparkles className="inline-block mr-2" size={16} />
                  PRESS KIT OFICIAL
                </div>
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                Zen <span className="text-primary">Eyer</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                DJ brasileiro bicampeão mundial de Zouk Brasileiro
                <br />
                <span className="text-primary font-semibold">Sets cremosos, emocionais e conectados à dança</span>
              </p>
            </motion.div>
            
            {/* Stats Grid */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {STATS_DATA.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bio Section */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true, amount: 0.3 }} 
              transition={{ duration: 0.8 }} 
              className="max-w-6xl mx-auto"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div 
                  className="relative" 
                  whileHover={{ scale: 1.02 }} 
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="aspect-square rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl">
                    <img 
                      src="https://djzeneyer.com/images/zen-eyer-presskit-photo.jpg" 
                      alt="Zen Eyer - DJ Brasileiro de Zouk Brasileiro" 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                      width="600" 
                      height="600" 
                    />
                  </div>
                </motion.div>
                
                <div>
                  <h2 className="text-4xl font-black font-display mb-6 flex items-center gap-3">
                    <Music2 className="text-primary" size={36} />
                    Sobre Zen Eyer
                  </h2>
                  
                  <div className="space-y-4 text-lg text-white/80 leading-relaxed">
                    <p>
                      <strong className="text-white">Zen Eyer</strong> (Marcelo Eyer Fernandes) é um <strong>DJ brasileiro especializado em Zouk Brasileiro</strong>, bicampeão mundial no gênero (2022) e membro da Mensa International. Seu estilo único, chamado de "<strong>cremosidade</strong>", combina técnica apurada com emoção profunda, criando sets que são verdadeiras jornadas musicais para os dançarinos.
                    </p>
                    <p>
                      Com mais de 10 anos de carreira, Zen Eyer já se apresentou em <strong>100+ eventos em 11 países</strong>, incluindo Holanda, Espanha, República Tcheca e Alemanha. Seu repertório é 100% focado no Zouk Brasileiro, com influências de kizomba, lambada e black music, sempre priorizando a conexão emocional com a dança.
                    </p>
                    <p>
                      Como produtor musical, Zen Eyer cria remixes exclusivos e edições especiais para o floor de Zouk, com mais de <strong>500.000 streams globais</strong>. É criador do evento <strong>reZENha</strong> e da comunidade <strong>Tribo Zen</strong>, que oferece conteúdo exclusivo para amantes do Zouk Brasileiro.
                    </p>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {[
                      { icon: <Star className="text-primary" size={20} />, title: "Cremosidade", desc: "Sets fluidos e emocionais" },
                      { icon: <Music2 className="text-accent" size={20} />, title: "Repertório", desc: "Zouk, Kizomba, Lambada" },
                      { icon: <Users className="text-success" size={20} />, title: "Conexão", desc: "Foco na dança" },
                      { icon: <Globe className="text-purple-400" size={20} />, title: "Global", desc: "Presença internacional" }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">{item.icon}</div>
                        <div>
                          <div className="font-bold text-white">{item.title}</div>
                          <div className="text-sm text-white/60">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Media Kit Downloads */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true, amount: 0.3 }} 
              transition={{ duration: 0.8 }} 
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">Material para Imprensa</h2>
                <p className="text-xl text-white/70">Tudo que você precisa para divulgação e marketing</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {MEDIA_KIT_ITEMS.map((item, index) => (
                  <MediaKitCard key={index} {...item} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Press Photos Gallery */}
        <section className="py-20 bg-surface/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true, amount: 0.3 }} 
              transition={{ duration: 0.8 }} 
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black font-display mb-4">Fotos para Imprensa</h2>
                <p className="text-xl text-white/70">Imagens em alta resolução para uso promocional</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div 
                    key={i} 
                    className="aspect-square rounded-xl overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all cursor-pointer" 
                    whileHover={{ scale: 1.05 }}
                  >
                    <img 
                      src={`https://djzeneyer.com/images/press-photo-${i}.jpg`} 
                      alt={`Zen Eyer Press Photo ${i}`} 
                      className="w-full h-full object-cover" 
                      loading="lazy" 
                      width="400" 
                      height="400" 
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <a 
                  href="https://photos.app.goo.gl/bDdjActE3wrd6fx78" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline btn-lg inline-flex items-center gap-2"
                >
                  <ImageIcon size={20} />
                  Ver Galeria Completa
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.5 }} 
              transition={{ duration: 0.8 }} 
              className="max-w-4xl mx-auto text-center"
            >
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30">
                <h2 className="text-4xl md:text-5xl font-black font-display mb-6">
                  Vamos Criar Algo Incrível
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Pronto para elevar seu evento? Entre em contato para discutir bookings ou colaborações.
                </p>
                
                <div className="flex flex-wrap justify-center gap-4">
                  <a 
                    href={WHATSAPP_URL} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary btn-lg inline-flex items-center gap-3"
                  >
                    <Phone size={20} /> WhatsApp
                  </a>
                  <a 
                    href="mailto:booking@djzeneyer.com" 
                    className="btn btn-outline btn-lg inline-flex items-center gap-3"
                  >
                    <Mail size={20} /> Email
                  </a>
                  <a 
                    href="https://instagram.com/djzeneyer" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-outline btn-lg inline-flex items-center gap-3"
                  >
                    <Instagram size={20} /> Instagram
                  </a>
                </div>
                
                {/* Contact Details */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">Baseado em</div>
                        <div className="text-white/70">Niterói, RJ - Brasil</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">Disponibilidade</div>
                        <div className="text-white/70">Bookings internacionais</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Music2 className="text-primary mt-1" size={20} />
                      <div>
                        <div className="font-bold text-white mb-1">Gênero</div>
                        <div className="text-white/70">Zouk Brasileiro</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Official Links */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <h3 className="text-xl font-bold mb-6 text-center">Links Oficiais</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {RELEVANT_LINKS.map((link, index) => (
                      <a 
                        key={index} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-center gap-2 bg-surface/50 p-3 rounded-lg hover:bg-surface/80 transition-colors"
                      >
                        {link.icon}
                        <span>{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PressKitPage;