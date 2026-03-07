import type { Badge } from '../types';

export interface BadgeConditionProgress {
  streak: number;
  [key: string]: unknown;
}

export interface BadgeConditionCompleted {
  levelId?: number;
  reflection?: string;
  [key: string]: unknown;
}

export const BADGES: Badge[] = [
  {
    id: 'badge_day1',
    name: 'Começou a Jornada',
    description: 'Complete seu primeiro desafio',
    icon: '🔥',
    condition: (progress, completed) => completed.length >= 1
  },
  {
    id: 'badge_streak3',
    name: '3 Dias Seguidos',
    description: 'Mantenha uma sequência de 3 dias',
    icon: '⚡',
    condition: (progress) => progress.streak >= 3
  },
  {
    id: 'badge_streak7',
    name: 'Uma Semana Forte',
    description: 'Mantenha uma sequência de 7 dias',
    icon: '💪',
    condition: (progress) => progress.streak >= 7
  },
  {
    id: 'badge_level1',
    name: 'Mestre da Presença',
    description: 'Complete o Nível 1: Olhar e Presença',
    icon: '🌟',
    condition: (progress, completed) => {
      const level1Completed = completed.filter(c => c.levelId === 1).length;
      return level1Completed >= 21;
    }
  },
  {
    id: 'badge_30days',
    name: 'Dedicação Total',
    description: 'Complete 30 desafios no total',
    icon: '🎯',
    condition: (progress, completed) => completed.length >= 30
  },
  {
    id: 'badge_streak14',
    name: 'Duas Semanas Imparáveis',
    description: 'Mantenha uma sequência de 14 dias',
    icon: '🚀',
    condition: (progress) => progress.streak >= 14
  },
  {
    id: 'badge_level2',
    name: 'Comunicador Natural',
    description: 'Complete o Nível 2: Conexão Verbal',
    icon: '💬',
    condition: (progress, completed) => {
      const level2Completed = completed.filter(c => c.levelId === 2).length;
      return level2Completed >= 21;
    }
  },
  {
    id: 'badge_streak21',
    name: 'Hábito Formado',
    description: 'Mantenha uma sequência de 21 dias',
    icon: '💎',
    condition: (progress) => progress.streak >= 21
  },
  {
    id: 'badge_level3',
    name: 'Mestre do Toque',
    description: 'Complete o Nível 3: Toque Social',
    icon: '🤝',
    condition: (progress, completed) => {
      const level3Completed = completed.filter(c => c.levelId === 3).length;
      return level3Completed >= 21;
    }
  },
  {
    id: 'badge_50days',
    name: 'Meio Caminho',
    description: 'Complete 50 desafios no total',
    icon: '🎪',
    condition: (progress, completed) => completed.length >= 50
  },
  {
    id: 'badge_level4',
    name: 'Dançarino Conectado',
    description: 'Complete o Nível 4: Conexão de Dança',
    icon: '💃',
    condition: (progress, completed) => {
      const level4Completed = completed.filter(c => c.levelId === 4).length;
      return level4Completed >= 21;
    }
  },
  {
    id: 'badge_level5',
    name: 'Artista Completo',
    description: 'Complete o Nível 5: Intimidade Artística',
    icon: '✨',
    condition: (progress, completed) => {
      const level5Completed = completed.filter(c => c.levelId === 5).length;
      return level5Completed >= 21;
    }
  },
  {
    id: 'badge_all_levels',
    name: 'Jornada Completa',
    description: 'Complete todos os 5 níveis',
    icon: '🏆',
    condition: (progress, completed) => completed.length >= 105
  },
  {
    id: 'badge_reflective',
    name: 'Pensador Profundo',
    description: 'Escreva reflexões em 20 desafios',
    icon: '📝',
    condition: (progress, completed) => {
      const withReflection = completed.filter(c => c.reflection && c.reflection.length > 50).length;
      return withReflection >= 20;
    }
  }
];

export const checkNewBadges = (
  currentBadges: string[],
  progress: BadgeConditionProgress,
  completed: BadgeConditionCompleted[]
): string[] => {
  const newBadges: string[] = [];

  BADGES.forEach(badge => {
    if (!currentBadges.includes(badge.id) && badge.condition(progress, completed)) {
      newBadges.push(badge.id);
    }
  });

  return newBadges;
};
