/**
 * UserStatsCards - Gamification Stats Display
 * Aligned with Premium Visual standards:
 * - Glassmorphism (bg-surface/30 + backdrop-blur)
 * - Themed Glows (primary/secondary/accent)
 * - High contrast font weights
 */

import React, { memo } from 'react';
import { TrendingUp, Star, Award, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getNumberFormatter } from '../../utils/number';

interface UserStats {
  level: number;
  xp: number;
  rank: string;
  xpToNext: number;
  totalAchievements: number;
  recentAchievements: number;
}

interface UserStatsCardsProps {
  stats: UserStats;
}

const cardVariants = {
  hover: { y: -5, transition: { type: 'spring', stiffness: 400, damping: 10 } }
};

export const UserStatsCards: React.FC<UserStatsCardsProps> = memo(({ stats }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Level Card */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="relative overflow-hidden bg-surface/30 backdrop-blur-xl rounded-[1.5rem] p-7 border border-primary/10 hover:border-primary/40 transition-all group shadow-xl"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 text-primary group-hover:opacity-10 transition-opacity"><Zap size={48} fill="currentColor" /></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)] transition-all">
            <TrendingUp className="text-primary" size={24} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 font-display">{t('account.stats.level_title')}</h3>
        </div>
        <div>
          <p className="text-4xl font-black text-white font-display tracking-tighter mb-1">
            {t('account.stats.level_value', { level: stats.level })}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--color-primary),0.8)]" />
            <p className="text-[11px] font-black uppercase tracking-widest text-primary/80">{stats.rank}</p>
          </div>
        </div>
      </motion.div>

      {/* XP Card */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="relative overflow-hidden bg-surface/30 backdrop-blur-xl rounded-[1.5rem] p-7 border border-secondary/10 hover:border-secondary/40 transition-all group shadow-xl"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 text-secondary group-hover:opacity-10 transition-opacity"><Star size={48} fill="currentColor" /></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(var(--color-secondary),0.3)] transition-all">
            <Star className="text-secondary" size={24} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 font-display">{t('account.stats.xp_title')}</h3>
        </div>
        <div>
          <p className="text-4xl font-black text-white font-display tracking-tighter mb-1">
            {getNumberFormatter(i18n.language).format(stats.xp)} <span className="text-lg text-secondary/70">XP</span>
          </p>
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-none">
            {stats.xpToNext > 0
              ? t('account.stats.xp_to_next_rank', { count: stats.xpToNext })
              : t('account.stats.xp_max')
            }
          </p>
        </div>
      </motion.div>

      {/* Achievements Card */}
      <motion.div
        variants={cardVariants}
        whileHover="hover"
        className="relative overflow-hidden bg-surface/30 backdrop-blur-xl rounded-[1.5rem] p-7 border border-accent/10 hover:border-accent/40 transition-all group shadow-xl"
      >
        <div className="absolute top-0 right-0 p-4 opacity-5 text-accent group-hover:opacity-10 transition-opacity"><Award size={48} fill="currentColor" /></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shadow-inner group-hover:shadow-[0_0_15px_rgba(var(--color-accent),0.3)] transition-all">
            <Award className="text-accent" size={24} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 font-display">{t('account.stats.achievements_title')}</h3>
        </div>
        <div>
          <p className="text-4xl font-black text-white font-display tracking-tighter mb-1">
            {stats.totalAchievements}
          </p>
          <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest leading-none">
            {stats.recentAchievements > 0
              ? t('account.stats.unlocked_recently', { count: stats.recentAchievements })
              : t('account.stats.keep_exploring')
            }
          </p>
        </div>
      </motion.div>
    </div>
  );
});

UserStatsCards.displayName = 'UserStatsCards';
