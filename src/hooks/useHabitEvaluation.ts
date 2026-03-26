import { useMemo } from 'react';
import { Category } from '../types';
import { useAppContext } from '../context/AppContext';

export interface HabitEvaluation {
  score: number;
  label: 'Poor' | 'Average' | 'Excellent';
  color: string;
  consistency: {
    currentStreak: number;
    longestStreak: number;
    message: string;
  };
  behavior: {
    onTimeRate: number;
    lateRate: number;
    insight: string;
  };
  balance: {
    distribution: Record<Category, number>;
    suggestion: string | null;
  };
  suggestions: string[];
  weeklySummary: {
    completedThisWeek: number;
  };
}

export const useHabitEvaluation = () => {
  const { tasks, gamificationData } = useAppContext();

  const evaluation = useMemo((): HabitEvaluation | null => {
    if (tasks.length === 0) return null;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed);
    const completedCount = completedTasks.length;

    // 1. Completion Rate (40%)
    const completionRate = totalTasks > 0 ? (completedCount / totalTasks) : 0;
    const completionScore = completionRate * 40;

    // 2. Consistency (30%)
    const currentStreak = gamificationData?.currentStreak || 0;
    const longestStreak = gamificationData?.longestStreak || 0;
    const consistencyScore = Math.min((currentStreak / 7) * 30, 30);

    // 3. On-time completion (20%)
    const completedOnTime = completedTasks.filter(t => {
      if (!t.dueDate || !t.completedAt) return true;
      const due = new Date(t.dueDate).getTime();
      return t.completedAt <= due;
    }).length;
    const onTimeRate = completedCount > 0 ? (completedOnTime / completedCount) : 1;
    const onTimeScore = onTimeRate * 20;

    // 4. Category Distribution (10%)
    const categories: Category[] = ['Work', 'Personal', 'Health', 'Learning', 'Custom'];
    const distribution: Record<Category, number> = {
      Work: 0, Personal: 0, Health: 0, Learning: 0, Custom: 0
    };
    tasks.forEach(t => distribution[t.category]++);

    let balanceScore = 10;
    let dominantCategory: Category | null = null;
    for (const cat of categories) {
      const ratio = distribution[cat] / totalTasks;
      if (ratio > 0.5) {
        balanceScore = 5;
        dominantCategory = cat;
      }
    }

    const totalScore = Math.round(completionScore + consistencyScore + onTimeScore + balanceScore);

    let label: 'Poor' | 'Average' | 'Excellent' = 'Average';
    let color = 'text-amber-500';
    if (totalScore <= 40) {
      label = 'Poor';
      color = 'text-red-500';
    } else if (totalScore >= 71) {
      label = 'Excellent';
      color = 'text-emerald-500';
    }

    const consistencyMessage = currentStreak >= 3
      ? "You are building strong consistency 🔥"
      : "Try to avoid missing days to maintain your streak";

    const lateRate = 1 - onTimeRate;
    const behaviorInsight = onTimeRate >= 0.8
      ? "Great time management! You complete most tasks on time."
      : "You tend to delay tasks. Try setting earlier reminders.";

    const balanceSuggestion = dominantCategory
      ? `You're heavily focused on ${dominantCategory}. Try to allocate more time to other areas.`
      : "Your task distribution is well-balanced!";

    const suggestions: string[] = [];
    if (completionRate < 0.5) suggestions.push("Focus on completing your existing tasks before adding new ones.");
    if (currentStreak < 3) suggestions.push("Maintain your streak by doing at least 1 task daily.");
    if (onTimeRate < 0.7) suggestions.push("Try completing tasks earlier in the day to avoid the late-night rush.");
    if (distribution['Health'] === 0) suggestions.push("Don't forget to add some Health-related habits to your routine.");
    if (totalTasks < 5) suggestions.push("Add more habits to build a more comprehensive daily routine.");

    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const completedThisWeek = completedTasks.filter(t => t.completedAt && t.completedAt > oneWeekAgo).length;

    return {
      score: totalScore,
      label,
      color,
      consistency: {
        currentStreak,
        longestStreak,
        message: consistencyMessage,
      },
      behavior: {
        onTimeRate: Math.round(onTimeRate * 100),
        lateRate: Math.round(lateRate * 100),
        insight: behaviorInsight,
      },
      balance: {
        distribution,
        suggestion: balanceSuggestion,
      },
      suggestions: suggestions.slice(0, 4),
      weeklySummary: {
        completedThisWeek,
      },
    };
  }, [tasks, gamificationData]);

  return { evaluation, hasData: tasks.length > 0 };
};
