import { GamificationData } from '../types';
import { getFromStorage, saveToStorage } from '../services/storageHelper';

const GAMIFICATION_KEY = 'gamification';

export const DEFAULT_GAMIFICATION_DATA: GamificationData = {
  totalPoints: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null
};

export const fetchGamificationApi = async (): Promise<GamificationData> => {
  return new Promise(resolve => {
    const data = getFromStorage<GamificationData>(GAMIFICATION_KEY, DEFAULT_GAMIFICATION_DATA, (data) => {
      if (!data || typeof data !== 'object') return false;
      return typeof data.totalPoints === 'number' && typeof data.level === 'number';
    });
    setTimeout(() => resolve(data), 50);
  });
};

export const saveGamificationApi = async (data: GamificationData): Promise<void> => {
  return new Promise(resolve => {
    saveToStorage(GAMIFICATION_KEY, data);
    setTimeout(() => resolve(), 50);
  });
};
