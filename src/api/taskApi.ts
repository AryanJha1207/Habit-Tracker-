import { Task } from '../types';
import { supabase } from '../supabase';
import { getFromStorage, saveToStorage } from '../services/storageHelper';

const TASKS_KEY = 'tasks';

const mapRowToTask = (row: any): Task => ({
  id: row.id,
  title: row.title,
  category: row.category,
  priority: row.priority,
  dueDate: row.due_date || '',
  notes: row.notes || '',
  completed: row.completed,
  createdAt: Number(row.created_at),
  completedAt: row.completed_at ? Number(row.completed_at) : undefined,
  awardedPoints: row.awarded_points || false,
  pointsEarned: row.points_earned || 0,
});

const mapTaskToRow = (task: Task, userId: string) => ({
  id: task.id,
  user_id: userId,
  title: task.title,
  category: task.category,
  priority: task.priority,
  due_date: task.dueDate || null,
  notes: task.notes || null,
  completed: task.completed,
  created_at: task.createdAt,
  completed_at: task.completedAt || null,
  awarded_points: task.awardedPoints || false,
  points_earned: task.pointsEarned || 0,
});

const getLocalTasks = (): Task[] => {
  return getFromStorage<Task[]>(TASKS_KEY, [], (data) => {
    if (!Array.isArray(data)) return false;
    return data.every(task => task && typeof task.id === 'string' && typeof task.title === 'string');
  });
};

export const fetchTasksApi = async (): Promise<Task[]> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Promise(resolve => setTimeout(() => resolve(getLocalTasks()), 100));
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching tasks from Supabase:', error);
    return getLocalTasks();
  }

  const tasks = data.map(mapRowToTask);
  saveToStorage(TASKS_KEY, tasks);
  return tasks;
};

export const saveTasksApi = async (tasks: Task[]): Promise<void> => {
  return new Promise(resolve => {
    saveToStorage(TASKS_KEY, tasks);
    setTimeout(() => resolve(), 50);
  });
};

export const insertTaskApi = async (task: Task): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase.from('tasks').insert(mapTaskToRow(task, user.id));
    if (error) console.error('Error inserting task to Supabase:', error);
  }
};

export const updateTaskApi = async (taskId: string, fullUpdatedTask: Task): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase
      .from('tasks')
      .update(mapTaskToRow(fullUpdatedTask, user.id))
      .eq('id', taskId);
    if (error) console.error('Error updating task in Supabase:', error);
  }
};

export const deleteTaskApi = async (taskId: string): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) console.error('Error deleting task from Supabase:', error);
  }
};
