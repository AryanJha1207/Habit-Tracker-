import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, GamificationData } from '../types';
import { getTasks, addTask as dbAddTask, updateTask as dbUpdateTask, deleteTask as dbDeleteTask } from '../services/taskService';
import { getGamification, saveGamification, calculateTaskPoints, applyTaskCompletion, removeTaskPoints, checkAndResetStreak } from '../services/gamificationService';
import { getPomodoroData, savePomodoroData, PomodoroData } from '../services/pomodoroService';
import { getUserPreferences, saveUserPreferences, UserPreferences } from '../services/userPreferencesService';

import { DEFAULT_GAMIFICATION_DATA } from '../api/gamificationApi';
import { DEFAULT_POMODORO_DATA } from '../api/pomodoroApi';
import { DEFAULT_PREFERENCES } from '../api/userPreferencesApi';

export type Theme = 'default' | 'light' | 'dark';

export interface AppContextType {
  tasks: Task[];
  gamificationData: GamificationData;
  pomodoroData: PomodoroData;
  preferences: UserPreferences;
  loading: boolean;

  addTask: (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => Promise<void>;
  updateTask: (id: string, updatedData: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  updatePreferences: (data: Partial<UserPreferences>) => void;
  updatePomodoroData: (data: Partial<PomodoroData>) => void;
  updateGamification: (data: Partial<GamificationData>) => void;
  refreshTasks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [gamificationData, setGamificationData] = useState<GamificationData>(DEFAULT_GAMIFICATION_DATA);
  const [pomodoroData, setPomodoroData] = useState<PomodoroData>(DEFAULT_POMODORO_DATA);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  const initializeData = async () => {
    setLoading(true);
    const [fetchedTasks, fetchedGamification, fetchedPomodoro, fetchedPreferences] = await Promise.all([
      getTasks(),
      getGamification(),
      getPomodoroData(),
      getUserPreferences(),
    ]);

    const verifiedGamification = checkAndResetStreak(fetchedGamification);

    setTasks(fetchedTasks);
    setGamificationData(verifiedGamification);
    setPomodoroData(fetchedPomodoro);
    setPreferences(fetchedPreferences);
    
    setLoading(false);
  };

  useEffect(() => {
    initializeData();
    
    const handleStorageChange = () => initializeData();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Sync preferences (Theme/Minimal Mode)
  useEffect(() => {
    saveUserPreferences(preferences);
    document.documentElement.classList.remove('light', 'dark');
    if (preferences.theme !== 'default') {
      document.documentElement.classList.add(preferences.theme);
    }
    if (preferences.minimalMode) {
      document.documentElement.classList.add('minimal-mode');
    } else {
      document.documentElement.classList.remove('minimal-mode');
    }
  }, [preferences]);

  // Sync state with API passively
  useEffect(() => {
    saveGamification(gamificationData);
  }, [gamificationData]);

  useEffect(() => {
    savePomodoroData(pomodoroData);
  }, [pomodoroData]);

  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks(prev => [newTask, ...prev]);
    await dbAddTask(newTask);
  }, []);

  const updateTask = useCallback(async (id: string, updatedData: Partial<Task>) => {
    let fullUpdatedTask: Task | undefined;
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        fullUpdatedTask = { ...t, ...updatedData };
        return fullUpdatedTask;
      }
      return t;
    }));
    if (fullUpdatedTask) {
      await dbUpdateTask(id, updatedData, fullUpdatedTask);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    let deletedTask: Task | undefined;
    setTasks(prev => {
      deletedTask = prev.find(t => t.id === id);
      return prev.filter(t => t.id !== id);
    });

    if (deletedTask?.completed && deletedTask.awardedPoints && deletedTask.pointsEarned) {
      setGamificationData(prev => removeTaskPoints(prev, deletedTask!.pointsEarned!));
    }

    await dbDeleteTask(id);
  }, []);

  const completeTask = useCallback(async (id: string) => {
    let taskToComplete: Task | undefined;
    
    setTasks(prev => {
      const existing = prev.find(t => t.id === id);
      if (!existing) return prev;
      taskToComplete = existing;
      
      const isCompleting = !existing.completed;
      const completedAt = isCompleting ? Date.now() : undefined;
      
      return prev.map(t => t.id === id ? { ...t, completed: isCompleting, completedAt } : t);
    });

    setTimeout(async () => {
      if (!taskToComplete) return;

      const isCompleting = !taskToComplete.completed;
      const completedAt = isCompleting ? Date.now() : undefined;
      
      let awardedPoints = taskToComplete.awardedPoints;
      let pointsEarned = taskToComplete.pointsEarned;

      if (isCompleting && !taskToComplete.awardedPoints) {
        pointsEarned = calculateTaskPoints(taskToComplete);
        awardedPoints = true;
        setGamificationData(prev => applyTaskCompletion(prev, pointsEarned!));
        
        setTasks(prev => prev.map(t => t.id === id ? { ...t, awardedPoints, pointsEarned } : t));
      }

      await dbUpdateTask(id, { 
        completed: isCompleting, 
        completedAt,
        awardedPoints,
        pointsEarned
      }, {
        ...taskToComplete,
        completed: isCompleting, 
        completedAt,
        awardedPoints,
        pointsEarned
      });
    }, 0);
  }, []);

  const updatePreferences = useCallback((data: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...data }));
  }, []);

  const updatePomodoroData = useCallback((data: Partial<PomodoroData>) => {
    setPomodoroData(prev => ({ ...prev, ...data }));
  }, []);

  const updateGamification = useCallback((data: Partial<GamificationData>) => {
    setGamificationData(prev => ({ ...prev, ...data }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        tasks,
        gamificationData,
        pomodoroData,
        preferences,
        loading,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        updatePreferences,
        updatePomodoroData,
        updateGamification,
        refreshTasks: initializeData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
