import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import ThemeSelector from '../components/settings/ThemeSelector';
import ToggleSwitch from '../components/settings/ToggleSwitch';
import DataManager from '../components/settings/DataManager';
import ConfirmModal from '../components/settings/ConfirmModal';
import Toast, { ToastType } from '../components/ui/Toast';
import { Palette, Database, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';

const Settings: React.FC = () => {
  const { minimalMode, setMinimalMode } = useSettings();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const handleExport = () => {
    const data = {
      tasks: JSON.parse(localStorage.getItem('habit-tracker-tasks') || '[]'),
      gamification: JSON.parse(localStorage.getItem('habit-tracker-gamification') || '{}'),
      pomodoro: {
        mode: localStorage.getItem('pomodoro-mode'),
        timeLeft: localStorage.getItem('pomodoro-time-left'),
        autoStart: localStorage.getItem('pomodoro-auto-start'),
        dailySessions: JSON.parse(localStorage.getItem('pomodoro-daily-sessions') || '{}'),
      },
      settings: {
        theme: localStorage.getItem('habit-tracker-theme'),
        minimalMode: localStorage.getItem('habit-tracker-minimal-mode'),
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported successfully');
  };

  const handleImport = (data: any) => {
    // Basic validation
    if (!data.tasks || !Array.isArray(data.tasks)) {
      showToast('Invalid backup file structure', 'error');
      return;
    }

    try {
      if (data.tasks) localStorage.setItem('habit-tracker-tasks', JSON.stringify(data.tasks));
      if (data.gamification) localStorage.setItem('habit-tracker-gamification', JSON.stringify(data.gamification));
      if (data.pomodoro) {
        if (data.pomodoro.mode) localStorage.setItem('pomodoro-mode', data.pomodoro.mode);
        if (data.pomodoro.timeLeft) localStorage.setItem('pomodoro-time-left', data.pomodoro.timeLeft);
        if (data.pomodoro.autoStart) localStorage.setItem('pomodoro-auto-start', data.pomodoro.autoStart);
        if (data.pomodoro.dailySessions) localStorage.setItem('pomodoro-daily-sessions', JSON.stringify(data.pomodoro.dailySessions));
      }
      if (data.settings) {
        if (data.settings.theme) localStorage.setItem('habit-tracker-theme', data.settings.theme);
        if (data.settings.minimalMode) localStorage.setItem('habit-tracker-minimal-mode', data.settings.minimalMode);
      }
      
      showToast('Data imported successfully. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      showToast('Error importing data', 'error');
    }
  };

  const handleReset = () => {
    localStorage.clear();
    showToast('All data has been reset. Refreshing...');
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Customize your experience and manage your data.</p>
      </header>

      {/* Appearance Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Palette size={20} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Theme</h3>
            <ThemeSelector />
          </div>
          
          <ToggleSwitch
            label="Minimal Mode"
            description="Reduce animations and simplify layouts for better focus."
            enabled={minimalMode}
            onChange={(enabled) => {
              setMinimalMode(enabled);
              showToast(`Minimal mode ${enabled ? 'enabled' : 'disabled'}`);
            }}
          />
        </div>
      </section>

      {/* Data Management Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <Database size={20} className="text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
        </div>
        
        <DataManager onExport={handleExport} onImport={handleImport} />
      </section>

      {/* Danger Zone Section */}
      <section className="space-y-6 pt-8 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <AlertTriangle size={20} className="text-rose-500" />
          <h2 className="text-xl font-bold text-rose-500">Danger Zone</h2>
        </div>
        
        <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-rose-900">Reset All Data</h3>
              <p className="text-sm text-rose-700 opacity-80">This will permanently delete all your tasks, streaks, and settings. This action cannot be undone.</p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
            >
              Reset Data
            </button>
          </div>
        </div>
      </section>

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Are you absolutely sure?"
        message="This will permanently delete all your data. We recommend exporting a backup first."
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
    </div>
  );
};

export default Settings;
