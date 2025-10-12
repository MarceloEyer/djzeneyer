// src/pages/ZenTribePage.tsx - VERSÃO ORIGINAL RESTAURADA

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Award, 
  Music, 
  Gift, 
  Crown, 
  Zap,
  Heart,
  Star,
  TrendingUp,
  Calendar,
  Download,
  MessageCircle,
  Ticket,
  Sparkles
} from 'lucide-react';

const ZenTribePage: React.FC = () => {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <Music size={40} className="text-primary" />,
      title: t('zenTribe.benefits.exclusiveMusic.title'),
      description: t('zenTribe.benefits.exclusiveMusic.desc')
    },
    {
      icon: <Ticket size={40} className="text-accent" />,
      title: t('zenTribe.benefits.earlyAccess.title'),
      description: t('zenTribe.benefits.earlyAccess.desc')
    },
    {
      icon: <Gift size={40} className="text-success" />,
      title: t('zenTribe.benefits.merchandise.title'),
      description: t('zenTribe.benefits.merchandise.desc')
    },
    {
      icon: <MessageCircle size={40} className="text-purple-400" />,
      title: t('zenTribe.benefits.community.title'),
      description: t('zenTribe.benefits.community.desc')
    },
    {
      icon: <Crown size={40} className="text-warning" />,
      title: t('zenTribe.benefits.vipStatus.title'),
      description: t('zenTribe.benefits.vipStatus.desc')
    },
    {
      icon: <Sparkles size={40} className="text-pink-400" />,
      title: t('zenTribe.benefits.behindScenes.title'),
      description: t('zenTribe.benefits.behindScenes.desc')
    }
  ];

  const stats = [
    { icon: <Users size={32} />, number: '2,500+', label: t('zenTribe.stats.members') },
    { icon: <Music size={32} />, number: '150+', label: t('zenTribe.stats.tracks') },
    { icon: <Calendar size={32} />, number: '50+', label: t('zenTribe.stats.events') },
    { icon: <Award size={32} />, number: '30+', label: t('zenTribe.stats.achievements') }
  ];

  return (
    <>
      <Helmet>
        <title>{t('zenTribe.pageTitle')} | DJ Zen Eyer</title>
        <meta name="description" content={t('zenTribe.pageDesc')} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-background via-surface/20 to-background">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-block mb-6">
              <div className="bg-primary/20 border border-primary/50 rounded-full px-8 py-3 text-primary font-bold uppercase tracking-wider text-sm backdrop-blur-sm">
                <Users className="inline-block mr-2" size={18} />
                {t('zenTribe.badge')}
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-black font-display mb-6 leading-tight">
              {t('zenTribe.welcome')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-success">
                {t('zenTribe.tribe')}
              </span>
            </h1>
            
            <p className="text-2xl text-white/80 max-w-4xl mx-auto mb-12 leading-relaxed">
              {t('zenTribe.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <button className="btn btn-primary btn-xl flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform">
                <Zap size={24} />
                {t('zenTribe.joinNow')}
              </button>
              <button className="btn btn-outline btn-xl flex items-center gap-3 hover:scale-105 transition-transform">
                <Heart size={24} />
                {t('zenTribe.learnMore')}
              </button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-8 text-center border border-primary/30 backdrop-blur-sm"
              >
                <div className="text-primary mb-4 inline-block">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.number}</div>
                <div className="text-sm md:text-base text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black font-display mb-6">
                {t('zenTribe.tabs.benefits')}
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Unlock exclusive perks and elevate your experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-surface/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-primary/50 transition-all shadow-xl hover:shadow-2xl"
                >
                  <div className="mb-6">{benefit.icon}</div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{benefit.title}</h3>
                  <p className="text-white/70 leading-relaxed">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gamification Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mb-24"
          >
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-black font-display mb-6">
                {t('zenTribe.tabs.achievements')}
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto">
                Level up and unlock exclusive rewards
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { emoji: '🎵', name: t('zenTribe.achievements.firstTrack.title'), points: 100, unlocked: true },
                { emoji: '🎉', name: t('zenTribe.achievements.firstEvent.title'), points: 250, unlocked: true },
                { emoji: '💎', name: t('zenTribe.achievements.collector.title'), points: 500, unlocked: false },
                { emoji: '👑', name: t('zenTribe.achievements.legend.title'), points: 1000, unlocked: false },
                { emoji: '🔥', name: t('zenTribe.achievements.streak.title'), points: 300, unlocked: true },
                { emoji: '🎯', name: t('zenTribe.achievements.marketer.title'), points: 200, unlocked: false }
              ].map((achievement, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  className={`rounded-2xl p-6 text-center transition-all ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary shadow-lg'
                      : 'bg-surface/50 border border-white/10 grayscale opacity-50'
                  }`}
                >
                  <div className="text-6xl mb-3">{achievement.emoji}</div>
                  <div className="text-sm font-bold text-white mb-1">{achievement.name}</div>
                  <div className="flex items-center justify-center gap-1 text-xs text-warning">
                    <Star size={12} fill="currentColor" />
                    <span>{achievement.points} XP</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 rounded-3xl p-16 border border-primary/30 backdrop-blur-sm"
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6">
              {t('zenTribe.cta.title')}
            </h2>
            <p className="text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
              {t('zenTribe.cta.subtitle')}
            </p>
            <button className="btn btn-primary btn-xl flex items-center justify-center gap-3 mx-auto shadow-2xl hover:scale-110 transition-transform">
              <Sparkles size={28} />
              <span className="text-xl">{t('zenTribe.cta.button')}</span>
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ZenTribePage;
