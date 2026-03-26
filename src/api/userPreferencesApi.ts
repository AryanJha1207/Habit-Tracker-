import { UserPreferences } from '../services/userPreferencesService';
import { getFromStorage, saveToStorage } from '../services/storageHelper';

const PREFERENCES_KEY = 'userPreferences';

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'default',
  minimalMode: false
};

export const fetchUserPreferencesApi = async (): Promise<UserPreferences> => {
  return new Promise(resolve => {
    const data = getFromStorage<UserPreferences>(PREFERENCES_KEY, DEFAULT_PREFERENCES, (data) => {
      if (!data || typeof data !== 'object') return false;
      return typeof data.theme === 'string' && typeof data.minimalMode === 'boolean';
    });
    setTimeout(() => resolve(data), 50);
  });
};

export const saveUserPreferencesApi = async (preferences: UserPreferences): Promise<void> => {
  return new Promise(resolve => {
    saveToStorage(PREFERENCES_KEY, preferences);
    setTimeout(() => resolve(), 50);
  });
};
