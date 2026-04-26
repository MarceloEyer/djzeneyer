// src/pages/HomePage.tsx
// VERSÃO FINAL: DIAMOND MASTER (Integrated with Zen SEO Plugin v8.0.0)

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import {
  PlayCircle, Calendar, Users, Music, Award, Trophy,
  Globe, Mail, ExternalLink, Sparkles, Download
} from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { EventsList } from '../components/EventsList';
import { useZenSeoSettings } from '../hooks/useQueries';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { sanitizeHtml } from '../utils/sanitize';

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


// ============================================================================
// 2. DADOS E CONSTANTES
// ============================================================================

const FEATURES_DATA = [
  { id: 'music', icon: <Music size={32} />, titleKey: 'home.feat_exclusive_title', descKey: 'home.feat_exclusive_desc' },
  { id: 'achievements', icon: <Award size={32} />, titleKey: 'home.feat_achievements_title', descKey: 'home.feat_achievements_desc' },
  { id: 'community', icon: <Users size={32} />, titleKey: 'home.feat_community_title', descKey: 'home.feat_community_desc' },
] as const;

const FESTIVALS_HIGHLIGHT = ARTIST.festivals.slice(0, 6);

const STATS = [
  { value: '2×', labelKey: 'home.stat_champion', icon: Trophy },
  { value: `${ARTIST.stats.countriesPlayed}+`, labelKey: 'home.stat_countries', icon: Globe },
  { value: `${ARTIST.stats.yearsActive}+`, labelKey: 'home.stat_years', icon: Sparkles },
] as const;

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
  <motion.article className="card p-5 sm:p-8 text-center bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors" variants={variants}>
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
  const { data: seoSettings } = useZenSeoSettings();

  const currentLang = normalizeLanguage(i18n.language);
  const currentPath = i18n.language === 'pt' ? '/pt' : '/';
  const currentUrl = `${ARTIST.site.baseUrl}${currentPath}`;

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
        "inLanguage": ["en", "pt-BR"]
      },
      ARTIST_SCHEMA_BASE,
      {
        "@type": "WebPage",
        "@id": `${currentUrl}#webpage`,
        "url": currentUrl,
        "name": t('home.page_title'),
        "description": t('home.page_meta_desc'),
        "isPartOf": { "@id": `${ARTIST.site.baseUrl}/#website` },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": seoSettings?.default_og_image || `${ARTIST.site.baseUrl}/images/hero-background.webp`,
          "width": 1920,
          "height": 1080
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": currentUrl }]
        }
      }
    ],
  }), [seoSettings, t, currentUrl]);

  return (
    <>
      <HeadlessSEO
        title={seoSettings?.real_name
          ? `${seoSettings.real_name} | ${t('home.stat_champion')}`
          : t('home.page_title')}

        description={t('home.page_meta_desc')}

        url={currentUrl}

        image={seoSettings?.default_og_image || `${currentUrl}/images/zen-eyer-og-image.png`}

        isHomepage={true}
        schema={schemaData}
        keywords={t('home.seo.keywords')}
        leadAnswer={t('home.seo.lead_answer')}
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
                className="w-full h-full object-cover object-center opacity-65"
                width="1920"
                height="1080"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* H1 fora do container animado — sempre visível para crawlers e LCP */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight mb-4">
              <span className="text-white">Zen</span> <span className="text-primary">Eyer</span>
            </h1>

          <motion.div animate="visible" initial="hidden" variants={CONTAINER_VARIANTS}>
            <motion.div variants={ITEM_VARIANTS} className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-bold tracking-widest uppercase">
                <Trophy size={16} />
                <span className="font-semibold">{t('home.hero_badge')}</span>
              </div>
            </motion.div>

            <motion.p variants={ITEM_VARIANTS} className="text-base sm:text-xl md:text-2xl text-white mb-2 font-light">
              {t('home.hero_subtitle')}
            </motion.p>

            <motion.p variants={ITEM_VARIANTS} className="text-lg md:text-xl italic text-primary/90 mb-8">
              "{t('home.hero_slogan')}"
            </motion.p>

            <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto mb-10">
              {STATS.map(stat => <StatCard key={stat.labelKey} value={stat.value} label={t(stat.labelKey as unknown as Parameters<typeof t>[0])} icon={stat.icon} />)}
            </motion.div>

            <motion.div variants={ITEM_VARIANTS} className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center mb-6">
              <a
                href={ARTIST.social.soundcloud.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg flex items-center gap-2 min-h-[44px] shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                aria-label="Listen to DJ Zen Eyer on SoundCloud"
              >
                <PlayCircle size={22} />
                <span>{t('home.cta_soundcloud')}</span>
              </a>
              <Link
                to={getLocalizedRoute('booking', currentLang)}
                className="btn btn-outline btn-lg flex items-center gap-2 min-h-[44px] backdrop-blur-sm"
                aria-label="Book DJ Zen Eyer or Get Press Kit"
              >
                <Mail size={22} />
                <span>{t('home.cta_booking')}</span>
              </Link>
            </motion.div>

            <motion.p variants={ITEM_VARIANTS} className="text-sm md:text-base text-white/60 max-w-2xl mx-auto leading-relaxed">
              <Trans
                i18nKey="home.hero_cta_text"
                components={[
                  <Link
                    key="music-link"
                    to={getLocalizedRoute('music', currentLang)}
                    className="text-primary hover:text-primary/80 underline underline-offset-4"
                  />
                ]}
              />
            </motion.p>
          </motion.div>
          </div>
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
              <h2 className="text-3xl font-bold mb-6 text-white font-display">{t('home.bio_title')}</h2>
              <div className="text-xl leading-relaxed mb-6 text-white/90">
                <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('home.bio_intro')) }} />
              </div>
              <p className="text-lg leading-relaxed text-white/80 mb-6" dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('home.bio_style')) }} />
              <p className="text-lg leading-relaxed text-white/80" dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('home.bio_mensa')) }} />
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="py-16 bg-background border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={CONTAINER_VARIANTS}>
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-3 font-display">
              {t('home.shows.title')}
            </motion.h2>

            <motion.div variants={ITEM_VARIANTS} className="mb-8">
              <EventsList limit={3} showTitle={false} variant="compact" />
            </motion.div>

            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
              <Link to={getLocalizedRoute('events', currentLang)} className="btn btn-primary btn-lg flex items-center gap-2">
                <Calendar size={20} />
                <span>{t('home.shows.cta')}</span>
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
              <FeatureCard key={feature.id} icon={feature.icon} title={t(feature.titleKey as unknown as Parameters<typeof t>[0])} description={t(feature.descKey as unknown as Parameters<typeof t>[0])} variants={ITEM_VARIANTS} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* FESTIVALS / SOCIAL PROOF */}
      <section className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={CONTAINER_VARIANTS} className="text-center">
            <motion.h2 variants={ITEM_VARIANTS} className="text-2xl md:text-3xl font-bold mb-2 font-display">
              {t('home.festivals.presence')}
            </motion.h2>
            <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-3 mt-8">
              {FESTIVALS_HIGHLIGHT.map(festival => (<FestivalBadge key={festival.name} name={festival.name} flag={festival.flag} />))}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-sm text-primary">
                <span>+{t('home.festivals.many_more')}</span>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* PRESS & BOOKING */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="p-4 sm:p-8 bg-surface border-l-4 border-primary rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-display">
                <Download size={20} className="text-primary" /> {t('home.press.title')}
              </h3>
              <p className="text-white/70 mb-4 text-sm">{t('home.press.desc')}</p>
              <Link to={getLocalizedRoute('booking', currentLang)} className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors">
                {t('home.press.cta')} →
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-4 sm:p-8 bg-surface border-l-4 border-green-500 rounded-r-lg shadow-lg hover:bg-surface/80 transition-colors">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2 font-display">
                <Calendar size={20} className="text-green-500" /> {t('home.bookers.title')}
              </h3>
              <p className="text-white/70 mb-4 text-sm">{t('home.bookers.desc')}</p>
              <Link to={getLocalizedRoute('booking', currentLang)} className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-semibold transition-colors">
                {t('home.bookers.cta')} →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AUTHORITY LINKS */}
      <section className="py-12 bg-background border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-semibold text-white/40 mb-4 uppercase tracking-widest">{t('home.verified')}</p>
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
          <motion.h2 variants={ITEM_VARIANTS} className="text-2xl sm:text-4xl md:text-6xl font-bold mb-6 font-display">
            <Trans i18nKey="home.tribe.title">
              Junte-se à <span className="text-primary">Zen Tribe</span>
            </Trans>
          </motion.h2>
          <motion.p variants={ITEM_VARIANTS} className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            {t('home.tribe.subtitle')}
          </motion.p>
          <motion.div variants={ITEM_VARIANTS} className="flex flex-wrap justify-center gap-4">
            <Link to={getLocalizedRoute('zentribe', currentLang)} className="btn btn-primary btn-lg min-w-[200px]">
              {t('nav.tribe')}
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
};

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary React reconciliation loops when parent layout components (like routers) trigger render cycles.
export default React.memo(HomePage);
