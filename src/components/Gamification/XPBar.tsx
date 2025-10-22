// src/components/Gamification/XPBar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useGamiPress } from '../../hooks/useGamiPress';
import { Zap } from 'lucide-react';

const XPBar: React.FC = () => {
  const { points, rank, loading } = useGamiPress();

  if (loading) {
    return (
      <div className="bg-surface p-4 rounded-lg animate-pulse">
        <div className="h-4 bg-white/10 rounded mb-2"></div>
        <div className="h-2 bg-white/10 rounded-full"></div>
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

  return (
    <div className="bg-surface/50 p-4 rounded-lg border border-white/10 backdrop-blur-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Zap className="text-primary" size={18} fill="currentColor" />
          <span className="font-bold text-sm">Level {currentLevel}</span>
          <span className="text-xs text-white/60">• {rank || 'Zen Novice'}</span>
        </div>
        <span className="text-sm font-semibold text-primary">{points} XP</span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercent, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        
        {/* XP Text */}
        <p className="text-xs text-white/50 mt-1 text-center">
          {xpNeeded > 0 ? `${xpNeeded} XP to Level ${currentLevel + 1}` : 'Max level!'}
        </p>
      </div>
    </div>
  );
};

export default XPBar;
