// src/pages/MyAccountPage.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
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
  Shield
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

const MyAccountPage: React.FC = () => {
  const { user, loading, logout } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.token) {
      setLoadingOrders(false);
      return;
    }
    
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/v3/orders?customer=${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
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

  // Funções auxiliares para orders
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

            {/* Profile Settings */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <User className="text-primary" size={24} />
                <h3 className="text-xl font-semibold">Profile Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={user.name} 
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    className="w-full px-4 py-3 bg-background border border-white/10 rounded-lg"
                    disabled
                  />
                </div>
                <button className="btn btn-outline flex items-center gap-2">
                  <Edit3 size={16} />
                  Edit Profile
                </button>
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
