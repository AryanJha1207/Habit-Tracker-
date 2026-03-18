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
    <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl mb-8">
      {modes.map((mode) => (
        <button
          key={mode.id}
          disabled={disabled}
          onClick={() => onModeChange(mode.id)}
          className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
            currentMode === mode.id
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
};

export default ModeSelector;
