import type { AppData, UserProgress, CompletedChallenge } from '../types';

const STORAGE_KEY = 'zen_zouk_data';

const defaultData: AppData = {
  userProgress: {
    currentLevel: 1,
    currentDay: 1,
    totalXP: 0,
    streak: 0,
    lastActivityDate: null
  },
  completedChallenges: [],
  badges: []
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultData;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading data:', error);
    return defaultData;
  }
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

export const updateProgress = (updates: Partial<UserProgress>): void => {
  const data = loadData();
  data.userProgress = { ...data.userProgress, ...updates };
  saveData(data);
};

export const addCompletedChallenge = (challenge: CompletedChallenge): void => {
  const data = loadData();
  data.completedChallenges.push(challenge);
  saveData(data);
};

export const addBadge = (badgeId: string): void => {
  const data = loadData();
  if (!data.badges.includes(badgeId)) {
    data.badges.push(badgeId);
    saveData(data);
  }
};

export const exportJournal = (): void => {
  const data = loadData();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `zen-zouk-journal-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
