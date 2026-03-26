import React from 'react';

interface ToggleSwitchProps {
  label: string;
  description?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, description, enabled, onChange }) => {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
      <div className="flex flex-col">
        <span className="font-semibold text-white text-sm">{label}</span>
        {description && <span className="text-xs text-gray-400 mt-0.5">{description}</span>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${
          enabled ? 'bg-purple-500' : 'bg-white/10'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

export default ToggleSwitch;
