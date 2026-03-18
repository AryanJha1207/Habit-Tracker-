export type Priority = 'Low' | 'Medium' | 'High';
export type Category = 'Work' | 'Personal' | 'Health' | 'Learning' | 'Custom';
export type StatusFilter = 'All' | 'Completed' | 'Pending';

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  notes: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

export interface GamificationData {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null; // ISO date string YYYY-MM-DD
}

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroState {
  mode: PomodoroMode;
  timeLeft: number;
  isRunning: boolean;
  autoStart: boolean;
}

export interface DailySessions {
  date: string;
  sessionsCompleted: number;
}
