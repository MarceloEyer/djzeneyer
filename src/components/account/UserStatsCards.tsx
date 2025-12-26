/**
 * UserStatsCards - Gamification Stats Display
 * 
 * Exibe estatísticas de gamificação do usuário (Level, XP, Achievements)
 * Extraído de MyAccountPage para melhor organização e reusabilidade
 */

import { TrendingUp, Star, Award } from 'lucide-react';

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

export const UserStatsCards: React.FC<UserStatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Level Card */}
      <div className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-primary" size={24} />
          <h3 className="font-semibold">Zen Level</h3>
        </div>
        <p className="text-3xl font-black text-primary">Level {stats.level}</p>
        <p className="text-sm text-white/60">{stats.rank}</p>
      </div>
      
      {/* XP Card */}
      <div className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-secondary/50 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <Star className="text-secondary" size={24} />
          <h3 className="font-semibold">Total XP</h3>
        </div>
        <p className="text-3xl font-black text-secondary">{stats.xp.toLocaleString()}</p>
        <p className="text-sm text-white/60">
          {stats.xpToNext > 0 ? `${stats.xpToNext} to next rank` : 'Max rank!'}
        </p>
      </div>
      
      {/* Achievements Card */}
      <div className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <Award className="text-accent" size={24} />
          <h3 className="font-semibold">Achievements</h3>
        </div>
        <p className="text-3xl font-black text-accent">{stats.totalAchievements}</p>
        <p className="text-sm text-white/60">
          {stats.recentAchievements > 0 
            ? `${stats.recentAchievements} unlocked recently`
            : 'Keep exploring!'
          }
        </p>
      </div>
    </div>
  );
};
