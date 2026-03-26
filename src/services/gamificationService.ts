import { GamificationData, Task } from '../types';
import { fetchGamificationApi, saveGamificationApi } from '../api/gamificationApi';

export const getGamification = async (): Promise<GamificationData> => {
  return await fetchGamificationApi();
};

export const saveGamification = async (data: GamificationData): Promise<void> => {
  await saveGamificationApi(data);
};

export const getTodayDateNormalized = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 99 },
  { level: 2, min: 100, max: 249 },
  { level: 3, min: 250, max: 499 },
  { level: 4, min: 500, max: Infinity },
];

export const calculateLevel = (points: number): number => {
  const threshold = LEVEL_THRESHOLDS.find(t => points >= t.min && points <= t.max);
  return threshold ? threshold.level : 4;
};

export const calculateTaskPoints = (task: Task): number => {
  let points = 0;
  switch (task.priority) {
    case 'Low': points = 10; break;
    case 'Medium': points = 20; break;
    case 'High': points = 30; break;
  }

  if (task.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    if (today <= due) {
      points += 10;
    }
  }

  return points;
};

export const applyTaskCompletion = (currentGamification: GamificationData, pointsEarned: number): GamificationData => {
  const newPoints = currentGamification.totalPoints + pointsEarned;
  const newLevel = calculateLevel(newPoints);
  
  let newCurrentStreak = currentGamification.currentStreak;
  let newLongestStreak = currentGamification.longestStreak;
  const todayStr = getTodayDateNormalized();

  if (currentGamification.lastCompletedDate !== todayStr) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getTodayDateNormalized(yesterday);

    if (currentGamification.lastCompletedDate === yesterdayStr) {
      newCurrentStreak += 1;
    } else if (currentGamification.lastCompletedDate === null || currentGamification.lastCompletedDate < yesterdayStr) {
      newCurrentStreak = 1;
    }

    if (newCurrentStreak > newLongestStreak) {
      newLongestStreak = newCurrentStreak;
    }
  }

  return {
    totalPoints: newPoints,
    level: newLevel,
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastCompletedDate: todayStr,
  };
};

export const checkAndResetStreak = (currentGamification: GamificationData): GamificationData => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getTodayDateNormalized(yesterday);

  if (currentGamification.lastCompletedDate) {
    if (currentGamification.lastCompletedDate < yesterdayStr && currentGamification.currentStreak > 0) {
      return { ...currentGamification, currentStreak: 0 };
    }
  }
  return currentGamification;
};

export const removeTaskPoints = (currentGamification: GamificationData, pointsToDeduct: number): GamificationData => {
  const newPoints = Math.max(0, currentGamification.totalPoints - pointsToDeduct);
  return {
    ...currentGamification,
    totalPoints: newPoints,
    level: calculateLevel(newPoints),
  };
};
