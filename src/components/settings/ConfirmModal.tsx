import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="rounded-3xl bg-[#0b0f17] border border-white/10 shadow-2xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6 flex items-start gap-4">
              <div className="w-11 h-11 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
                    <X size={18} />
                  </button>
                </div>
                <p className="text-gray-400 leading-relaxed text-sm">{message}</p>
              </div>
            </div>
            <div className="bg-white/5 border-t border-white/5 p-5 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/10 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 text-white font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                Yes, Reset Data
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
