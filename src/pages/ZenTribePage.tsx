// src/pages/ZenTribePage.tsx - VERSÃO CORRIGIDA COM HEADLESS SEO

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Sparkles, Award, Zap, Trophy } from 'lucide-react';
import { HeadlessSEO } from '../components/HeadlessSEO';

const ZenTribePage: React.FC = () => {
  const { t } = useTranslation();

  // Schema para Organização (Zen Tribe Community)
  const tribeschema = {
    "@type": "Organization",
    "@id": "https://djzeneyer.com/zentribe/#organization",
    "name": "Zen Tribe Community",
    "url": "https://djzeneyer.com/zentribe",
    "description": "Exclusive community for DJ Zen Eyer fans with gamification, exclusive music, and rewards",
    "image": "https://djzeneyer.com/images/zentribe-og.jpg",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "DJ Zen Eyer",
      "url": "https://djzeneyer.com"
    },
    "sameAs": [
      "https://www.wikidata.org/wiki/Q136551855"
    ]
  };

  const achievements = [
    { emoji: '🎵', title: 'Music Listener', description: 'Listen to 5 tracks', unlocked: true },
    { emoji: '⭐', title: 'Zen Enthusiast', description: 'Join the Tribe', unlocked: true },
    { emoji: '🏆', title: 'Remix Master', description: 'Unlock exclusive mix', unlocked: false },
    { emoji: '🎧', title: 'Audio Alchemist', description: 'Discover all genres', unlocked: false },
    { emoji: '💎', title: 'Tribe Champion', description: 'Reach VIP status', unlocked: false },
    { emoji: '🚀', title: 'Zen Ascended', description: 'Max level achievement', unlocked: false },
  ];

  const AchievementBadge: React.FC<{
    emoji: string;
    title: string;
    description: string;
    unlocked: boolean;
    t: any;
  }> = ({ emoji, title, description, unlocked }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-4 rounded-lg text-center transition ${
        unlocked
          ? 'bg-primary/20 border border-primary/50'
          : 'bg-surface/30 border border-white/10 opacity-50'
      }`}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h4 className="font-display text-sm">{title}</h4>
      <p className="text-xs text-white/70 mt-1">{description}</p>
    </motion.div>
  );

  return (
    <>
      {/* 🎯 HEADLESS SEO - CENTRALIZADO */}
      <HeadlessSEO
        title="Zen Tribe | DJ Zen Eyer Community & Rewards"
        description="Join Zen Tribe community for exclusive music, gamification rewards, and direct connection with DJ Zen Eyer. Unlock badges, earn XP, and level up!"
        url="https://djzeneyer.com/zentribe"
        image="https://djzeneyer.com/images/zentribe-og.jpg"
        ogType="website"
        keywords="Zen Tribe, DJ Zen Eyer community, gamification, rewards, exclusive music"
        schema={tribeschema}
        hrefLang={[
          { lang: 'en', href: 'https://djzeneyer.com/zentribe' },
          { lang: 'pt-BR', href: 'https://djzeneyer.com/pt/zentribe' }
        ]}
      />

      {/* DESIGN ORIGINAL PRESERVADO */}
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
              <div className="inline-block mb-4">
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                  <Sparkles size={16} />
                  {t('zenTribe.joinCommunity')}
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
                The <span className="text-gradient">Zen</span> Tribe
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                {t('zenTribe.description')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Streaks & Achievements Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Streaks */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-8">
                  <Zap className="text-accent" size={28} />
                  <h2 className="text-3xl font-display">{t('zenTribe.streaks')}</h2>
                </div>

                <div className="space-y-6">
                  <div className="card p-6 bg-surface/50 border border-primary/20 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">🔥</div>
                      <div>
                        <h3 className="text-xl font-display mb-2">{t('zenTribe.streaksTitle')}</h3>
                        <p className="text-white/70">{t('zenTribe.streaksDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Achievements */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="bg-surface rounded-xl p-8">
                  <div className="flex items-center gap-2 mb-8">
                    <Trophy className="text-primary" size={28} />
                    <h2 className="text-2xl font-display">{t('zenTribe.achievementShowcase')}</h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <AchievementBadge
                        key={index}
                        emoji={achievement.emoji}
                        title={achievement.title}
                        description={achievement.description}
                        unlocked={achievement.unlocked}
                        t={t}
                      />
                    ))}
                  </div>

                  {/* Level Display */}
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xl font-display">{t('zenTribe.currentLevel')}</h3>
                      <div className="text-2xl text-primary font-bold">3</div>
                    </div>
                    <p className="text-lg mb-4">{t('zenTribe.zenApprentice')}</p>
                    <p className="text-sm text-white/70 mb-2">{t('zenTribe.progressToLevel')}</p>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: '87.5%' }}
                      />
                    </div>
                    <p className="text-right text-sm text-white/70 mt-1">350/400 XP</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">{t('zenTribe.ready')}</h2>
            <p className="text-lg text-white/80 mb-8">{t('zenTribe.readyDesc')}</p>
            <button className="px-8 py-4 bg-primary rounded-full font-bold hover:bg-primary/80 transition">
              {t('zenTribe.joinNow')}
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ZenTribePage;