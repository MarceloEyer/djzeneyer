import React, { useEffect, useState } from 'react';
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
  Star
} from 'lucide-react';

declare global {
  interface Window {
    wpData: {
      siteUrl: string;
      restUrl: string;
      nonce: string;
    };
  }
}

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

const MyAccountPage: React.FC = () => {
  const { user, loading, logout } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
    try {
      const response = await fetch(`${window.wpData.restUrl}wc/v3/orders?customer=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'X-WP-Nonce': window.wpData.nonce,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.slice(0, 5)); // Show last 5 orders
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-background text-white p-4"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading your Zen account...</p>
        </div>
      </motion.div>
    );
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="text-primary" size={24} />
                  <h3 className="font-semibold">Zen Level</h3>
                </div>
                <p className="text-2xl font-bold text-primary">Level 3</p>
                <p className="text-sm text-white/60">Zen Apprentice</p>
              </div>
              
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Star className="text-secondary" size={24} />
                  <h3 className="font-semibold">Total XP</h3>
                </div>
                <p className="text-2xl font-bold text-secondary">1,250</p>
                <p className="text-sm text-white/60">350 to next level</p>
              </div>
              
              <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="text-accent" size={24} />
                  <h3 className="font-semibold">Achievements</h3>
                </div>
                <p className="text-2xl font-bold text-accent">8</p>
                <p className="text-sm text-white/60">2 unlocked recently</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Music className="text-primary" size={20} />
                  <div>
                    <p className="font-medium">Listened to "Crazy Afro Zouk Remix"</p>
                    <p className="text-sm text-white/60">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Award className="text-secondary" size={20} />
                  <div>
                    <p className="font-medium">Unlocked "Music Explorer" achievement</p>
                    <p className="text-sm text-white/60">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Calendar className="text-accent" size={20} />
                  <div>
                    <p className="font-medium">Registered for upcoming event</p>
                    <p className="text-sm text-white/60">3 days ago</p>
                  </div>
                </div>
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
                          {new Date(order.date_created).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {order.total}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          order.status === 'completed' ? 'bg-success/20 text-success' :
                          order.status === 'processing' ? 'bg-warning/20 text-warning' :
                          'bg-white/20 text-white/70'
                        }`}>
                          {order.status}
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

      case 'achievements':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your Achievements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { emoji: '🎧', title: 'First Beat', description: 'Welcome to the Zen Tribe', unlocked: true },
                { emoji: '🚀', title: 'Early Adopter', description: 'Joined during launch phase', unlocked: true },
                { emoji: '🔍', title: 'Music Explorer', description: 'Listened to 10 different tracks', unlocked: true },
                { emoji: '🦋', title: 'Social Butterfly', description: 'Connected with 5 tribe members', unlocked: false },
                { emoji: '🎪', title: 'Event Attendee', description: 'Attended your first live event', unlocked: false },
                { emoji: '⏱️', title: 'Consistent Fan', description: 'Maintained a 7-day streak', unlocked: false },
              ].map((achievement, index) => (
                <div 
                  key={index} 
                  className={`bg-surface/50 rounded-lg p-4 border border-white/10 ${
                    achievement.unlocked ? '' : 'opacity-60'
                  }`}
                >
                  <div className="text-4xl mb-3">{achievement.emoji}</div>
                  <h4 className="font-display text-lg mb-1">{achievement.title}</h4>
                  <p className="text-sm text-white/70">{achievement.description}</p>
                  {achievement.unlocked && (
                    <div className="mt-2 text-xs text-success flex items-center">
                      <Award size={12} className="mr-1" />
                      Unlocked
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Music Collection</h2>
            
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Exclusive Downloads</h3>
              <p className="text-white/70 mb-6">Access your exclusive tracks and mixes as a Zen Tribe member.</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">Zen Tribe Exclusive Mix #1</p>
                      <p className="text-sm text-white/60">Released for members only</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm flex items-center gap-2">
                    <Download size={16} />
                    Download
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Music className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">Behind the Scenes: Studio Session</p>
                      <p className="text-sm text-white/60">Exclusive content</p>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm flex items-center gap-2">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Account Settings</h2>
            
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={user.name} 
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        readOnly
                      />
                      <button className="p-2 text-white/60 hover:text-white">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="email" 
                        value={user.email} 
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                        readOnly
                      />
                      <button className="p-2 text-white/60 hover:text-white">
                        <Edit3 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-white/60">Receive updates about new releases and events</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Communications</p>
                    <p className="text-sm text-white/60">Receive promotional content and special offers</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-surface/50 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-error">Danger Zone</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={handleLogout}
                  className="btn btn-outline hover:bg-error hover:border-error hover:text-white flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-surface/50 rounded-lg p-6 border border-white/10 sticky top-24">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-white/10">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold">{user.name}</h3>
                <p className="text-sm text-white/60">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    Zen Apprentice
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