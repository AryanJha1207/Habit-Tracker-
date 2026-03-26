import React from 'react';
import { PomodoroMode } from '../../types';

interface ModeSelectorProps {
  currentMode: PomodoroMode;
  onModeChange: (mode: PomodoroMode) => void;
  disabled: boolean;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange, disabled }) => {
  const modes: { id: PomodoroMode; label: string }[] = [
    { id: 'focus', label: 'Focus' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
  ];

  return (
    <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl mb-8 w-full">
      {modes.map((mode) => (
        <button
          key={mode.id}
          disabled={disabled}
          onClick={() => onModeChange(mode.id)}
          className={`flex-1 px-3 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
            currentMode === mode.id
              ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white border border-white/10'
              : 'text-gray-400 hover:text-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
