import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lightbulb, CheckCircle } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
import { getChallengeById } from '../data/challenges';
import { LEVELS } from '../data/levels';
import { getTodayString, calculateStreak, getStreakBonus } from '../utils/streak';
import { checkNewBadges } from '../data/badges';

export const ChallengePage: React.FC = () => {
  const { data, updateData } = useAppData();
  const navigate = useNavigate();
  const [reflection, setReflection] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const challenge = getChallengeById(
    data.userProgress.currentLevel,
    data.userProgress.currentDay
  );

  const currentLevel = LEVELS.find(l => l.id === data.userProgress.currentLevel);

  if (!challenge || !currentLevel) {
    return <div>Desafio não encontrado</div>;
  }

  const handleComplete = () => {
    setIsSaving(true);

    const today = getTodayString();
    const streakChange = calculateStreak(data.userProgress.lastActivityDate);
    
    let newStreak = data.userProgress.streak;
    if (streakChange === 1) {
      newStreak += 1;
    } else if (streakChange === -1) {
      newStreak = 1;
    } else if (streakChange === 0 && data.userProgress.lastActivityDate !== today) {
      newStreak += 1;
    }

    const streakBonus = getStreakBonus(newStreak);
    const totalXP = challenge.xp + streakBonus;

    const newCompleted = [
      ...data.completedChallenges,
      {
        levelId: challenge.levelId,
        dayId: challenge.id,
        completedDate: today,
        reflection,
        xpEarned: totalXP
      }
    ];

    const newProgress = {
      ...data.userProgress,
      currentDay: data.userProgress.currentDay + 1,
      totalXP: data.userProgress.totalXP + totalXP,
      streak: newStreak,
      lastActivityDate: today
    };

    if (data.userProgress.currentDay >= currentLevel.totalDays) {
      newProgress.currentLevel += 1;
      newProgress.currentDay = 1;
      newProgress.totalXP += 100; // Level completion bonus
    }

    const newBadges = checkNewBadges(data.badges, newProgress, newCompleted);

    updateData({
      userProgress: newProgress,
      completedChallenges: newCompleted,
      badges: [...data.badges, ...newBadges]
    });

    setTimeout(() => {
      setIsSaving(false);
      navigate('/');
    }, 500);
  };

  return (
    <motion.div
      className="space-y-6 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">{currentLevel.icon}</div>
          <div>
            <div className="text-sm text-primary font-semibold">
              Nível {challenge.levelId} • Dia {challenge.id}
            </div>
            <h1 className="text-2xl font-bold font-display">{challenge.title}</h1>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="text-primary" size={20} />
              Sua Missão
            </h2>
            <p className="text-white/80 leading-relaxed">{challenge.mission}</p>
          </div>

          <div className="bg-dark-lighter rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="text-accent" size={20} />
              💡 Teoria
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">{challenge.theory}</p>
          </div>

          <div>
            <label htmlFor="reflection" className="block text-sm font-semibold mb-2">
              Reflexão Pessoal
            </label>
            <textarea
              id="reflection"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Como foi sua experiência com este desafio? O que você aprendeu?"
              className="textarea"
              rows={6}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleComplete}
              disabled={isSaving}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSaving ? (
                'Salvando...'
              ) : (
                <>
                  <CheckCircle size={20} />
                  Marcar como Completo (+{challenge.xp} XP)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
