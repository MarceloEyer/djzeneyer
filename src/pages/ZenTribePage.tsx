// src/pages/ZenTribePage.tsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { 
  Users, 
  Award, 
  TrendingUp, 
  Star, 
  Gift, 
  Crown, 
  Zap,
  Target,
  Trophy,
  Sparkles,
  Music,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Ticket,
  Download,
  Lock,
  Unlock
} from 'lucide-react';

interface Benefit {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  locked?: boolean;
}

interface Achievement {
  id: number;
  icon: string;
  titleKey: string;
  descKey: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
}

interface Challenge {
  id: number;
  titleKey: string;
  descKey: string;
  progress: number;
  total: number;
  reward: number;
  icon: React.ReactNode;
}

const ZenTribePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'benefits' | 'achievements' | 'challenges'>('benefits');

  // Benefícios
  const benefits: Benefit[] = [
    {
      icon: <Music size={32} className="text-primary" />,
      titleKey: 'zenTribe.benefits.exclusiveMusic.title',
      descKey: 'zenTribe.benefits.exclusiveMusic.desc'
    },
    {
      icon: <Ticket size={32} className="text-accent" />,
      titleKey: 'zenTribe.benefits.earlyAccess.title',
      descKey: 'zenTribe.benefits.earlyAccess.desc'
    },
    {
      icon: <Gift size={32} className="text-success" />,
      titleKey: 'zenTribe.benefits.merchandise.title',
      descKey: 'zenTribe.benefits.merchandise.desc'
    },
    {
      icon: <MessageCircle size={32} className="text-purple-400" />,
      titleKey: 'zenTribe.benefits.community.title',
      descKey: 'zenTribe.benefits.community.desc'
    },
    {
      icon: <Crown size={32} className="text-warning" />,
      titleKey: 'zenTribe.benefits.vipStatus.title',
      descKey: 'zenTribe.benefits.vipStatus.desc',
      locked: true
    },
    {
      icon: <Sparkles size={32} className="text-pink-400" />,
      titleKey: 'zenTribe.benefits.behindScenes.title',
      descKey: 'zenTribe.benefits.behindScenes.desc'
    }
  ];

  // Conquistas
  const achievements: Achievement[] = [
    {
      id: 1,
      icon: '🎵',
      titleKey: 'zenTribe.achievements.firstTrack.title',
      descKey: 'zenTribe.achievements.firstTrack.desc',
      points: 100,
      rarity: 'common',
      unlocked: true
    },
    {
      id: 2,
      icon: '🎉',
      titleKey: 'zenTribe.achievements.firstEvent.title',
      descKey: 'zenTribe.achievements.firstEvent.desc',
      points: 250,
      rarity: 'rare',
      unlocked: true
    },
    {
      id: 3,
      icon: '💎',
      titleKey: 'zenTribe.achievements.collector.title',
      descKey: 'zenTribe.achievements.collector.desc',
      points: 500,
      rarity: 'epic',
      unlocked: false
    },
    {
      id: 4,
      icon: '👑',
      titleKey: 'zenTribe.achievements.legend.title',
      descKey: 'zenTribe.achievements.legend.desc',
      points: 1000,
      rarity: 'legendary',
      unlocked: false
    },
    {
      id: 5,
      icon: '🔥',
      titleKey: 'zenTribe.achievements.streak.title',
      descKey: 'zenTribe.achievements.streak.desc',
      points: 300,
      rarity: 'rare',
      unlocked: true
    },
    {
      id: 6,
      icon: '🎯',
      titleKey: 'zenTribe.achievements.marketer.title',
      descKey: 'zenTribe.achievements.marketer.desc',
      points: 200,
      rarity: 'common',
      unlocked: false
    }
  ];

  // Desafios
  const challenges: Challenge[] = [
    {
      id: 1,
      titleKey: 'zenTribe.challenges.downloadTracks.title',
      descKey: 'zenTribe.challenges.downloadTracks.desc',
      progress: 3,
      total: 5,
      reward: 150,
      icon: <Download size={20} />
    },
    {
      id: 2,
      titleKey: 'zenTribe.challenges.attendEvents.title',
      descKey: 'zenTribe.challenges.attendEvents.desc',
      progress: 1,
      total: 3,
      reward: 300,
      icon: <Calendar size={20} />
    },
    {
      id: 3,
      titleKey: 'zenTribe.challenges.shareContent.title',
      descKey: 'zenTribe.challenges.shareContent.desc',
      progress: 5,
      total: 10,
      reward: 200,
      icon: <Share2 size={20} />
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const BenefitCard: React.FC<{ benefit: Benefit; index: number }> = ({ benefit, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative bg-surface/50 rounded-2xl p-6 border transition-all ${
        benefit.locked 
          ? 'border-white/5 opacity-50' 
          : 'border-white/10 hover:border-primary/50'
      }`}
    >
      {benefit.locked && (
        <div className="absolute top-4 right-4">
          <Lock size={20} className="text-white/30" />
        </div>
      )}
      
      <div className="mb-4">{benefit.icon}</div>
      <h3 className="text-xl font-bold mb-2">{t(benefit.titleKey)}</h3>
      <p className="text-white/70">{t(benefit.descKey)}</p>
      
      {benefit.locked && (
        <div className="mt-4 text-sm text-warning font-semibold">
          🔒 {t('zenTribe.unlockAtLevel', { level: 5 })}
        </div>
      )}
    </motion.div>
  );

  const AchievementCard: React.FC<{ achievement: Achievement; index: number }> = ({ achievement, index }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
      className={`relative bg-gradient-to-br ${getRarityColor(achievement.rarity)} rounded-2xl p-6 text-center ${
        achievement.unlocked ? 'shadow-xl' : 'grayscale opacity-40'
      }`}
    >
      <div className="text-6xl mb-3">{achievement.icon}</div>
      <h4 className="font-black text-white mb-2">{t(achievement.titleKey)}</h4>
      <p className="text-sm text-white/90 mb-3">{t(achievement.descKey)}</p>
      
      <div className="flex items-center justify-center gap-2">
        <Star size={16} className="text-yellow-300" fill="currentColor" />
        <span className="font-bold text-white">{achievement.points} XP</span>
      </div>

      {achievement.unlocked && (
        <div className="absolute -top-2 -right-2 bg-success rounded-full p-2">
          <Trophy size={16} className="text-white" />
        </div>
      )}

      <div className="mt-2">
        <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
          achievement.rarity === 'legendary' ? 'bg-yellow-500 text-black' :
          achievement.rarity === 'epic' ? 'bg-purple-500 text-white' :
          achievement.rarity === 'rare' ? 'bg-blue-500 text-white' :
          'bg-gray-500 text-white'
        }`}>
          {achievement.rarity}
        </span>
      </div>
    </motion.div>
  );

  const ChallengeCard: React.FC<{ challenge: Challenge; index: number }> = ({ challenge, index }) => {
    const progress = (challenge.progress / challenge.total) * 100;
    
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-surface/50 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-primary/20 rounded-lg">
              {challenge.icon}
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1">{t(challenge.titleKey)}</h4>
              <p className="text-sm text-white/70">{t(challenge.descKey)}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-warning font-bold">+{challenge.reward} XP</div>
            <div className="text-xs text-white/60">Reward</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">
              {challenge.progress}/{challenge.total}
            </span>
            <span className="text-primary font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            />
          </div>
        </div>

        {progress === 100 && (
          <button className="w-full mt-4 btn btn-success flex items-center justify-center gap-2">
            <Gift size={16} />
            Claim Reward
          </button>
        )}
      </motion.div>
    );
  };

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
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <div className="bg-primary/20 border border-primary/50 rounded-full px-6 py-2 text-primary font-bold uppercase tracking-wider text-sm">
                <Users className="inline-block mr-2" size={16} />
                {t('zenTribe.badge')}
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black font-display mb-6">
              {t('zenTribe.welcome')} <span className="text-primary">{t('zenTribe.tribe')}</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-3xl mx-auto mb-8">
              {t('zenTribe.subtitle')}
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn btn-primary btn-lg flex items-center gap-2">
                <Zap size={20} />
                {t('zenTribe.joinNow')}
              </button>
              <button className="btn btn-outline btn-lg flex items-center gap-2">
                <Target size={20} />
                {t('zenTribe.learnMore')}
              </button>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {[
              { icon: <Users size={24} />, number: '2,500+', label: t('zenTribe.stats.members') },
              { icon: <Music size={24} />, number: '150+', label: t('zenTribe.stats.tracks') },
              { icon: <Calendar size={24} />, number: '50+', label: t('zenTribe.stats.events') },
              { icon: <Award size={24} />, number: '30+', label: t('zenTribe.stats.achievements') }
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-6 text-center border border-primary/30"
              >
                <div className="text-primary mb-2 inline-block">{stat.icon}</div>
                <div className="text-3xl font-black text-white mb-1">{stat.number}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(['benefits', 'achievements', 'challenges'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-xl scale-105'
                    : 'bg-surface/50 text-white/70 hover:text-white hover:bg-surface/80'
                }`}
              >
                {tab === 'benefits' && <Gift className="inline-block mr-2" size={20} />}
                {tab === 'achievements' && <Trophy className="inline-block mr-2" size={20} />}
                {tab === 'challenges' && <Target className="inline-block mr-2" size={20} />}
                {t(`zenTribe.tabs.${tab}`)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'benefits' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, i) => (
                  <BenefitCard key={i} benefit={benefit} index={i} />
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, i) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={i} />
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="max-w-4xl mx-auto space-y-6">
                {challenges.map((challenge, i) => (
                  <ChallengeCard key={challenge.id} challenge={challenge} index={i} />
                ))}
              </div>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 text-center bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl p-12 border border-primary/30"
          >
            <h2 className="text-4xl font-black mb-4">
              {t('zenTribe.cta.title')}
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              {t('zenTribe.cta.subtitle')}
            </p>
            <button className="btn btn-primary btn-xl flex items-center justify-center gap-3 mx-auto">
              <Sparkles size={24} />
              {t('zenTribe.cta.button')}
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ZenTribePage;
