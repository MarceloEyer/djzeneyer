export interface Challenge {
  id: number;
  levelId: number;
  title: string;
  mission: string;
  theory: string;
  xp: number;
}

export interface Level {
  id: number;
  name: string;
  icon: string;
  description: string;
  totalDays: number;
  color: string;
}

export interface CompletedChallenge {
  levelId: number;
  dayId: number;
  completedDate: string;
  reflection: string;
  xpEarned: number;
}

export interface UserProgress {
  currentLevel: number;
  currentDay: number;
  totalXP: number;
  streak: number;
  lastActivityDate: string | null;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress, completed: CompletedChallenge[]) => boolean;
}

export interface AppData {
  userProgress: UserProgress;
  completedChallenges: CompletedChallenge[];
  badges: string[];
}
