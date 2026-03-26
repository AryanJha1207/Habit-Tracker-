/**
 * A centralized helper to safely interact with localStorage.
 * Includes JSON parsing and standard error handling to avoid app crashes.
 */
import { safeParse } from '../utils/storageUtils';

export const getFromStorage = <T>(key: string, defaultValue: T, validator?: (parsed: any) => boolean): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      return defaultValue;
    }
    
    // Inject automatic array vs object struct validation
    const robustValidator = (parsed: any) => {
      // 1. Array vs Object generic type constraint
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) return false;
      if (defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return false;
      }
      
      // 2. Custom logical validator provided by the caller
      if (validator && !validator(parsed)) return false;
      
      return true;
    };

    return safeParse<T>(item, defaultValue, robustValidator);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.warn(`Error saving to localStorage key "${key}":`, error);
  }
};

export const clearFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error removing localStorage key "${key}":`, error);
  }
};

export const clearAllStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.warn('Error clearing all localStorage:', error);
  }
};
