import React, { useState } from 'react';
import { Task, Category, Priority } from '../../types';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onClose?: () => void;
}

const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all text-sm";
const selectClass = "w-full px-4 py-2.5 rounded-xl bg-[#0b0f17] border border-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all text-sm appearance-none";
const labelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wider";

const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, onClose }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title,
      category,
      priority,
      dueDate,
      notes,
    });

    setTitle('');
    setCategory('Personal');
    setPriority('Medium');
    setDueDate('');
    setNotes('');
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-base font-semibold text-white">New Task</h3>
        {onClose && (
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Task Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className={labelClass}>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={selectClass}>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Learning">Learning</option>
            <option value="Custom">Custom</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={selectClass}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className={labelClass}>Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add some details..."
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-2.5 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] border border-white/10 flex items-center justify-center gap-2"
      >
        <Plus size={18} />
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
