import React, { useState } from 'react';
import { Task, Category, Priority } from '../../types';
import { CheckCircle2, Circle, Trash2, Edit2, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const priorityColors = {
    Low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    High: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  };

  const categoryColors = {
    Work: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Personal: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/20',
    Health: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Learning: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    Custom: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onEdit({ ...task, title: editedTitle });
      setIsEditing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] ${
        task.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-0.5 transition-colors ${
            task.completed ? 'text-purple-400' : 'text-gray-600 hover:text-purple-400'
          }`}
        >
          {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mb-2">
              <input
                autoFocus
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleEditSubmit}
                className="w-full px-2 py-1 text-base font-medium bg-transparent border-b border-purple-500/50 text-white focus:outline-none"
              />
            </form>
          ) : (
            <h3
              className={`text-base font-medium truncate transition-all ${
                task.completed ? 'line-through text-gray-500' : 'text-white'
              }`}
            >
              {task.title}
            </h3>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${categoryColors[task.category]}`}>
              {task.category}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                <Calendar size={11} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>

          {task.notes && (
            <p className="mt-2 text-sm text-gray-500 line-clamp-2 italic">
              {task.notes}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200"
            title="Edit task"
          >
            <Edit2 size={15} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200"
            title="Delete task"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
