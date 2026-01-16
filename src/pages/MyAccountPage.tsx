// src/pages/MyAccountPage.tsx
// REFATORADO: Componentes extraídos para melhor organização (SRP)

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { User, Settings, ShoppingBag, Award, Music, LogOut, Edit3, Bell, Shield, Lock, AlertCircle, Headphones, Instagram, Facebook, Save } from 'lucide-react';
import { UserStatsCards } from '../components/account/UserStatsCards'; // Importação corrigida
import { OrdersList } from '../components/account/OrdersList'; // Importação corrigida
import { RecentActivity } from '../components/account/RecentActivity'; // Importação corrigida

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

const MyAccountPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading, logout } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newsletterEnabled, setNewsletterEnabled] = useState(false);
  
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

  console.log('[MyAccountPage] User:', user);

  // 🎮 Computar estatísticas do usuário COM DADOS REAIS
  const userStats: UserStats = useMemo(() => {
    if (!user) {
      return {
        level: 0,
        xp: 0,
        rank: 'New Member',
        xpToNext: 0,
        totalAchievements: 0,
        recentAchievements: 0
      };
    }

    // ✅ DADOS REAIS DO GAMIPRESS
    const totalPoints = user.gamipress_points || 0;
    const currentRank = user.gamipress_rank || 'Zen Novice';
    
    // Calcular level baseado em pontos (cada 100 pontos = 1 level)
    const level = Math.floor(totalPoints / 100) + 1;
    
    // Calcular XP para próximo rank
    let xpToNext = 0;
    if (totalPoints < 100) {
      xpToNext = 100 - totalPoints; // Para Zen Apprentice
    } else if (totalPoints < 500) {
      xpToNext = 500 - totalPoints; // Para Zen Voyager
    } else if (totalPoints < 1500) {
      xpToNext = 1500 - totalPoints; // Para Zen Master
    }

    const totalAchievements = user.gamipress_achievements?.length || 0;
    const recentAchievements = user.gamipress_achievements?.slice(-2).length || 0;

    return {
      level,
      xp: totalPoints,
      rank: currentRank,
      xpToNext,
      totalAchievements,
      recentAchievements
    };
  }, [user]);

  // Redirect se não logado
  useEffect(() => {
    if (!loading && !user?.isLoggedIn) {
      console.log('[MyAccountPage] ❌ Usuário não logado, redirecionando...');
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Fetch orders
  useEffect(() => {
    if (user?.isLoggedIn) {
      fetchOrders();
      fetchProfile();
    }
  }, [user]);

  // Fetch profile data
  const fetchProfile = async () => {
    if (!user?.token) return;
    
    try {
      const response = await fetch(`${window.location.origin}/wp-json/zeneyer-auth/v1/profile`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setProfileForm({
            realName: data.data.real_name || user.name || '',
            preferredName: data.data.preferred_name || '',
            facebookUrl: data.data.facebook_url || '',
            instagramUrl: data.data.instagram_url || '',
            danceRole: data.data.dance_role || [],
            gender: data.data.gender || '',
          });
        }
      }
    } catch (error) {
      console.error('[MyAccountPage] Error fetching profile:', error);
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
    console.log('[MyAccountPage] 🚪 Logout iniciado');
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('[MyAccountPage] Erro no logout:', error);
      navigate('/');
    }
  };

  // Loading spinner
  const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center pt-24"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mx-auto mb-4"></div>
        <p className="text-xl font-semibold">{message}</p>
      </div>
    </motion.div>
  );

  if (loading) {
    return <LoadingSpinner message="Loading your Zen account..." />;
  }

  if (!user?.isLoggedIn) {
    return null;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'music', label: 'My Music', icon: Music },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-white/70">Ready to dive into your Zen journey today?</p>
            </div>

            {/* Quick Stats */}
            <UserStatsCards stats={userStats} />

            {/* Recent Activity */}
            <RecentActivity achievements={user.gamipress_achievements} />
          </div>
        );

      case 'orders':
        return <OrdersList orders={orders} loading={loadingOrders} />;

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Achievements</h2>
              <div className="text-sm text-white/60 bg-white/5 px-4 py-2 rounded-full">
                {userStats.totalAchievements} unlocked
              </div>
            </div>
            
            {user.gamipress_achievements && user.gamipress_achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.gamipress_achievements.map((achievement: any) => (
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
                      <span className="inline-flex items-center text-xs bg-success/20 text-success px-3 py-1 rounded-full font-semibold">
                        <Award size={12} className="mr-1" />
                        Unlocked
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Award className="mx-auto mb-4 text-white/30" size={64} />
                <h3 className="text-2xl font-semibold mb-3">No achievements yet</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Start exploring and engaging to unlock your first achievements!
                </p>
                <Link to="/dashboard/" className="btn btn-primary btn-lg">
                  Start Your Journey
                </Link>
              </div>
            )}

            {/* Progress bar para próximo rank */}
            {userStats.xpToNext > 0 && (
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Next Rank Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2 text-white/80">
                      <span>{userStats.rank}</span>
                      <span>
                        {userStats.xp < 100 ? 'Zen Apprentice' :
                         userStats.xp < 500 ? 'Zen Voyager' : 'Zen Master'}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${
                            userStats.xp < 100 
                              ? (userStats.xp / 100) * 100
                              : userStats.xp < 500
                              ? ((userStats.xp - 100) / 400) * 100
                              : ((userStats.xp - 500) / 1000) * 100
                          }%`
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs text-white/60 mt-2">
                      <strong>{userStats.xpToNext} XP</strong> needed for next rank
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
              <h2 className="text-2xl font-bold">My Music Collection</h2>
              <Link to="/music/" className="btn btn-primary">
                Browse Music
              </Link>
            </div>

            <div className="text-center py-20">
              <Headphones className="mx-auto mb-4 text-white/30" size={64} />
              <h3 className="text-2xl font-semibold mb-3">Your music library</h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Access exclusive tracks, mixes, and playlists curated by DJ Zen Eyer
              </p>
              <Link to="/music/" className="btn btn-primary btn-lg">
                Explore Music
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
            const response = await fetch(`${window.location.origin}/wp-json/zeneyer-auth/v1/profile`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user?.token}`,
              },
              body: JSON.stringify({
                real_name: profileForm.realName,
                preferred_name: profileForm.preferredName,
                facebook_url: profileForm.facebookUrl,
                instagram_url: profileForm.instagramUrl,
                dance_role: profileForm.danceRole,
                gender: profileForm.gender,
              }),
            });
            
            const data = await response.json();
            
            if (data.success) {
              setProfileSaved(true);
              setTimeout(() => setProfileSaved(false), 3000);
            } else {
              console.error('[MyAccountPage] Error saving profile:', data.message);
            }
          } catch (error) {
            console.error('[MyAccountPage] Error saving profile:', error);
          } finally {
            setSavingProfile(false);
          }
        };

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">{t('nav_my_account')}</h2>

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
                      className={`px-5 py-2.5 rounded-lg border transition-all ${
                        profileForm.danceRole.includes('leader')
                          ? 'bg-primary border-primary text-white'
                          : 'border-white/20 text-white/70 hover:border-white/40'
                      }`}
                    >
                      {t('profile.leader')}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDanceRoleToggle('follower')}
                      className={`px-5 py-2.5 rounded-lg border transition-all ${
                        profileForm.danceRole.includes('follower')
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
                        className={`px-5 py-2.5 rounded-lg border transition-all ${
                          profileForm.gender === option.value
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
                <h3 className="text-xl font-semibold">Notifications</h3>
              </div>
              <div className="space-y-3">
                <label htmlFor="notify-events" className="flex items-center gap-3 cursor-pointer">
                  <input id="notify-events" name="notify-events" type="checkbox" className="w-5 h-5" defaultChecked />
                  <span>Email notifications for new events</span>
                </label>
                <label htmlFor="notify-achievements" className="flex items-center gap-3 cursor-pointer">
                  <input id="notify-achievements" name="notify-achievements" type="checkbox" className="w-5 h-5" defaultChecked />
                  <span>Achievement updates</span>
                </label>
                <label htmlFor="notify-marketing" className="flex items-center gap-3 cursor-pointer">
                  <input id="notify-marketing" name="notify-marketing" type="checkbox" className="w-5 h-5" />
                  <span>Marketing emails</span>
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
                          checked={newsletterEnabled}
                          onChange={(e) => setNewsletterEnabled(e.target.checked)}
                        />
                        <span className="font-semibold">{t('account_page.newsletter_toggle')}</span>
                      </div>
                      <p className="text-sm text-white/60 ml-8 mt-1">
                        {t('account_page.newsletter_desc')}
                      </p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${newsletterEnabled ? 'bg-success/20 text-success' : 'bg-white/10 text-white/60'}`}>
                      {newsletterEnabled ? t('account_page.newsletter_enabled') : t('account_page.newsletter_disabled')}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-accent" size={24} />
                <h3 className="text-xl font-semibold">Security</h3>
              </div>
              <button className="btn btn-outline flex items-center gap-2">
                <Lock size={16} />
                Change Password
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/50">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="text-red-500" size={24} />
                <h3 className="text-xl font-semibold text-red-400">Danger Zone</h3>
              </div>
              <p className="text-sm text-white/70 mb-4">
                Once you log out, you'll need to sign in again to access your account.
              </p>
              <button 
                onClick={handleLogout}
                className="btn bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        );

      default:
        return <div>Tab not found</div>;
    }
  };

  return (
    <>
      <Helmet>
        <title>My Account | DJ Zen Eyer</title>
        <meta name="description" content="Manage your Zen Tribe account, orders, and achievements" />
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
                My Zen Account
              </h1>
              <p className="text-xl text-white/70">
                Manage your profile, orders, and Zen Tribe membership
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
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-all ${
                            activeTab === tab.id
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

export default MyAccountPage;