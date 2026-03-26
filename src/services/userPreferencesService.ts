import { Theme } from '../context/AppContext';
import { fetchUserPreferencesApi, saveUserPreferencesApi } from '../api/userPreferencesApi';

export interface UserPreferences {
  theme: Theme;
  minimalMode: boolean;
}

export const getUserPreferences = async (): Promise<UserPreferences> => {
  return await fetchUserPreferencesApi();
};

export const saveUserPreferences = async (preferences: UserPreferences): Promise<void> => {
  await saveUserPreferencesApi(preferences);
};
