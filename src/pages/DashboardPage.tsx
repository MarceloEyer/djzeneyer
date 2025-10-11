// src/pages/DashboardPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  LogOut, 
  Award, 
  ShieldCheck, 
  UserCircle, 
  BarChart3, 
  Music2, // <-- FIX: Import correto
  TrendingUp,
  Calendar,
  Zap,
  Star,
  Crown,
  Target,
  Gift
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout, loadingInitial } = useUser();
  const navigate = useNavigate();

  console.log('[DashboardPage] Renderizado - loadingInitial:', loadingInitial, 'user:', user);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!loadingInitial && !user) {
      console.log('[DashboardPage] ❌ Usuário não logado, redirecionando...');
      navigate('/');
    }
  }, [user, loadingInitial, navigate]);

  // Logout handler
  const handleLogout = async () => {
    console.log('[DashboardPage] 🚪 Iniciando logout...');
    await logout();
    console.log('[DashboardPage] ✅ Logout finalizado');
    navigate('/');
  };

  // Loading state
  if (loadingInitial) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
        <motion.p 
          className="text-2xl font-bold font-display mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your Zen Dashboard...
        </motion.p>
      </div>
    );
  }

  // User not found state
  if (!user || !user.profile) {
    console.log('[DashboardPage] ❌ Perfil não carregado. User:', user);
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4">
        <div className="card p-8 max-w-md text-center">
          <div className="text-red-500 mb-4">
            <ShieldCheck size={64} className="mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-white/70 mb-6">
            Profile not loaded. Please try logging in again.
          </p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  // Calcula progresso para próximo nível (exemplo)
  const currentXP = user.profile.xp || 0;
  const nextLevelXP = (user.profile.level || 1) * 1000; // Exemplo: 1000 XP por nível
  const progressPercent = Math.min((currentXP / nextLevelXP) * 100, 100);

  return (
    <>
      <Helmet>
        <title>Dashboard | DJ Zen Eyer</title>
        <meta name="description" content="Your personal Zen Tribe dashboard" />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-background to-surface/20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-black font-display mb-4">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-success">
                {user.profile.full_name || user.email.split('@')[0]}
              </span>
              ! 👋
            </h1>
            <p className="text-xl text-white/70">
              Your personal Zen Tribe command center
            </p>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {/* Level */}
            <motion.div variants={cardVariants} className="card p-6 text-center bg-gradient-to-br from-primary/20 to-primary/5">
              <Crown className="text-primary mx-auto mb-2" size={32} />
              <div className="text-3xl font-black text-white mb-1">
                {user.profile.level || 1}
              </div>
              <div className="text-sm text-white/60">Level</div>
            </motion.div>

            {/* XP */}
            <motion.div variants={cardVariants} className="card p-6 text-center bg-gradient-to-br from-accent/20 to-accent/5">
              <Zap className="text-accent mx-auto mb-2" size={32} />
              <div className="text-3xl font-black text-white mb-1">
                {user.profile.xp || 0}
              </div>
              <div className="text-sm text-white/60">Total XP</div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={cardVariants} className="card p-6 text-center bg-gradient-to-br from-success/20 to-success/5">
              <Award className="text-success mx-auto mb-2" size={32} />
              <div className="text-3xl font-black text-white mb-1">
                {user.achievements?.length || 0}
              </div>
              <div className="text-sm text-white/60">Achievements</div>
            </motion.div>

            {/* Badges */}
            <motion.div variants={cardVariants} className="card p-6 text-center bg-gradient-to-br from-purple-500/20 to-purple-500/5">
              <ShieldCheck className="text-purple-400 mx-auto mb-2" size={32} />
              <div className="text-3xl font-black text-white mb-1">
                {user.badges?.length || 0}
              </div>
              <div className="text-sm text-white/60">Badges</div>
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="card p-6 mb-12 bg-surface/50"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="text-primary" size={24} />
                  Progress to Level {(user.profile.level || 1) + 1}
                </h3>
                <p className="text-sm text-white/60">
                  {currentXP} / {nextLevelXP} XP
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-primary">
                  {progressPercent.toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="h-4 bg-background rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {/* Profile Card */}
            <motion.div variants={cardVariants} className="card p-6 bg-surface/80">
              <div className="flex items-center mb-4">
                <UserCircle className="text-primary mr-3" size={32} />
                <h2 className="text-2xl font-bold font-display">Your Profile</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-white/60 mb-1">Email</div>
                  <div className="text-white font-semibold">{user.email}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Full Name</div>
                  <div className="text-white font-semibold">{user.profile.full_name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Member Since</div>
                  <div className="text-white font-semibold">
                    {user.profile.joinDate 
                      ? new Date(user.profile.joinDate).toLocaleDateString() 
                      : 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">Rank</div>
                  <div className="text-primary font-bold text-lg">
                    {user.profile.rank || 'Zen Newcomer'}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Achievements Card */}
            <motion.div variants={cardVariants} className="card p-6 bg-surface/80">
              <div className="flex items-center mb-4">
                <Award className="text-accent mr-3" size={32} />
                <h2 className="text-2xl font-bold font-display">Achievements</h2>
              </div>
              {user.achievements && user.achievements.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {user.achievements.map(ach => (
                    <div 
                      key={ach.id} 
                      className="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-2xl mr-3">{ach.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-white">{ach.name}</div>
                        <div className="text-sm text-white/60">{ach.description}</div>
                        {ach.unlockedAt && (
                          <div className="text-xs text-primary mt-1">
                            Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="text-white/30 mx-auto mb-3" size={48} />
                  <p className="text-white/60">No achievements yet</p>
                  <p className="text-sm text-white/40 mt-1">Keep exploring to unlock them!</p>
                </div>
              )}
            </motion.div>

            {/* Badges Card */}
            <motion.div variants={cardVariants} className="card p-6 bg-surface/80">
              <div className="flex items-center mb-4">
                <ShieldCheck className="text-success mr-3" size={32} />
                <h2 className="text-2xl font-bold font-display">Badges</h2>
              </div>
              {user.badges && user.badges.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {user.badges.map(badge => (
                    <div 
                      key={badge.id} 
                      className="flex items-start p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-2xl mr-3">{badge.image}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{badge.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-${badge.rarity}/20 text-${badge.rarity} capitalize`}>
                            {badge.rarity}
                          </span>
                        </div>
                        <div className="text-sm text-white/60">{badge.description}</div>
                        {badge.acquiredAt && (
                          <div className="text-xs text-success mt-1">
                            Acquired {new Date(badge.acquiredAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="text-white/30 mx-auto mb-3" size={48} />
                  <p className="text-white/60">No badges yet</p>
                  <p className="text-sm text-white/40 mt-1">Stay active to earn them!</p>
                </div>
              )}
            </motion.div>

            {/* Exclusive Content Card */}
            <motion.div 
              variants={cardVariants} 
              className="card p-6 bg-gradient-to-br from-primary/20 to-accent/20 md:col-span-2 xl:col-span-3"
            >
              <div className="flex items-center mb-4">
                <Music2 className="text-primary mr-3" size={32} />
                <h2 className="text-2xl font-bold font-display">Exclusive Content</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Gift className="text-accent mb-2" size={24} />
                  <div className="font-bold text-white mb-1">Weekly Mixes</div>
                  <p className="text-sm text-white/60">Exclusive weekly sets just for tribe members</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Calendar className="text-success mb-2" size={24} />
                  <div className="font-bold text-white mb-1">Early Access</div>
                  <p className="text-sm text-white/60">Get tickets before anyone else</p>
                </div>
                <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <Star className="text-warning mb-2" size={24} />
                  <div className="font-bold text-white mb-1">VIP Perks</div>
                  <p className="text-sm text-white/60">Special discounts and upgrades</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="btn btn-primary px-8">
                  Explore Content
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <button
              onClick={handleLogout}
              className="btn btn-outline hover:bg-red-500 hover:border-red-500 px-8 py-3 flex items-center justify-center mx-auto"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
