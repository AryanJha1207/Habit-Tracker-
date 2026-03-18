import React from 'react';
import { motion } from 'motion/react';

interface TimerDisplayProps {
  timeLeft: number;
  totalTime: number;
  mode: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, totalTime, mode }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progress = (timeLeft / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const modeColors = {
    focus: 'text-indigo-600',
    shortBreak: 'text-emerald-600',
    longBreak: 'text-cyan-600',
  };

  const modeBgColors = {
    focus: 'stroke-indigo-600',
    shortBreak: 'stroke-emerald-600',
    longBreak: 'stroke-cyan-600',
  };

  return (
    <div className="relative flex items-center justify-center w-80 h-80 mb-8">
      {/* Background Circle */}
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-100"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'linear' }}
          className={`${modeBgColors[mode as keyof typeof modeBgColors]} rounded-full`}
          strokeLinecap="round"
        />
      </svg>

      <div className="text-center z-10">
        <motion.span
          key={formattedTime}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-7xl font-bold font-mono tracking-tighter ${modeColors[mode as keyof typeof modeColors]}`}
        >
          {formattedTime}
        </motion.span>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">
          {mode === 'focus' ? 'Stay Focused' : 'Take a Break'}
        </p>
      </div>
    </div>
  );
};

export default TimerDisplay;
