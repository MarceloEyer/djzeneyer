import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap, Award } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { StatCard } from '../components/StatCard';
import { ProgressBar } from '../components/ProgressBar';
import { WelcomeModal } from '../components/WelcomeModal';
import { getChallengeById } from '../data/challenges';
import { LEVELS } from '../data/levels';
import { BADGES } from '../data/badges';

export const HomePage: React.FC = () => {
  const { data } = useAppData();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('zen_zouk_welcome_seen');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('zen_zouk_welcome_seen', 'true');
  };

  const currentChallenge = getChallengeById(
    data.userProgress.currentLevel,
    data.userProgress.currentDay
  );

  const currentLevel = LEVELS.find(l => l.id === data.userProgress.currentLevel);
  
  const levelProgress = data.completedChallenges.filter(
    c => c.levelId === data.userProgress.currentLevel
  ).length;

  const earnedBadges = BADGES.filter(b => data.badges.includes(b.id));
  const latestBadges = earnedBadges.slice(-3);

  return (
    <>
      <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />
      
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display text-gradient mb-2">
            Conexão Zouk
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Flame className="text-orange-500" size={20} />
            <span className="text-xl font-semibold">
              {data.userProgress.streak} dias
            </span>
          </div>
        </div>

        {/* Desafio do Dia */}
        {currentChallenge && (
          <Link to="/desafio">
            <motion.div
              className="card card-hover bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{currentLevel?.icon}</div>
                <div className="flex-1">
                  <div className="text-sm text-primary font-semibold mb-1">
                    DESAFIO DO DIA
                  </div>
                  <h2 className="text-2xl font-bold font-display mb-2">
                    {currentChallenge.title}
                  </h2>
                  <p className="text-white/70 mb-4 line-clamp-2">
                    {currentChallenge.mission}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">
                      Nível {data.userProgress.currentLevel} • Dia {data.userProgress.currentDay}
                    </span>
                    <span className="btn btn-primary text-sm py-2">
                      Ver Desafio →
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        )}

        {/* Progresso do Nível */}
        {currentLevel && (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Progresso Atual</h3>
            <ProgressBar
              current={levelProgress}
              total={currentLevel.totalDays}
              label={`${currentLevel.icon} ${currentLevel.name}`}
            />
          </div>
        )}

        {/* Estatísticas */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Estatísticas</h3>
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              icon={Zap}
              value={data.userProgress.totalXP}
              label="XP Total"
            />
            <StatCard
              icon={Flame}
              value={data.userProgress.streak}
              label="Streak"
              color="orange-500"
            />
            <StatCard
              icon={Trophy}
              value={data.badges.length}
              label="Badges"
              color="accent"
            />
          </div>
        </div>

        {/* Últimos Badges */}
        {latestBadges.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Badges Recentes</h3>
              <Link to="/badges" className="text-sm text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="flex gap-3">
              {latestBadges.map(badge => (
                <motion.div
                  key={badge.id}
                  className="flex-1 card bg-dark-lighter text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className="text-xs font-medium">{badge.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link to="/niveis">
            <motion.div
              className="card card-hover text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Award className="mx-auto mb-2 text-primary" size={32} />
              <div className="font-semibold">Ver Níveis</div>
            </motion.div>
          </Link>
          <Link to="/journal">
            <motion.div
              className="card card-hover text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trophy className="mx-auto mb-2 text-accent" size={32} />
              <div className="font-semibold">Meu Journal</div>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </>
  );
};
