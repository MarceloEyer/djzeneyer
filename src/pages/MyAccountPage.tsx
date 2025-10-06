import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { 
  User, 
  Settings, 
  ShoppingBag, 
  Heart, 
  Award, 
  Music, 
  Calendar,
  Download,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Edit3,
  LogOut,
  TrendingUp,
  Star,
  AlertCircle
} from 'lucide-react';

// Interfaces melhoradas
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

  // Computar estatísticas do usuário usando dados reais do GamiPress
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

    const totalPoints = user.gamipress_points?.points || 0;
    const level = user.gamipress_level || 1;
    const rank = user.gamipress_rank_name || 'Zen Newcomer';
    const xpToNext = user.gamipress_xp_to_next_level || 0;
    const totalAchievements = user.gamipress_achievements?.length || 0;
    
    // Calcular conquistas recentes (últimos 7 dias - seria melhor ter timestamp)
    const recentAchievements = user.gamipress_achievements?.slice(-2).length || 0;

    return {
      level,
      xp: totalPoints,
      rank,
      xpToNext,
      totalAchievements,
      recentAchievements
    };
  }, [user]);

  useEffect(() => {
    if (!loading && !user?.isLoggedIn) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user?.isLoggedIn) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.token) return;
    
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
      } else {
        console.warn('Failed to fetch orders:', response.status);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Forçar navegação mesmo se logout falhar
      navigate('/');
    }
  };

  // Componente de Loading reutilizável
  const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-background text-white p-4"
    >
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-lg">{message}</p>
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
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
              <p className="text-white/70">Ready to dive into your Zen journey today?</p>
            </div>

            {/* Quick Stats com dados reais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-primary" size={24} />
                  <h3 className="font-semibold">Zen Level</h3>
                </div>
                <p className="text-2xl font-bold text-primary">Level {userStats.level}</p>
                <p className="text-sm text-white/60">{userStats.rank}</p>
              </div>
              
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-secondary" size={24} />
                  <h3 className="font-semibold">Total XP</h3>
                </div>
                <p className="text-2xl font-bold text-secondary">{userStats.xp.toLocaleString()}</p>
                <p className="text-sm text-white/60">
                  {userStats.xpToNext > 0 ? `${userStats.xpToNext} to next level` : 'Max level reached'}
                </p>
              </div>
              
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="text-accent" size={24} />
                  <h3 className="font-semibold">Achievements</h3>
                </div>
                <p className="text-2xl font-bold text-accent">{userStats.totalAchievements}</p>
                <p className="text-sm text-white/60">
                  {userStats.recentAchievements > 0 
                    ? `${userStats.recentAchievements} unlocked recently`
                    : 'Keep exploring to unlock more!'
                  }
                </p>
              </div>
            </div>

            {/* Recent Activity - usando dados reais quando possível */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {user.gamipress_achievements && user.gamipress_achievements.length > 0 ? (
                  user.gamipress_achievements.slice(-2).map((achievement, index) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Award className="text-secondary" size={20} />
                      <div>
                        <p className="font-medium">Unlocked "{achievement.title.rendered}"</p>
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
                        <p className="text-sm text-white/60">Start exploring to see more activity</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Achievements</h2>
              <div className="text-sm text-white/60">
                {userStats.totalAchievements} unlocked
              </div>
            </div>
            
            {user.gamipress_achievements && user.gamipress_achievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.gamipress_achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className="bg-surface/50 rounded-lg p-4 border border-white/10"
                  >
                    <div className="text-4xl mb-3">🏆</div>
                    <h4 className="font-display text-lg mb-1">{achievement.title.rendered}</h4>
                    {achievement.content && (
                      <p className="text-sm text-white/70" 
                         dangerouslySetInnerHTML={{ __html: achievement.content.rendered }} />
                    )}
                    <div className="mt-2 text-xs text-success flex items-center">
                      <Award size={12} className="mr-1" />
                      Unlocked
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="mx-auto mb-4 text-white/30" size={48} />
                <h3 className="text-xl font-semibold mb-2">No achievements yet</h3>
                <p className="text-white/60 mb-6">Start exploring and engaging to unlock your first achievements!</p>
                <Link to="/tribe" className="btn btn-primary">
                  Join the Tribe
                </Link>
              </div>
            )}

            {/* Progresso para próxima conquista */}
            {userStats.xpToNext > 0 && (
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-3">Next Level Progress</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Level {userStats.level}</span>
                      <span>Level {userStats.level + 1}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.max(10, ((userStats.xp) / (userStats.xp + userStats.xpToNext)) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-white/60 mt-1">
                      {userStats.xpToNext} XP needed for next level
                    </p>
                  </div>
                </div>
              </div>
            )}
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

            {/* Melhor tratamento de loading e estados vazios */}
            {loadingOrders ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p>Loading your orders...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-surface/50 rounded-lg p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold">Order #{order.id}</h3>
                        <p className="text-sm text-white/60">
                          {new Date(order.date_created).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {order.total}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${getOrderStatusClass(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.line_items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>R$ {item.total}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingBag className="mx-auto mb-4 text-white/30" size={48} />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-white/60 mb-6">Start exploring our exclusive content and merchandise!</p>
                <Link to="/shop" className="btn btn-primary">
                  Browse Shop
                </Link>
              </div>
            )}
          </div>
        );

      // ... resto dos cases permanecem iguais
      default:
        return <div>Tab content not implemented</div>;
    }
  };

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
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'processing':
        return 'Processing';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 min-h-screen"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-2">
            My Zen Account
          </h1>
          <p className="text-white/70">
            Manage your profile, orders, and Zen Tribe membership
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar melhorado */}
          <div className="lg:w-1/4">
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10 sticky top-24">
              {/* User Info com dados reais */}
              <div className="text-center mb-6 pb-6 border-b border-white/10">
                <div className="relative mb-3">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-16 h-16 rounded-full mx-auto object-cover"
                      onError={(e) => {
                        // Fallback para ícone se imagem falhar
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                      <User className="text-primary" size={24} />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-white/60">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    {userStats.rank}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary/20 text-primary'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-surface/30 rounded-lg p-6 md:p-8 border border-white/10">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MyAccountPage;