import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
}

const TimerControls: React.FC<TimerControlsProps> = ({ isRunning, onToggle, onReset }) => {
  return (
    <div className="flex items-center gap-6">
      <button
        onClick={onReset}
        className="p-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all"
        title="Reset Timer"
      >
        <RotateCcw size={24} />
      </button>

      <button
        onClick={onToggle}
        className={`w-20 h-20 flex items-center justify-center rounded-3xl transition-all shadow-lg ${
          isRunning
            ? 'bg-white text-gray-900 border border-gray-100 hover:bg-gray-50'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
        }`}
      >
        {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
      </button>

      <div className="w-14" /> {/* Spacer for symmetry */}
    </div>
  );
};

export default TimerControls;
