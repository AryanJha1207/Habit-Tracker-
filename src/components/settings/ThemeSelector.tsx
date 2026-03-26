import React from 'react';
import { useAppContext, Theme } from '../../context/AppContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { preferences, updatePreferences } = useAppContext();
  const theme = preferences.theme;
  const setTheme = (t: Theme) => updatePreferences({ theme: t });

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'default', label: 'Default', icon: <Monitor size={16} /> },
    { id: 'light', label: 'Light', icon: <Sun size={16} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={16} /> },
  ];

  return (
    <div className="flex gap-3">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-300 text-sm font-semibold ${
            theme === t.id
              ? 'border-purple-500/50 bg-purple-500/10 text-purple-300 shadow-[0_0_15px_rgba(139,92,246,0.15)]'
              : 'border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200'
          }`}
        >
          {t.icon}
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
