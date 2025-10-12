// src/pages/DashboardPage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  Star, 
  TrendingUp, 
  Music, 
  Calendar, 
  Download,
  Heart,
  Share2,
  Clock,
  Zap,
  Users,
  Trophy,
  Target,
  Gift
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user?.isLoggedIn) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Mock user data (replace with real data later)
  const userStats = {
    level: 3,
    currentXP: 350,
    nextLevelXP: 400,
    totalTracks: 24,
    eventsAttended: 5,
    streakDays: 7,
    tribeFriends: 12
  };

  const recentActivity = [
    { icon: <Music className="text-primary" size={20} />, action: 'Downloaded', item: 'Zouk Nights Remix', xp: 10, time: '2 hours ago' },
    { icon: <Heart className="text-accent" size={20} />, action: 'Liked', item: 'Electric Dreams', xp: 5, time: '5 hours ago' },
    { icon: <Calendar className="text-success" size={20} />, action: 'RSVP\'d to', item: 'Summer Vibes Festival', xp: 25, time: '1 day ago' },
    { icon: <Share2 className="text-warning" size={20} />, action: 'Shared', item: 'Sunset Mix Vol. 3', xp: 15, time: '2 days ago' },
  ];

  const achievements = [
    { emoji: '🎧', title: 'First Beat', description: 'Welcome to the Zen Tribe', unlocked: true },
    { emoji: '🚀', title: 'Early Adopter', description: 'Joined during launch', unlocked: true },
    { emoji: '🔥', title: '7-Day Streak', description: 'Maintained activity streak', unlocked: true },
    { emoji: '🔍', title: 'Music Explorer', description: 'Listened to 10 tracks', unlocked: false },
    { emoji: '🦋', title: 'Social Butterfly', description: 'Connected with 5 members', unlocked: false },
    { emoji: '🎪', title: 'Event Regular', description: 'Attended 3 events', unlocked: false },
  ];

  const progressPercentage = (userStats.currentXP / userStats.nextLevelXP) * 100;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-success/20 rounded-2xl p-8 border border-primary/30">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name)} 
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-primary"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                  {userStats.level}
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-black font-display mb-2">
                  Welcome back, <span className="text-primary">{user.name}</span>!
                </h1>
                <p className="text-white/70 text-lg mb-4">Zen Apprentice • Level {userStats.level}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Progress to Level {userStats.level + 1}</span>
                    <span className="text-primary font-bold">{userStats.currentXP}/{userStats.nextLevelXP} XP</span>
                  </div>
                  <div className="h-3 bg-background rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    />
                  </div>
                </div>
              </div>

              <button className="btn btn-primary flex items-center gap-2">
                <Zap size={20} />
                Boost XP
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="card p-6 hover:scale-105 transition-transform">
            <Music className="text-primary mb-3" size={32} />
            <div className="text-3xl font-black mb-1">{userStats.totalTracks}</div>
            <div className="text-white/70 text-sm">Tracks Downloaded</div>
          </div>

          <div className="card p-6 hover:scale-105 transition-transform">
            <Calendar className="text-success mb-3" size={32} />
            <div className="text-3xl font-black mb-1">{userStats.eventsAttended}</div>
            <div className="text-white/70 text-sm">Events Attended</div>
          </div>

          <div className="card p-6 hover:scale-105 transition-transform">
            <Target className="text-warning mb-3" size={32} />
            <div className="text-3xl font-black mb-1">{userStats.streakDays}</div>
            <div className="text-white/70 text-sm">Day Streak 🔥</div>
          </div>

          <div className="card p-6 hover:scale-105 transition-transform">
            <Users className="text-accent mb-3" size={32} />
            <div className="text-3xl font-black mb-1">{userStats.tribeFriends}</div>
            <div className="text-white/70 text-sm">Tribe Friends</div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                  <Clock className="text-primary" size={24} />
                  Recent Activity
                </h2>
                <button className="text-primary hover:underline text-sm">View All</button>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg hover:bg-surface/80 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-background/50 flex items-center justify-center">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">
                        {activity.action} <span className="text-primary">{activity.item}</span>
                      </div>
                      <div className="text-sm text-white/60">{activity.time}</div>
                    </div>
                    <div className="text-success font-bold text-sm">+{activity.xp} XP</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card p-6 mb-6">
              <h3 className="text-xl font-bold font-display mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn btn-primary justify-start gap-3">
                  <Music size={20} />
                  Browse Music
                </button>
                <button className="w-full btn btn-outline justify-start gap-3">
                  <Calendar size={20} />
                  View Events
                </button>
                <button className="w-full btn btn-outline justify-start gap-3">
                  <Gift size={20} />
                  Visit Shop
                </button>
                <button className="w-full btn btn-outline justify-start gap-3">
                  <Users size={20} />
                  Invite Friends
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-xl font-bold font-display mb-4 flex items-center gap-2">
                <Trophy className="text-warning" size={24} />
                Membership
              </h3>
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg p-4 mb-4">
                <div className="text-2xl font-black mb-2">Zen Novice</div>
                <div className="text-sm text-white/70 mb-4">Free Tier</div>
                <button className="w-full btn btn-secondary btn-sm">
                  Upgrade Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold font-display flex items-center gap-2">
                <Award className="text-primary" size={28} />
                Your Achievements
              </h2>
              <div className="text-white/70">
                <span className="text-primary font-bold">3</span> of 6 unlocked
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
                  className={`bg-surface/50 rounded-lg p-4 text-center transition-all ${
                    achievement.unlocked ? 'hover:bg-surface/70' : 'opacity-40 grayscale'
                  }`}
                >
                  <div className="text-5xl mb-3">{achievement.emoji}</div>
                  <div className="font-bold text-sm mb-1">{achievement.title}</div>
                  <div className="text-xs text-white/60">{achievement.description}</div>
                  {achievement.unlocked && (
                    <div className="mt-2 text-xs text-success flex items-center justify-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Unlocked
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
