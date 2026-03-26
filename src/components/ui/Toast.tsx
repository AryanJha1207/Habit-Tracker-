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
    success: <CheckCircle2 size={18} className="text-cyan-400" />,
    info: <Info size={18} className="text-blue-400" />,
    error: <XCircle size={18} className="text-rose-400" />,
  };

  const colors = {
    success: 'border-cyan-400/20 bg-cyan-400/5',
    info: 'border-blue-400/20 bg-blue-400/5',
    error: 'border-rose-400/20 bg-rose-400/5',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
          className={`fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-xl ${colors[type]}`}
        >
          {icons[type]}
          <span className="text-sm font-semibold text-white">{message}</span>
          <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-300 transition-colors">
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
