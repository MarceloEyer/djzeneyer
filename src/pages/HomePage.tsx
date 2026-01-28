// src/pages/HomePage.tsx
// VERSÃO FINAL: DIAMOND MASTER (Integrated with Zen SEO Plugin v8.0.0)

import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  PlayCircle, Calendar, Users, Music, Award, Trophy,
  Globe, Mail, ExternalLink, Sparkles, Download
} from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getHrefLangUrls } from '../utils/seo';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { EventsList } from '../components/EventsList';

// ============================================================================
// 1. INTERFACES (Type Safety)
// ============================================================================

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variants: Variants;
}

interface FestivalBadgeProps {
  name: string;
  flag: string;
}

// Interface para as configurações vindas do Plugin WP
interface ZenGlobalSettings {
  real_name?: string;
  default_og_image?: string;
  [key: string]: any;
}

// ============================================================================
// 2. DADOS E CONSTANTES
// ============================================================================

const FEATURES_DATA = [
  { id: 'music', icon: <Music size={32} />, titleKey: 'home_feat_exclusive_title', descKey: 'home_feat_exclusive_desc' },
  { id: 'achievements', icon: <Award size={32} />, titleKey: 'home_feat_achievements_title', descKey: 'home_feat_achievements_desc' },
  { id: 'community', icon: <Users size={32} />, titleKey: 'home_feat_community_title', descKey: 'home_feat_community_desc' },
];

const FESTIVALS_HIGHLIGHT = ARTIST.festivals.slice(0, 6);

const STATS = [
  { value: '2×', label: 'World Champion', icon: Trophy },
  { value: `${ARTIST.stats.countriesPlayed}+`, label: 'Countries', icon: Globe },
  { value: `${ARTIST.stats.yearsActive}+`, label: 'Years Active', icon: Sparkles },
];

const CONTAINER_VARIANTS: Variants = { 
  hidden: { opacity: 0 }, 
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } 
};

const ITEM_VARIANTS: Variants = { 
  hidden: { y: 20, opacity: 0 }, 
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } } 
};

// ============================================================================
// 3. SUB-COMPONENTES MEMOIZADOS
// ============================================================================

const StatCard = React.memo(({ value, label, icon: Icon }: StatCardProps) => (
  <motion.div className="text-center p-4" variants={ITEM_VARIANTS} whileHover={{ scale: 1.05 }}>
    <Icon className="w-6 h-6 mx-auto mb-2 text-primary" aria-hidden="true" />
    <div className="text-3xl md:text-4xl font-bold text-white font-display">{value}</div>
    <div className="text-sm text-white/70 uppercase tracking-wider">{label}</div>
  </motion.div>
));

const FeatureCard = React.memo(({ icon, title, description, variants }: FeatureCardProps) => (
  <motion.article className="card p-8 text-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" variants={variants}>
    <div className="text-primary inline-block p-4 bg-primary/10 rounded-full mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.article>
));

const FestivalBadge = React.memo(({ name, flag }: FestivalBadgeProps) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-white/80 hover:bg-white/10 transition-colors cursor-default">
    <span role="img" aria-label={`Flag of ${name}`}>{flag}</span>
    <span>{name}</span>
  </span>
));

// ============================================================================
// 4. PAGE COMPONENT
// ============================================================================

const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [seoSettings, setSeoSettings] = useState<ZenGlobalSettings | null>(null);
  
  const isPortuguese = i18n.language?.startsWith('pt');
  const currentPath = '/';
  const currentUrl = ARTIST.site.baseUrl;

  // --- FETCH PLUGIN SETTINGS (Integration) ---
  useEffect(() => {
    // Tenta pegar a URL da API do ambiente ou usa fallback
    const wpRestUrl = (window as any).wpData?.restUrl || 'https://djzeneyer.com/wp-json';
    
    fetch(`${wpRestUrl}/zen-seo/v1/settings`)
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setSeoSettings(response.data);
        }
      })
      .catch(err => console.error('Zen SEO Plugin not reachable:', err));
  }, []);

  // --- SCHEMA STATIC DATA (Rich Snippets) ---
  const schemaData = useMemo(() => ({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${ARTIST.site.baseUrl}/#website`,
        "url": ARTIST.site.baseUrl,
        "name": seoSettings?.real_name || "DJ Zen Eyer - Official Website",
        "description": "Official website of DJ Zen Eyer, 2× World Champion Brazilian Zouk DJ & Producer",
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
        "@id": `${ARTIST.site.baseUrl}/#artist`,
        "name": seoSettings?.real_name || "DJ Zen Eyer",
        "nationality": { "@type": "Country", "name": "Brazil" },
        "birthDate": ARTIST.identity.birthDate,
        "jobTitle": "DJ & Music Producer",
        "knowsAbout": ["Brazilian Zouk", "Music Production", "DJing", "Remixing", "Kizomba"],
        "homeLocation": {
          "@type": "Place",
          "address": { "@type": "PostalAddress", "addressLocality": "São Paulo", "addressRegion": "SP", "addressCountry": "BR" }
        },
        "award": [
          { "@type": "Award", "name": "Best Remix", "description": "Brazilian Zouk World Championships", "dateAwarded": "2022" },
          { "@type": "Award", "name": "Best DJ Performance", "description": "Brazilian Zouk World Championships", "dateAwarded": "2022" }
        ],
        "hasOccupation": [
          { 
            "@type": "Occupation", 
            "name": "DJ", 
            "skills": "Audio Mixing, Playlist Curation, Live Performance", 
            "occupationalCategory": "27-2099.00" 
          },
          { 
            "@type": "Occupation", 
            "name": "Music Producer", 
            "skills": "Audio Engineering, Remixing, Mastering" 
          },
        ],
        "performerIn": FESTIVALS_HIGHLIGHT.map(f => ({
          "@type": "MusicEvent",
          "name": f.name,
          "startDate": f.date,
          "location": { 
            "@type": "Place", 
            "name": f.country,
            "address": { 
               "@type": "PostalAddress", 
               "addressCountry": f.country 
            } 
          },
          "eventStatus": "https://schema.org/EventScheduled",
          "performer": { "@id": `${ARTIST.site.baseUrl}/#artist` }
        })),
      },
      {
        "@type": "WebPage",
        "@id": `${ARTIST.site.baseUrl}/#webpage`,
        "url": ARTIST.site.baseUrl,
        "name": "DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer",
        "description": "Two-time world champion DJ specializing in Brazilian Zouk. Book for international festivals and exclusive events.",
        "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": seoSettings?.default_og_image || `${ARTIST.site.baseUrl}/images/hero-background.webp`,
          "width": 1920,
          "height": 1080
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": ARTIST.site.baseUrl }]
        }
      }
    ],
  }), [isPortuguese, currentUrl, seoSettings]);

  return (
    <>
      <HeadlessSEO
        // Tenta usar dados do Plugin WP, fallback para strings hardcoded
        title={seoSettings?.real_name 
          ? `${seoSettings.real_name} | 2× World Champion` 
          : "DJ Zen Eyer | 2× World Champion Brazilian Zouk DJ & Producer"}
        
        description={`DJ Zen Eyer, two-time world champion. Creator of "${ARTIST.philosophy.slogan}".`}
        
        url={currentUrl}
        
        // Imagem vinda do painel WP ou fallback local
        image={seoSettings?.default_og_image || `${currentUrl}/images/zen-eyer-og-image.svg`}
        
        isHomepage={true}
        schema={schemaData}
        keywords="DJ Zen Eyer, Brazilian Zouk DJ, Zouk Brasileiro, world champion DJ, Brazilian Zouk music, dance festival DJ, Zouk producer"
        
        // CORREÇÃO: Removido o bloco 'preload' para evitar duplicidade de carregamento
      />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-20 pb-12" aria-label="Introduction">
        <div className="absolute inset-0 z-0 bg-black">
          <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 12, ease: "linear" }} className="w-full h-full">
            <picture>
              <source media="(max-width: 768px)" srcSet="/images/hero-background-mobile.webp" />
              <source media="(min-width: 769px)" srcSet="/images/hero-background.webp" />
              <img
                src="/images/hero-background.webp"
                alt="DJ Zen Eyer performing a live Brazilian Zouk set with immersive lighting at an international festival"
                className="w-full h-full object-cover object-center opacity-40"
                width="1920"
                height="1080"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div className="max-w-4xl mx-auto" initial="hidden" animate="visible" variants={CONTAINER_VARIANTS}>
            <motion.div variants={ITEM_VARIANTS} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full text-primary text-sm font-medium backdrop-blur-sm">
                <Trophy size={16} />
                <span className="font-semibold">2× World Champion - Zouk World Championships</span>
              </div>
            </motion.div>

            <motion.h1 variants={ITEM_VARIANTS} className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-4 tracking-tight">
              DJ Zen Eyer
            </motion.h1>

            <motion.p variants={ITEM_VARIANTS} className="text-xl md:text-2xl text-white/90 mb-2 font-light">
              {isPortuguese ? 'Bicampeão Mundial de Zouk Brasileiro' : '2× World Champion Brazilian Zouk DJ & Producer'}
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
                className="btn btn-primary btn-lg flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                aria-label="Listen to DJ Zen Eyer on SoundCloud"
              >
                <PlayCircle size={22} />
                <span>{isPortuguese ? 'Ouvir no SoundCloud' : 'Listen on SoundCloud'}</span>
              </a>
              <Link
                to={isPortuguese ? '/pt/contrate' : '/work-with-me'}
                className="btn btn-outline btn-lg flex items-center gap-2 backdrop-blur-sm"
                aria-label="Book DJ Zen Eyer or Get Press Kit"
              >
                <Mail size={22} />
                <span>{isPortuguese ? 'Contrate / Press Kit' : 'Booking / Press Kit'}</span>
              </Link>
            </motion.div>

            <motion.p variants={ITEM_VARIANTS} className="text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
              {isPortuguese
                ? 'Sets completos e remixes exclusivos. Para agenda, vá para Events. Para bookings, acesse Work With Me.'
                : 'Full sets and exclusive remixes. Check Events for schedule. Head to Work With Me for bookings.'}
            </motion.p>
          </motion.div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} aria-hidden="true">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* BIO SECTION */}
      <section className="py-20 bg-surface" id="about">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-4xl mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={CONTAINER_VARIANTS}>
            <motion.article variants={ITEM_VARIANTS} className="prose prose-invert prose-lg max-w-none">
              <h2 className="text-3xl font-bold mb-6 text-white font-display">{t('home_bio_title')}</h2>
              <div className="text-xl leading-relaxed mb-6 text-white/90">
                <p dangerouslySetInnerHTML={{ __html: t('home_bio_intro') }} />
              </div>
              <p className="text-lg leading-relaxed text-white/80 mb-6" dangerouslySetInnerHTML={{ __html: t('home_bio_style') }} />
              <p className="text-lg leading-relaxed text-white/80" dangerouslySetInnerHTML={{ __html: t('home_bio_mensa') }} />
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="py-16 bg-background border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={CONTAINER_VARIANTS}>
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-3 font-display">
              {isPortuguese ? 'Próximos Shows' : 'Upcoming Shows'}
            </motion.h2>
            
            <motion.div variants={ITEM_VARIANTS} className="mb-8">
              <EventsList limit={3} showTitle={false} variant="compact" />
            </motion.div>

            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
              <Link to="/events/" className="btn btn-primary btn-lg flex items-center gap-2">
                <Calendar size={20} />
                <span>{isPortuguese ? 'Agenda completa' : 'Full schedule'}</span>
              </Link>
              <a href={ARTIST.social.bandsintown?.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg flex items-center gap-2" aria-label="Follow DJ Zen Eyer on Bandsintown">
                <ExternalLink size={18} />
                <span>Bandsintown</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto" variants={CONTAINER_VARIANTS} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
            {FEATURES_DATA.map(feature => (
              <FeatureCard key={feature.id} icon={feature.icon} title={t(feature.titleKey as any)} description={t(feature.descKey as any)} variants={ITEM_VARIANTS} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FESTIVALS / SOCIAL PROOF */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={CONTAINER_VARIANTS} className="text-center">
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-2 font-display">
              {isPortuguese ? 'Presença Internacional' : 'International Presence'}
            </motion.h2>
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-3 mt-8">
              {FESTIVALS_HIGHLIGHT.map(festival => (<FestivalBadge key={festival.name} name={festival.name} flag={festival.flag} />))}
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
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-8 bg-surface border-l-4 border-primary rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-display">
                <Download size={20} className="text-primary" /> {isPortuguese ? 'Imprensa & Mídia' : 'Press & Media'}
              </h3>
              <p className="text-white/70 mb-4 text-sm">{isPortuguese ? 'Acesse fotos, bio e assets.' : 'Access photos, bio and assets.'}</p>
              <Link to={isPortuguese ? '/pt/contrate' : '/work-with-me'} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors">
                {isPortuguese ? 'BAIXAR PRESS KIT' : 'DOWNLOAD PRESS KIT'} →
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-8 bg-surface border-l-4 border-green-500 rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-display">
                <Calendar size={20} className="text-green-500" /> {isPortuguese ? 'Contratantes' : 'Bookers'}
              </h3>
              <p className="text-white/70 mb-4 text-sm">{isPortuguese ? 'Leve o "Zen Experience" para o seu evento.' : 'Bring the "Zen Experience" to your event.'}</p>
              <Link to={isPortuguese ? '/pt/contrate' : '/work-with-me'} className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-semibold transition-colors">
                {isPortuguese ? 'ORÇAMENTO' : 'REQUEST BOOKING'} →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AUTHORITY LINKS */}
      <section className="py-12 bg-background border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
             <p className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-widest">{isPortuguese ? 'Perfis Verificados' : 'Verified Profiles'}</p>
             <div className="flex flex-wrap justify-center gap-6 text-sm">
               <a href={`https://musicbrainz.org/artist/${ARTIST.identifiers.musicbrainz}`} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-primary transition-colors flex items-center gap-1">MusicBrainz <ExternalLink size={10} /></a>
               <a href={`https://www.wikidata.org/wiki/${ARTIST.identifiers.wikidata}`} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-primary transition-colors flex items-center gap-1">Wikidata <ExternalLink size={10} /></a>
               <a href={ARTIST.social.spotify.url} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-primary transition-colors flex items-center gap-1">Spotify <ExternalLink size={10} /></a>
             </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA - ZEN TRIBE */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background/50 to-background opacity-60" />
        
        <motion.div className="container mx-auto px-4 text-center relative z-10" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={CONTAINER_VARIANTS}>
          <motion.h2 variants={ITEM_VARIANTS} className="text-4xl md:text-6xl font-bold mb-6 font-display">
            {isPortuguese ? 'Junte-se à ' : 'Join the '}<span className="text-primary">Zen Tribe</span>
          </motion.h2>
          <motion.p variants={ITEM_VARIANTS} className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            {isPortuguese ? 'Não é só sobre música. É sobre vibração. Entre para a lista VIP.' : 'It\'s not just about music. It\'s about the vibe. Join the VIP list.'}
          </motion.p>
          <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
            <Link to="/zentribe/" className="btn btn-primary btn-lg min-w-[200px]">
              {isPortuguese ? 'Entrar na Tribo' : 'Join the Tribe'}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

export default HomePage;
