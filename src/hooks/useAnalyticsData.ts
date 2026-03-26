import { useMemo } from 'react';
import { Category } from '../types';
import { useAppContext } from '../context/AppContext';

export const useAnalyticsData = () => {
  const { tasks } = useAppContext();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, percentage };
  }, [tasks]);

  const categoryDistribution = useMemo(() => {
    const categories: Category[] = ['Work', 'Personal', 'Health', 'Learning', 'Custom'];
    return categories.map(cat => ({
      name: cat,
      value: tasks.filter(t => t.category === cat).length,
    })).filter(item => item.value > 0);
  }, [tasks]);

  const categoryPerformance = useMemo(() => {
    const categories: Category[] = ['Work', 'Personal', 'Health', 'Learning', 'Custom'];
    return categories.map(cat => ({
      name: cat,
      completed: tasks.filter(t => t.category === cat && t.completed).length,
    }));
  }, [tasks]);

  const completionTrend = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const count = tasks.filter(t => {
        if (!t.completed || !t.completedAt) return false;
        const compDate = new Date(t.completedAt).toISOString().split('T')[0];
        return compDate === date;
      }).length;

      return {
        date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        completed: count,
      };
    });
  }, [tasks]);

  const recentActivity = useMemo(() => {
    return tasks
      .filter(t => t.completed && t.completedAt)
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        title: t.title,
        completedAt: t.completedAt,
      }));
  }, [tasks]);

  return {
    stats,
    categoryDistribution,
    categoryPerformance,
    completionTrend,
    recentActivity,
    hasData: tasks.length > 0,
  };
};
