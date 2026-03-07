/**
 * RecentActivity - User Activity Feed
 * 
 * Exibe atividades recentes do usuário (achievements, etc)
 * Extraído de MyAccountPage para melhor organização
 */

import React, { memo } from 'react';
import { Music, Calendar, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ZenGameLog } from '../../types/gamification';

interface RecentActivityProps {
  logs?: ZenGameLog[];
  hideHeader?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = memo(({ logs, hideHeader = false }) => {
  const { t, i18n } = useTranslation();
  const hasLogs = logs && logs.length > 0;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`${!hideHeader ? 'bg-surface/50 rounded-lg p-6 border border-white/10' : ''}`}>
      {!hideHeader && (
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Clock className="text-primary" size={20} />
          {t('dashboard.recentActivity')}
        </h3>
      )}
      <div className="space-y-3">
        {hasLogs ? (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
            >
              <div className={`p-2 rounded-lg ${log.points >= 0 ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-400'}`}>
                {log.points >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate group-hover:text-primary transition-colors">{log.description}</p>
                <p className="text-xs text-white/40 flex items-center gap-1">
                  <Clock size={10} /> {formatDate(log.date)}
                </p>
              </div>
              <div className={`font-mono font-bold ${log.points >= 0 ? 'text-success' : 'text-red-400'}`}>
                {log.points >= 0 ? '+' : ''}{log.points}
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Music className="text-primary" size={20} />
              <div>
                <p className="font-medium">{t('dashboard.welcomeTribe')}</p>
                <p className="text-sm text-white/60">{t('dashboard.journeyBegins')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
              <Calendar className="text-accent" size={20} />
              <div>
                <p className="font-medium">{t('dashboard.accountCreated')}</p>
                <p className="text-sm text-white/60">{t('dashboard.startExploring')}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary re-renders.
RecentActivity.displayName = 'RecentActivity';
