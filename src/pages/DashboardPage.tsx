// src/pages/DashboardPage.tsx (ou ProfilePage.tsx)
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Ajuste o caminho se necessário
import { LogOut, Award, ShieldCheck, UserCircle, Mail, BarChart3, Activity, CalendarDays } from 'lucide-react'; // Ícones de exemplo
import { motion } from 'framer-motion'; // Para animações

const DashboardPage: React.FC = () => {
  const { user, logout, loadingInitial } = useUser();
  const navigate = useNavigate();

  console.log('[DashboardPage] Componente renderizado. loadingInitial:', loadingInitial, 'user:', user);

  useEffect(() => {
    if (!loadingInitial && !user) {
      console.log('[DashboardPage] Usuário não logado ou sessão expirou, redirecionando para home...');
      navigate('/');
    }
  }, [user, loadingInitial, navigate]);

  const handleLogout = async () => {
    console.log('[DashboardPage] Iniciando logout...');
    await logout();
    console.log('[DashboardPage] Logout finalizado, navegando para home.');
    navigate('/');
  };

  if (loadingInitial) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"> {/* Ajuste de altura */}
        <p className="text-2xl text-white/80 font-display">Loading your Zen Tribe dashboard...</p>
        {/* Adicionar um spinner visual aqui seria bom */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mt-6"></div>
      </div>
    );
  }

  if (!user || !user.profile) { // Adicionada verificação para user.profile
    // Este estado pode ser brevemente visível se o redirect demorar ou se o perfil não carregar
    console.log('[DashboardPage] Usuário NULO ou perfil NULO após loadingInitial ser false. User:', user);
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[calc(100vh-200px)]">
        <p className="text-xl text-red-400">Access denied or profile not loaded. Please try logging in again.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-4">Go to Homepage</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10 md:mb-12 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display mb-3 text-white">
            Welcome to your <span className="text-primary">Zen Dashboard</span>, {user.profile.full_name || user.email}!
          </h1>
          <p className="text-lg md:text-xl text-white/70">This is your personal space within the Zen Tribe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Card de Perfil */}
          <div className="card p-6 md:p-8 bg-surface/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center mb-4">
              <UserCircle className="text-primary mr-3 flex-shrink-0" size={32} />
              <h2 className="text-2xl font-semibold font-display text-white">Your Profile</h2>
            </div>
            <p className="text-white/80 mb-2"><strong className="font-medium text-white/90">Email:</strong> {user.email}</p>
            <p className="text-white/80 mb-2"><strong className="font-medium text-white/90">Name:</strong> {user.profile.full_name || 'N/A'}</p>
            <p className="text-white/80 mb-2"><strong className="font-medium text-white/90">Joined:</strong> {user.profile.joinDate ? new Date(user.profile.joinDate).toLocaleDateString() : 'N/A'}</p>
            {/* Adicionar link para editar perfil e settings no futuro */}
          </div>

          {/* Card de Status/Gamificação */}
          <div className="card p-6 md:p-8 bg-surface/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center mb-4">
              <BarChart3 className="text-secondary mr-3 flex-shrink-0" size={32} />
              <h2 className="text-2xl font-semibold font-display text-white">Your Status</h2>
            </div>
            <p className="text-white/80 mb-2"><strong className="font-medium text-white/90">Level:</strong> {user.profile.level || 1}</p>
            <p className="text-white/80 mb-2"><strong className="font-medium text-white/90">XP:</strong> {user.profile.xp || 0}</p>
            <p className="text-white/80"><strong className="font-medium text-white/90">Rank:</strong> {user.profile.rank || 'Zen Newcomer'}</p>
             {/* Adicionar lastActive e streakDays se implementado */}
          </div>
          
          {/* Card de Achievements */}
          <div className="card p-6 md:p-8 bg-surface/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center mb-4">
              <Award className="text-accent mr-3 flex-shrink-0" size={32} />
              <h2 className="text-2xl font-semibold font-display text-white">Achievements</h2>
            </div>
            {user.achievements && user.achievements.length > 0 ? (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Scroll para muitos achievements */}
                {user.achievements.map(ach => (
                  <li key={ach.id} className="flex items-start text-white/80 p-2 rounded-md hover:bg-white/5">
                    <span className="mr-3 text-xl mt-0.5">{ach.icon}</span>
                    <div>
                        <span className="font-medium text-white/95 block">{ach.name}</span>
                        <em className="text-xs text-white/60 block">{ach.description}</em>
                        <em className="text-xs text-white/60">Unlocked: {ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : 'N/A'}</em>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/70">No achievements unlocked yet. Keep exploring!</p>
            )}
          </div>

          {/* Card de Badges */}
          <div className="card p-6 md:p-8 bg-surface/80 backdrop-blur-sm rounded-xl">
            <div className="flex items-center mb-4">
              <ShieldCheck className="text-success mr-3 flex-shrink-0" size={32} />
              <h2 className="text-2xl font-semibold font-display text-white">Badges</h2>
            </div>
            {user.badges && user.badges.length > 0 ? (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Scroll para muitos badges */}
                {user.badges.map(badge => (
                  <li key={badge.id} className="flex items-start text-white/80 p-2 rounded-md hover:bg-white/5">
                     <span className="mr-3 text-xl mt-0.5">{badge.image}</span>
                     <div>
                        <span className="font-medium text-white/95 block">{badge.name} <span className={`text-xs capitalize text-${badge.rarity}-text`}>({badge.rarity})</span></span>
                        <em className="text-xs text-white/60 block">{badge.description}</em>
                        <em className="text-xs text-white/60">Acquired: {badge.acquiredAt ? new Date(badge.acquiredAt).toLocaleDateString() : 'N/A'}</em>
                     </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/70">No badges acquired yet. Stay active!</p>
            )}
          </div>

          {/* Placeholder para Conteúdo Exclusivo */}
          <div className="card p-6 md:p-8 bg-surface/80 backdrop-blur-sm rounded-xl md:col-span-2 xl:col-span-full"> {/* Ocupa mais espaço */}
             <div className="flex items-center mb-4">
              <Music className="text-primary mr-3 flex-shrink-0" size={32} />
              <h2 className="text-2xl font-semibold font-display text-white">Exclusive Content</h2>
            </div>
            <p className="text-white/70">Your exclusive mixes, early releases, and special content will appear here soon!</p>
            {/* Adicionar links para conteúdo exclusivo aqui */}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleLogout}
            className="btn btn-outline hover:bg-error hover:text-white hover:border-error flex items-center justify-center mx-auto px-6 py-3 text-base"
          >
            <LogOut size={20} className="mr-2.5" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;