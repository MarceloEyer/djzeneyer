// src/components/Gamification/GamificationWidget.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Zap, TrendingUp } from 'lucide-react';
import { useGamiPress } from '../../hooks/useGamiPress';
import { Link } from 'react-router-dom';

const GamificationWidget: React.FC = () => {
  const { points, rank, level, achievements, loading } = useGamiPress();

  if (loading) {
    return (
      <div className="bg-surface rounded-xl p-6 animate-pulse">
        <div className="h-20 bg-white/10 rounded mb-4"></div>
        <div className="h-16 bg-white/10 rounded mb-4"></div>
        <div className="h-12 bg-white/10 rounded"></div>
      </div>
    );
  }

  // ✅ Cálculo correto de Level e XP
  const currentLevel = Math.floor(points / 100) + 1;
  const currentLevelStart = (currentLevel - 1) * 100;
  const nextLevelStart = currentLevel * 100;
  const progressInLevel = points - currentLevelStart;
  const xpNeeded = nextLevelStart - points;
  const progressPercent = (progressInLevel / 100) * 100;

  // 🔥 CORREÇÃO CRÍTICA: Verificação SEGURA de achievements
  const safeAchievements = (achievements && Array.isArray(achievements)) ? achievements : [];
  const earnedAchievements = safeAchievements.filter(a => a?.earned).length;
  const totalAchievements = safeAchievements.length > 0 ? safeAchievements.length : 6;

  return (
    <div className="bg-gradient-to-br from-surface via-surface to-primary/10 rounded-xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-primary mb-1">Zen Tribe</h3>
          <p className="text-sm text-white/60">Your Progress</p>
        </div>
        <Link
          to="/my-account/"
          className="px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg text-primary font-bold text-sm transition-all"
        >
          View All
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Level */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-black/30 rounded-lg p-4 border border-primary/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star size={16} className="text-primary" fill="currentColor" />
            <span className="text-xs text-white/60">Level</span>
          </div>
          <p className="text-3xl font-black">{currentLevel}</p>
          <p className="text-xs text-white/40 truncate">{rank || 'Zen Novice'}</p>
        </motion.div>

        {/* Points */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="bg-black/30 rounded-lg p-4 border border-secondary/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} className="text-secondary" fill="currentColor" />
            <span className="text-xs text-white/60">XP</span>
          </div>
          <p className="text-3xl font-black text-secondary">{points}</p>
          <p className="text-xs text-white/40">Total Points</p>
        </motion.div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-white/60">Level {currentLevel}</span>
          <span className="text-white/60">Level {currentLevel + 1}</span>
        </div>
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-xs text-white/40 mt-1 text-center">
          {xpNeeded > 0 ? `${xpNeeded} XP to next level` : 'Max level reached!'}
        </p>
      </div>

      {/* Achievements Summary */}
      <div className="bg-black/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-accent" />
            <span className="font-bold">Achievements</span>
          </div>
          <span className="text-sm text-white/60">
            {earnedAchievements}/{totalAchievements}
          </span>
        </div>
        
        {/* Achievement Icons */}
        {safeAchievements.length > 0 ? (
          <div className="flex gap-2 flex-wrap">
            {safeAchievements.slice(0, 6).map((achievement, index) => (
              <motion.div
                key={achievement?.id || index}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={``size-10 rounded-lg flex items-center justify-center ${                  achievement?.earned 
                    ? 'bg-gradient-to-br from-primary to-secondary' 
                    : 'bg-white/5 opacity-40'
                }`}
                title={achievement?.title || 'Achievement'}
              >
                {achievement?.image ? (
                  <img 
                    src={achievement.image} 
                    alt={achievement.title || 'Achievement'}
                    className="wsize-6 object-contain
                  />
                ) : (
                  <Award size={16} className={achievement?.earned ? 'text-white' : 'text-white/30'} />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-white/40 text-sm">
            Start your journey to unlock achievements! 🎯
          </div>
        )}
      </div>

      {/* Quick Action */}
      <Link
        to="/events/"
        className="mt-4 w-full btn btn-primary flex items-center justify-center gap-2"
      >
        <TrendingUp size={18} />
        <span>Earn More XP</span>
      </Link>
    </div>
  );
};

export default GamificationWidget;
