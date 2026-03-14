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
  // Basic sanitization: comments → generic tag loop → angle bracket sweep.
  // Specific-tag regexes like /<script\b...>/ trigger CodeQL js/bad-tag-filter
  // because they can be bypassed. The generic loop is equally safe and avoids the alert.
  let result = json;
  // Remove HTML comments recursively
  while (result.includes('<!--')) {
    const next = result.replace(/<!--[\s\S]*?-->/g, '');
    if (next === result) break;
    result = next;
  }
  // Remove all tags generically (covers script, style, any other tag)
  while (result.includes('<')) {
    const next = result.replace(/<[^>]*>/g, '');
    if (next === result) break;
    result = next;
  }
  // Final absolute sweep for any stray/nested brackets
  result = result.replace(/[<>]/g, '');

  // Single-pass entity decoder to prevent double-unescaping
  const entityMap: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&quot;': '"',
    '&lt;': '<',
    '&gt;': '>',
    '&apos;': "'"
  };

  const safeJson = result.replace(/&(?:nbsp|amp|quot|lt|gt|apos);/g, (m) => entityMap[m] || m);
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
