// src/pages/MyAccountPage.tsx
// v20.0 - PREMIUM UI OVERHAUL + UNIFIED MANA BAR + MUSIC COLLECTION

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import {
  User, Settings, ShoppingBag, Award, Music, LogOut,
  Bell, AlertCircle, Instagram, Save, ChevronRight, Zap, Trophy, Loader2
} from 'lucide-react';
import { UserStatsCards, OrdersList, RecentActivity, MusicCollection } from '../components/account';
import { useProfileQuery, useUpdateProfileMutation, useNewsletterStatusQuery, useUpdateNewsletterMutation, useUserOrdersQuery } from '../hooks/useQueries';
import { GamiPressProvider, useGamiPressContext } from '../contexts/GamiPressContext';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';
import { stripHtml } from '../utils/text';
import ManaProgressBar from '../components/ui/ManaProgressBar';
import { safeUrl } from '../utils/sanitize';

// Interfaces
interface UserStats {
  level: number;
  xp: number;
  rank: string;
  xpToNext: number;
  totalAchievements: number;
  recentAchievements: number;
}

const MyAccountContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, loading, logout } = useUser();
  const currentLang = useMemo(() => normalizeLanguage(i18n.language), [i18n.language]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const { data: gamipress, loading: loadingGP, error: errorGP } = useGamiPressContext();

  // Sync state correctly if parameter changes externally while page is mounted
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  // Handle manual tab switching and URL update
  const handleTabChange = React.useCallback((tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  }, [setSearchParams]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    realName: user?.name || '',
    preferredName: '',
    facebookUrl: '',
    instagramUrl: '',
    danceRole: [] as string[],
    gender: '' as '' | 'male' | 'female' | 'non-binary'
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // ðŸŽ® Computar estatÃ­sticas do usuÃ¡rio COM DADOS REAIS DO BRAIN (GamiPress)
  const userStats: UserStats = useMemo(() => {
    if (!user || !gamipress) {
      return {
        level: 0,
        xp: 0,
        rank: t('dashboard.rank_new_member'),
        xpToNext: 0,
        totalAchievements: 0,
        recentAchievements: 0
      };
    }

    const mainPoints = gamipress.points.points?.amount || 0;
    const currentRank = gamipress.rank.current.title || t('dashboard.rank_zen_novice');

    // Defer level logic to the "Brain" or keep simple visual level (100pt/lvl) if not provided by API
    // Per Dashboard_CONTEXT.md, Brain should return high-level data.
    const level = Math.floor(mainPoints / 100) + 1;
    const xpToNext = gamipress.rank.next ? (100 - (mainPoints % 100)) : 0;
    const totalAchievements = gamipress.achievements_earned.length;
    const recentAchievements = gamipress.recent_achievements.length;

    return {
      level,
      xp: mainPoints,
      rank: currentRank,
      xpToNext,
      totalAchievements,
      recentAchievements
    };
  }, [user, gamipress, t]);

  // Redirect se nÃ£o logado
  useEffect(() => {
    if (!loading && !loadingGP && !user?.isLoggedIn) {
      navigate(getLocalizedRoute('', currentLang));
    }
  }, [user, loading, loadingGP, navigate, currentLang]);

  // React Query Hooks
  const { data: profileData } = useProfileQuery(user?.token);
  const { data: newsletterEnabled } = useNewsletterStatusQuery(user?.token);
  const updateProfile = useUpdateProfileMutation(user?.token);
  const updateNewsletter = useUpdateNewsletterMutation(user?.token);
  const { data: orders = [], isLoading: loadingOrders } = useUserOrdersQuery(user?.id, user?.token, 5);

  // Sync profile data to form state
  useEffect(() => {
    if (profileData) {
      setProfileForm({
        realName: profileData.real_name || user?.name || '',
        preferredName: profileData.preferred_name || '',
        facebookUrl: profileData.facebook_url || '',
        instagramUrl: profileData.instagram_url || '',
        danceRole: profileData.dance_role || [],
        gender: profileData.gender || '',
      });
    }
  }, [profileData, user?.name]);


  const handleLogout = React.useCallback(async () => {
    try {
      await logout();
      navigate(getLocalizedRoute('', currentLang));
    } catch (error) {
      console.error('[MyAccountPage] Erro no logout:', error);
      navigate(getLocalizedRoute('', currentLang));
    }
  }, [logout, navigate, currentLang]);

  const handleProfileChange = React.useCallback((field: string, value: string | string[]) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    setProfileSaved(false);
  }, []);

  const handleSaveProfile = React.useCallback(async () => {
    setSavingProfile(true);
    try {
      await updateProfile.mutateAsync({
        real_name: profileForm.realName,
        preferred_name: profileForm.preferredName,
        facebook_url: profileForm.facebookUrl,
        instagram_url: profileForm.instagramUrl,
        dance_role: profileForm.danceRole,
        gender: profileForm.gender,
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (error) {
      console.error('[MyAccountPage] Error saving profile:', error);
    } finally {
      setSavingProfile(false);
    }
  }, [profileForm, updateProfile]);

  const tabs = useMemo(() => [
    { id: 'overview', label: t('account.tabs.overview'), icon: User, color: 'primary' },
    { id: 'orders', label: t('account.tabs.orders'), icon: ShoppingBag, color: 'secondary' },
    { id: 'achievements', label: t('account.tabs.achievements'), icon: Award, color: 'accent' },
    { id: 'music', label: t('account.tabs.music'), icon: Music, color: 'primary' },
    { id: 'settings', label: t('account.tabs.settings'), icon: Settings, color: 'secondary' },
  ], [t]);

  if (loading || (user?.isLoggedIn && loadingGP)) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <p className="text-2xl font-black font-display uppercase tracking-widest">{t('account.loading')}</p>
        </div>
      </div>
    );
  }

  // Se a API do ZenGame/GamiPress falhar, mostramos um erro amigÃ¡vel na tela da conta
  // para nÃ£o quebrar a UI inteira (tela preta) quando o contexto tentar ler `rank` ou `points`.
  if (errorGP && user?.isLoggedIn) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-white/90 mb-2">{t('dashboard.error_loading')}</p>
          <p className="text-sm text-white/40 mb-6">{errorGP}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary px-8 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-xs"
          >
            {t('common.retry')}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!user?.isLoggedIn || !gamipress) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
            {/* Welcome Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-[2rem] p-10 border border-primary/10 group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Zap size={100} fill="currentColor" className="text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-display mb-4 tracking-tighter">
                {t('dashboard.welcomeBack', { name: user?.display_name || user?.name || t('common.friend') })} ðŸ‘‹
              </h2>
              <p className="text-white/50 text-lg font-medium tracking-tight max-w-xl">
                {t('dashboard.journeyBegins')} {t('dashboard.diveDeep')}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-6">
              {gamipress.rank.next && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-surface/30 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-2xl overflow-hidden relative group"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                    <Trophy size={100} fill="currentColor" />
                  </div>
                  <ManaProgressBar
                    progress={gamipress.rank.progress}
                    label={t('dashboard.nextRank')}
                    subLabel={gamipress.rank.next.title}
                  />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {gamipress.rank.requirements.slice(0, 3).map((req, idx) => (
                      <div key={idx} className="bg-white/5 px-4 py-2 rounded-full border border-white/5 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/40">{req.title}:</span>
                        <span className="text-[10px] font-black text-white/90">{req.current}/{req.required}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              <UserStatsCards stats={userStats} />
            </div>

            {/* Recent Activity */}
            <div className="card p-10 border-white/5 bg-surface/30 backdrop-blur-xl">
              <h3 className="text-2xl font-black font-display mb-10 tracking-tight flex items-center gap-4">
                <div className="w-1.5 h-8 bg-primary rounded-full" />
                {t('dashboard.recentActivity')}
              </h3>
              <RecentActivity logs={gamipress.logs} />
            </div>
          </motion.div>
        );

      case 'orders':
        return <OrdersList orders={orders} loading={loadingOrders} />;

      case 'achievements':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-3xl font-black font-display tracking-tighter leading-none mb-2">{t('dashboard.yourAchievements')}</h2>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">{t('account.profile.milestones', { count: gamipress.achievements_earned.length })}</p>
              </div>
              <div className="bg-primary/20 text-primary px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-primary/20">
                {gamipress.achievements_earned.length} / {gamipress.achievements_earned.length + gamipress.achievements_locked.length}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...gamipress.achievements_earned, ...gamipress.achievements_locked].map((ach: { id: string | number; earned?: boolean; image?: string; title?: string; description?: string }) => (
                <motion.div
                  key={ach.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`relative rounded-[2rem] p-8 border transition-all duration-500 overflow-hidden ${ach.earned
                    ? 'bg-surface/50 border-primary/20 shadow-xl'
                    : 'bg-black/40 border-white/5 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'
                    }`}
                >
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-2xl mb-6 flex items-center justify-center ${ach?.earned ? 'bg-primary/10' : 'bg-white/5'}`}>
                      {ach?.image ? <img src={safeUrl(ach.image)} className="w-12 h-12 object-contain" alt={ach?.title || t('gamification.achievement')} /> : <Award size={32} />}
                    </div>
                    <h4 className="font-black font-display text-xl mb-3 tracking-tight">{ach?.title || t('account.achievement_unknown')}</h4>
                    <p className="text-sm text-white/40 mb-6 leading-relaxed">
                      {ach?.description ? stripHtml(ach.description) : ''}
                    </p>
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-full border ${ach?.earned ? 'bg-success/10 border-success/20 text-success' : 'bg-white/5 border-white/10 text-white/30'}`}>
                      {ach?.earned ? t('dashboard.unlocked') : t('account.locked')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Unified Mana Bar */}
            {gamipress.rank.next && (
              <div className="bg-surface/30 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 mt-12 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                  <Trophy size={150} fill="currentColor" />
                </div>
                <ManaProgressBar
                  progress={gamipress.rank.progress}
                  label={t('dashboard.nextRank')}
                  subLabel={gamipress.rank.next.title}
                />
              </div>
            )}
          </motion.div>
        );

      case 'music':
        return <MusicCollection />;

      case 'settings': {
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <h2 className="text-4xl font-black font-display tracking-tighter mb-10">{t('account.tabs.settings')}</h2>

            {/* Profile Form Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Info */}
              <div className="bg-surface/30 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/20"><User className="text-primary" size={24} /></div>
                  <h3 className="text-xl font-black font-display tracking-tight uppercase">{t('account.profile.identity')}</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3 ml-1">{t('account.profile.real_name')}</label>
                    <input
                      type="text"
                      value={profileForm.realName}
                      onChange={(e) => handleProfileChange('realName', e.target.value)}
                      className="input bg-black/40 border-white/5 focus:border-primary/50 py-4 px-6 rounded-2xl font-medium"
                      placeholder={t('account.profile.real_name')}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-3 ml-1">{t('account.profile.preferred_name')}</label>
                    <input
                      type="text"
                      value={profileForm.preferredName}
                      onChange={(e) => handleProfileChange('preferredName', e.target.value)}
                      className="input bg-black/40 border-white/5 focus:border-primary/50 py-4 px-6 rounded-2xl font-medium"
                      placeholder={t('account.profile.preferred_name')}
                    />
                  </div>
                </div>
              </div>

              {/* Social & Dance */}
              <div className="bg-surface/30 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20"><Instagram className="text-secondary" size={24} /></div>
                  <h3 className="text-xl font-black font-display tracking-tight uppercase">{t('account.profile.social')}</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={profileForm.instagramUrl}
                        onChange={(e) => handleProfileChange('instagramUrl', e.target.value)}
                        className="input bg-black/40 border-white/5 focus:border-secondary/50 py-4 px-5 rounded-2xl text-sm"
                        placeholder={t('account.profile.instagram_placeholder')}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={profileForm.facebookUrl}
                        onChange={(e) => handleProfileChange('facebookUrl', e.target.value)}
                        className="input bg-black/40 border-white/5 focus:border-secondary/50 py-4 px-5 rounded-2xl text-sm"
                        placeholder={t('account.profile.facebook_placeholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 block mb-4 ml-1">{t('account.profile.dance_role')}</label>
                    <div className="flex gap-3">
                      {['leader', 'follower'].map(role => (
                        <button
                          key={role}
                          onClick={() => handleProfileChange('danceRole', profileForm.danceRole.includes(role) ? [] : [role])}
                          className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] border transition-all ${profileForm.danceRole.includes(role) ? 'bg-primary border-primary shadow-neon' : 'bg-white/5 border-white/10 text-white/30 hover:bg-white/10'
                            }`}
                        >
                          {t(`account.profile.${role}`)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter & Security */}
            <div className="bg-surface/30 backdrop-blur-xl rounded-[2rem] p-10 border border-white/5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[1.5rem] bg-accent/10 flex items-center justify-center border border-accent/20"><Bell className="text-accent" size={32} /></div>
                <div>
                  <h4 className="text-2xl font-black font-display tracking-tight mb-2">{t('account.newsletter.title')}</h4>
                  <p className="text-white/40 text-sm font-medium">{t('account.newsletter.desc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">
                  {newsletterEnabled ? t('account.newsletter.enabled') : t('account.newsletter.disabled')}
                </span>
                <button
                  onClick={() => updateNewsletter.mutate(!newsletterEnabled)}
                  className={`w-14 h-8 rounded-full relative transition-colors ${newsletterEnabled ? 'bg-primary' : 'bg-white/10'}`}
                >
                  <motion.div
                    animate={{ x: newsletterEnabled ? 28 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="btn btn-primary px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl flex items-center gap-4 group"
              >
                {savingProfile ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                {profileSaved ? t('account.profile.success') : t('account.profile.save')}
              </button>

              <button
                onClick={handleLogout}
                className="btn bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/5 hover:border-red-500/30 px-10 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all"
              >
                <LogOut size={18} className="mr-3" />
                {t('nav.logout')}
              </button>
            </div>
          </motion.div>
        );
      }

      default:
        return <div>{t('account.tabs.not_found')}</div>;
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('account.meta_title', { stageName: t('common.artist_name') })}</title>
        <meta name="description" content={t('account.meta_desc')} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 bg-background selection:bg-primary selection:text-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 mt-8">

            {/* --- SIDEBAR --- */}
            <aside className="lg:w-1/4">
              <div className="bg-surface/30 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/5 border-b-white/10 sticky top-28 shadow-2xl overflow-hidden group">
                {/* Sidebar Glow */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* User Profile Summary */}
                <div className="text-center mb-12 relative z-10">
                  <div className="relative inline-block mb-6">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-primary via-secondary to-accent rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity animate-pulse" />
                    <img
                      src={safeUrl(user.avatar) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`}
                      className="relative w-32 h-32 rounded-full border-4 border-surface shadow-2xl object-cover"
                      alt={user.name}
                    />
                  </div>
                  <h2 className="text-2xl font-black font-display tracking-tight mb-2 truncate px-2">{user.display_name || user.name}</h2>
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-neon shadow-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80">{userStats.rank}</span>
                  </div>
                </div>

                {/* Sidebar Nav */}
                <nav className="space-y-3 relative z-10">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all group/btn ${activeTab === tab.id
                        ? 'bg-primary text-white shadow-neon shadow-primary/20 scale-105'
                        : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5'
                        }`}
                    >
                      <div className="flex items-center gap-5">
                        <tab.icon size={20} className={activeTab === tab.id ? 'text-white' : 'text-white/20 group-hover/btn:text-white transition-colors'} />
                        {tab.label}
                      </div>
                      {activeTab === tab.id && <ChevronRight size={16} className="text-white/50" />}
                    </button>
                  ))}
                </nav>

                {/* Sidebar Footer Info */}
                <div className="mt-12 pt-8 border-t border-white/5 text-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10 group-hover:text-white/20 transition-colors">
                  Zen Tribe v2.1.0 Â· 2026
                </div>
              </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="lg:flex-1 min-h-[700px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "circOut" }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </main>

          </div>
        </div>
      </div>
    </>
  );
};

const MyAccountPage: React.FC = () => {
  return (
    <GamiPressProvider>
      <MyAccountContent />
    </GamiPressProvider>
  );
};

export default MyAccountPage;

