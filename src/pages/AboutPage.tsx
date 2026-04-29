// src/pages/AboutPage.tsx - VERSAO FINAL HEADLESS E OTIMIZADA

import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Music2,
  Globe,
  Heart,
  Brain,
  Trophy,
  Users,
  Star,
  Sparkles,
  Mail as Envelope,
} from 'lucide-react';

import { HeadlessSEO } from '../components/HeadlessSEO';
import { useTranslation, Trans } from 'react-i18next';
import { ARTIST, ARTIST_SCHEMA_BASE } from '../data/artistData';
import { useBranding } from '../contexts/BrandingContext';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { sanitizeHtml } from '../utils/sanitize';

const getDynamicWhatsAppUrl = (number: string, message?: string) => {
  const defaultMsg = 'Olá Zen Eyer! Gostaria de conversar sobre booking.';
  return `https://wa.me/${number}?text=${encodeURIComponent(message || defaultMsg)}`;
};


// --- Framer Motion Static Configs ---
// ⚡ Bolt: Extracted static animation configurations to module scope to prevent
// unnecessary object reallocations on every render.
const VIEWPORT_ONCE = { once: true };
const VIEWPORT_ONCE_MARGIN = { once: true, margin: "-50px" };

const FADE_IN_UP_INITIAL = { opacity: 0, y: 30 };
const FADE_IN_UP_ANIMATE = { opacity: 1, y: 0 };
const FADE_IN_UP_TRANSITION = { duration: 0.8 };

const SCALE_IN_INITIAL = { scale: 0.8, opacity: 0 };
const SCALE_IN_ANIMATE = { scale: 1, opacity: 1 };
const SCALE_IN_TRANSITION = { delay: 0.2, duration: 0.6 };

const ITEM_INITIAL = { opacity: 0, y: 20 };
const ITEM_ANIMATE = { opacity: 1, y: 0 };

const FADE_IN_INITIAL = { opacity: 0 };
const FADE_IN_ANIMATE = { opacity: 1 };

const CTA_HOVER = { scale: 1.05 };
const CTA_TAP = { scale: 0.95 };


const PERFORMED_AT_EVENTS = [
  { name: 'Dutch International Zouk Congress', country: 'Netherlands', flag: '🇳🇱', url: 'https://www.dutchzouk.nl/artists' },
  { name: 'Lisbon Zouk Marathon', country: 'Portugal', flag: '🇵🇹', url: 'https://www.lisbonzoukmarathon.com/march2026' },
  { name: 'Slovenian Zouk Marathon', country: 'Slovenia', flag: '🇸🇮', url: 'https://slovenianzoukmarathon.com/' },
  { name: 'Neo Festival', country: 'Brazil', flag: '🇧🇷', url: 'https://neozouk.com/' },
  { name: 'Zouk in Rio', country: 'Brazil', flag: '🇧🇷', url: 'https://renatapecanha.wixsite.com/zoukinrio/c%C3%B3pia-artistas' },
] as const;

const MILESTONE_VARIANTS = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: (index: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.35, delay: index * 0.06, ease: "easeOut" }
  })
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1, y: 0,
    transition: { delay: index * 0.1 }
  })
};

// ============================================================================
// SCHEMA.ORG PARA A PAGINA ABOUT
// ============================================================================

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { artist } = useBranding();
  const prefersReducedMotion = useReducedMotion();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const currentPath = `/${getLocalizedRoute('about', currentLang).replace(/^\//, '')}`;
  const currentUrl = `${artist.site.baseUrl}${currentPath}`;

  // SCHEMA.ORG PARA A PAGINA ABOUT
  const ABOUT_SCHEMA = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      ARTIST_SCHEMA_BASE,
      {
        '@type': 'ProfilePage',
        '@id': `${currentUrl}#webpage`,
        url: currentUrl,
        name: t('about.seo.name'),
        description: t('about.seo.description'),
        isPartOf: { '@id': `${artist.site.baseUrl}/#website` },
        about: { '@id': `${artist.site.baseUrl}/#artist` },
        mainEntity: { '@id': `${artist.site.baseUrl}/#artist` },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['h1', '[data-speakable]'],
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: t('home'), item: `${artist.site.baseUrl}${getLocalizedRoute('home', currentLang)}` },
            { '@type': 'ListItem', position: 2, name: t('about.seo.name'), item: currentUrl },
          ],
        },
      },
    ],
  }), [t, artist, currentUrl, currentLang]);

  const MILESTONES = useMemo(() => [
    {
      year: '2005-2010',
      title: t('about.timeline.m1.title'),
      description: t('about.timeline.m1.desc'),
      icon: <Heart className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
    },
    {
      year: '2012',
      title: t('about.timeline.m2.title'),
      description: t('about.timeline.m2.desc'),
      icon: <Music2 className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    },
    {
      year: '2015-2019',
      title: t('about.timeline.m3.title'),
      description: t('about.timeline.m3.desc'),
      icon: <Brain className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    },
    {
      year: '2022',
      title: t('about.timeline.m4.title'),
      description: t('about.timeline.m4.desc'),
      icon: <Trophy className="w-8 h-8 text-white" />,
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    },
  ], [t]);

  const ACHIEVEMENTS_DATA = useMemo(() => [
    {
      label: t('about.stats.passion'),
      value: t('about.stats.passion_value'),
      icon: <Heart className="w-8 h-8 mx-auto mb-4 text-primary" />,
    },
    {
      label: t('about.stats.events'),
      value: t('about.stats.events_value'),
      icon: <Users className="w-8 h-8 mx-auto mb-4 text-primary" />,
    },
    {
      label: t('about.stats.stories'),
      value: t('about.stats.stories_value'),
      icon: <Globe className="w-8 h-8 mx-auto mb-4 text-primary" />,
    },
    {
      label: t('about.stats.smiles'),
      value: t('about.stats.smiles_value'),
      icon: <Star className="w-8 h-8 mx-auto mb-4 text-primary" />,
    },
  ], [t]);

  return (
    <>
      {/* SEO centralizado */}
      <HeadlessSEO
        title={t('about.seo.title')}
        description={t('about.seo.description')}
        url={currentUrl}
        image={`${artist.site.baseUrl}/images/artist/dj-zen-eyer-nature-portrait.jpg`}
        type="profile"
        schema={ABOUT_SCHEMA}
        keywords={t('about.seo.keywords')}
        leadAnswer={t('about.seo.lead_answer')}
      />

      {/* Layout visual */}
      <div className="min-h-screen bg-background text-white relative overflow-hidden">
        {/* Enhanced Background Decorations - Premium Glows */}
        <div className="absolute top-0 left-0 w-full h-[150vh] overflow-hidden pointer-events-none -z-0">
          <div className="absolute top-[5%] left-[-10%] w-[60%] h-[40%] bg-primary/10 blur-[130px] rounded-full" />
          <div className="absolute top-[20%] left-[60%] w-[35%] h-[35%] bg-blue-500/5 blur-[100px] rounded-full" />
          <div className="absolute top-[30%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute top-[50%] left-[-5%] w-[30%] h-[30%] bg-primary/5 blur-[80px] rounded-full" />
          <div className="absolute bottom-[10%] left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[100px] rounded-full" />
        </div>

        {/* Hero Section */}
        <div className="pt-24 pb-12 relative md:pt-32 md:pb-20">
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={FADE_IN_UP_INITIAL}
              animate={FADE_IN_UP_ANIMATE}
              transition={FADE_IN_UP_TRANSITION}
              className="text-center"
            >
              <motion.div
                initial={SCALE_IN_INITIAL}
                animate={SCALE_IN_ANIMATE}
                transition={SCALE_IN_TRANSITION}
                className="inline-block mb-4"
              >
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Sparkles className="inline-block mr-2" size={16} />
                  {t('about.hero.badge')}
                </div>
              </motion.div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black font-display mb-6 text-white leading-tight">
                <Trans i18nKey="about.hero.title">
                  {/* Fallback text if translation fails */}
                  The <span className="text-primary">Journey</span>
                </Trans>
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed" data-speakable>
                {t('about.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <section className="pb-8 pt-0 px-4 relative z-10">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {ACHIEVEMENTS_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  viewport={VIEWPORT_ONCE} custom={index} variants={ITEM_VARIANTS} initial="hidden" whileInView="visible"
                  className="group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 rounded-2xl" />
                  <div className="relative bg-surface/40 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/5 group-hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center h-full shadow-lg">
                    <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tighter">
                      {item.value}
                    </div>
                    <div className="text-primary font-bold text-sm uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">
                      {item.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4 relative z-10">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={FADE_IN_INITIAL}
              whileInView={FADE_IN_ANIMATE}
              viewport={VIEWPORT_ONCE}
              className="space-y-8 text-lg md:text-xl text-white/70 leading-relaxed font-light safe-html-contrast"
            >
              <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('about.story.p1')) }} />
              <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('about.story.p2')) }} />
              <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('about.story.p3')) }} />
              <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('about.story.p4')) }} />
              <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('about.story.p5')) }} />
              <p className="text-primary font-semibold" dangerouslySetInnerHTML={{ __html: sanitizeHtml(t('about.story.p6')) }} />
            </motion.div>
          </div>
        </section>

        {/* Performed At Section */}
        <section className="py-16 px-4 relative z-10 bg-surface/20">
          <div className="container mx-auto max-w-5xl">
            <motion.div
              initial={FADE_IN_UP_INITIAL}
              whileInView={FADE_IN_UP_ANIMATE}
              viewport={VIEWPORT_ONCE}
              transition={FADE_IN_UP_TRANSITION}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-5 text-xs font-bold tracking-widest uppercase">
                <Globe size={14} /> {t('about.performed_at.badge')}
              </div>
              <h2 className="text-2xl sm:text-4xl font-display font-bold mb-4">
                <Trans i18nKey="about.performed_at.title">
                  Performing at International <span className="text-primary">Festivals</span>
                </Trans>
              </h2>
              <p className="text-white/50 max-w-xl mx-auto text-base leading-relaxed">
                {t('about.performed_at.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PERFORMED_AT_EVENTS.map((event, index) => (
                <motion.a
                  key={index}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={prefersReducedMotion ? false : 'hidden'}
                  whileInView={prefersReducedMotion ? undefined : 'visible'}
                  viewport={VIEWPORT_ONCE_MARGIN}
                  custom={index}
                  variants={prefersReducedMotion ? undefined : ITEM_VARIANTS}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-surface/40 p-4 transition-all hover:border-primary/40 hover:bg-surface/60"
                >
                  <span className="text-3xl grayscale transition-all duration-500 group-hover:grayscale-0 flex-shrink-0">{event.flag}</span>
                  <div className="min-w-0">
                    <div className="text-base font-bold text-white leading-tight group-hover:text-primary transition-colors truncate">{event.name}</div>
                    <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{t(`about.performed_at.countries.${event.country}`, event.country)}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 bg-surface/30">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={ITEM_INITIAL}
              whileInView={ITEM_ANIMATE}
              viewport={VIEWPORT_ONCE}
              className="text-2xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-16"
            >
              <Trans i18nKey="about.timeline.title">
                Moments that <span className="text-primary">Changed Everything</span>
              </Trans>
            </motion.h2>

            <div className="space-y-12">
              {MILESTONES.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={prefersReducedMotion ? false : "hidden"}
                  whileInView={prefersReducedMotion ? undefined : "visible"}
                  viewport={VIEWPORT_ONCE_MARGIN}
                  custom={index} variants={prefersReducedMotion ? undefined : MILESTONE_VARIANTS}
                  className="relative"
                >
                  <div className="card p-6 md:p-8 hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-start gap-4 sm:gap-6">
                      <div
                        className={`flex-shrink-0 w-16 h-16 rounded-full ${milestone.color} flex items-center justify-center`}
                      >
                        {milestone.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-primary font-bold mb-2">
                          {milestone.year}
                        </div>
                        <h3 className="text-2xl font-display font-bold mb-3">
                          {milestone.title}
                        </h3>
                        <p className="text-white/70 leading-relaxed">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={FADE_IN_INITIAL}
              whileInView={FADE_IN_ANIMATE}
              viewport={VIEWPORT_ONCE}
              className="card p-8 md:p-12 text-center bg-surface/50 rounded-2xl border border-white/10"
            >
              <Heart className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                <Trans i18nKey="about.philosophy.title">
                  My <span className="text-primary">Philosophy</span>
                </Trans>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed italic">
                {t('about.philosophy.quote')}
              </p>
              <div className="mt-8 text-white/60 font-semibold">- {artist.identity.stageName}</div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={FADE_IN_UP_INITIAL}
              whileInView={ITEM_ANIMATE}
              viewport={VIEWPORT_ONCE}
              transition={FADE_IN_UP_TRANSITION}
              className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-6 sm:p-10 md:p-12 border border-primary/30 text-center"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                <Trans i18nKey="about.cta.title">
                  Let's <span className="text-primary">Talk?</span>
                </Trans>
              </h2>
              <p className="text-base sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {t('about.cta.desc')}
              </p>
              <motion.a
                href={getDynamicWhatsAppUrl(artist.identity.whatsapp || ARTIST.contact.whatsapp.number, t('about.cta.whatsapp_msg'))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg inline-flex items-center gap-3 min-h-[44px]"
                whileHover={CTA_HOVER}
                whileTap={CTA_TAP}
              >
                <Envelope className="w-5 h-5" />
                {t('about.cta.button')}
              </motion.a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default React.memo(AboutPage);
