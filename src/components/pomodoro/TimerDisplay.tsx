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
    focus: 'text-purple-400',
    shortBreak: 'text-cyan-400',
    longBreak: 'text-blue-400',
  };

  const modeStrokeColors = {
    focus: 'stroke-purple-500',
    shortBreak: 'stroke-cyan-400',
    longBreak: 'stroke-blue-400',
  };

  return (
    <div className="relative flex items-center justify-center w-72 h-72 mb-8">
      {/* SVG Ring */}
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 300 300">
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="6"
          className="text-white/5"
        />
        <motion.circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'linear' }}
          className={`${modeStrokeColors[mode as keyof typeof modeStrokeColors]} rounded-full`}
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
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-2">
          {mode === 'focus' ? 'Stay Focused' : 'Take a Break'}
        </p>
      </div>
    </div>
  );
};

export default TimerDisplay;
