// src/pages/MyAccountPage.tsx
// REFATORADO: Componentes extraídos para melhor organização (SRP)

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { User, Settings, ShoppingBag, Award, Music, LogOut, Edit3, Bell, Shield, Lock, AlertCircle, Headphones, Instagram, Facebook, Save } from 'lucide-react';
import { UserStatsCards, OrdersList, RecentActivity } from '../components/account';
import { useProfileQuery, useUpdateProfileMutation, useNewsletterStatusQuery, useUpdateNewsletterMutation } from '../hooks/useQueries';
import { GamiPressProvider, useGamiPressContext } from '../contexts/GamiPressContext';
import { useSearchParams } from 'react-router-dom';
import { getLocalizedRoute, normalizeLanguage } from '../config/routes';

// Interfaces
interface Order {
  id: number;
  status: string;
  date_created: string;
  total: string;
  line_items: Array<{
    name: string;
    quantity: number;
    total: string;
  }>;
}

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync state correctly if parameter changes externally while page is mounted
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Handle manual tab switching and URL update
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    realName: user?.name || '',
    preferredName: '',
    facebookUrl: '',
    instagramUrl: '',
    danceRole: [] as string[], // 'leader', 'follower', or both
    gender: '' as '' | 'male' | 'female' | 'non-binary'
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  if (import.meta.env.DEV) {
    console.log('[MyAccountPage] User:', user);
  }

  const { data: gamipress, loading: loadingGP } = useGamiPressContext();

  // 🎮 Computar estatísticas do usuário COM DADOS REAIS
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

    // ✅ DADOS REAIS DO GAMIPRESS v1.1.0 (Refatorado para v1.2.0)
    const mainPoints = gamipress.points.points?.amount || 0;
    const currentRank = gamipress.rank.current.title || t('dashboard.rank_zen_novice');

    // Calcular level baseado em pontos (cada 100 pontos = 1 level) - Mantendo lógica visual
    const level = Math.floor(mainPoints / 100) + 1;

    // XP para o próximo nível (baseado no rank real do backend se possível)
    const xpToNext = gamipress.rank.next ? (100 - (mainPoints % 100)) : 0;

<<<<<<< HEAD
    const totalAchievements = gamipress.achievements.length;
    const earnedAchievements = gamipress.earned_achievements || [];
    const recentAchievements = earnedAchievements.length;
=======
    const totalAchievements = gamipress.achievements_earned.length + gamipress.achievements_locked.length;
    const recentAchievements = gamipress.recent_achievements.length;
>>>>>>> origin/main

    return {
      level,
      xp: mainPoints,
      rank: currentRank,
      xpToNext,
      totalAchievements,
      recentAchievements
    };
  }, [user, gamipress]);

  // Redirect se não logado
  useEffect(() => {
    if (!loading && !user?.isLoggedIn) {
      if (import.meta.env.DEV) {
        console.log('[MyAccountPage] ❌ Usuário não logado, redirecionando...');
      }
      navigate(getLocalizedRoute('', currentLang));
    }
  }, [user, loading, navigate]);

  // React Query Hooks
  const { data: profileData, isLoading: loadingProfile } = useProfileQuery(user?.token);
  const { data: newsletterEnabled } = useNewsletterStatusQuery(user?.token);
  const updateProfile = useUpdateProfileMutation(user?.token);
  const updateNewsletter = useUpdateNewsletterMutation(user?.token);

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

  // Fetch orders
  useEffect(() => {
    if (user?.isLoggedIn) {
      fetchOrders();
    }
  }, [user]);


  // Toggle newsletter subscription
  const handleNewsletterToggle = async (enabled: boolean) => {
    try {
      await updateNewsletter.mutateAsync(enabled);
    } catch (error) {
      console.error('[MyAccountPage] Error toggling newsletter:', error);
    }
  };

  const fetchOrders = async () => {
    if (!user?.token) {
      setLoadingOrders(false);
      return;
    }

    const wpData = (window as any).wpData || { restUrl: '', nonce: '' };
    if (!wpData.restUrl) {
      console.error('[MyAccountPage] WordPress data not available');
      setLoadingOrders(false);
      return;
    }

    try {
      const response = await fetch(`${wpData.restUrl}wc/v3/orders?customer=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'X-WP-Nonce': wpData.nonce,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.slice(0, 5));
      }
    } catch (error) {
      console.error('[MyAccountPage] Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    if (import.meta.env.DEV) {
      console.log('[MyAccountPage] 🚪 Logout iniciado');
    }
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('[MyAccountPage] Erro no logout:', error);
      navigate('/');
    }
  };

  // Loading spinner
  const LoadingSpinner = ({ message }: { message?: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center pt-24"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-xl font-semibold">{t('loading')}</p>
      </div>
    </motion.div>
  );

  if (loading || (user?.isLoggedIn && loadingGP)) {
    return <LoadingSpinner message={t('account.loading')} />;
  }

  if (!user?.isLoggedIn) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: t('account.tabs.overview'), icon: User },
    { id: 'orders', label: t('account.tabs.orders'), icon: ShoppingBag },
    { id: 'achievements', label: t('account.tabs.achievements'), icon: Award },
    { id: 'music', label: t('account.tabs.music'), icon: Music },
    { id: 'settings', label: t('account.tabs.settings'), icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-2">
                {t('dashboard.welcomeBack', { name: user.name })} 👋
              </h2>
              <p className="text-white/70">{t('dashboard.journeyBegins')}</p>
            </div>

            {/* Quick Stats */}
            <UserStatsCards stats={userStats} />

            {/* Recent Activity - Pass REAL LOGS from GamiPress context */}
            <RecentActivity logs={gamipress.logs} />
          </div>
        );

      case 'orders':
        return <OrdersList orders={orders} loading={loadingOrders} />;

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('dashboard.yourAchievements')}</h2>
              <div className="text-sm text-white/60 bg-white/5 px-4 py-2 rounded-full">
                {gamipress.achievements_earned.length} {t('dashboard.unlocked')}
              </div>
            </div>

            {[...gamipress.achievements_earned, ...gamipress.achievements_locked].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...gamipress.achievements_earned, ...gamipress.achievements_locked].map((achievement: any) => (
                  <motion.div
                    key={achievement.id}
                    className="bg-surface/50 rounded-lg p-5 border border-white/10 hover:border-primary/50 transition-all hover:scale-105"
                    whileHover={{ y: -4 }}
                  >
                    <div className="text-5xl mb-3 text-center">🏆</div>
                    <h4 className="font-display text-lg mb-2 text-center font-bold">
                      {achievement.title}
                    </h4>
                    {achievement.description && (
                      <p className="text-sm text-white/70 text-center mb-3">
                        {achievement.description}
                      </p>
                    )}
                    <div className="text-center">
                      <span className={`inline-flex items-center text-xs px-3 py-1 rounded-full font-semibold ${achievement.earned ? 'bg-success/20 text-success' : 'bg-white/10 text-white/40'}`}>
                        <Award size={12} className="mr-1" />
                        {achievement.earned ? t('dashboard.unlocked') : t('account.locked')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Award className="mx-auto mb-4 text-white/30" size={64} />
                <h3 className="text-2xl font-semibold mb-3">{t('account.no_achievements')}</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  {t('account.no_achievements_desc')}
                </p>
                <Link to={getLocalizedRoute('dashboard', currentLang)} className="btn btn-primary btn-lg">
                  {t('account.start_journey')}
                </Link>
              </div>
            )}

            {/* Progress bar para próximo rank (Sync com regra de 1000pt) */}
            {gamipress.rank.next && (
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">{t('dashboard.nextRank')}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2 text-white/80">
                      <span>{gamipress.rank.current.title}</span>
                      <span>
                        {gamipress.rank.next.title}
                      </span>
                    </div>
                    {/* Fighting Game Style Power Bar (Synced with Dashboard) */}
                    <div className="h-4 bg-black/40 border border-white/10 relative overflow-hidden -skew-x-12 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] mb-2">
                      {/* Segmented Background */}
                      <div className="absolute inset-0 opacity-5 flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex-1 border-r border-white/20" />
                        ))}
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${gamipress.rank.progress}%` }}
                        className="h-full bg-gradient-to-r from-primary via-accent to-white relative shadow-[0_0_20px_rgba(99,102,241,0.6)]"
                        transition={{ duration: 1, ease: "easeOut" }}
                      >
                        {/* Animated Stripe Overlay */}
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.05)_10px,rgba(255,255,255,0.05)_20px)]" />

                        {/* Leading Edge Sparkle */}
                        <div className="absolute top-0 right-0 h-full w-4 bg-white/30 blur-md" />
                        <div className="absolute top-0 right-0 h-full w-1 bg-white animate-pulse" />
                      </motion.div>
                    </div>
                    <p className="text-xs text-white/60 mt-2">
                      <strong>{gamipress.rank.requirements[0]?.required - gamipress.rank.requirements[0]?.current || 0} XP</strong> {t('dashboard.nextRank')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'music':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('account.music.title')}</h2>
              <Link to={getLocalizedRoute('music', currentLang)} className="btn btn-primary">
                {t('account.music.browse')}
              </Link>
            </div>

            <div className="text-center py-20">
              <Headphones className="mx-auto mb-4 text-white/30" size={64} />
              <h3 className="text-2xl font-semibold mb-3">{t('account.music.empty_title')}</h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                {t('account.music.empty_desc')}
              </p>
              <Link to={getLocalizedRoute('music', currentLang)} className="btn btn-primary btn-lg">
                {t('account.music.explore')}
              </Link>
            </div>
          </div>
        );

      case 'settings':
        const handleProfileChange = (field: string, value: string | string[]) => {
          setProfileForm(prev => ({ ...prev, [field]: value }));
          setProfileSaved(false);
        };

        const handleDanceRoleToggle = (role: string) => {
          setProfileForm(prev => {
            const roles = prev.danceRole.includes(role)
              ? prev.danceRole.filter(r => r !== role)
              : [...prev.danceRole, role];
            return { ...prev, danceRole: roles };
          });
          setProfileSaved(false);
        };

        const handleSaveProfile = async () => {
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
        };

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t('nav.my_account')}</h2>

            {/* Profile Settings */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">{t('profile.title')}</h3>
              </div>
              <div className="space-y-4">
                {/* Real Name */}
                <div>
                  <label htmlFor="account-real-name" className="block text-sm font-semibold mb-2">
                    {t('profile.real_name')} <span className="text-white/50 font-normal">({t('profile.real_name_hint')})</span>
                  </label>
                  <input
                    id="account-real-name"
                    name="account-real-name"
                    type="text"
                    value={profileForm.realName}
                    onChange={(e) => handleProfileChange('realName', e.target.value)}
                    autoComplete="name"
                    placeholder={t('profile.real_name')}
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Preferred Name */}
                <div>
                  <label htmlFor="account-preferred-name" className="block text-sm font-semibold mb-2">
                    {t('profile.preferred_name')} <span className="text-white/50 font-normal">({t('profile.preferred_name_hint')})</span>
                  </label>
                  <input
                    id="account-preferred-name"
                    name="account-preferred-name"
                    type="text"
                    value={profileForm.preferredName}
                    onChange={(e) => handleProfileChange('preferredName', e.target.value)}
                    placeholder={t('profile.preferred_name')}
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label htmlFor="account-email" className="block text-sm font-semibold mb-2">{t('profile.email')}</label>
                  <input
                    id="account-email"
                    name="account-email"
                    type="email"
                    value={user.email}
                    autoComplete="email"
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg text-white/50"
                    disabled
                  />
                </div>

                {/* Social Media */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="account-facebook" className="block text-sm font-semibold mb-2">
                      <Facebook size={16} className="inline mr-2" />
                      {t('profile.facebook')}
                    </label>
                    <input
                      id="account-facebook"
                      name="account-facebook"
                      type="url"
                      value={profileForm.facebookUrl}
                      onChange={(e) => handleProfileChange('facebookUrl', e.target.value)}
                      placeholder={t('profile.facebook_placeholder')}
                      className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="account-instagram" className="block text-sm font-semibold mb-2">
                      <Instagram size={16} className="inline mr-2" />
                      {t('profile.instagram')}
                    </label>
                    <input
                      id="account-instagram"
                      name="account-instagram"
                      type="url"
                      value={profileForm.instagramUrl}
                      onChange={(e) => handleProfileChange('instagramUrl', e.target.value)}
                      placeholder={t('profile.instagram_placeholder')}
                      className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Dance Role */}
                <div>
                  <label className="block text-sm font-semibold mb-3">
                    {t('profile.dance_role')} <span className="text-white/50 font-normal">({t('profile.dance_role_hint')})</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleDanceRoleToggle('leader')}
                      className={`px-5 py-2.5 rounded-lg border transition-all ${profileForm.danceRole.includes('leader')
                        ? 'bg-primary border-primary text-white'
                        : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                    >
                      {t('profile.leader')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDanceRoleToggle('follower')}
                      className={`px-5 py-2.5 rounded-lg border transition-all ${profileForm.danceRole.includes('follower')
                        ? 'bg-secondary border-secondary text-white'
                        : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                    >
                      {t('profile.follower')}
                    </button>
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold mb-3">{t('profile.gender')}</label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 'male', labelKey: 'profile.male' },
                      { value: 'female', labelKey: 'profile.female' },
                      { value: 'non-binary', labelKey: 'profile.non_binary' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleProfileChange('gender', option.value)}
                        className={`px-5 py-2.5 rounded-lg border transition-all ${profileForm.gender === option.value
                          ? 'bg-accent border-accent text-white'
                          : 'border-white/20 text-white/70 hover:border-white/40'
                          }`}
                      >
                        {t(option.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {savingProfile ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        {t('profile.saving')}
                      </>
                    ) : profileSaved ? (
                      <>
                        <span className="text-success">✓</span>
                        {t('profile.saved')}
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {t('profile.save')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-secondary" size={24} />
                <h3 className="text-xl font-semibold">{t('account.notifications.title')}</h3>
              </div>
              <div className="space-y-3">
                <label htmlFor="notify-events" className="flex items-center gap-3 cursor-pointer">
                  <input id="notify-events" name="notify-events" type="checkbox" className="w-5 h-5" defaultChecked />
                  <span>{t('account.notifications.events')}</span>
                </label>
                <label htmlFor="notify-achievements" className="flex items-center gap-3 cursor-pointer">
                  <input id="notify-achievements" name="notify-achievements" type="checkbox" className="w-5 h-5" defaultChecked />
                  <span>{t('account.notifications.achievements')}</span>
                </label>
                <label htmlFor="notify-marketing" className="flex items-center gap-3 cursor-pointer">
                  <input id="notify-marketing" name="notify-marketing" type="checkbox" className="w-5 h-5" />
                  <span>{t('account.notifications.marketing')}</span>
                </label>
                <div className="pt-3 border-t border-white/10">
                  <label htmlFor="notify-newsletter" className="flex items-center justify-between cursor-pointer">
                    <div>
                      <div className="flex items-center gap-3">
                        <input
                          id="notify-newsletter"
                          name="notify-newsletter"
                          type="checkbox"
                          className="w-5 h-5"
                          checked={newsletterEnabled || false}
                          disabled={updateNewsletter.isPending}
                          onChange={(e) => handleNewsletterToggle(e.target.checked)}
                        />
                        <span className="font-semibold">{t('account_page.newsletter_toggle')}</span>
                      </div>
                      <p className="text-sm text-white/60 ml-8 mt-1">
                        {t('account_page.newsletter_desc')}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${updateNewsletter.isPending
                      ? 'bg-white/10 text-white/60'
                      : newsletterEnabled
                        ? 'bg-success/20 text-success'
                        : 'bg-white/10 text-white/60'
                      }`}>
                      {updateNewsletter.isPending
                        ? '...'
                        : newsletterEnabled
                          ? t('account_page.newsletter_enabled')
                          : t('account_page.newsletter_disabled')
                      }
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-accent" size={24} />
                <h3 className="text-xl font-semibold">{t('account.security.title')}</h3>
              </div>
              <button className="btn btn-outline flex items-center gap-2">
                <Lock size={16} />
                {t('account.security.change_password')}
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/50">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500" size={24} />
                <h3 className="text-xl font-semibold text-red-400">{t('account.danger.title')}</h3>
              </div>
              <p className="text-sm text-white/70 mb-4">
                {t('account.danger.desc')}
              </p>
              <button
                onClick={handleLogout}
                className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                <LogOut size={16} />
                {t('account.danger.logout')}
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="text-white/20 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">{t('account.tabs.not_found')}</h3>
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('account.meta_title', { stageName: t('common.artist_name') })}</title>
        <meta name="description" content={t('account.meta_desc')} />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen pt-24 pb-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="text-4xl md:text-5xl font-black font-display mb-4">
                {t('account.page_title')}
              </h1>
              <p className="text-xl text-white/70">
                {t('account.page_subtitle')}
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-1/4">
                <div className="bg-surface/50 rounded-xl p-6 border border-white/10 sticky top-24">
                  {/* User Info */}
                  <div className="text-center mb-6 pb-6 border-b border-white/10">
                    <div className="relative mb-4">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary/30"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
                          <User className="text-white" size={32} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg">{user.name}</h3>
                    <p className="text-sm text-white/60 mb-3">{user.email}</p>
                    <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full font-semibold">
                      {userStats.rank}
                    </span>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-all ${activeTab === tab.id
                            ? 'bg-primary text-white shadow-lg'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          <Icon size={20} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:w-3/4">
                <div className="bg-surface/30 rounded-xl p-6 md:p-8 border border-white/10 min-h-[600px]">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
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