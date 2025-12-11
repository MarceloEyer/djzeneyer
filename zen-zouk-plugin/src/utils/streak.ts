import { differenceInDays, parseISO, format } from 'date-fns';

export const calculateStreak = (lastActivityDate: string | null): number => {
  if (!lastActivityDate) return 0;
  
  const today = new Date();
  const lastDate = parseISO(lastActivityDate);
  const daysDiff = differenceInDays(today, lastDate);
  
  if (daysDiff === 0) {
    return 0; // Same day, don't change streak
  } else if (daysDiff === 1) {
    return 1; // Continue streak
  } else {
    return -1; // Reset streak
  }
};

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getStreakBonus = (streak: number): number => {
  if (streak > 0 && streak % 7 === 0) {
    return 25;
  }
  return 0;
};
