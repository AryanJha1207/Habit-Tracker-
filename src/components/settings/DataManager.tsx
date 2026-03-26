import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';

interface DataManagerProps {
  onImport: (data: any) => void;
  onExport: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ onImport, onExport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImport(data);
      } catch (err) {
        alert('Invalid JSON file. Please upload a valid data export.');
      }
    };
    reader.readAsText(file);
  };

  const btnClass = "flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-gray-200 font-semibold text-sm transition-all duration-300 hover:bg-white/10 hover:scale-[1.02]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button onClick={onExport} className={btnClass}>
        <Download size={18} className="text-cyan-400" />
        <span>Export Data</span>
      </button>

      <div className="relative">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full ${btnClass}`}
        >
          <Upload size={18} className="text-purple-400" />
          <span>Import Data</span>
        </button>
      </div>
    </div>
  );
};

export default DataManager;
