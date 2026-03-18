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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        onClick={onExport}
        className="flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all font-bold text-gray-700"
      >
        <Download size={20} className="text-indigo-600" />
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
          className="w-full flex items-center justify-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all font-bold text-gray-700"
        >
          <Upload size={20} className="text-emerald-600" />
          <span>Import Data</span>
        </button>
      </div>
    </div>
  );
};

export default DataManager;
