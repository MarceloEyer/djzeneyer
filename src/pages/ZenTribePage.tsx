// src/pages/ZenTribePage.tsx
// ============================================================================
// ZEN TRIBE PAGE - VERSÃO REFATORADA (HEADLESS SEO)
// ============================================================================
// OTIMIZAÇÕES:
// ✅ HeadlessSEO implementado com hrefLang SSOT
// ✅ Constantes movidas para fora do componente
// ✅ BenefitCard, MembershipCard, AchievementCard memoizados
// ✅ Schema Organization otimizado
// ✅ Performance maximizada (sem re-renders desnecessários)
// ============================================================================

import React, { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HeadlessSEO } from '../components/HeadlessSEO';
import { getHrefLangUrls } from '../utils/seo';
import { Award, Star, Users, TrendingUp, Shield, Gift, Clock, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

// ============================================================================
// CONSTANTES DE DADOS (FORA DO COMPONENTE)
// ============================================================================

/**
 * Schema.org Organization (Tribo Zen)
 */
const ORGANIZATION_SCHEMA = {
  "@type": "Organization",
  "@id": "https://djzeneyer.com/zentribe#organization",
  "name": "Zen Tribe - Comunidade Global de Zouk Brasileiro",
  "alternateName": "Tribo Zen",
  "url": "https://djzeneyer.com/zentribe",
  "founder": {
    "@id": "https://djzeneyer.com/#artist"
  },
  "description": "Comunidade exclusiva para amantes do Zouk Brasileiro, oferecendo acesso antecipado a músicas, eventos VIP e sistema de recompensas gamificado.",
  "areaServed": {
    "@type": "Place",
    "name": "Worldwide"
  },
  "slogan": "Conectando almas através do Zouk Brasileiro",
  "knowsAbout": ["Brazilian Zouk Community", "DJ Zen Eyer Music", "Zouk Dance Culture"],
  "memberOf": {
    "@type": "Organization",
    "name": "International Brazilian Zouk Community"
  }
};

/**
 * Animation variants
 */
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

/**
 * Dados de Achievements (sistema de gamificação)
 */
const ACHIEVEMENTS_DATA = [
  { emoji: '🎧', titleKey: 'zenTribe.achievements.firstTrack.title', descKey: 'zenTribe.achievements.firstTrack.desc', unlocked: true },
  { emoji: '🚀', titleKey: 'zenTribe.achievements.firstEvent.title', descKey: 'zenTribe.achievements.firstEvent.desc', unlocked: true },
  { emoji: '🔍', titleKey: 'zenTribe.achievements.collector.title', descKey: 'zenTribe.achievements.collector.desc', unlocked: false },
  { emoji: '🦋', titleKey: 'zenTribe.achievements.marketer.title', descKey: 'zenTribe.achievements.marketer.desc', unlocked: false },
  { emoji: '🎪', titleKey: 'zenTribe.achievements.legend.title', descKey: 'zenTribe.achievements.legend.desc', unlocked: false },
  { emoji: '⏱️', titleKey: 'zenTribe.achievements.streak.title', descKey: 'zenTribe.achievements.streak.desc', unlocked: false },
];

// ============================================================================
// COMPONENTES AUXILIARES (MEMOIZADOS)
// ============================================================================

/**
 * BenefitCard - Card de benefícios
 */
const BenefitCard = memo<{ 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
}>(({ icon, title, description, color }) => (
  <motion.div 
    className="card p-6 glow transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    variants={{
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.5, ease: 'easeOut' },
      },
    }}
  >
    <div className={`w-12 h-12 rounded-full bg-${color}/20 flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-white/70">{description}</p>
  </motion.div>
));
BenefitCard.displayName = 'BenefitCard';

/**
 * MembershipCard - Card de tier de membership
 */
const MembershipCard = memo<{ 
  tier: any; 
  user: any; 
  t: any;
}>(({ tier, user, t }) => (
  <motion.div 
    className={`card overflow-hidden relative transition-all duration-300 hover:shadow-lg ${
      tier.popular ? 'border-2 border-secondary' : ''
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: tier.popular ? 0 : 0.1 }}
  >
    {tier.popular && (
      <div className="absolute top-0 right-0 bg-secondary text-white px-4 py-1 text-sm font-medium">
        {t('zenTribe.mostPopular')}
      </div>
    )}
    <div className={`p-6 bg-${tier.color}/10`}>
      <div className={`w-12 h-12 rounded-full bg-${tier.color}/20 flex items-center justify-center mb-4 text-${tier.color}`}>
        {tier.icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 font-display">{tier.name}</h3>
      <div className="mb-6">
        <span className="text-3xl font-bold">{tier.price}</span>
      </div>
    </div>
    <div className="p-6">
      <ul className="space-y-3 mb-6">
        {tier.features.map((feature: string, i: number) => (
          <li key={i} className="flex items-start">
            <div className={`text-${tier.color} mr-2 mt-1`} aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span className="text-white/80">{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        className={`w-full btn ${tier.popular ? 'btn-secondary' : 'btn-outline'} transition-all duration-300 hover:scale-[1.02]`}
        aria-label={`Join ${tier.name} membership`}
      >
        {user?.isLoggedIn ? t('zenTribe.upgradeNow') : t('zenTribe.joinNow')}
      </button>
    </div>
  </motion.div>
));
MembershipCard.displayName = 'MembershipCard';

/**
 * AchievementCard - Card de conquista
 */
const AchievementCard = memo<{ 
  emoji: string; 
  title: string; 
  description: string; 
  unlocked: boolean; 
  t: any;
}>(({ emoji, title, description, unlocked, t }) => (
  <div className={`bg-surface/50 rounded-lg p-4 transition-all duration-300 ${unlocked ? 'hover:bg-surface/70' : 'opacity-60'}`}>
    <div className="text-4xl mb-3">{emoji}</div>
    <h4 className="font-display text-lg mb-1">{title}</h4>
    <p className="text-sm text-white/70">{description}</p>
    {unlocked && (
      <div className="mt-2 text-xs text-success flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        {t('zenTribe.unlocked')}
      </div>
    )}
  </div>
));
AchievementCard.displayName = 'AchievementCard';

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const ZenTribePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUser();

  // Membership tiers (com tradução)
  const membershipTiers = [
    {
      name: t('zenTribe.tiers.novice.name'),
      price: t('zenTribe.tiers.novice.price'),
      features: [
        t('zenTribe.tiers.novice.feature1'),
        t('zenTribe.tiers.novice.feature2'),
        t('zenTribe.tiers.novice.feature3'),
        t('zenTribe.tiers.novice.feature4'),
      ],
      color: 'primary',
      icon: <Users size={24} aria-hidden="true" />,
      popular: false,
    },
    {
      name: t('zenTribe.tiers.voyager.name'),
      price: t('zenTribe.tiers.voyager.price'),
      features: [
        t('zenTribe.tiers.voyager.feature1'),
        t('zenTribe.tiers.voyager.feature2'),
        t('zenTribe.tiers.voyager.feature3'),
        t('zenTribe.tiers.voyager.feature4'),
        t('zenTribe.tiers.voyager.feature5'),
      ],
      color: 'secondary',
      icon: <Star size={24} aria-hidden="true" />,
      popular: true,
    },
    {
      name: t('zenTribe.tiers.master.name'),
      price: t('zenTribe.tiers.master.price'),
      features: [
        t('zenTribe.tiers.master.feature1'),
        t('zenTribe.tiers.master.feature2'),
        t('zenTribe.tiers.master.feature3'),
        t('zenTribe.tiers.master.feature4'),
        t('zenTribe.tiers.master.feature5'),
        t('zenTribe.tiers.master.feature6'),
      ],
      color: 'accent',
      icon: <Shield size={24} aria-hidden="true" />,
      popular: false,
    },
  ];

  // Scroll to section
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // URLs para hrefLang (SSOT)
  const currentPath = '/zentribe';
  const currentUrl = 'https://djzeneyer.com' + currentPath;

  return (
    <>
      {/* ====================================================================== */}
      {/* HEADLESS SEO (PADRÃO SSOT CORRETO) */}
      {/* ====================================================================== */}
      <HeadlessSEO
        title={t('tribe_page_title')}
        description={t('tribe_page_meta_desc')}
        url={currentUrl}
        image="https://djzeneyer.com/images/zen-tribe-og.jpg"
        ogType="website"
        schema={ORGANIZATION_SCHEMA}
        keywords="Zen Tribe, Tribo Zen, Brazilian Zouk community, DJ Zen Eyer membership, Zouk exclusive content, gamification, VIP events"
      />

      {/* ====================================================================== */}
      {/* CONTEÚDO DA PÁGINA */}
      {/* ====================================================================== */}
      <div className="pt-24 min-h-screen">
        
        {/* Page Header */}
        <div className="bg-surface py-12 md:py-16" id="tribe-intro">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block mb-4">
                <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                  {t('zenTribe.badge')}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-display">
                {t('zenTribe.welcome')} <span className="text-primary">{t('zenTribe.tribe')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                {t('zenTribe.subtitle')}
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  className="btn btn-primary transition-all duration-300 hover:scale-105"
                  onClick={() => scrollToSection('membership-tiers')}
                  aria-label="View membership options"
                >
                  {t('zenTribe.viewMemberships')}
                </button>
                <button
                  className="btn btn-outline transition-all duration-300 hover:scale-105"
                  onClick={() => scrollToSection('tribe-benefits')}
                  aria-label="Learn more about tribe benefits"
                >
                  {t('zenTribe.learnMore')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tribe Benefits */}
        <section className="py-16 bg-background" id="tribe-benefits">
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-2xl md:text-3xl font-bold mb-12 text-center font-display"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {t('zenTribe.whyJoin')}
            </motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
              variants={CONTAINER_VARIANTS}
              initial="hidden"
              animate="visible"
            >
              <BenefitCard
                icon={<Award className="text-primary" size={24} aria-hidden="true" />}
                title={t('zenTribe.benefits.exclusiveMusic.title')}
                description={t('zenTribe.benefits.exclusiveMusic.desc')}
                color="primary"
              />

              <BenefitCard
                icon={<Star className="text-secondary" size={24} aria-hidden="true" />}
                title={t('zenTribe.benefits.earlyAccess.title')}
                description={t('zenTribe.benefits.earlyAccess.desc')}
                color="secondary"
              />

              <BenefitCard
                icon={<TrendingUp className="text-accent" size={24} aria-hidden="true" />}
                title={t('zenTribe.benefits.vipStatus.title')}
                description={t('zenTribe.benefits.vipStatus.desc')}
                color="accent"
              />

              <BenefitCard
                icon={<Users className="text-success" size={24} aria-hidden="true" />}
                title={t('zenTribe.benefits.community.title')}
                description={t('zenTribe.benefits.community.desc')}
                color="success"
              />
            </motion.div>
          </div>
        </section>

        {/* Membership Tiers */}
        <section className="py-16 bg-surface" id="membership-tiers">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 font-display">
                {t('zenTribe.chooseMembership')}
              </h2>
              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                {t('zenTribe.selectTier')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {membershipTiers.map((tier, index) => (
                <MembershipCard key={index} tier={tier} user={user} t={t} />
              ))}
            </div>
          </div>
        </section>

        {/* Achievement System */}
        <section className="py-16 bg-background" id="achievement-system">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
              <motion.div
                className="lg:w-1/2"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-bold mb-6 font-display">
                  {t('zenTribe.levelUpTitle')}
                </h2>
                <p className="text-lg text-white/70 mb-8">
                  {t('zenTribe.levelUpDesc')}
                </p>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <TrendingUp className="text-primary mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="text-xl font-display mb-2">{t('zenTribe.xpTitle')}</h3>
                      <p className="text-white/70">{t('zenTribe.xpDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Award className="text-secondary mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="text-xl font-display mb-2">{t('zenTribe.badgesTitle')}</h3>
                      <p className="text-white/70">{t('zenTribe.badgesDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Gift className="text-accent mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="text-xl font-display mb-2">{t('zenTribe.rewardsTitle')}</h3>
                      <p className="text-white/70">{t('zenTribe.rewardsDesc')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="text-success mr-4 mt-1" size={24} />
                    <div>
                      <h3 className="text-xl font-display mb-2">{t('zenTribe.streaksTitle')}</h3>
                      <p className="text-white/70">{t('zenTribe.streaksDesc')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lg:w-1/2 bg-surface rounded-xl p-8"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-8">
                  <Zap className="text-primary" size={24} />
                  <h3 className="text-2xl font-display">{t('zenTribe.achievementShowcase')}</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ACHIEVEMENTS_DATA.map((achievement, index) => (
                    <AchievementCard
                      key={index}
                      emoji={achievement.emoji}
                      title={t(achievement.titleKey as any)}
                      description={t(achievement.descKey as any)}
                      unlocked={achievement.unlocked}
                      t={t}
                    />
                  ))}
                </div>
                
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-display">{t('zenTribe.currentLevel')}</h4>
                    <span className="text-2xl text-primary">3</span>
                  </div>
                  <h5 className="text-lg mb-4">{t('zenTribe.zenApprentice')}</h5>
                  <p className="text-sm text-white/70 mb-2">{t('zenTribe.progressToLevel')}</p>
                  <div className="h-2 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '87.5%' }}></div>
                  </div>
                  <p className="text-right text-sm text-white/70 mt-1">350/400 XP</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ZenTribePage;