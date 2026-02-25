// src/pages/DashboardPage.tsx
// v19.0 - REACT QUERY + i18n + REAL API DATA

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Award, TrendingUp, Music, Calendar, Clock,
  Zap, Trophy, Target, Gift, Loader2, Star
} from 'lucide-react';
import { GamiPressProvider, useGamiPressContext } from '../contexts/GamiPressContext';
import { Helmet } from 'react-helmet-async';

// --- HELPER: Formatação de Tempo com i18n ---
function getTimeAgo(timestamp: number, t: (key: string, opts?: Record<string, unknown>) => string): string {
  const seconds = Math.floor((new Date().getTime() - timestamp * 1000) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return t('dashboard.timeAgo.years', { count: Math.floor(interval) });
  interval = seconds / 2592000;
  if (interval > 1) return t('dashboard.timeAgo.months', { count: Math.floor(interval) });
  interval = seconds / 86400;
  if (interval > 1) return t('dashboard.timeAgo.days', { count: Math.floor(interval) });
  interval = seconds / 3600;
  if (interval > 1) return t('dashboard.timeAgo.hours', { count: Math.floor(interval) });
  interval = seconds / 60;
  if (interval > 1) return t('dashboard.timeAgo.minutes', { count: Math.floor(interval) });
  return t('dashboard.timeAgo.seconds', { count: Math.floor(seconds) });
}

interface Achievement {
  id?: number;
  title: string;
  description: string;
  image?: string;
  emoji?: string;
  earned: boolean;
}

// --- COMPONENT: Activity Table ---
const ActivityTable = ({ logs, t }: { logs: any[], t: any }) => {
  if (logs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
        <Clock size={64} className="mb-4" />
        <p className="font-black uppercase tracking-widest text-sm">{t('dashboard.noActivity')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 sm:mx-0">
      <table className="w-full text-left border-separate border-spacing-y-2 px-6 sm:px-0">
        <thead>
          <tr className="text-[10px] font-black uppercase tracking-widest text-white/30">
            <th className="pb-2 pl-4">{t('dashboard.table.activity')}</th>
            <th className="pb-2 text-center">{t('dashboard.table.points')}</th>
            <th className="pb-2 text-right pr-4">{t('dashboard.table.date')}</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => (
            <motion.tr
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white/5 hover:bg-white/10 transition-colors"
            >
              <td className="py-4 pl-4 rounded-l-2xl border-y border-l border-white/5 group-hover:border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform shrink-0">
                    {log.type === 'points_earn' ? <TrendingUp size={14} /> : <Award size={14} />}
                  </div>
                  <span className="text-sm font-bold text-white/90 truncate max-w-[150px] sm:max-w-none">
                    {log.description}
                  </span>
                </div>
              </td>
              <td className="py-4 text-center border-y border-white/5 group-hover:border-primary/20">
                {log.points !== 0 ? (
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black border ${log.points > 0
                    ? 'bg-success/10 text-success border-success/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                    } `}>
                    {log.points > 0 ? `+${log.points}` : log.points} XP
                  </span>
                ) : (
                  <span className="text-white/20">—</span>
                )}
              </td>
              <td className="py-4 text-right pr-4 rounded-r-2xl border-y border-r border-white/5 group-hover:border-primary/20">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-tighter">
                  {getTimeAgo(new Date(log.date).getTime() / 1000, t)}
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DashboardContent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();

  // Hook de Dados Reais — consumido do GamiPressContext (singleton)
  // Agora retorna o novo payload enriquecido v3
  const { data: gamipress, loading } = useGamiPressContext();

  React.useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90">{t('dashboard.loading')}</p>
        </motion.div>
      </div>
    );
  }

  if (!user || !gamipress) return null;

  const pointTypes = Object.entries(gamipress.points);
  const earnedAchievements = gamipress.achievements.filter(a => a.earned);
  const lockedAchievements = gamipress.achievements.filter(a => !a.earned);

  const containerVariants = {
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    hidden: { opacity: 0 }
  };
  const itemVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-black">
      <Helmet>
        <title>{`Dashboard - ${user.name} | DJ Zen Eyer`}</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-7xl">

        {/* --- HERO HEADER / RANK CARD --- */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden bg-surface/30 rounded-3xl p-6 md:p-10 border border-white/10 backdrop-blur-xl">
            {/* Background Decorative Elemets */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent/10 rounded-full blur-[100px]" />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`}
                  alt={user.name}
                  className="relative w-32 h-32 rounded-full border-2 border-white/20 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-yellow-400 to-orange-600 text-black font-black rounded-full w-10 h-10 flex items-center justify-center shadow-2xl scale-125 border-4 border-black">
                  {earnedAchievements.length}
                </div>
              </div >

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
                  {t('dashboard.welcomeBack', { name: user?.display_name || user?.name || t('common.friend') })}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-bold">
                    <Trophy size={16} /> {gamipress.rank.current.title}
                  </div>
                  {gamipress.stats.streakFire && (
                    <div className="flex items-center gap-2 bg-orange-500/20 text-orange-500 border border-orange-500/30 px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      <Zap size={16} fill="currentColor" /> {gamipress.stats.streak} {t('dashboard.dayStreak')}
                    </div>
                  )}
                </div>

                {/* Rank Progression Real */}
                {gamipress.rank.next && (
                  <div className="max-w-md mx-auto md:mx-0">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold text-white/50">{t('dashboard.nextRank')}: <span className="text-white">{gamipress.rank.next.title}</span></span>
                      <span className="text-primary font-black text-lg">{gamipress.rank.progress}%</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${gamipress.rank.progress}%` }}
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </motion.div>
                    </div>

                    {/* Próximos Passos (Requirements) */}
                    {gamipress.rank.requirements && gamipress.rank.requirements.length > 0 && (
                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        {gamipress.rank.requirements.map((req, i) => (
                          <div key={i} className="bg-white/5 border border-white/5 p-2 rounded-xl flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase text-white/40 leading-none">
                              <span className="truncate pr-2">{req.title}</span>
                              <span className={req.percent >= 100 ? 'text-success' : 'text-primary'}>
                                {req.percent >= 100 ? '✓' : `${Math.round(req.percent)}%`}
                              </span>
                            </div>
                            <div className="flex justify-between items-end">
                              <span className="text-xs font-black text-white/90">{req.current} <span className="text-[10px] opacity-30">/ {req.required}</span></span>
                              <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${Math.min(100, req.percent)}%` }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/music')}
                className="btn btn-primary px-8 py-4 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] font-black uppercase tracking-widest text-sm"
              >
                {t('dashboard.boostXP')}
              </motion.button>
            </div >
          </div >
        </motion.div >

        {/* --- MAIN GRID --- */}
        < div className="grid lg:grid-cols-4 gap-6" >

          {/* LEFT COL: Points & Stats */}
          < div className="lg:col-span-1 space-y-6" >
            {/* Wallet / Points Card */}
            < div className="card p-6 border-white/5 overflow-hidden relative" >
              <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={48} /></div>
              <h3 className="text-sm font-black text-white/40 uppercase tracking-widest mb-6">{t('dashboard.yourWallet')}</h3>
              <div className="space-y-6">
                {pointTypes.map(([slug, pt]) => (
                  <motion.div key={slug} whileHover={{ x: 5 }} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {pt.image ? <img src={pt.image} className="w-8 h-8 object-contain" /> : <Star className="text-yellow-500" fill="currentColor" />}
                    </div>
                    <div>
                      <div className="text-2xl font-black">{pt.amount}</div>
                      <div className="text-xs font-bold text-white/40 uppercase leading-none">{pt.name}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div >

            {/* Other Stats */}
            < div className="grid grid-cols-2 gap-4" >
              <div className="card p-4 space-y-1">
                <Music className="text-primary" size={20} />
                <div className="text-2xl font-black">{gamipress.stats.totalTracks}</div>
                <div className="text-[10px] uppercase font-black text-white/40 leading-none">{t('dashboard.tracksDownloaded')}</div>
              </div>
              <div className="card p-4 space-y-1">
                <Calendar className="text-success" size={20} />
                <div className="text-2xl font-black">{gamipress.stats.eventsAttended}</div>
                <div className="text-[10px] uppercase font-black text-white/40 leading-none">{t('dashboard.eventsAttended')}</div>
              </div>
            </div >

            {/* Quick Actions */}
            < div className="card p-6 bg-primary/5 border-primary/20" >
              <h3 className="text-xs font-black uppercase tracking-tighter mb-4 text-primary">{t('dashboard.quickActions')}</h3>
              <div className="space-y-2">
                {[
                  { icon: Music, label: t('dashboard.browseMusic'), path: '/music' },
                  { icon: Calendar, label: t('dashboard.viewEvents'), path: '/events' },
                  { icon: Gift, label: t('dashboard.visitShop'), path: '/shop' }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(act.path)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-sm font-bold group"
                  >
                    <act.icon size={18} className="text-white/40 group-hover:text-primary transition-colors" />
                    {act.label}
                  </button>
                ))}
              </div>
            </div >
          </div >

          {/* CENTER COL: Activity Feed */}
          < div className="lg:col-span-2 space-y-6" >
            <div className="card h-full min-h-[600px] flex flex-col p-6 border-white/5 bg-gradient-to-b from-surface/20 to-transparent">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black font-display flex items-center gap-3">
                  <Clock className="text-primary" size={24} /> {t('dashboard.recentActivity')}
                </h2>
                <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black uppercase text-white/40 border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Live Feed
                </div>
              </div>

              <div className="flex-1">
                <ActivityTable logs={gamipress.logs} t={t} />
              </div>
            </div>
          </div >

          {/* RIGHT COL: Quests / Locked Achievements */}
          < div className="lg:col-span-1 space-y-6" >
            <div className="card p-6 border-white/5 h-full flex flex-col">
              <h2 className="text-xl font-black font-display mb-6 flex items-center gap-3">
                <Target className="text-accent" size={24} /> {t('dashboard.pendingQuests')}
              </h2>

              <div className="space-y-4 flex-1">
                {lockedAchievements.slice(0, 5).map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    whileHover={{ scale: 1.02 }}
                    className="relative p-4 rounded-2xl bg-surface/50 border border-white/5 hover:border-accent/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center grayscale opacity-30 shrink-0">
                        {quest.image ? <img src={quest.image} className="w-6 h-6 object-contain" /> : <Star size={18} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div className="text-sm font-black text-white/80 truncate leading-none">{quest.title}</div>
                          {quest.points_awarded > 0 && (
                            <span className="text-[9px] font-black text-accent bg-accent/10 px-1.5 py-0.5 rounded-md border border-accent/20 flex-shrink-0">
                              +{quest.points_awarded} XP
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-white/40 line-clamp-2 leading-tight uppercase font-bold">{quest.description}</div>
                      </div>
                    </div>
                    <div className="mt-4 h-1.5 bg-background/50 rounded-full overflow-hidden">
                      <div className="h-full w-1/4 bg-accent/20 rounded-full" />
                    </div>
                  </motion.div>
                ))}
                {lockedAchievements.length === 0 && (
                  <div className="text-center opacity-20 py-10">
                    <Trophy size={48} className="mx-auto mb-2" />
                    <p className="text-xs font-black uppercase tracking-widest">{t('dashboard.allCleared')}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/my-account')}
                className="w-full mt-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all border border-white/5"
              >
                {t('gamification.viewAll')}
              </button>
            </div>
          </div>

        </div>

        {/* --- ACHIEVEMENTS GALLERY --- */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12" >
          <div className="card p-8 border-white/5">
            <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
              <h2 className="text-2xl font-black font-display flex items-center gap-4">
                <Award className="text-primary" size={32} /> {t('dashboard.yourAchievements')}
              </h2>
              <div className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
                <div className="text-2xl font-black text-primary">{earnedAchievements.length}</div>
                <div className="text-[10px] font-black uppercase leading-none text-white/50">{t('dashboard.unlocked')}<br />Achievements</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {gamipress.achievements.map((ach) => (
                <motion.div
                  key={ach.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`relative p-5 rounded-3xl border transition-all cursor-default text-center group ${ach.earned
                    ? 'bg-gradient-to-br from-surface to-surface/50 border-primary/20 shadow-xl shadow-primary/5'
                    : 'bg-white/2 opacity-40 border-white/5 border-dashed'
                    }`}
                >
                  {!ach.earned && <div className="absolute top-2 right-2 text-white/20"><Zap size={10} /></div>}
                  <div className={`w-20 h-20 mx-auto mb-4 flex items-center justify-center transition-all ${ach.earned ? 'drop-shadow-[0_0_10px_rgba(99,102,241,0.3)] group-hover:scale-110' : 'grayscale brightness-50'}`}>
                    {ach.image ? (
                      <img src={ach.image} alt={ach.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-white/5 flex items-center justify-center text-4xl">
                        {ach.earned ? '🏆' : '🔒'}
                      </div>
                    )}
                  </div>
                  <div className={`text-xs font-black mb-1 line-clamp-1 truncate uppercase ${ach.earned ? 'text-white' : 'text-white/40'}`}>
                    {ach.title}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    {ach.earned && (
                      <div className="text-[8px] font-black text-success uppercase tracking-widest flex items-center justify-center gap-1">
                        <Award size={8} /> {t('dashboard.unlocked')}
                      </div>
                    )}
                    {ach.points_awarded > 0 && (
                      <div className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/5 border ${ach.earned ? 'text-primary border-primary/20' : 'text-white/20 border-white/5'}`}>
                        +{ach.points_awarded} XP
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div >

      </div >
    </div >
  );
};

const DashboardPage = () => (
  <GamiPressProvider>
    <DashboardContent />
  </GamiPressProvider>
);

export default DashboardPage;
