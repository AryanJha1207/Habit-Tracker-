import React from 'react';
import { useSettings, Theme } from '../../context/SettingsContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useSettings();

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: 'default', label: 'Default', icon: <Monitor size={18} /> },
    { id: 'light', label: 'Light', icon: <Sun size={18} /> },
    { id: 'dark', label: 'Dark', icon: <Moon size={18} /> },
  ];

  return (
    <div className="flex gap-3">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
            theme === t.id
              ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
          }`}
        >
          {t.icon}
          <span className="font-semibold text-sm">{t.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ThemeSelector;
