import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'default' | 'light' | 'dark';

interface SettingsContextType {
  theme: Theme;
  minimalMode: boolean;
  setTheme: (theme: Theme) => void;
  setMinimalMode: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('habit-tracker-theme');
    return (saved as Theme) || 'default';
  });

  const [minimalMode, setMinimalModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem('habit-tracker-minimal-mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('habit-tracker-theme', theme);
    // Apply theme to document
    document.documentElement.classList.remove('light', 'dark');
    if (theme !== 'default') {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('habit-tracker-minimal-mode', minimalMode.toString());
    if (minimalMode) {
      document.documentElement.classList.add('minimal-mode');
    } else {
      document.documentElement.classList.remove('minimal-mode');
    }
  }, [minimalMode]);

  const setTheme = (newTheme: Theme) => setThemeState(newTheme);
  const setMinimalMode = (enabled: boolean) => setMinimalModeState(enabled);

  return (
    <SettingsContext.Provider value={{ theme, minimalMode, setTheme, setMinimalMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
