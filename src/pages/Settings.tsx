import React, { useState } from 'react';
import { getTasks, saveTasks } from '../services/taskService';
import { getGamification, saveGamification } from '../services/gamificationService';
import { getPomodoroData, savePomodoroData } from '../services/pomodoroService';
import { getUserPreferences, saveUserPreferences } from '../services/userPreferencesService';
import { clearAllStorage } from '../services/storageHelper';
import { useAppContext } from '../context/AppContext';
import ThemeSelector from '../components/settings/ThemeSelector';
import ToggleSwitch from '../components/settings/ToggleSwitch';
import DataManager from '../components/settings/DataManager';
import ConfirmModal from '../components/settings/ConfirmModal';
import Toast, { ToastType } from '../components/ui/Toast';
import { Palette, Database, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';

const Settings: React.FC = () => {
  const { preferences, updatePreferences } = useAppContext();
  const minimalMode = preferences.minimalMode;
  const setMinimalMode = (enabled: boolean) => updatePreferences({ minimalMode: enabled });
  
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const handleExport = async () => {
    const data = {
      tasks: await getTasks(),
      gamification: getGamification(),
      pomodoro: getPomodoroData(),
      settings: getUserPreferences()
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

  const handleImport = async (data: any) => {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid backup file. Root must be an object.');
      }
      
      if (data.tasks && !Array.isArray(data.tasks)) {
        throw new Error('Tasks format is corrupted');
      }
      
      if (data.gamification && typeof data.gamification.totalPoints !== 'number') {
        throw new Error('Gamification format is corrupted');
      }
      
      if (data.pomodoro && typeof data.pomodoro.mode !== 'string') {
        throw new Error('Pomodoro format is corrupted');
      }
      
      if (data.settings && typeof data.settings.theme !== 'string') {
        throw new Error('Preferences format is corrupted');
      }

      if (data.tasks) await saveTasks(data.tasks);
      if (data.gamification) saveGamification(data.gamification);
      if (data.pomodoro) savePomodoroData(data.pomodoro);
      if (data.settings) saveUserPreferences(data.settings);
      
      showToast('Data imported successfully. Refreshing...');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      console.warn('Import failed:', err);
      showToast(err.message || 'Error importing data', 'error');
    }
  };

  const handleReset = () => {
    clearAllStorage();
    showToast('All data has been reset. Refreshing...');
    setTimeout(() => window.location.reload(), 1500);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-gray-400 mt-1">Customize your experience and manage your data.</p>
      </header>

      {/* Appearance Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Palette size={18} className="text-purple-400" />
          <h2 className="text-base font-semibold text-white">Appearance</h2>
        </div>
        
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <h3 className="font-semibold text-white text-sm mb-4">Theme</h3>
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
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <Database size={18} className="text-cyan-400" />
          <h2 className="text-base font-semibold text-white">Data Management</h2>
        </div>
        
        <DataManager onExport={handleExport} onImport={handleImport} />
      </section>

      {/* Danger Zone Section */}
      <section className="space-y-4 pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <AlertTriangle size={18} className="text-rose-400" />
          <h2 className="text-base font-semibold text-rose-400">Danger Zone</h2>
        </div>
        
        <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-rose-300">Reset All Data</h3>
              <p className="text-sm text-rose-400/70 mt-1">This will permanently delete all your tasks, streaks, and settings. This action cannot be undone.</p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-6 py-2.5 bg-rose-500/80 hover:bg-rose-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] shrink-0 text-sm"
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
