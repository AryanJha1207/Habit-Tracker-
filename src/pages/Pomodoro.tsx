import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroMode, PomodoroState, DailySessions } from '../types';
import ModeSelector from '../components/pomodoro/ModeSelector';
import TimerDisplay from '../components/pomodoro/TimerDisplay';
import TimerControls from '../components/pomodoro/TimerControls';
import { Coffee, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MODE_TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const Pomodoro: React.FC = () => {
  const [mode, setMode] = useState<PomodoroMode>(() => {
    const saved = localStorage.getItem('pomodoro-mode');
    return (saved as PomodoroMode) || 'focus';
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('pomodoro-time-left');
    return saved ? parseInt(saved, 10) : MODE_TIMES[mode];
  });

  const [isRunning, setIsRunning] = useState(false);
  const [autoStart, setAutoStart] = useState(() => {
    const saved = localStorage.getItem('pomodoro-auto-start');
    return saved === 'true';
  });

  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    const saved = localStorage.getItem('pomodoro-daily-sessions');
    const today = new Date().toISOString().split('T')[0];
    if (saved) {
      const data: DailySessions = JSON.parse(saved);
      return data.date === today ? data.sessionsCompleted : 0;
    }
    return 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('pomodoro-mode', mode);
    localStorage.setItem('pomodoro-time-left', timeLeft.toString());
    localStorage.setItem('pomodoro-auto-start', autoStart.toString());
    
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('pomodoro-daily-sessions', JSON.stringify({
      date: today,
      sessionsCompleted
    }));
  }, [mode, timeLeft, autoStart, sessionsCompleted]);

  const playNotification = useCallback(() => {
    // Soft beep using Web Audio API
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 1);

    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: mode === 'focus' ? 'Focus session complete! Take a break.' : 'Break over! Time to focus.',
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, [mode]);

  const handleSessionComplete = useCallback(() => {
    setIsRunning(false);
    playNotification();

    if (mode === 'focus') {
      setSessionsCompleted(prev => prev + 1);
      const nextMode = (sessionsCompleted + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      setTimeLeft(MODE_TIMES[nextMode]);
    } else {
      setMode('focus');
      setTimeLeft(MODE_TIMES.focus);
    }

    if (autoStart) {
      setTimeout(() => setIsRunning(true), 1000);
    }
  }, [mode, sessionsCompleted, autoStart, playNotification]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, handleSessionComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const changeMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full flex flex-col items-center">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">Pomodoro Timer</h1>
          <p className="text-gray-500 mt-2">Stay focused and productive.</p>
        </header>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center w-full">
          <ModeSelector currentMode={mode} onModeChange={changeMode} disabled={isRunning} />
          
          <TimerDisplay timeLeft={timeLeft} totalTime={MODE_TIMES[mode]} mode={mode} />
          
          <TimerControls isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />

          <div className="mt-10 flex items-center gap-8 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-indigo-500" />
              <span>{sessionsCompleted} Sessions Today</span>
            </div>
            <button 
              onClick={() => setAutoStart(!autoStart)}
              className={`flex items-center gap-2 transition-colors ${autoStart ? 'text-indigo-600' : 'hover:text-gray-600'}`}
            >
              <SettingsIcon size={18} />
              <span>Auto-start: {autoStart ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 w-full">
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Coffee size={24} />
            </div>
            <div>
              <h3 className="font-bold text-indigo-900">Pro Tip</h3>
              <p className="text-sm text-indigo-700 opacity-80">Take a short break every 25 minutes to keep your mind fresh and focused.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
