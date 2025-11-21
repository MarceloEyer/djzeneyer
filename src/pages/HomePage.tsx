// src/pages/HomePage.tsx - VERSÃO FINAL SEO + CREDIBILIDADE
// Otimizada para: Jornalistas, Promoters, IAs (Google, ChatGPT, Perplexity, Claude)

import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import { 
  PlayCircle, Calendar, Users, Music, Award, Trophy,
  Globe, Mic2, Download, Mail, ExternalLink, Sparkles
} from 'lucide-react';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ARTIST, getSocialUrls, getVerificationUrls, ARTIST_SCHEMA_BASE } from '../data/artistData';

// ============================================================================
// CONSTANTES
// ============================================================================

const FESTIVALS_HIGHLIGHT = [
  { name: 'Dutch Zouk Congress', country: 'Netherlands', flag: '🇳🇱' },
  { name: 'Prague Zouk Congress', country: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Sampa Zouk Congress', country: 'Brazil', flag: '🇧🇷' },
  { name: 'Zouk Jampa', country: 'Brazil', flag: '🇧🇷' },
  { name: 'Rio Zouk Congress', country: 'Brazil', flag: '🇧🇷' },
  { name: 'IZC Brazil', country: 'Brazil', flag: '🇧🇷' },
];

const STATS = [
  { value: '2×', label: 'World Champion', icon: Trophy },
  { value: '11+', label: 'Countries', icon: Globe },
  { value: '500+', label: 'Events', icon: Mic2 },
  { value: '10+', label: 'Years Active', icon: Sparkles },
];

const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ============================================================================
// SCHEMA.ORG COMPLETO (JSON-LD)
// ============================================================================

const generateHomeSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    // WebSite
    {
      "@type": "WebSite",
      "@id": `${ARTIST.site.baseUrl}/#website`,
      "url": ARTIST.site.baseUrl,
      "name": "DJ Zen Eyer - Official Website",
      "description": "Official website of DJ Zen Eyer, 2× World Champion Brazilian Zouk DJ & Producer",
      "publisher": { "@id": `${ARTIST.site.baseUrl}/#artist` },
      "inLanguage": ["en", "pt-BR"],
    },
    // Person/Artist (expandido)
    {
      ...ARTIST_SCHEMA_BASE,
      "nationality": { "@type": "Country", "name": "Brazil" },
      "birthDate": ARTIST.identity.birthDate,
      "knowsAbout": ["Brazilian Zouk", "Music Production", "DJing", "Remixing", "Kizomba"],
      "hasOccupation": [
        { "@type": "Occupation", "name": "DJ" },
        { "@type": "Occupation", "name": "Music Producer" },
        { "@type": "Occupation", "name": "Remixer" },
      ],
      "performerIn": FESTIVALS_HIGHLIGHT.map(f => ({
        "@type": "Event",
        "name": f.name,
        "location": { "@type": "Country", "name": f.country },
      })),
      "identifier": [
        { "@type": "PropertyValue", "propertyID": "MusicBrainz", "value": ARTIST.identifiers.musicbrainz },
        { "@type": "PropertyValue", "propertyID": "Wikidata", "value": ARTIST.identifiers.wikidata },
        { "@type": "PropertyValue", "propertyID": "ISNI", "value": ARTIST.identifiers.isni },
        { "@type": "PropertyValue", "propertyID": "Discogs", "value": ARTIST.identifiers.discogs },
      ],
    },
    // WebPage
    {
      "@type": "WebPage",
      "@id": `${ARTIST.site.baseUrl}/#webpage`,
      "url": ARTIST.site.baseUrl,
      "name": "DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer",
      "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
      "about": { "@id": `${ARTIST.site.baseUrl}/#artist` },
      "description": "DJ Zen Eyer - Two-time world champion in Best Remix and Best DJ Performance at the Brazilian Zouk World Championships. Book now for international events.",
      "breadcrumb": { "@id": `${ARTIST.site.baseUrl}/#breadcrumb` },
      "inLanguage": "en",
    },
    // BreadcrumbList
    {
      "@type": "BreadcrumbList",
      "@id": `${ARTIST.site.baseUrl}/#breadcrumb`,
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": ARTIST.site.baseUrl },
      ],
    },
  ],
});

// ============================================================================
// COMPONENTES
// ============================================================================

const StatCard: React.FC<{ value: string; label: string; icon: any }> = ({ value, label, icon: Icon }) => (
  <motion.div 
    className="text-center p-4" 
    variants={ITEM_VARIANTS}
    whileHover={{ scale: 1.05 }}
  >
    <Icon className="w-6 h-6 mx-auto mb-2 text-primary" aria-hidden="true" />
    <div className="text-3xl md:text-4xl font-bold text-white">{value}</div>
    <div className="text-sm text-white/70 uppercase tracking-wider">{label}</div>
  </motion.div>
);

const FestivalBadge: React.FC<{ name: string; flag: string }> = ({ name, flag }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-colors">
    <span aria-hidden="true">{flag}</span>
    <span>{name}</span>
  </span>
);

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isPortuguese = i18n.language?.startsWith('pt');
  
  const currentPath = '/';
  const currentUrl = ARTIST.site.baseUrl;

  return (
    <>
      {/* SEO + Schema */}
      <HeadlessSEO 
        title="DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer"
        description={`DJ Zen Eyer, two-time world champion (Best Remix & Best DJ Performance) at Brazilian Zouk World Championships. Creator of "${ARTIST.philosophy.slogan}". Book for international events.`}
        url={currentUrl}
        image={`${currentUrl}/images/zen-eyer-og-image.jpg`}
        isHomepage={true}
        hrefLang={getHrefLangUrls(currentPath, currentUrl)}
        schema={generateHomeSchema()}
      />

      {/* ═══════════════════════════════════════════════════════════════════
          HERO SECTION - Impacto Visual + Credibilidade Imediata
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 pb-12">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-black">
          <motion.div 
            className="w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
            style={{ backgroundImage: "url('/images/hero-background.webp')" }}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }} 
            transition={{ duration: 12, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={CONTAINER_VARIANTS}
          >
            {/* Badge de Credibilidade */}
            <motion.div variants={ITEM_VARIANTS} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium">
                <Trophy size={16} />
                <span>2× World Champion - Brazilian Zouk World Championships 2022</span>
              </span>
            </motion.div>

            {/* Nome + Título */}
            <motion.h1 
              variants={ITEM_VARIANTS}
              className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-4"
            >
              DJ Zen Eyer
            </motion.h1>

            <motion.p 
              variants={ITEM_VARIANTS}
              className="text-xl md:text-2xl text-white/90 mb-2"
            >
              {isPortuguese ? 'Bicampeão Mundial de Zouk Brasileiro' : '2× World Champion Brazilian Zouk DJ & Producer'}
            </motion.p>

            {/* Slogan */}
            <motion.p 
              variants={ITEM_VARIANTS}
              className="text-lg md:text-xl italic text-primary/90 mb-8"
            >
              "{ARTIST.philosophy.slogan}" ™
            </motion.p>

            {/* Stats Grid */}
            <motion.div 
              variants={ITEM_VARIANTS}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10"
            >
              {STATS.map(stat => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div 
              variants={ITEM_VARIANTS}
              className="flex flex-wrap gap-4 justify-center"
            >
              <a 
                href={ARTIST.social.soundcloud.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg flex items-center gap-2"
              >
                <PlayCircle size={22} />
                <span>{isPortuguese ? 'Ouvir no SoundCloud' : 'Listen on SoundCloud'}</span>
              </a>
              
              <Link to="/work-with-me" className="btn btn-outline btn-lg flex items-center gap-2">
                <Mail size={22} />
                <span>{isPortuguese ? 'Contrate / Press Kit' : 'Booking / Press Kit'}</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          BIO SECTION - SEO Rich Content
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={CONTAINER_VARIANTS}
          >
            <motion.div variants={ITEM_VARIANTS} className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl leading-relaxed">
                <strong>DJ Zen Eyer</strong> ({ARTIST.identity.fullName}) {isPortuguese 
                  ? 'é o DJ e produtor brasileiro referência mundial em Brazilian Zouk. Bicampeão mundial na maior competição internacional de DJs de Zouk — vencendo as categorias Melhor Remix e Melhor Performance DJ no Brazilian Zouk World Championships 2022 em Phoenix, Arizona —, Zen Eyer já se apresentou em mais de 11 países e nos principais congressos e festivais de Zouk do planeta.'
                  : 'is the world-renowned Brazilian DJ and producer specializing in Brazilian Zouk. Two-time world champion at the largest international Zouk DJ competition — winning Best Remix and Best DJ Performance at the Brazilian Zouk World Championships 2022 in Phoenix, Arizona —, Zen Eyer has performed in over 11 countries at major Zouk congresses and festivals worldwide.'}
              </p>
              
              <p className="text-lg leading-relaxed text-white/80">
                {isPortuguese 
                  ? `Conhecido pelo estilo lento, sensual e profundamente "cremoso", ele rejeita BPMs acelerados e defende que a verdadeira conexão na dança só acontece quando o corpo tem tempo de derreter. Seu signature drop "Zen… Zen… Zen… Zen… Eyer… Eyer… Eyer… Eyer…" já virou marca registrada nas pistas do mundo inteiro.`
                  : `Known for his slow, sensual, and deeply "creamy" style, he rejects fast BPMs and advocates that true connection in dance only happens when the body has time to melt. His signature audio tag "Zen… Zen… Zen… Zen… Eyer… Eyer… Eyer… Eyer…" has become a trademark on dance floors worldwide.`}
              </p>

              <p className="text-lg leading-relaxed text-white/80">
                {isPortuguese
                  ? 'Criador do evento reZENha e do movimento Tribo Zen, Zen Eyer não é só um DJ: é o líder ideológico da nova geração do Zouk brasileiro que prioriza conexão, presença e prazer acima de acrobacias e velocidade.'
                  : 'Creator of the reZENha event series and the Tribo Zen (Zen Tribe) movement, Zen Eyer is not just a DJ: he is the ideological leader of the new generation of Brazilian Zouk that prioritizes connection, presence, and pleasure over acrobatics and speed.'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FESTIVALS / SOCIAL PROOF
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={CONTAINER_VARIANTS}
            className="text-center"
          >
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-2">
              {isPortuguese ? 'Tocou em Festivais Internacionais' : 'Performed at International Festivals'}
            </motion.h2>
            <motion.p variants={ITEM_VARIANTS} className="text-white/60 mb-8">
              {isPortuguese ? 'Reconhecido nos principais eventos de Zouk do mundo' : 'Recognized at major Zouk events worldwide'}
            </motion.p>
            
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-3">
              {FESTIVALS_HIGHLIGHT.map(festival => (
                <FestivalBadge key={festival.name} name={festival.name} flag={festival.flag} />
              ))}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary">
                <span>+{isPortuguese ? 'muitos outros' : 'many more'}</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA BOXES - PRESS & BOOKING (Para Jornalistas e Promoters)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Press Kit Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-background border-l-4 border-primary rounded-r-lg"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Download size={20} className="text-primary" />
                {isPortuguese ? 'Para Imprensa e Mídia' : 'For Press & Media'}
              </h3>
              <p className="text-white/70 mb-4">
                {isPortuguese 
                  ? 'Press kit completo, fotos em alta resolução, releases e entrevistas disponíveis.'
                  : 'Complete press kit, high-resolution photos, releases, and interviews available.'}
              </p>
              <Link 
                to="/work-with-me" 
                className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
              >
                {isPortuguese ? 'BAIXAR PRESS KIT 2025' : 'DOWNLOAD PRESS KIT 2025'} →
              </Link>
            </motion.div>

            {/* Booking Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-background border-l-4 border-green-500 rounded-r-lg"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-green-500" />
                {isPortuguese ? 'Contratantes e Promoters' : 'Bookers & Promoters'}
              </h3>
              <p className="text-white/70 mb-4">
                {isPortuguese 
                  ? 'Disponível para congressos, festivais, workshops e noites exclusivas no Brasil e exterior.'
                  : 'Available for congresses, festivals, workshops, and exclusive events in Brazil and abroad.'}
              </p>
              <Link 
                to="/work-with-me" 
                className="inline-flex items-center gap-2 text-green-500 hover:underline font-semibold"
              >
                {isPortuguese ? 'FAZER COTAÇÃO' : 'REQUEST QUOTE'} →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          AUTHORITY LINKS (Para IAs e Crawlers)
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-white/40 mb-4">
              {isPortuguese ? 'Perfis Verificados' : 'Verified Profiles'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href={ARTIST.identifiers.musicbrainzUrl} target="_blank" rel="noopener noreferrer" 
                 className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                MusicBrainz <ExternalLink size={12} />
              </a>
              <a href={ARTIST.identifiers.wikidataUrl} target="_blank" rel="noopener noreferrer"
                 className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                Wikidata <ExternalLink size={12} />
              </a>
              <a href={ARTIST.identifiers.discogsUrl} target="_blank" rel="noopener noreferrer"
                 className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                Discogs <ExternalLink size={12} />
              </a>
              <a href={ARTIST.identifiers.residentAdvisorUrl} target="_blank" rel="noopener noreferrer"
                 className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                Resident Advisor <ExternalLink size={12} />
              </a>
              <a href={ARTIST.social.spotify.url} target="_blank" rel="noopener noreferrer"
                 className="text-white/60 hover:text-primary transition-colors flex items-center gap-1">
                Spotify <ExternalLink size={12} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          FINAL CTA - Zen Tribe
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-b from-surface to-background">
        <motion.div 
          className="container mx-auto px-4 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={CONTAINER_VARIANTS}
        >
          <motion.h2 variants={ITEM_VARIANTS} className="text-3xl md:text-5xl font-bold mb-4 font-display">
            {isPortuguese ? 'Junte-se à ' : 'Join the '}<span className="text-primary">Tribo Zen</span>
          </motion.h2>
          <motion.p variants={ITEM_VARIANTS} className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            {isPortuguese 
              ? 'Aqui não tem pressa. Só derretimento prolongado.'
              : 'No rush here. Just prolonged melting.'}
          </motion.p>
          <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
            <Link to="/zentribe" className="btn btn-primary btn-lg">
              {isPortuguese ? 'Entrar na Tribo' : 'Join the Tribe'}
            </Link>
            <Link to="/music" className="btn btn-outline btn-lg">
              {isPortuguese ? 'Explorar Músicas' : 'Explore Music'}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;