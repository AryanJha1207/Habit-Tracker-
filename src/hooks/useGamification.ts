import { useState, useEffect, useCallback } from 'react';
import { Task, GamificationData } from '../types';

const STORAGE_KEY = 'habit-tracker-gamification';

const DEFAULT_DATA: GamificationData = {
  totalPoints: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
};

const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 99 },
  { level: 2, min: 100, max: 249 },
  { level: 3, min: 250, max: 499 },
  { level: 4, min: 500, max: Infinity },
];

export const useGamification = () => {
  const [data, setData] = useState<GamificationData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const calculateLevel = (points: number): number => {
    const threshold = LEVEL_THRESHOLDS.find(t => points >= t.min && points <= t.max);
    return threshold ? threshold.level : 4;
  };

  const getLevelProgress = () => {
    const currentLevel = calculateLevel(data.totalPoints);
    const threshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel);
    if (!threshold || threshold.max === Infinity) return 100;
    
    const range = threshold.max - threshold.min;
    const progress = data.totalPoints - threshold.min;
    return Math.min(Math.round((progress / range) * 100), 100);
  };

  const handleTaskCompletion = useCallback((task: Task) => {
    // Only award points if completing for the first time (or toggling back to complete)
    // In this simple implementation, we assume TaskManager calls this only when completed is true.
    
    let pointsEarned = 0;
    switch (task.priority) {
      case 'Low': pointsEarned = 10; break;
      case 'Medium': pointsEarned = 20; break;
      case 'High': pointsEarned = 30; break;
    }

    // Bonus for completing before due date
    if (task.dueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      if (today <= due) {
        pointsEarned += 10;
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    
    setData(prev => {
      const newPoints = prev.totalPoints + pointsEarned;
      const newLevel = calculateLevel(newPoints);
      
      let newCurrentStreak = prev.currentStreak;
      let newLongestStreak = prev.longestStreak;
      
      if (prev.lastCompletedDate !== todayStr) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (prev.lastCompletedDate === yesterdayStr) {
          newCurrentStreak += 1;
        } else if (prev.lastCompletedDate === null || prev.lastCompletedDate < yesterdayStr) {
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
    });
  }, []);

  // Check for streak reset on mount (if user hasn't completed a task today or yesterday)
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const lastDate = data.lastCompletedDate ? new Date(data.lastCompletedDate) : null;
    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
      if (lastDate < yesterday) {
        setData(prev => ({ ...prev, currentStreak: 0 }));
      }
    }
  }, []);

  return {
    gamificationData: data,
    handleTaskCompletion,
    getLevelProgress,
  };
};
