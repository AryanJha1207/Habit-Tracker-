import { useAppContext } from '../context/AppContext';

const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 99 },
  { level: 2, min: 100, max: 249 },
  { level: 3, min: 250, max: 499 },
  { level: 4, min: 500, max: Infinity },
];

export const useGamification = () => {
  const { gamificationData } = useAppContext();

  const calculateLevel = (points: number): number => {
    const threshold = LEVEL_THRESHOLDS.find(t => points >= t.min && points <= t.max);
    return threshold ? threshold.level : 4;
  };

  const getLevelProgress = () => {
    const currentLevel = calculateLevel(gamificationData.totalPoints);
    const threshold = LEVEL_THRESHOLDS.find(t => t.level === currentLevel);
    if (!threshold || threshold.max === Infinity) return 100;
    
    const range = threshold.max - threshold.min;
    const progress = gamificationData.totalPoints - threshold.min;
    return Math.min(Math.round((progress / range) * 100), 100);
  };

  // Note: handleTaskCompletion is now baked directly into completeTask from AppContext.
  // We export gamificationData directly via useAppContext now, but we keep this hook for convenience.
  // The pages that used handleTaskCompletion will just use completeTask directly from useAppContext.
  
  return {
    gamificationData,
    getLevelProgress,
  };
};
