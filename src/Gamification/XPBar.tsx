// src/components/Gamification/XPBar.tsx (VERSÃO SIMPLES)
import React from 'react';
import { useGamiPress } from '../../hooks/useGamiPress';

const XPBar: React.FC = () => {
  const { data, loading } = useGamiPress();

  if (loading || !data) return <div>Carregando...</div>;

  const progress = (data.points % 100);
  const percentage = progress;

  return (
    <div className="bg-surface p-4 rounded-lg">
      <div className="flex justify-between mb-2">
        <span>Level {data.level}</span>
        <span>{data.points} XP</span>
      </div>
      <div className="h-2 bg-black/30 rounded-full">
        <div 
          className="h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default XPBar;
