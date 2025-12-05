// src/pages/HomePage.tsx - VERSÃO SEO OTIMIZADA
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  PlayCircle, Calendar, Users, Music, Award, Trophy,
  Globe, Mic2, Download, Mail, ExternalLink, Sparkles
} from 'lucide-react';
import { HeadlessSEO, getHrefLangUrls } from '../components/HeadlessSEO';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { EventsList } from '../components/EventsList';

// ============================================================================
// FEATURES & STATS
// ============================================================================
const FEATURES_DATA = [
  {
    id: 'music',
    icon: <Music size={32} aria-hidden="true" />,
    titleKey: 'home_feat_exclusive_title',
    descKey: 'home_feat_exclusive_desc'
  },
  {
    id: 'achievements',
    icon: <Award size={32} aria-hidden="true" />,
    titleKey: 'home_feat_achievements_title',
    descKey: 'home_feat_achievements_desc'
  },
  {
    id: 'community',
    icon: <Users size={32} aria-hidden="true" />,
    titleKey: 'home_feat_community_title',
    descKey: 'home_feat_community_desc'
  },
];

const FESTIVALS_HIGHLIGHT = ARTIST.festivals.slice(0, 6);

const STATS = [
  { value: '2×', label: 'World Champion', icon: Trophy },
  { value: `${ARTIST.stats.countriesPlayed}+`, label: 'Countries', icon: Globe },
  { value: `${ARTIST.stats.yearsActive}+`, label: 'Years Active', icon: Sparkles },
];

// ============================================================================
// ANIMATIONS
// ============================================================================
const CONTAINER_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ============================================================================
// SCHEMA.ORG ENRIQUECIDO
// ============================================================================
const generateHomeSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${ARTIST.site.baseUrl}/#website`,
      "url": ARTIST.site.baseUrl,
      "name": "DJ Zen Eyer - Official Website",
      "description": "Official website of DJ Zen Eyer, two-time World Champion Brazilian Zouk DJ and music producer",
      "publisher": { "@id": `${ARTIST.site.baseUrl}/#artist` },
      "inLanguage": ["en", "pt-BR"],
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${ARTIST.site.baseUrl}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      ...ARTIST_SCHEMA_BASE,
      "nationality": { "@type": "Country", "name": "Brazil" },
      "birthPlace": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Rio de Janeiro",
          "addressCountry": "BR"
        }
      },
      "homeLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Niterói",
          "addressRegion": "RJ",
          "addressCountry": "BR"
        }
      },
      "birthDate": ARTIST.identity.birthDate,
      "knowsAbout": [
        "Brazilian Zouk",
        "Music Production",
        "DJing",
        "Remixing",
        "Kizomba",
        "Electronic Music",
        "Dance Music",
        "Live Performance"
      ],
      "hasOccupation": [
        {
          "@type": "Occupation",
          "name": "DJ",
          "occupationLocation": { "@type": "Country", "name": "International" }
        },
        {
          "@type": "Occupation",
          "name": "Music Producer",
          "occupationLocation": { "@type": "Country", "name": "International" }
        },
        {
          "@type": "Occupation",
          "name": "Remixer",
          "occupationLocation": { "@type": "Country", "name": "International" }
        }
      ],
      "performerIn": FESTIVALS_HIGHLIGHT.map(f => ({
        "@type": "MusicEvent",
        "name": f.name,
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": f.country
          }
        }
      })),
      "genre": ["Brazilian Zouk", "Electronic Dance Music", "Kizomba", "World Music"],
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ListenAction",
          "userInteractionCount": ARTIST.stats.streamsTotal !== 'N/A' ? ARTIST.stats.streamsTotal : undefined
        }
      ]
    },
    {
      "@type": "WebPage",
      "@id": `${ARTIST.site.baseUrl}/#webpage`,
      "url": ARTIST.site.baseUrl,
      "name": "DJ Zen Eyer | Brazilian Zouk Music Producer & DJ - International Artist",
      "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
      "about": { "@id": `${ARTIST.site.baseUrl}/#artist` },
      "description": "Official site of DJ Zen Eyer, two-time World Champion Brazilian Zouk DJ. Exclusive remixes, international tour dates, and the Zen Tribe community.",
      "breadcrumb": { "@id": `${ARTIST.site.baseUrl}/#breadcrumb` },
      "inLanguage": "en",
      "potentialAction": [
        {
          "@type": "ListenAction",
          "target": ARTIST.social.soundcloud.url
        },
        {
          "@type": "ReserveAction",
          "target": `${ARTIST.site.baseUrl}/work-with-me`
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${ARTIST.site.baseUrl}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": ARTIST.site.baseUrl
        }
      ]
    }
  ]
});

// ============================================================================
// COMPONENTS
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

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; variants: any; }> = ({ icon, title, description, variants }) => (
  <motion.div className="card p-8 text-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" variants={variants}>
    <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.div>
);

const FestivalBadge: React.FC<{ name: string; flag: string; url?: string }> = ({ name, flag, url }) => {
  const content = (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-colors">
      <span aria-hidden="true">{flag}</span>
      <span>{name}</span>
    </span>
  );

  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer" className="inline-block">
      {content}
    </a>
  ) : content;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isPortuguese = i18n.language?.startsWith('pt');
  
  const currentPath = '/';
  const currentUrl = ARTIST.site.baseUrl;

  // SEO KEYWORDS OTIMIZADOS
  const seoKeywords = isPortuguese
    ? "DJ Zen Eyer, Brazilian Zouk DJ, DJ de Zouk Brasileiro, Music Producer Zouk, Remixes Zouk, Zouk Festival DJ, Bicampeão Mundial Zouk, Cremosidade, Zouk Internacional, Zouk Sets, DJ Rio de Janeiro"
    : "DJ Zen Eyer, Brazilian Zouk DJ, Zouk Music Producer, Brazilian Zouk Remixes, Zouk Festival DJ, World Champion Zouk DJ, Cremosidade, International Zouk DJ, Zouk Sets, Rio de Janeiro DJ, Zouk Dance Music";

  return (
    <>
      <HeadlessSEO
        title="DJ Zen Eyer | Brazilian Zouk Music Producer & DJ - International Artist"
        description="Official site of DJ Zen Eyer, two-time World Champion Brazilian Zouk DJ. Exclusive remixes, international tour dates, and the Zen Tribe community. Book now for festivals worldwide."
        url={currentUrl}
        image={`${currentUrl}/images/zen-eyer-og-image.jpg`}
        keywords={seoKeywords}
        isHomepage={true}
        hrefLang={getHrefLangUrls(currentPath, currentUrl)}
        schema={generateHomeSchema()}
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 pb-12">
        <div className="absolute inset-0 z-0 bg-black">
          <motion.img
            src="/images/hero-background.webp"
            alt="DJ Zen Eyer performing live at international Brazilian Zouk festival"
            className="w-full h-full object-cover object-center opacity-40"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
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
            <motion.div variants={ITEM_VARIANTS} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium">
                <Trophy size={16} aria-hidden="true" />
                <span>2× World Champion - Brazilian Zouk World Championships</span>
              </span>
            </motion.div>

            <motion.h1 variants={ITEM_VARIANTS} className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-4">
              DJ Zen Eyer
            </motion.h1>

            <motion.p variants={ITEM_VARIANTS} className="text-xl md:text-2xl text-white/90 mb-2">
              {isPortuguese 
                ? 'Bicampeão Mundial de Zouk Brasileiro | Producer & Remixer Internacional' 
                : 'Two-Time World Champion Brazilian Zouk DJ | International Producer & Remixer'}
            </motion.p>

            <motion.p variants={ITEM_VARIANTS} className="text-lg md:text-xl italic text-primary/90 mb-8">
              "{ARTIST.philosophy.slogan}" ™
            </motion.p>

            <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {STATS.map(stat => <StatCard key={stat.label} {...stat} />)}
            </motion.div>

            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap gap-4 justify-center mb-6">
              <a 
                href={ARTIST.social.soundcloud.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary btn-lg flex items-center gap-2"
                aria-label="Listen to DJ Zen Eyer exclusive Brazilian Zouk remixes on SoundCloud"
              >
                <PlayCircle size={22} aria-hidden="true" />
                <span>{isPortuguese ? 'Ouvir no SoundCloud' : 'Listen on SoundCloud'}</span>
              </a>
              <Link 
                to="/work-with-me" 
                className="btn btn-outline btn-lg flex items-center gap-2"
                aria-label="Book DJ Zen Eyer for festivals and events - Download press kit"
              >
                <Mail size={22} aria-hidden="true" />
                <span>{isPortuguese ? 'Contrate / Press Kit' : 'Booking / Press Kit'}</span>
              </Link>
            </motion.div>

            <motion.p
              variants={ITEM_VARIANTS}
              className="text-sm md:text-base text-white/60 max-w-2xl mx-auto"
            >
              {isPortuguese
                ? 'SoundCloud: sets completos, remixes exclusivos de Brazilian Zouk e produções originais. Events: agenda mundial de festivais. Work With Me: booking profissional e press kit.'
                : 'SoundCloud: full Brazilian Zouk sets, exclusive remixes, and original productions. Events: worldwide festival schedule. Work With Me: professional booking and press kit.'}
            </motion.p>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2" 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          aria-hidden="true"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* BIO SECTION - CONTEÚDO RICO EM ENTIDADES */}
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
              <h2 className="text-3xl font-bold mb-6 text-white">
                {isPortuguese ? 'Quem é DJ Zen Eyer?' : 'Who is DJ Zen Eyer?'}
              </h2>
              
              <p className="text-xl leading-relaxed mb-6">
                <strong>DJ Zen Eyer</strong> (Marcelo Eyer Fernandes) é o atual bicampeão mundial de Brazilian Zouk DJ, conquistando os títulos de <strong>Best Remix</strong> e <strong>Best DJ Performance</strong> no <a href="https://alexdecarvalho.com.br/ilhadozouk/dj-championship/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Brazilian Zouk World Championships 2022</a> em <strong>Ilha Grande, Rio de Janeiro</strong>. Com mais de <strong>{ARTIST.stats.yearsActive} anos de carreira ativa</strong> desde 2015, já se apresentou em <strong>mais de {ARTIST.stats.countriesPlayed} países</strong> nos principais festivais e congressos internacionais de Zouk.
              </p>

              <p className="text-lg leading-relaxed text-white/80 mb-6">
                Natural do <strong>Rio de Janeiro</strong> e atualmente baseado em <strong>Niterói, RJ</strong>, Zen é reconhecido internacionalmente por seu estilo único de <strong>cremosidade</strong>—uma abordagem musical que prioriza transições longas, fluidas e emocionalmente densas, mantendo baixo BPM para permitir conexão profunda na dança. Seu drop assinatura <em>"Zen... Zen... Zen... Zen... Eyer... Eyer... Eyer... Eyer..."</em> tornou-se marca registrada em pistas de dança ao redor do mundo.
              </p>

              <p className="text-lg leading-relaxed text-white/80 mb-6">
                Membro da <a href={ARTIST.mensa.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"><strong>Mensa International</strong></a> (sociedade de alto QI, top 2% mundial), Zen combina inteligência analítica com sensibilidade artística para criar experiências sonoras imersivas. Diferente de DJs generalistas, Zen é exclusivamente focado em <strong>eventos autorais, festivais internacionais e congressos especializados</strong> de Brazilian Zouk onde o público busca experiências de dança profundas e transformadoras.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-white">
                {isPortuguese ? 'Turnê Mundial e Festivais Principais' : 'World Tour & Major Festivals'}
              </h3>
              
              <p className="text-lg leading-relaxed text-white/80 mb-4">
                DJ Zen Eyer já se apresentou nos principais congressos e festivais de Brazilian Zouk do mundo, incluindo:
              </p>

              <ul className="list-disc list-inside text-white/80 space-y-2 mb-6">
                {ARTIST.festivals.map(festival => (
                  <li key={festival.name}>
                    <a 
                      href={festival.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline"
                    >
                      <strong>{festival.name}</strong>
                    </a> - {festival.country} {festival.flag}
                    {festival.upcoming && <span className="text-accent ml-2">(Upcoming)</span>}
                  </li>
                ))}
              </ul>

              <p className="text-lg leading-relaxed text-white/80">
                Na aba <Link to="/music" className="text-primary hover:underline font-semibold">Music</Link>, você encontra remixes oficiais, versões estendidas e produções originais de Brazilian Zouk. <Link to="/events" className="text-primary hover:underline font-semibold">Events</Link> lista os próximos festivais e congressos pelo mundo. Para promotores profissionais buscando um artista exclusivo de Zouk com fã-base global, <Link to="/work-with-me" className="text-primary hover:underline font-semibold">Work With Me</Link> oferece booking, rider técnico e press kit completo.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section className="py-16 bg-background border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={CONTAINER_VARIANTS}
          >
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-3">
              {isPortuguese ? 'Próximos Shows' : 'Upcoming Shows'}
            </motion.h2>
            <motion.p variants={ITEM_VARIANTS} className="text-white/70 mb-6">
              {isPortuguese
                ? 'Agenda oficial de festivais e congressos internacionais de Brazilian Zouk'
                : 'Official schedule of international Brazilian Zouk festivals and congresses'}
            </motion.p>
            <motion.div variants={ITEM_VARIANTS} className="mb-8">
              <EventsList limit={3} showTitle={false} variant="compact" />
            </motion.div>
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
              <Link to="/events" className="btn btn-primary btn-lg flex items-center gap-2">
                <Calendar size={20} aria-hidden="true" />
                <span>{isPortuguese ? 'Ver agenda completa' : 'View full schedule'}</span>
              </Link>
              <a
                href={ARTIST.social.bandsintown?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-lg flex items-center gap-2"
              >
                <ExternalLink size={18} aria-hidden="true" />
                <span>{isPortuguese ? 'Seguir no Bandsintown' : 'Follow on Bandsintown'}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={CONTAINER_VARIANTS}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {FEATURES_DATA.map(feature => (
              <FeatureCard
                key={feature.id}
                icon={feature.icon}
                title={t(feature.titleKey as any)}
                description={t(feature.descKey as any)}
                variants={ITEM_VARIANTS}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FESTIVALS / SOCIAL PROOF */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={CONTAINER_VARIANTS}
            className="text-center"
          >
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-2">
              {isPortuguese ? 'Festivais Internacionais' : 'International Festivals'}
            </motion.h2>
            <motion.p variants={ITEM_VARIANTS} className="text-white/60 mb-8">
              {isPortuguese 
                ? 'Reconhecido nos principais eventos de Brazilian Zouk do mundo' 
                : 'Recognized at major Brazilian Zouk events worldwide'}
            </motion.p>
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-3">
              {FESTIVALS_HIGHLIGHT.map(festival => (
                <FestivalBadge 
                  key={festival.name} 
                  name={festival.name} 
                  flag={festival.flag}
                  url={festival.url}
                />
              ))}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary">
                <span>+{isPortuguese ? 'muitos outros' : 'many more'}</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PRESS & BOOKING */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-surface border-l-4 border-primary rounded-r-lg"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Download size={20} className="text-primary" aria-hidden="true" />
                {isPortuguese ? 'Para Imprensa e Mídia' : 'For Press & Media'}
              </h3>
              <p className="text-white/70 mb-4">
                {isPortuguese
                  ? 'Press kit completo 2025: biografia oficial, fotos em alta resolução, releases, entrevistas e material promocional.'
                  : 'Complete 2025 press kit: official biography, high-resolution photos, releases, interviews, and promotional materials.'}
              </p>
              <Link to="/work-with-me" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                {isPortuguese ? 'BAIXAR PRESS KIT 2025' : 'DOWNLOAD PRESS KIT 2025'} →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-surface border-l-4 border-green-500 rounded-r-lg"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-green-500" aria-hidden="true" />
                {isPortuguese ? 'Contratantes e Promoters' : 'Bookers & Promoters'}
              </h3>
              <p className="text-white/70 mb-4">
                {isPortuguese
                  ? 'Disponível para congressos internacionais, festivais, workshops e eventos exclusivos de Brazilian Zouk.'
                  : 'Available for international congresses, festivals, workshops, and exclusive Brazilian Zouk events.'}
              </p>
              <Link to="/work-with-me" className="inline-flex items-center gap-2 text-green-500 hover:underline font-semibold">
                {isPortuguese ? 'FAZER COTAÇÃO' : 'REQUEST QUOTE'} →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AUTHORITY LINKS */}
      <section className="py-12 bg-background border-t border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-sm text-white/40 mb-4">
              {isPortuguese ? 'Perfis Verificados e Bases de Dados' : 'Verified Profiles & Music Databases'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href={ARTIST.identifiers.musicbrainzUrl}
                target="_blank