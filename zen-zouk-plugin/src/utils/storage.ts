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
  // Basic sanitization to prevent potential injection in JSON viewers if re-imported or viewed
  const safeJson = json.replace(/<(?:.|\n)*?>/gm, '');
  const blob = new Blob([safeJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // SEGURANÇA: Gatilho de download controlado sem appendChild dinâmico (Evita DOM XSS)
  const a = document.createElement('a');
  a.href = url;
  a.download = `zen-zouk-journal-${new Date().toISOString().split('T')[0]}.json`;

  // Dispara o clique sem adicionar ao DOM
  a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  // Revogação imediata do objeto URL após o evento de clique ser processado
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
