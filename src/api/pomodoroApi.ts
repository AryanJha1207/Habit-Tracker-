import { PomodoroData } from '../services/pomodoroService';
import { getFromStorage, saveToStorage } from '../services/storageHelper';

const POMODORO_KEY = 'pomodoroSessions';

export const DEFAULT_POMODORO_DATA: PomodoroData = {
  mode: 'focus',
  timeLeft: null,
  autoStart: false,
  dailySessions: null
};

export const fetchPomodoroApi = async (): Promise<PomodoroData> => {
  return new Promise(resolve => {
    const data = getFromStorage<PomodoroData>(POMODORO_KEY, DEFAULT_POMODORO_DATA, (data) => {
      if (!data || typeof data !== 'object') return false;
      return typeof data.mode === 'string' && typeof data.timeLeft === 'number';
    });
    setTimeout(() => resolve(data), 50);
  });
};

export const savePomodoroApi = async (data: PomodoroData): Promise<void> => {
  return new Promise(resolve => {
    saveToStorage(POMODORO_KEY, data);
    setTimeout(() => resolve(), 50);
  });
};
