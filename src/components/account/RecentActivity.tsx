/**
 * RecentActivity - User Activity Feed
 * 
 * Exibe atividades recentes do usuário (achievements, etc)
 * Extraído de MyAccountPage para melhor organização
 */

import { Award, Music, Calendar } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
}

interface RecentActivityProps {
  achievements?: Achievement[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ achievements }) => {
  const hasAchievements = achievements && achievements.length > 0;

  return (
    <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
      <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {hasAchievements ? (
          achievements.slice(-3).reverse().map((achievement) => (
            <div 
              key={achievement.id} 
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Award className="text-secondary flex-shrink-0" size={20} />
              <div className="flex-1">
                <p className="font-medium">{achievement.title}</p>
                <p className="text-sm text-white/60">Recently achieved</p>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Music className="text-primary" size={20} />
              <div>
                <p className="font-medium">Welcome to Zen Tribe!</p>
                <p className="text-sm text-white/60">Your journey begins now</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Calendar className="text-accent" size={20} />
              <div>
                <p className="font-medium">Account created</p>
                <p className="text-sm text-white/60">Start exploring!</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
