import { PomodoroMode, DailySessions } from '../types';
import { fetchPomodoroApi, savePomodoroApi } from '../api/pomodoroApi';

export interface PomodoroData {
  mode: PomodoroMode;
  timeLeft: number | null;
  autoStart: boolean;
  dailySessions: DailySessions | null;
}

export const getPomodoroData = async (): Promise<PomodoroData> => {
  return await fetchPomodoroApi();
};

export const savePomodoroData = async (data: PomodoroData): Promise<void> => {
  await savePomodoroApi(data);
};
