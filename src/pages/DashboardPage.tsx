// src/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext'; // Ajuste o caminho se necessário
import { LogOut, Award, ShieldCheck, BarChart3, UserCircle, Mail } from 'lucide-react'; // Ícones de exemplo

const DashboardPage: React.FC = () => {
  const { user, logout, loadingInitial } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Se o carregamento inicial da sessão terminou e não há usuário, redireciona
    if (!loadingInitial && !user) {
      console.log('[DashboardPage] Usuário não logado, redirecionando para home...');
      navigate('/'); // Redireciona para a HomePage
    }
  }, [user, loadingInitial, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/'); // Redireciona para a HomePage após o logout
  };

  if (loadingInitial) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-white/80">Loading your Zen Tribe dashboard...</p>
        {/* Você pode adicionar um spinner/loader visual aqui */}
      </div>
    );
  }

  if (!user) {
    // Este estado idealmente não deveria ser alcançado por muito tempo por causa do redirect no useEffect,
    // mas é uma salvaguarda.
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-xl text-red-400">Access denied. Please log in.</p>
      </div>
    );
  }

  // Se chegou aqui, o usuário está logado
  return (
    <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
            Welcome to your <span className="text-primary">Zen Dashboard</span>, {user.profile?.full_name || user.email}!
          </h1>
          <p className="text-lg text-white/70">This is your personal space within the Zen Tribe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Card de Perfil */}
          <div className="card p-6 bg-surface/80 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <UserCircle className="text-primary mr-3" size={28} />
              <h2 className="text-2xl font-semibold font-display">Your Profile</h2>
            </div>
            <p className="text-white/80 mb-1"><strong className="text-white/90">Email:</strong> {user.email}</p>
            <p className="text-white/80 mb-1"><strong className="text-white/90">Name:</strong> {user.profile?.full_name || 'N/A'}</p>
            <p className="text-white/80 mb-1"><strong className="text-white/90">Level:</strong> {user.profile?.level || 1}</p>
            <p className="text-white/80 mb-1"><strong className="text-white/90">XP:</strong> {user.profile?.xp || 0}</p>
            <p className="text-white/80"><strong className="text-white/90">Rank:</strong> {user.profile?.rank || 'Zen Newcomer'}</p>
            {/* Adicionar link para editar perfil no futuro */}
          </div>

          {/* Card de Achievements */}
          <div className="card p-6 bg-surface/80 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <Award className="text-secondary mr-3" size={28} />
              <h2 className="text-2xl font-semibold font-display">Achievements</h2>
            </div>
            {user.achievements && user.achievements.length > 0 ? (
              <ul className="space-y-2">
                {user.achievements.map(ach => (
                  <li key={ach.id} className="flex items-center text-white/80">
                    <span className="mr-2 text-lg">{ach.icon}</span>
                    <span>{ach.name} - <em className="text-xs text-white/60">Unlocked: {ach.unlockedAt ? new Date(ach.unlockedAt).toLocaleDateString() : 'N/A'}</em></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/70">No achievements unlocked yet. Keep exploring!</p>
            )}
          </div>

          {/* Card de Badges */}
          <div className="card p-6 bg-surface/80 backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <ShieldCheck className="text-accent mr-3" size={28} />
              <h2 className="text-2xl font-semibold font-display">Badges</h2>
            </div>
            {user.badges && user.badges.length > 0 ? (
              <ul className="space-y-2">
                {user.badges.map(badge => (
                  <li key={badge.id} className="flex items-center text-white/80">
                     <span className="mr-2 text-lg">{badge.image}</span> {/* Usando badge.image para o ícone */}
                    <span>{badge.name} ({badge.rarity}) - <em className="text-xs text-white/60">Acquired: {badge.acquiredAt ? new Date(badge.acquiredAt).toLocaleDateString() : 'N/A'}</em></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-white/70">No badges acquired yet. Stay active!</p>
            )}
          </div>

          {/* Placeholder para Conteúdo Exclusivo */}
          <div className="card p-6 bg-surface/80 backdrop-blur-sm md:col-span-2 lg:col-span-3">
             <div className="flex items-center mb-4">
              <Music className="text-primary mr-3" size={28} />
              <h2 className="text-2xl font-semibold font-display">Exclusive Content</h2>
            </div>
            <p className="text-white/70">Your exclusive mixes, early releases, and special content will appear here soon!</p>
            {/* Adicionar links para conteúdo exclusivo aqui */}
          </div>

        </div>

        <div className="mt-12 text-center">
          <button
            onClick={handleLogout}
            className="btn btn-outline hover:bg-error hover:text-white hover:border-error flex items-center justify-center mx-auto"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Importe motion se não estiver global ou adicione ao topo do arquivo
// import { motion } from 'framer-motion'; 
// Se motion já estiver disponível globalmente pelo setup do Bolt.new, este import pode não ser necessário aqui.
// Se não, e você não tiver framer-motion, instale com: npm install framer-motion

export default DashboardPage;