import { Task } from '../types';
import { fetchTasksApi, saveTasksApi, insertTaskApi, updateTaskApi, deleteTaskApi } from '../api/taskApi';

export const getTasks = async (): Promise<Task[]> => {
  return await fetchTasksApi();
};

export const saveTasks = async (tasks: Task[]): Promise<void> => {
  await saveTasksApi(tasks);
};

export const addTask = async (task: Task): Promise<void> => {
  await insertTaskApi(task);
};

export const updateTask = async (taskId: string, updatedData: Partial<Task>, fullUpdatedTask?: Task): Promise<void> => {
  if (fullUpdatedTask) {
    await updateTaskApi(taskId, fullUpdatedTask);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  await deleteTaskApi(taskId);
};
