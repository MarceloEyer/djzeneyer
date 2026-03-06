// src/pages/DashboardPage.tsx
// v20.0 - PREMIUM UI OVERHAUL + i18n + REAL API DATA

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
import { stripHtml } from '../utils/text';
import ManaProgressBar from '../components/ui/ManaProgressBar';



// --- Activity Table replaced by shared RecentActivity component ---

const DashboardContent = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const navigate = useNavigate();

  // Hook de Dados Reais — consumido do GamiPressContext (singleton)
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

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <Helmet>
        <title>{`Dashboard - ${user.name} | DJ Zen Eyer`}</title>
      </Helmet>
      <div className="container mx-auto px-4 max-w-7xl">

        {/* --- HERO HEADER / RANK CARD --- */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="relative overflow-hidden bg-surface/50 glow rounded-[2.5rem] p-8 md:p-12 border border-white/5 backdrop-blur-2xl shadow-2xl">
            {/* Background Decorative Elements */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

            <div className="relative flex flex-col md:flex-row items-center gap-12">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-secondary to-accent rounded-full blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse" />
                <img
                  src={safeUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`}
                  alt={user.name}
                  className="relative w-40 h-40 rounded-full border-2 border-white/10 object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-secondary to-accent text-white font-black rounded-full w-14 h-14 flex items-center justify-center shadow-2xl border-4 border-surface text-xl drop-shadow-lg">
                  {earnedAchievements.length}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 font-display tracking-tighter leading-tight">
                  {t('dashboard.welcomeBack', { name: user?.display_name || user?.name || t('common.friend') })}
                </h1>
                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 mb-10">
                  <div className="flex items-center gap-3 bg-primary/20 text-primary border border-primary/30 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_20px_rgba(var(--color-primary),0.1)]">
                    <Trophy size={18} /> {gamipress.rank.current.title}
                  </div>
                  {gamipress.stats.streakFire && (
                    <div className="flex items-center gap-3 bg-orange-500/20 text-orange-500 border border-orange-500/30 px-6 py-2.5 rounded-full text-xs font-black animate-pulse uppercase tracking-[0.2em] backdrop-blur-md">
                      <Zap size={18} fill="currentColor" /> {gamipress.stats.streak} {t('dashboard.dayStreak')}
                    </div>
                  )}
                </div>

                {/* Rank Progression Real */}
                {gamipress.rank.next && (
                  <div className="max-w-md mx-auto md:mx-0">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                      <ManaProgressBar
                        progress={gamipress.rank.progress}
                        label={t('dashboard.nextRank')}
                        subLabel={gamipress.rank.next.title}
                      />
                      <div className="mt-4 flex flex-wrap gap-2">
                        {gamipress.rank.requirements.slice(0, 3).map((req, idx) => (
                          <div key={idx} className="bg-white/5 px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">{req.title}</span>
                            <span className="text-[10px] font-black text-white/90">{req.current}/{req.required}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(var(--color-primary), 0.4)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/music')}
                className="btn btn-primary px-12 py-6 rounded-2xl shadow-2xl font-black uppercase tracking-[0.3em] text-xs h-fit"
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
            <div className="card glow p-8 border-primary/10 relative overflow-hidden bg-surface/40 backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-primary"><Zap size={64} fill="currentColor" /></div>
              <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.25em] mb-10 font-display flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.8)]" />
                {t('dashboard.yourWallet')}
              </h3>
              <div className="space-y-10">
                {pointTypes.map(([slug, pt]) => (
                  <motion.div key={slug} whileHover={{ x: 8 }} transition={{ type: 'spring', stiffness: 300 }} className="flex items-center gap-6 group">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:bg-primary/10 group-hover:border-primary/30 group-hover:shadow-[0_0_20px_rgba(var(--color-primary),0.2)]">
                      {pt.image ? <img src={safeUrl(pt.image)} className="w-10 h-10 object-contain drop-shadow-md" /> : <Star className="text-yellow-500" fill="currentColor" size={32} />}
                    </div>
                    <div>
                      <div className="text-4xl font-black font-display leading-none tracking-tighter group-hover:text-primary transition-colors">{pt.amount}</div>
                      <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1.5">{pt.name}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div >


            {/* Quick Actions */}
            < div className="card p-8 border-white/5 bg-surface/20 backdrop-blur-md" >
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-primary/60 font-display flex items-center gap-2">
                <Target size={14} /> {t('dashboard.quickActions')}
              </h3>
              <div className="space-y-4">
                {[
                  { icon: Music, label: t('dashboard.browseMusic'), path: '/music', color: 'primary' },
                  { icon: Calendar, label: t('dashboard.viewEvents'), path: '/events', color: 'secondary' },
                  { icon: Gift, label: t('dashboard.visitShop'), path: '/shop', color: 'accent' }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(act.path)}
                    className="w-full flex items-center gap-5 p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all text-sm font-black group relative overflow-hidden"
                  >
                    <act.icon size={22} className="text-white/30 group-hover:text-white transition-all transform group-hover:scale-110" />
                    <span className="group-hover:translate-x-1 transition-transform">{act.label}</span>
                  </button>
                ))}
              </div>
            </div >
          </div >

          {/* CENTER COL: Activity Feed */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card h-full min-h-[600px] flex flex-col p-8 border-white/5 bg-surface/30 backdrop-blur-xl group relative">
              {/* Decorative border glow */}
              <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/10 transition-colors pointer-events-none rounded-[inherit]" />

              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black font-display flex items-center gap-5 tracking-tight">
                  <Clock className="text-primary drop-shadow-[0_0_8px_rgba(var(--color-primary),0.5)]" size={32} />
                  {t('dashboard.recentActivity')}
                </h2>
                <div className="px-5 py-2 bg-black/40 rounded-full text-[10px] font-black uppercase text-white/40 border border-white/5 flex items-center gap-3 tracking-[0.25em] shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-success animate-ping" />
                  <span className="opacity-80">{t('dashboard.live_feed')}</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide custom-activity-feed">
                <RecentActivity logs={gamipress.logs} hideHeader={true} />
              </div>
            </div>
          </div >

          {/* RIGHT COL: Quests / Locked Achievements */}
          <div className="lg:col-span-1 space-y-8">
            <div className="card p-8 border-secondary/10 h-full flex flex-col bg-surface/40 backdrop-blur-xl">
              <h2 className="text-2xl font-black font-display mb-10 flex items-center gap-5 tracking-tight">
                <Target className="text-secondary drop-shadow-[0_0_8px_rgba(var(--color-secondary),0.5)]" size={32} />
                {t('dashboard.pendingQuests')}
              </h2>

              <div className="space-y-5 flex-1 pr-1 overflow-y-auto scrollbar-hide">
                {lockedAchievements.map((quest) => (
                  <motion.div
                    key={quest.id}
                    whileHover={{ scale: 1.04, x: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    className="relative p-6 rounded-[1.5rem] bg-black/30 border border-white/5 hover:border-secondary/40 transition-all group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="flex items-center gap-5 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center grayscale opacity-20 shrink-0 group-hover:opacity-100 group-hover:grayscale-0 transition-all shadow-inner">
                        {quest.image ? <img src={safeUrl(quest.image)} className="w-8 h-8 object-contain" /> : <Award size={24} className="text-secondary" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-black text-white/90 truncate font-display tracking-tight mb-1">{quest.title}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] text-white/30 line-clamp-2 leading-relaxed uppercase font-black tracking-widest">{quest.description}</div>
                        </div>
                      </div>
                    </div>

                    {quest.points_awarded > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                        <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20 shadow-sm">
                          +{quest.points_awarded} XP
                        </span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {lockedAchievements.length === 0 && (
                  <div className="text-center opacity-10 py-24 flex flex-col items-center">
                    <Trophy size={80} className="mb-6" />
                    <p className="text-sm font-black uppercase tracking-[0.4em]">{t('dashboard.allCleared')}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => navigate('/my-account')}
                className="w-full mt-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all border border-white/10 shadow-lg"
              >
                {t('gamification.viewAll')}
              </button>
            </div>
          </div>

        </div>

        {/* --- ACHIEVEMENTS GALLERY (ZEN SHOWCASE) --- */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="mt-12">
          <div className="card p-12 border-primary/10 bg-surface/30 backdrop-blur-2xl relative overflow-hidden">
            {/* Decorative Background for Section */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />

            <div className="flex items-center justify-between mb-16 flex-wrap gap-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-black font-display flex items-center gap-6 tracking-tighter">
                  <Award className="text-primary drop-shadow-[0_0_15px_rgba(var(--color-primary),0.6)]" size={48} />
                  {t('dashboard.yourAchievements')}
                </h2>
                <p className="text-white/40 mt-3 font-medium uppercase tracking-[0.3em] text-xs ml-2">{t('gamification.zenTribe')} Milestone Collection</p>
              </div>
              <div className="px-8 py-5 bg-primary/10 border-2 border-primary/20 rounded-[2rem] flex items-center gap-6 shadow-[0_0_30px_rgba(var(--color-primary),0.1)] backdrop-blur-md">
                <div className="text-5xl font-black text-primary font-display leading-none">{earnedAchievements.length}</div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] leading-tight text-white/60">
                  {t('dashboard.unlocked')}<br />
                  <span className="text-primary/70">Masteries</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allAchievements.map((ach) => (
                <motion.div
                  key={ach.id}
                  whileHover={{ y: -8, scale: 1.03 }}
                  className={`relative group rounded-[2rem] p-7 border transition-all duration-500 overflow-hidden ${ach.earned
                    ? 'bg-[#0a0f16]/80 border-cyan-500/30 shadow-[0_0_30px_rgba(0,194,255,0.15)] hover:border-cyan-400/60'
                    : 'bg-black/40 border-white/5 opacity-40 grayscale hover:opacity-90 hover:grayscale-0'
                    }`}
                >
                  {/* Sweep Light Animation on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center text-center">
                    {/* Badge Artifact Container */}
                    <div className="relative mb-8 pt-4">
                      {ach.earned && (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                          className="absolute inset-[-15px] border border-cyan-500/20 rounded-full border-dashed"
                        />
                      )}
                      <div className={`w-24 h-24 relative flex items-center justify-center transition-transform duration-500 group-hover:rotate-[5deg] ${ach.earned ? 'drop-shadow-[0_0_15px_rgba(0,194,255,0.6)]' : ''}`}>
                        {/* Hexagonal Background Layer */}
                        <div className={`absolute inset-0 rotate-45 rounded-2xl ${ach.earned ? 'bg-cyan-500/10 border-2 border-cyan-400/40' : 'bg-white/5 border border-white/10'}`} />
                        <div className={`absolute inset-0 -rotate-45 rounded-2xl ${ach.earned ? 'bg-cyan-500/5 border-2 border-cyan-400/20' : 'bg-white/5 border border-white/5'}`} />

                        <div className="relative z-10">
                          {ach.image ? (
                            <img src={safeUrl(ach.image)} alt={ach.title} className={`w-14 h-14 object-contain ${!ach.earned && 'opacity-20'}`} />
                          ) : (
                            <span className="text-4xl">{ach.earned ? '🏆' : '🔒'}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-black font-display text-xl mb-2 tracking-tight group-hover:text-cyan-400 transition-colors uppercase">{ach.title}</h4>
                    <p className="text-[11px] text-white/30 mb-6 min-h-[2.5rem] leading-tight font-medium uppercase tracking-wider">
                      {stripHtml(ach.description)}
                    </p>

                    <div className="w-full pt-8 border-t border-white/5 flex items-center justify-center">
                      {ach.earned ? (
                        <div className="text-[10px] font-black text-success uppercase tracking-[0.4em] flex items-center gap-3">
                          <Award size={16} />
                          {t('dashboard.unlocked')}
                        </div>
                      ) : (
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] flex items-center gap-3">
                          <Zap size={16} />
                          {t('gamification.unlock_at', { level: '?' })}
                        </div>
                      )}
                    </div>
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
