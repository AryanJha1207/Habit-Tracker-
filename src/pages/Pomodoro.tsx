import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PomodoroMode, PomodoroState, DailySessions } from '../types';
import ModeSelector from '../components/pomodoro/ModeSelector';
import TimerDisplay from '../components/pomodoro/TimerDisplay';
import TimerControls from '../components/pomodoro/TimerControls';
import { Coffee, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

const MODE_TIMES = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const Pomodoro: React.FC = () => {
  const { pomodoroData, updatePomodoroData } = useAppContext();
  const [mode, setMode] = useState<PomodoroMode>(pomodoroData.mode || 'focus');

  const [timeLeft, setTimeLeft] = useState(pomodoroData.timeLeft ?? MODE_TIMES[pomodoroData.mode || 'focus']);

  const [isRunning, setIsRunning] = useState(false);
  const [autoStart, setAutoStart] = useState(pomodoroData.autoStart || false);

  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    if (pomodoroData.dailySessions && pomodoroData.dailySessions.date === today) {
        return pomodoroData.dailySessions.sessionsCompleted;
    }
    return 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Persistence
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    updatePomodoroData({
      mode,
      timeLeft,
      autoStart,
      dailySessions: {
        date: today,
        sessionsCompleted
      }
    });
  }, [mode, timeLeft, autoStart, sessionsCompleted, updatePomodoroData]);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full flex flex-col items-center">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">Pomodoro Timer</h1>
          <p className="text-gray-400 mt-2">Stay focused and productive.</p>
        </header>

        {/* Timer Card */}
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 flex flex-col items-center w-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]">
          <ModeSelector currentMode={mode} onModeChange={changeMode} disabled={isRunning} />
          
          <TimerDisplay timeLeft={timeLeft} totalTime={MODE_TIMES[mode]} mode={mode} />
          
          <TimerControls isRunning={isRunning} onToggle={toggleTimer} onReset={resetTimer} />

          <div className="mt-10 flex items-center gap-8 text-sm font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-cyan-400" />
              <span>{sessionsCompleted} Sessions Today</span>
            </div>
            <button 
              onClick={() => setAutoStart(!autoStart)}
              className={`flex items-center gap-2 transition-all duration-300 ${autoStart ? 'text-purple-400' : 'hover:text-gray-300'}`}
            >
              <SettingsIcon size={18} />
              <span>Auto-start: {autoStart ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-6 w-full">
          <div className="rounded-2xl bg-gradient-to-r from-cyan-400/10 to-blue-500/10 backdrop-blur-xl border border-white/10 p-5 flex items-center gap-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">
            <div className="w-11 h-11 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-2xl flex items-center justify-center text-cyan-400 border border-white/10 shrink-0">
              <Coffee size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Pro Tip</h3>
              <p className="text-sm text-gray-400 mt-0.5">Take a short break every 25 minutes to keep your mind fresh and focused.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
