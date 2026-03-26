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
        className="p-4 text-gray-500 hover:text-gray-200 hover:bg-white/5 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/10"
        title="Reset Timer"
      >
        <RotateCcw size={22} />
      </button>

      <button
        onClick={onToggle}
        className={`w-20 h-20 flex items-center justify-center rounded-3xl transition-all duration-300 border ${
          isRunning
            ? 'bg-white/5 backdrop-blur-xl text-white border-white/20 hover:bg-white/10'
            : 'bg-gradient-to-br from-purple-500/80 to-blue-500/80 text-white border-white/10 hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:scale-[1.05]'
        }`}
      >
        {isRunning ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" className="ml-1" />}
      </button>

      <div className="w-14" /> {/* Spacer for symmetry */}
    </div>
  );
};

export default TimerControls;
