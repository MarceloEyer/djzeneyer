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
import { ARTIST_SCHEMA_BASE, ARTIST, getWhatsAppUrl } from '../data/artistData';
import { sanitizeHtml } from '../utils/sanitize';

// ============================================================================
// SCHEMA.ORG PARA A PAGINA ABOUT
// ============================================================================

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const currentPath = '/about';
  const currentUrl = `${ARTIST.site.baseUrl}${currentPath}`;

  // SCHEMA.ORG PARA A PAGINA ABOUT
  const ABOUT_SCHEMA = useMemo(() => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...ARTIST_SCHEMA_BASE,
      },
      {
        '@type': 'WebPage',
        '@id': `${ARTIST.site.baseUrl}/about#webpage`,
        url: `${ARTIST.site.baseUrl}/about`,
        name: t('about.seo.name'),
        description: t('about.seo.description'),
        isPartOf: { '@id': `${ARTIST.site.baseUrl}/#website` },
        about: { '@id': `${ARTIST.site.baseUrl}/#artist` },
      },
    ],
  }), [t]);

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
        image={`${ARTIST.site.baseUrl}/images/artist/dj-zen-eyer-nature-portrait.jpg`}
        type="profile"
        schema={ABOUT_SCHEMA}
        keywords={t('about.seo.keywords')}
        leadAnswer={t('about.seo.lead_answer')}
      />

      {/* Layout visual */}
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/20 to-background text-white">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-surface/10 to-accent/10 blur-3xl" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-block mb-4"
              >
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Sparkles className="inline-block mr-2" size={16} />
                  {t('about.hero.badge')}
                </div>
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                <Trans i18nKey="about.hero.title">
                  A <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text">Jornada</span>
                </Trans>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                {t('about.hero.subtitle')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ACHIEVEMENTS_DATA.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-surface/50 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-all"
                >
                  {item.icon}
                  <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                    {item.value}
                  </div>
                  <div className="text-white/60 text-sm">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6 text-lg text-white/80 leading-relaxed"
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

        {/* Timeline Section */}
        <section className="py-20 px-4 bg-surface/30">
          <div className="container mx-auto max-w-5xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-16"
            >
              <Trans i18nKey="about.timeline.title">
                Momentos que <span className="text-gradient">Mudaram Tudo</span>
              </Trans>
            </motion.h2>

            <div className="space-y-12">
              {MILESTONES.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={prefersReducedMotion ? undefined : { duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
                  className="relative"
                >
                  <div className="card p-6 md:p-8 hover:border-primary/50 transition-all duration-300">
                    <div className="flex items-start gap-6">
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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="card p-8 md:p-12 text-center bg-surface/50 rounded-2xl border border-white/10"
            >
              <Heart className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                <Trans i18nKey="about.philosophy.title">
                  Minha <span className="text-gradient">Filosofia</span>
                </Trans>
              </h2>
              <p className="text-lg text-white/80 leading-relaxed italic">
                {t('about.philosophy.quote')}
              </p>
              <div className="mt-8 text-white/60 font-semibold">- {ARTIST.identity.stageName}</div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-10 md:p-12 border border-primary/30 text-center"
            >
              <Sparkles className="w-12 h-12 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                <Trans i18nKey="about.cta.title">
                  Vamos <span className="text-gradient">Conversar?</span>
                </Trans>
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                {t('about.cta.desc')}
              </p>
              <motion.a
                href={getWhatsAppUrl(t('about.cta.whatsapp_msg'))}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg inline-flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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

export default AboutPage;
