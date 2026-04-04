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
import { getDateTimeFormatter } from '../../utils/date';

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
      return getDateTimeFormatter(i18n.language === 'pt' ? 'pt-BR' : 'en-US', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className={`${!hideHeader ? 'bg-surface/30 backdrop-blur-xl rounded-[1.5rem] p-8 border border-white/10 shadow-2xl' : ''}`}>
      {!hideHeader && (
        <h3 className="text-2xl font-black mb-8 flex items-center gap-3 font-display tracking-tight text-white uppercase">
          <Clock className="text-primary animate-pulse" size={24} />
          {t('dashboard.recentActivity')}
        </h3>
      )}
      <div className="relative space-y-6 before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-primary/40 before:via-secondary/20 before:to-transparent">
        {hasLogs ? (
          logs.map((log) => (
            <div
              key={log.id}
              className="relative pl-14 group transition-all duration-300"
            >
              {/* Timeline Indicator */}
              <div className={`absolute left-4 top-1 h-4 w-4 rounded-full border-2 bg-background z-10 transition-colors group-hover:scale-110 shadow-neon-sm ${
                log.points >= 0 ? 'border-primary' : 'border-red-500'
              }`} />
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all hover:translate-x-1 shadow-sm">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  log.points >= 0 ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-400'
                }`}>
                  {log.points >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white/90 leading-tight mb-1">{log.description}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {formatDate(log.date)}
                  </p>
                </div>
                
                <div className={`text-sm font-black font-display px-2 py-1 rounded-lg bg-black/40 ${
                  log.points >= 0 ? 'text-primary' : 'text-red-400'
                }`}>
                  {log.points >= 0 ? '+' : ''}{log.points}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-6">
            <div className="relative pl-14 group transition-all">
              <div className="absolute left-4 top-1 h-4 w-4 rounded-full border-2 border-primary bg-background z-10" />
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
                  <Music size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">{t('dashboard.welcomeTribe')}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-none mt-1">{t('dashboard.journeyBegins')}</p>
                </div>
              </div>
            </div>
            
            <div className="relative pl-14 group transition-all">
              <div className="absolute left-4 top-1 h-4 w-4 rounded-full border-2 border-accent bg-background z-10" />
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-white/90">{t('dashboard.accountCreated')}</p>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-none mt-1">{t('dashboard.startExploring')}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

// ⚡ Bolt: Wrapped with React.memo to prevent unnecessary re-renders.
RecentActivity.displayName = 'RecentActivity';
