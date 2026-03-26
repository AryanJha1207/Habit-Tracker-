import React, { useState, useEffect, useMemo } from 'react';
import { Task, Category, StatusFilter } from '../types';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import FilterBar from '../components/tasks/FilterBar';
import { Plus, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TaskManager: React.FC = () => {
  const { tasks, loading, addTask, updateTask, deleteTask, completeTask } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'All'>('All');



  const handleAddTask = async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    await addTask(taskData);
    setShowForm(false);
  };

  const toggleComplete = async (id: string) => {
    await completeTask(id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const editTask = async (updatedTask: Task) => {
    await updateTask(updatedTask.id, updatedTask);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const title = task?.title || '';
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Completed' && task.completed) ||
        (statusFilter === 'Pending' && !task.completed);
      const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tasks, searchQuery, statusFilter, categoryFilter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Manager</h1>
          <p className="text-gray-400 mt-1">Organize your life, one task at a time.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)] border border-white/10"
        >
          <Plus size={20} />
          <span>Add New Task</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Tasks</p>
          <p className="text-2xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-bold text-cyan-400 mt-2">{stats.completed}</p>
        </div>
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(139,92,246,0.1)]">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-bold text-purple-400 mt-2">{stats.pending}</p>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <TaskForm onAddTask={handleAddTask} onClose={() => setShowForm(false)} />
        </div>
      )}

      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 rounded-full border-b-2 border-purple-500 animate-spin"></div>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={toggleComplete}
            onDelete={handleDeleteTask}
            onEdit={editTask}
          />
        )}
      </div>
    </div>
  );
};

export default TaskManager;
