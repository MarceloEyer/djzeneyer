// src/pages/MyAccountPage.tsx

import React, { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Award, 
  Music, 
  Calendar,
  Edit3,
  LogOut,
  TrendingUp,
  Star,
  AlertCircle,
  Headphones,
  Lock,
  Bell,
  Shield,
  Camera,
  Save,
  X,
  Check,
  Mail,
  UserCircle
} from 'lucide-react';

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

interface ProfileData {
  display_name: string;
  email: string;
  description: string;
}

const MyAccountPage: React.FC = () => {
  const { user, loading, logout, updateUser } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // 🎨 Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    display_name: user?.name || '',
    email: user?.email || '',
    description: user?.description || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  
  // 📸 Avatar upload states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('[MyAccountPage] User:', user);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        display_name: user.name || '',
        email: user.email || '',
        description: user.description || ''
      });
    }
  }, [user]);

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

    const totalPoints = user.gamipress_points || 0;
    const currentRank = user.gamipress_rank || 'Zen Novice';
    const level = Math.floor(totalPoints / 100) + 1;
    
    let xpToNext = 0;
    if (totalPoints < 100) {
      xpToNext = 100 - totalPoints;
    } else if (totalPoints < 500) {
      xpToNext = 500 - totalPoints;
    } else if (totalPoints < 1500) {
      xpToNext = 1500 - totalPoints;
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
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.token) {
      setLoadingOrders(false);
      return;
    }
    
    try {
      // ✅ USAR ENDPOINT CUSTOM (criar no WordPress)
      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/my-orders`, {
        headers: {
          'X-WP-Nonce': window.wpData.nonce,
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

  // 🎨 EDIÇÃO DE PERFIL
  const handleProfileEdit = () => {
    setIsEditingProfile(true);
    setProfileError('');
    setProfileSuccess('');
  };

  const handleProfileCancel = () => {
    setIsEditingProfile(false);
    setProfileData({
      display_name: user?.name || '',
      email: user?.email || '',
      description: user?.description || ''
    });
    setProfileError('');
    setProfileSuccess('');
  };

  const handleProfileSave = async () => {
    if (!profileData.display_name.trim()) {
      setProfileError('Display name is required');
      return;
    }

    if (!profileData.email.trim() || !profileData.email.includes('@')) {
      setProfileError('Valid email is required');
      return;
    }

    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: JSON.stringify({
          display_name: profileData.display_name,
          email: profileData.email,
          description: profileData.description
        })
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // ✅ Atualizar contexto do usuário
        if (updateUser) {
          updateUser({
            ...user,
            name: updatedUser.display_name || profileData.display_name,
            email: updatedUser.email || profileData.email,
            description: updatedUser.description || profileData.description
          });
        }

        setProfileSuccess('Profile updated successfully!');
        setIsEditingProfile(false);
        
        // Clear success message after 3s
        setTimeout(() => setProfileSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('[MyAccountPage] Error updating profile:', error);
      setProfileError('An error occurred while updating your profile');
    } finally {
      setSavingProfile(false);
    }
  };

  // 📸 UPLOAD DE AVATAR
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação
    if (!file.type.startsWith('image/')) {
      setProfileError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      setProfileError('Image size must be less than 5MB');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setUploadingAvatar(true);
    setProfileError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${window.wpData.restUrl}djzeneyer/v1/upload-avatar`, {
        method: 'POST',
        headers: {
          'X-WP-Nonce': window.wpData.nonce,
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // ✅ Atualizar avatar no contexto
        if (updateUser && data.avatar_url) {
          updateUser({
            ...user,
            avatar: data.avatar_url
          });
        }

        setProfileSuccess('Avatar updated successfully!');
        setAvatarPreview(null);
        setTimeout(() => setProfileSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        setProfileError(errorData.message || 'Failed to upload avatar');
      }
    } catch (error) {
      console.error('[MyAccountPage] Error uploading avatar:', error);
      setProfileError('An error occurred while uploading your avatar');
    } finally {
      setUploadingAvatar(false);
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

  const getOrderStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/20 text-success';
      case 'processing':
        return 'bg-warning/20 text-warning';
      case 'failed':
        return 'bg-error/20 text-error';
      default:
        return 'bg-white/20 text-white/70';
    }
  };

  const getOrderStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'completed': 'Completed',
      'processing': 'Processing',
      'failed': 'Failed',
      'cancelled': 'Cancelled',
      'pending': 'Pending',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-primary" size={24} />
                  <h3 className="font-semibold">Zen Level</h3>
                </div>
                <p className="text-3xl font-black text-primary">Level {userStats.level}</p>
                <p className="text-sm text-white/60">{userStats.rank}</p>
              </div>
              
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-secondary/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-secondary" size={24} />
                  <h3 className="font-semibold">Total XP</h3>
                </div>
                <p className="text-3xl font-black text-secondary">{userStats.xp.toLocaleString()}</p>
                <p className="text-sm text-white/60">
                  {userStats.xpToNext > 0 ? `${userStats.xpToNext} to next rank` : 'Max rank!'}
                </p>
              </div>
              
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="text-accent" size={24} />
                  <h3 className="font-semibold">Achievements</h3>
                </div>
                <p className="text-3xl font-black text-accent">{userStats.totalAchievements}</p>
                <p className="text-sm text-white/60">
                  {userStats.recentAchievements > 0 
                    ? `${userStats.recentAchievements} unlocked recently`
                    : 'Keep exploring!'
                  }
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {user.gamipress_achievements && user.gamipress_achievements.length > 0 ? (
                  user.gamipress_achievements.slice(-3).reverse().map((achievement: any) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
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
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order History</h2>
              <Link to="/shop" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>

            {loadingOrders ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-surface/50 rounded-lg p-6 border border-white/10 hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id}</h3>
                        <p className="text-sm text-white/60">
                          {new Date(order.date_created).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">R$ {order.total}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusClass(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.line_items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm border-t border-white/5 pt-2">
                          <span className="text-white/80">{item.name} x{item.quantity}</span>
                          <span className="font-semibold">R$ {item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <ShoppingBag className="mx-auto mb-4 text-white/30" size={64} />
                <h3 className="text-2xl font-semibold mb-3">No orders yet</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                  Start exploring our exclusive content and merchandise!
                </p>
                <Link to="/shop" className="btn btn-primary btn-lg">
                  Browse Shop
                </Link>
              </div>
            )}
          </div>
        );

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
                <Link to="/dashboard" className="btn btn-primary btn-lg">
                  Start Your Journey
                </Link>
              </div>
            )}

            {/* Progress bar */}
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
              <Link to="/music" className="btn btn-primary">
                Browse Music
              </Link>
            </div>

            <div className="text-center py-20">
              <Headphones className="mx-auto mb-4 text-white/30" size={64} />
              <h3 className="text-2xl font-semibold mb-3">Your music library</h3>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                Access exclusive tracks, mixes, and playlists curated by DJ Zen Eyer
              </p>
              <Link to="/music" className="btn btn-primary btn-lg">
                Explore Music
              </Link>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

            {/* 🎨 PROFILE SETTINGS COM EDIÇÃO */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <User className="text-primary" size={24} />
                  <h3 className="text-xl font-semibold">Profile Information</h3>
                </div>
                {!isEditingProfile && (
                  <button 
                    onClick={handleProfileEdit}
                    className="btn btn-outline btn-sm flex items-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Success/Error Messages */}
              <AnimatePresence>
                {profileError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-error/20 border border-error/50 rounded-lg flex items-center gap-2 text-error"
                  >
                    <AlertCircle size={18} />
                    <span className="text-sm">{profileError}</span>
                  </motion.div>
                )}

                {profileSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-success/20 border border-success/50 rounded-lg flex items-center gap-2 text-success"
                  >
                    <Check size={18} />
                    <span className="text-sm">{profileSuccess}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 📸 AVATAR UPLOAD */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <img 
                    src={avatarPreview || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=6366f1&color=fff&bold=true`}
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/30"
                  />
                  <button
                    onClick={handleAvatarClick}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary/80 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <Camera size={20} className="text-white" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* PROFILE FORM */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <UserCircle size={16} />
                    Display Name
                  </label>
                  <input 
                    type="text" 
                    value={isEditingProfile ? profileData.display_name : user.name}
                    onChange={(e) => setProfileData({...profileData, display_name: e.target.value})}
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    disabled={!isEditingProfile}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <input 
                    type="email" 
                    value={isEditingProfile ? profileData.email : user.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    disabled={!isEditingProfile}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bio</label>
                  <textarea 
                    value={isEditingProfile ? profileData.description : (user.description || 'No bio yet')}
                    onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                    disabled={!isEditingProfile}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* ACTION BUTTONS */}
                {isEditingProfile && (
                  <div className="flex gap-3 pt-4">
                    <button 
                      onClick={handleProfileSave}
                      disabled={savingProfile}
                      className="btn btn-primary flex items-center gap-2 flex-1"
                    >
                      {savingProfile ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button 
                      onClick={handleProfileCancel}
                      disabled={savingProfile}
                      className="btn btn-outline flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="text-secondary" size={24} />
                <h3 className="text-xl font-semibold">Notifications</h3>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                  <span>Email notifications for new events</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" defaultChecked />
                  <span>Achievement updates</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5" />
                  <span>Marketing emails</span>
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="text-accent" size={24} />
                <h3 className="text-xl font-semibold">Security</h3>
              </div>
              <button 
                onClick={() => window.location.href = `${window.wpData.siteUrl}/wp-login.php?action=lostpassword`}
                className="btn btn-outline flex items-center gap-2"
              >
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
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=80&background=6366f1&color=fff&bold=true`}
                        alt={user.name}
                        className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-primary/30"
                      />
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
