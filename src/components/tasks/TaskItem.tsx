import React, { useState } from 'react';
import { Task, Category, Priority } from '../../types';
import { CheckCircle2, Circle, Trash2, Edit2, Calendar, Tag, MoreVertical } from 'lucide-react';
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
    Low: 'bg-blue-50 text-blue-600 border-blue-100',
    Medium: 'bg-amber-50 text-amber-600 border-amber-100',
    High: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const categoryColors = {
    Work: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    Personal: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Health: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    Learning: 'bg-violet-50 text-violet-600 border-violet-100',
    Custom: 'bg-slate-50 text-slate-600 border-slate-100',
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
      className={`group bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${
        task.completed ? 'opacity-75' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`mt-1 transition-colors ${
            task.completed ? 'text-indigo-600' : 'text-gray-300 hover:text-indigo-400'
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
                className="w-full px-2 py-1 text-lg font-medium border-b-2 border-indigo-500 focus:outline-none"
              />
            </form>
          ) : (
            <h3
              className={`text-lg font-medium text-gray-900 truncate transition-all ${
                task.completed ? 'line-through text-gray-400' : ''
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
                <Calendar size={12} />
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

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Edit task"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;
