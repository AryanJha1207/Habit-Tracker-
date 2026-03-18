import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-500" />,
    info: <Info size={20} className="text-indigo-500" />,
    error: <XCircle size={20} className="text-rose-500" />,
  };

  const colors = {
    success: 'bg-emerald-50 border-emerald-100',
    info: 'bg-indigo-50 border-indigo-100',
    error: 'bg-rose-50 border-rose-100',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
          className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl border shadow-lg ${colors[type]}`}
        >
          {icons[type]}
          <span className="text-sm font-bold text-gray-800">{message}</span>
          <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
