// src/pages/DashboardPage.tsx
// v19.0 - REACT QUERY + i18n + REAL API DATA

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import {
  Award, Music, Calendar, Clock,
  Zap, Trophy, Loader2, Star,
  Gift, Target
} from 'lucide-react';
import { GamiPressProvider, useGamiPressContext } from '../contexts/GamiPressContext';
import { Helmet } from 'react-helmet-async';
import { RecentActivity } from '../components/account';
import { safeUrl } from '../utils/sanitize';
import ManaProgressBar from '../components/ui/ManaProgressBar';



// --- Activity Table replaced by shared RecentActivity component ---

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
  const earnedAchievements = gamipress.achievements_earned;
  const lockedAchievements = gamipress.achievements_locked;
  const allAchievements = [...earnedAchievements, ...lockedAchievements];

  // Animation variants removed (unused after cleanup)

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>{`Dashboard - ${user.name} | DJ Zen Eyer`}</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-7xl">

        {/* --- HERO HEADER / RANK CARD --- */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="relative overflow-hidden bg-surface glow rounded-[2rem] p-8 md:p-12 border border-white/5 backdrop-blur-2xl">
            {/* Background Decorative Elemets - Refined */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

            <div className="relative flex flex-col md:flex-row items-center gap-10">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <img
                  src={safeUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`}
                  alt={user.name}
                  className="relative w-36 h-36 rounded-full border border-white/10 object-cover shadow-2xl"
                />
                <div className="absolute -bottom-1 -right-1 bg-secondary text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-2xl border-4 border-surface text-xl">
                  {earnedAchievements.length}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 font-display tracking-tight">
                  {t('dashboard.welcomeBack', { name: user?.display_name || user?.name || t('common.friend') })}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-8">
                  <div className="flex items-center gap-3 bg-primary/10 text-primary border border-primary/20 px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-sm">
                    <Trophy size={18} /> {gamipress.rank.current.title}
                  </div>
                  {gamipress.stats.streakFire && (
                    <div className="flex items-center gap-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 px-5 py-2 rounded-full text-sm font-bold animate-pulse uppercase tracking-wider backdrop-blur-sm">
                      <Zap size={18} fill="currentColor" /> {gamipress.stats.streak} {t('dashboard.dayStreak')}
                    </div>
                  )}
                </div>

                {/* Rank Progression Real */}
                {gamipress.rank.next && (
                  <div className="max-w-md mx-auto md:mx-0">
                    <ManaProgressBar
                      progress={gamipress.rank.progress}
                      label={t('dashboard.nextRank')}
                      subLabel={gamipress.rank.next.title}
                    />
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/music')}
                className="btn btn-primary px-10 py-5 rounded-2xl shadow-xl font-bold uppercase tracking-widest text-sm"
              >
                {t('dashboard.boostXP')}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* --- MAIN GRID --- */}
        <div className="grid lg:grid-cols-4 gap-8">

          {/* LEFT COL: Points & Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Wallet / Points Card */}
            <div className="card glow p-8 border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5"><Zap size={64} /></div>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-8 font-display">{t('dashboard.yourWallet')}</h3>
              <div className="space-y-8">
                {pointTypes.map(([slug, pt]) => (
                  <motion.div key={slug} whileHover={{ x: 5 }} className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-colors hover:bg-white/10">
                      {pt.image ? <img src={safeUrl(pt.image)} className="w-9 h-9 object-contain" /> : <Star className="text-yellow-500" fill="currentColor" />}
                    </div>
                    <div>
                      <div className="text-3xl font-black font-display leading-tight">{pt.amount}</div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{pt.name}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div >


            {/* Quick Actions */}
            < div className="card p-8 bg-surface border-white/5" >
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 text-primary font-display">{t('dashboard.quickActions')}</h3>
              <div className="space-y-3">
                {[
                  { icon: Music, label: t('dashboard.browseMusic'), path: '/music' },
                  { icon: Calendar, label: t('dashboard.viewEvents'), path: '/events' },
                  { icon: Gift, label: t('dashboard.visitShop'), path: '/shop' }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(act.path)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 transition-all text-sm font-bold group"
                  >
                    <act.icon size={20} className="text-white/40 group-hover:text-primary transition-colors" />
                    {act.label}
                  </button>
                ))}
              </div>
            </div >
          </div >

          {/* CENTER COL: Activity Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card h-full min-h-[600px] flex flex-col p-8 border-white/5 bg-surface glow">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-bold font-display flex items-center gap-4">
                  <Clock className="text-primary" size={28} /> {t('dashboard.recentActivity')}
                </h2>
                <div className="px-4 py-1.5 bg-background rounded-full text-[10px] font-bold uppercase text-white/40 border border-white/5 flex items-center gap-2 tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> {t('dashboard.live_feed')}
                </div>
              </div>

              <div className="flex-1 opacity-90">
                <RecentActivity logs={gamipress.logs} hideHeader={true} />
              </div>
            </div>
          </div >

          {/* RIGHT COL: Quests / Locked Achievements */}
          <div className="lg:col-span-1 space-y-8">
            <div className="card p-8 border-white/5 h-full flex flex-col bg-surface glow">
              <h2 className="text-xl font-bold font-display mb-8 flex items-center gap-4">
                <Target className="text-secondary" size={28} /> {t('dashboard.pendingQuests')}
              </h2>

              <div className="space-y-4 flex-1">
                {lockedAchievements.map((quest, i) => (
                  <motion.div
                    key={quest.id}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className="relative p-5 rounded-2xl bg-background/50 border border-white/5 hover:border-secondary/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center grayscale opacity-30 shrink-0 group-hover:opacity-100 group-hover:grayscale-0 transition-all">
                        {quest.image ? <img src={safeUrl(quest.image)} className="w-7 h-7 object-contain" /> : <Star size={20} />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start mb-1.5">
                          <div className="text-sm font-bold text-white/90 truncate font-display">{quest.title}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] text-white/40 line-clamp-1 leading-tight uppercase font-medium tracking-tight pr-2">{quest.description}</div>
                          {quest.points_awarded > 0 && (
                            <span className="text-[9px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-md border border-secondary/20 flex-shrink-0">
                              +{quest.points_awarded} XP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {lockedAchievements.length === 0 && (
                  <div className="text-center opacity-20 py-16">
                    <Trophy size={64} className="mx-auto mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">{t('dashboard.allCleared')}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/my-account')}
                className="w-full mt-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all border border-white/5"
              >
                {t('gamification.viewAll')}
              </button>
            </div>
          </div>

        </div>

        {/* --- ACHIEVEMENTS GALLERY (ZEN SHOWCASE) --- */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12">
          <div className="card p-10 border-white/5 bg-surface glow">
            <div className="flex items-center justify-between mb-12 flex-wrap gap-6">
              <h2 className="text-2xl md:text-3xl font-bold font-display flex items-center gap-4">
                <Award className="text-primary" size={36} /> {t('dashboard.yourAchievements')}
              </h2>
              <div className="px-6 py-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-4">
                <div className="text-3xl font-black text-primary font-display">{earnedAchievements.length}</div>
                <div className="text-[11px] font-bold uppercase tracking-wider leading-none text-white/50">{t('dashboard.unlocked')}<br />Achievements</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {allAchievements.map((ach) => (
                <motion.div
                  key={ach.id}
                  whileHover={{ scale: 1.05 }}
                  className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-default text-center group ${ach.earned
                    ? 'bg-background/60 border-primary/20 shadow-lg'
                    : 'bg-white/2 opacity-30 border-white/5 border-dashed lg:grayscale'
                    }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center transition-all duration-500 ${ach.earned ? 'drop-shadow-[0_0_12px_rgba(99,102,241,0.3)] group-hover:scale-110' : ''}`}>
                    {ach.image ? (
                      <img src={safeUrl(ach.image)} alt={ach.title} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-4xl">{ach.earned ? '🏆' : '🔒'}</div>
                    )}
                  </div>

                  <h4 className={`text-xs font-bold mb-1 line-clamp-1 font-display tracking-tight ${ach.earned ? 'text-white' : 'text-white/40'}`}>
                    {ach.title}
                  </h4>

                  <p className="text-[9px] text-white/40 line-clamp-2 uppercase font-medium leading-tight mb-3">
                    {ach.description}
                  </p>

                  <div className="flex flex-col items-center justify-center gap-2">
                    {ach.earned ? (
                      <div className="text-[8px] font-bold text-success uppercase tracking-[0.2em] flex items-center justify-center gap-1 bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                        <Award size={8} /> {t('dashboard.unlocked')}
                      </div>
                    ) : (
                      <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em] flex items-center justify-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        {t('zenTribe.unlockAtLevel', { level: '?' })}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

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
